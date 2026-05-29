"""Minimal Supabase REST client for the Hub Connector.

Uses the service role key. Only imported when actually pushing to the cloud,
so `--dry-run` has no third-party dependencies.
"""

from __future__ import annotations

from datetime import datetime, timezone

import requests


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class SupabaseClient:
    def __init__(self, url: str, service_key: str, timeout: int = 20) -> None:
        self.rest = f"{url}/rest/v1"
        self.timeout = timeout
        self._headers = {
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
        }

    def upsert_hub(self, hub: dict) -> None:
        resp = requests.post(
            f"{self.rest}/hubs",
            params={"on_conflict": "id"},
            headers={**self._headers, "Prefer": "resolution=merge-duplicates"},
            json=hub,
            timeout=self.timeout,
        )
        resp.raise_for_status()

    def set_hub_status(self, hub_id: str, status: str) -> None:
        resp = requests.patch(
            f"{self.rest}/hubs",
            params={"id": f"eq.{hub_id}"},
            headers=self._headers,
            json={"status": status, "last_seen": _now_iso()},
            timeout=self.timeout,
        )
        resp.raise_for_status()

    def upsert_devices(self, hub_id: str, devices: list[dict]) -> int:
        if not devices:
            return 0
        now = _now_iso()
        rows = [
            {
                "hub_id": hub_id,
                "source": d["source"],
                "external_id": d["external_id"],
                "name": d.get("name"),
                "type": d.get("type"),
                "manufacturer": d.get("manufacturer"),
                "model": d.get("model"),
                "ip_address": d.get("ip_address"),
                "mac_address": d.get("mac_address"),
                "capabilities": d.get("capabilities", {}),
                "online": d.get("online", True),
                "last_seen": now,
            }
            for d in devices
        ]
        resp = requests.post(
            f"{self.rest}/devices",
            params={"on_conflict": "hub_id,source,external_id"},
            headers={**self._headers, "Prefer": "resolution=merge-duplicates"},
            json=rows,
            timeout=self.timeout,
        )
        resp.raise_for_status()
        return len(rows)

    def mark_stale_offline(self, hub_id: str, cutoff_iso: str) -> None:
        """Flag devices not refreshed since cutoff as offline."""
        resp = requests.patch(
            f"{self.rest}/devices",
            params={
                "hub_id": f"eq.{hub_id}",
                "last_seen": f"lt.{cutoff_iso}",
                "online": "eq.true",
            },
            headers=self._headers,
            json={"online": False},
            timeout=self.timeout,
        )
        resp.raise_for_status()

    # ── Phase 2: commands ────────────────────────────────────────────

    def fetch_pending_commands(self, hub_id: str, limit: int = 25) -> list[dict]:
        """Return commands queued for this hub that haven't started yet."""
        resp = requests.get(
            f"{self.rest}/commands",
            params={
                "hub_id": f"eq.{hub_id}",
                "status": "eq.pending",
                "order": "created_at.asc",
                "limit": str(limit),
                "select": "*",
            },
            headers=self._headers,
            timeout=self.timeout,
        )
        resp.raise_for_status()
        return resp.json()

    def update_command(
        self,
        command_id: str,
        status: str,
        result: dict | None = None,
    ) -> None:
        body: dict = {"status": status, "updated_at": _now_iso()}
        if result is not None:
            body["result"] = result
        resp = requests.patch(
            f"{self.rest}/commands",
            params={"id": f"eq.{command_id}"},
            headers=self._headers,
            json=body,
            timeout=self.timeout,
        )
        resp.raise_for_status()
