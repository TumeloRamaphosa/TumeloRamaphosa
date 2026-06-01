---
title: Domain — Research & Intelligence
type: domain-index
cowork_plugin: research
updated: 2026-06-01
---

# 🔭 Research & Intelligence

The Mac mini hub's home turf. Runs mostly autonomously on Perplexity + research agents.

## Tasks → Skills
| Recurring task | Skill | Runs on | Output |
|---|---|---|---|
| Deep research on a question | `/research-job` | Mac mini hub | `outputs/reports/` |
| Competitor & price watch | `/competitor-watch` | Mac mini hub | `outputs/reports/competitors/` |
| Market / trend scan | `/research-job` | Mac mini hub | `outputs/reports/` |

## Standing context
- Competitor set → _(list the SA online butchers / meat brands here)_
- Price history → _(hub appends each run)_
- Engine: Perplexity (sonar) via [`../../../os/mac-mini-hub/`](../../../os/mac-mini-hub/README.md)

## Notes
- Other research agents plug in here by writing jobs to `raw/inbox/` and results to `outputs/reports/`.
- Source: Cowork **Research** plugin + `anthropics/skills` research skill.
