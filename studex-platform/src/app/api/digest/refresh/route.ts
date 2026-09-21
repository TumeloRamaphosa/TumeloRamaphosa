import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { DigestRefreshResponse } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ── Auth gate ─────────────────────────────────────────────────────────
// Accepts:
//   - Authorization: Bearer <CRON_SECRET>  (works from cron providers, curl, GH Actions)
//   - Vercel Cron's own header pattern (Vercel injects Authorization automatically).
function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

// ── Digest item shape (what we write to the ai_digest table) ─────────
interface Row {
  digest_date: string;
  source: "github" | "hn" | "huggingface";
  rank: number;
  title: string;
  url: string;
  author: string | null;
  description: string | null;
  score: number | null;
  language: string | null;
  metadata: Record<string, unknown>;
}

const AI_KEYWORDS = [
  "ai", "agent", "agents", "llm", "gpt", "claude", "openai", "anthropic",
  "gemini", "diffusion", "rag", "prompt", "neural", "transformer", "mcp",
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Sources ──────────────────────────────────────────────────────────
async function fetchGitHub(day: string): Promise<Row[]> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);
  const url = `https://api.github.com/search/repositories?q=topic:ai+pushed:%3E${weekAgo}&sort=stars&order=desc&per_page=10`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "studex-digest" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`github ${res.status}`);
  const json = (await res.json()) as { items?: Array<Record<string, unknown>> };
  return (json.items ?? []).slice(0, 10).map((r, i): Row => {
    const owner = (r.owner as Record<string, unknown> | undefined)?.login as string | undefined;
    return {
      digest_date: day,
      source: "github",
      rank: i + 1,
      title: (r.full_name as string) ?? "",
      url: (r.html_url as string) ?? "",
      author: owner ?? null,
      description: (r.description as string | null) ?? null,
      score: (r.stargazers_count as number | null) ?? null,
      language: (r.language as string | null) ?? null,
      metadata: { topics: r.topics ?? [], updated_at: r.updated_at },
    };
  });
}

async function fetchHn(day: string): Promise<Row[]> {
  const ids = (await (await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", { cache: "no-store" })).json()) as number[];
  const picks: Row[] = [];
  // Scan top ~50 to find enough AI-adjacent titles.
  for (const id of ids.slice(0, 60)) {
    if (picks.length >= 10) break;
    const item = (await (await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { cache: "no-store" })).json()) as Record<string, unknown> | null;
    if (!item) continue;
    const title = String(item.title ?? "");
    const url = (item.url as string | null) ?? null;
    if (!title || !url) continue;
    const lc = title.toLowerCase();
    if (!AI_KEYWORDS.some((k) => lc.includes(k))) continue;
    picks.push({
      digest_date: day,
      source: "hn",
      rank: picks.length + 1,
      title,
      url,
      author: (item.by as string | null) ?? null,
      description: null,
      score: (item.score as number | null) ?? null,
      language: null,
      metadata: { hn_id: item.id, comments: item.descendants ?? 0 },
    });
  }
  return picks;
}

async function fetchHuggingFace(day: string): Promise<Row[]> {
  const url = "https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=10";
  const res = await fetch(url, { cache: "no-store", headers: { "User-Agent": "studex-digest" } });
  if (!res.ok) throw new Error(`huggingface ${res.status}`);
  const models = (await res.json()) as Array<Record<string, unknown>>;
  return models.slice(0, 10).map((m, i): Row => {
    const id = String((m.id ?? m.modelId ?? "") as string);
    return {
      digest_date: day,
      source: "huggingface",
      rank: i + 1,
      title: id,
      url: `https://huggingface.co/${id}`,
      author: id.split("/")[0] || null,
      description: (m.pipeline_tag as string | null) ?? null,
      score: (m.downloads as number | null) ?? null,
      language: null,
      metadata: { likes: m.likes ?? 0, trendingScore: m.trendingScore ?? 0, tags: m.tags ?? [] },
    };
  });
}

// ── Handler ──────────────────────────────────────────────────────────
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json<DigestRefreshResponse>(
      { ok: false, error: "unauthorized (set CRON_SECRET and pass Authorization: Bearer)" },
      { status: 401 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json<DigestRefreshResponse>(
      { ok: false, error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const day = todayIso();
  const results = await Promise.allSettled([
    fetchGitHub(day),
    fetchHn(day),
    fetchHuggingFace(day),
  ]);
  const rows: Row[] = [];
  const errors: string[] = [];
  const names = ["github", "hn", "huggingface"] as const;
  results.forEach((r, i) => {
    if (r.status === "fulfilled") rows.push(...r.value);
    else errors.push(`${names[i]}: ${String((r as PromiseRejectedResult).reason)}`);
  });

  if (!rows.length) {
    return NextResponse.json<DigestRefreshResponse>(
      { ok: false, error: "no items collected", errors },
      { status: 502 }
    );
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase
    .from("ai_digest")
    .upsert(rows, { onConflict: "digest_date,source,rank" });
  if (error) {
    return NextResponse.json<DigestRefreshResponse>(
      { ok: false, error: error.message, errors },
      { status: 500 }
    );
  }

  return NextResponse.json<DigestRefreshResponse>({
    ok: true,
    digest_date: day,
    inserted: rows.length,
    errors,
  });
}
