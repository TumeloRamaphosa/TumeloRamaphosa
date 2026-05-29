"""Phase 2 stub executor for commands enqueued by the dashboard.

The real implementation will dispatch to Home Assistant via its WebSocket API,
or to HomeClaw / SmartThings for the relevant device. For Phase 2 we ack the
command (mark it sent, then done) and record the action in the result column,
so the end-to-end queue is exercised without needing HA wired up yet.
"""

from __future__ import annotations

from datetime import datetime, timezone


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def execute(command: dict) -> dict:
    """Execute a command (stub) and return a JSON-safe result dict."""
    action = command.get("action", "")
    params = command.get("params") or {}
    return {
        "executed_at": _now_iso(),
        "action": action,
        "params": params,
        "dispatched_to": "stub",
        "note": "Phase 2 stub — Home Assistant dispatch lands in Phase 3.",
    }


def consume_pending(client, hub_id: str, limit: int = 25) -> tuple[int, int]:
    """Pull pending commands and run them through the stub.

    Returns (succeeded, failed). The connector calls this once per cycle.
    """
    succeeded = 0
    failed = 0
    pending = client.fetch_pending_commands(hub_id, limit=limit)
    for cmd in pending:
        cmd_id = cmd["id"]
        try:
            client.update_command(cmd_id, "sent")
            result = execute(cmd)
            client.update_command(cmd_id, "done", result=result)
            succeeded += 1
        except Exception as exc:  # keep going on individual failures
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
