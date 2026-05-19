# Design System — LAISA / StudEx Ai OS

> The one thing to remember: **"My business runs itself."**
> Quiet competence and relief. Weight lifted. Every decision below serves that.
> If a choice makes the product feel frantic, cold, or hype-y, it is wrong.

## Product Context
- **What this is:** An agent-run operating system that runs a business end to end. Sold to other businesses as StudEx Ai OS; delivered to the client white-labelled as LAISA.
- **Who it's for:** Owners of service businesses (clinics, practices, SMBs) who are 80% reacting, 20% growing. Non-technical. Time-poor.
- **Space/industry:** B2B operations infrastructure / agent platforms. Flagship client: SafeSight (eye care + aesthetics).
- **Surfaces:** (1) Marketing site — light, editorial. (2) LAISA dashboard (`/demo`) — the same brand at night, warm dark.

## Aesthetic Direction
- **Direction:** Calm Operational — warm editorial-utilitarian.
- **Decoration level:** minimal-intentional. Hairline rules, faint warm paper grain. No gradients, no glow blobs, no decorative blur.
- **Mood:** The relief of a clean desk. Engineered calm. Human, not cyber. The product's promise (it's handled) is the visual language, not ornament.
- **Reference posture:** Deliberately departs from the category's dark-mode + grotesque convergence. LAISA reads warm and human, not like another AI tool.

## The Brand Device
A small **"handled" status dot** in signal green (`#2FA572`). It is the single recurring motif and replaces all decorative gradient/blur. Use it to mark anything the system has taken care of (a resolved thread, a sent invoice, a confirmed booking, a live agent). It literally visualizes "it runs itself." Use with discipline — sparse and meaningful, never as filler.

## Typography
- **Display / Hero:** Fraunces — warm optical serif. Human, confident, premium without cold luxury. Use optical size; weight 400–600 for headings, never ultra-thin.
- **Body / UI / Labels:** Hanken Grotesk — calm humanist sans, high legibility for non-technical readers.
- **Data / Tables (dashboard):** Geist with `font-variant-numeric: tabular-nums`.
- **Mono:** Geist Mono — status chips, IDs, agent names.
- **Loading:** Google Fonts / Bunny Fonts via `<link>` (Fraunces, Hanken Grotesk, Geist, Geist Mono).
- **Banned here:** Inter, Sora, Roboto, Space Grotesk, system-ui as a display/body font. (The old `--font-sans: Inter` / `--font-display: Sora` is replaced.)
- **Scale (rem, 16px root):** xs .8125 · sm .875 · base 1 · lg 1.125 · xl 1.375 · 2xl 1.75 · 3xl 2.25 · 4xl 3 · 5xl 3.75 · hero 4.5. Display tracking tight (-0.02em); body normal.

## Color
- **Approach:** restrained. One primary, one signal, one rare premium accent. Color is meaningful, never decorative.

| Token | Light (marketing) | Dark (LAISA dashboard) | Use |
|-------|-------------------|------------------------|-----|
| `ink` | `#1A1714` | `#F2EEE6` | Primary text |
| `paper` | `#FBF8F3` | `#16140F` | Page background |
| `surface` | `#FFFFFF` | `#1E1B15` | Cards, panels |
| `surface-2` | `#F4EFE7` | `#262218` | Raised / inset |
| `line` | `rgba(26,23,20,0.10)` | `rgba(242,238,230,0.10)` | Hairline rules, borders |
| `muted` | `#6B6457` | `#A39A87` | Secondary text |
| `primary` | `#1F4D3D` | `#2E6B54` | Deep evergreen — trust, growth handled |
| `signal` | `#2FA572` | `#3FBE85` | "Handled / done" green — the brand device |
| `accent` | `#C9A86A` | `#D4B574` | Muted sand — rare premium highlight only |

- **Semantic:** success `#2FA572` · warning `#C8862B` · error `#C0492F` · info `#3B6B8F`.
- **Dark mode:** not an inversion. It is a redesigned warm-charcoal surface. Saturation of greens raised slightly for contrast on dark; sand warmed. Same brand, at night.

## Spacing
- **Base unit:** 8px (4px for fine type adjustments only).
- **Density:** marketing = spacious; dashboard = comfortable-compact.
- **Scale:** 2xs 2 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64 · 4xl 96 · 5xl 128.
- Generous vertical rhythm on marketing sections (96–128 between sections). Calm = whitespace.

## Layout
- **Approach:** hybrid. Marketing = editorial, **left-aligned** (no centered-everything heroes). Dashboard = grid-disciplined.
- **Grid:** marketing 12-col, max content width 1200px, generous outer gutter. Dashboard fluid with a fixed rail.
- **Structure over cards:** prefer hairline-ruled sections and typographic hierarchy to boxing everything in cards. Cards earn their place; they are not the default.
- **Border radius:** sm 6px · md 10px · lg 14px · pill 9999px. No uniform bubble-radius on everything; flat rules and small radii dominate.

## Motion
- **Approach:** minimal-functional → intentional. Slow, few, confident. "Runs itself" = nothing frantic.
- **Remove:** aurora blob animation, float keyframe, gradient text shimmer.
- **Keep:** quiet entrance fades/translations (existing `Reveal`), short and staggered lightly.
- **Easing:** enter `cubic-bezier(0.16,1,0.3,1)` · exit `ease-in` · move `ease-in-out`.
- **Duration:** micro 80ms · short 200ms · medium 320ms · long 560ms. Nothing snappier than 80ms, nothing slower than ~600ms.

## Anti-Slop Guardrails (enforce in review)
- No purple/violet gradients. No gradient text. No glow/aurora blur blobs.
- No centered-everything hero. No 3-column icon-in-colored-circle grid as the default.
- No Inter / Sora / Space Grotesk / system-ui as display or body.
- No uniform bubble border-radius. No gradient CTA buttons.
- The status-dot device is the only recurring ornament. If it's decoration, cut it.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-19 | Initial design system created | /design-consultation. Brief: "my business runs itself." Deliberate departure from dark cyber-SaaS convergence toward warm calm editorial. Work-from-knowledge (no web research). |
