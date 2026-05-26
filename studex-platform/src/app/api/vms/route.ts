import { NextResponse } from "next/server";
import { mockProvider } from "@/lib/cloud";
import { getProvider, activeProviderName } from "@/lib/provider";

export async function GET() {
  try {
    const vms = await getProvider().listVMs();
    return NextResponse.json({ vms, provider: activeProviderName(), timestamp: new Date().toISOString() });
  } catch (e) {
    // Real provider failed (bad token / API down) — fall back to mock so the UI stays alive.
    const vms = await mockProvider.listVMs();
    return NextResponse.json({ vms, provider: "mock", warning: String(e), timestamp: new Date().toISOString() });
  }
}
