// Fly.io Sprites adapter — implements CloudProvider against the Sprites REST API.
//
// Sprites are persistent Firecracker microVMs (proper isolation for untrusted /
// customer agent code). Docs: https://docs.sprites.dev/api/  Base: api.sprites.dev/v1
//   POST   /v1/sprites          create   { name, url_settings: { auth } }
//   GET    /v1/sprites          list     -> [{ id, name, organization, url, status, created_at }]
//   DELETE /v1/sprites/{name}   destroy
//   Auth: Authorization: Bearer $SPRITES_TOKEN   status: cold | warm | running
//
// Gated on SPRITES_TOKEN. When unset, getProvider() falls back to the mock so the
// demo keeps working. Set the token to make /console + /api/provision operate on
// real Sprites.

import {
  type CloudProvider,
  type VM,
  type VMStatus,
  type VMRegion,
  type AgentRun,
  type AgentRuntime,
  type ProvisionRequest,
  type ProvisionResult,
  type BootstrapStep,
  RUNTIME_LABELS,
  mockProvider,
} from "@/lib/cloud";

const SPRITES_BASE = process.env.SPRITES_API_URL || "https://api.sprites.dev/v1";
const TOKEN = process.env.SPRITES_TOKEN || process.env.FLY_API_TOKEN || "";
// Our region label to display. Fly's South Africa code is "jnb"; our enum is "jnb1".
const DEFAULT_REGION = (process.env.SPRITES_DEFAULT_REGION as VMRegion) || "jnb1";

export function hasFlyCredentials(): boolean {
  return TOKEN.length > 0;
}

interface SpriteObject {
  id: string;
  name: string;
  organization?: string;
  url?: string;
  status?: string;
  created_at?: string;
  url_settings?: { auth?: string };
}

async function spritesFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SPRITES_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Sprites API ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

function mapStatus(s?: string): VMStatus {
  switch (s) {
    case "running":
    case "warm":
      return "running";
    case "cold":
      return "stopped";
    default:
      return "provisioning";
  }
}

function spriteToVM(s: SpriteObject, agent: AgentRuntime = "openclaw"): VM {
  return {
    id: s.id,
    name: s.name,
    status: mapStatus(s.status),
    region: DEFAULT_REGION,
    owner: s.organization || "studex",
    ip: s.url || "—",
    os: "Sprite · Firecracker microVM",
    // Sprites manages sizing; show a representative tier (100GB NVMe per Sprite).
    spec: { cpu: 2, ramGb: 8, diskGb: 100 },
    usage: { cpu: 0, ram: 0, disk: 0 },
    agent,
    createdAt: s.created_at || new Date().toISOString(),
  };
}

async function listVMs(): Promise<VM[]> {
  const data = await spritesFetch<{ sprites?: SpriteObject[] } | SpriteObject[]>("/sprites");
  const sprites = Array.isArray(data) ? data : data.sprites ?? [];
  return sprites.map((s) => spriteToVM(s));
}

// Agent runs are our own domain concept (the Kanban), not something Sprites tracks.
// They'll come from the Supabase `agent_runs` table in Phase 2; mock for now.
async function listRuns(): Promise<AgentRun[]> {
  return mockProvider.listRuns();
}

async function provision(req: ProvisionRequest): Promise<ProvisionResult> {
  const safeName =
    req.name.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 40) || `vm-${Date.now()}`;

  const bootstrap: BootstrapStep[] = [];
  const sprite = await spritesFetch<SpriteObject>("/sprites", {
    method: "POST",
    // Stick to documented fields. Region is account-managed by Sprites today.
    body: JSON.stringify({ name: safeName, url_settings: { auth: "public" } }),
  });

  bootstrap.push(
    { step: `Created Sprite "${sprite.name}" (Firecracker microVM)`, status: "ok" },
    { step: `Public endpoint: ${sprite.url || "provisioning"}`, status: "ok" }
  );

  // TODO(phase 3): exec into the Sprite to install + start the agent runtime
  // (OpenClaw/Hermes) via the Sprites exec/services API, then have it heartbeat
  // into /api/agent-runs so the Kanban reflects live activity.
  if (req.agent !== "none") {
    bootstrap.push({
      step: `Queued ${RUNTIME_LABELS[req.agent]} runtime install`,
      status: "pending",
    });
  }

  const vm = spriteToVM(sprite, req.agent);
  vm.region = req.region;
  vm.spec = { ...req.spec, diskGb: req.spec.diskGb || 100 };
  return { vm, bootstrap };
}

export const flyProvider: CloudProvider = { listVMs, listRuns, provision };
