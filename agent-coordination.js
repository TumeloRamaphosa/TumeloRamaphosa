/**
 * AGENT COORDINATION HUB
 * Central service tracking all agent statuses, tasks, and activities
 * Real-time WebSocket updates to dashboard
 * Memory + Supabase persistence
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ============================================================
// SUPABASE SETUP
// ============================================================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ============================================================
// IN-MEMORY STATE
// ============================================================

class AgentHub {
  constructor() {
    this.agents = new Map(); // agent_id -> { id, name, status, current_task, progress, busy_until, last_activity, stats }
    this.activities = new Map(); // agent_id -> [{ timestamp, type, data }]
    this.clients = []; // WebSocket connections
  }

  registerAgent(agentId, agentData) {
    this.agents.set(agentId, {
      id: agentId,
      name: agentData.name || agentId,
      status: 'online',
      current_task: null,
      progress: 0,
      busy_until: null,
      last_activity: new Date().toISOString(),
      stats: {
        tasks_completed: 0,
        deals_closed: 0,
        emails_sent: 0,
        total_revenue: 0
      }
    });
    this.activities.set(agentId, []);
  }

  updateAgentStatus(agentId, statusData) {
    if (!this.agents.has(agentId)) {
      this.registerAgent(agentId, { name: statusData.agent_name });
    }

    const agent = this.agents.get(agentId);
    agent.status = statusData.status || 'online';
    agent.current_task = statusData.current_task;
    agent.progress = statusData.progress || 0;
    agent.busy_until = statusData.busy_until;
    agent.last_activity = new Date().toISOString();

    // Track activity
    const activity = {
      timestamp: agent.last_activity,
      type: statusData.activity_type || 'status_update',
      data: {
        task: statusData.current_task,
        progress: statusData.progress,
        ...(statusData.deal_value && { deal_value: statusData.deal_value }),
        ...(statusData.email_sent && { email_sent: statusData.email_sent })
      }
    };

    let activities = this.activities.get(agentId) || [];
    activities.push(activity);
    if (activities.length > 100) activities = activities.slice(-100); // Keep last 100
    this.activities.set(agentId, activities);

    // Update stats
    if (statusData.task_completed) agent.stats.tasks_completed++;
    if (statusData.deal_closed) {
      agent.stats.deals_closed++;
      agent.stats.total_revenue += statusData.deal_value || 0;
    }
    if (statusData.email_sent) agent.stats.emails_sent++;

    return agent;
  }

  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  getAllAgents() {
    return Array.from(this.agents.values());
  }

  getBusyAgents() {
    return this.getAllAgents().filter(agent => {
      if (!agent.busy_until) return false;
      return new Date(agent.busy_until) > new Date();
    });
  }

  getAgentActivities(agentId) {
    return this.activities.get(agentId) || [];
  }

  broadcast(message) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  addClient(client) {
    this.clients.push(client);
  }

  removeClient(client) {
    const idx = this.clients.indexOf(client);
    if (idx > -1) this.clients.splice(idx, 1);
  }
}

// ============================================================
// EXPRESS + WEBSOCKET SERVER
// ============================================================

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const hub = new AgentHub();

app.use(express.json());

// ============================================================
// REST ENDPOINTS
// ============================================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'Agent Coordination Hub',
    status: 'online',
    agents_online: hub.getAllAgents().length,
    agents_busy: hub.getBusyAgents().length,
    websocket_clients: hub.clients.length
  });
});

// Get all agents
app.get('/agents', (req, res) => {
  const agents = hub.getAllAgents().map(agent => ({
    ...agent,
    is_busy: agent.busy_until ? new Date(agent.busy_until) > new Date() : false,
    activities_count: hub.getAgentActivities(agent.id).length
  }));

  res.json({ agents, count: agents.length });
});

// Get specific agent + activities
app.get('/agents/:id', (req, res) => {
  const agent = hub.getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  const activities = hub.getAgentActivities(req.params.id);
  res.json({
    agent: {
      ...agent,
      is_busy: agent.busy_until ? new Date(agent.busy_until) > new Date() : false
    },
    activities,
    activity_count: activities.length
  });
});

// Get busy agents only
app.get('/busy-agents', (req, res) => {
  const busy = hub.getBusyAgents();
  res.json({ agents: busy, count: busy.length });
});

// Agent status POST (heartbeat)
app.post('/agent-status', async (req, res) => {
  const {
    agent_id,
    agent_name,
    status,
    current_task,
    progress,
    busy_until,
    activity_type,
    task_completed,
    deal_closed,
    deal_value,
    email_sent
  } = req.body;

  if (!agent_id) return res.status(400).json({ error: 'agent_id required' });

  try {
    // Update in-memory state
    const agent = hub.updateAgentStatus(agent_id, {
      agent_name,
      status,
      current_task,
      progress,
      busy_until,
      activity_type,
      task_completed,
      deal_closed,
      deal_value,
      email_sent
    });

    // Persist to Supabase
    await supabase
      .from('agent_status')
      .upsert({
        agent_id,
        status: agent.status,
        current_task: agent.current_task,
        progress: agent.progress,
        busy_until: agent.busy_until,
        last_activity: agent.last_activity,
        stats: agent.stats,
        updated_at: new Date().toISOString()
      });

    // Broadcast to all WebSocket clients
    hub.broadcast({
      type: 'agent_updated',
      agent: {
        ...agent,
        is_busy: agent.busy_until ? new Date(agent.busy_until) > new Date() : false
      },
      timestamp: new Date().toISOString()
    });

    res.json({
      status: 'updated',
      agent: {
        ...agent,
        is_busy: agent.busy_until ? new Date(agent.busy_until) > new Date() : false
      }
    });
  } catch (err) {
    console.error('Status update error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get agent statistics
app.get('/stats/summary', (req, res) => {
  const agents = hub.getAllAgents();
  const summary = {
    total_agents: agents.length,
    agents_online: agents.filter(a => a.status === 'online').length,
    agents_busy: hub.getBusyAgents().length,
    total_tasks_completed: agents.reduce((sum, a) => sum + a.stats.tasks_completed, 0),
    total_deals: agents.reduce((sum, a) => sum + a.stats.deals_closed, 0),
    total_emails: agents.reduce((sum, a) => sum + a.stats.emails_sent, 0),
    total_revenue: agents.reduce((sum, a) => sum + a.stats.total_revenue, 0)
  };

  res.json(summary);
});

// ============================================================
// WEBSOCKET REAL-TIME UPDATES
// ============================================================

wss.on('connection', (ws) => {
  console.log('🔌 Dashboard client connected');
  hub.addClient(ws);

  // Send current state on connect
  ws.send(JSON.stringify({
    type: 'initial_state',
    agents: hub.getAllAgents(),
    busy_agents: hub.getBusyAgents(),
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // Handle client requests
      if (data.type === 'get_agents') {
        ws.send(JSON.stringify({
          type: 'agents',
          agents: hub.getAllAgents(),
          timestamp: new Date().toISOString()
        }));
      } else if (data.type === 'get_busy') {
        ws.send(JSON.stringify({
          type: 'busy_agents',
          agents: hub.getBusyAgents(),
          timestamp: new Date().toISOString()
        }));
      } else if (data.type === 'get_agent_activities') {
        const activities = hub.getAgentActivities(data.agent_id);
        ws.send(JSON.stringify({
          type: 'agent_activities',
          agent_id: data.agent_id,
          activities,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('WebSocket message error:', err.message);
    }
  });

  ws.on('close', () => {
    console.log('🔌 Dashboard client disconnected');
    hub.removeClient(ws);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });
});

// ============================================================
// STARTUP
// ============================================================

const PORT = process.env.COORDINATION_PORT || 3010;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           AGENT COORDINATION HUB                           ║
║           🌐 Real-time agent status + WebSocket             ║
║                                                            ║
║  Running on http://localhost:${PORT}                            ║
║                                                            ║
║  REST Endpoints:                                           ║
║  GET  /agents                (all agents)                 ║
║  GET  /agents/:id            (agent + activities)         ║
║  GET  /busy-agents           (agents currently working)   ║
║  POST /agent-status          (agent heartbeat)            ║
║  GET  /stats/summary         (totals)                     ║
║                                                            ║
║  WebSocket: ws://localhost:${PORT}                              ║
║  → Real-time agent updates                                ║
║  → Dashboard sync                                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = {
  AgentHub,
  app,
  server,
  wss
};
