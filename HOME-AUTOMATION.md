# Home Automation Hub

*One dashboard for every connected thing in the house, driven by a small local machine.*

This repo now carries two projects:

| Project | Path | Docs |
|---|---|---|
| StudEx Cognitive Brain (earlier work) | `studex-platform/` | `studex-platform/README.md` |
| **Home Automation Hub** (this document) | `studex-platform/src/app/devices/`, `hub-connector/`, `deploy/` | this file |

## What it does

A live view of every WiFi / USB / Bluetooth / Home-Assistant / HomeKit device
in your home, plus a control queue that dispatches actions (toggle, play,
volume, …) to Home Assistant over its WebSocket API.

## Architecture

```
   HOME (Mac mini — always on, on your WiFi)     CLOUD (Manus / Fly / Vercel)
   ┌───────────────────────────────────────┐     ┌────────────────────────────┐
   │ Home Assistant  ◀────────────────────╮│     │ Next.js dashboard          │
   │ HomeClaw (HomeKit, macOS-only)       ││     │ /devices  · /designs       │
   │                                      ││     │ /api/devices · /api/commands│
   │ Hub Connector (Python)               ││     └────────────┬───────────────┘
   │  • WiFi scan (ARP table)             ││                  │
   │  • USB scan (system_profiler / sysfs)││    Supabase (Postgres + service-role API)
   │  • command queue drain               │├────▶│ hubs · devices · commands  │
   │  • HA dispatch via WebSocket ────────╯│     └────────────────────────────┘
   └───────────────────────────────────────┘
```

- The **connector** only makes *outbound* HTTPS calls to Supabase; nothing at
  home is exposed to the internet.
- The **dashboard** reads devices server-side using the Supabase service-role
  key, never in the browser. RLS is on; owner-scoped policies are in place
  for when Supabase Auth is wired up.
- Until a Mac mini exists at home, the same connector runs `--seed-only` in a
  **Manus Ubuntu container** and publishes six realistic synthetic devices so
  the dashboard is alive for demos.

## What ships today

| Phase | Status | Delivers |
|---|---|---|
| **1 · Discovery** | ✅ shipped | `hubs`/`devices` schema, connector scans ARP + USB, `/devices` page in Next.js polling `/api/devices` |
| **2 · Control queue** | ✅ shipped | `commands` table, `/api/commands` (POST), Apple-Home dashboard with per-tile toggle, connector's stub executor drains `pending → sent → done` |
| **3a · Real Home Assistant dispatch** | ✅ shipped | `ha_client.py` (async HA WebSocket, auth + `call_service`); action→service mapping (toggle/turn_on/play/pause/volume/mute/…); falls back to stub when HA env is unset |
| 3b · HomeClaw for HomeKit | parked | MCP integration once a Mac mini + HomeClaw are set up |
| 3c · AirPlay via pyatv | parked | Apple TV control; HomePod audio bridging within Apple's limits |
| 4 · SmartThings + BLE + remote access | parked | Samsung + BLE proxies; Cloudflare Tunnel / Tailscale |
| 5 · Conversational AI + memory | parked | Chat-to-your-home (Spynel / OpenClaw); memory layer inspired by TencentDB-Agent-Memory over Supabase pgvector |

## Quickstart

### On the cloud host (Manus / Fly / Vercel / laptop for local dev)

```bash
bash deploy/setup.sh
# Fill in studex-platform/.env.local and hub-connector/.env
cd studex-platform && npm run start                 # :3000 dashboard
# in a second shell:
cd hub-connector && . .venv/bin/activate && python3 connector.py --seed-only
```

Detailed recipe: [`deploy/MANUS.md`](deploy/MANUS.md).

### On the Mac mini (real device control)

```bash
cd hub-connector
cp .env.example .env      # fill Supabase + a generated HUB_ID
# Optional — enable real HA dispatch:
#   HA_URL=ws://homeassistant.local:8123/api/websocket
#   HA_TOKEN=<long-lived token from HA → Profile → Security>
pip install -r requirements.txt
python3 connector.py                                # real WiFi + USB, HA dispatch if configured
```

To point a device row at a specific Home Assistant entity, set
`capabilities.ha_entity_id` on the device (or pass `params.entity_id` when
enqueueing the command). The executor uses that to build the `call_service`
target; otherwise it stays on the stub path.

## Design directions

Three high-fidelity mockups of the dashboard sit in
`studex-platform/public/designs/`. `02-apple-home.html` is the one that
became the live `/devices` page — Kenya-Hara-inflected Apple-HIG tiles,
categorical colour by source. Open `/designs` in the dashboard to compare.

## File map

```
├── studex-platform/                        Next.js 16 + Supabase + Tailwind v4
│   ├── src/app/devices/page.tsx            live Device Hub (Apple Home style)
│   ├── src/app/api/devices/route.ts        server-side devices read (service-role)
│   ├── src/app/api/commands/route.ts       enqueue toggle/turn_on/… commands
│   ├── src/lib/supabase/types.ts           Device / Hub / Command / CommandStatus
│   ├── supabase/migrations/002_home_automation_schema.sql
│   ├── public/designs/                     the three design directions + index
│   └── Dockerfile · .dockerignore          slim standalone runtime image
├── hub-connector/                          Python; runs on the home machine
│   ├── connector.py                        main loop; --dry-run / --once / --seed / --seed-only
│   ├── discovery/wifi.py                   ARP-table scan (macOS + Linux)
│   ├── discovery/usb.py                    system_profiler / sysfs / lsusb
│   ├── discovery/seed.py                   six realistic synthetic devices
│   ├── executor.py                         HA dispatch (real) with stub fallback
│   ├── ha_client.py                        async HA WebSocket client
│   ├── supabase_client.py                  minimal PostgREST client
│   └── config.py · .env.example
└── deploy/
    ├── setup.sh                            fresh-Ubuntu one-shot installer
    └── MANUS.md                            deployment recipe
```

## Testing that has actually run

- `next build` clean (TypeScript passes, `/devices`, `/api/devices`,
  `/api/commands` all compile).
- Standalone runtime (`.next/standalone/server.js`, what the Dockerfile
  runs) boots and serves the dashboard, API, and `/designs` redirect.
- Connector `--dry-run --once` discovers via `/proc/net/arp`, USB empty in
  cloud sandbox as expected, exits clean.
- Connector `--seed-only --once` against a mock PostgREST → registers hub,
  upserts six devices, patches stale-offline + hub status.
- Dashboard `POST /api/commands` end-to-end: resolves the device's `hub_id`,
  inserts a pending row.
- Connector consumes pending → marks `sent` → executes → marks `done`.
- **Phase 3a end-to-end**: connector authenticated against a mock HA
  WebSocket (`auth_required → auth → auth_ok`), dispatched
  `media_player.toggle` on the target `entity_id`, HA returned a context id,
  command row landed at `status=done` with `dispatched_to=home_assistant`.
- Verb → service mapping unit-tested across light / switch / media_player /
  climate.

## Where this actually lives

All Phase 1–3a work is on the branch `claude/home-automation-hub-9eCxW`
inside `TumeloRamaphosa/TumeloRamaphosa`. The dedicated
`TumeloRamaphosa/Home-Auto` repo is currently empty — when you want to
relocate:

```bash
git remote add home-auto https://github.com/TumeloRamaphosa/Home-Auto.git
git push home-auto claude/home-automation-hub-9eCxW:main
```

## For the next chapter — recommended dev toolkit

When picking this up to build Phase 3b–5, install
[`giovanisp/everything-claude-code`](https://github.com/giovanisp/everything-claude-code)
as Claude Code plugins in your local `.claude/`:

```bash
npx skills add giovanisp/everything-claude-code
```

It's a hackathon-winning pack of 48 subagents, 183 workflow skills, 20+
hooks, and 14 MCP configs. It doesn't ship inside the app — it makes the
person building the next phase faster. The pieces that directly help this
codebase:

| Piece | Where it lands |
|---|---|
| **Security-review skill** | Before every push that touches the Supabase service-role key, HA long-lived token, or `.env`; catches secrets accidentally staged, weak RLS, and env-shape mistakes. |
| **TDD skill** | The pattern we used in Phase 3a (mock HA WebSocket + mock PostgREST) generalises: Phase 3b (HomeClaw MCP), 3c (`pyatv`), and 4 (SmartThings) all follow "write the mock protocol, write the failing test, then the client". |
| **Code-review skill** | Before merging any Phase 3+ PR — worth running once against the current diff before promoting the branch to `Home-Auto/main`. |
| **Always-follow coding rules (TS + Python + Bash)** | This repo spans all three; the language rules keep the connector, the dashboard, and `deploy/setup.sh` consistent as more contributors join. |
| **Pre-wired MCP configs (GitHub · Supabase · Vercel)** | Same tools we used through this session, ready in a new checkout without ceremony. |
| **Automation hooks (20+)** | Pre-commit secret scans, auto-lint on save, `.env` guardrails — practical given we ship service-role keys via `.env`. |

The 183 skills aren't all relevant; they're a library, not a checklist. The
value is having them **available** the moment a phase needs one. Install
lives in your Claude Code profile, not in the deployable app — so it never
affects the Manus/Fly runtime.

