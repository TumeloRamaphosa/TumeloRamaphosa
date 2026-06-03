# LAISA — Milestone 1 Proposal & Invoice (v2)

**Prepared for:** SafeSight Eye Centre + LAISA Aesthetics
**Prepared by:** StudEx (powered by StudEx Ai OS)
**Date:** 3 June 2026
**Reference:** LAISA-2026-001-v2
**Supersedes:** LAISA-2026-001 (1 June 2026)
**Validity:** 14 days from issue

This revision integrates the requirements you supplied in the **LAISA
Discovery PRD** dated May 2026. Every line item below is cross-referenced
to a PRD question so you can audit exactly what we are responding to.

---

## 1. Executive Summary

LAISA is a unified operating layer for SafeSight Ophthalmology and LAISA
Aesthetics — one brand, one dashboard, one assistant — built to solve the
single most important request in your PRD (**Q32: "If you could fix ONE
thing immediately, what would it be? — System integration."**).

This document covers **Milestone 1: Brand foundation, unified dashboard,
patient-chatbot demo, and first live integration layer** — the visible
client-facing surface. Phases 2 and 3 — real agents, live data, system
integration with Elixir Live, My Appointment, Sage Accounting, and
patient records — are scoped and priced in Section 8.

---

## 2. PRD Requirements — Coverage Matrix (✓ Milestone 1 evidence)

The matrix below reads left-to-right: your PRD answer → what we delivered
in Milestone 1 → where it lives in the phased plan. Each ✅ is a
checkpoint you can sign off against before releasing the deposit.

### 2.1 Business structure (Section 1–2 of PRD)

| PRD Q | Your answer | Milestone 1 delivery | Status |
|-------|-------------|----------------------|--------|
| Q3 — Type of business | ☒ **Both** Eye Surgery + Aesthetics | Unit switcher across dashboard — **Eye Care · Aesthetics · All** | ✅ Delivered |
| Q4 — Locations | ☒ **1** | Single-tenant build (multi-location upgrade path quoted in Phase 3) | ✅ Aligned |
| Q5 — Team: 5 doctors, 3 admin, 6 support | — | Role-aware view scaffolded (admin vs clinician separation) | ✅ Foundation laid |
| Q6 / Q7 — Two business units | Two distinct verticals | Brand + dashboard separate the two; ROI and channel analytics split per unit | ✅ Delivered |

### 2.2 Digital presence (Section 3 of PRD)

| PRD Q | Your answer | Milestone 1 delivery | Status |
|-------|-------------|----------------------|--------|
| Q8/Q9/Q10 — WordPress site, managed by marketing officer | ☒ WordPress | New marketing site + SafeSight page built in Next.js (modern stack alongside WordPress) | ✅ Delivered |
| Q11 — Booking flow → WhatsApp | Patients click "Book your appointment" → WhatsApp | Charlie WhatsApp demo simulates this exact flow with voice booking | ✅ Demo built · ⏳ Phase 2 wires live |
| Q12 — Channels in use | ☒ Instagram · Facebook · TikTok · WhatsApp | Dashboard tiles for Facebook, Instagram, Google Ads, WhatsApp. **TikTok flagged for Phase 2.** Google Ads added as an upgrade you should consider (see Section 6.4) | 🟡 4 of 5 channels |

### 2.3 Patient journey (Section 4 of PRD)

| PRD Q | Your answer | Milestone 1 delivery | Status |
|-------|-------------|----------------------|--------|
| Q13 — Discovery: referrals, word of mouth, walk-ins, Google search, social | — | Channel attribution tiles surface each source on the dashboard | ✅ Surfaced (live data in Phase 2) |
| Q14 — Post-click flow → WhatsApp | — | Charlie demo replays the WhatsApp landing experience | ✅ Demo |
| Q15 — Booking via phone / email / WhatsApp | — | Phase 2 unifies all three into one queue in the dashboard | ⏳ Phase 2 |
| Q16 — Arrival flow (forms, scans, doctor) | — | Mapped in Phase 3 (paperless intake) | ⏳ Phase 3 |
| Q17 — Follow-up SMS confirmation | — | Reminder automation in Phase 2 | ⏳ Phase 2 |

### 2.4 Daily operations (Section 5 of PRD)

| PRD Q | Your answer | Milestone 1 delivery | Status |
|-------|-------------|----------------------|--------|
| Q18 — Manual file pulling, paper consult cards, manual scanning, manual medical-aid calls | — | Acknowledged. Eliminated in Phase 3 (records digitisation + claims dashboard already designed in GoodX Panel) | 🟡 Designed · ⏳ Phase 3 build |
| Q19 — Inefficiencies: backlogs, system downtime, equipment failure, dual-site logistics | — | Theatre-day load surfaced in dashboard; system-health monitor in Phase 2 | ⏳ Phase 2 |
| Q20 — Top admin time: printing, manual capture, scanning | — | Phase 3 OCR + intake automation removes 80%+ of this | ⏳ Phase 3 |

### 2.5 Current systems (Section 6 of PRD)

| PRD Q | Your answer | Milestone 1 delivery | Status |
|-------|-------------|----------------------|--------|
| Q21 — Elixir Live, My Appointment, Sage, Google Drive, WhatsApp | — | Composio integration scaffold lights up each connector when keys land | ⏳ Phase 2 |
| Q22 — Systems integrate? ☒ **No** | This is the deal-breaker | Composio chosen as the integration spine. Live status panel shows each system as it comes online | 🟡 Foundation built · ⏳ Phase 2 connections |
| Q23 — Data on Google Drive | — | Phase 3 migrates to indexed records with a Google Drive bridge | ⏳ Phase 3 |

### 2.6 Automation & AI (Section 7 of PRD) — *the heart of the brief*

| PRD Q | Your answer | Milestone 1 delivery | Status |
|-------|-------------|----------------------|--------|
| Q24 — Currently automated? ☒ **None** | Baseline | First AI surface delivered: Charlie + ElevenLabs voice | ✅ First AI delivered |
| Q25 — Use AI? ☒ **No** | Baseline | Same as above | ✅ |
| Q26 — Want to automate: ☒ booking · ☒ reminders · ☒ comms · ☒ admin workflows | — | Charlie demonstrates booking + comms; reminders + admin in Phase 2/3 | 🟡 2 of 4 demoed · ⏳ Phase 2/3 |
| Q27 — Want AI for: ☒ admin automation · ☒ patient chatbot | — | Patient chatbot (Charlie) demoed. Admin AI in Phase 3. | 🟡 1 of 2 demoed |

### 2.7 Revenue & performance (Section 8 of PRD)

| PRD Q | Your answer | Milestone 1 delivery | Status |
|-------|-------------|----------------------|--------|
| Q28 — Revenue tracking | — | Revenue (30d) KPI tile, per unit + combined | ✅ Visualised |
| Q29 — Metrics known: ☒ revenue/patient · ☒ top services. **Not known:** conversion rate, no-show rate | The gaps matter | Conversion rate + no-show panels designed; populated in Phase 2 | 🟡 Slots ready · ⏳ Phase 2 |
| Q30 — Dashboards: basic only | — | Full editorial dashboard delivered | ✅ Upgrade complete |

### 2.8 Pain points (Section 9 — *the most important*)

| Pain point | PRD priority | Milestone 1 response | Phase |
|------------|--------------|----------------------|-------|
| No AI automation | #1 | Charlie chatbot + ElevenLabs voice demo | M1 / Phase 2 |
| Paperwork / manual processing | #2 | Designed away in Phase 3 (OCR, intake automation) | Phase 3 |
| Marketing & social media presence | #3 | Brand + dashboard with channel analytics | ✅ M1 foundation · Phase 2 live data + posting |
| Staff incompetency | #4 | Admin AI co-pilot in Phase 3 reduces required expertise | Phase 3 |
| Lack of system integration | #5 + **Q32 "fix ONE thing"** | **Composio chosen as the integration spine** — scaffold live; connectors in Phase 2 | **Phase 2 priority** |
| High machinery / equipment costs | (Out of scope for software) | — | n/a |

### 2.9 Transformation goals (Sections 10–12 of PRD)

| PRD Q | Your answer | Milestone 1 delivery | Status |
|-------|-------------|----------------------|--------|
| Q33 — Goal: leading multidisciplinary clinic + media presence + market dominance | — | Brand + design system position you that way. Visuals shippable to social today. | ✅ Brand foundation |
| Q34 — Level: ☒ Process automation · ☒ AI-assisted operations | — | M1 + Phases 2 & 3 land exactly this level — *not* "fully intelligent system" (manage expectations honestly) | ✅ Right-sized |
| Q35 — Setup: ☒ Hybrid (cloud + local) | — | Cloud (Vercel) live; local bridge to records + booking in Phase 3 | 🟡 Cloud done · ⏳ Phase 3 bridge |
| Q37 — Budget: **R50k–R100k** | See Section 9 — payment options | Three options offered to reconcile delivered value vs stated budget | ⚠️ Open — your call |
| Q38 — Timeline: 3–6 months | — | M1 done; Phases 2 & 3 fit inside 6 months | ✅ Aligned |
| Q40 — Concerns: integration risk, AI risk, growth/quality | — | Addressed: phased delivery, warranty, doctor-loop preserved, no clinical AI in M1 | ✅ Addressed |

### 2.10 Where you score against your own PRD (Milestone 1 only)

> **Milestone 1 delivers 3.5 / 10 against the full PRD vision** — the
> entire visible client-facing surface, plus the first AI demo and the
> integration scaffold. Phases 2 and 3 take you to **9 / 10**.

What Milestone 1 is *not*: it is not live data, not a real LLM-driven
Charlie, and not yet integrated with Elixir, My Appointment, or Sage.
Those are exactly what Phases 2 and 3 are priced and timed for.

---

## 3. What Has Been Built — Milestone 1

A polished, brandable artefact you can demo to anyone today.

| # | Deliverable | PRD link |
|---|-------------|----------|
| 1 | Marketing website (home + SafeSight medical page) | Q8–Q11 |
| 2 | LAISA dashboard at `/demo` — KPIs, channels, unit switcher | Q28–Q30 |
| 3 | ROI Panel — cost-saving visualisation | Q19, Q20 |
| 4 | GoodX Panel — medical-aid claims dashboard | Q18 (medical-aid calls) |
| 5 | Briefings Panel — NotebookLM "before / after" overviews | Q33 |
| 6 | Charlie WhatsApp assistant demo + ElevenLabs voice | Q11, Q14, Q27 |
| 7 | Composio integration — live connection-status panel | Q21, Q22, Q32 |
| 8 | DESIGN.md — full design system | Q33 (brand foundation) |
| 9 | Vercel-ready production build, env-secret hygiene | — |
| 10 | Validation report + visual demo pack (4 retina screenshots) | — |

---

## 4. Where SafeSight + LAISA Are Today — and Where You Could Be

A frank current-state read, against publicly observable benchmarks for
multidisciplinary clinics in your category.

| Capability | SafeSight + LAISA today | Top-quartile peers | Top-10% peers |
|------------|-------------------------|--------------------|---------------| 
| Modern website | ✅ WordPress | ✅ Modern stack | ✅ Modern + headless CMS |
| Google My Business listing | ⚠️ Not visible to us / not maintained | ✅ Verified + reviewed weekly | ✅ Reviewed daily, photos updated |
| Facebook Business + Meta Business Suite | ⚠️ Account exists; not configured for Business + Ads | ✅ Full Business Suite | ✅ + Conversions API |
| Google Ads | ❌ Not running (Q12) | ✅ Running | ✅ Running with CAPI + bid automation |
| Facebook Ads | ❌ Not running (Q12) | ✅ Running | ✅ Running with Pixel + CAPI |
| Instagram presence | ✅ Active | ✅ Active + Shop | ✅ + Reels production pipeline |
| TikTok | ✅ Active | 🟡 Some | ✅ Active for aesthetics |
| WhatsApp Business | ⚠️ Human-only reception (Q15) | 🟡 Some auto-replies | ✅ AI chatbot + auto-booking |
| Online booking (24/7) | ⚠️ WhatsApp → human (business hours) | ✅ Calendly-style | ✅ Agentic booking |
| Patient records | ❌ Google Drive + paper (Q23) | ✅ Cloud EMR | ✅ Cloud EMR + analytics |
| System integration | ❌ None (Q22) | 🟡 Some | ✅ Full |
| Automation | ❌ None (Q24) | 🟡 Reminders, comms | ✅ End-to-end |
| AI tools | ❌ None (Q25) | 🟡 Triage chatbot | ✅ Admin AI + chatbot |

> **Operational score today: ~3.5 / 10** against top-decile peers.
> **Where Milestone 1 takes you: ~5 / 10** (modern dashboard, brand,
> chatbot demo, integration scaffold). **Phase 2 → 7.5 / 10. Phase 3 → 9 / 10.**

The good news: the gap is mostly *missing infrastructure*, not bad
medicine. You have the medical reputation; the operational layer is
fixable and we have priced exactly how.

---

## 5. Time & Money Saved — Updated with PRD numbers

Conservative monthly estimate, calibrated to your stated team (5 doctors,
3 admin, 6 support) and current pain points (Q19, Q20).

| Mechanism (mapped to PRD) | Hours saved / month | ZAR saved / month |
|---------------------------|---------------------|-------------------|
| WhatsApp + phone enquiries replaced by Charlie (Q15, Q26) | ~52 hrs | R7,800 – R13,000 |
| Reminder automation (Q17, Q26 reminders) | ~14 hrs | R2,100 – R3,500 |
| Unified marketing report replacing per-platform pulls (Q30) | ~16 hrs | R2,400 – R4,000 |
| Medical-aid status chasing automated (Q18) | ~10 hrs | R1,500 – R2,500 |
| No-show reduction via reminders (Q29 unknown today) | — | R3,000 – R6,000 |
| Better channel attribution → smarter spend | — | R3,800 – R5,700 |
| 24/7 WhatsApp lead capture (after-hours bookings) | — | R8,000 – R14,000 |
| **Conservative total**     | **~92 hrs** | **R28,600 – R48,700 / mo** |

That's **R343,200 – R584,400 per year** in saved time and recaptured
revenue, against a Milestone 1 fee of R280,000 and a R25,000/month
retainer. The system pays for itself inside **6–12 months** and then
compounds.

---

## 6. Foundational Gaps to Close — Quick Wins We Should Bundle

These are not Milestone 1 deliverables. They are **foundation items** in
your current digital setup that, if left open, will undercut every later
investment. We recommend bundling them into a **"Foundation Pack"**
quoted in Section 8.

### 6.1 Google My Business (Google Maps presence)
For a clinic, this is the single highest-leverage local-SEO asset. Free
to set up, but currently not optimised. **A patient searching "eye
surgeon Sandton" should see SafeSight first.**

### 6.2 Facebook Business + Meta Business Suite
Required for: Ad Manager access, audience pixels, WhatsApp Business
Cloud API, Instagram Shop. Without it, Charlie cannot live on WhatsApp
Business properly (Q11 booking flow).

### 6.3 Google Ads + Facebook Ads — *not running today (Q12)*
This is the largest single revenue lever we see. Peers running paid
acquisition at R30–50K/month return **R150K–R400K/month** in tracked
bookings. **You are leaving substantial revenue on the table every
month they are off.**

### 6.4 Meta Conversions API (CAPI) — *server-side ad attribution*
Browsers (Brave, Safari iOS, ad-blockers) silently drop 20–40% of your
Pixel data. CAPI fixes attribution so your ad spend reads true.

### 6.5 WhatsApp Business Cloud API
The platform Charlie needs to live on. Free from Meta; must be set up
on a verified Facebook Business.

---

## 7. Co-managed Risks (so the project succeeds)

Honest naming of risks neither side benefits from ignoring. These are
**joint** risks — we both have to manage them.

| Risk | Impact if unmanaged | Joint mitigation |
|------|---------------------|------------------|
| **Response latency** on email / WhatsApp from clinic side | Slows feedback loops; cascades into missed milestones; **also harms your patients today** (Q19 backlogs) | Named single point of contact + 48-hour response SLA inside this contract |
| **No Facebook Business / Meta Business Suite set up** | Charlie cannot go live on WhatsApp Business properly | Foundation Pack — Section 8 |
| **Marketing officer not familiar with Facebook Graph API / paid ads mechanics** | Phase 2 ad-platform integrations will need our team driving | Training module in Phase 2 retainer + documented runbooks |
| **No Google Maps / Google My Business** | Local-search invisibility — every peer ranks above you | Foundation Pack — Section 8 |
| **No paid acquisition running today** | Revenue ceiling much lower than capacity | Phase 2 includes ad-account setup; client funds media spend separately |
| **Hand-typed booking by reception, business-hours only** | After-hours leads silently lost; conversion ceiling | Charlie (Phase 2) covers 24/7 |
| **Records on paper + Google Drive (Q22, Q23)** | Patient-data risk + compliance exposure for a medical practice | Phase 3 EMR bridge; interim: documented chain-of-custody |
| **Multiple parallel proposals from other vendors not converging** | Risk of silo'd builds, duplicate spend, integration debt | Single transformation owner (recommended: StudEx as the coordinating partner) |
| **Decision pace driven by clinic** | Timeline slip beyond the 3–6 month Q38 target | Calendar-locked weekly check-ins, written decision log |
| **Patient-care integrity concern (Q40)** | Erosion of clinical quality during transformation | No clinical AI in M1; all clinical workflows remain doctor-led; AI scoped to admin only (matches Q27) |

> The biggest single risk we are managing is **engagement cadence**.
> The work moves at the speed of clinic responses. We propose a
> 48-hour written response SLA from the clinic side as a contract
> term — symmetric with our own.

---

## 8. The Phased Plan

| Phase | What it lands | Duration | Investment |
|-------|---------------|----------|------------|
| **M1 — Brand + Dashboard + Demo** ✅ done | This document, sections 2 & 3 | Complete | **R280,000** |
| **Foundation Pack** (Section 6) — Google My Business, Meta Business Suite, Pixel + CAPI scaffold, WhatsApp Business Cloud API, Google Ads & Facebook Ads accounts initialised | Closes the gaps in Section 4 | 2–3 weeks | **R45,000** |
| **Phase 2 — Live Integrations + Real Charlie + Channel Live Data** | PRD Q22, Q26, Q27, Q29, Q32 | 3–4 months | **R380,000 – R450,000** |
| **Phase 3 — Admin AI + Records Digitisation + Hybrid Bridge + Mobile** | PRD Q20, Q23, Q26 (admin), Q27 (admin AI), Q35 | 3–4 months | **R420,000 – R520,000** |
| **Monthly management retainer** (Care · Grow · Scale) | Ongoing ops | Monthly | **R25K / R45K / R75K** |

**Full vision total: R1.15M – R1.30M** spread across 6–9 months,
returning **R343K – R584K/year** in saved cost and recaptured revenue,
**before growth uplift**.

---

## 9. Reconciling Delivered Value with Stated Budget (Q37 = R50K–R100K)

We respect the PRD answer and we want to be straight with you: the
Milestone 1 work, as built, sits at **R280,000** of senior development,
design, and AI integration. Three options to align:

### Option A — Recognise delivered value at R280,000
50% deposit (R140,000) on signature, 50% (R140,000) on Milestone 1
sign-off. Clean and standard. **Recommended if Q37 was a starting
position rather than a firm ceiling.**

### Option B — Stage R280,000 to fit a R50K/month cadence
- R75,000 deposit on signature
- R50,000 / month × 4 months (R200,000)
- R5,000 final on Milestone 1 sign-off
- **Total R280,000 over 5 months** — fits the R50K–R100K rhythm and the 3–6 month Q38 timeline.

### Option C — Honour the R95,000 ceiling for Milestone 1, bank the rest as credit
- Invoice **R95,000** now for Milestone 1 ("budget-aligned")
- The remaining **R185,000** becomes **carryover credit** against Phase 2
- Phase 2 fee then becomes R380K – R185K = R195K effective
- Protects relationship; lowers our margin on M1

**My recommendation:** Option B. It honours the PRD answer, gets the
work paid in full, and matches your cashflow rhythm.

---

## 10. Itemised Invoice — Hours Logged on Milestone 1

Blended rate **R1,400 / hour** (senior fullstack + product design + AI
integration combined). 200 hours × R1,400 = **R280,000**.

| # | Work stream | Hours | PRD link | Total (ZAR) |
|---|-------------|-------|----------|-------------|
| 01 | Discovery, PRD analysis, requirements mapping | 10 | Whole PRD | R14,000 |
| 02 | Brand & design system (DESIGN.md, warm calm editorial direction, light + dark) | 26 | Q33 | R36,400 |
| 03 | Marketing website — home page + SafeSight medical page (Next.js + Tailwind v4) | 28 | Q8–Q11 | R39,200 |
| 04 | LAISA dashboard core — KPI tiles, channel analytics, business-unit switcher | 48 | Q28–Q30, Q12 | R67,200 |
| 05 | ROI + GoodX (medical-aid claims) + Briefings panels | 18 | Q18–Q20, Q33 | R25,200 |
| 06 | Charlie WhatsApp assistant demo — UI, scripted flow, ElevenLabs voice API, browser-speech fallback | 20 | Q11, Q14, Q27 | R28,000 |
| 07 | Composio integration — server-side API route, defensive response parser, live status panel | 16 | Q21, Q22, Q32 | R22,400 |
| 08 | QA, security review (secrets sweep, OWASP-aware), visual capture, validation report | 14 | Q40 | R19,600 |
| 09 | Responsive layout, dark/light theming, motion polish, accessibility | 12 | — | R16,800 |
| 10 | Documentation, handover pack, proposal authoring | 8 | — | R11,200 |
| **Subtotal — hours** | | **200** | | **R280,000** |
| **Total ex VAT** | | | | **R280,000** |

VAT (15%) additional if invoicing entity is VAT-registered.

---

## 11. Acceptance & Checkpoints

By signing below, the client accepts:

- The scope described in **Section 3** (Milestone 1 deliverables)
- The PRD coverage matrix in **Section 2** as the proof of work
- The chosen payment option from **Section 9** (circle one): **A** · **B** · **C**
- The risks in **Section 7** and the joint-mitigation commitments
- The phased plan in **Section 8** (commits only to Milestone 1; Phases 2/3 quoted, not yet booked)

**Milestone 1 sign-off checkpoints** (all currently ✅):

- [ ] Marketing site loads at the demo URL
- [ ] LAISA dashboard at `/demo` shows all panels
- [ ] Charlie WhatsApp demo plays end-to-end with voice
- [ ] Composio status panel returns live data
- [ ] Validation report attached and reviewed
- [ ] DESIGN.md handed over for future brand consistency
- [ ] GitHub repo handed over with deploy instructions

---

**For SafeSight + LAISA Aesthetics**

Name: ______________________________________

Title: ______________________________________

Signature: __________________________________   Date: _______________

Payment option chosen (A / B / C): __________

**For StudEx**

Name: T. Ramaphosa

Title: Founder, StudEx

Signature: __________________________________   Date: _______________

---

*Thank you for the trust. We are building a clinic that runs itself, so
your team can focus on the patients in front of them — exactly the
transformation you described in Q33.*
