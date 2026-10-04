# StudEx Global Markets — Agentic OS Blueprint

> The master plan. How all the pieces fit, who does what, and the build roadmap.
> **AI-Powered · Human-Focused · Globally Connected.**

---

## 1. The idea

StudEx Global Markets runs as an **AI company**: one owner gives a goal, a **Chief of Staff**
agent delegates it across a crew of specialist agents, they do the work reading from a shared
**brain**, and nothing leaves without the owner's approval. The meat store (studexmeat.com) is
**Venture 1** — the proving ground.

Built from one coherent blueprint (the reference carousels):
- **alassafi.ai** → *Workspace · Brain · Access*
- **theautomationguy.ai** → *the org chart* (Chief of Staff + specialists, "one goal → they handle it")
- **chase.h.ai** → *Agentic OS in 3 steps* (Architecture → Memory → Observability)

## 2. The stack (who does what)

```
                    ┌──────────────────────────────────────────┐
   OWNER (Tumelo) ──│  one goal + approvals                     │
                    └───────────────┬──────────────────────────┘
                                    ▼
            ┌───────────────  CHIEF OF STAFF  ───────────────┐   ← orchestrator
            ▼            ▼            ▼            ▼           ▼
        Research     Marketing     Social     Sales/CX     Analytics   ← specialist crew
            └────────────┴─────┬──────┴────────────┴───────────┘
                               ▼
        BRAIN (read first)  ──►  WORKSPACE (where they run)  ──►  ACCESS (what lets them act)
        vault/brain/*.md         mission-control + daemon          Shopify·GA4·Ads·Meta·email
        vault/wiki (RAG)         Mac mini hub (Perplexity)         (approval-gated)
        vault/outputs            Claude Code `claude -p`
```

| Layer | Tool | Role | Status |
|-------|------|------|--------|
| **Brain** (memory) | `vault/` (Obsidian) | Company brain + 3-folder RAG (`raw/wiki/outputs`) | ✅ built |
| **Skills** | `.claude/skills/` (11) | Clickable workflows each agent runs | ✅ built |
| **Workspace / Dashboard** | `mission-control/` (vendored, AGPL) | Org chart, tasks, approvals, cost, daemon that spawns `claude -p` | ✅ vendored + configured |
| **Autonomous hub** | `os/mac-mini-hub/worker.py` | Always-on: Perplexity research + nightly data pulls → vault | ✅ built (needs keys) |
| **Orchestration (Chief of Staff)** | mission-control `/orchestrate` now; **spynel** later for one unified chat (terminal/WhatsApp/voice) | Turn one goal into delegated, coordinated work | ◻ spynel = Phase 2 |
| **Optimization** | **overmind** | Turn agent run-traces into better/fine-tuned agents | ◻ Phase 3 |
| **Access (data)** | Shopify · GA4 · Google Ads · Meta · Perplexity | What the agents read + act on | ◻ needs credentials |

## 3. The agent crew (org chart)

Configured in `mission-control/mission-control/data/agents.json`:

| Agent | Pillar / domain | Runs |
|-------|-----------------|------|
| **Chief of Staff** | Orchestration | morning-brief, weekly-review, orchestrate, vault-cleanup |
| **Research & Intelligence** | Research (Perplexity/Mac mini) | research-job, competitor-watch |
| **Marketing & Content** | Marketing | seo-article |
| **Social & Short-form** | Social | social-pipeline, video-pipeline |
| **Sales & Customer** | Sales/CX | customer-followup |
| **Analytics & Growth Ops** | Analytics | growth-report, kb-query |

Other research agents plug in by writing jobs/results to the vault (`raw/inbox` → `outputs`).

## 4. Autonomy — SUPERVISED (current default)

- Agents **draft and queue**; the owner approves anything that leaves (post, email, ad, spend, order).
- mission-control: `daemon-config.skipPermissions=false`, `fieldOps.autoExecute=false`; field-ops missions use `autonomyLevel: "approve-all"`.
- Dial up later: `approve-high-risk` (auto internal, approve external) → `auto` (within spend caps).

## 5. Build roadmap

**Phase 1 — Foundation (DONE / in progress)**
- [x] Vault brain + 3-folder RAG + 5 domains
- [x] 11 clickable skills
- [x] Mac mini hub worker (Perplexity + data pull), verified
- [x] mission-control vendored + configured as StudEx cockpit (crew, supervised daemon, goals, Venture 1)

**Phase 2 — Make it run (needs YOU)**
- [ ] Fill the `brain/` `[TODO]`s (or send links and I draft them)
- [ ] Add credentials to `os/mac-mini-hub/.env`: `PERPLEXITY_API_KEY`, Shopify, GA4, Ads, Meta
- [ ] Run mission-control on the Mac mini (`pnpm install && pnpm dev`, then `pnpm daemon:start`)
- [ ] Set Mac mini timezone = Africa/Johannesburg so crons = SAST
- [ ] First real goal → `/orchestrate` → approve the output
- [ ] (Optional) spynel on the Mac mini for one unified chat (terminal/WhatsApp/voice) into the crew

**Phase 3 — Compound**
- [ ] overmind: trace the agents, benchmark, improve the ones that earn their keep
- [ ] Promote proven workflows to higher autonomy
- [ ] Onboard Venture 2

## 6. Two machines
- **MacBook Pro** (roaming): you + Claude Code, creative/strategy, approvals.
- **Mac mini** (always-on hub): mission-control dashboard + daemon + Perplexity worker. Decides on data while you sleep; everything external waits for your yes.

> Front door: [`../AGENTIC-OS.md`](../AGENTIC-OS.md) · Brain: [`../vault/brain/company.md`](../vault/brain/company.md) · Dashboard: [`../mission-control/README.md`](../mission-control/README.md)
