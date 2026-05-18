---
name: ui-ux-pro-max
description: AI design intelligence — 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types. Use when designing or polishing UI/landing pages, choosing color/typography, or picking chart types. Query the local search script before making visual-design decisions.
---

# UI/UX Pro Max

Searchable design-intelligence database. Before making UI/UX, color,
typography, landing-page-structure, or chart-type decisions, query it.

## How to use

Run the search script from this skill directory:

```bash
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <max_results>]
```

Domains:
- `product` — product-type recommendations (SaaS, e-commerce, clinic, portfolio)
- `style` — UI styles (glassmorphism, minimalism, brutalism) + AI prompts + CSS keywords
- `typography` — font pairings with Google Fonts imports
- `color` — color palettes by product type
- `landing` — page structure and CTA strategy
- `chart` — chart types and library recommendations
- `ux` — best practices and anti-patterns

Stack-specific guidance is available via the `--stack` flag (see CLAUDE.md
in this directory for the full reference).

## When to apply here

Use it when refining the StudEx Ai OS marketing site or the SafeSight /
LAISA Aesthetics dashboards — query `color`, `style`, and `chart` domains
to keep each brand distinct and conversion-focused.
