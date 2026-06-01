# Mac mini Hub — the always-on autonomous worker

This is the engine that makes the Mac mini "decide based on data and opportunities."
It runs 24/7, polls the vault job queue, runs research + data pulls, and writes results
back into the vault. Your MacBook stays free for creative/strategy work.

```
vault/raw/inbox/*.json  ──poll──▶  worker.py  ──▶  vault/outputs/...   ──▶  vault/raw/inbox/done/
                                      │
                                      ├─ perplexity_research → Perplexity API (sonar)
                                      └─ data_pull           → Shopify / GA4 / Ads / Meta
```

## Setup (run once, on the Mac mini)

```bash
cd os/mac-mini-hub
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then fill in PERPLEXITY_API_KEY etc.
```

Point `VAULT_DIR` in `.env` at wherever the synced vault lives on the Mac mini
(e.g. your iCloud/Obsidian/Git path).

## Run it

```bash
# foreground (test)
python worker.py --once          # process the queue once and exit
python worker.py                 # poll forever (default 60s interval)

# enqueue a test job
python worker.py --enqueue "Compare grass-fed beef box prices for the top 5 SA online butchers"
```

## Keep it alive (launchd or cron)

Poller (always running):
```bash
# crontab -e  — restart-on-reboot poller via a keepalive, or use launchd
@reboot cd /path/to/repo/os/mac-mini-hub && ./.venv/bin/python worker.py >> hub.log 2>&1
```

Scheduled automations:
```bash
# nightly data pull   (02:00 SAST)
0 2 * * *  cd /path/to/repo/os/mac-mini-hub && ./.venv/bin/python worker.py --data-pull >> hub.log 2>&1
# weekly competitor watch (Wed 06:00 SAST)
0 6 * * 3  cd /path/to/repo/os/mac-mini-hub && ./.venv/bin/python worker.py --competitor-watch >> hub.log 2>&1
```

> Set the Mac mini's timezone to Africa/Johannesburg so the cron times line up with SAST.

## Job types
| `type` | Handler | Needs |
|---|---|---|
| `perplexity_research` | Perplexity sonar API | `PERPLEXITY_API_KEY` |
| `data_pull` | Shopify / GA4 / Ads / Meta | the relevant keys (graceful if missing) |

See [`jobs/example-research-job.json`](jobs/example-research-job.json) for the shape.

## Design notes
- **Never crashes on missing credentials** — it logs a clear note and keeps going.
- **Idempotent-ish**: processed jobs move to `inbox/done/`.
- **Pluggable**: other research agents add a handler in `worker.py` or just write jobs/results to the vault directly.
