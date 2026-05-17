"use client";

import { useMemo } from "react";
import {
  Clock,
  Banknote,
  Cpu,
  TrendingUp,
  Scale,
  Receipt,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Brand } from "@/lib/brand";

// One automated action the platform performed on the client's behalf.
export type ActionLedgerItem = {
  label: string;
  count: number;
  tokens: number;
  humanMinutesEach: number; // minutes a human would take per action
};

export type RoiData = {
  periodLabel: string;
  humanHourlyRateZar: number; // blended admin/marketing rate
  usdZar: number; // FX for token cost
  tokenCostPerMTokUsd: number; // blended $/1M tokens
  estimatedRevenueImpactZar: number; // recovered leads, faster claims, fewer no-shows
  actions: ActionLedgerItem[];
};

// Demo defaults — replace `data` with live values from the usage/billing
// + facebookAds + clientPortal routers when credentials are connected.
const DEMO: RoiData = {
  periodLabel: "Last 30 days",
  humanHourlyRateZar: 220,
  usdZar: 18.4,
  tokenCostPerMTokUsd: 4.5,
  estimatedRevenueImpactZar: 86_400,
  actions: [
    { label: "WhatsApp enquiries answered", count: 612, tokens: 1_840_000, humanMinutesEach: 4 },
    { label: "Appointments booked / rescheduled", count: 188, tokens: 720_000, humanMinutesEach: 6 },
    { label: "Reminders & no-show recovery", count: 240, tokens: 360_000, humanMinutesEach: 3 },
    { label: "Medical-aid claim prep", count: 96, tokens: 540_000, humanMinutesEach: 12 },
    { label: "Social posts drafted & scheduled", count: 24, tokens: 410_000, humanMinutesEach: 35 },
    { label: "Patient follow-up messages", count: 174, tokens: 290_000, humanMinutesEach: 4 },
  ],
};

function rand(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}
function zar(n: number) {
  return `R${n.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;
}

export function RoiPanel({
  brand,
  data = DEMO,
}: {
  brand: Brand;
  data?: RoiData;
}) {
  const m = useMemo(() => {
    const humanMinutes = data.actions.reduce(
      (s, a) => s + a.count * a.humanMinutesEach,
      0
    );
    const humanHours = humanMinutes / 60;
    const humanCost = humanHours * data.humanHourlyRateZar;

    const totalTokens = data.actions.reduce((s, a) => s + a.tokens, 0);
    const tokenCostZar =
      (totalTokens / 1_000_000) * data.tokenCostPerMTokUsd * data.usdZar;

    const netSaving = humanCost - tokenCostZar;
    const roiX = tokenCostZar > 0 ? humanCost / tokenCostZar : 0;

    return {
      humanHours,
      humanCost,
      totalTokens,
      tokenCostZar,
      netSaving,
      roiX,
      totalActions: data.actions.reduce((s, a) => s + a.count, 0),
    };
  }, [data]);

  const chartData = [
    { name: "Human effort", value: Math.round(m.humanCost), fill: brand.muted },
    { name: "Platform cost", value: Math.round(m.tokenCostZar), fill: brand.primary },
    { name: "Revenue impact", value: data.estimatedRevenueImpactZar, fill: brand.accent },
  ];

  const tile = {
    background: brand.card,
    border: `1px solid ${brand.border}`,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold" style={{ color: brand.text }}>
            Time &amp; money — what the platform is worth
          </h3>
          <p className="text-xs" style={{ color: brand.muted }}>
            {data.periodLabel} · always-on view of cost vs. value of every
            automated action
          </p>
        </div>
        <span
          className="text-xs px-3 py-1 rounded-full font-semibold"
          style={{ background: `${brand.accent}22`, color: brand.accent }}
        >
          {m.roiX.toFixed(1)}× return on spend
        </span>
      </div>

      {/* Headline tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tile
          tile={tile}
          brand={brand}
          icon={Clock}
          label="Time returned"
          value={`${m.humanHours.toFixed(0)} hrs`}
          sub={`${m.totalActions.toLocaleString("en-ZA")} actions handled`}
          color={brand.primary}
        />
        <Tile
          tile={tile}
          brand={brand}
          icon={Banknote}
          label="Human-cost avoided"
          value={zar(m.humanCost)}
          sub={`@ ${zar(data.humanHourlyRateZar)}/hr blended`}
          color={brand.accent}
        />
        <Tile
          tile={tile}
          brand={brand}
          icon={Cpu}
          label="Platform / token spend"
          value={zar(m.tokenCostZar)}
          sub={`${rand(m.totalTokens)} tokens used`}
          color={brand.primary}
        />
        <Tile
          tile={tile}
          brand={brand}
          icon={TrendingUp}
          label="Est. revenue impact"
          value={zar(data.estimatedRevenueImpactZar)}
          sub="Recovered leads · faster claims"
          color={brand.accent}
        />
      </div>

      {/* Net + comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          style={tile}
          className="rounded-xl p-5 lg:col-span-1 flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4" style={{ color: brand.primary }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: brand.muted }}
            >
              Net saving this period
            </span>
          </div>
          <div
            className="text-3xl font-extrabold"
            style={{ color: brand.text }}
          >
            {zar(m.netSaving)}
          </div>
          <p className="text-xs mt-1" style={{ color: brand.muted }}>
            Human effort {zar(m.humanCost)} − platform {zar(m.tokenCostZar)}.
            Plus {zar(data.estimatedRevenueImpactZar)} estimated upside.
          </p>
        </div>

        <div style={tile} className="rounded-xl p-5 lg:col-span-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: brand.muted }}
          >
            Human effort vs. platform cost vs. revenue impact
          </span>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={brand.border} />
              <XAxis type="number" stroke={brand.muted} fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                stroke={brand.muted}
                fontSize={11}
                width={96}
              />
              <Tooltip
                formatter={(v: number) => zar(v)}
                contentStyle={{
                  background: brand.bg,
                  border: `1px solid ${brand.border}`,
                  color: brand.text,
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Always-on cost-of-actions ledger */}
      <div style={tile} className="rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-4 h-4" style={{ color: brand.accent }} />
          <span
            className="text-sm font-semibold"
            style={{ color: brand.text }}
          >
            Cost of actions — what each automation cost vs. saved
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left text-xs uppercase tracking-wider"
                style={{ color: brand.muted }}
              >
                <th className="pb-2">Action</th>
                <th className="pb-2 text-right">Volume</th>
                <th className="pb-2 text-right">Tokens</th>
                <th className="pb-2 text-right">Platform cost</th>
                <th className="pb-2 text-right">Human time saved</th>
                <th className="pb-2 text-right">Human cost saved</th>
              </tr>
            </thead>
            <tbody>
              {data.actions.map((a) => {
                const cost =
                  (a.tokens / 1_000_000) *
                  data.tokenCostPerMTokUsd *
                  data.usdZar;
                const hrsSaved = (a.count * a.humanMinutesEach) / 60;
                const human = hrsSaved * data.humanHourlyRateZar;
                return (
                  <tr
                    key={a.label}
                    className="border-t"
                    style={{ borderColor: brand.border }}
                  >
                    <td className="py-2" style={{ color: brand.text }}>
                      {a.label}
                    </td>
                    <td
                      className="py-2 text-right"
                      style={{ color: brand.muted }}
                    >
                      {a.count.toLocaleString("en-ZA")}
                    </td>
                    <td
                      className="py-2 text-right"
                      style={{ color: brand.muted }}
                    >
                      {rand(a.tokens)}
                    </td>
                    <td
                      className="py-2 text-right font-medium"
                      style={{ color: brand.primary }}
                    >
                      {zar(cost)}
                    </td>
                    <td
                      className="py-2 text-right"
                      style={{ color: brand.muted }}
                    >
                      {hrsSaved.toFixed(1)} hrs
                    </td>
                    <td
                      className="py-2 text-right font-semibold"
                      style={{ color: brand.accent }}
                    >
                      {zar(human)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] mt-3" style={{ color: brand.muted }}>
          Demo figures. Live values are wired from the usage/billing,
          facebookAds and clientPortal routers once the client&apos;s accounts
          are connected via Composio.
        </p>
      </div>
    </div>
  );
}

function Tile({
  tile,
  brand,
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  tile: React.CSSProperties;
  brand: Brand;
  icon: any;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div style={tile} className="rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: brand.muted }}
        >
          {label}
        </span>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: brand.muted }}>
        {sub}
      </div>
    </div>
  );
}
