// POST /api/contacts/sync-listmonk — push contacts with email into the
// right Listmonk segmented lists. Idempotent: Listmonk's /api/subscribers
// returns 409 on duplicate, which we treat as success.
//
// Body (optional): { tier?: "A"|"B"|"C"|"D", country?: string, dry_run?: boolean, limit?: number }

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { listmonkSegments, type Contact } from "@/lib/contacts";

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin(req);
  if (unauth) return unauth;

  const url = process.env.LISTMONK_API_URL;
  const user = process.env.LISTMONK_API_USER;
  const token = process.env.LISTMONK_API_TOKEN;
  if (!url || !user || !token) {
    return NextResponse.json({ error: "Listmonk env vars not set" }, { status: 503 });
  }
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  let body: { tier?: string; country?: string; dry_run?: boolean; limit?: number } = {};
  try { body = await req.json(); } catch { /* allow empty body */ }
  const dryRun = body.dry_run === true;
  const limit = Math.min(Math.max(body.limit ?? 500, 1), 2000);

  let q = sb.from("contacts").select("*").not("email", "is", null).limit(limit);
  if (body.tier) q = q.eq("tier", body.tier);
  if (body.country) q = q.eq("country", body.country);
  const { data: rows, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const stats = { processed: 0, pushed: 0, alreadyIn: 0, skipped: 0, failed: 0 };
  const sample: Array<{ email: string; lists: number[]; result: string }> = [];

  for (const c of (rows || []) as Contact[]) {
    stats.processed++;
    const segs = listmonkSegments(c);
    const listIds = segs
      .map((envKey) => parseInt(process.env[envKey] || "", 10))
      .filter((n) => Number.isInteger(n));
    if (listIds.length === 0) { stats.skipped++; continue; }
    if (dryRun) {
      if (sample.length < 20) sample.push({ email: c.email!, lists: listIds, result: "would-push" });
      continue;
    }

    const res = await fetch(`${url.replace(/\/$/, "")}/api/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `token ${user}:${token}` },
      body: JSON.stringify({
        email: c.email,
        name: c.name,
        status: "enabled",
        lists: listIds,
        preconfirm_subscriptions: true, // imported contacts: don't spam them with opt-in mail
        attribs: { tier: c.tier, country: c.country, products: c.product_interest, business_type: c.business_type },
      }),
    });

    if (res.status === 409) {
      stats.alreadyIn++;
    } else if (res.ok) {
      stats.pushed++;
      const j = await res.json().catch(() => null);
      const lmId = j?.data?.id;
      if (Number.isInteger(lmId)) {
        await sb.from("contacts").update({ listmonk_subscriber_id: lmId }).eq("id", c.id!);
      }
    } else {
      stats.failed++;
      if (sample.length < 20) sample.push({ email: c.email!, lists: listIds, result: `error ${res.status}` });
    }
  }

  return NextResponse.json({ ok: true, dry_run: dryRun, stats, sample });
}
