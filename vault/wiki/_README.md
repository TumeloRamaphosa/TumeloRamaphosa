---
title: wiki/ — codified knowledge
type: folder-readme
---

# wiki/ — codified knowledge (the RAG corpus)

Durable, cleaned, sourced knowledge promoted from `raw/`. This is what `/kb-query`
searches and what every skill reads for context.

## Structure

- `brand/` — the StudEx Meat brand bible (voice, facts, products, audience)
- `domains/` — one folder per domain, each with an `_index.md`
- `playbooks/` — repeatable how-to's (e.g. "launch a product drop", "run a Meta campaign")

## Rules

- Every claim has a source link or a `source:` field.
- Use `[[wiki-links]]` so the graph stays connected.
- One concept per note. Keep notes short and atomic.
