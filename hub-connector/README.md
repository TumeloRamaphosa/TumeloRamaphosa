# Hub Connector (Phase 1 — Discovery)

The Hub Connector runs on your always-on home machine (the **Mac mini**). It
discovers devices on your local network and USB bus and pushes the inventory to
Supabase, which the web dashboard (`studex-platform`) reads back and displays
live.

```
Mac mini (this connector)  ──outbound HTTPS──▶  Supabase  ◀──  Next.js dashboard
   • WiFi scan (ARP table)                      devices         /devices page
   • USB scan (system_profiler)
```

It only makes **outbound** connections to Supabase — nothing at home is exposed
to the internet.

## Why it must run at home

A cloud server (Vercel, Fly.io) cannot see your LAN, USB, or Bluetooth. Only a
machine physically on your home network can. That's what this connector is.

## Quick start

```bash
cd hub-connector

# 1. Test discovery with zero setup (stdlib only, no Supabase needed):
python3 connector.py --dry-run --once

# 2. Configure Supabase + a hub id:
cp .env.example .env
python3 -c "import uuid; print(uuid.uuid4())"   # paste into HUB_ID in .env
#   ...also set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

# 3. Install the one runtime dependency and push for real:
pip install -r requirements.txt
python3 connector.py --once     # one cycle
python3 connector.py            # continuous loop (every SCAN_INTERVAL seconds)
```

## What gets discovered

| Source | How | Notes |
|--------|-----|-------|
| WiFi / LAN | reads the ARP neighbor table (`arp -a`, or `/proc/net/arp`) | no root needed; populate the cache by using the network |
| USB | `system_profiler SPUSBDataType -json` (macOS), sysfs or `lsusb` (Linux) | |

Phases 2+ add Home Assistant bridging, Bluetooth (BLE), and HomeKit via
HomeClaw. Those write to the same `devices` table with `source` = `ha` / `ble`.

## Flags

- `--dry-run` — scan and print JSON only; no Supabase calls, no dependencies.
- `--once` — run a single scan cycle and exit (good for cron / testing).
- `--interval N` — seconds between scans in loop mode (overrides `SCAN_INTERVAL`).

## Running it as a background service on the Mac mini

Use a `launchd` agent so it starts on login and restarts on crash. Example
`~/Library/LaunchAgents/dev.studex.hubconnector.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>dev.studex.hubconnector</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/python3</string>
    <string>/Users/you/TumeloRamaphosa/hub-connector/connector.py</string>
  </array>
  <key>WorkingDirectory</key><string>/Users/you/TumeloRamaphosa/hub-connector</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>/tmp/hubconnector.log</string>
  <key>StandardErrorPath</key><string>/tmp/hubconnector.err</string>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/dev.studex.hubconnector.plist
```

## Security

- Uses the Supabase **service role key** — keep it only in `.env` on the Mac
  mini. Never put it in the browser or the deployed dashboard.
- `.env` is gitignored. Do not commit real keys.
