"use client";

import { useState } from "react";
import {
  Eye,
  Users,
  Activity,
  TrendingUp,
  BarChart3,
  DollarSign,
  CreditCard,
  Film,
  Bot,
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

const B = BRANDS.safesight;

// Add NotebookLM video links here (YouTube / Google Drive / .mp4).
const SAFESIGHT_BRIEFINGS: Briefing[] = [];

const SPEND = [
  { d: "W1", revenue: 318000, procedures: 22 },
  { d: "W2", revenue: 286000, procedures: 19 },
  { d: "W3", revenue: 372000, procedures: 27 },
  { d: "W4", revenue: 401000, procedures: 29 },
];

const KPIS = [
  { icon: DollarSign, label: "Revenue (30d)", value: "R1.38M", sub: "Refractive + cataract", color: B.accent },
  { icon: Eye, label: "Procedures", value: "97", sub: "PRK / LASIK / cataract", color: B.primary },
  { icon: Users, label: "New patients", value: "143", sub: "Referrals lead", color: B.primary },
  { icon: Activity, label: "Website visitors", value: "6.1K", sub: "58% mobile", color: B.accent },
];

const TABS = [
  { value: "overview", label: "Overview", icon: BarChart3 },
  { value: "roi", label: "ROI & Cost", icon: DollarSign },
  { value: "payments", label: "Payments", icon: CreditCard },
  { value: "briefings", label: "Briefings", icon: Film },
];

export default function SafeSightDemo() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ background: B.bg, minHeight: "100vh", color: B.text }}>
      <div
        className="px-6 py-6 border-b"
        style={{ borderColor: B.border, background: B.card }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${B.primary}22` }}
            >
              <Eye className="w-5 h-5" style={{ color: B.primary }} />
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
            style={{ background: `${B.accent}22`, color: B.accent }}
          >
            Last 30 days · command center
          </span>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
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

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5"
              style={{
                background: tab === t.value ? B.primary : B.card,
                color: tab === t.value ? B.bg : B.muted,
                border: `1px solid ${B.border}`,
              }}
            >
              <t.icon className="w-3 h-3" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div
            style={{ background: B.card, border: `1px solid ${B.border}` }}
            className="rounded-xl p-5"
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{ color: B.primary }}
            >
              Revenue &amp; procedures trend
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={SPEND}>
                <defs>
                  <linearGradient id="ssRev" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#ssRev)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[11px] mt-2" style={{ color: B.muted }}>
              Demo data. Live figures flow in once the booking system, Meta and
              WhatsApp are connected via Composio.
            </p>
          </div>
        )}

        {tab === "roi" && <RoiPanel brand={B} />}
        {tab === "payments" && <GoodXPanel brand={B} />}
        {tab === "briefings" && (
          <BriefingsPanel brand={B} briefings={SAFESIGHT_BRIEFINGS} />
        )}
      </div>

      <div
        className="sticky bottom-0 w-full border-t"
        style={{ background: B.card, borderColor: B.border }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
          <Bot className="w-5 h-5 shrink-0" style={{ color: B.accent }} />
          <input
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
    </div>
  );
}
