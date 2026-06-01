---
title: Domain — Analytics & Growth Ops
type: domain-index
cowork_plugin: analytics + operations
updated: 2026-06-01
---

# 📊 Analytics & Growth Ops

Where the **storefront data** lands and becomes decisions. This is what makes the
Mac mini "decide based on data and opportunities."

## Data sources (wired by the storefront build)
| Source | What we read | Lands in |
|---|---|---|
| **Shopify** | orders, revenue, products, carts | `raw/inbox` → `outputs/reports/data/` |
| **Google Analytics 4** | sessions, traffic source, conversion | `outputs/reports/data/` |
| **Google Ads** | spend, CPC, ROAS, top terms | `outputs/reports/data/` |
| **Meta (FB/IG)** | reach, engagement, ad results | `outputs/reports/data/` |

## Tasks → Skills
| Recurring task | Skill | Output |
|---|---|---|
| Nightly data pull | automation `daily-data-pull` (hub) | `outputs/reports/data/` |
| Growth report + opportunities | `/growth-report` | `outputs/reports/weekly/` |
| Weekly scorecard | `/weekly-review` | `outputs/reports/weekly/` |

## Standing context
- KPIs we track → revenue, orders, AOV, conversion rate, ROAS, organic sessions
- Targets → [TODO: set monthly targets here]

## Notes
- Source: Cowork **Analytics** + **Operations** plugins.
- See [`../../../os/integrations.md`](../../../os/integrations.md) for connection setup.
