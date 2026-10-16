# Legion Go Bazite Agent Runtime Setup

**Turn your Lenovo Legion Go into a portable STUDEX agent node.**

## Quick Start (5 minutes)

```bash
# Run the automated setup script
bash legion-go-bazite-setup.sh

# Configure Mesh Networking
sudo netbird up
# Follow the link to authorize

# Start Hermes Agent
npm start

# OR start all agents (Hermes + Chronos + DenchClaw)
npm run start:all
```

## What Gets Installed

| Component | Purpose | Port |
|-----------|---------|------|
| **Hermes** | Sales & Negotiation Agent | 3001 |
| **Chronos** | Strategy & Market Analysis | 3002 |
| **DenchClaw** | Communications & CRM | 3003 |
| **Ollama** | Local LLM Inference (Mistral 7B) | 11434 |
| **NetBird** | Mesh Networking | VPN |

## Architecture

```
Legion Go (Bazite)
├── Node.js Runtime (Hermes + agents)
├── Ollama (local models)
├── NetBird (mesh connection)
└── CloudFlare Tunnel (optional external access)

Connected to:
├── MacBook (Ollama + local inference)
├── Mac mini (agent coordination)
└── Windows PC (Paperclip AI)
```

## Key Features

✅ **Portable AI Infrastructure** - Run on handheld
✅ **Mesh Network Integration** - Auto-discovers other STUDEX nodes
✅ **Autonomous Agent Team** - Hermes, Chronos, OpenClaw, DenchClaw
✅ **Real-time Decision Making** - Sub-3s response times
✅ **Market Monitoring** - 20+ commodity sites
✅ **Auto-start on Boot** - Systemd service ready

## Environment Variables

Create `.env` in `~/studex-agents/`:

```bash
NODE_ENV=production
MESH_IP=hermes.studex.local
AGENTMAIL_API_KEY=<your-key>
SUPABASE_URL=<your-url>
SUPABASE_KEY=<your-key>
OLLAMA_HOST=http://localhost:11434
```

## Test Your Setup

```bash
# Health check
curl http://localhost:3001/health

# Agent info
curl http://localhost:3001/agent

# Monitor market data (Chronos)
curl -X POST http://localhost:3002/analyze \
  -H "Content-Type: application/json" \
  -d '{"market_data": "cocoa ICE"}'

# Monitor logs (auto-start service)
sudo journalctl -u studex-hermes -f
```

## Mesh Network Status

```bash
# Check NetBird connection
sudo netbird status

# See all connected nodes
sudo netbird routes list
```

## Performance Targets

- **Hermes** (Sales): <3s response
- **Chronos** (Strategy): <5s response
- **OpenClaw** (Ops): <5s response
- **DenchClaw** (Comms): <3s response

## Troubleshooting

### Hermes won't start
```bash
# Check if port 3001 is in use
sudo lsof -i :3001

# Kill process and retry
sudo fuser -k 3001/tcp
npm start
```

### NetBird connection issues
```bash
# Force reconnect
sudo systemctl restart netbird

# Check status
sudo netbird status
```

### Ollama not responding
```bash
# Pull model
ollama pull mistral:7b

# Test inference
curl -X POST http://localhost:11434/api/generate \
  -d '{"model":"mistral:7b","prompt":"Hello"}'
```

## Gaming Agent Interface

Open `gaming-agent-interface.html` in your browser to see real-time agent collaboration:
- 4 agents working in parallel
- Decision flow visualization
- Live market feeds
- Performance metrics

## Next Steps

1. ✅ Run setup script
2. ✅ Authorize NetBird
3. ✅ Start agents with `npm start`
4. ✅ Open gaming interface in browser
5. ✅ Watch agents collaborate on deals in real-time
6. 🎮 Integrate into STUDEX qualification portal

---

**Legion Go is now part of the STUDEX Operating System!** 🎮⚡
