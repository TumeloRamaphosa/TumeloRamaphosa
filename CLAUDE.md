# Project memory

This repo holds: `studex-platform/` (Next.js web), `vip-airport-app/` (Aviar
VIP — Expo/React Native), plus a **gbrain** memory layer.

## Memory — use the brain first

We run [gbrain](https://github.com/garrytan/gbrain) as our long-term memory.
Before reaching for the web or guessing, **look in the brain**:

```bash
gbrain query "<question>"     # hybrid search over our memory (free)
gbrain get <slug>             # read a page (e.g. projects/aviar-vip)
gbrain think "<question>"     # synthesized, cited answer (needs embedding key)
```

- The brain's source of truth is `brain/` (markdown). After editing it, run
  `gbrain sync --repo brain`.
- When you learn a durable fact (a decision, a person, a project detail),
  **capture it** as a markdown page in `brain/` with `[[wikilinks]]`, following
  `skills/_brain-filing-rules.md`.
- Not installed yet? Run `scripts/setup-gbrain.sh` (free; no API key needed).
- Full picture, costs, and the day-to-day loop: `docs/gbrain.md`.

## Skills — discover at runtime

gbrain skills live in `skills/`. On cold start, read `skills/_AGENT_README.md`,
then walk each `skills/<slug>/SKILL.md` and match the user's message against the
`triggers:` in its frontmatter. When a trigger matches, read that SKILL.md in
full and follow its workflow. (Routing lives in frontmatter — there is no
resolver table.)

## Per-project notes
- `vip-airport-app/`: `npm install` then `npx expo start`. Branch:
  `claude/vip-airport-ride-app-W6fRR`. Typecheck with `npx tsc --noEmit`.
- `studex-platform/`: Next.js 16; `npm run dev` / `npm run build`.
