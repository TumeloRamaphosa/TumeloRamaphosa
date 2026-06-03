// GET /api/contacts — list with filters (admin-only).
// Query: ?tier=A&country=SA&product=Biltong&status=ready&has_email=1&search=&limit=&offset=

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export async function GET(req: NextRequest) {
  const unauth = await requireAdmin(req);
  if (unauth) return unauth;
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const u = req.nextUrl.searchParams;
  const tier = u.get("tier");
  const country = u.get("country");
  const product = u.get("product");
  const status = u.get("status");
  const hasEmail = u.get("has_email");
  const search = u.get("search");
  const limit = clamp(parseInt(u.get("limit") || "100", 10), 1, 500);
  const offset = Math.max(0, parseInt(u.get("offset") || "0", 10));

  let q = sb.from("contacts").select("*", { count: "exact" });
  if (tier) q = q.eq("tier", tier);
  if (country) q = q.eq("country", country);
  if (status) q = q.eq("status", status);
  if (product) q = q.contains("product_interest", [product]);
  if (hasEmail === "1") q = q.not("email", "is", null);
  if (hasEmail === "0") q = q.is("email", null);
  if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%,website.ilike.%${search}%`);

  const { data, count, error } = await q
    .order("priority", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, count, limit, offset });
}

function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}
