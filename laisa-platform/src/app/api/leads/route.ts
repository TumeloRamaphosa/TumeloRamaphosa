import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = body.email;
  const company = typeof body.company === "string" ? body.company.trim() : null;
  const message = typeof body.message === "string" ? body.message.trim() : null;
  const source = typeof body.source === "string" ? body.source : "laisa";

  if (!name || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid name and email." },
      { status: 400 }
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Allows the site to demo before Supabase is connected.
    console.warn("[leads] Supabase not configured — lead not persisted:", {
      name,
      email,
      source,
    });
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const supabase = await createServiceRoleClient();
    const { error } = await supabase.from("leads").insert({
      name,
      email,
      company,
      message,
      source,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true, persisted: true });
  } catch (e) {
    console.error("[leads] insert failed:", e);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 }
    );
  }
}
