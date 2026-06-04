"use client";

// Phase 3 / 4 wireframe preview — Cognitive Brain, Staff tracker, Live ops wall, Mobile app.
// All mock data. Nothing connected. Renders inside /demo after Phase2Preview.

import {
  Brain,
  Search as SearchIcon,
  Users,
  Tv,
  Smartphone,
  Lock,
  Eye,
  Activity,
  Calendar,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import type { Brand } from "@/lib/brand";

const DAYS = ["Mon 26", "Tue 27", "Wed 28", "Thu 29", "Fri 30", "Sat 31", "Today"];

const BRAIN_CATEGORIES = ["All", "Patients", "Marketing", "Clinical", "Comms", "Content", "Store", "Leadership", "Intel"];

const BRAIN_FEED = [
  { time: "14:32", cat: "Patients",   src: "Charlie · Inbox Triage", note: "Thandeka booked LASIK consult Thu 14:30 with Dr Naidoo" },
  { time: "14:28", cat: "Marketing",  src: "Engagement Manager",     note: "Replied to @sarah_jhb DM, sent Sculptra menu + price" },
  { time: "14:15", cat: "Clinical",   src: "Dr Naidoo",              note: "Mrs Khoza follow-up — recovery on track, next visit 6 weeks" },
  { time: "13:55", cat: "Comms",      src: "Charlie · Inbox Triage", note: "Auto-replied 'Saturday hours 09:00–13:00' to Mike Patterson" },
  { time: "13:30", cat: "Content",    src: "Content Composer",       note: "Drafted 'Why we offer Sculptra' carousel — awaiting human approval" },
  { time: "13:12", cat: "Store",      src: "Store Ops",              note: "Lausanne NAD+ subscription renewed × 8, dispatch scheduled" },
  { time: "12:45", cat: "Patients",   src: "Reception · Sarah",      note: "Mrs Mokoena consultation card prepped, file pulled" },
  { time: "11:08", cat: "Content",    src: "Content Composer",       note: "Published '5 signs you need an eye exam' across IG + FB carousel" },
  { time: "10:30", cat: "Patients",   src: "Dr Khumalo",             note: "Sculptra treatment completed, follow-up scheduled" },
  { time: "09:14", cat: "Leadership", src: "Insights Analyst",       note: "Morning brief delivered: R742K MRR trend, 5 priority items" },
  { time: "07:02", cat: "Intel",      src: "Competitor Scout",       note: "@longevity_clinic posted new carousel 6h ago, 6.2% engagement — saved" },
  { time: "06:30", cat: "Comms",      src: "Charlie · Inbox Triage", note: "23 overnight messages summarised across WhatsApp / IG / FB / email" },
];

const CAT_COLORS: Record<string, string> = {
  Patients:    "#3FBE85",
  Marketing:   "#D4B574",
  Clinical:    "#9b87b8",
  Comms:       "#6FA8DC",
  Content:     "#E08D52",
  Store:       "#A39A87",
  Leadership:  "#C0492F",
  Intel:       "#5fb4a8",
};

const STAFF = [
  { name: "Dr Naidoo",  role: "Ophthalmology · LASIK",      tasks: 12, status: "In theatre" },
  { name: "Dr Sithole", role: "Ophthalmology · Cataracts",  tasks: 9,  status: "Consult" },
  { name: "Dr Khumalo", role: "Aesthetics · Injectables",   tasks: 8,  status: "Treatment" },
  { name: "Dr Adams",   role: "Dermatology + Weight",       tasks: 11, status: "Consult" },
  { name: "Dr Williams",role: "Longevity",                  tasks: 7,  status: "Available" },
  { name: "Sarah",      role: "Reception lead",             tasks: 34, status: "On floor" },
  { name: "Tebogo",     role: "Admin · billing",            tasks: 22, status: "Reviewing claims" },
  { name: "Lerato",     role: "Admin · scheduling",         tasks: 28, status: "On floor" },
  { name: "Naledi",     role: "Ophthalmic assistant",       tasks: 18, status: "Scans" },
  { name: "Karabo",     role: "Ophthalmic assistant",       tasks: 16, status: "Scans" },
  { name: "Thando",     role: "Aesthetics therapist",       tasks: 12, status: "Treatment" },
  { name: "Mpho",       role: "Aesthetics therapist",       tasks: 10, status: "Available" },
  { name: "Sipho",      role: "Theatre support",            tasks: 14, status: "In theatre" },
  { name: "Refilwe",    role: "Patient liaison",            tasks: 20, status: "On floor" },
];

const STATUS_COLOR: Record<string, string> = {
  "In theatre":      "#C0492F",
  "Consult":         "#3FBE85",
  "Treatment":       "#D4B574",
  "Scans":           "#6FA8DC",
  "Available":       "#A39A87",
  "On floor":        "#3FBE85",
  "Reviewing claims":"#9b87b8",
};

const LIVE_STREAM = [
  { when: "now",    who: "Charlie",            what: "Booking Mrs Khumalo · LASIK consult · Thu 14:30" },
  { when: "1m ago", who: "Content Composer",   what: "Drafted post: 'Patient story — LASIK recovery'" },
  { when: "2m ago", who: "Inbox Triage",       what: "Routed enquiry from @longevity.maven → Store Ops" },
  { when: "3m ago", who: "Reception · Sarah",  what: "Mr Patel checked in for 10:30 consult" },
  { when: "5m ago", who: "Dr Naidoo",          what: "Started theatre block 1 of 3" },
  { when: "7m ago", who: "Store Ops",          what: "8 Lausanne NAD+ renewals dispatched" },
  { when: "9m ago", who: "Engagement Mgr",     what: "Replied to 4 IG comments on Sculptra post" },
  { when: "12m ago",who: "Competitor Scout",   what: "@injectable_co posted Reels — 4.4% engagement — saved" },
];

const TICKERS = [
  { label: "Bookings today",      value: "27" },
  { label: "Messages routed",     value: "118" },
  { label: "Posts published",     value: "5 / 5" },
  { label: "Orders shipped",      value: "42" },
  { label: "Live MRR",            value: "R742,180" },
];

function PreviewBadge({ phase, brand }: { phase: string; brand: Brand }) {
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
      style={{
        background: `${brand.accent}1f`,
        color: brand.accent,
        border: `1px solid ${brand.accent}55`,
      }}
    >
      Preview · {phase}
    </span>
  );
}

function SectionHead({ kicker, title, sub, phase, brand }: { kicker: string; title: string; sub?: string; phase: string; brand: Brand }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: brand.accent }}>{kicker}</h2>
        <h3 className="mt-2 font-display text-2xl font-semibold">{title}</h3>
        {sub && <p className="mt-1 text-sm" style={{ color: brand.muted }}>{sub}</p>}
      </div>
      <PreviewBadge phase={phase} brand={brand} />
    </div>
  );
}

export function CognitiveBrainPreview({ brand }: { brand: Brand }) {
  const tile = { background: brand.card, border: `1px solid ${brand.border}` };

  return (
    <div className="space-y-12">
      {/* StudEx Cognitive Brain */}
      <section>
        <SectionHead
          kicker="StudEx Cognitive Brain"
          title="Your living memory — every action, categorised, searchable"
          sub="Every patient interaction, every agent action, every content decision lands here automatically. Click any day to relive the whole operation. Every agent and every staff member reads and writes here — the brain is what binds everything to everything."
          phase="Phase 3"
          brand={brand}
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {DAYS.map((d, i) => (
            <span
              key={d}
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: i === DAYS.length - 1 ? brand.primary : "transparent",
                color: i === DAYS.length - 1 ? brand.text : brand.muted,
                border: `1px solid ${i === DAYS.length - 1 ? brand.primary : brand.border}`,
              }}
            >
              {d}
            </span>
          ))}
        </div>

        <div className="rounded-2xl p-4 mb-4" style={tile}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: brand.bg, border: `1px solid ${brand.border}` }}>
            <SearchIcon className="w-4 h-4" style={{ color: brand.muted }} />
            <span className="text-sm" style={{ color: brand.muted }}>Search the brain — &quot;Mrs Khoza follow-up&quot;, &quot;LASIK conversions&quot;, &quot;Lausanne NAD+ renewals&quot;…</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {BRAIN_CATEGORIES.map((c, i) => (
              <span
                key={c}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: i === 0 ? brand.primary : `${(CAT_COLORS[c] || brand.muted)}22`,
                  color: i === 0 ? brand.text : (CAT_COLORS[c] || brand.muted),
                  border: `1px solid ${i === 0 ? brand.primary : (CAT_COLORS[c] || brand.border) + "55"}`,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={tile}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${brand.border}` }}>
            <Brain className="w-4 h-4" style={{ color: brand.accent }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: brand.accent }}>
              Today&apos;s brain · 12 of 248 entries
            </span>
            <span className="ml-auto text-[10px]" style={{ color: brand.muted }}>
              All agents + 14 staff read and write here
            </span>
          </div>
          {BRAIN_FEED.map((e, i) => {
            const c = CAT_COLORS[e.cat] || brand.muted;
            return (
              <div
                key={e.time + e.note}
                className="grid grid-cols-12 px-5 py-3 text-sm items-start gap-2"
                style={{ borderBottom: i === BRAIN_FEED.length - 1 ? "none" : `1px solid ${brand.border}` }}
              >
                <div className="col-span-1 font-display font-semibold" style={{ color: brand.primaryDark || brand.primary }}>{e.time}</div>
                <div className="col-span-2">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: `${c}22`, color: c, border: `1px solid ${c}55` }}
                  >
                    {e.cat}
                  </span>
                </div>
                <div className="col-span-3" style={{ color: brand.muted }}>{e.src}</div>
                <div className="col-span-6">{e.note}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Staff app + dashboard */}
      <section>
        <SectionHead
          kicker="Staff app + dashboard"
          title="Every team member, every day — automatically tracked"
          sub="Each doctor, admin and support staff uses the StudEx app on iPad to log activity as they work. Reception logs check-ins, doctors log consults, assistants log scans. Everything writes to the brain. The wall display below is the same data, real-time, for management."
          phase="Phase 3"
          brand={brand}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {STAFF.map((s) => {
            const c = STATUS_COLOR[s.status] || brand.muted;
            return (
              <div key={s.name} style={tile} className="rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: `${brand.primary}33`, color: brand.primaryDark || brand.primary }}>
                    {s.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="font-semibold text-sm">{s.name}</div>
                </div>
                <div className="text-[11px] mt-2" style={{ color: brand.muted }}>{s.role}</div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="font-display text-2xl font-semibold">{s.tasks}</div>
                    <div className="text-[10px] uppercase tracking-widest" style={{ color: brand.muted }}>tasks today</div>
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: `${c}22`, color: c, border: `1px solid ${c}55` }}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live ops wall */}
      <section>
        <SectionHead
          kicker="Live ops wall"
          title="The wall — operations on every screen"
          sub="Public displays at front of house show bookings, channel reach and patient satisfaction. Private displays in the back show revenue, agent chats and full live MRR. Either mode runs on the same one feed."
          phase="Phase 3"
          brand={brand}
        />

        <div className="flex gap-2 mb-4">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: brand.primary, color: brand.text }}>
            <Eye className="w-3 h-3 inline mr-1.5" /> Private — back office
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "transparent", color: brand.muted, border: `1px solid ${brand.border}` }}>
            <Tv className="w-3 h-3 inline mr-1.5" /> Public — front of house
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {TICKERS.map((t) => (
            <div key={t.label} style={tile} className="rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest" style={{ color: brand.muted }}>{t.label}</div>
              <div className="font-display text-2xl font-semibold mt-1">{t.value}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[10px]" style={{ color: brand.primaryDark || brand.primary }}>
                <span className="handled-dot" /> live
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden" style={tile}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${brand.border}` }}>
            <Activity className="w-4 h-4" style={{ color: brand.accent }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: brand.accent }}>
              Live · what is happening right now
            </span>
            <span className="ml-auto handled-dot" />
          </div>
          {LIVE_STREAM.map((s, i) => (
            <div
              key={s.what}
              className="grid grid-cols-12 px-5 py-3 text-sm items-center"
              style={{ borderBottom: i === LIVE_STREAM.length - 1 ? "none" : `1px solid ${brand.border}` }}
            >
              <div className="col-span-2 text-xs" style={{ color: brand.muted }}>{s.when}</div>
              <div className="col-span-3 font-semibold">{s.who}</div>
              <div className="col-span-7" style={{ color: brand.muted }}>{s.what}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile app */}
      <section>
        <SectionHead
          kicker="Mobile app — iOS + Android"
          title="The clinic in your pocket — staff, patients, store"
          sub="Patients book and refill subscriptions. Doctors see today's calendar. Admin handles claims. Everything connects to the dashboard and writes to the brain — same data, same agents, on any device."
          phase="Phase 3"
          brand={brand}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div style={tile} className="rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5" style={{ color: brand.accent }} />
              <div className="font-display text-lg font-semibold">Patient app</div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><Calendar className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Book / reschedule consults 24/7</li>
              <li className="flex items-start gap-2"><MessageCircle className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Chat with Charlie in-app</li>
              <li className="flex items-start gap-2"><ShoppingBag className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Lausanne Supplements + subscriptions</li>
              <li className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Treatment plan + recovery progress</li>
              <li className="flex items-start gap-2"><Lock className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Face-ID gated medical records</li>
            </ul>
          </div>

          <div style={tile} className="rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5" style={{ color: brand.accent }} />
              <div className="font-display text-lg font-semibold">Doctor app</div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><Calendar className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Today + week appointments</li>
              <li className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Patient summary on demand</li>
              <li className="flex items-start gap-2"><MessageCircle className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Voice notes → auto-written to brain</li>
              <li className="flex items-start gap-2"><Users className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Refer to colleagues in two taps</li>
            </ul>
          </div>

          <div style={tile} className="rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5" style={{ color: brand.accent }} />
              <div className="font-display text-lg font-semibold">Staff iPad app</div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Log activity as you work</li>
              <li className="flex items-start gap-2"><Calendar className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Reception check-in flow</li>
              <li className="flex items-start gap-2"><Users className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Hand-offs between team members</li>
              <li className="flex items-start gap-2"><Eye className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: brand.primaryDark }} /> Real-time business view per role</li>
            </ul>
          </div>
        </div>
      </section>

      <p className="text-[11px] text-center" style={{ color: brand.muted }}>
        StudEx Cognitive Brain · Staff app · Live ops wall · Mobile app — all
        wireframed today, built in Phase 3. See the proposal for scope and price.
      </p>
    </div>
  );
}
