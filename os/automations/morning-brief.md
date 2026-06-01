---
automation: morning-brief
trigger: daily 08:00 SAST
runs_on: MacBook (you), assisted by overnight hub output
skill: /morning-brief
---

# Automation — Morning Brief

**Trigger:** every morning, 08:00 SAST.
**Precondition:** the hub's `daily-data-pull` + any queued research ran overnight.

**Steps**
1. Read latest `vault/outputs/reports/data/` snapshot + new `vault/outputs/reports/`.
2. Read open items in `vault/raw/inbox/done/` from the last 24h.
3. Produce a brief: top 3 opportunities, yesterday's numbers, today's content jobs.
4. Save to `vault/outputs/reports/briefs/YYYY-MM-DD-brief.md`.

This one stays human-in-the-loop (you run `/morning-brief`) — it's your daily decision point.
