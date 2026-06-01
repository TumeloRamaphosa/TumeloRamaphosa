---
title: StudEx Vault — Master Index
type: index
updated: 2026-06-01
---

# 🧠 StudEx Vault — the OS brain

This is the **persistent memory layer** for the StudEx Agentic OS.
Every note, report, and output the OS produces stays here, searchable, forever.

> **Karpathy's 3-folder RAG**
> `raw/` — dumping ground · `wiki/` — codified articles · `outputs/` — finished decks + reports

## Folders

| Folder | Purpose | Rule |
|--------|---------|------|
| [`raw/`](raw/) | Dumping ground. Job results, scraped data, clippings, transcripts, half-thoughts. | Write freely. Never trust as final. |
| [`raw/inbox/`](raw/inbox/) | **Job queue** between the OS and the Mac mini hub. | Skills drop jobs here; the hub picks them up. |
| [`wiki/`](wiki/) | Codified, durable knowledge. Promoted from `raw` once proven. | Clean, sourced, linkable. The RAG corpus. |
| [`outputs/`](outputs/) | Finished deliverables — reports, decks, content, video. | Shippable. Dated. |

## Domains (the architecture)

1. [[wiki/domains/marketing-content/_index|Marketing & Content]] — SEO, blog, recipes, brand
2. [[wiki/domains/social-shortform/_index|Social & Short-form]] — IG / FB / TikTok / YT, video pipeline
3. [[wiki/domains/sales-customer/_index|Sales & Customer]] — orders, leads, follow-up, retention
4. [[wiki/domains/research-intel/_index|Research & Intelligence]] — Perplexity, competitor & price watch
5. [[wiki/domains/analytics-growth/_index|Analytics & Growth Ops]] — Shopify, GA4, Ads, Meta KPIs

## Core references

- Brand bible → [[wiki/brand/studexmeat-brand|StudEx Meat brand]]
- Playbooks → [[wiki/playbooks/_index|Playbooks]]
- Skills index → [`../os/skills-index.md`](../os/skills-index.md)
- Schedule → [`../os/schedule.md`](../os/schedule.md)

## Search tips

- Run **`/kb-query`** to ask the vault a question (RAG over `wiki/` + `outputs/`).
- Run **`/vault-cleanup`** weekly to promote `raw → wiki` and fix this index.
