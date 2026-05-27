"""Enumerate connected USB devices.

Pure stdlib. On macOS we parse `system_profiler SPUSBDataType -json`; on Linux
we read sysfs (/sys/bus/usb/devices) and fall back to `lsusb`.
"""

from __future__ import annotations

import glob
import json
import os
import re
import subprocess
from typing import Optional


def _read(path: str) -> Optional[str]:
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            return fh.read().strip()
    except OSError:
        return None


def _scan_macos() -> Optional[list[dict]]:
    try:
        out = subprocess.run(
            ["system_profiler", "SPUSBDataType", "-json"],
            capture_output=True,
            text=True,
            timeout=30,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return None
    if out.returncode != 0 or not out.stdout.strip():
        return None

    try:
        data = json.loads(out.stdout)
    except json.JSONDecodeError:
        return None

    devices: list[dict] = []

    def walk(items: list[dict]) -> None:
        for item in items:
            name = item.get("_name")
            vendor_id = item.get("vendor_id")
            product_id = item.get("product_id")
            serial = item.get("serial_num")
            # Skip pure hubs/roots that have no real identity.
            if vendor_id or product_id or serial:
                ext = ":".join(
                    str(x) for x in (vendor_id, product_id, serial) if x
                ) or name
                devices.append(
                    {
                        "source": "usb",
                        "external_id": ext,
                        "name": name,
                        "type": "usb_device",
                        "manufacturer": item.get("manufacturer"),
                        "model": name,
                        "ip_address": None,
                        "mac_address": None,
                        "capabilities": {
                            "vendor_id": vendor_id,
                            "product_id": product_id,
                            "serial": serial,
                        },
                        "online": True,
                    }
                )
            children = item.get("_items")
            if isinstance(children, list):
                walk(children)

    for top in data.get("SPUSBDataType", []):
        walk([top])
    return devices


def _scan_sysfs() -> Optional[list[dict]]:
    roots = glob.glob("/sys/bus/usb/devices/*")
    if not roots:
        return None
    devices: list[dict] = []
    for path in roots:
        id_vendor = _read(os.path.join(path, "idVendor"))
        id_product = _read(os.path.join(path, "idProduct"))
        if not id_vendor or not id_product:
            continue  # interfaces / hubs without product ids
        serial = _read(os.path.join(path, "serial"))
        product = _read(os.path.join(path, "product"))
        manufacturer = _read(os.path.join(path, "manufacturer"))
        ext = ":".join(x for x in (id_vendor, id_product, serial) if x) or os.path.basename(path)
        devices.append(
            {
                "source": "usb",
                "external_id": ext,
                "name": product or f"USB {id_vendor}:{id_product}",
                "type": "usb_device",
                "manufacturer": manufacturer,
                "model": product,
                "ip_address": None,
                "mac_address": None,
                "capabilities": {
                    "vendor_id": id_vendor,
                    "product_id": id_product,
                    "serial": serial,
                },
                "online": True,
            }
        )
    return devices


_LSUSB_RE = re.compile(
    r"Bus (\d+) Device (\d+): ID ([0-9a-fA-F]{4}):([0-9a-fA-F]{4})\s*(.*)"
)


def _scan_lsusb() -> Optional[list[dict]]:
    try:
        out = subprocess.run(
            ["lsusb"], capture_output=True, text=True, timeout=15
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return None
    if out.returncode != 0:
        return None
    devices: list[dict] = []
    for line in out.stdout.splitlines():
        m = _LSUSB_RE.match(line.strip())
        if not m:
            continue
        bus, dev, vid, pid, desc = m.groups()
        devices.append(
            {
                "source": "usb",
                "external_id": f"{vid}:{pid}:{bus}:{dev}",
                "name": desc.strip() or f"USB {vid}:{pid}",
                "type": "usb_device",
                "manufacturer": None,
                "model": desc.strip() or None,
                "ip_address": None,
                "mac_address": None,
                "capabilities": {"vendor_id": vid, "product_id": pid, "bus": bus, "device": dev},
                "online": True,
            }
        )
    return devices


def scan_usb() -> list[dict]:
    """Return a list of connected USB device dicts (empty if none/unsupported)."""
    for scanner in (_scan_macos, _scan_sysfs, _scan_lsusb):
        result = scanner()
        if result is not None:
            return result
    return []


if __name__ == "__main__":
    print(json.dumps(scan_usb(), indent=2))
