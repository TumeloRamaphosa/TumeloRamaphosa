# NOTICE — Vendored component: Mission Control

This directory (`mission-control/`) is a vendored copy of the open-source project
**Mission Control** by Dan Meisner — https://github.com/MeisnerDan/mission-control

## License — IMPORTANT

Mission Control is licensed under the **GNU AGPL-3.0** (see `LICENSE` in this folder).
This is a strong copyleft license. For StudEx Global Markets this means:

- ✅ **Running it internally** (e.g. on the Mac mini hub for our own operations) is fine and
  imposes no distribution obligation.
- ⚠️ **If we ever expose this dashboard as a public/network service**, AGPL §13 requires us to
  offer its complete corresponding source (including our modifications) to those users under AGPL.
- ⚠️ Keep StudEx's own proprietary code (e.g. `../studex-platform`) as **separate programs** — do
  not statically combine them into one program with this AGPL code, or that code may become
  subject to AGPL.

The upstream `LICENSE`, `CLAUDE.md`, and `README.md` are preserved unmodified.

## What StudEx changed
- `mission-control/data/agents.json` — StudEx Global Markets agent org chart (Chief of Staff + specialists)
- `mission-control/data/skills-library.json` — StudEx skills
- `mission-control/data/daemon-config.json` — SAST schedule, **supervised** autonomy
- `mission-control/data/goals.json`, `projects.json` — StudEx goals + first venture (studexmeat)
- Removed upstream `.github/` CI workflows (not run in this repo)

See `../os/BLUEPRINT.md` for how this fits the StudEx Agentic OS.
