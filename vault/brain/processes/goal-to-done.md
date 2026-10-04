---
title: processes/goal-to-done.md
type: brain-process
updated: 2026-10-04
---

# Process — One Goal → Done (the orchestrator loop)

How the **Chief of Staff** turns a single goal into finished work.

1. **Goal in** → owner states one goal (in mission-control, or to the Chief of Staff).
2. **Break down** → Chief of Staff splits it into tasks, sets Eisenhower priority, assigns each to a specialist.
3. **Delegate** → tasks land in each agent's inbox; the daemon spawns a Claude Code session per task.
4. **Execute** → agents read the `brain/`, do the work, write to the vault, post a report.
5. **Gate** → anything leaving (post/email/ad/spend/order) becomes a Decision or Field-Op → owner approves.
6. **Monitor** → Chief of Staff tracks progress, unblocks dependencies, retries failures.
7. **Report** → a concise roll-up to the owner's inbox; learnings promoted to `wiki/`.

> Run it with `/orchestrate` (mission-control) for existing pending tasks, or hand the Chief of Staff a fresh goal.
