"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DigestItem, DigestResponse, DigestSource } from "@/lib/supabase/types";
import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  GitBranch,
  Newspaper,
  Sparkles,
  ExternalLink,
  Search,
  TrendingUp,
} from "lucide-react";

const POLL_MS = 60_000;

const SOURCE_META: Record<
  DigestSource,
  { label: string; icon: typeof GitBranch; fg: string; bg: string; scoreLabel: string }
> = {
  github: { label: "GitHub", icon: GitBranch, fg: "#0a84ff", bg: "rgba(10,132,255,0.12)", scoreLabel: "★" },
  hn: { label: "Hacker News", icon: Newspaper, fg: "#ff6b00", bg: "rgba(255,107,0,0.14)", scoreLabel: "▲" },
  huggingface: { label: "Hugging Face", icon: Sparkles, fg: "#bf5af2", bg: "rgba(191,90,242,0.14)", scoreLabel: "⇓" },
};

const FILTERS: (DigestSource | "all")[] = ["all", "github", "hn", "huggingface"];

function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  if (diff < 60_000) return `${Math.round(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)}h ago`;
  return `${Math.round(diff / 86_400_000)}d ago`;
}

function formatScore(source: DigestSource, score: number | null): string {
  if (score == null) return "—";
  if (source === "huggingface") {
    if (score >= 1_000_000) return `${(score / 1_000_000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}k`;
    return String(score);
  }
  if (score >= 1000) return `${(score / 1000).toFixed(1)}k`;
  return String(score);
}

export default function DigestPage() {
  const [data, setData] = useState<DigestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [query, setQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/digest", { cache: "no-store" });
      setData((await res.json()) as DigestResponse);
      setLastUpdated(new Date());
    } catch {
      /* keep previous data */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const items = data?.items ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (filter !== "all" && it.source !== filter) return false;
      if (!q) return true;
      return [it.title, it.description, it.author, it.language]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [items, filter, query]);

  const grouped = useMemo(() => {
    const g: Record<DigestSource, DigestItem[]> = { github: [], hn: [], huggingface: [] };
    for (const it of filtered) g[it.source].push(it);
    return g;
  }, [filtered]);

  const hasAny = items.length > 0;

  return (
    <div className="min-h-screen w-full" style={{ background: "#f5f5f7", color: "#1d1d1f" }}>
      <div
        className="max-w-6xl mx-auto px-7 py-8 pb-24"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
      >
        {/* Top bar */}
        <header className="flex items-end justify-between mb-2">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)]"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" style={{ color: "#1d1d1f" }} />
              </Link>
              <h1 className="text-[34px] font-bold tracking-tight leading-none">Today in AI</h1>
            </div>
            <p className="mt-2 text-[15px]" style={{ color: "#6e6e73" }}>
              {data?.date ? `Digest for ${data.date}` : "Daily digest — GitHub · HN · Hugging Face"}
              {hasAny ? ` · ${items.length} items` : ""}
            </p>
          </div>
          <button
            onClick={load}
            disabled={refreshing}
            className="w-9 h-9 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)] grid place-items-center disabled:opacity-50"
            aria-label="Refresh"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              style={{ color: "#1d1d1f" }}
            />
          </button>
        </header>

        {/* Status strip */}
        <div className="mt-5 mb-7 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium bg-white"
            style={{ color: "#6e6e73", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)" }}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Updated {lastUpdated ? timeAgo(lastUpdated.toISOString()) : "—"}
          </span>
          {data && !data.configured && (
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium"
              style={{ background: "#fff4e5", color: "#a8501c" }}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Supabase not configured
            </span>
          )}
        </div>

        {/* Filters + search */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTERS.map((f) => {
            const active = filter === f;
            const label = f === "all" ? "All" : SOURCE_META[f].label;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="text-[13px] font-medium rounded-full px-3.5 py-1.5 transition-colors"
                style={{
                  background: active ? "#1d1d1f" : "transparent",
                  color: active ? "#fff" : "#1d1d1f",
                  border: active ? "1px solid #1d1d1f" : "1px solid rgba(60,60,67,0.12)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8e8e93" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, author, language…"
            className="w-full rounded-2xl bg-white pl-9 pr-3 py-2.5 text-[14px] outline-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            style={{ color: "#1d1d1f", border: "1px solid rgba(60,60,67,0.08)" }}
          />
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonColumns />
        ) : !hasAny ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            {(Object.keys(grouped) as DigestSource[]).map((src) => {
              const list = grouped[src];
              if (list.length === 0) return null;
              const meta = SOURCE_META[src];
              const Icon = meta.icon;
              return (
                <section key={src}>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-[10px] grid place-items-center"
                      style={{ background: meta.bg, color: meta.fg }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-[18px] font-bold tracking-tight">{meta.label}</h2>
                    <span className="text-[13px]" style={{ color: "#8e8e93" }}>
                      · top {list.length}
                    </span>
                  </div>
                  <ol className="space-y-2">
                    {list.map((it) => (
                      <DigestRow key={it.id} item={it} />
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        )}

        <p className="text-center text-[12px] mt-9" style={{ color: "#6e6e73" }}>
          Read-only mirror · refreshed daily by cron · service-role API
        </p>
      </div>
    </div>
  );
}

function DigestRow({ item }: { item: DigestItem }) {
  const meta = SOURCE_META[item.source];
  return (
    <li
      className="rounded-[14px] bg-white p-3.5"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)" }}
    >
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
        <div className="flex items-start gap-3">
          <div
            className="text-[11px] font-semibold w-6 h-6 rounded-full grid place-items-center flex-shrink-0"
            style={{ background: meta.bg, color: meta.fg }}
          >
            {item.rank}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold tracking-tight leading-snug group-hover:underline" style={{ color: "#1d1d1f" }}>
              {item.title}
              <ExternalLink className="inline w-3 h-3 ml-1 opacity-40" />
            </div>
            {item.description && (
              <p
                className="text-[12.5px] mt-1 line-clamp-2"
                style={{ color: "#6e6e73" }}
              >
                {item.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1.5 text-[11.5px]" style={{ color: "#8e8e93" }}>
              {item.author && <span>{item.author}</span>}
              {item.language && <span>· {item.language}</span>}
              {item.score != null && (
                <span className="ml-auto font-semibold" style={{ color: meta.fg }}>
                  {meta.scoreLabel} {formatScore(item.source, item.score)}
                </span>
              )}
            </div>
          </div>
        </div>
      </a>
    </li>
  );
}

function SkeletonColumns() {
  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
      {[0, 1, 2].map((c) => (
        <section key={c}>
          <div className="h-6 w-32 mb-3 rounded bg-[rgba(60,60,67,0.08)] animate-pulse" />
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((r) => (
              <div key={r} className="rounded-[14px] bg-white p-4 animate-pulse">
                <div className="h-3 w-3/4 bg-[rgba(60,60,67,0.08)] rounded" />
                <div className="h-3 w-1/2 mt-2 bg-[rgba(60,60,67,0.08)] rounded" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-[18px] bg-white p-10 text-center"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)" }}
    >
      <div className="mx-auto mb-3 w-10 h-10 rounded-full grid place-items-center" style={{ background: "rgba(60,60,67,0.08)" }}>
        <Sparkles className="w-5 h-5" style={{ color: "#6e6e73" }} />
      </div>
      <p className="text-[16px] font-semibold" style={{ color: "#1d1d1f" }}>
        No digest yet
      </p>
      <p className="text-[13px] mt-1.5 max-w-md mx-auto" style={{ color: "#6e6e73" }}>
        The daily digest hasn&apos;t run yet. Trigger it manually with:
        <br />
        <code className="text-[12px]">
          curl -H &quot;Authorization: Bearer $CRON_SECRET&quot; /api/digest/refresh
        </code>
      </p>
    </div>
  );
}
