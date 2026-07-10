# LAISA Desktop — Branding & UI Specification Guide

> **Mission:** "My clinic runs itself"
>
> LAISA is the white-label clinic OS delivered to healthcare practices.
> Every UI decision reflects quiet competence, operational calm, and the relief of an automated day.

---

## 1. Color Palette

All colors optimized for dark UI (charcoal background). LAISA is night-mode only.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Dark Background** | `#16140F` | 22, 20, 15 | Page background, canvas |
| **Surface** | `#1E1B15` | 30, 27, 21 | Cards, panels, raised surfaces |
| **Surface Overlay** | `#262218` | 38, 34, 24 | Second-level surfaces, insets |
| **Primary Text** | `#F2EEE6` | 242, 238, 230 | Body text, labels |
| **Secondary Text** | `#A39A87` | 163, 154, 135 | Muted, helper text |
| **Primary Brand** | `#2E6B54` | 46, 107, 84 | Buttons, active states, clinic-specific accent |
| **Signal Green** | `#3FBE85` | 63, 190, 133 | "Handled" status dot, success states, agent live |
| **Accent Sand** | `#D4B574` | 212, 181, 116 | Premium highlights, rare accent (use sparingly) |
| **Hairline Border** | `rgba(242,238,230,0.10)` | — | Subtle dividers, section rules |
| **Error** | `#C0492F` | 192, 73, 47 | Alerts, validation errors |
| **Warning** | `#C8862B` | 200, 134, 43 | Caution states, blocked items |
| **Info** | `#3B6B8F` | 59, 107, 143 | Informational badges |

### Color Application Rules
- **Primary Brand (`#2E6B54`)**: Main buttons, active tabs, primary CTAs, clinic branding.
- **Signal Green (`#3FBE85`)**: The "handled" status dot (see Brand Device below). Mark any completed action: resolved alert, sent message, confirmed booking, live agent.
- **Accent Sand (`#D4B574`)**: Rare premium use only — premium plan badge, special features. Never as fill; use for text emphasis or thin rules.
- **No gradients, glows, or blur**. Color is meaningful, not decorative.

---

## 2. Typography System

### Font Stack
- **Display / Headers**: Fraunces (warm optical serif, 400–600 weight)
- **Body / UI**: Hanken Grotesk (humanist sans, high legibility)
- **Data / Tables**: Geist with `font-variant-numeric: tabular-nums`
- **Mono / IDs / Agents**: Geist Mono

### Scale (base 16px = 1rem)

| Scale | Rem | Px | Usage |
|-------|-----|-----|-------|
| `xs` | 0.8125 | 13px | Small labels, badges |
| `sm` | 0.875 | 14px | Secondary text, helper copy |
| `base` | 1 | 16px | Body text, default |
| `lg` | 1.125 | 18px | Subheadings, form labels |
| `xl` | 1.375 | 22px | Section headers |
| `2xl` | 1.75 | 28px | Larger headers |
| `3xl` | 2.25 | 36px | Page titles |
| `4xl` | 3 | 48px | Hero headlines (rare) |

### Weight & Letter-Spacing
- **Display (Fraunces)**: Weight 400–600. Tracking `-0.02em` (tight). Use optical sizing.
- **Body (Hanken Grotesk)**: Weight 400–500. Tracking normal (0em).
- **Mono (Geist Mono)**: Weight 400. Use for agent names, IDs, status chips.

### Line Height
- **Headings**: 1.2 (tight, confident)
- **Body**: 1.5 (comfortable reading)
- **Data tables**: 1.4 (scannable)

---

## 3. Spacing System

### Base Unit: 8px grid

| Scale | Value | Usage |
|-------|-------|-------|
| `2xs` | 2px | Fine baseline tweaks only |
| `xs` | 4px | Micro spacing (icon-to-label) |
| `sm` | 8px | Button padding, input height, component gutters |
| `md` | 16px | Card padding, section margins |
| `lg` | 24px | Component blocks, header height |
| `xl` | 32px | Section spacing |
| `2xl` | 48px | Major section breaks |
| `3xl` | 64px | Full-width section breaks |
| `4xl` | 96px | Rare, hero sections |
| `5xl` | 128px | Rare, page-level breaks |

### Density Guidelines
- **Dashboard (LAISA)**: Comfortable-compact. Use `md` (16px) and `lg` (24px) as defaults.
- **Headers**: 56–64px tall (clinic name + status in practice).
- **Cards/Panels**: Minimum `md` (16px) padding top/bottom, `md` (16px) left/right.
- **Horizontal rhythm**: Section-to-section: `2xl` (48px).

---

## 4. Component Patterns

### Buttons
- **Primary (brand green)**: `#2E6B54`, Hanken Grotesk base/lg, `md` padding (16px H, 12px V).
- **Secondary (surface + text)**: `#1E1B15` surface, `#F2EEE6` text.
- **Disabled**: 40% opacity of primary/secondary.
- **Border radius**: `sm` (6px). No rounded corners.
- **State**: Active = darker shade, no gradient.

### Status Indicators
- **Handled dot**: `#3FBE85` signal green, 8px diameter. Use sparingly; only mark completed actions.
- **Agents live**: 8px green dot + subtle pulsing animation (enter `cubic-bezier(0.16,1,0.3,1)`, 200ms).
- **Error badge**: `#C0492F` background, `#F2EEE6` text, xs/sm scale, `pill` radius (9999px).

### Inputs & Forms
- **Background**: `#262218` (surface-2), `#F2EEE6` text.
- **Border**: 1px `rgba(242,238,230,0.10)` (hairline).
- **Focus**: Border `#2E6B54`, outline none, box-shadow `0 0 0 3px rgba(46,107,84,0.1)`.
- **Label**: lg scale, `#F2EEE6`, `md` margin-bottom.
- **Helper text**: sm scale, `#A39A87` (muted).

### Cards & Panels
- **Background**: `#1E1B15` (surface).
- **Border**: None by default; use hairline rule (`rgba(242,238,230,0.10)`) for separation.
- **Padding**: `md` (16px) minimum.
- **Border radius**: `md` (10px).
- **Shadow**: None (no depth decoration; use background/border instead).

### Hairline Rules & Dividers
- **Color**: `rgba(242,238,230,0.10)`.
- **Weight**: 1px.
- **Use**: Separate sections, table rows, list items. Prefer over cards.

---

## 5. The Brand Device: "Handled" Status Dot

A small signal-green dot (`#3FBE85`, 8px diameter) marks any action the system has completed:
- ✓ Resolved support ticket
- ✓ Sent appointment reminder
- ✓ Confirmed booking
- ✓ Live agent active
- ✓ Synced data to Cognitive Brain
- ✓ Invoice sent

**Rules:**
- Use with discipline. It is the single recurring visual motif.
- Never use as filler or decoration.
- Pair with 1–2 words of context ("Handled", "Live", "Synced").
- Animation: Quiet entrance (fade-in 200ms), optional subtle pulse on live states.

---

## 6. UI Component Specs

### 6.1 Dashboard Header
**Height**: 56–64px | **Padding**: md (16px) vertical, lg (24px) horizontal
**Background**: Dark background (`#16140F`) with hairline rule bottom
**Elements**: Clinic name (left), agent status (right)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SafeSight Clinic            [●] Live Agents: 3 | Queries: 24 | ● Handled
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  [Dashboard]  [Staff]  [Skill Marketplace]  [Cognitive Brain]        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

Clinic Name (3xl / Fraunces, #F2EEE6):   "SafeSight Clinic"
Status Line (sm / Hanken Grotesk, #A39A87):
  • "● Live Agents: 3" (green dot = #3FBE85)
  • "Queries: 24" (neutral count)
  • "● Handled" (green dot for recent action)

Sub-nav (base / Hanken Grotesk):
  Active tab underline = #2E6B54 (2px, full width under tab)
  Inactive tabs = #A39A87
  Hover = #F2EEE6
```

**Spacing**:
- Clinic name to status line: xs (4px) vertical gap.
- Status items: sm (8px) between each.
- Header to sub-nav: md (16px) vertical.
- Sub-nav item padding: sm (8px) horizontal, xs (4px) vertical.

---

### 6.2 Skill Marketplace Tile

**Dimensions**: 280px wide × 320px tall (single card)
**Background**: `#1E1B15` | **Border**: hairline + md (10px) radius
**Hover state**: Background to `#262218`, border to `#2E6B54`

```
┌──────────────────────────────────────┐
│                                      │
│  ⚙️  Patient Intake Skill            │
│      v2.1  ●                         │
│                                      │
│  Automates new patient forms,        │
│  compliance checks, SMS consent.     │
│                                      │
│  Tags:                               │
│  intake  automation  gdpr            │
│                                      │
│                                      │
│  Installed: 2026-03-15  ●            │
│                                      │
│  [View] [Settings] [Disable]         │
│                                      │
└──────────────────────────────────────┘

Skill Name (xl / Fraunces):        "Patient Intake Skill"
Version + Status (sm / mono):      "v2.1 ● Handled" (green dot)

Description (base / Hanken):       "Automates new patient forms..."
Tags (xs / Hanken, #A39A87):       intake, automation, gdpr (pill badges)

Installed Date (sm / Hanken):      "Installed: 2026-03-15 ● Synced"

Button Group (3× sm buttons):      [View] [Settings] [Disable]
  Primary = View (brand green)
  Secondary = Settings, Disable
```

**Padding**: md (16px) all sides
**Gap between elements**: xs (4px) to sm (8px)

---

### 6.3 Cognitive Brain Search Bar

**Full-width search input** with contextual help and recent searches.
**Height**: 48px | **Background**: `#262218` (surface-2) | **Border**: hairline

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Search Cognitive Brain                                          [Search]   │
│ Search patient history, agent notes, decisions, orders                     │
│                                                                            │
│ Recent searches:                                                           │
│   • Dr. Chen's notes on eye exams (3 days ago)                            │
│   • Referral pathway for glaucoma (1 week ago)                            │
│   • Marcus H. — contact preferences (2 weeks ago)                         │
│                                                                            │
│ Pro tip: Use "tag:gdpr" or "type:booking" for advanced filters            │
└────────────────────────────────────────────────────────────────────────────┘

Input label (lg / Hanken, #F2EEE6):   "Search Cognitive Brain"
Helper text (sm / Hanken, #A39A87):   "Search patient history, agent notes..."

Recent section header (lg / Fraunces): "Recent searches"
Recent items (base / Hanken, #F2EEE6): List of past searches with date
  Each row: 1px hairline divider below

Pro tip (xs / Hanken, #A39A87):       "Use 'tag:gdpr' or 'type:booking'..."

Button (sm): "Search" (brand green, right-aligned)
```

**Spacing**:
- Label to input: xs (4px)
- Input height: lg (24px) interior, md (16px) padding
- Section gaps: md (16px)
- Recent item padding: sm (8px) vertical

---

### 6.4 Staff Task Feed

**Infinite scroll list** of tasks assigned to staff and agent actions.
**Each item**: 56–80px tall, hairline divider between.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ TASK FEED                                                                  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Emma Chen                                                  Today 10:23am    │
│ ● Review new booking requests for Thu              [View] [Mark as Done]   │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ AI — Patient Reminder Agent                         Today 8:42am          │
│ ● Sent 8 SMS reminders for tomorrow's visits                              │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Dr. Okonkwo                                         Yesterday 5:01pm       │
│ ✗ Follow up: Marcus H. — refer to ophthalmologist   [View] [Assign to...] │
│   Assigned to: Nurse Amara                          2 hours ago            │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Load more tasks...                                                         │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Task Item Structure:
  ┌─ Assignee Name (lg / Hanken, #F2EEE6)
  │  ● Status Dot + Task description (base / Hanken)
  │  [Button] [Button]
  │  Date (sm / mono, #A39A87, right-aligned)
  └─ Hairline divider (rgba(242,238,230,0.10))

Status Dot Legend:
  ● Green (#3FBE85) = Completed / Handled
  ✗ Red (#C0492F) = Blocked / Needs follow-up
  ⧖ Blue (#3B6B8F) = In progress
  (none) = Pending

Sub-text (sm / Hanken, #A39A87):
  "Assigned to: [Staff] [time] ago" (for delegated tasks)

Button Group: [View] or [Mark as Done] or [Assign to...]
  Primary button = action most likely (View/Mark as Done)
  Secondary = Assign/Delegate

Padding: md (16px) vertical, lg (24px) horizontal per item
Gap between items: 0px (ruled divider instead)
```

**Spacing**:
- Item vertical padding: md (16px)
- Item horizontal padding: lg (24px)
- Divider: 1px hairline
- Timestamp right margin: md (16px)

---

## 7. Implementation Guidelines

### Dark Mode Only
LAISA is night-only. No light mode toggle. All colors are calibrated for 23:00–06:00 reading.

### Anti-Slop Guardrails (Enforce in Review)
- ✗ No gradients (linear, radial, or text).
- ✗ No glow/aurora blur effects.
- ✗ No centered-everything hero layouts.
- ✗ No uniform rounded-corner bubble radius on all elements.
- ✗ No Inter, Sora, Roboto, or system-ui for display/body.
- ✓ The signal-green "handled" dot is the ONLY recurring ornament.
- ✓ Hairline rules and white space > boxes and cards.

### Motion Defaults
- **Entrance**: Fade-in + subtle translate (100–200ms, `cubic-bezier(0.16,1,0.3,1)`).
- **Exit**: Fade-out (200ms, `ease-in`).
- **Hover**: State change (50–80ms, no animation; instant visual feedback).
- **Live indicators**: Quiet pulse on status dots (optional, max 1.2s cycle).
- **Loading**: Spinner or progress bar; never aurora blob or shimmer.

### Accessibility
- All interactive elements: minimum 44×44px (touch target).
- Text contrast: ≥ 4.5:1 for body text (`#F2EEE6` on `#16140F` = 17.5:1).
- Focus indicator: 3px solid `#2E6B54` outline (no -outline: none).
- Color is never the only indicator; pair colors with icons, text, or patterns.

---

## 8. Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-10 | LAISA Desktop specs created (dark-only, clinic focus) | Focused branding guide for white-label desktop product. Uses StudEx Ai OS core design system (Fraunces, Hanken Grotesk, warm charcoal). Adds practical component specs and ASCII mockups for dashboard, marketplace, Cognitive Brain, task feed. |

---

## 9. Quick Ref: Copy Templates

### Empty State (Dashboard)
> "Your clinic is running smoothly. Agents are live. Check the **Task Feed** or **Cognitive Brain** to review recent actions."

### Success Toast
> "✓ **[Action]** handled. Changes synced to Cognitive Brain."

### Error State
> "Can't reach agent [name]. Try again in a moment, or **contact support**."

### Onboarding Hint (first-time clinic)
> "The **handled dot** appears when agents complete tasks: sent messages, confirmed bookings, resolved tickets. It's how you see the system working."

---

**Last updated**: 2026-07-10
**Version**: 1.0 (LAISA Desktop)
**Designer**: Tumelo Ramaphosa / StudEx
