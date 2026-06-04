# Aviar VIP — build roadmap

Premium, invite-only VIP airport-ride concierge for South Africa. Door-to-door
chauffeur → airport VIP escort → aircraft. Stack stays **Expo + Supabase +
Stitch (ZAR)**; in-app 3D via **Three.js / expo-gl**.

Status legend: ✅ done · 🚧 in progress · ⬜ planned

## Phase 1 — Functional core (close the gaps vs a standard ride app) 🚧
Bring the app to feature-parity with a real ride app, on our premium base.
- ⬜ Real auth: Supabase phone/email OTP, session gating by `profiles.role`
- 🚧 **Invite-only** access: invite-code table + gated onboarding
- 🚧 **Google Places autocomplete** for any pickup (+ SA country restriction)
- 🚧 **Live device location** (expo-location) → current-location pickup
- 🚧 Supabase-persisted rides (create/list) with demo fallback
- 🚧 **History** screen (past trips, spend, ratings)
- 🚧 **Profile** screen (identity, membership, preferences, settings)
- ⬜ Real driver↔rider matching over Supabase Realtime (replace simulation)

## Phase 2 — Trust & access ⬜
- ⬜ **QR-code handover**: signed per-ride token; driver↔rider and agent↔rider
  scan to confirm pickup and each escort step (`expo-camera`)
- ⬜ **Driver vetting**: police-clearance / criminal-record check status, ID +
  document upload, "Cleared" verified badge surfaced to riders
- ⬜ Rider safety: share-trip, SOS

## Phase 3 — Multi-airport ⬜
- ⬜ Generalise airport data model; add **Cape Town International (CPT)** with
  its own VIP Street-View walking track + airport picker (JNB/CPT)

## Phase 4 — Content & sophistication ⬜
- ⬜ **News feed**: Russia–South Africa business & trade (news API/Firecrawl,
  cached in Supabase, in-app feed tab)
- ⬜ **In-app 3D** (Three.js/expo-gl): animated brand intro + 3D vehicle &
  route visualisation
- ⬜ (Optional, later) Remotion web pipeline for rendered promo videos +
  marketing landing page

## Execution model — the "swarm" + validation
- **Parallel sub-agents** (worktree- or file-disjoint) for independent screens/
  components; shared infra built on the main line, then integrated.
- **gbrain** holds durable project memory (decisions, entities) — brain-first.
- **gstack** installed for QA/review skills; browser QA limited here (Chromium
  download blocked by the sandbox network policy).
- **Gates every change must pass:** `tsc --noEmit`, Metro bundle (`expo export`),
  `/code-review`, `/security-review`. Honest pass/fail — no green-washing.
