import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  CalendarCheck,
  BellRing,
  FileText,
  Star,
  ShieldCheck,
  HeartPulse,
  Clock,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";

const NAV = [
  { label: "The problem", href: "#problem" },
  { label: "What it does", href: "#does" },
  { label: "The two systems", href: "#systems" },
  { label: "Outcomes", href: "#outcomes" },
];

const CAPABILITIES = [
  {
    icon: MessageCircle,
    title: "Patient comms on WhatsApp",
    body: "Every enquiry answered instantly, in your practice's voice. Triage built in — clinical questions escalate to your team, admin is handled.",
  },
  {
    icon: CalendarCheck,
    title: "Bookings & rescheduling",
    body: "Patients book, move and confirm appointments themselves. Your calendar stays full without your front desk lifting a finger.",
  },
  {
    icon: BellRing,
    title: "No-show recovery",
    body: "Smart reminders and automatic waitlist fill. Empty slots get re-booked before they cost you revenue.",
  },
  {
    icon: FileText,
    title: "Billing & medical aid claims",
    body: "Invoices raised, claims prepared and submitted, shortfalls chased — politely and relentlessly — on your behalf.",
  },
  {
    icon: Star,
    title: "Reputation & content",
    body: "Happy patients prompted for reviews; weekly patient-education content drafted, scheduled and moderated for you.",
  },
  {
    icon: ShieldCheck,
    title: "POPIA-aware by design",
    body: "Patient data handled with least-privilege access, audit trails, and isolation per practice. Privacy is the default, not an add-on.",
  },
];

export default function SafeSight() {
  return (
    <>
      <Nav
        links={NAV}
        brand="SafeSight"
        cta={{ label: "Request a demo", href: "#contact" }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-40 pb-28 text-center">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-teal/20 blur-[140px] animate-aurora" />
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <Badge>
              <HeartPulse className="h-3.5 w-3.5 text-teal" /> An operating
              system for your medical practice
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-7 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
              Your practice, running itself —
              <br />
              <span className="text-gradient">
                so you can focus on patients.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-muted md:text-xl">
              SafeSight is your front desk, billing clerk and marketing team —
              running 24/7 as AI agents. Bookings, reminders, claims and patient
              communication, handled. You and your staff get your time back.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href="#contact">
                <Button size="lg">
                  Request a demo <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="#does">
                <Button size="lg" variant="outline">
                  See what it does
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section
        id="problem"
        className="border-y border-line bg-ink-2 px-6 py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              The front desk is drowning — and it&apos;s costing you patients.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 text-lg text-muted">
              Missed calls become lost patients. No-shows become empty,
              unbillable hours. Claims sit unsubmitted. Reviews never get asked
              for. And your team spends the day on admin instead of care — then
              you finish the paperwork after hours.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-2xl font-bold md:text-3xl">
              SafeSight takes all of it off your desk.
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section id="does" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
              What it does
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              A full practice team, in software
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.07}>
                <Card className="h-full">
                  <c.icon className="h-7 w-7 text-violet" />
                  <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
                  <p className="mt-3 text-[15px] text-muted">{c.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TWO SYSTEMS */}
      <section
        id="systems"
        className="border-y border-line bg-ink-2 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
              The two systems
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Back office and patient care, both covered
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Reveal>
              <Card className="h-full">
                <h3 className="text-xl font-semibold">Practice Operations OS</h3>
                <p className="mt-1 font-medium text-teal">
                  The admin, done before you arrive.
                </p>
                <ul className="mt-5 space-y-3 text-[15px] text-muted">
                  {[
                    "Scheduling, confirmations & waitlist fill",
                    "Medical aid claim preparation & submission",
                    "Invoicing & shortfall follow-up",
                    "Daily reconciliation & a clean monthly handover",
                    "Staff coordination & internal comms",
                  ].map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="text-violet">→</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={0.07}>
              <Card className="h-full">
                <h3 className="text-xl font-semibold">Patient Experience OS</h3>
                <p className="mt-1 font-medium text-teal">
                  Every patient, looked after.
                </p>
                <ul className="mt-5 space-y-3 text-[15px] text-muted">
                  {[
                    "Instant WhatsApp & website responses",
                    "Self-service booking & rescheduling",
                    "Appointment & preparation reminders",
                    "Review requests & feedback capture",
                    "Patient-education content, on schedule",
                  ].map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="text-violet">→</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section id="outcomes" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
              Outcomes
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              What changes in the first month
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: BellRing,
                stat: "Fewer no-shows",
                body: "Automated reminders and instant waitlist fill keep the diary full and billable.",
              },
              {
                icon: FileText,
                stat: "Faster claims",
                body: "Claims prepared and submitted same-day, with shortfalls chased automatically.",
              },
              {
                icon: Clock,
                stat: "Hours back, daily",
                body: "Your front desk stops living in the inbox and goes back to caring for patients.",
              },
            ].map((o, i) => (
              <Reveal key={o.stat} delay={i * 0.07}>
                <Card className="h-full">
                  <o.icon className="h-7 w-7 text-violet" />
                  <p className="mt-5 text-2xl font-extrabold text-gradient">
                    {o.stat}
                  </p>
                  <p className="mt-3 text-[15px] text-muted">{o.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POWERED BY StudEx Ai OS */}
      <section className="border-y border-line bg-ink-2 px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <Reveal>
            <p className="text-muted">
              SafeSight is powered by{" "}
              <span className="font-semibold text-text">StudEx Ai OS</span> — the
              agent-run operating system behind it.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" /> Learn about StudEx Ai OS
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative overflow-hidden px-6 py-28 text-center"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/15 blur-[140px]" />
        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold md:text-5xl">
              See SafeSight run your practice.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              Request a demo and we&apos;ll show you a live practice running on
              SafeSight — bookings, claims and patient comms, end to end.
            </p>
          </Reveal>
          <Reveal delay={0.07}>
            <div className="mt-10">
              <LeadForm source="safesight" />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
