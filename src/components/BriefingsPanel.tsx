import { PlayCircle, Film, ExternalLink } from "lucide-react";
import type { Brand } from "@/lib/brand";

export type Briefing = { title: string; url: string; note?: string };

// Resolve a share link to an embed. NotebookLM artifact links are
// auth-gated and frame-blocked, so they render as a click-out card
// instead of a broken iframe. Unknown hosts also fall back to a card.
function resolve(
  url: string
): { kind: "iframe" | "video" | "link"; src: string } {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt)
    return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };

  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive)
    return {
      kind: "iframe",
      src: `https://drive.google.com/file/d/${drive[1]}/preview`,
    };

  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };

  return { kind: "link", src: url };
}

export function BriefingsPanel({
  brand,
  briefings = [],
}: {
  brand: Brand;
  briefings?: Briefing[];
}) {
  const tile = { background: brand.card, border: `1px solid ${brand.border}` };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-xl font-semibold" style={{ color: brand.text }}>
          Briefings &amp; updates
        </h3>
        <p className="text-xs" style={{ color: brand.muted }}>
          NotebookLM video overviews — before &amp; after, and what the agents
          did this week
        </p>
      </div>

      {briefings.length === 0 ? (
        <div
          style={tile}
          className="rounded-xl p-10 text-center flex flex-col items-center gap-3"
        >
          <Film className="w-8 h-8" style={{ color: brand.muted }} />
          <p className="text-sm" style={{ color: brand.muted }}>
            No briefings added yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {briefings.map((b, i) => {
            const e = resolve(b.url);
            return (
              <div key={i} style={tile} className="rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <PlayCircle
                    className="w-4 h-4"
                    style={{ color: brand.accent }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: brand.text }}
                  >
                    {b.title}
                  </span>
                </div>

                {e.kind === "link" ? (
                  <a
                    href={e.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg flex flex-col items-center justify-center gap-3 text-center px-4"
                    style={{
                      aspectRatio: "16 / 9",
                      background: brand.bg,
                      border: `1px dashed ${brand.border}`,
                    }}
                  >
                    <PlayCircle
                      className="w-10 h-10"
                      style={{ color: brand.accent }}
                    />
                    <span
                      className="text-sm font-semibold flex items-center gap-1.5"
                      style={{ color: brand.primary }}
                    >
                      Open briefing in NotebookLM
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: brand.muted }}
                    >
                      Requires Google access. Host on YouTube/Drive for inline
                      client playback.
                    </span>
                  </a>
                ) : e.kind === "video" ? (
                  <video
                    src={e.src}
                    controls
                    className="w-full rounded-lg"
                    style={{ aspectRatio: "16 / 9", background: "#000" }}
                  />
                ) : (
                  <div
                    className="rounded-lg overflow-hidden"
                    style={{ aspectRatio: "16 / 9", background: brand.bg }}
                  >
                    <iframe
                      src={e.src}
                      title={b.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                )}

                {b.note && (
                  <p className="text-xs mt-2" style={{ color: brand.muted }}>
                    {b.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
