"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type {
  Device,
  DeviceSource,
  DevicesResponse,
  EnqueueCommandResponse,
} from "@/lib/supabase/types";
import {
  Plus,
  Search,
  Wifi,
  Usb,
  Bluetooth,
  Home as HomeIcon,
  RefreshCw,
  AlertTriangle,
  Tv,
  Speaker,
  HardDrive,
  Keyboard,
  Cpu,
  Router,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const POLL_MS = 5000;

type Filter = "all" | DeviceSource;

const SOURCE_LABEL: Record<DeviceSource, string> = {
  wifi: "Wi-Fi",
  usb: "USB",
  ble: "Bluetooth",
  ha: "Home Assistant",
};

const PALETTE = {
  blue: { fg: "#0a84ff", bg: "rgba(10,132,255,0.12)" },
  green: { fg: "#34c759", bg: "rgba(52,199,89,0.14)" },
  orange: { fg: "#ff9f0a", bg: "rgba(255,159,10,0.14)" },
  purple: { fg: "#bf5af2", bg: "rgba(191,90,242,0.14)" },
  teal: { fg: "#5ac8fa", bg: "rgba(90,200,250,0.18)" },
  pink: { fg: "#ff375f", bg: "rgba(255,55,95,0.14)" },
  gray: { fg: "#8e8e93", bg: "rgba(142,142,147,0.18)" },
} as const;
type PaletteKey = keyof typeof PALETTE;

// Pick an icon + colour from heuristic clues. Apple-Home-style categorical colour.
function classify(device: Device): { icon: typeof Tv; color: PaletteKey } {
  const hay = `${device.name ?? ""} ${device.model ?? ""} ${device.manufacturer ?? ""} ${device.type ?? ""}`.toLowerCase();

  if (!device.online) return { icon: Tv, color: "gray" };
  if (device.source === "usb") {
    if (hay.includes("keyboard")) return { icon: Keyboard, color: "teal" };
    return { icon: Usb, color: "teal" };
  }
  if (device.source === "ble") return { icon: Bluetooth, color: "blue" };
  if (device.source === "ha") return { icon: HomeIcon, color: "green" };

  // wifi: heuristic
  if (/homepod|speaker|sonos|airplay/.test(hay)) return { icon: Speaker, color: "pink" };
  if (/tv|frame|chromecast|roku|appletv|apple tv/.test(hay)) return { icon: Tv, color: "purple" };
  if (/raspberr|pi\b/.test(hay)) return { icon: Cpu, color: "orange" };
  if (/router|gateway|netgear|tp-link|asus|netcomm/.test(hay)) return { icon: Router, color: "blue" };
  if (/mac mini|imac|macbook|mac\b/.test(hay)) return { icon: HardDrive, color: "green" };
  return { icon: Wifi, color: "blue" };
}

function isControllable(device: Device): boolean {
  // Any HA entity is controllable; for wifi we treat speakers/TVs as toggleable.
  if (device.source === "ha") return true;
  const hay = `${device.name ?? ""} ${device.model ?? ""}`.toLowerCase();
  return device.source === "wifi" && /homepod|tv|speaker|frame|appletv|apple tv/.test(hay);
}

function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  if (diff < 60_000) return `${Math.round(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)}h ago`;
  return `${Math.round(diff / 86_400_000)}d ago`;
}

export default function DeviceHub() {
  const [data, setData] = useState<DevicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pendingByDevice, setPendingByDevice] = useState<Record<string, "queued" | "error">>({});

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/devices", { cache: "no-store" });
      setData((await res.json()) as DevicesResponse);
      setLastUpdated(new Date());
    } catch {
      // keep last good data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const devices = data?.devices ?? [];
  const counts = data?.counts;
  const hubOnline = (data?.hubs ?? []).some((h) => h.status === "online");
  const hubName = data?.hubs?.[0]?.name ?? "Hub";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devices.filter((d) => {
      if (filter !== "all" && d.source !== filter) return false;
      if (!q) return true;
      return [d.name, d.manufacturer, d.model, d.ip_address, d.mac_address, d.type]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [devices, filter, query]);

  const sendCommand = useCallback(async (device: Device) => {
    setPendingByDevice((p) => ({ ...p, [device.id]: "queued" }));
    try {
      const res = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: device.id, action: "toggle", params: {} }),
      });
      const json = (await res.json()) as EnqueueCommandResponse;
      if (!json.ok) throw new Error(json.error);
      // Clear the badge shortly so it doesn't get sticky.
      setTimeout(() => {
        setPendingByDevice((p) => {
          const next = { ...p };
          delete next[device.id];
          return next;
        });
      }, 2400);
    } catch {
      setPendingByDevice((p) => ({ ...p, [device.id]: "error" }));
      setTimeout(() => {
        setPendingByDevice((p) => {
          const next = { ...p };
          delete next[device.id];
          return next;
        });
      }, 2400);
    }
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ background: "#f5f5f7", color: "#1d1d1f" }}>
      <div className="max-w-5xl mx-auto px-7 py-8 pb-24" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}>
        {/* Top bar */}
        <header className="flex items-end justify-between mb-2">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)]" aria-label="Back">
                <ArrowLeft className="w-4 h-4" style={{ color: "#1d1d1f" }} />
              </Link>
              <h1 className="text-[34px] font-bold tracking-tight leading-none">Home</h1>
            </div>
            <p className="mt-2 text-[15px]" style={{ color: "#6e6e73" }}>
              {hubName} · {counts?.total ?? 0} accessories · {counts?.online ?? 0} online
            </p>
          </div>
          <button
            onClick={load}
            disabled={refreshing}
            className="w-9 h-9 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)] grid place-items-center disabled:opacity-50"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} style={{ color: "#1d1d1f" }} />
          </button>
        </header>

        {/* Status strip */}
        <div className="mt-5 mb-7 flex flex-wrap items-center gap-2">
          <Pill tone={hubOnline ? "online" : "muted"}>
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: hubOnline ? "#34c759" : "#8e8e93" }}
            />
            {hubOnline ? "Hub online" : "Hub offline"}
          </Pill>
          <Pill tone="muted">Updated {lastUpdated ? timeAgo(lastUpdated.toISOString()) : "—"}</Pill>
          {data && !data.configured && (
            <Pill tone="warn">
              <AlertTriangle className="w-3.5 h-3.5" />
              Supabase not configured
            </Pill>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(["all", "wifi", "usb", "ble", "ha"] as Filter[]).map((f) => {
            const label = f === "all" ? "All" : SOURCE_LABEL[f];
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="text-[13px] font-medium rounded-full px-3.5 py-1.5 transition-colors"
                style={{
                  background: active ? "#1d1d1f" : "transparent",
                  color: active ? "#fff" : "#1d1d1f",
                  border: active ? "1px solid #1d1d1f" : "1px solid rgba(60,60,67,0.12)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#8e8e93" }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, vendor, IP, MAC…"
            className="w-full rounded-2xl bg-white pl-9 pr-3 py-2.5 text-[14px] outline-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            style={{ color: "#1d1d1f", border: "1px solid rgba(60,60,67,0.08)" }}
          />
        </div>

        {/* Section title */}
        <h2 className="text-[22px] font-bold tracking-tight mt-2 mb-3">Accessories</h2>

        {/* Device grid */}
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <EmptyState hasDevices={devices.length > 0} />
        ) : (
          <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {filtered.map((d) => (
              <DeviceTile
                key={d.id}
                device={d}
                pending={pendingByDevice[d.id]}
                onAction={() => sendCommand(d)}
              />
            ))}
          </div>
        )}

        {/* Stats card */}
        <h2 className="text-[22px] font-bold tracking-tight mt-8 mb-3">At a glance</h2>
        <div
          className="rounded-2xl bg-white p-5 grid grid-cols-2 sm:grid-cols-4 gap-2"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)" }}
        >
          <Stat label="Accessories" value={counts?.total ?? 0} />
          <Stat label="Online" value={counts?.online ?? 0} color="#34c759" />
          <Stat label="Wi-Fi" value={counts?.wifi ?? 0} />
          <Stat label="USB" value={counts?.usb ?? 0} />
        </div>

        <p className="text-center text-[12px] mt-9" style={{ color: "#6e6e73" }}>
          Read-only mirror of the Mac mini's inventory · service-role API · RLS enforced
        </p>
      </div>
    </div>
  );
}

// ── pieces ──────────────────────────────────────────────────────────

function Pill({ children, tone = "muted" }: { children: React.ReactNode; tone?: "online" | "muted" | "warn" }) {
  const color = tone === "warn" ? "#a8501c" : tone === "online" ? "#1d1d1f" : "#6e6e73";
  const bg = tone === "warn" ? "#fff4e5" : "#ffffff";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium"
      style={{ background: bg, color, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)" }}
    >
      {children}
    </span>
  );
}

function DeviceTile({
  device,
  pending,
  onAction,
}: {
  device: Device;
  pending?: "queued" | "error";
  onAction: () => void;
}) {
  const { icon: Icon, color } = classify(device);
  const palette = PALETTE[color];
  const controllable = isControllable(device);
  const dim = !device.online;
  const stateLabel = !device.online
    ? "No response"
    : device.source === "usb"
    ? "Attached"
    : device.source === "ha"
    ? "Reachable"
    : "On network";
  const stateColor = !device.online ? "#8e8e93" : palette.fg;

  return (
    <div
      className="rounded-[18px] bg-white p-4 flex flex-col gap-3 transition-transform hover:-translate-y-0.5"
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)",
        opacity: dim ? 0.65 : 1,
        minHeight: 148,
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-[10px] grid place-items-center"
          style={{ background: palette.bg, color: palette.fg }}
        >
          <Icon className="w-5 h-5" />
        </div>
        {controllable ? (
          <button
            onClick={onAction}
            className="w-8 h-8 rounded-full grid place-items-center transition-colors"
            style={{
              background: pending === "error"
                ? "rgba(255,55,95,0.14)"
                : pending === "queued"
                ? palette.bg
                : "rgba(60,60,67,0.08)",
              color: pending === "error" ? "#ff375f" : palette.fg,
            }}
            aria-label="Toggle"
            title="Toggle"
          >
            {pending === "queued" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : pending === "error" ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-8 h-8" />
        )}
      </div>
      <div>
        <div className="text-[16px] font-semibold tracking-tight leading-tight" style={{ color: "#1d1d1f" }}>
          {device.name || device.model || device.mac_address || device.external_id}
        </div>
        <div className="text-[13px] mt-0.5" style={{ color: "#6e6e73" }}>
          {(device.manufacturer || SOURCE_LABEL[device.source]) +
            (device.type && device.manufacturer ? ` · ${device.type.replaceAll("_", " ")}` : "")}
        </div>
      </div>
      <div className="flex items-baseline justify-between mt-auto">
        <span className="text-[13px] font-semibold" style={{ color: stateColor }}>
          {pending === "queued" ? "Queued" : pending === "error" ? "Failed" : stateLabel}
        </span>
        <span className="text-[12px]" style={{ color: "#8e8e93" }}>
          {device.ip_address ?? device.mac_address ?? ""}
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value, color = "#1d1d1f" }: { label: string; value: number; color?: string }) {
  return (
    <div
      className="px-1 py-1.5"
      style={{
        borderRight: "1px solid rgba(60,60,67,0.12)",
      }}
    >
      <div className="text-[28px] font-bold tracking-tight leading-none" style={{ color }}>
        {value}
      </div>
      <div className="text-[12px] mt-1" style={{ color: "#6e6e73" }}>{label}</div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[18px] bg-white p-4 animate-pulse"
          style={{ minHeight: 148, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <div className="w-9 h-9 rounded-[10px] bg-[rgba(60,60,67,0.08)]" />
          <div className="h-3 mt-4 w-2/3 rounded bg-[rgba(60,60,67,0.08)]" />
          <div className="h-3 mt-2 w-1/2 rounded bg-[rgba(60,60,67,0.08)]" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasDevices }: { hasDevices: boolean }) {
  return (
    <div
      className="rounded-[18px] bg-white p-10 text-center"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)" }}
    >
      <div className="mx-auto mb-3 w-10 h-10 rounded-full grid place-items-center" style={{ background: "rgba(60,60,67,0.08)" }}>
        <HomeIcon className="w-5 h-5" style={{ color: "#6e6e73" }} />
      </div>
      <p className="text-[16px] font-semibold" style={{ color: "#1d1d1f" }}>
        {hasDevices ? "No accessories match your filter" : "No accessories discovered yet"}
      </p>
      <p className="text-[13px] mt-1.5 max-w-md mx-auto" style={{ color: "#6e6e73" }}>
        {hasDevices
          ? "Try clearing the search or selecting a different source."
          : "Run the Hub Connector on the Mac mini to scan the local network and USB bus. Discovered accessories appear here automatically."}
      </p>
    </div>
  );
}
