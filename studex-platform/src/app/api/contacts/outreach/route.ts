// POST /api/contacts/outreach — personalised B2B cold outreach via Resend.
// Pulls the next N "ready" contacts with email, sends a personalised mail,
// flips status to "contacted", logs to outreach_log.
//
// Body: { batch_size?: number (default 25, max 100),
//         tier?: "A"|"B"|"C"|"D", country?: string, product?: string,
//         template?: string (default "biltong-intro"), dry_run?: boolean }

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/resend";
import type { Contact } from "@/lib/contacts";

const TEMPLATES: Record<string, (c: Contact) => { subject: string; html: string; text: string }> = {
  "biltong-intro": biltongIntro,
};

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin(req);
  if (unauth) return unauth;
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  let body: { batch_size?: number; tier?: string; country?: string; product?: string; template?: string; dry_run?: boolean } = {};
  try { body = await req.json(); } catch { /* allow empty body */ }

  const batchSize = Math.min(Math.max(body.batch_size ?? 25, 1), 100);
  const dryRun = body.dry_run === true;
  const templateKey = body.template || "biltong-intro";
  const tmpl = TEMPLATES[templateKey];
  if (!tmpl) return NextResponse.json({ error: `Unknown template: ${templateKey}` }, { status: 400 });

  // Pull next batch — prioritise ready over lead, higher priority/score first.
  let q = sb
    .from("contacts")
    .select("*")
    .not("email", "is", null)
    .in("status", ["ready", "lead"])
    .order("priority", { ascending: false, nullsFirst: false })
    .order("biltong_score", { ascending: false, nullsFirst: false })
    .limit(batchSize);
  if (body.tier) q = q.eq("tier", body.tier);
  if (body.country) q = q.eq("country", body.country);
  if (body.product) q = q.contains("product_interest", [body.product]);

  const { data: rows, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const stats = { picked: (rows || []).length, sent: 0, failed: 0, skipped: 0 };
  const log: Array<{ email: string; status: string; error?: string }> = [];

  for (const c of (rows || []) as Contact[]) {
    const { subject, html, text } = tmpl(c);

    if (dryRun) {
      stats.skipped++;
      if (log.length < 10) log.push({ email: c.email!, status: "would-send" });
      continue;
    }

    const res = await sendEmail({ to: c.email!, subject, html, text });
    if ("error" in res) {
      stats.failed++;
      await sb.from("outreach_log").insert({
        contact_id: c.id, channel: "email", template: templateKey,
        subject, status: "failed", error: res.error,
      });
      log.push({ email: c.email!, status: "failed", error: res.error });
      continue;
    }
    stats.sent++;
    await sb.from("outreach_log").insert({
      contact_id: c.id, channel: "email", template: templateKey,
      subject, status: "sent", sent_at: new Date().toISOString(),
      metadata: { resend_id: res.id },
    });
    await sb.from("contacts")
      .update({ status: "contacted", contacted_at: new Date().toISOString() })
      .eq("id", c.id!);
    log.push({ email: c.email!, status: "sent" });
  }

  return NextResponse.json({ ok: true, dry_run: dryRun, stats, log });
}

// ---- templates ----
function biltongIntro(c: Contact) {
  const first = c.name.split(/[\s,]/)[0] || "team";
  const product = c.product_interest[0] || "biltong";
  const tierLine = c.tier === "A"
    ? "We're rolling out launch pricing for a small group of premium properties first"
    : "We're partnering with select South African and pan-African operators";

  const subject = `${first} × StudEx Meat — sample box for your kitchen?`;
  const text =
`Hi ${first} team,

I'm reaching out from StudEx Meat (studexmeat.com). We supply traceable, farm-direct ${product} to hotels, lodges and restaurants across Africa.

${tierLine}, with launch pricing, free first-order delivery, and a small sample box on the house so your team can taste before you decide.

Worth a 10-minute call this week? Reply with a time that suits and I'll send a calendar invite.

Best,
StudEx Meat — studexmeat.com

— If this isn't the right contact, no worries: just reply "remove" and we won't be in touch again.`;

  const html = `
<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#222;max-width:560px;">
  <p>Hi ${escapeHtml(first)} team,</p>
  <p>I'm reaching out from <strong>StudEx Meat</strong> (<a href="https://studexmeat.com">studexmeat.com</a>). We supply traceable, farm-direct <strong>${escapeHtml(product)}</strong> to hotels, lodges and restaurants across Africa.</p>
  <p>${escapeHtml(tierLine)}, with launch pricing, free first-order delivery, and a small sample box on the house so your team can taste before you decide.</p>
  <p>Worth a 10-minute call this week? Reply with a time that suits and I'll send a calendar invite.</p>
  <p>Best,<br/>StudEx Meat &middot; <a href="https://studexmeat.com">studexmeat.com</a></p>
  <p style="font-size:12px;color:#888;">If this isn't the right contact, reply "remove" and we won't be in touch again.</p>
</div>`;

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
