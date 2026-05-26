import { NextResponse } from "next/server";
import { mockProvider } from "@/lib/cloud";
import { getProvider } from "@/lib/provider";

export async function GET() {
  try {
    const runs = await getProvider().listRuns();
    return NextResponse.json({ runs, timestamp: new Date().toISOString() });
  } catch {
    const runs = await mockProvider.listRuns();
    return NextResponse.json({ runs, timestamp: new Date().toISOString() });
  }
}
