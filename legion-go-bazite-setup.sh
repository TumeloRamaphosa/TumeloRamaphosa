#!/bin/bash
# STUDEX Legion Go (Bazite) Agent Runtime Setup
# Deploys Hermes + supporting agents as portable distributed node
# Target: Lenovo Legion Go with Bazite OS

set -e

echo "🎮 STUDEX Legion Go Bazite Setup"
echo "=================================="

# 1. SYSTEM UPDATES & DEPENDENCIES
echo "📦 Installing system dependencies..."
sudo dnf update -y
sudo dnf install -y \
  nodejs npm \
  python3 python3-pip \
  git curl wget \
  libssl-devel libffi-devel \
  build-essential gcc g++ make \
  docker docker-compose \
  systemd-devel

# 2. USER SETUP FOR DOCKER
echo "🔐 Configuring Docker permissions..."
sudo usermod -aG docker $USER
sudo systemctl start docker
sudo systemctl enable docker

# 3. NODE.JS VERIFICATION
echo "✅ Verifying Node.js..."
node --version
npm --version

# 4. PYTHON SETUP
echo "🐍 Setting up Python environment..."
python3 -m pip install --upgrade pip
python3 -m pip install virtualenv

# 5. CREATE AGENT WORKSPACE
echo "📁 Creating agent workspace..."
mkdir -p ~/studex-agents
cd ~/studex-agents

# 6. HERMES AGENT SETUP
echo "🚀 Deploying Hermes Agent..."
cat > hermes-agent.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Hermes: Sales & Negotiation Agent
const hermes = {
  name: 'Hermes',
  role: 'Sales & Negotiation',
  capabilities: ['price_analysis', 'deal_viability', 'market_monitoring'],
  status: 'active',
  mesh_node: process.env.MESH_IP || 'hermes.studex.local'
};

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ agent: hermes.name, status: hermes.status, uptime: process.uptime() });
});

// Agent info
app.get('/agent', (req, res) => {
  res.json(hermes);
});

// Market monitoring endpoint
app.post('/monitor', (req, res) => {
  const { commodity, market } = req.body;
  // TODO: Integrate JEV reasoning + browser automation
  res.json({
    agent: 'Hermes',
    commodity,
    market,
    status: 'monitoring',
    timestamp: new Date().toISOString()
  });
});

// Deal submission
app.post('/execute', (req, res) => {
  const { deal_type, parameters } = req.body;
  // TODO: Execute autonomous deal flow
  res.json({
    agent: 'Hermes',
    action: deal_type,
    status: 'pending_compliance',
    deal_id: `HRM-${Date.now()}`
  });
});

app.listen(PORT, () => {
  console.log(`Hermes running on port ${PORT} (${hermes.mesh_node})`);
});
EOF

# 7. ADDITIONAL AGENTS (CHRONOS, OPENLAW, DENCHCLAW)
echo "⚙️  Creating supporting agents..."
cat > chronos-agent.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

const chronos = {
  name: 'Chronos',
  role: 'Strategy & Market Analysis',
  capabilities: ['market_analysis', 'trend_detection', 'opportunity_scoring'],
  status: 'active'
};

app.get('/health', (req, res) => {
  res.json({ agent: chronos.name, status: chronos.status, uptime: process.uptime() });
});

app.get('/agent', (req, res) => {
  res.json(chronos);
});

app.post('/analyze', (req, res) => {
  const { market_data } = req.body;
  res.json({
    agent: 'Chronos',
    analysis: 'pending',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Chronos running on port ${PORT}`);
});
EOF

cat > denchclaw-agent.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

const denchclaw = {
  name: 'DenchClaw',
  role: 'Communications & CRM',
  capabilities: ['email_sync', 'crm_integration', 'partner_comms'],
  status: 'active'
};

app.get('/health', (req, res) => {
  res.json({ agent: denchclaw.name, status: denchclaw.status, uptime: process.uptime() });
});

app.get('/agent', (req, res) => {
  res.json(denchclaw);
});

app.listen(PORT, () => {
  console.log(`DenchClaw running on port ${PORT}`);
});
EOF

# 8. PACKAGE.JSON
echo "📝 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "studex-legion-go-agents",
  "version": "1.0.0",
  "description": "STUDEX portable agent runtime for Legion Go (Bazite)",
  "main": "hermes-agent.js",
  "scripts": {
    "start": "node hermes-agent.js",
    "start:all": "concurrently \"node hermes-agent.js\" \"node chronos-agent.js\" \"node denchclaw-agent.js\"",
    "dev": "nodemon --watch . hermes-agent.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "axios": "^1.6.2",
    "body-parser": "^1.20.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "concurrently": "^8.2.2"
  }
}
EOF

npm install

# 9. NETBIRD MESH SETUP
echo "🌐 Installing NetBird for mesh networking..."
curl -L https://pkgs.netbird.io/install.sh | sudo bash
sudo dnf install -y netbird

echo "NetBird installed. Next: sudo netbird up (will show setup URL)"

# 10. ENV CONFIGURATION
echo "⚙️  Creating .env configuration..."
cat > .env << 'EOF'
# STUDEX Agent Runtime (Legion Go)
NODE_ENV=production
PORT=3001

# Mesh networking
MESH_IP=hermes.studex.local
MESH_ENABLED=true

# Agent mail integration
AGENTMAIL_API_KEY=${AGENTMAIL_API_KEY}
AGENTMAIL_ORG=${AGENTMAIL_ORG}

# Ollama/local LLM
OLLAMA_HOST=http://localhost:11434
LLM_MODEL=mistral:7b

# Supabase
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_KEY=${SUPABASE_KEY}

# CloudFlare Tunnel (optional)
CLOUDFLARE_TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
EOF

# 11. SYSTEMD SERVICE (AUTO-START ON BOOT)
echo "🔧 Creating systemd services..."
cat > /tmp/studex-hermes.service << 'EOF'
[Unit]
Description=STUDEX Hermes Agent
After=network.target netbird.service
Requires=netbird.service

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/studex-agents
EnvironmentFile=/home/$USER/studex-agents/.env
ExecStart=/usr/bin/node /home/$USER/studex-agents/hermes-agent.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo cp /tmp/studex-hermes.service /etc/systemd/system/studex-hermes.service
sudo systemctl daemon-reload
sudo systemctl enable studex-hermes.service

# 12. OPTIONAL: OLLAMA LIGHTWEIGHT LLM
echo "🤖 Installing Ollama (optional - for local inference)..."
if command -v ollama &> /dev/null; then
  echo "Ollama already installed"
else
  curl -fsSL https://ollama.ai/install.sh | sh
  # Pull lightweight Mistral 7B
  ollama pull mistral:7b &
fi

# 13. DOCKER COMPOSE (OPTIONAL - FOR ISOLATED AGENT CONTAINERS)
echo "🐳 Creating Docker Compose config..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  hermes:
    build: .
    container_name: hermes-agent
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MESH_IP=hermes.studex.local
    restart: always
    networks:
      - studex-mesh

  chronos:
    build: .
    container_name: chronos-agent
    ports:
      - "3002:3002"
    restart: always
    networks:
      - studex-mesh

  ollama:
    image: ollama/ollama:latest
    container_name: ollama-inference
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: always
    networks:
      - studex-mesh

networks:
  studex-mesh:
    driver: bridge

volumes:
  ollama_data:
EOF

# 14. NETBIRD SETUP INSTRUCTIONS
echo "════════════════════════════════════════════"
echo "✅ SETUP COMPLETE!"
echo "════════════════════════════════════════════"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1️⃣  NETBIRD MESH SETUP (Connect to your distributed hub):"
echo "   sudo netbird up"
echo "   [Follow the link to authorize this device]"
echo ""
echo "2️⃣  SET ENVIRONMENT VARIABLES:"
echo "   export AGENTMAIL_API_KEY=<your-key>"
echo "   export SUPABASE_URL=<your-url>"
echo "   export SUPABASE_KEY=<your-key>"
echo ""
echo "3️⃣  START HERMES AGENT:"
echo "   npm start"
echo "   OR (auto-start on boot):"
echo "   sudo systemctl start studex-hermes"
echo ""
echo "4️⃣  RUN ALL AGENTS (Hermes + Chronos + DenchClaw):"
echo "   npm run start:all"
echo ""
echo "5️⃣  START WITH DOCKER (ISOLATED):"
echo "   docker-compose up -d"
echo ""
echo "6️⃣  TEST AGENT HEALTH:"
echo "   curl http://localhost:3001/health"
echo ""
echo "7️⃣  MONITOR LOGS:"
echo "   sudo journalctl -u studex-hermes -f"
echo ""
echo "════════════════════════════════════════════"
echo "📱 Your Legion Go is now a STUDEX agent node!"
echo "════════════════════════════════════════════"
