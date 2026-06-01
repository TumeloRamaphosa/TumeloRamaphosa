---
title: raw/inbox — the job queue
type: folder-readme
---

# raw/inbox/ — the job queue (OS ⇄ Mac mini hub)

This folder is the **bridge** between the OS (MacBook / Claude Code) and the
**always-on Mac mini hub**.

## How it works

1. A skill (e.g. `/research-job`, `/competitor-watch`) writes a **job file** here:
   `JOB-YYYY-MM-DD-HHMM-<slug>.json`
2. The Mac mini hub (`os/mac-mini-hub/worker.py`) polls this folder.
3. It runs the job (Perplexity, data pull, scrape), writes the result to
   `vault/outputs/reports/` and a short note to `vault/raw/`, then moves the
   job file to `inbox/done/`.

## Job file shape

See [`../../../os/mac-mini-hub/jobs/example-research-job.json`](../../../os/mac-mini-hub/jobs/example-research-job.json)
and the schema in [`os/mac-mini-hub/README.md`](../../../os/mac-mini-hub/README.md).

```json
{
  "id": "JOB-2026-06-01-0700-competitor-prices",
  "type": "perplexity_research",
  "priority": "normal",
  "prompt": "Compare current online prices for grass-fed beef boxes from the top 5 SA online butchers...",
  "output": "vault/outputs/reports",
  "created_by": "/competitor-watch",
  "created_at": "2026-06-01T07:00:00+02:00"
}
```

> If you sync this vault via iCloud/Obsidian Sync/Git, both machines see the queue automatically.
