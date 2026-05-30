# Going live in a Manus Ubuntu container

This is the deployment recipe for running the **cloud half** of the home
automation hub (the Next.js dashboard + a demo-seed connector) inside a Manus
Ubuntu container. The **home half** — real WiFi/USB/BLE discovery, HomeKit
via HomeClaw, HomePod/AirPlay — still requires a Mac mini on your home
network. Until that machine exists, the container runs the connector in
`--seed-only` mode so the dashboard is alive with realistic demo devices.

## Architecture in the container

```
   ┌───────── Manus Ubuntu container (the cloud half) ─────────┐
   │                                                            │
   │  Next.js dashboard (port 3000)  ◄── browser                │
   │                                                            │
   │  Hub Connector (seed mode)  ──── outbound ──► Supabase     │
   │    └─ publishes 6 synthetic devices every 30s              │
   │                                                            │
   └────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
          When the Mac mini comes online at home, point its own
          connector at the same Supabase and the dashboard switches
          from synthetic to real devices automatically — no code
          change in the container.
```

## Prerequisites

- A Supabase project with migrations `001` and `002` applied. You'll need:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon, public)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only — never put it in the browser)
- A Manus Ubuntu container with outbound internet access.

## One-shot setup

From the container shell, after the repo is cloned:

```bash
cd TumeloRamaphosa
bash deploy/setup.sh
```

The script installs Node 22 and Python 3, runs `npm ci` + `npm run build`,
creates a Python venv for the connector, and writes the two `.env` files from
the templates if they don't exist yet.

## Configure

Edit the two env files the script created:

**`studex-platform/.env.local`**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

**`hub-connector/.env`**
```bash
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
HUB_ID=<run: python3 -c "import uuid; print(uuid.uuid4())">
HUB_NAME=Manus Demo Hub
SCAN_INTERVAL=30
```

## Run the dashboard

```bash
cd studex-platform
npm run start          # binds 0.0.0.0:3000
```

Open the container's port 3000 — that's the dashboard. The `/devices` page
will be empty until the connector publishes something (next step).

## Run the connector in demo mode

In a second shell (or under your process manager of choice):

```bash
cd hub-connector
. .venv/bin/activate
python3 connector.py --seed-only
```

Every 30 seconds it publishes six realistic synthetic devices — HomePod mini,
Apple TV 4K, Mac mini Hub, Magic Keyboard, Raspberry Pi, Samsung Frame — and
the Frame flips offline briefly on a regular schedule so the dashboard
visibly reacts. The toggle buttons in the UI enqueue commands that the same
connector then drains (status: `pending → sent → done`).

## Running the dashboard in Docker (alternative)

`studex-platform/Dockerfile` is set up for Next.js standalone output:

```bash
cd studex-platform
docker build -t studex-dashboard .
docker run --rm -p 3000:3000 --env-file .env.local studex-dashboard
```

## Promoting to real devices later

When the Mac mini is set up at home, run the **same connector** on it without
`--seed-only`:

```bash
cd hub-connector && python3 connector.py
```

It will discover the LAN/USB devices, push them to the same Supabase, and
take over the dashboard. To remove the demo entries, point the Mac mini's
connector at a fresh `HUB_ID`, then archive or delete the demo hub's row.

## Where the cloud line is (physics, not code)

- The Manus container **cannot** see your home WiFi/USB/BLE — it isn't on
  your home network. That's why `--seed-only` exists.
- HomeKit / HomePod control happens through HomeClaw, which only runs on
  macOS. The container can't replace that.
- Once the Mac mini is up, the container's role narrows to *just* hosting
  the dashboard. The dashboard never connects to the home network directly;
  everything moves through Supabase.
