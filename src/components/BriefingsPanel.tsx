import { PlayCircle, Film } from "lucide-react";
import type { Brand } from "@/lib/brand";

export type Briefing = { title: string; url: string; note?: string };

// Turn a share link into an embeddable URL.
function embedSrc(url: string): { kind: "iframe" | "video"; src: string } {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };

  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive)
    return {
      kind: "iframe",
      src: `https://drive.google.com/file/d/${drive[1]}/preview`,
    };

  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };

  return { kind: "iframe", src: url };
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
        <h3 className="text-lg font-bold" style={{ color: brand.text }}>
          Briefings &amp; updates
        </h3>
        <p className="text-xs" style={{ color: brand.muted }}>
          NotebookLM video overviews — strategy, performance &amp; what the
          agents did this week
        </p>
      </div>

      {briefings.length === 0 ? (
        <div
          style={tile}
          className="rounded-xl p-10 text-center flex flex-col items-center gap-3"
        >
          <Film className="w-8 h-8" style={{ color: brand.muted }} />
          <p className="text-sm" style={{ color: brand.muted }}>
            No briefings added yet. Drop in your NotebookLM video links
            (YouTube, Google Drive, or a direct .mp4) and they appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {briefings.map((b, i) => {
            const e = embedSrc(b.url);
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
                <div
                  className="rounded-lg overflow-hidden"
                  style={{ aspectRatio: "16 / 9", background: brand.bg }}
                >
                  {e.kind === "video" ? (
                    <video
                      src={e.src}
                      controls
                      className="w-full h-full"
                      style={{ background: "#000" }}
                    />
                  ) : (
                    <iframe
                      src={e.src}
                      title={b.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  )}
                </div>
                {b.note && (
                  <p
                    className="text-xs mt-2"
                    style={{ color: brand.muted }}
                  >
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
