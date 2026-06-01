#!/usr/bin/env python3
"""
StudEx Agentic OS — Mac mini Hub worker.

Always-on autonomous worker. Polls the vault job queue (vault/raw/inbox/*.json),
runs each job, writes results into the vault, and moves the job to inbox/done/.

Handlers:
  - perplexity_research : ask Perplexity (sonar) and save a cited markdown report
  - data_pull           : pull store/ad/analytics metrics (graceful if keys missing)

Usage:
  python worker.py                  # poll forever
  python worker.py --once           # process the queue once and exit
  python worker.py --data-pull      # run the nightly data pull now
  python worker.py --competitor-watch
  python worker.py --enqueue "your research question"

Never crashes on a missing credential — it logs a clear note and keeps going.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import time
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).with_name(".env"))
except Exception:
    pass  # dotenv optional; env vars may be set another way

HERE = Path(__file__).resolve().parent
VAULT_DIR = Path(os.getenv("VAULT_DIR", HERE / ".." / ".." / "vault")).resolve()
INBOX = VAULT_DIR / "raw" / "inbox"
DONE = INBOX / "done"
RAW = VAULT_DIR / "raw"
SAST = dt.timezone(dt.timedelta(hours=2))


def log(msg: str) -> None:
    print(f"[{dt.datetime.now(SAST):%Y-%m-%d %H:%M:%S} SAST] {msg}", flush=True)


def now_stamp() -> str:
    return dt.datetime.now(SAST).strftime("%Y-%m-%d-%H%M")


def out_dir(rel: str) -> Path:
    """Resolve an output path that may be vault-relative or repo-relative."""
    p = Path(rel)
    if not p.is_absolute():
        # accept both "vault/outputs/..." and "outputs/..."
        parts = p.parts
        if parts and parts[0] == "vault":
            p = VAULT_DIR / Path(*parts[1:])
        else:
            p = VAULT_DIR / p
    p.mkdir(parents=True, exist_ok=True)
    return p


def write_note(text: str) -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    f = RAW / f"{now_stamp()}-hub-note.md"
    f.write_text(text, encoding="utf-8")


# --------------------------------------------------------------------------- #
# Handlers
# --------------------------------------------------------------------------- #
def handle_perplexity_research(job: dict) -> Path:
    prompt = job.get("prompt", "").strip()
    if not prompt:
        raise ValueError("perplexity_research job has no 'prompt'")

    key = os.getenv("PERPLEXITY_API_KEY")
    target = out_dir(job.get("output", "outputs/reports"))
    slug = job.get("id", now_stamp())
    out_file = target / f"{slug}.md"

    if not key:
        out_file.write_text(
            f"# Research (NOT RUN)\n\n> ⚠️ Missing `PERPLEXITY_API_KEY` — set it in "
            f"`os/mac-mini-hub/.env`.\n\n**Prompt:**\n\n{prompt}\n",
            encoding="utf-8",
        )
        log(f"  · skipped (no PERPLEXITY_API_KEY) → {out_file}")
        return out_file

    import requests

    model = os.getenv("PERPLEXITY_MODEL", "sonar")
    resp = requests.post(
        "https://api.perplexity.ai/chat/completions",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={
            "model": model,
            "messages": [
                {"role": "system", "content": "You are a research analyst for an online "
                 "meat/farming business in South Africa. Be specific, cite sources, "
                 "and surface actionable opportunities."},
                {"role": "user", "content": prompt},
            ],
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    answer = data["choices"][0]["message"]["content"]
    citations = data.get("citations", [])

    body = [f"---\ntitle: {slug}\ntype: research\nsource: perplexity/{model}\n"
            f"created: {dt.datetime.now(SAST).isoformat()}\n---\n",
            f"# Research — {slug}\n", f"**Prompt:** {prompt}\n", "## Findings\n", answer]
    if citations:
        body.append("\n## Sources\n" + "\n".join(f"- {c}" for c in citations))
    out_file.write_text("\n".join(body), encoding="utf-8")
    log(f"  · perplexity_research done → {out_file}")
    return out_file


def handle_data_pull(job: dict | None = None) -> Path:
    """Pull store/ad/analytics metrics. Graceful: missing keys → noted, not fatal."""
    target = out_dir("outputs/reports/data")
    stamp = dt.datetime.now(SAST).strftime("%Y-%m-%d")
    out_file = target / f"{stamp}-data.md"

    sources = {
        "Shopify": "SHOPIFY_ADMIN_TOKEN",
        "Google Analytics 4": "GA4_PROPERTY_ID",
        "Google Ads": "GOOGLE_ADS_DEVELOPER_TOKEN",
        "Meta (FB/IG)": "META_ACCESS_TOKEN",
    }
    lines = [f"# Data snapshot — {stamp}\n"]
    for name, env in sources.items():
        if os.getenv(env):
            # TODO: real API calls go here once creds are confirmed.
            lines.append(f"- **{name}**: connected ✅  _(metric fetch not yet implemented — "
                         f"add API call in worker.py:handle_data_pull)_")
        else:
            lines.append(f"- **{name}**: ⬜ missing `{env}` — add it in .env "
                         f"(see os/integrations.md)")
    out_file.write_text("\n".join(lines) + "\n", encoding="utf-8")
    write_note(f"# Data pull ran {stamp}\n\nSnapshot → outputs/reports/data/{out_file.name}\n")
    log(f"  · data_pull done → {out_file}")
    return out_file


HANDLERS = {
    "perplexity_research": handle_perplexity_research,
    "data_pull": lambda job: handle_data_pull(job),
}


# --------------------------------------------------------------------------- #
# Queue processing
# --------------------------------------------------------------------------- #
def process_job(path: Path) -> None:
    try:
        job = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        log(f"! bad job file {path.name}: {e}")
        return
    jtype = job.get("type", "perplexity_research")
    log(f"→ {path.name} [{jtype}]")
    handler = HANDLERS.get(jtype)
    if not handler:
        log(f"! no handler for type '{jtype}', skipping")
        return
    try:
        handler(job)
        DONE.mkdir(parents=True, exist_ok=True)
        path.rename(DONE / path.name)
    except Exception as e:  # never let one job kill the loop
        log(f"! job {path.name} failed: {e}")


def process_queue_once() -> int:
    INBOX.mkdir(parents=True, exist_ok=True)
    jobs = sorted(p for p in INBOX.glob("*.json"))
    for p in jobs:
        process_job(p)
    return len(jobs)


def enqueue(prompt: str) -> Path:
    INBOX.mkdir(parents=True, exist_ok=True)
    jid = f"JOB-{now_stamp()}-adhoc"
    job = {
        "id": jid, "type": "perplexity_research", "priority": "normal",
        "prompt": prompt, "output": "outputs/reports",
        "created_by": "worker.py --enqueue",
        "created_at": dt.datetime.now(SAST).isoformat(),
    }
    f = INBOX / f"{jid}.json"
    f.write_text(json.dumps(job, indent=2), encoding="utf-8")
    log(f"enqueued {f}")
    return f


def main() -> None:
    ap = argparse.ArgumentParser(description="StudEx Agentic OS — Mac mini Hub worker")
    ap.add_argument("--once", action="store_true", help="process the queue once and exit")
    ap.add_argument("--data-pull", action="store_true", help="run the data pull now")
    ap.add_argument("--competitor-watch", action="store_true",
                    help="enqueue the competitor watch jobs now")
    ap.add_argument("--enqueue", metavar="PROMPT", help="enqueue an ad-hoc research job")
    args = ap.parse_args()

    log(f"Hub starting. VAULT_DIR={VAULT_DIR}")
    if not VAULT_DIR.exists():
        log(f"! VAULT_DIR does not exist: {VAULT_DIR} (set it in .env)")

    if args.enqueue:
        enqueue(args.enqueue); return
    if args.data_pull:
        handle_data_pull(); return
    if args.competitor_watch:
        # Minimal seed; edit the competitor list in the research-intel domain note.
        enqueue("Weekly competitor & price watch for South African online meat/butchery "
                "brands. For each major competitor list current prices, promotions, new "
                "products, and notable marketing. Cite sources.")
        process_queue_once(); return
    if args.once:
        n = process_queue_once(); log(f"processed {n} job(s)."); return

    interval = int(os.getenv("POLL_INTERVAL", "60"))
    log(f"polling every {interval}s — Ctrl-C to stop")
    try:
        while True:
            process_queue_once()
            time.sleep(interval)
    except KeyboardInterrupt:
        log("stopped.")


if __name__ == "__main__":
    sys.exit(main())
