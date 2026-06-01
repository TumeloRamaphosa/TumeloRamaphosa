# Skills index

Every clickable skill in `.claude/skills/`. In Claude Code, type `/` and the skill name.
*Codify once, hand it off* — anyone on the team can run these, no terminal knowledge needed.

| Skill | Domain | What it does | Writes to |
|---|---|---|---|
| `/morning-brief` | OS | Reads overnight data + research, hands you 3 opportunities + today's jobs | `outputs/reports/briefs/` |
| `/weekly-review` | OS | Plans the week / scores it vs store numbers | `outputs/reports/weekly/` |
| `/kb-query` | OS | Answers a question from the vault (RAG over `wiki/` + `outputs/`) | — (answers inline) |
| `/vault-cleanup` | OS | Promotes `raw → wiki`, dedupes, fixes the master index | `wiki/` |
| `/seo-article` | Marketing & Content | Researches + drafts an SEO article/recipe/guide, on-page ready | `outputs/content/articles/` |
| `/social-pipeline` | Social | A week of platform-native posts + captions + hashtags | `outputs/content/social/` |
| `/video-pipeline` | Social | Script → voiceover script → subtitles → shot list for a short video | `outputs/video/` |
| `/customer-followup` | Sales & Customer | Drafts order/lead/win-back messages (email/WhatsApp/DM) | `outputs/content/messages/` |
| `/research-job` | Research | Enqueues a deep-research job for the Mac mini hub | `raw/inbox/` → `outputs/reports/` |
| `/competitor-watch` | Research | Queues a competitor & price scan, summarizes results | `outputs/reports/competitors/` |
| `/growth-report` | Analytics | Turns the data snapshots into a report + ranked opportunities | `outputs/reports/weekly/` |

## Conventions
- Every skill loads [[../vault/wiki/brand/studexmeat-brand|the brand bible]] first.
- Outputs are dated `YYYY-MM-DD-<slug>.md`.
- If a skill needs a fact it doesn't have, it flags an assumption — it does **not** invent it.
