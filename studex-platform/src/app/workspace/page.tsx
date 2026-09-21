"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Search, Star } from "lucide-react";
import manifest from "@/data/workspace-assets.json";

type Stage = "live" | "ready" | "draft" | "research";

interface Asset {
  id: string;
  name: string;
  path: string;
  type: string;
  stage: string;
  location: string;
  note: string;
  restricted?: boolean;
  flagship?: boolean;
}

interface Line {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  assets: Asset[];
}

const lines = manifest.lines as Line[];
const allAssets = lines.flatMap((line) => line.assets);

const STAGES: Stage[] = ["live", "ready", "draft", "research"];

const stageVariant: Record<Stage, "green" | "default" | "orange" | "magenta"> = {
  live: "green",
  ready: "default",
  draft: "orange",
  research: "magenta",
};

const stageCount = (stage: Stage) => allAssets.filter((a) => a.stage === stage).length;

export default function WorkspacePage() {
  const [query, setQuery] = useState("");
  const [line, setLine] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lines
      .filter((l) => !line || l.id === line)
      .map((l) => ({
        ...l,
        assets: l.assets.filter(
          (a) =>
            (!stage || a.stage === stage) &&
            (!q ||
              `${a.name} ${a.path} ${a.note} ${a.type}`.toLowerCase().includes(q))
        ),
      }))
      .filter((l) => l.assets.length > 0);
  }, [query, line, stage]);

  const shown = visible.reduce((total, l) => total + l.assets.length, 0);

  return (
    <main className="relative min-h-screen bg-cyber-black">
      <div className="pointer-events-none absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-10" />
      <div className="relative mx-auto max-w-6xl px-4 pb-24">
        <header className="border-b border-white/10 pt-20 pb-8">
          <h1 className="font-display text-4xl font-black tracking-tight text-white md:text-5xl">
            Workspace Index
          </h1>
          <p className="mt-3 max-w-2xl font-mono text-sm text-gray-400">
            {manifest.description.split(" Single source of truth")[0].trim()}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-gray-500">
            <span>
              <b className="font-medium text-cyber-cyan">{allAssets.length}</b> assets
            </span>
            <span>
              <b className="font-medium text-cyber-cyan">{lines.length}</b> business lines
            </span>
            <span>
              <b className="font-medium text-cyber-green">{stageCount("live")}</b> live
            </span>
            <span>
              <b className="font-medium text-cyber-cyan">{stageCount("ready")}</b> ready to fire
            </span>
            <span>
              updated <b className="font-medium text-white">{manifest.updated}</b>
            </span>
          </div>
        </header>

        <div className="sticky top-0 z-10 border-b border-white/10 bg-cyber-black/90 py-4 backdrop-blur-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets, paths, notes…"
              aria-label="Search assets"
              className="w-full rounded-lg border border-white/10 bg-cyber-dark py-2.5 pr-4 pl-9 font-mono text-sm text-white placeholder:text-gray-600 focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 focus:outline-none"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {lines.map((l) => (
              <button
                key={l.id}
                onClick={() => setLine(line === l.id ? null : l.id)}
                aria-pressed={line === l.id}
                style={
                  line === l.id
                    ? { backgroundColor: l.accent, borderColor: l.accent }
                    : { borderColor: "rgba(255,255,255,0.1)" }
                }
                className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
                  line === l.id
                    ? "font-medium text-cyber-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {l.name}{" "}
                <span className="opacity-55">{l.assets.length}</span>
              </button>
            ))}
            {STAGES.map((s) => (
              <button
                key={s}
                onClick={() => setStage(stage === s ? null : s)}
                aria-pressed={stage === s}
                className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
                  stage === s
                    ? "border-white bg-white font-medium text-cyber-black"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {s} <span className="opacity-55">{stageCount(s)}</span>
              </button>
            ))}
          </div>
        </div>

        {visible.map((l) => (
          <section key={l.id} className="pt-12">
            <div className="border-l-[3px] pl-4" style={{ borderColor: l.accent }}>
              <h2
                className="font-display text-xl font-semibold tracking-wide"
                style={{ color: l.accent }}
              >
                {l.name}
              </h2>
              <p className="mt-1 font-mono text-xs text-gray-500">{l.tagline}</p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {l.assets.map((asset, i) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.24) }}
                >
                  <Card className="flex h-full flex-col gap-3 p-4 transition hover:border-white/25">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="flex items-start gap-1.5 font-mono text-sm font-medium text-white">
                        {asset.flagship && (
                          <Star
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-cyber-yellow text-cyber-yellow"
                            aria-label="flagship"
                          />
                        )}
                        {asset.restricted && (
                          <Lock
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500"
                            aria-label="restricted"
                          />
                        )}
                        {asset.name}
                      </h3>
                      <Badge
                        variant={stageVariant[asset.stage as Stage] ?? "default"}
                        className="shrink-0 px-2 py-0.5 text-[10px]"
                      >
                        {asset.stage}
                      </Badge>
                    </div>

                    <p className="flex-1 font-mono text-xs leading-relaxed text-gray-400">
                      {asset.note}
                    </p>

                    <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
                      <code className="font-mono text-[11px] break-all text-gray-600">
                        {asset.path}
                      </code>
                      <span className="font-mono text-[10px] tracking-wider text-gray-700 uppercase">
                        {asset.type} · {asset.location}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {shown === 0 && (
          <p className="py-16 text-center font-mono text-sm text-gray-500">
            Nothing matches that filter.
          </p>
        )}

        <footer className="mt-16 border-t border-white/10 pt-6 font-mono text-xs text-gray-600">
          Generated from <code>assets.json</code> · {manifest.visibility} · restricted entries are
          listed for accounting only, contents are never indexed here.
        </footer>
      </div>
    </main>
  );
}
