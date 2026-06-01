# Claude Co-work Schedule

> Timezone: **SAST (Africa/Johannesburg, UTC+2)** · Cadence: **light / weekly**
> Philosophy: the Mac mini hub does the heavy lifting overnight; you spend a little
> focused time reviewing and approving, not grinding.

## Daily (light)

| Time (SAST) | What | Where | How |
|---|---|---|---|
| ~overnight | **Nightly data pull + research** | Mac mini hub | automation `daily-data-pull` + queued jobs |
| 08:00 | **Morning brief** — 3 opportunities + today's content jobs | MacBook | `/morning-brief` |
| flexible | **Make the content** the brief picked | MacBook | `/social-pipeline` · `/video-pipeline` · `/seo-article` |
| end of day | drop anything worth keeping into `vault/raw/` | either | — |

## Weekly

| Day (SAST) | What | How |
|---|---|---|
| **Mon** | Plan the week: theme, product focus, content calendar | `/weekly-review` (plan mode) |
| **Wed** | Competitor & price check | `/competitor-watch` |
| **Fri** | **Weekly review** — score the week vs store numbers, promote learnings | `/weekly-review` + `/vault-cleanup` |

## Monthly
- Review KPIs vs targets in [[../vault/wiki/domains/analytics-growth/_index|Analytics domain]].
- Prune `raw/`, refresh the brand bible, retire skills that don't earn their keep.

## Setting up the automated parts (Mac mini)
The daily/overnight rows run via cron on the hub. See
[`mac-mini-hub/README.md`](mac-mini-hub/README.md) for the cron lines.
Optionally mirror to a Google/Apple Calendar so you get reminders for the human steps —
calendar integration is available in this environment if you want me to create the events.
