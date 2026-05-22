import { NextResponse } from "next/server";

// Signup/waitlist capture. Stub today — wire to Supabase `leads` table (see
// migration 002_cloud_schema.sql) once the project has credentials configured.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }
  // TODO(phase 2): persist to Supabase `leads` and trigger onboarding email.
  return NextResponse.json({ ok: true, email, queued: true });
}
