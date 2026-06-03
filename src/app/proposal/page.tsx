"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ExternalLink,
  FileText,
  Layers,
  LineChart,
  ShieldAlert,
  Sparkles,
  Star,
} from "lucide-react";
import { LAISA } from "@/lib/laisa";

const B = LAISA;

// --- Content ----------------------------------------------------------------

const DELIVERED = [
  {
    title: "Marketing website",
    note: "Home + SafeSight medical practice page",
    href: "/",
    prd: "Q8–Q11",
  },
  {
    title: "LAISA dashboard",
    note: "KPIs, channels, ROI, GoodX claims, Charlie, briefings",
    href: "/demo",
    prd: "Q28–Q30 · Q12 · Q21–Q22",
  },
  {
    title: "SafeSight page",
    note: "Ophthalmology brand surface, ready to extend",
    href: "/safesight",
    prd: "Q6",
  },
  {
    title: "Charlie — WhatsApp assistant demo",
    note: "Live scripted demo with ElevenLabs voice on /demo",
    href: "/demo#charlie",
    prd: "Q11 · Q14 · Q27",
  },
];

type PrdRow = { q: string; ask: string; status: "done" | "demo" | "phase2" | "phase3" | "open"; delivery: string };
const PRD_ROWS: PrdRow[] = [
  { q: "Q3", ask: "Both Eye + Aesthetics", status: "done", delivery: "Unit switcher: Eye Care · Aesthetics · All" },
  { q: "Q11", ask: "Book via WhatsApp", status: "demo", delivery: "Charlie WhatsApp demo with voice" },
  { q: "Q12", ask: "FB · IG · TikTok · WhatsApp", status: "demo", delivery: "Dashboard tiles for 4 of 5; TikTok in Phase 2" },
  { q: "Q22", ask: "Systems integrate? No", status: "phase2", delivery: "Composio integration spine scaffolded" },
  { q: "Q24", ask: "Currently automated? None", status: "demo", delivery: "First AI surface delivered (Charlie + voice)" },
  { q: "Q26", ask: "Automate: booking, reminders, comms, admin", status: "demo", delivery: "Charlie covers booking + comms; reminders + admin in Phase 2/3" },
  { q: "Q27", ask: "AI for: admin + patient chatbot", status: "demo", delivery: "Patient chatbot demoed; admin AI Phase 3" },
  { q: "Q28–Q30", ask: "Track revenue / dashboards basic only", status: "done", delivery: "Editorial dashboard with revenue KPIs" },
  { q: "Q31", ask: "Top 5 pain points", status: "phase2", delivery: "Marketing/social shipped; integration + automation in Phase 2/3" },
  { q: "Q32", ask: "Fix ONE thing = system integration", status: "phase2", delivery: "Composio spine chosen; live in Phase 2" },
  { q: "Q33", ask: "Multidisciplinary + media dominance", status: "done", delivery: "Brand + design system position you here" },
  { q: "Q34", ask: "Process automation + AI-assisted", status: "phase2", delivery: "Exactly the target — Phase 2 lands it" },
  { q: "Q35", ask: "Hybrid (cloud + local)", status: "phase3", delivery: "Cloud live; local bridge Phase 3" },
  { q: "Q37", ask: "Budget R50k–R100k", status: "open", delivery: "See payment options below" },
  { q: "Q38", ask: "Timeline 3–6 months", status: "done", delivery: "Phase 2+3 fit inside 6 months" },
  { q: "Q40", ask: "Concerns: integration, AI, patient-care quality", status: "done", delivery: "Addressed: phased, warranty, doctor-led" },
];

const FOUNDATION = [
  { title: "Google My Business", note: "Single highest-leverage local-SEO asset", priority: "Critical" },
  { title: "Meta Business Suite + Facebook Business", note: "Required for WhatsApp Business Cloud API + Pixel + Ads", priority: "Critical" },
  { title: "Meta CAPI (server-side attribution)", note: "Recovers 20–40% of ad-tracking lost to Brave / Safari / iOS / ad-blockers", priority: "High" },
  { title: "Google Ads + Facebook Ads accounts", note: "Not running today (Q12). Peers return R150–400K/mo on R30–50K/mo spend", priority: "High" },
  { title: "WhatsApp Business Cloud API", note: "The platform Charlie must live on", priority: "Critical" },
];

const RISKS = [
  { risk: "Response latency on client side", impact: "Slips milestones; also harms patients today (Q19 backlogs)", mitigation: "48-hour written response SLA in contract" },
  { risk: "No Facebook Business / Meta Business properly set up", impact: "Charlie can't go live on WhatsApp Business", mitigation: "Foundation Pack — see below" },
  { risk: "Marketing officer unfamiliar with FB Graph API / pixels", impact: "Phase 2 ad integrations need our team driving", mitigation: "Training in Grow / Scale retainer + runbooks" },
  { risk: "No Google My Business / Google Ads running", impact: "Local-search ceiling + ad-channel revenue forfeit", mitigation: "Foundation Pack" },
  { risk: "Booking + records still manual on paper (Q22, Q23)", impact: "Compliance + data risk", mitigation: "Phase 3 records bridge + chain-of-custody doc" },
  { risk: "Multiple parallel vendors, no transformation owner", impact: "Integration debt + duplicate spend", mitigation: "StudEx as single transformation owner" },
];

const PHASES = [
  { name: "Milestone 1 — Brand + Dashboard + Demo", status: "Delivered", duration: "Complete", price: "R280,000" },
  { name: "Foundation Pack", status: "Recommended", duration: "2–3 weeks", price: "R45,000" },
  { name: "Phase 2 — Live Integrations + Real Charlie + Channel Data", status: "Quoted", duration: "3–4 months", price: "R380,000 – R450,000" },
  { name: "Phase 3 — Admin AI + Records + Hybrid + Mobile", status: "Quoted", duration: "3–4 months", price: "R420,000 – R520,000" },
  { name: "Monthly Retainer — Care / Grow / Scale", status: "Optional", duration: "Monthly", price: "R25K / R45K / R75K" },
];

const INVOICE = [
  { id: "01", item: "Discovery, PRD analysis, requirements mapping", hours: 10, total: "R14,000" },
  { id: "02", item: "Brand & design system (DESIGN.md, warm editorial, light + dark)", hours: 26, total: "R36,400" },
  { id: "03", item: "Marketing website — home + SafeSight medical page", hours: 28, total: "R39,200" },
  { id: "04", item: "LAISA dashboard core — KPIs, channels, unit switcher", hours: 48, total: "R67,200" },
  { id: "05", item: "ROI + GoodX + Briefings panels", hours: 18, total: "R25,200" },
  { id: "06", item: "Charlie WhatsApp demo + ElevenLabs voice", hours: 20, total: "R28,000" },
  { id: "07", item: "Composio integration + live status panel", hours: 16, total: "R22,400" },
  { id: "08", item: "QA, security review, validation report", hours: 14, total: "R19,600" },
  { id: "09", item: "Responsive, theming, motion polish", hours: 12, total: "R16,800" },
  { id: "10", item: "Documentation + handover pack", hours: 8, total: "R11,200" },
];

const PRD_STATUS_LABEL: Record<PrdRow["status"], { label: string; color: string }> = {
  done: { label: "Delivered", color: B.primaryDark || "#3fbe85" },
  demo: { label: "Demo built", color: B.accent },
  phase2: { label: "Phase 2", color: "#6FA8DC" },
  phase3: { label: "Phase 3", color: "#9b87b8" },
  open: { label: "Open", color: "#D4B574" },
};

// --- Layout primitives ------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em]"
      style={{ color: B.muted }}
    >
      <span className="handled-dot" />
      {children}
    </p>
  );
}

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ background: B.card, border: `1px solid ${B.border}` }}
      className="rounded-2xl p-6"
    >
      {children}
    </div>
  );
}

// --- Page -------------------------------------------------------------------

export default function ProposalPage() {
  return (
    <div className="dark" style={{ background: B.bg, minHeight: "100vh", color: B.text }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{ background: "rgba(22,20,15,.85)", borderBottom: `1px solid ${B.border}` }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="handled-dot" />
            <span className="font-display font-semibold text-xl tracking-tight">LAISA</span>
          </div>
          <span className="hidden md:block text-xs" style={{ color: B.muted }}>
            Proposal · Milestone 1 · R280,000
          </span>
          <span
            className="hidden lg:block text-[10px] uppercase tracking-widest ml-auto"
            style={{ color: B.muted, opacity: 0.6 }}
          >
            Powered by StudEx Ai OS
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Hero */}
        <section>
          <SectionLabel>Prepared for SafeSight + LAISA Aesthetics</SectionLabel>
          <h1 className="mt-4 font-display text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            The clinic running itself — <span style={{ color: B.accent }}>starting now.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg" style={{ color: B.muted }}>
            Milestone 1 delivers the visible client-facing surface — brand,
            unified dashboard, patient-chatbot demo, and the first live
            integration layer. Phases 2 and 3 connect the rest.
          </p>
          <p className="mt-2 text-sm" style={{ color: B.muted }}>
            Reference: LAISA-2026-001-v2 · 3 June 2026 · Valid 14 days
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#payment"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-[10px]"
              style={{ background: B.primary, color: B.text }}
            >
              Accept Option B · Pay R75,000 deposit <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-[10px]"
              style={{ background: "transparent", color: B.text, border: `1px solid ${B.border}` }}
            >
              Open the live dashboard <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Delivered now */}
        <section>
          <SectionLabel>What you can try right now</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold">Delivered in Milestone 1</h2>
          <p className="mt-2 max-w-2xl" style={{ color: B.muted }}>
            Click any tile to open the live build.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {DELIVERED.map((d) => (
              <Link
                key={d.title}
                href={d.href}
                className="group rounded-2xl p-6 flex items-start gap-4 transition-colors"
                style={{ background: B.card, border: `1px solid ${B.border}` }}
              >
                <div
                  className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
                  style={{ background: `${B.primary}33` }}
                >
                  <ArrowRight className="w-5 h-5" style={{ color: B.primaryDark }} />
                </div>
                <div className="flex-1">
                  <div className="font-display text-xl font-semibold">{d.title}</div>
                  <div className="text-sm mt-1" style={{ color: B.muted }}>{d.note}</div>
                  <div className="text-[10px] uppercase tracking-widest mt-3" style={{ color: B.accent }}>
                    PRD {d.prd}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PRD coverage matrix */}
        <section>
          <SectionLabel>PRD coverage — every answer mapped</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold">Your discovery answers, our response</h2>
          <p className="mt-2 max-w-2xl" style={{ color: B.muted }}>
            Each row is a checkpoint you can sign off against. Status tags show
            what is live now versus what lands in Phase 2 or 3.
          </p>
          <div className="mt-8 rounded-2xl overflow-hidden" style={{ background: B.card, border: `1px solid ${B.border}` }}>
            <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest px-5 py-3" style={{ color: B.muted, borderBottom: `1px solid ${B.border}` }}>
              <div className="col-span-2">PRD</div>
              <div className="col-span-4">You asked for</div>
              <div className="col-span-4">We delivered</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            {PRD_ROWS.map((r, i) => (
              <div
                key={r.q + i}
                className="grid grid-cols-12 px-5 py-4 text-sm items-center"
                style={{ borderBottom: i === PRD_ROWS.length - 1 ? "none" : `1px solid ${B.border}` }}
              >
                <div className="col-span-2 font-semibold" style={{ color: B.accent }}>{r.q}</div>
                <div className="col-span-4" style={{ color: B.muted }}>{r.ask}</div>
                <div className="col-span-4">{r.delivery}</div>
                <div className="col-span-2 text-right">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: `${PRD_STATUS_LABEL[r.status].color}1f`,
                      color: PRD_STATUS_LABEL[r.status].color,
                      border: `1px solid ${PRD_STATUS_LABEL[r.status].color}55`,
                    }}
                  >
                    {PRD_STATUS_LABEL[r.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Foundation pack */}
        <section>
          <SectionLabel>Foundation Pack · R45,000</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold">Close the digital foundation first</h2>
          <p className="mt-2 max-w-2xl" style={{ color: B.muted }}>
            Five fixes that aren&apos;t Milestone 1 deliverables but, left open,
            cap the return on every later investment. Recommended as a parallel
            workstream while Phase 2 begins.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {FOUNDATION.map((f) => (
              <Tile key={f.title}>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5" style={{ color: B.accent }} />
                  <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: B.accent }}>
                    {f.priority}
                  </span>
                </div>
                <div className="font-display text-xl font-semibold">{f.title}</div>
                <p className="text-sm mt-2" style={{ color: B.muted }}>{f.note}</p>
              </Tile>
            ))}
          </div>
        </section>

        {/* Phased plan */}
        <section>
          <SectionLabel>The phased plan</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold">From now → ~9 months from now</h2>
          <div className="mt-8 rounded-2xl overflow-hidden" style={{ background: B.card, border: `1px solid ${B.border}` }}>
            {PHASES.map((p, i) => (
              <div
                key={p.name}
                className="grid grid-cols-12 px-6 py-5 items-center text-sm"
                style={{ borderBottom: i === PHASES.length - 1 ? "none" : `1px solid ${B.border}` }}
              >
                <div className="col-span-12 md:col-span-6 font-display text-lg font-semibold">{p.name}</div>
                <div className="col-span-4 md:col-span-2 text-[11px] uppercase tracking-widest" style={{ color: B.accent }}>
                  {p.status}
                </div>
                <div className="col-span-4 md:col-span-2" style={{ color: B.muted }}>{p.duration}</div>
                <div className="col-span-4 md:col-span-2 text-right font-semibold">{p.price}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm" style={{ color: B.muted }}>
            Full vision <strong style={{ color: B.text }}>R1.15M – R1.30M</strong> over 6–9 months,
            returning <strong style={{ color: B.text }}>R343K – R584K / year</strong> in saved time
            and recaptured revenue.
          </p>
        </section>

        {/* Risks */}
        <section>
          <SectionLabel>Risks we co-manage</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold">Named honestly, mitigated together</h2>
          <div className="mt-8 rounded-2xl overflow-hidden" style={{ background: B.card, border: `1px solid ${B.border}` }}>
            <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest px-5 py-3" style={{ color: B.muted, borderBottom: `1px solid ${B.border}` }}>
              <div className="col-span-4">Risk</div>
              <div className="col-span-4">If unmanaged</div>
              <div className="col-span-4">Mitigation</div>
            </div>
            {RISKS.map((r, i) => (
              <div
                key={r.risk}
                className="grid grid-cols-12 px-5 py-4 text-sm"
                style={{ borderBottom: i === RISKS.length - 1 ? "none" : `1px solid ${B.border}` }}
              >
                <div className="col-span-4 font-semibold">{r.risk}</div>
                <div className="col-span-4" style={{ color: B.muted }}>{r.impact}</div>
                <div className="col-span-4" style={{ color: B.text }}>{r.mitigation}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment options */}
        <section id="payment">
          <SectionLabel>Investment · payment options</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold">Three ways to release the work</h2>
          <p className="mt-2 max-w-2xl" style={{ color: B.muted }}>
            Your PRD Q37 budget answer was R50K–R100K. Milestone 1 delivers
            R280K of senior development, design, and AI integration. Here is
            how we reconcile that — pick the option that fits your cashflow.
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Option A */}
            <Tile>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: B.muted }}>Option A</div>
              <div className="mt-2 font-display text-2xl font-semibold">Straight 50 / 50</div>
              <div className="mt-3 text-sm" style={{ color: B.muted }}>
                Standard milestone billing.
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><span>Deposit on signing</span><span className="font-semibold">R140,000</span></div>
                <div className="flex justify-between"><span>On Milestone 1 sign-off</span><span className="font-semibold">R140,000</span></div>
              </div>
              <div className="mt-6 text-sm pt-4" style={{ borderTop: `1px solid ${B.border}`, color: B.muted }}>
                Best if Q37 was a starting position, not a ceiling.
              </div>
            </Tile>

            {/* Option B — recommended */}
            <div
              className="rounded-2xl p-6 relative"
              style={{
                background: B.card,
                border: `1.5px solid ${B.primaryDark || B.primary}`,
                boxShadow: `0 0 0 4px ${(B.primaryDark || B.primary)}22`,
              }}
            >
              <span
                className="absolute -top-3 left-6 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: B.primaryDark || B.primary, color: B.bg }}
              >
                <Star className="w-3 h-3" /> Recommended
              </span>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: B.primaryDark }}>Option B</div>
              <div className="mt-2 font-display text-2xl font-semibold">Staged · fits your cashflow</div>
              <div className="mt-3 text-sm" style={{ color: B.muted }}>
                Honours the R50K–R100K rhythm; closes inside the Q38 timeline.
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><span>Deposit on signing</span><span className="font-semibold">R75,000</span></div>
                <div className="flex justify-between"><span>Month 1</span><span className="font-semibold">R50,000</span></div>
                <div className="flex justify-between"><span>Month 2</span><span className="font-semibold">R50,000</span></div>
                <div className="flex justify-between"><span>Month 3</span><span className="font-semibold">R50,000</span></div>
                <div className="flex justify-between"><span>Month 4</span><span className="font-semibold">R50,000</span></div>
                <div className="flex justify-between"><span>Final on sign-off</span><span className="font-semibold">R5,000</span></div>
              </div>
              <div className="mt-4 flex justify-between text-base pt-4" style={{ borderTop: `1px solid ${B.border}` }}>
                <span className="font-semibold">Total</span>
                <span className="font-display font-semibold">R280,000</span>
              </div>
            </div>

            {/* Option C */}
            <Tile>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: B.muted }}>Option C</div>
              <div className="mt-2 font-display text-2xl font-semibold">Honour Q37 ceiling</div>
              <div className="mt-3 text-sm" style={{ color: B.muted }}>
                Invoice the upper end of your stated budget now, bank the rest as Phase 2 credit.
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><span>Invoice now</span><span className="font-semibold">R95,000</span></div>
                <div className="flex justify-between"><span>Credit to Phase 2</span><span className="font-semibold">R185,000</span></div>
              </div>
              <div className="mt-6 text-sm pt-4" style={{ borderTop: `1px solid ${B.border}`, color: B.muted }}>
                Phase 2 fee becomes R380K – R185K = ~R195K effective.
              </div>
            </Tile>
          </div>
        </section>

        {/* Hours invoice */}
        <section>
          <SectionLabel>Itemised invoice · 200 hours</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold">Where the R280,000 goes</h2>
          <p className="mt-2 max-w-2xl" style={{ color: B.muted }}>
            Blended rate R1,400 / hour (senior fullstack + product design + AI integration).
          </p>
          <div className="mt-8 rounded-2xl overflow-hidden" style={{ background: B.card, border: `1px solid ${B.border}` }}>
            <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest px-5 py-3" style={{ color: B.muted, borderBottom: `1px solid ${B.border}` }}>
              <div className="col-span-1">#</div>
              <div className="col-span-7">Work stream</div>
              <div className="col-span-2 text-right">Hours</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {INVOICE.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-12 px-5 py-3 text-sm items-center"
                style={{ borderBottom: `1px solid ${B.border}` }}
              >
                <div className="col-span-1" style={{ color: B.muted }}>{row.id}</div>
                <div className="col-span-7">{row.item}</div>
                <div className="col-span-2 text-right" style={{ color: B.muted }}>{row.hours}</div>
                <div className="col-span-2 text-right font-semibold">{row.total}</div>
              </div>
            ))}
            <div className="grid grid-cols-12 px-5 py-4 items-center" style={{ background: `${B.primary}1f` }}>
              <div className="col-span-8 font-display text-lg font-semibold">Total (ex VAT)</div>
              <div className="col-span-2 text-right font-semibold">200</div>
              <div className="col-span-2 text-right font-display text-lg font-semibold">R280,000</div>
            </div>
          </div>
        </section>

        {/* Acceptance */}
        <section>
          <SectionLabel>Acceptance & checkpoints</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold">Sign off when these are true</h2>
          <ul className="mt-8 space-y-3">
            {[
              "Marketing site loads at the demo URL",
              "LAISA dashboard at /demo shows all panels",
              "Charlie WhatsApp demo plays end-to-end with voice",
              "Composio status panel returns live data",
              "Validation report attached and reviewed",
              "DESIGN.md handed over for future brand consistency",
              "GitHub repo handed over with deploy instructions",
            ].map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5" style={{ color: B.primaryDark }} />
                <span>{c}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl p-8" style={{ background: B.card, border: `1px solid ${B.border}` }}>
            <div className="flex items-start gap-3 mb-6">
              <BadgeCheck className="w-6 h-6" style={{ color: B.primaryDark }} />
              <div>
                <div className="font-display text-2xl font-semibold">Approve Option B · pay R75,000 deposit</div>
                <p className="mt-1 text-sm" style={{ color: B.muted }}>
                  Banking details follow on signed return. Work resumes the day deposit clears.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: B.muted }}>For SafeSight + LAISA Aesthetics</div>
                <div className="mt-3 space-y-3" style={{ color: B.muted }}>
                  <div>Name: ________________________________</div>
                  <div>Title: ________________________________</div>
                  <div>Signature / Date: ____________________</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: B.muted }}>For StudEx</div>
                <div className="mt-3 space-y-3" style={{ color: B.muted }}>
                  <div>Name: T. Ramaphosa</div>
                  <div>Title: Founder, StudEx</div>
                  <div>Signature / Date: ____________________</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="pt-8" style={{ borderTop: `1px solid ${B.border}` }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="handled-dot" />
              <span className="font-display font-semibold text-lg">LAISA</span>
              <span className="text-xs" style={{ color: B.muted }}>· Powered by StudEx Ai OS</span>
            </div>
            <div className="text-xs" style={{ color: B.muted }}>
              Reference LAISA-2026-001-v2 · 3 June 2026
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
