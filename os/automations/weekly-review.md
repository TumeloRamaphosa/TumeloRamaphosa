---
automation: weekly-review
trigger: weekly Fri 15:00 SAST
runs_on: MacBook (you)
skill: /weekly-review
---

# Automation — Weekly Review

**Trigger:** Friday 15:00 SAST.

**Steps**
1. Read the week's data snapshots + briefs + published content.
2. Score the week vs targets (revenue, orders, ROAS, organic sessions).
3. What worked / what didn't / what to double down on next week.
4. Run `/vault-cleanup` to promote winning learnings `raw → wiki`.
5. Save to `vault/outputs/reports/weekly/YYYY-Www.md`.

Human-in-the-loop — it's your reflection + planning point for the next week.
