/**
 * AGENT CONNECTOR SERVICE (Port 3100)
 * Local agents (MacBook, Mac mini, Windows, Legion Go) connect here
 * Bridges to Tailscale + Phone access
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const os = require('os');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// ============================================================
// CONNECTED AGENTS REGISTRY
// ============================================================

const connectedAgents = new Map();
const phoneClients = new Set();

class AgentRegistry {
  static add(agentId, ws, metadata) {
    connectedAgents.set(agentId, {
      ws,
      metadata,
      connectedAt: new Date(),
      lastHeartbeat: new Date(),
      status: 'connected',
      currentTask: null,
      machineInfo: {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch()
      }
    });
    console.log(`✅ Agent connected: ${agentId} from ${metadata.location}`);
    this.broadcastToPhones({ type: 'agent_connected', agentId, metadata });
  }

  static remove(agentId) {
    connectedAgents.delete(agentId);
    console.log(`❌ Agent disconnected: ${agentId}`);
    this.broadcastToPhones({ type: 'agent_disconnected', agentId });
  }

  static update(agentId, data) {
    const agent = connectedAgents.get(agentId);
    if (agent) {
      agent.currentTask = data.task;
      agent.lastHeartbeat = new Date();
      agent.status = data.status || 'active';
      this.broadcastToPhones({
        type: 'agent_updated',
        agentId,
        task: data.task,
        status: agent.status
      });
    }
  }

  static broadcastToPhones(message) {
    phoneClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  static getAll() {
    const agents = [];
    connectedAgents.forEach((agent, id) => {
      agents.push({
        id,
        status: agent.status,
        currentTask: agent.currentTask,
        connectedAt: agent.connectedAt,
        lastHeartbeat: agent.lastHeartbeat,
        machineInfo: agent.machineInfo
      });
    });
    return agents;
  }
}

// ============================================================
// WEBSOCKET: AGENT CONNECTIONS (Local Machines)
// ============================================================

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  let agentId = null;
  let isPhoneClient = false;

  // First message should identify the client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // Registration: Agent from local machine
      if (data.type === 'agent_register') {
        agentId = data.agent_id;
        AgentRegistry.add(agentId, ws, {
          location: clientIp,
          deviceType: data.device_type || 'unknown',
          capabilities: data.capabilities || []
        });
      }

      // Registration: Phone client
      if (data.type === 'phone_client_register') {
        isPhoneClient = true;
        phoneClients.add(ws);
        ws.send(JSON.stringify({
          type: 'phone_registered',
          agents: AgentRegistry.getAll()
        }));
        console.log(`📱 Phone client connected from ${clientIp}`);
      }

      // Agent heartbeat + task update
      if (data.type === 'agent_heartbeat' && agentId) {
        AgentRegistry.update(agentId, {
          task: data.current_task,
          status: data.status
        });
      }

      // Send command from phone to agent
      if (data.type === 'send_to_agent') {
        const targetAgent = connectedAgents.get(data.target_agent_id);
        if (targetAgent && targetAgent.ws.readyState === WebSocket.OPEN) {
          targetAgent.ws.send(JSON.stringify({
            type: 'command',
            payload: data.payload
          }));
        }
      }

      // Phone requests all agents
      if (data.type === 'get_agents' && isPhoneClient) {
        ws.send(JSON.stringify({
          type: 'agents_list',
          agents: AgentRegistry.getAll()
        }));
      }
    } catch (err) {
      console.error('WebSocket message error:', err.message);
    }
  });

  ws.on('close', () => {
    if (agentId) {
      AgentRegistry.remove(agentId);
    }
    if (isPhoneClient) {
      phoneClients.delete(ws);
      console.log('📱 Phone client disconnected');
    }
  });
});

// ============================================================
// REST API: Phone + Dashboard
// ============================================================

// Get all connected agents
app.get('/agents', (req, res) => {
  res.json({
    agents: AgentRegistry.getAll(),
    count: connectedAgents.size,
    timestamp: new Date().toISOString()
  });
});

// Get specific agent
app.get('/agents/:id', (req, res) => {
  const agent = connectedAgents.get(req.params.id);
  if (agent) {
    res.json({
      id: req.params.id,
      status: agent.status,
      currentTask: agent.currentTask,
      connectedAt: agent.connectedAt,
      lastHeartbeat: agent.lastHeartbeat,
      machineInfo: agent.machineInfo
    });
  } else {
    res.status(404).json({ error: 'Agent not found' });
  }
});

// Send command to agent (from phone)
app.post('/agents/:id/command', (req, res) => {
  const agent = connectedAgents.get(req.params.id);
  if (!agent || agent.ws.readyState !== WebSocket.OPEN) {
    return res.status(404).json({ error: 'Agent not reachable' });
  }

  agent.ws.send(JSON.stringify({
    type: 'command',
    payload: req.body.command
  }));

  res.json({ status: 'command_sent', agentId: req.params.id });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'agent-connector',
    status: 'active',
    agentsConnected: connectedAgents.size,
    phoneClientsConnected: phoneClients.size,
    tailscaleReady: !!process.env.TAILSCALE_IP,
    uptime: process.uptime()
  });
});

// ============================================================
// TAILSCALE BRIDGE INFO
// ============================================================

app.get('/tailscale-info', (req, res) => {
  const tailscaleIp = process.env.TAILSCALE_IP || 'Not configured';
  const machineHostname = os.hostname();

  res.json({
    service: 'Agent Connector (Port 3100)',
    local_address: `http://localhost:3100`,
    tailscale_address: `http://${machineHostname}:3100`,
    tailscale_ip: tailscaleIp,
    instructions: {
      local_agents: 'WebSocket ws://localhost:3100 (from same machine)',
      remote_agents: `WebSocket ws://${machineHostname}:3100 (from Tailscale network)`,
      phone_app: `HTTP http://${machineHostname}:3100 (via Tailscale on phone)`,
      rest_api: `http://${machineHostname}:3100/agents (agent list)`
    }
  });
});

// ============================================================
// PHONE-FRIENDLY DASHBOARD
// ============================================================

app.get('/phone', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>STUDEX Agents - Phone Control</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0e27;
      color: #fff;
      padding: 16px;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    h1 { font-size: 24px; margin-bottom: 8px; }
    .status { font-size: 12px; opacity: 0.6; }
    .agents-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .agent-card {
      background: #1a1f3a;
      border: 1px solid #2a3f5f;
      border-radius: 12px;
      padding: 16px;
      position: relative;
    }
    .agent-card.online { border-left: 4px solid #00ff88; }
    .agent-card.busy { border-left: 4px solid #ffaa00; }
    .agent-card.offline { border-left: 4px solid #ff3333; opacity: 0.6; }

    .agent-name { font-weight: 600; font-size: 16px; }
    .agent-task { font-size: 12px; opacity: 0.7; margin-top: 8px; }
    .agent-status { font-size: 11px; margin-top: 4px; opacity: 0.5; }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: #2a3f5f;
      border-radius: 2px;
      margin-top: 8px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ff88, #00ccaa);
      width: 0%;
      transition: width 0.3s ease;
    }

    .connection-info {
      background: #1a1f3a;
      border: 1px solid #2a3f5f;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 16px;
      font-size: 12px;
    }
    .connection-info strong { opacity: 0.8; }
    .connection-info .success { color: #00ff88; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎙️ STUDEX Agents</h1>
    <div class="status" id="connection-status">Connecting...</div>
  </div>

  <div class="connection-info">
    <strong>Connected via Tailscale</strong><br>
    <span id="tailscale-info">Loading...</span>
  </div>

  <div class="agents-grid" id="agents-container">
    <div style="text-align: center; opacity: 0.5;">Loading agents...</div>
  </div>

  <script>
    let ws = null;

    function connectWebSocket() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;

      ws = new WebSocket(\`\${protocol}//\${host}\`);

      ws.onopen = () => {
        document.getElementById('connection-status').innerHTML =
          '<span class="success">✓ Connected</span>';
        ws.send(JSON.stringify({ type: 'phone_client_register' }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'agents_list' || data.type === 'phone_registered') {
          renderAgents(data.agents);
        }
        if (data.type === 'agent_connected' || data.type === 'agent_disconnected' || data.type === 'agent_updated') {
          fetchAgents();
        }
      };

      ws.onerror = () => {
        document.getElementById('connection-status').innerHTML = 'Connection error';
      };

      ws.onclose = () => {
        document.getElementById('connection-status').innerHTML = 'Reconnecting...';
        setTimeout(connectWebSocket, 3000);
      };
    }

    async function fetchAgents() {
      try {
        const res = await fetch('/agents');
        const data = await res.json();
        renderAgents(data.agents);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    function renderAgents(agents) {
      const container = document.getElementById('agents-container');
      if (!agents || agents.length === 0) {
        container.innerHTML = '<div style="text-align: center; opacity: 0.5;">No agents connected</div>';
        return;
      }

      container.innerHTML = agents.map(agent => \`
        <div class="agent-card \${agent.status}">
          <div class="agent-name">\${agent.id}</div>
          <div class="agent-task">\${agent.currentTask || 'Idle'}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 45%;"></div>
          </div>
          <div class="agent-status">
            Last seen: \${new Date(agent.lastHeartbeat).toLocaleTimeString()}
          </div>
        </div>
      \`).join('');
    }

    async function loadTailscaleInfo() {
      try {
        const res = await fetch('/tailscale-info');
        const data = await res.json();
        document.getElementById('tailscale-info').innerHTML =
          \`Service ready at: <strong>\${data.tailscale_address}</strong>\`;
      } catch (err) {
        console.error('Error:', err);
      }
    }

    // Start
    connectWebSocket();
    loadTailscaleInfo();
    fetchAgents();
    setInterval(fetchAgents, 5000);
  </script>
</body>
</html>
  `);
});

// ============================================================
// STARTUP
// ============================================================

const PORT = process.env.PORT || 3100;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     🌐 AGENT CONNECTOR SERVICE - PORT 3100                ║
║                                                            ║
║     Local agents connect here:                            ║
║     → MacBook, Mac mini, Windows, Legion Go               ║
║                                                            ║
║     Bridges to:                                           ║
║     → Tailscale (mesh network)                            ║
║     → Phone control dashboard                            ║
║                                                            ║
║     Access from phone:                                    ║
║     http://<machine-name>:3100/phone                      ║
║                                                            ║
║     REST API:                                             ║
║     GET  http://localhost:3100/agents                     ║
║     POST http://localhost:3100/agents/:id/command         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = {
  AgentRegistry,
  connectedAgents
};
