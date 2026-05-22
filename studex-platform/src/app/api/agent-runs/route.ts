import { NextResponse } from "next/server";
import { mockProvider } from "@/lib/cloud";

export async function GET() {
  const runs = await mockProvider.listRuns();
  return NextResponse.json({ runs, timestamp: new Date().toISOString() });
}
