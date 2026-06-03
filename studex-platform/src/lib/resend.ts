// Thin Resend wrapper. Used by /api/contacts/outreach for personalised B2B sends.
// API key lives only in env (RESEND_API_KEY) — never committed.

import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(args: SendArgs): Promise<{ id: string } | { error: string }> {
  const r = getResend();
  if (!r) return { error: "RESEND_API_KEY not configured" };
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) return { error: "RESEND_FROM_EMAIL not configured" };
  try {
    const res = await r.emails.send({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo,
    });
    if (res.error) return { error: res.error.message || "Resend rejected the send" };
    return { id: res.data?.id || "" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg };
  }
}
