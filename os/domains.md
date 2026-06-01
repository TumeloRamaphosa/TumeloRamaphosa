# Architecture — domains → tasks → skills → automations

> Step 1 of the blueprint. Map your work into **domains**, break each domain into
> **tasks**, turn recurring tasks into **skills**, then promote the right ones into
> **automations**. Modeled on the Cowork plugin set (`anthropics/knowledge-work-plugins`).

## The map

| # | Domain | Cowork plugin | Skills | Automations |
|---|--------|---------------|--------|-------------|
| 1 | **Marketing & Content** | marketing | `/seo-article` | weekly content plan (in `/weekly-review`) |
| 2 | **Social & Short-form** | marketing | `/social-pipeline`, `/video-pipeline` | — |
| 3 | **Sales & Customer** | sales, customer-support | `/customer-followup` | — |
| 4 | **Research & Intelligence** | research | `/research-job`, `/competitor-watch` | `competitor-watch` (weekly, hub) |
| 5 | **Analytics & Growth Ops** | analytics, operations | `/growth-report` | `daily-data-pull` (nightly, hub) |
| — | **OS itself** | operations | `/morning-brief`, `/weekly-review`, `/kb-query`, `/vault-cleanup` | `morning-brief` (daily), `weekly-review` (Fri) |

## Promotion ladder (task → automation)

```
do it once          → just prompt Claude
do it twice         → write a SKILL  (clickable, in .claude/skills/)
do it on a schedule → write an AUTOMATION (os/automations/, run by the hub)
proven + valuable   → let the Mac mini run it hands-off
```

## Rules

- A **skill** is one job, runnable on demand, with a clear input and a vault output path.
- An **automation** is a skill (or chain) + a trigger (schedule) + where it runs (MacBook vs hub).
- Every skill reads the **brand bible** and writes to a defined `vault/` path.
- New domains get a folder in `vault/wiki/domains/` and a row in this table.
