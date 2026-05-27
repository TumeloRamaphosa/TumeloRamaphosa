"""Discover devices on the local network by reading the ARP neighbor table.

Pure stdlib. Works on macOS and Linux. We read the *existing* ARP cache rather
than running an active scan, so no elevated privileges are required. Run an
occasional ping-sweep (or just use the network) to keep the cache populated.
"""

from __future__ import annotations

import re
import subprocess
from typing import Optional

# Best-effort offline vendor hints for common smart-home OUIs (first 3 octets).
# Not exhaustive — just a nicety so common devices show a vendor name.
_OUI_VENDORS = {
    "ac:bc:32": "Apple",
    "f0:18:98": "Apple",
    "a4:83:e7": "Apple",
    "dc:a6:32": "Raspberry Pi",
    "b8:27:eb": "Raspberry Pi",
    "e4:5f:01": "Raspberry Pi",
    "44:65:0d": "Amazon",
    "fc:65:de": "Amazon",
    "f0:ef:86": "Google",
    "1c:f2:9a": "Google",
    "8c:79:f5": "Samsung",
    "00:12:fb": "Samsung",
    "c8:2b:96": "Samsung",
    "b0:7f:b9": "Netgear",
    "d8:0d:17": "TP-Link",
}

_MAC_RE = re.compile(r"(?:[0-9a-fA-F]{1,2}:){5}[0-9a-fA-F]{1,2}")
_IP_RE = re.compile(r"\((\d{1,3}(?:\.\d{1,3}){3})\)")


def _normalize_mac(mac: str) -> Optional[str]:
    parts = mac.split(":")
    if len(parts) != 6:
        return None
    try:
        return ":".join(f"{int(p, 16):02x}" for p in parts)
    except ValueError:
        return None


def _vendor_for(mac: str) -> Optional[str]:
    return _OUI_VENDORS.get(mac[:8])


def _parse_arp_a(output: str) -> list[dict]:
    devices: list[dict] = []
    for line in output.splitlines():
        if "incomplete" in line.lower():
            continue
        ip_match = _IP_RE.search(line)
        mac_match = _MAC_RE.search(line)
        if not mac_match:
            continue
        mac = _normalize_mac(mac_match.group(0))
        if not mac:
            continue
        ip = ip_match.group(1) if ip_match else None
        # Hostname is the leading token before "(" when present.
        host = line.split("(")[0].strip() or None
        if host in ("?", ""):
            host = None
        devices.append({"ip": ip, "mac": mac, "host": host})
    return devices


def _parse_proc_arp(output: str) -> list[dict]:
    devices: list[dict] = []
    for line in output.splitlines()[1:]:  # skip header
        cols = line.split()
        if len(cols) < 4:
            continue
        ip, _hwtype, _flags, mac = cols[0], cols[1], cols[2], cols[3]
        if mac == "00:00:00:00:00:00":
            continue
        norm = _normalize_mac(mac)
        if not norm:
            continue
        devices.append({"ip": ip, "mac": norm, "host": None})
    return devices


def _raw_neighbors() -> list[dict]:
    # Prefer `arp -a` (macOS + Linux net-tools); fall back to Linux /proc.
    try:
        out = subprocess.run(
            ["arp", "-a"], capture_output=True, text=True, timeout=15
        )
        if out.returncode == 0 and out.stdout.strip():
            return _parse_arp_a(out.stdout)
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass

    try:
        with open("/proc/net/arp", "r", encoding="utf-8") as fh:
            return _parse_proc_arp(fh.read())
    except OSError:
        return []


def scan_wifi() -> list[dict]:
    """Return a list of device dicts discovered on the local network."""
    seen: dict[str, dict] = {}
    for n in _raw_neighbors():
        mac = n["mac"]
        if mac in seen:
            # Prefer the entry that carries an IP / hostname.
            if not seen[mac].get("ip_address") and n.get("ip"):
                seen[mac]["ip_address"] = n["ip"]
            continue
        seen[mac] = {
            "source": "wifi",
            "external_id": mac,
            "name": n.get("host") or n.get("ip") or mac,
            "type": "network_device",
            "manufacturer": _vendor_for(mac),
            "model": None,
            "ip_address": n.get("ip"),
            "mac_address": mac,
            "capabilities": {"oui": mac[:8]},
            "online": True,
        }
    return list(seen.values())


if __name__ == "__main__":
    import json

    print(json.dumps(scan_wifi(), indent=2))
