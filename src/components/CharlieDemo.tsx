"use client";

import { useRef, useState } from "react";
import { Play, Loader2, Bot, Phone } from "lucide-react";
import type { Brand } from "@/lib/brand";

type Turn = { from: "patient" | "charlie"; text: string };

// Placeholder demo script — swap with the client's approved Charlie script.
const SCRIPT: Turn[] = [
  { from: "patient", text: "Hi, I'd like to book a LASIK consultation please." },
  {
    from: "charlie",
    text: "Hi! I'm Charlie from SafeSight. I'd be glad to help with your LASIK consultation. May I have your full name?",
  },
  { from: "patient", text: "Thandeka Mokoena." },
  {
    from: "charlie",
    text: "Thank you, Thandeka. We have openings Tuesday at 10:00 or Thursday at 14:30 at Morningside. Which suits you?",
  },
  { from: "patient", text: "Thursday at 2:30 works." },
  {
    from: "charlie",
    text: "Booked — Thursday 14:30 for a LASIK consult. I've sent a WhatsApp confirmation and I'll remind you the day before. Anything else?",
  },
  { from: "patient", text: "That's all, thank you!" },
  {
    from: "charlie",
    text: "Pleasure, Thandeka. See you Thursday. SafeSight wishes you clear vision ahead.",
  },
];

export function CharlieDemo({ brand }: { brand: Brand }) {
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [mode, setMode] = useState<"idle" | "elevenlabs" | "browser">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function speak(text: string) {
    setSpeaking(true);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const ct = res.headers.get("Content-Type") || "";
      if (ct.includes("audio")) {
        setMode("elevenlabs");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        await new Promise<void>((resolve) => {
          const a = new Audio(url);
          audioRef.current = a;
          a.onended = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          a.onerror = () => resolve();
          a.play().catch(() => resolve());
        });
      } else {
        // Browser-speech fallback — the demo still talks without a key.
        setMode("browser");
        await new Promise<void>((resolve) => {
          if (typeof window === "undefined" || !window.speechSynthesis) {
            setTimeout(resolve, 900);
            return;
          }
          const u = new SpeechSynthesisUtterance(text);
          u.rate = 1;
          u.onend = () => resolve();
          u.onerror = () => resolve();
          window.speechSynthesis.speak(u);
        });
      }
    } catch {
      await new Promise((r) => setTimeout(r, 700));
    }
    setSpeaking(false);
  }

  async function play() {
    if (running) return;
    setRunning(true);
    setShown(0);
    for (let i = 0; i < SCRIPT.length; i++) {
      setShown(i + 1);
      const t = SCRIPT[i];
      await new Promise((r) => setTimeout(r, 450));
      if (t.from === "charlie") await speak(t.text);
      else await new Promise((r) => setTimeout(r, 700));
    }
    setRunning(false);
  }

  return (
    <div
      style={{ background: brand.card, border: `1px solid ${brand.border}` }}
      className="rounded-2xl overflow-hidden"
    >
      {/* WhatsApp-style header */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ background: "#075E54" }}
      >
        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-semibold">
            Charlie · SafeSight + LAISA
          </div>
          <div className="text-white/70 text-[11px]">
            {speaking ? "speaking…" : running ? "online" : "WhatsApp business"}
          </div>
        </div>
        <Phone className="w-4 h-4 text-white/80" />
      </div>

      {/* Chat */}
      <div
        className="px-4 py-4 space-y-2 min-h-[320px] max-h-[420px] overflow-y-auto"
        style={{ background: "#0b141a" }}
      >
        {SCRIPT.slice(0, shown).map((t, i) => (
          <div
            key={i}
            className={`flex ${
              t.from === "patient" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className="max-w-[78%] text-sm px-3 py-2 rounded-lg"
              style={{
                background: t.from === "patient" ? "#005c4b" : "#202c33",
                color: "#e9edef",
              }}
            >
              {t.text}
            </div>
          </div>
        ))}
        {shown === 0 && (
          <div className="text-center text-xs pt-24" style={{ color: brand.muted }}>
            Press play to run the live Charlie demo
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: `1px solid ${brand.border}` }}
      >
        <span className="text-[11px]" style={{ color: brand.muted }}>
          {mode === "elevenlabs"
            ? "Voice: ElevenLabs"
            : mode === "browser"
            ? "Voice: browser fallback (add ElevenLabs key for production voice)"
            : "ElevenLabs voice · WhatsApp Business"}
        </span>
        <button
          onClick={play}
          disabled={running}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full disabled:opacity-60"
          style={{ background: brand.primary, color: brand.bg }}
        >
          {running ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {running ? "Running…" : "Play demo"}
        </button>
      </div>
    </div>
  );
}
