---
name: growth-report
description: Turn the store data snapshots (Shopify, GA4, Google Ads, Meta) into a growth report with KPIs and a ranked list of opportunities. Use weekly or when the user asks "how's the store doing / where's the growth".
---

# /growth-report

Make the numbers actionable. This is the bridge from data → decisions.

## Steps
1. Read the latest snapshots in `vault/outputs/reports/data/` (and the prior one for deltas).
2. Build the KPI table: revenue, orders, AOV, conversion rate, sessions + top traffic source,
   ad spend + ROAS, top/declining products. Show week-over-week deltas.
3. Diagnose: where is money leaking (low conversion? high CPC? cart abandonment?) and where is
   it growing (channel/product/keyword)?
4. Output a **ranked opportunity list** — each with expected impact + the skill to act on it
   (`/seo-article`, `/social-pipeline`, `/customer-followup`, ad tweak, etc.).

## Output → `vault/outputs/reports/weekly/YYYY-Www-growth.md`

## Rules
- If a data source is missing (no snapshot / "missing credential"), say so and report on what exists.
- Rank by impact × ease. Be specific: "X is down N% because…", not vague advice.
