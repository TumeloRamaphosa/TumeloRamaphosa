---
name: competitor-watch
description: Track South African meat/butchery competitors — prices, promotions, new products, and marketing. Queues scan jobs for the Mac mini hub and summarizes the latest results. Use weekly (Wed) or before a pricing/launch decision.
---

# /competitor-watch

Keep eyes on the competition so pricing and offers stay sharp.

## Steps
1. Load the competitor list from `vault/wiki/domains/research-intel/_index.md`
   (if empty, ask the user for 3–5 competitor sites/brands and add them there).
2. Either:
   - **Summarize**: read the latest files in `vault/outputs/reports/competitors/` and produce
     a comparison + what changed since last time; **or**
   - **Refresh**: enqueue a `perplexity_research` job per competitor into `vault/raw/inbox/`
     (prices, promos, new products, marketing — cite sources), then tell the user to let the
     hub run, or run inline if they want it now.
3. Save a combined summary → `vault/outputs/reports/competitors/YYYY-MM-DD-summary.md`.

## Rules
- Compare against our own prices/offers from the brand bible — call out where we're over/under.
- Public info only. Don't attempt logins, scraping behind auth, or anything a normal visitor can't see.
