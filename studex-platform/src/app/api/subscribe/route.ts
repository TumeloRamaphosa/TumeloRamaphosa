import { NextRequest, NextResponse } from "next/server";

// Subscribes a visitor to a Listmonk list. Two audiences:
//   "meat"  -> studexmeat.com consumer list
//   "agent" -> Agent-as-a-Service B2B list
//   "both"  -> subscribed to both lists
// Listmonk sends a double opt-in confirmation by default (POPIA/GDPR-friendly).

const LISTMONK_URL = process.env.LISTMONK_API_URL;
const LISTMONK_USER = process.env.LISTMONK_API_USER;
const LISTMONK_TOKEN = process.env.LISTMONK_API_TOKEN;

const LIST_IDS: Record<string, number[]> = {
  meat: numList(process.env.LISTMONK_LIST_MEAT),
  agent: numList(process.env.LISTMONK_LIST_AGENT),
  both: [...numList(process.env.LISTMONK_LIST_MEAT), ...numList(process.env.LISTMONK_LIST_AGENT)],
};

function numList(v?: string): number[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isInteger(n));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (!LISTMONK_URL || !LISTMONK_USER || !LISTMONK_TOKEN) {
    return NextResponse.json(
      { error: "Newsletter is not configured yet. Please try again later." },
      { status: 503 }
    );
  }

  let body: { email?: string; name?: string; list?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const name = (body.name || "").trim();
  const listKey = (body.list || "agent").toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const lists = LIST_IDS[listKey];
  if (!lists || lists.length === 0) {
    return NextResponse.json({ error: "Unknown or unconfigured list." }, { status: 400 });
  }

  try {
    const res = await fetch(`${LISTMONK_URL.replace(/\/$/, "")}/api/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${LISTMONK_USER}:${LISTMONK_TOKEN}`,
      },
      body: JSON.stringify({
        email,
        name: name || email.split("@")[0],
        status: "enabled",
        lists,
        // false => Listmonk emails an opt-in confirmation (consent + better deliverability).
        preconfirm_subscriptions: false,
      }),
    });

    if (res.status === 409) {
      // Already subscribed — treat as success so we don't leak list membership.
      return NextResponse.json({ ok: true, message: "You're already on the list." });
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Listmonk subscribe failed", res.status, detail);
      return NextResponse.json({ error: "Could not subscribe right now." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, message: "Check your inbox to confirm." });
  } catch (err) {
    console.error("Listmonk subscribe error", err);
    return NextResponse.json({ error: "Could not reach the newsletter service." }, { status: 502 });
  }
}
