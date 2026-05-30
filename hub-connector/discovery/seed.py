"""Demo seed: realistic synthetic devices for environments without a real LAN.

Used by `connector.py --seed-only` (or `--seed`) when running in a cloud
container (Manus, Fly, etc.) where no actual home discovery is possible.
The synthetic devices match the six used in the design mockups so the
dashboard looks consistent with the prototypes.

The "online" flag of a couple of devices flips over time so the dashboard
doesn't look frozen — useful for demos and screen recordings.
"""

from __future__ import annotations

import time


_BASE: list[dict] = [
    {
        "source": "wifi",
        "external_id": "f0:18:98:aa:bb:cc",
        "name": "HomePod mini",
        "type": "speaker",
        "manufacturer": "Apple",
        "model": "HomePod mini",
        "ip_address": "192.168.1.21",
        "mac_address": "f0:18:98:aa:bb:cc",
        "capabilities": {"oui": "f0:18:98", "airplay": True, "room": "Living Room"},
    },
    {
        "source": "wifi",
        "external_id": "ac:bc:32:01:02:03",
        "name": "Apple TV 4K",
        "type": "media_player",
        "manufacturer": "Apple",
        "model": "Apple TV 4K (3rd gen)",
        "ip_address": "192.168.1.22",
        "mac_address": "ac:bc:32:01:02:03",
        "capabilities": {"oui": "ac:bc:32", "airplay": True, "tvos": "18.2", "room": "Living Room"},
    },
    {
        "source": "wifi",
        "external_id": "a4:83:e7:00:01:02",
        "name": "Mac mini Hub",
        "type": "computer",
        "manufacturer": "Apple",
        "model": "Mac mini (M4)",
        "ip_address": "192.168.1.10",
        "mac_address": "a4:83:e7:00:01:02",
        "capabilities": {"oui": "a4:83:e7", "role": "hub_host", "room": "Study"},
    },
    {
        "source": "usb",
        "external_id": "05ac:0267",
        "name": "Magic Keyboard",
        "type": "input_device",
        "manufacturer": "Apple",
        "model": "Magic Keyboard",
        "ip_address": None,
        "mac_address": None,
        "capabilities": {"vendor_id": "05ac", "product_id": "0267", "bus": "001", "device": "003"},
    },
    {
        "source": "wifi",
        "external_id": "dc:a6:32:11:22:33",
        "name": "Raspberry Pi 4",
        "type": "computer",
        "manufacturer": "Raspberry Pi Foundation",
        "model": "Raspberry Pi 4 Model B",
        "ip_address": "192.168.1.51",
        "mac_address": "dc:a6:32:11:22:33",
        "capabilities": {"oui": "dc:a6:32", "os": "Linux 6.6", "room": "Office"},
    },
    {
        "source": "wifi",
        "external_id": "8c:79:f5:0a:0b:0c",
        "name": "The Frame",
        "type": "tv",
        "manufacturer": "Samsung Electronics",
        "model": "UN55LS03A",
        "ip_address": "192.168.1.45",
        "mac_address": "8c:79:f5:0a:0b:0c",
        "capabilities": {"oui": "8c:79:f5", "smartthings": True, "room": "Living Room"},
    },
]


def scan_seed() -> list[dict]:
    """Return synthetic devices for the current moment.

    The Samsung Frame flips offline for ~30 s every 2 min so the dashboard
    visibly reacts. Everything else stays online.
    """
    devices: list[dict] = []
    now = int(time.time())
    frame_online = (now // 30) % 4 != 0  # off for one 30-second window in four
    for d in _BASE:
        entry = dict(d)
        entry["capabilities"] = dict(d["capabilities"])
        if d["external_id"] == "8c:79:f5:0a:0b:0c":
            entry["online"] = frame_online
        else:
            entry["online"] = True
        devices.append(entry)
    return devices


if __name__ == "__main__":
    import json

    print(json.dumps(scan_seed(), indent=2))
