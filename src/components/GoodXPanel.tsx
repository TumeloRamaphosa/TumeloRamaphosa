import { CreditCard, FileCheck2, Clock3, AlertTriangle } from "lucide-react";
import type { Brand } from "@/lib/brand";

// Visual mockup only — "what it would look like". No live GoodX call.
// GoodX has no public self-serve API; going live needs a GoodX partner
// integration + the clinic's credentials.
const CLAIMS = [
  { patient: "M. Dlamini", scheme: "Discovery Health", amount: 4820, status: "Paid" },
  { patient: "T. van Wyk", scheme: "Bonitas", amount: 12650, status: "Submitted" },
  { patient: "S. Naidoo", scheme: "Momentum", amount: 3110, status: "Shortfall" },
  { patient: "K. Mokoena", scheme: "Discovery Health", amount: 9740, status: "Paid" },
  { patient: "L. Botha", scheme: "Medihelp", amount: 2180, status: "Rejected" },
];

const STATUS_COLOR: Record<string, string> = {
  Paid: "#22c55e",
  Submitted: "#6366f1",
  Shortfall: "#E8B86D",
  Rejected: "#ef4444",
};

function zar(n: number) {
  return `R${n.toLocaleString("en-ZA")}`;
}

export function GoodXPanel({ brand }: { brand: Brand }) {
  const tile = { background: brand.card, border: `1px solid ${brand.border}` };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold" style={{ color: brand.text }}>
            Payments &amp; medical aid — GoodX
          </h3>
          <p className="text-xs" style={{ color: brand.muted }}>
            Real-time claim switching &amp; reconciliation surface
          </p>
        </div>
        <span
          className="text-xs px-3 py-1 rounded-full font-semibold"
          style={{ background: `${brand.accent}22`, color: brand.accent }}
        >
          Preview · connects on GoodX partner credentials
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CreditCard, label: "Collected (30d)", value: zar(486_200), color: brand.accent },
          { icon: FileCheck2, label: "Claims paid", value: zar(312_400), color: "#22c55e" },
          { icon: Clock3, label: "Awaiting medical aid", value: zar(58_900), color: brand.primary },
          { icon: AlertTriangle, label: "Shortfalls to chase", value: zar(21_650), color: "#E8B86D" },
        ].map((s) => (
          <div key={s.label} style={tile} className="rounded-xl p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: brand.muted }}
              >
                {s.label}
              </span>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={tile} className="rounded-xl p-5">
        <span
          className="text-sm font-semibold"
          style={{ color: brand.text }}
        >
          Recent claims
        </span>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left text-xs uppercase tracking-wider"
                style={{ color: brand.muted }}
              >
                <th className="pb-2">Patient</th>
                <th className="pb-2">Scheme</th>
                <th className="pb-2 text-right">Amount</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {CLAIMS.map((c, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{ borderColor: brand.border }}
                >
                  <td className="py-2" style={{ color: brand.text }}>
                    {c.patient}
                  </td>
                  <td className="py-2" style={{ color: brand.muted }}>
                    {c.scheme}
                  </td>
                  <td
                    className="py-2 text-right font-medium"
                    style={{ color: brand.text }}
                  >
                    {zar(c.amount)}
                  </td>
                  <td className="py-2 text-right">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: `${STATUS_COLOR[c.status]}22`,
                        color: STATUS_COLOR[c.status],
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] mt-3" style={{ color: brand.muted }}>
          Mockup with demo data. Live claim switching activates once GoodX
          partner access &amp; the clinic&apos;s credentials are supplied.
        </p>
      </div>
    </div>
  );
}
