# LAISA — Milestone 1 Proposal & Invoice

**Prepared for:** SafeSight Eye Centre + LAISA Aesthetics
**Prepared by:** StudEx (powered by StudEx Ai OS)
**Date:** 2 June 2026
**Reference:** LAISA-2026-001
**Validity:** 14 days from issue

---

## 1. Executive Summary

LAISA is a unified operating layer for SafeSight and LAISA Aesthetics — one
brand, one dashboard, one assistant. It pulls bookings, payments, marketing,
patient communication and channel analytics into a single agent-run interface,
so the practice runs itself while the team focuses on patients.

This document covers **Milestone 1: Brand, Dashboard, Voice Assistant Demo,
and First Live Integration** — the client-facing surface, complete and ready
to demo. The remaining milestones (live agent backend, all-channel data
connectors, posting pipeline, mobile app, cognitive memory) follow as Phases 2
and 3 under separate scope.

---

## 2. What Has Been Built (Milestone 1)

A working, brandable product the client can sign off and demo today.

### 2.1 Public-facing website
- Marketing home page with the LAISA narrative
- Dedicated **SafeSight** medical practice page
- Full responsive design (mobile, tablet, desktop)
- Custom design system documented in `DESIGN.md` — warm, calm, editorial; no
  generic AI-tool styling

### 2.2 LAISA Dashboard (`/demo`)
- Top-line revenue, bookings, new-patient and traffic KPIs
- Business-unit switcher (Eye Centre · Aesthetics · All)
- Channel analytics tiles (Facebook · Instagram · Google Ads · WhatsApp)
- **ROI Panel** — operational cost-saving visualisation
- **GoodX Panel** — medical-aid claims status dashboard
- **Briefings Panel** — NotebookLM "before / after" video overviews

### 2.3 Charlie — WhatsApp Voice Assistant Demo
- WhatsApp-styled chat surface
- Scripted clinical-front-desk conversation (booking flow)
- **ElevenLabs voice integration** with browser-speech fallback
- Demonstrates the production behaviour patients will experience

### 2.4 Live Integration Layer
- **Composio** connection-status panel — live API integration
- Server-side API key handling (never exposed to the browser)
- Status indicators for Facebook, Instagram, WhatsApp, Google Ads, Gmail,
  Website — go-green the moment each channel is connected

### 2.5 Production-readiness
- TypeScript across the entire codebase
- Source code on GitHub, private branch ready for client handover
- Vercel-ready deployment configuration
- Environment-variable hygiene (`.env.local` gitignored, `.env.example`
  documented)

---

## 3. Time & Money the Client Saves

Numbers below are conservative estimates based on the dashboard's current
demo metrics (612 WhatsApp chats / month, 188 monthly bookings, R38K Google
Ads spend). Once Phase 2 connects live channel data, these become live
measurements rather than estimates.

### 3.1 Direct staff-time savings

| Activity (today, manual)       | Hours / month | Cost / month (R150–R250/hr) |
|--------------------------------|---------------|-----------------------------|
| WhatsApp / phone enquiries     | ~50 hrs       | R7,500 – R12,500            |
| Booking confirmations + reminders | ~12 hrs    | R1,800 – R3,000             |
| Multi-platform marketing reports | ~16 hrs     | R2,400 – R4,000             |
| Medical-aid claim status chasing | ~8 hrs      | R1,200 – R2,000             |
| **Subtotal**                   | **~86 hrs**   | **R12,900 – R21,500**       |

### 3.2 Direct revenue protection

| Mechanism                                    | Impact / month         |
|----------------------------------------------|------------------------|
| No-show reduction (automated reminders, ~30% fewer no-shows) | R3,000 – R6,000 protected |
| Better channel attribution → smarter ad spend (10–15% of R38K Google Ads) | R3,800 – R5,700 reclaimed |
| 24/7 WhatsApp capture of after-hours leads (15–20% uplift) | R8,000 – R14,000 new bookings |
| **Subtotal**                                 | **R14,800 – R25,700**  |

### 3.3 Combined monthly benefit

> **Conservative range: R27,700 – R47,200 / month** in saved time and protected /
> recaptured revenue, before any growth uplift.

That is **R332,000 – R566,000 per year**, against a Milestone 1 fee of
**R280,000** and a R25,000/month retainer (**R300,000/year**). The system pays
for itself inside the first 6–12 months and compounds from there.

### 3.4 Future benefits (Phase 2 onward, not invoiced here)

- Compounding patient data → better targeting, better creative, better ROAS
- Each new connector (TikTok, LinkedIn, GA4, Meta CAPI) multiplies signal
- 24/7 booking + voice assistance = competitive moat versus other clinics
- The brand and design system are **owned IP** — re-usable across new
  locations or sister practices at zero additional design cost

---

## 4. Team Effort to Date (Milestone 1)

| Discipline                                  | Hours    |
|---------------------------------------------|----------|
| Discovery, strategy & design system         | 18       |
| UI / UX design across site + dashboard      | 32       |
| Frontend engineering (Next.js, React, Tailwind) | 46   |
| Voice + WhatsApp demo (ElevenLabs)          | 14       |
| Live integration engineering (Composio API) | 12       |
| QA, accessibility, security review          | 10       |
| Project management, revisions, client liaison | 12     |
| **Total**                                   | **144 hours** |

Equivalent to roughly four senior-developer weeks of focused work,
compressed into a unified deliverable.

---

## 5. Scope Discipline — "More Days, More Ways = Custom Strategy"

This proposal covers Milestone 1 only. Changes outside this scope are quoted
separately and added to the next milestone, not retro-fitted into this fee.

**Inside scope (covered):** the deliverables listed in Section 2 plus two
rounds of revisions and 30 days of post-handover warranty support.

**Outside scope (quoted separately):** new pages, additional business units,
new channels beyond Composio's current set, custom integrations not listed,
patient portal features, billing flows, third-party software costs (ElevenLabs,
Composio subscription, hosting).

---

## 6. Investment — Itemised Invoice

### 6.1 Milestone 1 — fixed fee

| #  | Line item                                                     | ZAR        |
|----|---------------------------------------------------------------|------------|
| 01 | Discovery, brand audit & design system foundation             | R28,000    |
| 02 | Marketing website — home + SafeSight pages                    | R42,000    |
| 03 | LAISA dashboard — KPIs, channels, business-unit switcher      | R48,000    |
| 04 | ROI + GoodX + Briefings panels                                | R32,000    |
| 05 | Charlie WhatsApp demo + ElevenLabs voice integration          | R28,000    |
| 06 | Composio integration — live status API + UI                   | R20,000    |
| 07 | Responsive layout, theming, motion polish                     | R16,000    |
| 08 | QA, accessibility, performance & security validation          | R18,000    |
| 09 | Production deployment & environment configuration             | R14,000    |
| 10 | Documentation, handover & 30-day warranty                     | R14,000    |
| 11 | Project management, client liaison, in-scope revisions        | R20,000    |
|    | **Total (excl. VAT)**                                         | **R280,000** |

VAT additional at 15% if invoicing entity is VAT-registered.

### 6.2 Payment terms

| Schedule                                                  | Amount     |
|-----------------------------------------------------------|------------|
| **Deposit on contract signature (50%) — payable on signing** | **R140,000** |
| Final payment on Milestone 1 sign-off (50%)                | R140,000   |

Banking details supplied on contract execution.

### 6.3 Monthly management retainer — from Month 1

**R25,000 / month**, billed monthly in advance.

Covers:

- Monitoring of all connected social-media channels (Facebook, Instagram,
  WhatsApp, Google Ads) once live
- Monthly performance + ROAS report
- Data-quality checks and connector health
- Up to 4 hours of in-month change requests
- Priority bug response (next-business-day SLA)

Retainer tiers (selectable later):

| Tier         | Monthly fee | Inclusions                                                          |
|--------------|-------------|---------------------------------------------------------------------|
| **Care**     | R25,000     | As above                                                            |
| **Grow**     | R45,000     | Care + content production (4 posts/month, Higgsfield-generated)     |
| **Scale**    | R75,000     | Grow + paid-media management + weekly performance reviews           |

---

## 7. Validation Before Demo

Before the demo presentation, the build is validated through the StudEx
quality pipeline:

1. **Functional QA** — end-to-end testing of every dashboard panel and the
   Charlie voice demo
2. **Design QA** — designer's-eye visual audit against `DESIGN.md`
3. **Security audit** — credentials hygiene, API surface review (medical
   context)
4. **Performance benchmark** — Core Web Vitals baseline
5. **Code-quality score** — typed, linted, no dead code

Validation reports are attached as appendices to the demo presentation.

---

## 8. Demo Access

On signature of this proposal:

- Live demo URL (Vercel) issued to nominated client emails
- Read-only GitHub access to the source repository
- WhatsApp voice demo walkthrough recording
- Brand & design system documentation pack
- 30-minute live walkthrough call with the StudEx team

---

## 9. Acceptance

By signing below, the client accepts this proposal, the scope described in
Section 2, the investment in Section 6, and authorises the deposit invoice
for R140,000 to be issued.

**For SafeSight + LAISA Aesthetics**

Name: ______________________________________

Title: ______________________________________

Signature: __________________________________   Date: _______________

**For StudEx**

Name: T. Ramaphosa

Title: Founder, StudEx

Signature: __________________________________   Date: _______________

---

*Thank you for the trust. We are building a clinic that runs itself, so your
team can focus on the patients in front of them.*
