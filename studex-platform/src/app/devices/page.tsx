"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Device, DeviceSource, DevicesResponse } from "@/lib/supabase/types";
import {
  ArrowLeft,
  Activity,
  Shield,
  Wifi,
  Usb,
  Bluetooth,
  Server,
  RefreshCw,
  Search,
  Radio,
  Cpu,
  Home,
  AlertTriangle,
} from "lucide-react";

const SOURCE_META: Record<
  DeviceSource,
  { label: string; icon: typeof Wifi; color: string }
> = {
  wifi: { label: "WiFi", icon: Wifi, color: "text-cyber-cyan" },
  usb: { label: "USB", icon: Usb, color: "text-cyber-orange" },
  ble: { label: "Bluetooth", icon: Bluetooth, color: "text-cyber-purple" },
  ha: { label: "Home Assistant", icon: Home, color: "text-cyber-green" },
};

type Filter = "all" | DeviceSource;

const POLL_MS = 5000;

export default function DeviceHub() {
  const [data, setData] = useState<DevicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/devices", { cache: "no-store" });
      const json = (await res.json()) as DevicesResponse;
      setData(json);
      setLastUpdated(new Date());
    } catch {
      setData((prev) => prev);
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

  const hubOnline = (data?.hubs ?? []).some((h) => h.status === "online");

  return (
    <div className="min-h-screen bg-cyber-black">
      <header className="border-b border-white/10 bg-cyber-dark/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Radio className="w-6 h-6 text-cyber-cyan" />
              <h1 className="font-display text-lg font-black text-white">Device Hub</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={hubOnline ? "green" : "destructive"} className={hubOnline ? "animate-pulse" : ""}>
              <Activity className="w-3 h-3 mr-1" />
              {hubOnline ? "HUB ONLINE" : "HUB OFFLINE"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={load} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Not configured / error banner */}
        {data && !data.configured && (
          <Card className="border-cyber-orange/30">
            <CardContent className="p-5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-cyber-orange flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-sm text-white font-bold mb-1">Supabase not configured</p>
                <p className="font-mono text-xs text-gray-400">
                  {data.error ?? "Set the Supabase environment variables to connect the dashboard to your hub."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Devices" value={counts?.total ?? 0} color="text-white" icon={Server} />
          <StatCard label="Online" value={counts?.online ?? 0} color="text-cyber-green" icon={Activity} />
          <StatCard label="WiFi" value={counts?.wifi ?? 0} color="text-cyber-cyan" icon={Wifi} />
          <StatCard label="USB" value={counts?.usb ?? 0} color="text-cyber-orange" icon={Usb} />
          <StatCard label="Bluetooth" value={counts?.ble ?? 0} color="text-cyber-purple" icon={Bluetooth} />
        </section>

        {/* Controls */}
        <section className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "wifi", "usb", "ble", "ha"] as Filter[]).map((f) => {
              const active = filter === f;
              const label = f === "all" ? "All" : SOURCE_META[f].label;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                    active
                      ? "border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan"
                      : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="relative md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, IP, MAC, vendor..."
              className="pl-9 text-xs"
            />
          </div>
        </section>

        {/* Device grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-white/10">
                  <CardContent className="p-5">
                    <div className="h-20 animate-pulse rounded-lg bg-white/5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState hasDevices={devices.length > 0} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((d) => (
                <DeviceCard key={d.id} device={d} />
              ))}
            </div>
          )}
        </section>

        <footer className="flex items-center justify-between font-mono text-[10px] text-gray-600 pt-4 border-t border-white/5">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> Read-only · service-role API · RLS enforced
          </span>
          {lastUpdated && <span>Updated {lastUpdated.toLocaleTimeString()}</span>}
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: typeof Wifi;
}) {
  return (
    <Card className="border-white/10">
      <CardContent className="p-4 text-center">
        <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
        <p className={`font-display text-2xl font-black ${color}`}>{value}</p>
        <p className="font-mono text-[10px] text-gray-500 uppercase mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function DeviceCard({ device }: { device: Device }) {
  const meta = SOURCE_META[device.source];
  const Icon = meta.icon;
  const title = device.name || device.model || device.mac_address || device.external_id;

  return (
    <Card className="border-white/10 hover:border-white/20 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${meta.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm text-white font-bold truncate">{title}</p>
              <p className="font-mono text-[10px] text-gray-500 uppercase">{meta.label}</p>
            </div>
          </div>
          <Badge variant={device.online ? "green" : "destructive"} className="text-[9px] py-0 flex-shrink-0">
            {device.online ? "online" : "offline"}
          </Badge>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          {device.manufacturer && (
            <Row icon={Cpu} label="Vendor" value={device.manufacturer} />
          )}
          {device.ip_address && <Row icon={Wifi} label="IP" value={device.ip_address} />}
          {device.mac_address && <Row icon={Radio} label="MAC" value={device.mac_address} />}
          {device.type && <Row label="Type" value={device.type} />}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Wifi;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-gray-500">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </span>
      <span className="text-gray-300 truncate max-w-[60%]" title={value}>
        {value}
      </span>
    </div>
  );
}

function EmptyState({ hasDevices }: { hasDevices: boolean }) {
  return (
    <Card className="border-white/10">
      <CardContent className="p-10 text-center">
        <Server className="w-10 h-10 text-gray-600 mx-auto mb-4" />
        <p className="font-display text-base text-white font-bold mb-2">
          {hasDevices ? "No devices match your filter" : "No devices discovered yet"}
        </p>
        <p className="font-mono text-xs text-gray-500 max-w-md mx-auto">
          {hasDevices
            ? "Try clearing the search or selecting a different source."
            : "Run the Hub Connector on your always-on home machine (the Mac mini) to scan the local network and USB bus. Discovered devices appear here automatically."}
        </p>
      </CardContent>
    </Card>
  );
}
