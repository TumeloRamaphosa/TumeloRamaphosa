# LAISA / StudEx Ai OS

Agent-run operating system. Sold to businesses as **StudEx Ai OS**; delivered to
the client white-labelled as **LAISA**. Marketing site + LAISA dashboard (`/demo`).

## Company name — read carefully

The company is **StudEx** (proper spelling: capital `S`, lowercase `t`, `u`, `d`,
capital `E`, lowercase `x` → exactly `StudEx`). The corporate entity is
**StudEx Group**.

Voice / STT note: when the user says "stat x", "stat ex", "start x", "studs ex",
or similar phonetic variants, they always mean **StudEx**. Always write it
back as `StudEx` — never `StatX`, `Studex`, `StudX`, `Start X`, or any other
variation. In all client-facing materials (proposal, dashboard, invoice,
PDFs) use exactly `StudEx` or `StudEx Ai OS` or `StudEx Group`.

The user is **T. Ramaphosa** (Tumelo Ramaphosa), founder of StudEx.

## StudEx Cognitive Brain

The memory layer for every agent and every staff member is called the
**StudEx Cognitive Brain**. It is a categorised, day-by-day record of every
patient interaction, agent action, content decision, store order and
clinical note — auto-written by agents into an underlying knowledge graph
the team can read in the dashboard. Always refer to it as the **StudEx
Cognitive Brain**. Do not name the underlying tooling (Obsidian, GBrain or
any third-party library) in client-facing materials — describe it only as
**our cognitive layer** or **StudEx Cognitive Brain**.

## Vendor naming discipline (client-facing materials)

Never name external tools or vendors in proposals, the dashboard, or any
PDF that goes to the client. The following are internal implementation
details only, described to the client as "StudEx Ai OS technology":

- The cockpit / agent runtime layer
- The cognitive memory layer
- Social-media agent skill packs
- Email / messaging agent layers
- The orchestration layer
- The content generation engines

Everything is **our technology** or branded under **StudEx Ai OS** /
**LAISA**.

## Design System
Always read `DESIGN.md` before making any visual or UI decision.
All fonts, colors, spacing, layout, motion, and the "handled" status-dot brand
device are defined there. The guiding idea is **"my business runs itself"** —
warm, calm, human. Do not deviate without explicit user approval.
In QA or review, flag any code that contradicts `DESIGN.md` (gradients, glow
blobs, Inter/Sora, centered-everything heroes, bubble-radius — all banned).

## Environment
Secrets live in `.env.local` (gitignored). `.env.example` documents required
keys. Never commit real keys.
