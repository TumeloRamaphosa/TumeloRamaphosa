---
automation: competitor-watch
trigger: weekly Wed 06:00 SAST (cron on Mac mini)
runs_on: Mac mini hub
handler: worker.py → handler "perplexity_research"
---

# Automation — Competitor & Price Watch

**Trigger:** weekly, Wednesday 06:00 SAST.

**Steps**
1. Enqueue a `perplexity_research` job per competitor in the watch list
   (see [[../../vault/wiki/domains/research-intel/_index|Research domain]]).
2. The hub runs each via Perplexity, capturing prices, offers, and new products.
3. Results → `vault/outputs/reports/competitors/YYYY-MM-DD-<competitor>.md`.
4. A combined summary → `vault/outputs/reports/competitors/YYYY-MM-DD-summary.md`.

You then review via `/competitor-watch` (it reads + summarizes the latest run).
