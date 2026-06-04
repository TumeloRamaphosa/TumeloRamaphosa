"use client";

// Wireframe preview of Phase 2 / 3 / 4 capabilities.
// All data inline mocks — nothing connected — for client demo only.

import {
  Bot,
  Sparkles,
  Search,
  PenSquare,
  MessageSquare,
  Inbox,
  BarChart3,
  Package,
  Clock,
  ShieldCheck,
  Calendar,
  ShoppingBag,
  CheckCircle2,
  Hourglass,
  Ban,
  Server,
  Lock,
  MapPin,
} from "lucide-react";
import type { Brand } from "@/lib/brand";

// --- Mock data --------------------------------------------------------------

const AGENTS = [
  { icon: Search, name: "Competitor Scout", status: "Watching 27 accounts hourly", lit: true },
  { icon: PenSquare, name: "Content Composer", status: "Drafted 5 posts · awaiting approval", lit: true },
  { icon: MessageSquare, name: "Engagement Manager", status: "Replied to 14 comments across IG, FB, TikTok", lit: true },
  { icon: Inbox, name: "Inbox Triage", status: "Routed 23 enquiries · booked 9", lit: true },
  { icon: BarChart3, name: "Insights Analyst", status: "Daily report ready for 09:00 meeting", lit: true },
  { icon: Package, name: "Store Ops", status: "12 orders processed · 3 subscriptions renewed", lit: true },
];

const DAY_SCHEDULE = [
  { time: "06:00", who: "Inbox Triage", what: "Summarises overnight messages across every channel" },
  { time: "07:00", who: "Competitor Scout", what: "Pulls top-5 accounts' last 24h posts + comments + engagement" },
  { time: "08:00", who: "Insights Analyst", what: "Builds the shareholders' morning brief" },
  { time: "09:00", who: "Leadership", what: "Daily brief delivered (humans review + decide)" },
  { time: "10:00", who: "Content Composer", what: "Drafts the day's 5 posts using competitor signal + brand voice" },
  { time: "11:00", who: "Human approver", what: "Reviews drafted posts in the approval queue" },
  { time: "13:00", who: "Publishing Agent", what: "Publishes approved posts across IG, FB, LinkedIn, TikTok, X" },
  { time: "14:00", who: "Engagement Manager", what: "Replies to comments + DMs as they arrive" },
  { time: "16:00", who: "Store Ops", what: "Reconciles orders, dispatches subscription deliveries" },
  { time: "18:00", who: "Insights Analyst", what: "End-of-day summary to leadership + tomorrow's prep" },
];

const COMPETITORS = [
  { handle: "@laser_eye_sa",        followers: "42.1K", weekly: 5, eng: "3.2%", format: "Reels",      last: "2h ago" },
  { handle: "@derma_aesthetics",    followers: "89.4K", weekly: 7, eng: "5.1%", format: "Carousel",   last: "14h ago" },
  { handle: "@vision_correct_jhb",  followers: "31.0K", weekly: 3, eng: "2.8%", format: "Static",     last: "1d ago" },
  { handle: "@injectable_co",       followers: "67.7K", weekly: 6, eng: "4.4%", format: "Reels",      last: "4h ago" },
  { handle: "@longevity_clinic",    followers: "28.3K", weekly: 4, eng: "6.2%", format: "Carousel",   last: "6h ago" },
];

const COMP_TAKEAWAYS = [
  "Reels outperform static 3.8× in your category",
  "Saturday 10:00 is the top engagement window",
  "Before / after carousels drive the most saves",
  "Patient testimonials convert most DMs to bookings",
];

const POSTS = [
  { time: "09:00", title: "5 signs you need an eye exam",          channels: "IG · FB carousel",   status: "approved",  next: "Going live 11:00" },
  { time: "11:00", title: "Patient story — LASIK recovery",        channels: "IG Reels",           status: "pending",   next: "Awaiting approval" },
  { time: "13:30", title: "Why we offer Sculptra",                 channels: "IG · LinkedIn",      status: "drafting",  next: "In agent draft" },
  { time: "15:00", title: "New: Lausanne Vitamin D3",              channels: "IG · FB · X",        status: "approved",  next: "Going live 15:00" },
  { time: "18:00", title: "Behind the scenes — theatre day",       channels: "IG Reels",           status: "held",      next: "Held for privacy review" },
];

const POST_STATUS: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; label: string }> = {
  approved: { icon: CheckCircle2, color: "#3FBE85", label: "Approved" },
  pending:  { icon: Hourglass,    color: "#D4B574", label: "Pending" },
  drafting: { icon: PenSquare,    color: "#6FA8DC", label: "Drafting" },
  held:     { icon: Ban,          color: "#C0492F", label: "Held" },
};

const INBOX = [
  { when: "14:32", from: "Thandeka",          ch: "WhatsApp",     msg: "Hi, can I book a LASIK consult?",      action: "Charlie replying · booking on hold" },
  { when: "14:28", from: "@sarah_jhb",        ch: "Instagram",    msg: "What does Sculptra cost?",              action: "Replied · sent treatment menu" },
  { when: "14:15", from: "Dr Reza",           ch: "Email",        msg: "Patient referral — urgent",             action: "Routed to Dr Naidoo" },
  { when: "13:55", from: "Mike Patterson",    ch: "Facebook",     msg: "Hours on Saturday?",                    action: "Auto-replied · Saturday 09–13:00" },
  { when: "13:40", from: "@longevity.maven",  ch: "Instagram",    msg: "Subscription question",                 action: "Routed to Store Ops" },
  { when: "13:12", from: "Anonymous",         ch: "Website chat", msg: "Pricing for omega supplements",         action: "Replied · sent product page" },
];

const DOCTORS = [
  { name: "Dr Naidoo",   focus: "Ophthalmology — LASIK / PRK",      slots: ["09:00 Mrs Khoza", "10:30 Mr Patel", "12:00 Mrs Mokoena · LASIK consult", "14:00 Theatre block"] },
  { name: "Dr Sithole",  focus: "Ophthalmology — Cataracts",         slots: ["08:30 Mr van der Merwe", "10:00 Cataract consult", "13:00 Theatre", "16:00 Follow-up"] },
  { name: "Dr Khumalo",  focus: "Aesthetics — Injectables",          slots: ["09:00 Aesthetics consult", "11:00 Sculptra", "13:30 Filler", "15:00 Peel"] },
  { name: "Dr Adams",    focus: "Dermatology + Weight",              slots: ["10:00 Derma consult", "12:00 Botox", "14:00 Weight management", "16:00 IV drip"] },
  { name: "Dr Williams", focus: "Longevity",                          slots: ["11:00 Longevity consult", "13:00 NAD session", "15:00 Follow-up", "17:00 Consultation"] },
];

const PRODUCTS = [
  { name: "Lausanne Collagen Peptides", price: "R690 / mo",  subs: "312 active subs" },
  { name: "Lausanne Vitamin D3",         price: "R220 / mo",  subs: "487 active subs" },
  { name: "Lausanne Omega-3",            price: "R280 / mo",  subs: "401 active subs" },
  { name: "Lausanne NAD+ Booster",       price: "R1,800 / mo", subs: "89 active subs" },
  { name: "Lausanne Longevity Stack",    price: "R2,400 / mo", subs: "134 active subs" },
  { name: "Lausanne Weight Support",     price: "R1,200 / mo", subs: "76 active subs" },
];

const STORE_KPIS = [
  { label: "Monthly recurring revenue", value: "R742K" },
  { label: "Annual run-rate",            value: "R8.9M" },
  { label: "Subscriber count",           value: "1,499" },
  { label: "Average order value",        value: "R1,180" },
];

// --- Sub-components ---------------------------------------------------------

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

// --- Main component ---------------------------------------------------------

export function Phase2Preview({ brand }: { brand: Brand }) {
  const tile = { background: brand.card, border: `1px solid ${brand.border}` };

  return (
    <div className="space-y-12">
      {/* Section banner */}
      <div
        className="rounded-2xl p-6 flex items-start gap-4"
        style={{
          background: `linear-gradient(180deg, ${brand.card} 0%, ${brand.bg} 100%)`,
          border: `1px solid ${brand.border}`,
        }}
      >
        <Sparkles className="w-6 h-6 shrink-0 mt-1" style={{ color: brand.accent }} />
        <div>
          <div className="font-display text-2xl font-semibold">What is coming next — wireframe preview</div>
          <p className="mt-1 text-sm" style={{ color: brand.muted }}>
            Everything below is a visual preview of capabilities we will build in
            Phases 2, 3 and 4. None of it is connected yet — the panels are mocks
            to show shape and value before we wire them live.
          </p>
        </div>
      </div>

      {/* 1. Agent operations + day schedule */}
      <section>
        <SectionHead
          kicker="Agent operations"
          title="Your back-of-house team — running on autopilot"
          sub="Six specialist agents covering social, content, inbox, insights, and the store. Humans approve, agents execute."
          phase="Phase 2"
          brand={brand}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENTS.map((a) => (
            <div key={a.name} style={tile} className="rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${brand.primary}33` }}>
                  <a.icon className="w-5 h-5" style={{ color: brand.primaryDark || brand.primary }} />
                </div>
                <div className="font-semibold">{a.name}</div>
                <span className="ml-auto handled-dot" />
              </div>
              <p className="text-sm mt-3" style={{ color: brand.muted }}>{a.status}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden" style={tile}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${brand.border}` }}>
            <Clock className="w-4 h-4" style={{ color: brand.accent }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: brand.accent }}>
              A day in the orchestra
            </span>
          </div>
          {DAY_SCHEDULE.map((s, i) => (
            <div
              key={s.time}
              className="grid grid-cols-12 px-5 py-3 text-sm items-center"
              style={{ borderBottom: i === DAY_SCHEDULE.length - 1 ? "none" : `1px solid ${brand.border}` }}
            >
              <div className="col-span-2 font-display font-semibold" style={{ color: brand.primaryDark || brand.primary }}>{s.time}</div>
              <div className="col-span-3 font-semibold">{s.who}</div>
              <div className="col-span-7" style={{ color: brand.muted }}>{s.what}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Competitor watch */}
      <section>
        <SectionHead
          kicker="Competitor intelligence"
          title="Top-5 accounts in your category — watched continuously"
          sub="Posts, comments, formats and engagement patterns mined every hour and rolled into the morning brief."
          phase="Phase 2"
          brand={brand}
        />

        <div className="rounded-2xl overflow-hidden" style={tile}>
          <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest px-5 py-3" style={{ color: brand.muted, borderBottom: `1px solid ${brand.border}` }}>
            <div className="col-span-3">Account</div>
            <div className="col-span-2">Followers</div>
            <div className="col-span-2">Posts / wk</div>
            <div className="col-span-2">Engagement</div>
            <div className="col-span-2">Format</div>
            <div className="col-span-1 text-right">Last</div>
          </div>
          {COMPETITORS.map((c, i) => (
            <div
              key={c.handle}
              className="grid grid-cols-12 px-5 py-3 text-sm items-center"
              style={{ borderBottom: i === COMPETITORS.length - 1 ? "none" : `1px solid ${brand.border}` }}
            >
              <div className="col-span-3 font-semibold">{c.handle}</div>
              <div className="col-span-2" style={{ color: brand.muted }}>{c.followers}</div>
              <div className="col-span-2" style={{ color: brand.muted }}>{c.weekly}</div>
              <div className="col-span-2" style={{ color: brand.primaryDark || brand.primary }}>{c.eng}</div>
              <div className="col-span-2" style={{ color: brand.muted }}>{c.format}</div>
              <div className="col-span-1 text-right text-xs" style={{ color: brand.muted }}>{c.last}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl p-5" style={tile}>
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: brand.accent }}>
            What is working in your category
          </div>
          <ul className="space-y-2 text-sm">
            {COMP_TAKEAWAYS.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: brand.primaryDark || brand.primary }} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Content pipeline */}
      <section>
        <SectionHead
          kicker="Content pipeline"
          title="Five posts a day — drafted, approved, published"
          sub="Agent drafts each post from competitor signal + brand voice. Humans approve. Publishing agent ships across IG, FB, LinkedIn, TikTok and X."
          phase="Phase 2"
          brand={brand}
        />

        <div className="rounded-2xl overflow-hidden" style={tile}>
          <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest px-5 py-3" style={{ color: brand.muted, borderBottom: `1px solid ${brand.border}` }}>
            <div className="col-span-1">Slot</div>
            <div className="col-span-5">Post</div>
            <div className="col-span-2">Channels</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Next</div>
          </div>
          {POSTS.map((p, i) => {
            const s = POST_STATUS[p.status];
            return (
              <div
                key={p.title}
                className="grid grid-cols-12 px-5 py-3 text-sm items-center"
                style={{ borderBottom: i === POSTS.length - 1 ? "none" : `1px solid ${brand.border}` }}
              >
                <div className="col-span-1 font-display font-semibold" style={{ color: brand.primaryDark || brand.primary }}>{p.time}</div>
                <div className="col-span-5">{p.title}</div>
                <div className="col-span-2" style={{ color: brand.muted }}>{p.channels}</div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: s.color }}>
                    <s.icon className="w-3.5 h-3.5" />
                    {s.label}
                  </span>
                </div>
                <div className="col-span-2 text-xs" style={{ color: brand.muted }}>{p.next}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Unified inbox */}
      <section>
        <SectionHead
          kicker="Unified inbox"
          title="One queue for every channel"
          sub="WhatsApp, Instagram, Facebook, LinkedIn, X, email and website chat — Charlie triages, books, escalates clinical to humans."
          phase="Phase 2"
          brand={brand}
        />
        <div className="rounded-2xl overflow-hidden" style={tile}>
          {INBOX.map((m, i) => (
            <div
              key={m.when + m.from}
              className="grid grid-cols-12 px-5 py-3 text-sm items-center gap-2"
              style={{ borderBottom: i === INBOX.length - 1 ? "none" : `1px solid ${brand.border}` }}
            >
              <div className="col-span-1 text-xs" style={{ color: brand.muted }}>{m.when}</div>
              <div className="col-span-2 font-semibold">{m.from}</div>
              <div className="col-span-2 text-xs uppercase tracking-widest" style={{ color: brand.accent }}>{m.ch}</div>
              <div className="col-span-4">{m.msg}</div>
              <div className="col-span-3 text-xs" style={{ color: brand.muted }}>{m.action}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Doctor calendars */}
      <section>
        <SectionHead
          kicker="Doctor calendars"
          title="Each doctor's day — one unified view"
          sub="Bookings live on a shared calendar so reception, doctors, and the booking agent never collide. The day on this dashboard, the week on each doctor's page."
          phase="Phase 2"
          brand={brand}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCTORS.map((d) => (
            <div key={d.name} style={tile} className="rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: brand.accent }} />
                <div className="font-display text-lg font-semibold">{d.name}</div>
              </div>
              <div className="text-xs mt-1" style={{ color: brand.muted }}>{d.focus}</div>
              <ul className="mt-4 space-y-2 text-sm">
                {d.slots.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: brand.primaryDark || brand.primary }} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Lausanne Medical Supplements store */}
      <section>
        <SectionHead
          kicker="Lausanne Medical Supplements"
          title="Your own doctor-curated supplement line — on subscription"
          sub="A storefront connected to the same dashboard. Monthly subscriptions for longevity, vitality and all-round health. Orders flow into Store Ops automatically."
          phase="Phase 3"
          brand={brand}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {STORE_KPIS.map((k) => (
            <div key={k.label} style={tile} className="rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest" style={{ color: brand.muted }}>{k.label}</div>
              <div className="font-display text-2xl font-semibold mt-1">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((p) => (
            <div key={p.name} style={tile} className="rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${brand.accent}22` }}>
                  <ShoppingBag className="w-5 h-5" style={{ color: brand.accent }} />
                </div>
                <div className="font-semibold">{p.name}</div>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="font-display text-xl font-semibold">{p.price}</div>
                <div className="text-xs" style={{ color: brand.muted }}>{p.subs}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Local hub */}
      <section>
        <SectionHead
          kicker="Local hub"
          title="Your data, your premises — encrypted, on site"
          sub="An on-premise orchestration appliance lives in your reception. Patient records and clinical data stay in South Africa; only anonymised metrics ride to the dashboard."
          phase="Phase 4"
          brand={brand}
        />

        <div className="rounded-2xl p-6" style={tile}>
          <div className="flex flex-wrap items-start gap-6 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${brand.primary}33` }}>
                <Server className="w-6 h-6" style={{ color: brand.primaryDark || brand.primary }} />
              </div>
              <div>
                <div className="font-display text-xl font-semibold flex items-center gap-2">
                  Local hub <span className="handled-dot" /> <span className="text-sm font-normal" style={{ color: brand.muted }}>online</span>
                </div>
                <div className="text-sm" style={{ color: brand.muted }}>Sandton reception · provisioned + monitored by StudEx</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: `${brand.accent}22`, color: brand.accent }}>
                <Lock className="w-3 h-3" /> AES-256 at rest
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: `${brand.accent}22`, color: brand.accent }}>
                <ShieldCheck className="w-3 h-3" /> TLS 1.3 in flight
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: `${brand.accent}22`, color: brand.accent }}>
                <MapPin className="w-3 h-3" /> Data resident in South Africa
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: brand.muted }}>Access tiers</div>
              <ul className="text-sm space-y-1.5" style={{ color: brand.text }}>
                <li>Doctor — full clinical access</li>
                <li>Admin — bookings + claims</li>
                <li>Reception — bookings only</li>
                <li>Patient — own record only</li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: brand.muted }}>What stays local</div>
              <ul className="text-sm space-y-1.5" style={{ color: brand.text }}>
                <li>Patient identifiers</li>
                <li>Clinical notes + scans</li>
                <li>Medical-aid claims</li>
                <li>Records (Elixir, My Appointment)</li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: brand.muted }}>What flows to dashboard</div>
              <ul className="text-sm space-y-1.5" style={{ color: brand.text }}>
                <li>Anonymised metrics</li>
                <li>Channel + revenue counts</li>
                <li>Agent operations status</li>
                <li>POPIA-safe summaries only</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footnote */}
      <p className="text-[11px] text-center" style={{ color: brand.muted }}>
        Every panel above is a wireframe. None of the data is live. Phases 2, 3 and 4 wire each section
        to its real source — see the proposal for scope, timing and price.
      </p>
    </div>
  );
}
