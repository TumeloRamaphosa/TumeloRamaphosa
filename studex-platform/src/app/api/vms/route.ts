import { NextResponse } from "next/server";
import { mockProvider } from "@/lib/cloud";

export async function GET() {
  const vms = await mockProvider.listVMs();
  return NextResponse.json({ vms, timestamp: new Date().toISOString() });
}
