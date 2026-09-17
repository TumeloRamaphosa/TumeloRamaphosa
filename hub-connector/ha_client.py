"""Home Assistant WebSocket client for real command dispatch.

Implements the small slice of the HA WebSocket API we need:
- authentication handshake
- call_service (with target + service_data)

The `websockets` package is imported lazily so the connector can still run in
--dry-run / --seed-only modes with only stdlib + requests installed.

Protocol reference:
  https://developers.home-assistant.io/docs/api/websocket/
"""

from __future__ import annotations

import asyncio
import json
from typing import Any


class HaError(RuntimeError):
    """Raised for auth failures, transport errors, and rejected call_service."""


class HaClient:
    """Async context manager over a single HA WebSocket connection."""

    def __init__(self, url: str, token: str, timeout: float = 10.0) -> None:
        if not url or not token:
            raise HaError("HA_URL and HA_TOKEN must be set")
        self.url = url
        self.token = token
        self.timeout = timeout
        self._ws: Any = None
        self._msg_id = 0

    async def __aenter__(self) -> "HaClient":
        try:
            import websockets  # lazy so dry-run doesn't need it
        except ImportError as exc:
            raise HaError(
                "The 'websockets' package is required for HA dispatch. "
                "Install: pip install -r requirements.txt"
            ) from exc

        self._ws = await asyncio.wait_for(
            websockets.connect(self.url, open_timeout=self.timeout, close_timeout=5),
            timeout=self.timeout,
        )
        first = json.loads(await asyncio.wait_for(self._ws.recv(), timeout=self.timeout))
        if first.get("type") != "auth_required":
            raise HaError(f"expected auth_required frame, got: {first}")

        await self._ws.send(json.dumps({"type": "auth", "access_token": self.token}))
        resp = json.loads(await asyncio.wait_for(self._ws.recv(), timeout=self.timeout))
        if resp.get("type") != "auth_ok":
            raise HaError(f"authentication failed: {resp}")
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        if self._ws is not None:
            try:
                await self._ws.close()
            except Exception:
                pass

    async def call_service(
        self,
        domain: str,
        service: str,
        target: dict | None = None,
        service_data: dict | None = None,
    ) -> dict:
        """Invoke a service on Home Assistant. Returns the `result` field."""
        self._msg_id += 1
        payload: dict[str, Any] = {
            "id": self._msg_id,
            "type": "call_service",
            "domain": domain,
            "service": service,
        }
        if target:
            payload["target"] = target
        if service_data:
            payload["service_data"] = service_data

        await self._ws.send(json.dumps(payload))
        # Skip past unrelated frames until we see our matching id.
        while True:
            raw = await asyncio.wait_for(self._ws.recv(), timeout=self.timeout)
            frame = json.loads(raw)
            if frame.get("id") != self._msg_id:
                continue
            if frame.get("type") != "result":
                continue
            if not frame.get("success", False):
                raise HaError(f"call_service rejected: {frame.get('error')}")
            return frame.get("result") or {}


def dispatch_sync(
    url: str,
    token: str,
    domain: str,
    service: str,
    entity_id: str,
    service_data: dict | None = None,
    timeout: float = 10.0,
) -> dict:
    """Blocking helper for the executor's synchronous path."""

    async def _run() -> dict:
        async with HaClient(url, token, timeout=timeout) as ha:
            return await ha.call_service(
                domain,
                service,
                target={"entity_id": entity_id},
                service_data=service_data,
            )

    return asyncio.run(_run())
