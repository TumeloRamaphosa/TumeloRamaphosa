# StudEx Agent Platform - Infrastructure Setup Guide

## Overview

This document outlines the complete infrastructure setup for the StudEx distributed agent platform, which runs as a web application capable of orchestrating AI agents across multiple virtual machines with offline-first operation using local models.

## Architecture

The platform consists of:

1. **Core Priority System** - Eisenhower Matrix task prioritization and daily routine generation
2. **Local Model Support** - Offline-capable AI using Ollama, Blotato, and Spala backends
3. **Email Integration** - Gmail, Agent Mail, and Notion-based email automation
4. **Distributed VM Orchestration** - Orgo.ai-style VNC remote access and Tailscale networking
5. **Settings & Monitoring** - Centralized system configuration and status dashboard

---

## 1. Local Model Configuration

### Supported Models

**Ultra-Lightweight (Mobile/Airplane Mode):**
- **Gemma3-1B-IT** (584MB) - Ideal for iPhone/iPad offline use

**Balanced (Laptop/Development):**
- **Qwen2.5** (1.6GB) - Fast inference, high accuracy
- **DeepSeek-R1** (1.8GB) - Reasoning capabilities
- **Llama 3.1 (8B)** (4.7GB) - General purpose

**High-Performance (Server/Desktop):**
- **Gemma-4-E4B-it** (3.7GB) - MacBook Pro M1 Max primary
- **Mistral 7B** (3.5GB) - Specialized tasks

### Setup Steps

1. **Install Ollama**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl https://ollama.ai/install.sh | sh
   
   # Windows
   Download from https://ollama.ai
   ```

2. **Start Ollama Server**
   ```bash
   ollama serve
   ```

3. **Pull Models**
   ```bash
   ollama pull gemma:2b
   ollama pull qwen:1.6b
   ollama pull deepseek-r1:1.5b
   ```

4. **Configure in UI**
   - Navigate to `/models` page
   - Set Ollama URL: `http://localhost:11434`
   - Test connection
   - Select models for each device
   - Choose connectivity mode

### Blotato Backend

Blotato API Key: `blt_y5mVD6oMJrgFb8UsfWN3T4GSYN2ZvCeGsVWWwdaf8Og=`

Blotato provides optimized inference for specialized models. Configure via:
1. Navigate to `/settings`
2. Select "Blotato" as primary backend (optional)
3. Settings automatically saved with API key

---

## 2. Email Infrastructure

### Agent Email Accounts

**agents@studex.cloud**
- Type: Agent mailbox
- Service: Agent Mail
- Purpose: Receives external emails, extracts action items
- Auto-creates priority tasks

**claude.assistant@studex.cloud**
- Type: Primary agent
- Service: Gmail API
- Purpose: Main agent communication channel
- Syncs to Notion database

### Setup Steps

1. **Gmail API Configuration**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project
   - Enable Gmail API
   - Create OAuth 2.0 credentials (Desktop application)
   - Download JSON credentials
   - Paste API key in `/email` page settings

2. **Agent Mail Setup**
   - Create account on Agent Mail platform
   - Generate API key
   - Paste in `/email` page settings

3. **Notion API Integration**
   - Go to [Notion Integrations](https://www.notion.so/my-integrations)
   - Create new integration
   - Generate API key
   - Paste in `/email` page settings

4. **Configure Sync**
   - Navigate to `/email` page
   - Connect each account
   - Test sync to verify
   - Set auto-sync interval (default: 5 minutes)
   - Enable "auto-create tasks from email" option

---

## 3. Distributed VM Orchestration

### Tailscale Setup

1. **Install Tailscale**
   ```bash
   # macOS
   brew install tailscale
   
   # Ubuntu/Debian
   curl -fsSL https://tailscale.com/install.sh | sh
   
   # Windows
   Download from https://tailscale.com/download
   ```

2. **Authenticate**
   ```bash
   tailscale up
   # Opens browser for authentication
   ```

3. **Get Tailscale API Key**
   - Visit [Tailscale Admin](https://login.tailscale.com/admin/settings/keys)
   - Generate new API key
   - Copy to `/vm` settings page

4. **Enable VM Auto-Discovery**
   - Navigate to `/vm` page
   - Paste Tailscale API key
   - Enable "Auto-discovery"
   - Set discovery interval (default: 30 seconds)

### VNC Remote Access

1. **Install VNC Server on Each VM**
   ```bash
   # macOS (built-in, enable in System Preferences)
   System Preferences > Sharing > Remote Management
   
   # Ubuntu/Debian
   sudo apt-get install tigervnc-server
   
   # Windows
   Download from https://www.realvnc.com/
   ```

2. **Configure VNC Password**
   - In `/vm` settings, enter default VNC password
   - Each VM will use this password for access

3. **Connect to VMs**
   - Navigate to `/vm` page
   - Click "Open VNC" or "Start & Connect" on any VM
   - VNC viewer opens automatically
   - Run agents and tasks on remote machine

---

## 4. Email Automation

### Auto-Task Creation

When enabled, the system:
1. Monitors agent email inboxes every 5 minutes (configurable)
2. Parses emails for action items using Claude API
3. Categorizes by urgency/importance (Eisenhower Matrix)
4. Creates priority tasks automatically
5. Syncs to Notion for persistent storage

### Email Categories

**Urgent & Important** (Do First)
- Deadline emails
- Critical client requests
- System alerts

**Not Urgent & Important** (Schedule)
- Strategic planning emails
- Learning materials
- Documentation requests

**Urgent & Not Important** (Delegate)
- Interruptions
- Low-priority requests
- Admin items

---

## 5. Connectivity Modes

### Offline Mode
- Uses only local models (Ollama)
- No cloud dependencies
- Latency: ~50-500ms
- Perfect for airplane mode
- Limited to device capabilities

### Hybrid Mode (Recommended)
- Primary: Local models for speed/privacy
- Fallback: Claude API for complex tasks
- Latency: ~100-2000ms
- Optimizes cost and responsiveness
- Best balance of performance and capability

### Online Mode
- Primary: Claude API for maximum intelligence
- Fallback: Local models if offline
- Latency: ~500-3000ms
- Requires internet connection
- Best accuracy and capabilities

---

## 6. System Status Monitoring

### Status Dashboard

Navigate to `/settings` to see real-time status:

- **Ollama Status**: Local model server connectivity
- **Blotato Status**: Specialized inference backend
- **Tailscale Status**: VM network connectivity
- **Gmail Status**: Email service connectivity
- **Notion Status**: Storage backend connectivity
- **Active Tasks**: Currently running agent tasks

### Test All Connections

Click "Test All Connections" button to verify all backends:
- Checks Ollama server at `http://localhost:11434`
- Validates Blotato API key
- Confirms Tailscale network access
- Tests Gmail API credentials
- Verifies Notion integration

---

## 7. System Configuration

### Agent Settings

**Agent Name**: Display name for this agent instance
**Agent Email**: Primary email address for communication
**Primary Backend**: Choose between Claude, Ollama, or Blotato

### Performance Settings

**Max Concurrent Tasks**: How many tasks to run simultaneously (1-20)
**Auto-Sync**: Enable continuous synchronization with cloud services
**Sync Interval**: How often to sync (1-60 minutes)
**Notifications**: Enable task update notifications

---

## 8. Integration Workflow

```
Email Received (Gmail/Agent Mail)
    ↓
Auto-parse for action items (Claude API)
    ↓
Categorize by Eisenhower Matrix
    ↓
Create priority task
    ↓
Sync to Notion database
    ↓
Add to daily routine
    ↓
Sync to all VMs via Tailscale
    ↓
Execute on appropriate backend (Local/Cloud)
    ↓
Update task status
    ↓
Sync back to Notion
```

---

## 9. Device Recommendations

### iPhone / iPad
- **Model**: Gemma3-1B-IT (584MB)
- **Mode**: Offline (for airplane mode)
- **Use Case**: Quick task checks, lightweight operations

### MacBook Pro M1 Max
- **Primary**: Gemma-4-E4B-it (3.7GB)
- **Secondary**: DeepSeek-R1 (1.8GB), Qwen2.5 (1.6GB)
- **Mode**: Hybrid (offline capable)
- **Use Case**: Full development, complex reasoning

### Virtual Machines
- **Primary**: Claude API (cloud)
- **Fallback**: Llama 3.1 (8B) or Mistral 7B (local)
- **Mode**: Online with offline fallback
- **Use Case**: Persistent agent execution, background tasks

---

## 10. Troubleshooting

### Ollama Connection Issues
```bash
# Verify Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

### Email Sync Not Working
- Verify API credentials in `/email` settings
- Check sync interval setting
- Test Gmail/Agent Mail connection
- Review API key permissions

### VM Discovery Failing
- Confirm Tailscale is running: `tailscale status`
- Verify Tailscale API key is valid
- Check firewall allows VNC ports (5900+)
- Test VNC server on target machine

### Notion Sync Issues
- Verify Notion API token is valid
- Confirm database exists and is accessible
- Check permissions on Notion workspace
- Test Notion connection from settings page

---

## 11. Security Considerations

1. **API Keys**: Store in environment variables, not in code
2. **Email**: Use OAuth 2.0 for Gmail, not app passwords
3. **Tailscale**: Use strong VNC passwords
4. **Notion**: Restrict API key permissions to required databases
5. **Blotato**: Keep API key secret, never commit to git

---

## 12. Deployment

### Local Development
```bash
cd studex-platform
npm install
npm run dev
# Open http://localhost:3000
```

### Production (Vercel)
```bash
vercel deploy
# Configure environment variables in Vercel dashboard
```

### Custom VMs
```bash
# Clone repo to VM
git clone <repo-url>

# Install dependencies
npm install

# Set environment variables
export OLLAMA_URL=http://localhost:11434
export BLOTATO_KEY=<your-key>
export TAILSCALE_KEY=<your-key>

# Start application
npm run build
npm start
```

---

## Next Steps

1. ✅ Core Priority System (Completed)
2. ✅ Local Model Configuration (Completed)
3. ✅ Email Infrastructure (Completed)
4. ✅ VM Orchestration (Completed)
5. 🔄 Meeting Capabilities (Next)
6. 🔄 Claude Desktop Integration (Pending)
7. 🔄 Electron Desktop Application (Pending)
8. 🔄 Custom Linux/Mac OS Base (Pending)

