# Aviar VIP — Private Airport Concierge (React Native / Expo)

> From your door to the door of the aircraft.

A premium ride-hailing app that does what Uber doesn't: it connects riders
with VIP chauffeurs, drives them to **OR Tambo International (JNB)**, and then
hands them to an **airport VIP agent** who escorts them — fast-track security,
lounge, and (top tier) an **apron transfer right up to the aircraft stairs**.
Riders can preview the exact OR Tambo walking route in **Google Street View**
before they travel. Payments run through **Stitch (stitch.money)** in ZAR.

This is the **MVP foundation**: a complete, runnable skeleton of the whole
journey across all three roles — Rider, Chauffeur, and Airport VIP Agent.

---

## The journey

```
Rider books  ──►  Chauffeur matched  ──►  Drive to OR Tambo  ──►  VIP arrivals
     │                                                                 │
     ▼                                                                 ▼
 Pay (Stitch)                                          Airport agent hand-off
                                                                       │
        Curb → Baggage → Fast-track → Lounge → Concourse → ✈ Aircraft │
                         (previewable in Google Street View)          ▼
                                                            Hand-off complete
```

## Tech

- **Expo (React Native) + TypeScript**, file-based routing via **expo-router**
- **Supabase** — Postgres + Auth + RLS + Realtime + Edge Functions
- **Stitch** — South African payment gateway (cards + instant EFT, ZAR)
- **Google Maps / Street View** — trip map + the OR Tambo walking track
- `react-native-maps`, `react-native-webview`

## Run it

```bash
cd vip-airport-app
npm install
cp .env.example .env      # fill in keys (optional for demo mode)
npx expo start            # press i / a, or scan with Expo Go
```

**Demo mode:** with no Supabase keys set, the entire ride lifecycle runs
locally so you can play the full journey on one device. Use the **role
switcher** (top-right on the dashboards) to hop between Rider, Chauffeur, and
Agent without losing the active ride.

> To see the **Street View** walkthrough of OR Tambo, set
> `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (Maps Embed API enabled).

## Project layout

```
app/                       expo-router screens
  index.tsx                role selection / entry
  rider/                   book → trip → handover → street-view track
  driver/                  chauffeur cockpit (drives the trip lifecycle)
  agent/                   OR Tambo VIP agent console (advances the escort)
src/
  components/              UI kit, MapPreview, StreetViewPano, timelines
  context/AppContext.tsx   ride/handover/payment state + demo simulation
  constants/               theme, service tiers, demo seed data
  data/orTamboTrack.ts     the OR Tambo VIP walking track (waypoints)
  lib/                     supabase, payments (Stitch), geo, street view
supabase/
  migrations/0001_init.sql tables + enums + RLS + new-user trigger
  functions/
    stitch-create-payment/ creates a Stitch payment, returns checkout URL
    stitch-webhook/         marks payments paid on Stitch callback
```

## Backend setup (when you're ready to go live)

1. Create a Supabase project; run `supabase/migrations/0001_init.sql`.
2. Set `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`.
3. Deploy the Edge Functions and set Stitch + service-role secrets:
   ```bash
   supabase functions deploy stitch-create-payment
   supabase functions deploy stitch-webhook --no-verify-jwt
   supabase secrets set STITCH_CLIENT_ID=... STITCH_CLIENT_SECRET=... \
     STITCH_ENV=sandbox STITCH_REDIRECT_URI=aviar://payment/return \
     SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
   ```
4. Register the `stitch-webhook` URL in your Stitch dashboard.

## Known scaffolding / next steps

- **Stitch calls** in `stitch-create-payment` follow the Payins shape but
  should be confirmed against your Stitch dashboard (token client-assertion
  JWT, exact mutation name, redirect field). Without keys it returns a sandbox
  stub so the app still runs end to end.
- **Verify the webhook signature** in `stitch-webhook` (marked TODO).
- **Auth** is role-selection only in the foundation; wire Supabase phone/email
  OTP and gate the role tabs by `profiles.role`.
- **Live matching & tracking** currently simulated in `AppContext`; replace
  with Supabase Realtime channels + the Google Routes API for true ETAs and a
  moving driver marker.
- **OR Tambo coordinates** in `data/orTamboTrack.ts` are hand-placed; refine
  against on-site GPS and confirm indoor Street View coverage per waypoint.
- Add a **rider safety** layer (share trip, SOS), ratings, and trip history.

---

_Built as the foundation for a private VIP airport service. Not affiliated
with Uber, Stitch, Google, or Airports Company South Africa._
