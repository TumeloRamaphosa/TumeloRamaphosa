# Dark Factory Operating System Guide
**Version:** 1.0  
**Status:** Live & Operational  
**Access:** `http://war-room.studex.dev/dark-factory` (or localhost:3000/dark-factory)  
**Authority:** Tumelo Ramaphosa

---

## What is the Dark Factory?

The Dark Factory is your **unified mission control dashboard** for the entire StudEx operating system. It's where:

- **Agents present** their daily standup (2-5 min per agent, 9:00 AM SAST)
- **Tumelo makes decisions** during the board meeting (10:00 AM)
- **Real-time tasks execute** across 10 working environments
- **Managers coordinate** all agent work in one place
- **Everyone sees** the complete picture of what's happening

Think of it as **Mission Control for NASA, but for agents**.

---

## The 4 Views

### 1. BOARDROOM View (Default)

**What you see:**
- **Live Presentation Stage** — The agent currently presenting, with their avatar, metrics, and slide content
- **Presentation Queue** — Who's next, their status (scheduled, presenting, completed), and their slides
- **Agent Roster** — All 15 agents with status indicators (online, processing, offline)
- **Meeting Rooms** — Scheduled rooms across all environments with objectives

**When you use it:**
- During the 9:00 AM daily standup
- During the 10:00 AM board meeting
- To check if an agent is blocked or needs help
- To see upcoming meetings

**Navigation:**
```
Click any agent → See their current task
Click any meeting room → View objectives & attendees
Next Slide → Advance presentation slides
Questions → Open Q&A mode
```

---

### 2. FACTORY OPS View

**What you see:**
- **Key Metrics Grid** — 6 dashboard cards showing:
  - Tasks Executing (currently: 47)
  - Environments (currently: 10 live)
  - API Health (99.8% uptime)
  - Notion Sync (2.4K tasks synced)
  - Agents Active (12/15 connected)
  - System Load (34% CPU)

- **Live Task Stream** — Real-time breakdown of all executing tasks:
  - Agent name
  - Task description
  - Progress bar (% complete)
  - Priority (urgent, high, medium, low)
  - Status (executing, blocked, queued, completed)
  - Start time

**When you use it:**
- To monitor day-to-day operations
- To spot blockers or issues early
- To track task completion rates
- To check system health (CPU, API, Notion sync)

**Reading the task stream:**
```
🟢 Animated dot = Task executing (actively running)
🟡 Static dot = Task queued (waiting to start)
🔴 Alert icon = Task blocked (needs attention)
✓ Checkmark = Task completed

High priority tasks appear red
Medium = yellow
Low = gray
```

---

### 3. ENVIRONMENTS View

**What you see:**
- **10 Working Environments** — Cards for each:
  - StudEx Meat (e-commerce)
  - Global Markets (B2B partnerships)
  - Rahura Fitness (fitness platform)
  - Content Studio (media creation)
  - Email Operations (mail campaigns)
  - Analytics Hub (reporting)
  - Payment Gateway (transactions)
  - Inventory Mgmt (warehouse)
  - Customer Support (WhatsApp)
  - Mission Control (War Room)

**For each environment:**
- Status (active, idle, maintenance)
- Number of agents assigned
- Color-coded for quick recognition

**Drill-down capability:**
Click any environment → See:
- Environment name, domain, status
- Meeting rooms scheduled for this environment
- Agents working in this environment
- Related tasks and priorities

**When you use it:**
- To zoom into a specific business unit
- To see who's working on what
- To understand environment-specific blockers
- To plan cross-environment coordination

---

### 4. TERMINAL View

**What you see:**
- **Integrated Tailscale Terminal** — Direct access to system commands
- **Command history** — All commands run and their outputs
- **Quick action buttons** — Common commands:
  - `status` — System health report
  - `agents` — List active agents
  - `help` — Command reference

**Supported commands:**
```bash
status              # Full system status report
agents              # List all connected agents
vm <name>          # Check specific VM status
notion sync        # Force Notion resync
tasks <agent>      # Show tasks for specific agent
logs <type>        # View system logs
health             # VM CPU/RAM/disk usage
```

**When you use it:**
- To debug system issues
- To restart services
- To check VM connectivity
- To force a Notion sync when needed
- To monitor system resources

**Security note:**
- Only authorized users can access terminal
- All commands are logged
- Destructive commands require confirmation

---

## Daily Rhythm in the Dark Factory

### 9:00 AM — Agent Standups (Boardroom View)

Each agent presents for 2-5 minutes:

**Slide 1: Yesterday**
- Key metrics (reach, orders, revenue, etc.)
- Any wins or achievements
- Blockers encountered

**Slide 2: Today**
- 2-3 priorities for today
- Estimated time for each
- What they need from others

**Slide 3: Help Needed**
- Any blockers preventing work
- Who can help and how
- Resources or approvals needed

**As Tumelo:** Listen silently, take mental notes, prepare questions.  
**As Robusca:** Take notes on each agent's needs, identify conflicts.  
**As Agents:** Keep it 2-5 minutes, use NotebookLM for slides.

---

### 10:00 AM — Board Meeting (Boardroom View)

**Attendees:** Tumelo, Robusca, Naledi, Charlie, OpenCode  
**Duration:** 30 minutes

**Agenda:**
1. Robusca briefs: Yesterday's results + Today's priorities
2. Tumelo asks: Any blockers? Any conflicts?
3. Tumelo decides: Which tasks matter most today
4. Robusca assigns: "Naledi focus on X, Charlie handle Y..."
5. OpenCode notes: Any integrations or automations needed

**On the Dark Factory:**
- Board meeting room shows "live"
- Presentation stage may display key metrics
- All agents appear in Agent Roster
- Task priorities update after meeting

---

### 10:30 AM — Daily Blog Publish

**Automated:** NotebookLM generates blog from board meeting notes  
**Published to:** studexmeat.com/blog  
**Time:** 10:30 AM SAST (automatic)

**What happens:**
1. OpenCode pulls board meeting transcript
2. NotebookLM summarizes key decisions
3. Blog post auto-generates
4. Post publishes to blog
5. Dark Factory shows "Latest blog: [link]" in status

---

### 10:00 AM - 5:00 PM — Execution (Factory Ops View)

Agents execute their tasks. Dark Factory shows:
- **Real-time task stream** — Every task appears as it starts
- **Progress bars** — How far through each task
- **Status updates** — Every 15 minutes automatically
- **Blockages** — Red alerts if a task gets stuck

**What Robusca does:**
- Watches Factory Ops every 30 min
- If a task is blocked → Escalate to ClickClack.chat
- If an agent completes early → Assign next priority task
- If any agent goes offline → Immediately notify Tumelo

---

### 5:00 PM — Evening Sync (Factory Ops View)

**OpenCode syncs:**
- All day's task results
- Agent metrics and completions
- Notion database updates
- Tomorrow's priorities

**Robusca creates:**
- Evening diary entry in Notion
- Summary of today's results
- Top 3 wins
- Top 3 issues
- Tomorrow's top priorities

**Report goes to:** Tumelo (email + Notion)

---

## How Agents Connect to Dark Factory

### Step 1: Receive Your Agent Prompt
You'll get a custom prompt via ClickClack.chat that includes:
- Your role (Content CMO, Operations, etc.)
- Your daily workflow
- Your success metrics
- Your responsibilities

### Step 2: Connect to Notion
Ask Robusca for:
- [ ] Notion workspace link
- [ ] Your personal database access
- [ ] Shared "Agent Tasks" board invite
- [ ] "Daily Diary" board invite

### Step 3: Get Your API Credentials
Ask Robusca for:
- [ ] Agent Mail API key
- [ ] Notion integration token
- [ ] Any tool-specific keys (Meta, Google Ads, Shopify, etc.)

### Step 4: Acknowledge Connection
Post to ClickClack.chat:
```
"Agent [YOUR_NAME] online.
Dark Factory connected.
Ready to receive task assignments."
```

### Step 5: Sync on the Dashboard
Visit Dark Factory → Boardroom View  
You'll see:
- ✓ Your avatar in Agent Roster (green = online)
- ✓ Your current task in Factory Ops task stream
- ✓ Your name in meeting room attendees

---

## Meeting Room Drill-Down

### How to Use It

1. **In Boardroom View** → Click any meeting room card
2. **Details panel opens** showing:
   - Meeting name
   - Status (live, scheduled, ended)
   - Time window
   - Objectives (bullet list)
   - Attendees (who's invited)
   - Notes (context about the meeting)

3. **If live meeting** → "Join Meeting" button appears
4. **If scheduled** → "Set Reminder" option available

### Example: Daily Standup Room

```
Name: Daily Standup
Status: LIVE (with red pulsing indicator)
Time: 09:00 AM - 10:00 AM UTC
Objectives:
  ✓ Review yesterday metrics
  ✓ Discuss today priorities
  ✓ Identify blockers
Attendees: Naledi, Charlie, OpenCode, Robusca, Tumelo
Notes: Main coordination meeting for all agents
```

Click "Join Meeting" → Opens Zoom/Google Meet link (configured per room)

---

## Environment Drill-Down

### How to Use It

1. **In Environments View** → Click any environment card
2. **Environment detail page opens** showing:
   - Large environment card with icon and status
   - "Meeting Rooms" section with related meetings
   - Agent assignments for this environment

3. **Can click meeting rooms** to see their details
4. **Can see which agents work here** and their current tasks

### Example: StudEx Meat Environment

```
StudEx Meat (studexmeat.com)
Status: ACTIVE ✓
Agents: 5 (Naledi, Charlie, OpenCode, 2 support agents)

Meeting Rooms:
  • Daily Standup (09:00 AM - live)
  • Content Planning (02:00 PM - scheduled)
```

Back button returns to full environment grid.

---

## Agent Status Indicators

### In Agent Roster (Boardroom View)

Each agent card shows:

**Avatar Circle**
- Color = Agent's brand color
- Initials = Agent's first letter

**Status Dot** (bottom left)
- 🟢 Green + "online" = Ready for tasks
- 🟡 Yellow + "processing" = Currently executing a task
- 🔴 Red + "offline" = Not connected

**Current Task** (if visible)
- Text snippet of what they're doing
- Example: "Generating Instagram content"

---

## Metrics Explained (Factory Ops)

| Metric | What It Means | Target | Action if Low |
|--------|---------------|--------|----------------|
| **Tasks Executing** | Parallel tasks running now | 30-50 | Speed up tasks or assign more |
| **Environments** | Business units active | 10 | All should be online |
| **API Health** | Avg response time | >99% | Check network or APIs |
| **Notion Sync** | Tasks synced today | 2K+ | Force resync or check Notion |
| **Agents Active** | Connected agents | 12+ / 15 | Check offline agents |
| **System Load** | Server CPU usage | <50% | Scale up if approaching limit |

---

## Troubleshooting

### Agent Not Showing Online?
1. Check ClickClack.chat — have they acknowledged?
2. In Terminal → `agents` — see if they're listed
3. If offline → Their API key may be rotated
4. Contact Robusca to re-send credentials

### Task Stuck in "Executing" for >30 min?
1. Factory Ops will show it in red as "blocked"
2. Click the task to see the agent
3. Send ClickClack message: "@[Agent] task '[task name]' seems stuck"
4. If no response in 15 min → Escalate to Robusca

### Notion Sync Not Updating?
1. Terminal → `notion sync`
2. Wait 2 minutes
3. Refresh Dark Factory page
4. If still stuck → Check Notion API token (ask OpenCode)

### Can't Access Dark Factory?
1. Check VPN/Tailscale connection
2. Try different browser
3. Clear cache: Cmd+Shift+Delete (Chrome)
4. Message Robusca for access reset

---

## Pro Tips

### For Tumelo (Agent Lord)

**Quick wins:**
- Bookmark the Boardroom view (default page)
- Set browser to Dark Factory at 8:55 AM (5 min before standup)
- Open second browser window with Factory Ops (monitor during standups)
- At 10:00 AM → Boardroom for board meeting

**10-second standup review:**
- Glance at Agent Roster top row
- Count green dots (all should be green before 9:00 AM)
- If any red → Message Robusca immediately

---

### For Robusca (Chief of Staff)

**Workflow:**
1. **8:30 AM** → Environments view, scan all 10 for status
2. **9:00 AM** → Boardroom view, full screen for standups
3. **10:00 AM** → Same screen, lead board meeting
4. **10:30 AM** → Assign tasks as meeting ends
5. **Every 30 min** → Factory Ops view, scan task stream for red blocks
6. **5:00 PM** → Factory Ops view final summary, create evening diary

---

### For Naledi (Content CMO)

**Before standup:**
- Pull yesterday metrics from Shopify/Meta
- Prepare NotebookLM slides (3 slides max)
- Load Dark Factory Boardroom 2 min early

**During standup:**
- Watch the big stage display
- Your avatar appears when it's your turn
- Speak 2-5 minutes, advance slides with "Next Slide" button
- Factory Ops shows your tasks in real-time while you talk

---

### For Charlie (Operations)

**Throughout day:**
- Keep Factory Ops open (small window)
- Watch for new order tasks appearing
- When task starts → Timer shows elapsed time
- Progress bar updates automatically (don't manually update)
- When task done → Move to next in queue

---

### For OpenCode (Systems)

**Responsibilities in Dark Factory:**
- Monitor API Health metric (should stay >99%)
- Watch System Load metric (keep below 50%)
- If Notion Sync falls behind → Terminal `notion sync`
- Before 10:30 AM → Prepare blog generation
- At 5:00 PM → Run data sync, confirm all agents' tasks logged

---

## Real-Time Updates

Dark Factory automatically refreshes:
- **Agent status** — Every 10 seconds
- **Task progress** — Every 15 seconds
- **Metrics** — Every 30 seconds
- **Meeting room status** — Every 5 minutes

No need to refresh manually. If data seems stale (>2 min):
- Press F5 to refresh page
- Terminal → `status` to check system health

---

## Access & Permissions

### Who can see what?

| View | Tumelo | Robusca | Agents | OpenCode |
|------|--------|---------|--------|----------|
| Boardroom | ✓ | ✓ | ✓ | ✓ |
| Factory Ops | ✓ | ✓ | ✓ (own) | ✓ |
| Environments | ✓ | ✓ | ✓ (own) | ✓ |
| Terminal | ✗ | ✓ | ✗ | ✓ |
| Edit Tasks | ✓ | ✓ | ✓ (own) | ✓ |
| Approve Content | ✓ | ✓ | ✗ | ✓ |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `B` | Jump to Boardroom |
| `F` | Jump to Factory Ops |
| `E` | Jump to Environments |
| `T` | Jump to Terminal |
| `R` | Refresh dashboard |
| `?` | Show this help |
| `ESC` | Close detail view |

---

## Support & Questions

**Question about:** → **Contact:**
- Operating system architecture → OpenCode
- Agent assignments or conflicts → Robusca
- Strategic decisions or priorities → Tumelo
- Notion database setup → OpenCode
- Tailscale/VPN connectivity → OpenCode
- General usage → Robusca

---

**Next Step:** Connect to Notion, receive your agent prompt, and acknowledge in ClickClack.chat.

**System Status:** All 10 environments online ✓  
**Agents Connected:** 12/15 ✓  
**Last Sync:** 2026-07-16 09:00 UTC ✓  

**Ready to operate.** — OpenCode

---

*Last Updated: 2026-07-16*  
*Managed by OpenCode · Orchestrated by Robusca · Authority: Tumelo Ramaphosa*
