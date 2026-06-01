---
automation: daily-data-pull
trigger: nightly 02:00 SAST (cron on Mac mini)
runs_on: Mac mini hub
handler: worker.py → handler "data_pull"
---

# Automation — Daily Data Pull

**Trigger:** nightly 02:00 SAST via cron on the Mac mini.

**Steps**
1. For each configured source (Shopify, GA4, Google Ads, Meta), fetch yesterday's key metrics.
2. Write a snapshot to `vault/outputs/reports/data/YYYY-MM-DD-data.md` (+ a `.json` for machines).
3. If a credential is missing, write a clear "missing credential" line — never crash.
4. Drop a one-line note to `vault/raw/` so the morning brief sees it.

**Metrics**: revenue, orders, AOV, conversion rate, sessions + top source (GA4), ad spend + ROAS (Ads/Meta), top products.

> Credentials live in `mac-mini-hub/.env`. See [`../integrations.md`](../integrations.md).
