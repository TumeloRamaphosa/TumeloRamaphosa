import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { DigestItem, DigestResponse } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function empty(extra: Partial<DigestResponse> = {}): DigestResponse {
  return { configured: false, items: [], date: null, ...extra };
}

export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json(empty({ error: "Supabase not configured" }));
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { searchParams } = new URL(req.url);
  const requested = searchParams.get("date");

  let date = requested;
  if (!date) {
    const latest = await supabase
      .from("ai_digest")
      .select("digest_date")
      .order("digest_date", { ascending: false })
      .limit(1);
    date = (latest.data?.[0]?.digest_date as string | undefined) ?? null;
  }

  if (!date) {
    return NextResponse.json({ configured: true, items: [], date: null } as DigestResponse);
  }

  const { data, error } = await supabase
    .from("ai_digest")
    .select("*")
    .eq("digest_date", date)
    .order("source", { ascending: true })
    .order("rank", { ascending: true });

  if (error) {
    return NextResponse.json({
      configured: true,
      items: [],
      date,
      error: error.message,
    } as DigestResponse);
  }

  return NextResponse.json({
    configured: true,
    items: (data ?? []) as DigestItem[],
    date,
  } as DigestResponse);
}
