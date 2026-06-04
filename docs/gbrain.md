# gbrain — our agent memory layer

[gbrain](https://github.com/garrytan/gbrain) is the long-term memory for our AI
agents. Instead of search returning raw pages, gbrain *synthesises* answers with
citations and tells us what it doesn't yet know. We use it so the agent (and
future sessions) remember what we're building, who's who, and the open threads.

## How it works (the model)

```
brain/ (markdown, git)  ──sync──►  PGLite DB (Postgres-in-WASM)
   system of record                derived index
                                      │
        ┌─────────────────────────────┼──────────────────────────┐
        ▼                             ▼                            ▼
  hybrid search              knowledge graph              synthesis (LLM)
  vector (HNSW) + BM25       [[wikilinks]] → typed        gbrain think:
  + reciprocal-rank fusion   edges, auto-linked on        cited answer +
                             every write (no LLM)         "what's missing"
```

- **Markdown is the source of truth.** Files in `brain/` are authoritative; the
  database is rebuilt from them. Git deletions become DB soft-deletes.
- **The graph is free.** Wiki links like `[[aviar-vip]]` are turned into typed
  edges by pattern matching — no API calls. This is what beats vector-only
  retrieval (~+31 pts precision@5 per the project's benchmarks).
- **Two query verbs:**
  - `gbrain query "…"` / `gbrain search "…"` — retrieval. Cheap/free.
  - `gbrain think "…"` — synthesised, cited answer + gap analysis. Uses an LLM.

## What's installed in this repo

| Piece | Path | Purpose |
|---|---|---|
| Brain (markdown) | `brain/` | The memory itself — people, projects, places |
| Setup script | `scripts/setup-gbrain.sh` | Idempotent install + init + sync (free) |
| MCP wiring | `.mcp.json` → `gbrain` | Lets Claude Code/Cursor use the brain as a tool |
| This doc | `docs/gbrain.md` | How it all fits together |

> The gbrain **CLI and its PGLite database live outside the repo** (`~/.gbrain`)
> and do not survive this ephemeral container. The repo holds the durable parts;
> `scripts/setup-gbrain.sh` rebuilds the rest in ~30s on any machine or session.

## Quick start

```bash
scripts/setup-gbrain.sh                 # install + load brain/ (no API key needed)
gbrain query "what are we building?"     # hybrid search over our memory
gbrain get aviar-vip                      # read a page
gbrain sync --repo brain                 # re-sync after editing brain/
```

## Costs — read before enabling synthesis / vector search

`init`, `import`, `query` (keyword), graph extraction, and `doctor` are **free**.
Vector embeddings and `gbrain think` need a provider key. gbrain's own install
guide rates ongoing **search-mode** spend (model + corpus dependent):

| Mode | Haiku | Sonnet | Opus |
|------|-------|--------|------|
| conservative | $40/mo | $120/mo | $200/mo |
| balanced | $100/mo | $300/mo | $500/mo |
| tokenmax | $200/mo | $600/mo | $1,000/mo |

**This project is set to use OpenAI** for embeddings. To turn the paid layer on,
add `OPENAI_API_KEY` to the environment (web: the environment's secrets/env
config; local: your shell or `.env`), then re-run setup:

```bash
export OPENAI_API_KEY=sk-…          # text-embedding-3-large (1536d)
scripts/setup-gbrain.sh             # re-inits with OpenAI, embeds, sets mode
# or manually:
gbrain init --pglite --embedding-model openai:text-embedding-3-large
gbrain embed --stale                # build vectors
gbrain config set search.mode conservative
gbrain think "open threads on Aviar?"
```

### What "search mode" means

`gbrain think` answers by running a small retrieval *agent*: it expands your
question, pulls candidate pages, reranks them, and may do follow-up hops before
writing a cited answer. **Search mode is the budget dial for that agent** — how
many queries/expansions/hops and how much context it's allowed to burn per
question:

- **conservative** — fewest hops, tightest context. Cheapest, fast, still cited.
- **balanced** — more expansion and reranking depth → better recall, more spend.
- **tokenmax** — maximum hops/context → highest recall, highest spend.

The dollar figures in the table above are gbrain's published *monthly* estimates
at steady use; actual cost scales with how often you call `think` and which chat
model it uses (Haiku ≪ Sonnet ≪ Opus). The setup script defaults to
**conservative** — change it anytime with `gbrain config set search.mode <mode>`.
`query`/`search` (plain retrieval) ignore this dial and stay cheap.

## Day-to-day with the agent (MCP)

With the `gbrain` MCP server wired in `.mcp.json`, the agent can:
1. **Look up the brain first** before web/API calls ("brain-first lookup").
2. **Capture** new facts as markdown pages with `[[links]]`.
3. **Synthesise** cited answers across everything we've stored.

Recommended loop once keys are set (gbrain can install these as cron/daemon):
- every ~15 min: `gbrain sync --repo brain && gbrain embed --stale`
- nightly: `gbrain dream` (maintenance/consolidation)
- weekly: `gbrain doctor`

## Skills (installed)

The bundled gbrain skills are scaffolded into `skills/` and committed, so the
agent gets them on every cold start. Each `skills/<slug>/SKILL.md` declares
`triggers:` in its frontmatter; the agent matches your message against those and
runs the matching skill's workflow. `CLAUDE.md` points the agent at
`skills/_AGENT_README.md` (the routing contract) and at the brain.

What this buys us — the skills turn the brain from a passive store into an
operator. Highlights:
- **ingest / media-ingest / voice-note-ingest / meeting-ingestion** — drop in raw
  content (articles, transcripts, voice notes) and it's filed into the right
  brain pages with exact-phrasing preservation.
- **signal-detector** — capture salient facts from inbound messages automatically.
- **brain-ops + conventions + _brain-filing-rules** — consistent citations,
  backlinks, and where pages live, so the graph stays clean.
- **briefing / reports / data-research / perplexity-research** — synthesized,
  cited briefings and brain-augmented web research.
- **concept-synthesis / strategic-reading / book-mirror** — turn reading into
  structured, reusable knowledge.

Update skills when gbrain ships a new version:

```bash
gbrain upgrade
gbrain skillpack reference --all     # diff bundle vs our committed copies
```
