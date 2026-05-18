"use client";

import { useState } from "react";
import {
  Sparkles,
  Users,
  CalendarCheck,
  MessageCircle,
  Plug,
  Bot,
  CreditCard,
  CalendarClock,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BRANDS } from "@/lib/brand";
import { RoiPanel } from "@/components/RoiPanel";
import { GoodXPanel } from "@/components/GoodXPanel";
import { BriefingsPanel, type Briefing } from "@/components/BriefingsPanel";

const B = BRANDS.laisa;

// Add your NotebookLM video links here (YouTube / Google Drive / .mp4).
const LAISA_BRIEFINGS: Briefing[] = [
  {
    title: "Before — the clinic today",
    url: "https://notebooklm.google.com/notebook/95d125bd-e185-42ce-ae56-825c118baea4/artifact/c50138fc-00b0-4d1a-b375-d318a87f82ca",
    note: "Walkthrough of the current manual operation.",
  },
  {
    title: "After — with StudEx Ai OS",
    url: "https://notebooklm.google.com/notebook/95d125bd-e185-42ce-ae56-825c118baea4/artifact/e39309c9-1345-4ab0-9916-4d53cfd5a374",
    note: "The same operation, agent-run.",
  },
];

// Demo performance series — replaced by live data from facebookAds /
// clientPortal / Composio once the clinic's accounts are connected.
const REVENUE = [
  { d: "W1", revenue: 142000, bookings: 38 },
  { d: "W2", revenue: 168000, bookings: 44 },
  { d: "W3", revenue: 151000, bookings: 41 },
  { d: "W4", revenue: 197000, bookings: 53 },
];

const KPIS = [
  { icon: TrendingUp, label: "Revenue (30d)", value: "R658K", sub: "+18% vs prev", color: B.accent },
  { icon: CalendarCheck, label: "Bookings", value: "176", sub: "Injectables · peels · derma", color: B.primary },
  { icon: Users, label: "New patients", value: "61", sub: "IG & referrals lead", color: B.primary },
  { icon: Activity, label: "Website visitors", value: "4.2K", sub: "62% mobile", color: B.accent },
];

const CONNECTORS = [
  { icon: Plug, title: "Connect assets", body: "Instagram, Facebook, WhatsApp, Gmail, website — one click via Composio.", cta: "Open integrations", href: "/composio" },
  { icon: Bot, title: "Operations agent", body: "Advises on bookings, admin and marketing. Schedule & automate tasks.", cta: "Open agent", href: "/mailbox" },
  { icon: MessageCircle, title: "WhatsApp bots", body: "See live patient chatbot conversations and the content they send.", cta: "View chatbots", href: "/chatbots" },
  { icon: CalendarClock, title: "Scheduling", body: "Calendly-linked diary — block theatre time and open booking slots.", cta: "Open calendar", href: "/calendar" },
  { icon: CreditCard, title: "Payments & medical aid", body: "GoodX-linked claims & payments surface (connector pending credentials).", cta: "Set up GoodX", href: "/integrations" },
];

export default function LaisaAestheticsPortal() {
  const [period] = useState("Last 30 days");

  return (
    <div style={{ background: B.bg, minHeight: "100vh", color: B.text }}>
      {/* Header */}
      <div
        className="px-6 py-6 border-b"
        style={{ borderColor: B.border, background: B.card }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${B.accent}22` }}
            >
              <Sparkles className="w-5 h-5" style={{ color: B.accent }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold">{B.name}</h1>
              <p className="text-xs" style={{ color: B.muted }}>
                {B.tagline}
              </p>
            </div>
          </div>
          <span
            className="text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{ background: `${B.primary}22`, color: B.primary }}
          >
            {period} · command center
          </span>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {KPIS.map((k) => (
            <div
              key={k.label}
              style={{ background: B.card, border: `1px solid ${B.border}` }}
              className="rounded-xl p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: B.muted }}
                >
                  {k.label}
                </span>
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: k.color }}>
                {k.value}
              </div>
              <div className="text-xs" style={{ color: B.muted }}>
                {k.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Performance */}
        <div
          style={{ background: B.card, border: `1px solid ${B.border}` }}
          className="rounded-xl p-5"
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: B.primary }}
          >
            Revenue &amp; bookings trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE}>
              <defs>
                <linearGradient id="laisaRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={B.accent} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={B.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={B.border} />
              <XAxis dataKey="d" stroke={B.muted} fontSize={12} />
              <YAxis stroke={B.muted} fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: B.bg,
                  border: `1px solid ${B.border}`,
                  color: B.text,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={B.accent}
                fill="url(#laisaRev)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[11px] mt-2" style={{ color: B.muted }}>
            Demo data. Live figures flow in once Instagram/Facebook/WhatsApp and
            the booking system are connected via Composio.
          </p>
        </div>

        {/* ROI / time-money-token */}
        <RoiPanel brand={B} />

        {/* Payments & medical aid (GoodX) */}
        <GoodXPanel brand={B} />

        {/* NotebookLM briefings */}
        <BriefingsPanel brand={B} briefings={LAISA_BRIEFINGS} />

        {/* Connect & agent surfaces */}
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: B.primary }}>
            Connect assets &amp; let the agents work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONNECTORS.map((c) => (
              <a
                key={c.title}
                href={c.href}
                style={{ background: B.card, border: `1px solid ${B.border}` }}
                className="rounded-xl p-5 block transition-transform hover:-translate-y-0.5"
              >
                <c.icon className="w-6 h-6 mb-3" style={{ color: B.accent }} />
                <div className="font-semibold mb-1">{c.title}</div>
                <p className="text-xs mb-3" style={{ color: B.muted }}>
                  {c.body}
                </p>
                <span
                  className="text-xs font-semibold"
                  style={{ color: B.primary }}
                >
                  {c.cta} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom chat dock */}
      <ChatDock />
    </div>
  );
}

function ChatDock() {
  const [text, setText] = useState("");
  return (
    <div
      className="sticky bottom-0 w-full border-t"
      style={{ background: B.card, borderColor: B.border }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
        <Bot className="w-5 h-5 shrink-0" style={{ color: B.accent }} />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask the agent — get advice, schedule a task, plan an automation…"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: B.text }}
        />
        <button
          className="text-xs font-semibold px-4 py-2 rounded-full"
          style={{ background: B.primary, color: B.bg }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
