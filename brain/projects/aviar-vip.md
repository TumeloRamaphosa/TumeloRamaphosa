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

## Open threads
- Confirm exact Stitch Payins calls against the Stitch dashboard
- Replace simulated matching/tracking with Supabase Realtime + Google Routes
- Refine [[or-tambo-international]] waypoint coordinates against on-site GPS
- Wire Supabase phone/email OTP auth (currently role-selection only)
