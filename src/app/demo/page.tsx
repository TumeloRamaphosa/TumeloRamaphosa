"use client";

import { useState } from "react";
import {
  Activity,
  TrendingUp,
  Users,
  CalendarCheck,
  ThumbsUp,
  Camera,
  Megaphone,
  MessageCircle,
  Plug,
  Bot,
  Sparkles,
} from "lucide-react";
import { LAISA, UNITS, type Unit } from "@/lib/laisa";
import { RoiPanel } from "@/components/RoiPanel";
import { GoodXPanel } from "@/components/GoodXPanel";
import { BriefingsPanel, type Briefing } from "@/components/BriefingsPanel";
import { CharlieDemo } from "@/components/CharlieDemo";

const B = LAISA;

const BRIEFINGS: Briefing[] = [
  {
    title: "Before — the clinic today",
    url: "https://notebooklm.google.com/notebook/95d125bd-e185-42ce-ae56-825c118baea4/artifact/c50138fc-00b0-4d1a-b375-d318a87f82ca",
    note: "Walkthrough of the current manual operation.",
  },
  {
    title: "After — with LAISA",
    url: "https://notebooklm.google.com/notebook/95d125bd-e185-42ce-ae56-825c118baea4/artifact/e39309c9-1345-4ab0-9916-4d53cfd5a374",
    note: "The same operation, agent-run.",
  },
];

// Demo metrics per business unit (live via Composio once connected).
const KPI: Record<Unit, { label: string; value: string; sub: string; icon: any }[]> = {
  all: [
    { label: "Revenue (30d)", value: "R1.31M", sub: "+21% vs prev", icon: TrendingUp },
    { label: "Bookings", value: "364", sub: "Eye 188 · Aesthetics 176", icon: CalendarCheck },
    { label: "New patients", value: "142", sub: "Referrals + social", icon: Users },
    { label: "Site visitors", value: "9.4K", sub: "61% mobile", icon: Activity },
  ],
  eye: [
    { label: "Revenue (30d)", value: "R652K", sub: "PRK/LASIK + cataract", icon: TrendingUp },
    { label: "Bookings", value: "188", sub: "Consults + procedures", icon: CalendarCheck },
    { label: "New patients", value: "81", sub: "GP/optometrist referrals", icon: Users },
    { label: "Site visitors", value: "5.2K", sub: "SafeSight pages", icon: Activity },
  ],
  aesthetics: [
    { label: "Revenue (30d)", value: "R658K", sub: "Injectables + derma", icon: TrendingUp },
    { label: "Bookings", value: "176", sub: "Peels · longevity", icon: CalendarCheck },
    { label: "New patients", value: "61", sub: "Instagram-led", icon: Users },
    { label: "Site visitors", value: "4.2K", sub: "Aesthetics pages", icon: Activity },
  ],
};

const CHANNELS = [
  { icon: ThumbsUp, name: "Facebook", a: "Reach 84.2K", b: "CTR 1.9%", c: "42 leads" },
  { icon: Camera, name: "Instagram", a: "Reach 121K", b: "Eng. 6.4%", c: "77 DMs" },
  { icon: Megaphone, name: "Google Ads", a: "Spend R38K", b: "ROAS 4.1x", c: "63 conv." },
  { icon: MessageCircle, name: "WhatsApp", a: "612 chats", b: "94% auto", c: "188 booked" },
];

export default function LaisaDashboard() {
  const [unit, setUnit] = useState<Unit>("all");

  return (
    <div style={{ background: B.bg, minHeight: "100vh", color: B.text }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          background: "rgba(7,11,16,.8)",
          borderBottom: `1px solid ${B.border}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span style={{ color: B.accent }} className="text-2xl">◐</span>
            <span className="font-extrabold text-xl tracking-tight">LAISA</span>
          </div>
          <span
            className="hidden md:block text-xs"
            style={{ color: B.muted }}
          >
            {B.tagline}
          </span>
          <div className="ml-auto flex items-center gap-1 rounded-full p-1"
            style={{ background: B.card, border: `1px solid ${B.border}` }}>
            {UNITS.map((u) => (
              <button
                key={u.key}
                onClick={() => setUnit(u.key)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: unit === u.key ? B.primary : "transparent",
                  color: unit === u.key ? B.bg : B.muted,
                }}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Cinematic hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full blur-[150px]"
          style={{ background: `${B.primary}26` }}
        />
        <div
          className="pointer-events-none absolute -top-10 right-10 h-[320px] w-[320px] rounded-full blur-[130px]"
          style={{ background: `${B.accent}22` }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: B.accent }}>
            One operating system · all your data
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">
            The clinic, running itself.
          </h1>
          <p className="mt-3 max-w-2xl" style={{ color: B.muted }}>
            SafeSight and LAISA Aesthetics — bookings, payments, marketing and
            patient comms, unified and agent-run.
          </p>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KPI[unit].map((k) => (
              <div
                key={k.label}
                style={{ background: B.card, border: `1px solid ${B.border}` }}
                className="rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: B.muted }}>
                    {k.label}
                  </span>
                  <k.icon className="w-4 h-4" style={{ color: B.accent }} />
                </div>
                <div className="text-3xl font-extrabold mt-2" style={{ color: B.text }}>
                  {k.value}
                </div>
                <div className="text-xs mt-1" style={{ color: B.muted }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-10">
        {/* Channels */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: B.accent }}>
            Channel analytics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CHANNELS.map((c) => (
              <div key={c.name} style={{ background: B.card, border: `1px solid ${B.border}` }} className="rounded-2xl p-5">
                <c.icon className="w-6 h-6 mb-3" style={{ color: B.primary }} />
                <div className="font-semibold">{c.name}</div>
                <div className="mt-2 text-xs space-y-1" style={{ color: B.muted }}>
                  <div>{c.a}</div><div>{c.b}</div><div style={{ color: B.accent }}>{c.c}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-3" style={{ color: B.muted }}>
            Demo figures — live the moment Composio connects Facebook,
            Instagram, Google Ads &amp; WhatsApp.
          </p>
        </section>

        {/* Charlie WhatsApp + ElevenLabs */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: B.accent }}>
            WhatsApp assistant — Charlie (live demo)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <CharlieDemo brand={B} />
            <div style={{ background: B.card, border: `1px solid ${B.border}` }} className="rounded-2xl p-6">
              <Bot className="w-7 h-7 mb-3" style={{ color: B.accent }} />
              <h3 className="font-semibold text-lg">Charlie handles the front desk</h3>
              <p className="text-sm mt-2" style={{ color: B.muted }}>
                Patients book, reschedule and ask questions on WhatsApp 24/7.
                Charlie speaks with an ElevenLabs voice, triages clinical
                questions to your team, and writes every booking back to the
                dashboard. The demo runs now with a browser-speech fallback;
                add the ElevenLabs key for the production voice.
              </p>
              <ul className="mt-4 text-sm space-y-2" style={{ color: B.muted }}>
                <li>→ 94% of enquiries handled with no human</li>
                <li>→ Bookings + reminders automated</li>
                <li>→ Voice + text, in your practice&apos;s tone</li>
              </ul>
            </div>
          </div>
        </section>

        <RoiPanel brand={B} />
        <GoodXPanel brand={B} />

        {/* Composio */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: B.accent }}>
            Connected assets — Composio
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {["Instagram", "Facebook", "WhatsApp", "Google Ads", "Gmail", "Website"].map((x) => (
              <div key={x} style={{ background: B.card, border: `1px solid ${B.border}` }} className="rounded-xl p-4 text-center">
                <Plug className="w-5 h-5 mx-auto mb-2" style={{ color: B.primary }} />
                <div className="text-sm font-medium">{x}</div>
                <div className="text-[11px] mt-1" style={{ color: B.accent }}>Ready to link</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-3" style={{ color: B.muted }}>
            Connects with the client&apos;s Composio credentials — paste them
            in and these go live.
          </p>
        </section>

        <BriefingsPanel brand={B} briefings={BRIEFINGS} />
      </div>

      {/* Chat dock */}
      <div className="sticky bottom-0 w-full backdrop-blur-xl"
        style={{ background: "rgba(7,11,16,.85)", borderTop: `1px solid ${B.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
          <Sparkles className="w-5 h-5 shrink-0" style={{ color: B.accent }} />
          <input
            placeholder="Ask LAISA — get advice, schedule a task, plan an automation…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: B.text }}
          />
          <button className="text-xs font-semibold px-4 py-2 rounded-full"
            style={{ background: B.primary, color: B.bg }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
