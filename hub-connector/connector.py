#!/usr/bin/env python3
"""Home Automation Hub Connector — Phase 1 (discovery).

Runs on the always-on home machine (the Mac mini). Scans the local network and
USB bus and pushes the inventory to Supabase, which the web dashboard reads.

Usage:
  python connector.py --dry-run --once   # scan and print JSON, no network calls
  python connector.py --once             # one scan cycle, push to Supabase
  python connector.py                    # continuous loop (every SCAN_INTERVAL)
"""

from __future__ import annotations

import argparse
import json
import platform
import signal
import sys
import time
from datetime import datetime, timedelta, timezone

from config import Config
from discovery.usb import scan_usb
from discovery.wifi import scan_wifi


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def discover() -> list[dict]:
    devices: list[dict] = []
    for name, fn in (("wifi", scan_wifi), ("usb", scan_usb)):
        try:
            found = fn()
            devices.extend(found)
            print(f"  [{name}] {len(found)} device(s)")
        except Exception as exc:  # keep scanning even if one source fails
            print(f"  [{name}] scan failed: {exc}", file=sys.stderr)
    return devices


def _print_table(devices: list[dict]) -> None:
    if not devices:
        print("  (no devices found — is the ARP cache populated / USB attached?)")
        return
    for d in devices:
        ident = d.get("ip_address") or d.get("mac_address") or d.get("external_id")
        vendor = d.get("manufacturer") or "?"
        print(f"  - [{d['source']:>4}] {d.get('name') or ident}  ({vendor})  {ident}")


def run_cycle(cfg: Config, client, dry_run: bool) -> None:
    print(f"[{_now_iso()}] scanning...")
    started = datetime.now(timezone.utc)
    devices = discover()
    print(f"  total: {len(devices)} device(s)")

    if dry_run:
        _print_table(devices)
        print(json.dumps({"hub": cfg.hub_name, "device_count": len(devices), "devices": devices}, indent=2))
        return

    pushed = client.upsert_devices(cfg.hub_id, devices)
    # Anything not refreshed in this cycle is considered gone.
    cutoff = (started - timedelta(seconds=5)).isoformat()
    client.mark_stale_offline(cfg.hub_id, cutoff)
    client.set_hub_status(cfg.hub_id, "online")
    print(f"  pushed {pushed} device(s) to Supabase")


def main() -> int:
    parser = argparse.ArgumentParser(description="Home Automation Hub Connector")
    parser.add_argument("--once", action="store_true", help="run a single scan cycle and exit")
    parser.add_argument("--dry-run", action="store_true", help="scan and print only; no Supabase calls")
    parser.add_argument("--interval", type=int, default=None, help="seconds between scans (overrides SCAN_INTERVAL)")
    args = parser.parse_args()

    cfg = Config()
    interval = args.interval if args.interval is not None else cfg.scan_interval

    client = None
    if not args.dry_run:
        problems = cfg.validate_for_push()
        if problems:
            print("Cannot push to Supabase:", file=sys.stderr)
            for p in problems:
                print(f"  - {p}", file=sys.stderr)
            print("\nTip: use --dry-run to test discovery without Supabase.", file=sys.stderr)
            return 2
        try:
            from supabase_client import SupabaseClient
        except ImportError:
            print("The 'requests' package is required to push. Install: pip install -r requirements.txt", file=sys.stderr)
            return 2
        client = SupabaseClient(cfg.supabase_url, cfg.supabase_service_key)
        client.upsert_hub(
            {
                "id": cfg.hub_id,
                "owner_id": cfg.hub_owner_id,
                "name": cfg.hub_name,
                "platform": platform.system().lower(),
                "status": "online",
                "last_seen": _now_iso(),
            }
        )
        print(f"Hub '{cfg.hub_name}' ({cfg.hub_id}) registered.")

    # Best-effort: mark the hub offline on graceful shutdown.
    def _shutdown(_signum, _frame):
        if client is not None:
            try:
                client.set_hub_status(cfg.hub_id, "offline")
            except Exception:
                pass
        print("\nShutting down.")
        sys.exit(0)

    signal.signal(signal.SIGINT, _shutdown)
    signal.signal(signal.SIGTERM, _shutdown)

    if args.once:
        run_cycle(cfg, client, args.dry_run)
        return 0

    print(f"Starting scan loop (every {interval}s). Ctrl-C to stop.")
    while True:
        try:
            run_cycle(cfg, client, args.dry_run)
        except Exception as exc:
            print(f"  cycle error: {exc}", file=sys.stderr)
        time.sleep(interval)


if __name__ == "__main__":
    raise SystemExit(main())
