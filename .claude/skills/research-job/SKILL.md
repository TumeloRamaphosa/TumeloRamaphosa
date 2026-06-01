---
name: research-job
description: Enqueue a deep-research job for the always-on Mac mini hub (Perplexity). Use when the user wants research done autonomously/overnight rather than now — keyword research, market sizing, supplier scans, trend deep-dives. Writes a job file the hub picks up.
---

# /research-job

Hand a research question to the Mac mini hub instead of doing it inline.

## Steps
1. Clarify the research question into one specific, source-able prompt
   (who/what/where/timeframe, ask for citations).
2. Write a job file to `vault/raw/inbox/JOB-YYYY-MM-DD-HHMM-<slug>.json`:
```json
{
  "id": "JOB-<stamp>-<slug>",
  "type": "perplexity_research",
  "priority": "normal",
  "prompt": "<the specific prompt>",
  "output": "vault/outputs/reports",
  "created_by": "/research-job",
  "created_at": "<ISO8601 +02:00>"
}
```
3. Tell the user where the result will land (`vault/outputs/reports/<id>.md`) and that the
   hub processes it on its next poll.

## Rules
- One clear question per job. Always ask for sources/citations in the prompt.
- For competitor/price scans specifically, prefer `/competitor-watch`.
- If the user wants the answer *right now*, do the research inline instead of queuing.
