"use client";

import { useEffect, useState } from "react";
import { Plug, Loader2 } from "lucide-react";
import type { Brand } from "@/lib/brand";

type Conn = { app: string; connected: boolean; status?: string };
type StatusResp =
  | { ok: true; count: number; connections: Conn[] }
  | { ok: false; reason: string; status?: number; connections: Conn[] };

const LABEL: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  googleads: "Google Ads",
  gmail: "Gmail",
  website: "Website",
};

export function ComposioStatus({ brand }: { brand: Brand }) {
  const [state, setState] = useState<StatusResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/composio/status", { cache: "no-store" });
        const j = (await r.json()) as StatusResp;
        if (alive) setState(j);
      } catch {
        if (alive)
          setState({
            ok: false,
            reason: "fetch_failed",
            connections: Object.keys(LABEL).map((app) => ({
              app,
              connected: false,
            })),
          });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const connections = state?.connections ?? [];
  const liveCount = connections.filter((c) => c.connected).length;

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2
          className="text-sm font-bold uppercase tracking-[0.2em]"
          style={{ color: brand.accent }}
        >
          Connected assets — Composio
        </h2>
        <span
          className="text-[11px] flex items-center gap-2"
          style={{ color: brand.muted }}
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> checking…
            </>
          ) : state?.ok ? (
            <>
              <span className="handled-dot" /> live · {liveCount} of{" "}
              {connections.length} connected
            </>
          ) : state?.reason === "missing_key" ? (
            <>API key missing — add COMPOSIO_API_KEY to .env.local</>
          ) : (
            <>Composio unreachable (status {state?.status ?? "—"})</>
          )}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {connections.map((c) => (
          <div
            key={c.app}
            style={{
              background: brand.card,
              border: `1px solid ${brand.border}`,
            }}
            className="rounded-xl p-4 text-center relative"
          >
            <Plug
              className="w-5 h-5 mx-auto mb-2"
              style={{ color: c.connected ? brand.primary : brand.muted }}
            />
            <div className="text-sm font-medium" style={{ color: brand.text }}>
              {LABEL[c.app] ?? c.app}
            </div>
            <div
              className="text-[11px] mt-1 flex items-center justify-center gap-1.5"
              style={{
                color: c.connected ? brand.text : brand.muted,
              }}
            >
              {c.connected && <span className="handled-dot" />}
              {c.connected
                ? c.status?.toLowerCase() === "active"
                  ? "Connected"
                  : c.status ?? "Connected"
                : "Ready to link"}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] mt-3" style={{ color: brand.muted }}>
        {state?.ok
          ? "Live status from your Composio account. Connect the rest in the Composio dashboard to take this section fully green."
          : "Showing offline preview. Live the moment the key reaches Composio."}
      </p>
    </section>
  );
}
