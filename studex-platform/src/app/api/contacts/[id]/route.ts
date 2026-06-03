// PATCH /api/contacts/[id] — update a contact (status, notes, tags, etc.).
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

const ALLOWED_FIELDS = new Set([
  "status", "notes", "tags", "tier", "country", "region",
  "email", "website", "business_type", "product_interest",
  "priority", "biltong_score", "website_score",
]);

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin(req);
  if (unauth) return unauth;
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const { id } = await ctx.params;

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) if (ALLOWED_FIELDS.has(k)) patch[k] = v;
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: "No allowed fields in body" }, { status: 400 });

  const { data, error } = await sb.from("contacts").update(patch).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
