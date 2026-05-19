# LAISA / StudEx Ai OS

Agent-run operating system. Sold to businesses as **StudEx Ai OS**; delivered to
the client white-labelled as **LAISA**. Marketing site + LAISA dashboard (`/demo`).

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
