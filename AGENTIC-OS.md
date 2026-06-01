# StudEx Agentic OS

> Claude **Cowork** OS for **www.studexmeat.com** — built on the 3-step Agentic OS blueprint:
> **Architecture → Memory → Observability.**
>
> *Slot machine → system.* Random prompts and random results become an optimized,
> observable operating system with memory that **grows the store**.

---

## What this is (and what it is not)

| | Who builds it | What it is |
|---|---|---|
| **Storefront layer** | *(other Claude, in progress)* | Shopify site + data plumbing: Facebook, Instagram, Google Ads, Google Analytics 4 |
| **Operating layer — THIS REPO** | *this OS* | The Cowork system that **uses that data to grow the store**: skills, automations, memory, and the autonomous Mac mini hub |

The storefront produces **data**. This OS turns data into **decisions and content**.

## The 3 layers

| Step | Layer | Where it lives |
|------|-------|----------------|
| **1. Architecture** | Map work into **domains → tasks → skills → automations** | [`os/domains.md`](os/domains.md) |
| **2. Memory** | Obsidian vault as the brain — Karpathy's 3-folder RAG (`raw` / `wiki` / `outputs`) | [`vault/`](vault/_master-index.md) |
| **3. Observability** | Clickable skills + the Mac mini hub — run anything, no terminal | [`.claude/skills/`](.claude/skills) · [`os/mac-mini-hub/`](os/mac-mini-hub/README.md) |

```
┌──────────────────────────── STUDEX AGENTIC OS ──────────────────────────────┐
│                                                                              │
│  STOREFRONT (other Claude)            OPERATING LAYER (this OS)              │
│  Shopify ─┐                                                                  │
│  GA4    ──┤ data ──▶  vault/raw/inbox ──▶  Mac mini hub  ──▶ opportunities   │
│  Ads    ──┤           (job queue)          (always-on)      + content jobs   │
│  Meta   ──┘                                    │                             │
│                                                ▼                             │
│  MacBook Pro (roaming)                vault/  (Obsidian brain)               │
│  Claude Code + /skills          raw/ ─promote─▶ wiki/ ─compose─▶ outputs/    │
│                                                                              │
│  Domains: Marketing&Content · Social&Short-form · Sales&Customer ·           │
│           Research&Intel · Analytics&Growth-Ops                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Two machines

| Machine | Role |
|---------|------|
| **MacBook Pro** (roaming) | You + Claude Code. Run skills on demand, do creative/strategy work. |
| **Mac mini** (always-on autonomous hub) | Polls the job queue, runs Perplexity + research agents, pulls store data, writes opportunities & content jobs back to the vault. Makes data-driven calls while you sleep. |

## Start here

1. **Open the vault** — point Obsidian at [`vault/`](vault/). Read [`vault/_master-index.md`](vault/_master-index.md).
2. **Run a skill** — in Claude Code type `/` and pick one (e.g. `/morning-brief`, `/social-pipeline`). See [`.claude/skills/`](.claude/skills).
3. **Wire the Mac mini hub** — follow [`os/mac-mini-hub/README.md`](os/mac-mini-hub/README.md).
4. **Connect the data sources** — fill in [`os/integrations.md`](os/integrations.md) (Shopify / GA4 / Ads / Meta keys + Perplexity).
5. **Follow the schedule** — [`os/schedule.md`](os/schedule.md) (SAST, light/weekly).

## How a growth cycle flows

1. **Nightly** the Mac mini hub pulls store + ad + analytics data → `vault/raw/inbox`.
2. It runs **Perplexity research** (competitors, prices, trends) → `vault/outputs/reports`.
3. **`/morning-brief`** reads it all and hands you 3 opportunities + the day's content jobs.
4. **`/social-pipeline`** + **`/video-pipeline`** + **`/seo-article`** produce the content.
5. **`/vault-cleanup`** promotes what worked `raw → wiki` so the OS compounds.
6. **`/weekly-review`** (Fri) scores the week against the store's actual numbers.

> Built on the Cowork plugin model (`anthropics/knowledge-work-plugins`) and Agent Skills
> (`anthropics/skills`). See [`os/integrations.md`](os/integrations.md) for the full reference-repo map.
