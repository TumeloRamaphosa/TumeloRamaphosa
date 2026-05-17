import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Workflow,
  TrendingUp,
  MessageCircle,
  Mail,
  CreditCard,
  Receipt,
  CalendarClock,
  Camera,
  ThumbsUp,
  Globe,
  PenLine,
  Clock,
  Banknote,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";

const NAV = [
  { label: "What it is", href: "#what" },
  { label: "What it runs", href: "#unify" },
  { label: "The two OS", href: "#systems" },
  { label: "Time & money", href: "#value" },
  { label: "SafeSight", href: "/safesight" },
];

const PILLARS = [
  {
    icon: Brain,
    title: "Each agent has a memory",
    body: "Every conversation, booking and transaction goes into a second brain. Your agents don't reset — they accumulate.",
  },
  {
    icon: Workflow,
    title: "Each agent has a job",
    body: "Bookings, billing, follow-ups, content, support. Defined roles, clear ownership, full transparency on one board.",
  },
  {
    icon: TrendingUp,
    title: "It compounds",
    body: "The agent you have in month three is sharper than month one. By month twelve there is no comparison.",
  },
];

const CHANNELS = [
  { icon: MessageCircle, label: "WhatsApp Business" },
  { icon: Mail, label: "Email" },
  { icon: CreditCard, label: "Payments" },
  { icon: Receipt, label: "Billing & invoicing" },
  { icon: CalendarClock, label: "Calendar & scheduling" },
  { icon: Camera, label: "Instagram" },
  { icon: ThumbsUp, label: "Facebook" },
  { icon: Globe, label: "Your website" },
  { icon: PenLine, label: "Content generation" },
];

export default function Home() {
  return (
    <>
      <Nav links={NAV} />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-40 pb-28 text-center">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-violet/20 blur-[140px] animate-aurora" />
        <div className="pointer-events-none absolute -top-20 right-10 h-[380px] w-[380px] rounded-full bg-teal/15 blur-[120px] animate-aurora" />
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <Badge>An agent-run operating system for your business</Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-7 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
              Your business has a computer now.
              <br />
              <span className="text-gradient">And it runs itself.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-muted md:text-xl">
              LAISA is not another app or dashboard on top of your other
              dashboards. It is an operating system, run by AI agents that work
              for you 24/7 — and get smarter every single week.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href="#contact">
                <Button size="lg">
                  Book a walkthrough <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="#what">
                <Button size="lg" variant="outline">
                  See how it works
                </Button>
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-sm text-muted">
              Think Perplexity Computer — but instead of answering questions, it
              runs your business.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-y border-line bg-ink-2 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              How much of your week is spent{" "}
              <span className="text-teal">running</span> your business — versus{" "}
              <span className="text-teal">reacting</span> to it?
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 text-lg text-muted">
              For most owners it&apos;s 80/20. Eighty percent reacting: WhatsApp
              at midnight, a missed appointment, DMs piling up, invoices
              unchased, the books due Friday. Twenty percent — if you&apos;re
              lucky — actually growing the thing.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-2xl font-bold md:text-3xl">
              LAISA flips that ratio.
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHAT IT IS */}
      <section id="what" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
              What it is
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              An operating system, staffed by agents
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Every channel where work shows up flows into one place. In that
              place are agents — each with a job, a memory, and a growing
              understanding of your business.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.07}>
                <Card className="h-full">
                  <p.icon className="h-7 w-7 text-violet" />
                  <h3 className="mt-5 text-xl font-semibold">{p.title}</h3>
                  <p className="mt-3 text-[15px] text-muted">{p.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* UNIFY */}
      <section id="unify" className="border-y border-line bg-ink-2 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
              What it runs
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Everything, into one dashboard
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              We meet you where you already work. Your customers never notice a
              thing changed — except that you reply faster, remember everything,
              and never drop the ball.
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {CHANNELS.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.03}>
                <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-5 py-3 text-[15px]">
                  <c.icon className="h-4 w-4 text-teal" />
                  {c.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TWO OPERATING SYSTEMS */}
      <section id="systems" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
              The two operating systems
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Built for the two faces of your business
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Reveal>
              <Card className="h-full">
                <h3 className="text-xl font-semibold">Operations OS</h3>
                <p className="mt-1 font-medium text-teal">
                  Your back office, handled.
                </p>
                <ul className="mt-5 space-y-3 text-[15px] text-muted">
                  {[
                    "Scheduling & no-show recovery",
                    "Payment reconciliation",
                    "Invoicing & polite, relentless follow-up",
                    "Billing & claims",
                    "Clean books handed to your accountant monthly",
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
                <h3 className="text-xl font-semibold">Customer Experience OS</h3>
                <p className="mt-1 font-medium text-teal">
                  Every touchpoint with the people who pay you.
                </p>
                <ul className="mt-5 space-y-3 text-[15px] text-muted">
                  {[
                    "WhatsApp & DM replies in your voice",
                    "Lead capture & instant follow-up",
                    "Bookings confirmed automatically",
                    "Content drafted, scheduled, moderated",
                    "Website chat that converts",
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
          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-muted">
              Different agents. Different permissions. One unified view for you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* VALUE */}
      <section id="value" className="border-y border-line bg-ink-2 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
              Time &amp; money
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              The only two things that actually matter
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Reveal>
              <Card className="h-full">
                <Clock className="h-7 w-7 text-violet" />
                <p className="mt-5 text-4xl font-extrabold text-gradient">
                  15–20 hrs / week
                </p>
                <h3 className="mt-3 text-xl font-semibold">Time, returned</h3>
                <p className="mt-3 text-[15px] text-muted">
                  The work that doesn&apos;t need a human — triaging chats,
                  answering &quot;what are your hours&quot; for the hundredth
                  time, chasing invoices, posting content. Two full working days
                  a week, back in your hands.
                </p>
              </Card>
            </Reveal>
            <Reveal delay={0.07}>
              <Card className="h-full">
                <Banknote className="h-7 w-7 text-violet" />
                <p className="mt-5 text-4xl font-extrabold text-gradient">
                  3 ways money shows up
                </p>
                <h3 className="mt-3 text-xl font-semibold">Money, unlocked</h3>
                <p className="mt-3 text-[15px] text-muted">
                  Leads that used to slip through get followed up in minutes.
                  Invoices get paid faster because someone is actually chasing
                  them. And the admin work that needed three hires now needs
                  zero.
                </p>
              </Card>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-2xl font-bold md:text-3xl">
              We don&apos;t just save time and money. We create time and unlock
              money.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SAFESIGHT CALLOUT */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Card className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
                Flagship client
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                SafeSight runs on LAISA
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                SafeSight is the first business operating fully inside LAISA — a
                live proof that one infrastructure can run an entire operation
                end to end, from first patient contact to reconciled books.
              </p>
              <Link href="/safesight" className="mt-7 inline-block">
                <Button variant="outline" size="lg">
                  See the SafeSight build <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ONBOARDING */}
      <section className="border-y border-line bg-ink-2 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
              Onboarding
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Live in days, not months
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Connect",
                b: "We plug into your WhatsApp, email, payments, socials and website. Nothing to migrate, nothing to relearn.",
              },
              {
                n: "02",
                t: "Configure",
                b: "We tune the agents to your voice, your pricing, your rules. Your Operations OS and Customer Experience OS go live.",
              },
              {
                n: "03",
                t: "Compound",
                b: "Every interaction makes it sharper. You watch one board, make the calls only you can make, and grow.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.07}>
                <Card className="h-full">
                  <span className="font-display text-sm font-extrabold text-teal">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
                  <p className="mt-3 text-[15px] text-muted">{s.b}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section
        id="contact"
        className="relative overflow-hidden px-6 py-28 text-center"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[140px]" />
        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold md:text-5xl">
              Welcome to your business, on autopilot.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              Book a walkthrough and we&apos;ll show you LAISA running a real
              operation, live.
            </p>
          </Reveal>
          <Reveal delay={0.07}>
            <div className="mt-10">
              <LeadForm source="laisa" />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
