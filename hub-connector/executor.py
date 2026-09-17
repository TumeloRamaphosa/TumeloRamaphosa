"""Command executor: real Home Assistant dispatch when configured, stub otherwise.

For each pending command the connector picks up, we resolve the target entity
in Home Assistant (from the command's params.entity_id, or the device's
capabilities.ha_entity_id) and call the matching HA service. If HA isn't
configured or the target is unknown, we fall back to the stub so cloud/demo
environments (Manus with --seed-only) keep working end-to-end.
"""

from __future__ import annotations

from datetime import datetime, timezone


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ── Action → (domain override, service) mapping ─────────────────────────
# `None` domain means "use the entity's own domain" (light.toggle, switch.toggle, …).
_ACTION_MAP: dict[str, tuple[str | None, str]] = {
    "toggle":    (None, "toggle"),
    "turn_on":   (None, "turn_on"),
    "turn_off":  (None, "turn_off"),
    "play":      ("media_player", "media_play"),
    "pause":     ("media_player", "media_pause"),
    "play_pause": ("media_player", "media_play_pause"),
    "next":      ("media_player", "media_next_track"),
    "previous":  ("media_player", "media_previous_track"),
    "volume_up": ("media_player", "volume_up"),
    "volume_down": ("media_player", "volume_down"),
    "mute":      ("media_player", "volume_mute"),
}


def _resolve_service(action: str, entity_id: str) -> tuple[str, str]:
    """Return (domain, service) to call in HA for the given action + entity."""
    entity_domain = entity_id.split(".", 1)[0]
    if action in _ACTION_MAP:
        forced_domain, service = _ACTION_MAP[action]
        return (forced_domain or entity_domain, service)
    # Unknown action → let HA reject if it's wrong, using the entity's domain.
    return entity_domain, action


def _entity_from_command(command: dict) -> str | None:
    """Find an HA entity_id in the command payload or its attached device."""
    params = command.get("params") or {}
    if isinstance(params, dict) and params.get("entity_id"):
        return str(params["entity_id"])
    device = command.get("device") or {}
    caps = device.get("capabilities") or {}
    if isinstance(caps, dict) and caps.get("ha_entity_id"):
        return str(caps["ha_entity_id"])
    return None


def execute(command: dict, ha: dict | None = None) -> dict:
    """Execute a command and return a JSON-safe result dict.

    `ha` is either None (stub) or {"url": ..., "token": ...}.
    """
    action = command.get("action", "")
    params = command.get("params") or {}
    entity_id = _entity_from_command(command)

    if ha and ha.get("url") and ha.get("token") and entity_id:
        domain, service = _resolve_service(action, entity_id)
        from ha_client import dispatch_sync

        result = dispatch_sync(
            url=ha["url"],
            token=ha["token"],
            domain=domain,
            service=service,
            entity_id=entity_id,
            service_data=params.get("data") if isinstance(params, dict) else None,
        )
        return {
            "executed_at": _now_iso(),
            "action": action,
            "domain": domain,
            "service": service,
            "entity_id": entity_id,
            "dispatched_to": "home_assistant",
            "result": result,
        }

    # Stub fallback — used in demo / cloud environments without HA.
    return {
        "executed_at": _now_iso(),
        "action": action,
        "params": params,
        "entity_id": entity_id,
        "dispatched_to": "stub",
        "note": "HA not configured or entity_id missing — command acknowledged only.",
    }


def _index_devices_for(client, pending: list[dict]) -> dict:
    """Bulk-fetch every device referenced by the pending commands."""
    ids = sorted({c["device_id"] for c in pending if c.get("device_id")})
    if not ids:
        return {}
    devices = client.fetch_devices_by_ids(ids)
    return {d["id"]: d for d in devices}


def consume_pending(
    client,
    hub_id: str,
    ha: dict | None = None,
    limit: int = 25,
) -> tuple[int, int]:
    """Pull pending commands and run them (HA if configured, stub otherwise).

    Returns (succeeded, failed).
    """
    succeeded = 0
    failed = 0
    pending = client.fetch_pending_commands(hub_id, limit=limit)
    if not pending:
        return (0, 0)

    device_index = _index_devices_for(client, pending) if ha else {}

    for cmd in pending:
        cmd_id = cmd["id"]
        try:
            client.update_command(cmd_id, "sent")
            cmd["device"] = device_index.get(cmd.get("device_id"))
            result = execute(cmd, ha=ha)
            client.update_command(cmd_id, "done", result=result)
            succeeded += 1
        except Exception as exc:
            try:
                client.update_command(
                    cmd_id,
                    "failed",
                    result={"error": str(exc), "failed_at": _now_iso()},
                )
            except Exception:
                pass
            failed += 1
    return succeeded, failed
