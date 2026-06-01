---
name: morning-brief
description: Daily StudEx morning brief. Reads overnight store data + research from the vault and hands back the top 3 opportunities, yesterday's numbers, and today's content jobs. Use each morning (SAST) or when the user asks "what should I focus on today".
---

# /morning-brief

Produce today's brief for studexmeat.com. Keep it short and decision-ready.

## Steps
1. Read the brand bible: `vault/wiki/brand/studexmeat-brand.md`.
2. Read the latest data snapshot in `vault/outputs/reports/data/` (most recent file).
3. Read any new reports in `vault/outputs/reports/` and notes in `vault/raw/` from the last 24h.
4. Read recently completed jobs in `vault/raw/inbox/done/`.

## Output (save to `vault/outputs/reports/briefs/YYYY-MM-DD-brief.md`)
```
# Morning Brief — {date}
## Yesterday in numbers
- revenue / orders / AOV / conversion / sessions / ROAS  (whatever data exists)
## Top 3 opportunities today
1. <opportunity> — why now, expected impact, the skill to run
2. ...
3. ...
## Today's content jobs
- [ ] <job> → /social-pipeline | /seo-article | /video-pipeline
## Watch / risks
- <anything off-trend, e.g. ad spend up + ROAS down>
```

## Rules
- If a number isn't in the vault, say "no data yet" — don't invent it.
- Prefer opportunities that map to an existing skill the user can run immediately.
