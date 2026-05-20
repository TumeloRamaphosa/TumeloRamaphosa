import { NextResponse } from "next/server";

// Server-only Composio status proxy. Keeps COMPOSIO_API_KEY off the client.
// Hits Composio v3 to list connected accounts + available toolkits, returns
// a normalized payload the dashboard can render directly.

const BASE = "https://backend.composio.dev";
const APPS = [
  "facebook",
  "instagram",
  "whatsapp",
  "googleads",
  "gmail",
  "website",
] as const;

type ConnectionState = {
  app: string;
  connected: boolean;
  status?: string;
  id?: string;
};

async function fetchJSON(path: string, key: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "x-api-key": key, accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    return { ok: false, status: res.status, body: await res.text() };
  }
  return { ok: true, status: 200, body: await res.json() };
}

export async function GET() {
  const key = process.env.COMPOSIO_API_KEY;
  if (!key) {
    return NextResponse.json({
      ok: false,
      reason: "missing_key",
      connections: APPS.map((app) => ({ app, connected: false })),
    });
  }

  const conn = await fetchJSON("/api/v3/connected_accounts", key);

  if (!conn.ok) {
    return NextResponse.json({
      ok: false,
      reason: "composio_error",
      status: conn.status,
      connections: APPS.map((app) => ({ app, connected: false })),
    });
  }

  const body = conn.body as { items?: unknown[]; data?: unknown[] };
  const items: unknown[] = body.items ?? body.data ?? [];

  const byApp = new Map<string, ConnectionState>();
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const slug = (
      (typeof r.toolkit_slug === "string" && r.toolkit_slug) ||
      (typeof r.app_name === "string" && r.app_name) ||
      (typeof r.appName === "string" && r.appName) ||
      ""
    )
      .toString()
      .toLowerCase();
    if (!slug) continue;
    const status = typeof r.status === "string" ? r.status : undefined;
    const id = typeof r.id === "string" ? r.id : undefined;
    const connected = status ? status.toLowerCase() === "active" : true;
    if (!byApp.has(slug)) byApp.set(slug, { app: slug, connected, status, id });
  }

  const connections: ConnectionState[] = APPS.map((app) => {
    const aliases: Record<string, string[]> = {
      facebook: ["facebook", "meta_facebook"],
      instagram: ["instagram"],
      whatsapp: ["whatsapp", "whatsapp_business"],
      googleads: ["googleads", "google_ads"],
      gmail: ["gmail"],
      website: ["website"],
    };
    for (const key of aliases[app] ?? [app]) {
      const hit = byApp.get(key);
      if (hit) return { ...hit, app };
    }
    return { app, connected: false };
  });

  return NextResponse.json({
    ok: true,
    count: items.length,
    connections,
  });
}
