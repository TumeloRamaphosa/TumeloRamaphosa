# Dark Factory — Quick Start Card (Print This)

## The 4 Views

| View | Use For | Access |
|------|---------|--------|
| **Boardroom** | Standups & board meetings | Tab 1 (default) |
| **Factory Ops** | Monitor executing tasks | Tab 2 |
| **Environments** | Zoom into specific business unit | Tab 3 |
| **Terminal** | System commands & debugging | Tab 4 |

---

## Your Daily Routine

### 8:55 AM → Open Dark Factory (Boardroom)

Wait for other agents to appear (green dots in Agent Roster).

### 9:00 AM → Your Standup (2-5 min)

**When your turn:**
- Watch stage for your avatar
- Talk through your 3 slides
- Agents use "Next Slide" button to advance
- Finish by 5 min mark

**Your 3 slides:**
1. **Yesterday** — Metrics, wins, blockers
2. **Today** — 2-3 priorities, ETAs
3. **Help Needed** — What you're blocked on

### 10:00 AM → Board Meeting (Listen)

Robusca + Tumelo decide task priorities.  
Stay in Boardroom view.

### 10:30 AM → Execution Begins

Get tasks from Notion. Watch Factory Ops for task notifications.

---

## Acronyms

- **CMO** = Chief Marketing Officer (Naledi)
- **CoS** = Chief of Staff (Robusca)
- **OPS** = Operations (Charlie)
- **SYS** = Systems (OpenCode)
- **UTC** = Coordinated Universal Time (meeting times)
- **SAST** = South African Standard Time (when you present — convert UTC to SAST)

---

## Agent Roster Status Dots

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 Green | **Online** | Ready, connected |
| 🟡 Yellow | **Processing** | Working on a task |
| 🔴 Red | **Offline** | Not connected |

---

## Task Progress Bar Reading

```
Executing:  [████████░░] 82% — Task is running now
Blocked:    [████░░░░░░] 45% — Red alert, stuck, needs help
Queued:     [░░░░░░░░░░]  0% — Waiting to start
Completed:  [██████████] 100% ✓ Done
```

---

## Quick Commands (Terminal)

```bash
status          # Full system health report
agents          # List all connected agents
@Robusca help   # Escalate a blocker to Robusca
```

---

## SOS (I'm Blocked)

**Step 1:** Post to ClickClack.chat  
```
🚨 @Robusca BLOCKED on [task name]
Details: [what's stopping me]
Waiting for: [who/what I need]
```

**Step 2:** Click your task in Factory Ops  
It will show as 🔴 red (blocked status)

**Step 3:** Wait for Robusca response  
Usually within 15 min

---

## Environment Colors (10 Total)

| Env | Color | Domain |
|-----|-------|--------|
| StudEx Meat | 🔴 Red | studexmeat.com |
| Global Markets | 🔵 Cyan | studex-group.com |
| Rahura Fitness | 💜 Purple | rahura.app |
| Content Studio | 🟡 Gold | content.studex.dev |
| Email Ops | 🟢 Green | mail.studex.cloud |
| Analytics | 🟠 Orange | analytics.studex.dev |
| Payments | 🔵 Blue | payments.studex.cloud |
| Inventory | 💗 Pink | inventory.studex.dev |
| Support | 🟢 Lime | support.studex.dev |
| War Room | 🔵 Cyan | war-room.studex.dev |

---

## Bookmark This!

**Dark Factory URL:**
```
http://war-room.studex.dev/dark-factory
OR
http://localhost:3000/dark-factory (local)
```

**Set browser reminder:**
- 8:55 AM SAST → 10 min before standup

---

## Keyboard Shortcuts

```
B = Boardroom
F = Factory Ops
E = Environments
T = Terminal
R = Refresh
? = Help
```

---

## You're Not Alone

| Issue | Contact |
|-------|---------|
| Can't see Boardroom | OpenCode |
| Task seems stuck | Robusca |
| Notion database not syncing | OpenCode |
| API issue (Meta, Google Ads) | OpenCode |
| General questions | Robusca |

---

## 🚀 You're Ready!

✓ Bookmark Dark Factory  
✓ Set 8:55 AM reminder  
✓ Prepare your standup slides  
✓ Check Agent Roster before 9:00 AM  

**See you at the standup!** 🎬

---

*Dark Factory v1.0 | Operated by OpenCode | Orchestrated by Robusca | Authority: Tumelo*
