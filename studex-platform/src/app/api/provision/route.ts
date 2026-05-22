import { NextResponse } from "next/server";
import { mockProvider, type ProvisionRequest, type AgentRuntime, type VMRegion } from "@/lib/cloud";

const VALID_REGIONS: VMRegion[] = ["jnb1", "cpt1", "eu-central"];
const VALID_AGENTS: AgentRuntime[] = ["openclaw", "hermes", "claude-code", "none"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const region: VMRegion = VALID_REGIONS.includes(body.region) ? body.region : "jnb1";
  const agent: AgentRuntime = VALID_AGENTS.includes(body.agent) ? body.agent : "openclaw";
  const spec = {
    cpu: Number(body?.spec?.cpu) || 2,
    ramGb: Number(body?.spec?.ramGb) || 8,
    diskGb: Number(body?.spec?.diskGb) || 40,
  };

  const request: ProvisionRequest = {
    name: body.name.trim(),
    region,
    agent,
    spec,
    owner: typeof body.owner === "string" ? body.owner : undefined,
  };

  // Seam: this is where a real CoolifyProvider/OrgoProvider/Firecracker adapter runs.
  const result = await mockProvider.provision(request);
  return NextResponse.json(result);
}
