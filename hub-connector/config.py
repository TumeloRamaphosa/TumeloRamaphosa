"""Configuration for the Hub Connector.

Reads from the process environment and, if present, a local .env file (parsed
with a tiny built-in parser so no third-party dependency is needed).
"""

from __future__ import annotations

import os
import uuid
from pathlib import Path


def _load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        # Don't override variables already set in the real environment.
        os.environ.setdefault(key, value)


_load_dotenv(Path(__file__).resolve().parent / ".env")


class Config:
    def __init__(self) -> None:
        self.supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
        self.supabase_service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        self.hub_id = os.environ.get("HUB_ID", "")
        self.hub_name = os.environ.get("HUB_NAME", "Home Hub")
        self.hub_owner_id = os.environ.get("HUB_OWNER_ID") or None
        try:
            self.scan_interval = int(os.environ.get("SCAN_INTERVAL", "30"))
        except ValueError:
            self.scan_interval = 30

    def validate_for_push(self) -> list[str]:
        """Return a list of human-readable problems that block pushing."""
        problems = []
        if not self.supabase_url:
            problems.append("SUPABASE_URL is not set")
        if not self.supabase_service_key:
            problems.append("SUPABASE_SERVICE_ROLE_KEY is not set")
        if not self.hub_id:
            problems.append("HUB_ID is not set (generate one with: python -c \"import uuid;print(uuid.uuid4())\")")
        else:
            try:
                uuid.UUID(self.hub_id)
            except ValueError:
                problems.append("HUB_ID must be a valid UUID")
        return problems
