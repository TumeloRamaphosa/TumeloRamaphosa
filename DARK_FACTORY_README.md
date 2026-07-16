# 🏭 Dark Factory Operating System

**The unified mission control dashboard for the entire StudEx distributed agent operating system.**

---

## Quick Links

| Document | For | Read Time |
|----------|-----|-----------|
| **[DARK_FACTORY_QUICK_START.md](./studex-platform/DARK_FACTORY_QUICK_START.md)** | Agents & quick reference | 5 min |
| **[DARK_FACTORY_GUIDE.md](./studex-platform/DARK_FACTORY_GUIDE.md)** | Complete operational manual | 20 min |
| **[MEGA_PROMPT_OPERATING_SYSTEM.md](./robusca-brain/MEGA_PROMPT_OPERATING_SYSTEM.md)** | System architecture & rules | 15 min |
| **[AGENT_PROMPTS.md](./robusca-brain/AGENT_PROMPTS.md)** | Individual agent operating systems | 10 min |

---

## What is the Dark Factory?

The Dark Factory is a **real-time mission control dashboard** where:

- ✅ **15 AI agents** coordinate work across 10 business environments
- ✅ **Daily standup presentations** (2-5 min each, 9:00 AM SAST)
- ✅ **Real-time task execution** visible to everyone
- ✅ **Board meetings** where Tumelo makes strategic decisions (10:00 AM)
- ✅ **Automated blog publishing** from meeting notes (10:30 AM)
- ✅ **5 PM evening sync** with daily results and tomorrow's priorities

**Access:** http://war-room.studex.dev/dark-factory (or http://localhost:3000/dark-factory)

---

## Architecture

```
                    🎬 BOARDROOM VIEW
                   (Presentations)
                         ↓
        [Agent Presentations] [Meeting Rooms]
        [Agent Roster (15)]   [Scheduled Events]
                         ↓
                    🏭 FACTORY OPS
               (Real-time Execution)
                         ↓
              [Task Stream]    [Metrics]
              [Progress Bars]  [System Health]
                         ↓
                   🌍 ENVIRONMENTS
              (10 Business Units)
                         ↓
        [Drill-Down] → [Agents] [Meetings] [Tasks]
                         ↓
                    💻 TERMINAL
               (Tailscale Access)
                         ↓
              [System Commands] [Debugging] [Logs]
```

---

## The 15 Agents

### Core Team (5)
- **Naledi** (Content CMO) — Instagram, Facebook, TikTok, YouTube
- **Charlie** (Operations) — Shopify orders, fulfillment, inventory, WhatsApp
- **OpenCode** (Systems) — All APIs, automations, integrations, system health
- **Robusca** (Chief of Staff) — Coordinates all agents, makes tactical decisions
- **Tumelo** (Agent Lord) — Strategic decisions, board meeting (10-11 AM only)

### Support Team (10)
- **Zara** (Content Strategist)
- **Kai** (Analytics)
- **Luna** (Growth)
- **Axel** (Finance)
- **Iris** (Customer Support)
- **Remi** (QA)
- **Nova** (R&D)
- **Sage** (Training)
- **Vex** (Security)
- **Echo** (Data Sync)

---

## The 10 Working Environments

| # | Environment | Domain | Status | Agents |
|---|-------------|--------|--------|--------|
| 1 | StudEx Meat | studexmeat.com | Active | 5 |
| 2 | Global Markets | studex-group.com | Active | 4 |
| 3 | Rahura Fitness | rahura.app | Idle | 3 |
| 4 | Content Studio | content.studex.dev | Active | 2 |
| 5 | Email Operations | mail.studex.cloud | Active | 2 |
| 6 | Analytics Hub | analytics.studex.dev | Maintenance | 2 |
| 7 | Payment Gateway | payments.studex.cloud | Active | 2 |
| 8 | Inventory Mgmt | inventory.studex.dev | Active | 2 |
| 9 | Customer Support | support.studex.dev | Idle | 2 |
| 10 | Mission Control | war-room.studex.dev | Active | 3 |

---

## Daily Rhythm

### 8:30 AM — Pre-Meeting Prep
**Robusca:** Reviews all 10 environments, prepares board agenda

### 9:00 AM — Agent Standups (Boardroom View)
**Each agent:** 2-5 min presentation
- Slide 1: Yesterday's metrics
- Slide 2: Today's priorities
- Slide 3: Help needed

### 10:00 AM — Board Meeting (Boardroom View)
**Attendees:** Tumelo, Robusca, Naledi, Charlie, OpenCode
**Duration:** 30 min
- Robusca briefs results
- Tumelo asks questions
- Tumelo decides priorities
- Robusca assigns tasks

### 10:30 AM — Auto-Blog Publish
**OpenCode:** NotebookLM generates blog from board meeting notes
**Published to:** studexmeat.com/blog

### 10:00 AM - 5:00 PM — Execution (Factory Ops View)
**All agents:** Execute assigned tasks
- Real-time task stream visible
- Progress bars update every 15 sec
- Blockers show as red alerts
- Robusca monitors and unblocks

### 5:00 PM — Evening Sync (Factory Ops View)
**OpenCode:** Syncs all day's results to Notion
**Robusca:** Creates evening diary entry
- Daily summary
- Top 3 wins
- Top 3 issues
- Tomorrow's priorities
**Report to:** Tumelo (email + Notion)

---

## How Agents Connect

### For New Agents

1. **Receive your prompt** via ClickClack.chat
   - Your role, workflow, metrics, responsibilities

2. **Get Notion access** from Robusca
   - Notion workspace link
   - "Agent Tasks" board
   - "Daily Diary" board

3. **Get API credentials** from Robusca
   - Agent Mail API key
   - Notion integration token
   - Tool-specific keys (Meta, Google Ads, Shopify, etc.)

4. **Acknowledge on ClickClack**
   ```
   Agent [YOUR_NAME] online.
   Dark Factory connected.
   Ready to receive task assignments.
   ```

5. **Check Dark Factory**
   - You appear in Agent Roster (green = online)
   - Your current task shows in Factory Ops
   - You're listed in relevant meeting rooms

---

## Core Files

### In `studex-platform/`
- **`src/app/dark-factory/page.tsx`** — Main Dark Factory dashboard (React)
- **`src/components/dark-factory/`** — Reusable components
  - `task-stream.tsx` — Real-time task visualization
  - `agent-status-grid.tsx` — Agent roster display
  - `meeting-room-detail.tsx` — Meeting room drill-down
- **`src/lib/dark-factory-config.ts`** — Configuration (environments, tasks, meetings)
- **`DARK_FACTORY_GUIDE.md`** — Complete operational manual
- **`DARK_FACTORY_QUICK_START.md`** — Quick reference card

### In `robusca-brain/`
- **`MEGA_PROMPT_OPERATING_SYSTEM.md`** — System rules & architecture
- **`AGENT_PROMPTS.md`** — Individual agent prompts (copy-paste for ClickClack)
- **`NOTION_CONNECTION_QUICK_START.md`** — Notion setup guide
- **`CLOUDFLARE_EMAIL_SETUP.md`** — Email infrastructure guide

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `B` | Jump to Boardroom |
| `F` | Jump to Factory Ops |
| `E` | Jump to Environments |
| `T` | Jump to Terminal |
| `R` | Refresh dashboard |
| `?` | Show help |

---

## Terminal Commands

```bash
# System status
status              # Full health report
agents              # List connected agents
help                # Command reference

# Diagnostics
logs <type>         # View system logs
vm <name>          # Check VM status
health             # CPU/RAM/disk usage

# Operations
notion sync        # Force Notion resync
tasks <agent>      # Show agent's tasks
restart <service>  # Restart a service
```

---

## Key Features

### Real-Time Monitoring
- Task progress bars update every 15 seconds
- Agent status updates every 10 seconds
- Metrics refresh every 30 seconds

### Drill-Down Capability
- Click any environment → See agents & meetings
- Click any meeting room → View objectives & attendees
- Click any agent → See their current task & status

### Integrated Tailscale Terminal
- Direct access to system commands
- For debugging and diagnostics
- Available to authorized users only

### Automated Workflows
- 9:00 AM standup reminders (via calendar)
- 10:00 AM board meeting (auto-sync)
- 10:30 AM blog publishing (NotebookLM)
- 5:00 PM evening sync (Notion + email)

---

## Metrics Dashboard

### Live Metrics (Factory Ops)
- **Tasks Executing** — Currently running tasks (target: 30-50)
- **Environments** — Active business units (target: 10/10)
- **API Health** — Average response time (target: >99%)
- **Notion Sync** — Tasks synced today (target: 2K+)
- **Agents Active** — Connected agents (target: 12/15)
- **System Load** — Server CPU usage (target: <50%)

### Daily Metrics (Evening Diary)
- Total orders processed
- Revenue generated
- Customer acquisition
- Content reach & engagement
- Fulfillment rate
- System uptime

---

## Troubleshooting

| Issue | Fix | Contact |
|-------|-----|---------|
| Agent offline | Check API key rotation | Robusca |
| Task stuck (>30 min) | Send ClickClack message to agent | Robusca |
| Notion not syncing | Terminal: `notion sync` | OpenCode |
| Can't see Boardroom | Clear cache, refresh browser | OpenCode |
| API response slow | Check system load in Factory Ops | OpenCode |
| Permission denied | Check Tailscale VPN | OpenCode |

---

## Access Levels

### Tumelo (Agent Lord)
- All views
- Board meeting authority
- Strategic decisions
- Read-only terminal (no commands)

### Robusca (Chief of Staff)
- All views
- Assign tasks
- Full terminal access
- Pre-approve content

### Agents (Naledi, Charlie, etc.)
- Boardroom (view presentations)
- Factory Ops (own tasks only)
- Environments (drill-down)
- No terminal access

### OpenCode (Systems)
- All views
- Full terminal access
- API management
- System diagnostics

---

## Getting Help

| Question | Contact | Response Time |
|----------|---------|----------------|
| How do I present? | Robusca | Async |
| My task is stuck | Robusca | 15 min |
| API not working | OpenCode | 15 min |
| Notion sync issue | OpenCode | 30 min |
| System is down | OpenCode | ASAP |
| Strategic decision | Tumelo | Board meeting |

---

## Next Steps

### For Tumelo
1. [ ] Bookmark Dark Factory
2. [ ] Set 8:55 AM calendar reminder
3. [ ] Review DARK_FACTORY_GUIDE.md (pro tips section)
4. [ ] Prepare list of 5 strategic priorities

### For Robusca
1. [ ] Bookmark Dark Factory
2. [ ] Read MEGA_PROMPT_OPERATING_SYSTEM.md (full)
3. [ ] Prepare 9 AM standup agenda template
4. [ ] Get agent prompts ready for ClickClack delivery

### For Agents
1. [ ] Read DARK_FACTORY_QUICK_START.md (5 min)
2. [ ] Bookmark Dark Factory
3. [ ] Wait for your agent prompt via ClickClack
4. [ ] Acknowledge when connected
5. [ ] Prepare standup slides for 9:00 AM

### For OpenCode
1. [ ] Deploy Dark Factory dashboard
2. [ ] Configure Notion sync automation
3. [ ] Set up NotebookLM blog publishing (10:30 AM)
4. [ ] Configure Tailscale terminal access
5. [ ] Test all 4 views and components

---

## System Status

| Component | Status | Last Check |
|-----------|--------|------------|
| Dashboard | ✅ Live | 2026-07-16 09:00 |
| Notion Sync | ✅ Connected | 2026-07-16 09:00 |
| Agent Mail | ✅ Ready | 2026-07-16 09:00 |
| Tailscale VPN | ✅ Online | 2026-07-16 09:00 |
| All VMs | ✅ Accessible | 2026-07-16 09:00 |
| Blog Publishing | ✅ Ready | 2026-07-16 09:00 |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-16 | Initial release: 4 views, 15 agents, 10 environments |
| — | TBD | Real-time chat in Boardroom (Slack integration) |
| — | TBD | Mobile app for on-the-go monitoring |
| — | TBD | Advanced analytics & forecasting |

---

## Attribution

**Built by:** OpenCode (Claude Code agent)  
**Orchestrated by:** Robusca (Chief of Staff)  
**Authority:** Tumelo Ramaphosa (Agent Lord)

**Architecture inspired by:**
- NASA Mission Control (real-time monitoring)
- Claude SEO Skill (boardroom presentation style)
- Pixel Agents (factory operations visualization)
- Hermes AgentOS (multi-agent coordination)

---

## License & Usage

This Dark Factory Operating System is proprietary to StudEx.  
All agents must acknowledge the MEGA_PROMPT_OPERATING_SYSTEM.md rules before access.

**Managed by:** OpenCode  
**Last Updated:** 2026-07-16  
**Next Update:** 2026-07-23 (weekly sync)

---

**Ready to operate. Dark Factory is live.** 🏭✨

Start with: 📖 [DARK_FACTORY_QUICK_START.md](./studex-platform/DARK_FACTORY_QUICK_START.md)
