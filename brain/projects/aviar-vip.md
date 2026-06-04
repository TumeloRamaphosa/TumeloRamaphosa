---
type: note
title: Aviar VIP — Private Airport Ride Concierge
tags: [project, mobile, react-native, expo, stitch, supabase]
status: active
---

# Aviar VIP

Private VIP airport-ride concierge. The pitch: *"from your door to the door of
the aircraft."* Connects riders with VIP chauffeurs, drives them to
[[or-tambo-international]], then hands off to an airport VIP agent who escorts
them through fast-track security, the lounge, and (top tier) an apron transfer
to the aircraft. Built for [[tumelo-ramaphosa]].

## Stack
- **Expo (React Native) + TypeScript**, file-based routing via `expo-router`
- **Supabase** — Postgres + Auth + RLS + Realtime + Edge Functions
- **Stitch (stitch.money)** — South African payment gateway, ZAR
- **Google Maps / Street View** — trip map + OR Tambo walking-track preview

## Roles
- **Rider** — book → live trip → VIP hand-off → Street View walkthrough
- **Chauffeur** — cockpit that drives the trip lifecycle
- **Airport VIP agent** — OR Tambo console that advances the escort

## Service tiers
- Executive — premium sedan + curbside VIP hand-off
- First Class — luxury SUV, fast-track security & lounge
- Sovereign — door-to-aircraft, escorted onto the apron

## Location
- Lives in `vip-airport-app/` on branch `claude/vip-airport-ride-app-W6fRR`
- Verified: `tsc --noEmit` clean; bundles for iOS via Metro (1257 modules)

## Decisions (2026-06-04)
- **Invite-only** access (rider onboarding gated by invite code).
- Stack stays **Supabase + Stitch** (not Clerk/Stripe) for SA/ZAR fit.
- In-app **3D via Three.js / expo-gl** (Remotion is web-only → optional promo
  pipeline later, not in-app).
- Build via a **parallel sub-agent swarm** + gates (tsc, Metro bundle,
  code-review, security-review). [[gstack]] installed for QA/review skills
  (browser QA blocked by sandbox network policy).
- Reference studied: adrianhajdin/uber (patterns adopted, not copied).

## Phase 1 shipped (functional core)
- Google Places autocomplete (SA) + live device location for any pickup
- Invite-only gate; secure invite RLS via SECURITY DEFINER RPCs (check/redeem)
- History + Profile screens; Supabase rides data layer (demo fallback)
- See `vip-airport-app/docs/roadmap.md` for the full phased plan.

## Open threads
- Confirm exact Stitch Payins calls against the Stitch dashboard
- Replace simulated matching/tracking with Supabase Realtime + Google Routes
- Refine [[or-tambo-international]] waypoint coordinates against on-site GPS
- Wire Supabase phone/email OTP auth; then call redeem_invite post-auth and
  enforce invite/payment on server-side ride creation
- Phase 2+: QR-code handover, driver police-clearance vetting, [[cape-town-international]] (CPT), Russia–SA trade news feed, in-app 3D
