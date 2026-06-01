# Integrations

How the OS connects to the storefront data, the research engine, and the reference
skill libraries. **Never commit real secrets** — put keys in `mac-mini-hub/.env`
(gitignored) or your password manager.

## 1. Storefront data sources *(wired by the storefront Claude — confirm + give read access)*

| Source | What the OS needs | Status |
|---|---|---|
| **Shopify** | Admin API access token (read orders/products/customers) + store handle | ⬜ provide |
| **Google Analytics 4** | GA4 property ID + service-account JSON (Data API read) | ⬜ provide |
| **Google Ads** | Ads API developer token + OAuth, or scheduled CSV export | ⬜ provide |
| **Meta (FB/IG)** | Graph API token (page + IG business account) | ⬜ provide |

> The nightly `daily-data-pull` automation reads these and writes snapshots to
> `vault/outputs/reports/data/`. Until keys exist, the hub logs a clear "missing
> credential" note instead of failing.

## 2. Research engine — Perplexity (on the Mac mini)

| Item | Value |
|---|---|
| API key | `PERPLEXITY_API_KEY` in `mac-mini-hub/.env` ⬜ provide |
| Model | `sonar` / `sonar-pro` (configurable) |
| Used by | every `perplexity_research` job in `raw/inbox/` |

If you'd rather drive the **Perplexity Comet** desktop app instead of the API, tell me
and I'll add a Comet automation handler to the worker.

## 3. Reference skill libraries (model the OS on these)

| Repo | Use |
|---|---|
| `anthropics/skills` | Official Agent Skills — coding, research, writing, marketing, analysis |
| `anthropics/knowledge-work-plugins` | Cowork plugins by business function — the domain model |
| `harry0703/MoneyPrinterTurbo` | One-click short-form video → `/video-pipeline` reference |
| `Lum1104/Understand-Anything` | Codebase → knowledge graph (handy for the storefront repo) |

> These are *references/optional installs*, not dependencies. Say the word and I'll vendor
> the specific skills we want into `.claude/skills/`.

## 4. MCP servers already configured
See [`../.mcp.json`](../.mcp.json): **FireCrawl** (scraping) and **Playwright** (browser
automation) — both useful for competitor watch and verifying the live store.
