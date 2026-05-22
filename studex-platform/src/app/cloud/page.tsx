"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Server,
  Bot,
  Globe,
  ShieldCheck,
  Banknote,
  Zap,
  Container,
  Terminal,
  Check,
  ArrowRight,
  Boxes,
  Lock,
} from "lucide-react";

const features = [
  { icon: Server, title: "Linux VMs in seconds", body: "Spin up Ubuntu VMs with Docker pre-installed. Containers, databases and full-stack apps — your own cloud, not a black box." },
  { icon: Bot, title: "An agent already inside", body: "Every VM can ship with OpenClaw or Hermes running. The agent connects itself to your command center — no setup." },
  { icon: Globe, title: "Custom domains + auto-SSL", body: "Point a domain, get HTTPS automatically via Let's Encrypt. Websites and apps live in minutes." },
  { icon: Banknote, title: "Billed in Rand", body: "Transparent ZAR pricing. No surprise USD invoices, no forex roulette at month-end." },
  { icon: ShieldCheck, title: "Data stays in SA", body: "Host in Johannesburg or Cape Town. POPIA-friendly data residency by design for regulated workloads." },
  { icon: Zap, title: "Power-resilient", body: "Run on infrastructure built for load-shedding reality, so your agents and sites stay up." },
];

const steps = [
  { icon: Boxes, title: "Pick a VM + agent", body: "Choose size, region and runtime (OpenClaw / Hermes / Claude Code)." },
  { icon: Terminal, title: "It bootstraps itself", body: "Docker installs, the agent boots, SSL is issued, and it registers with your console." },
  { icon: ArrowRight, title: "Build & deploy", body: "Deploy apps, run agents, watch everything from one command center." },
];

const plans = [
  {
    name: "Spark", price: "R149", period: "/mo", badge: "STARTER", variant: "default" as const, accent: "cyber-cyan",
    border: "border-cyber-cyan/20",
    features: ["1× Small VM (2 vCPU / 8GB / 40GB)", "1 agent runtime (OpenClaw)", "1 site + custom domain + SSL", "Johannesburg or Cape Town", "Community support"],
    cta: "Start free trial",
  },
  {
    name: "Builder", price: "R499", period: "/mo", badge: "POPULAR", variant: "pink" as const, accent: "cyber-pink",
    border: "border-cyber-pink/30", popular: true,
    features: ["1× Medium VM (4 vCPU / 16GB / 80GB)", "Up to 2 agents", "3 sites + domains + SSL", "Kanban agent command center", "ZAR billing · priority support"],
    cta: "Deploy now",
  },
  {
    name: "Scale", price: "R1,499", period: "/mo", badge: "GROWTH", variant: "magenta" as const, accent: "cyber-magenta",
    border: "border-cyber-magenta/30",
    features: ["1× Large VM (8 vCPU / 32GB / 160GB)", "Unlimited agents", "10 sites + dedicated IP", "Usage metering + alerts", "99.9% uptime target"],
    cta: "Deploy now",
  },
  {
    name: "White-label", price: "Custom", period: "", badge: "AGENCY", variant: "orange" as const, accent: "cyber-orange",
    border: "border-cyber-orange/30",
    features: ["Multiple nodes / dedicated hardware", "White-label console for your clients", "POPIA compliance pack", "Reseller billing + markup control", "Dedicated support + SLA"],
    cta: "Talk to us",
  },
];

export default function CloudLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "cloud-landing" }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <main className="relative min-h-screen bg-cyber-black overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-[0.04]" />

      {/* Header */}
      <nav className="relative z-50 border-b border-white/5 bg-cyber-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-orange via-cyber-pink to-cyber-cyan flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-lg font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-orange to-cyber-pink">STUDEX</span>
              <span className="text-cyber-cyan">CLAW</span>
              <span className="text-white"> CLOUD</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/console" className="font-mono text-xs uppercase tracking-wider text-gray-400 hover:text-cyber-cyan transition-colors hidden sm:block">
              Command Center
            </Link>
            <Link href="#pricing">
              <Button size="sm" variant="pink">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge variant="green" className="mb-6">
            <Container className="w-3 h-3 mr-1" /> Linux · Docker · Agents · South Africa
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl font-black text-white leading-tight max-w-4xl mx-auto">
            Your own cloud, with an{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-orange">
              AI agent already inside
            </span>
          </h1>
          <p className="font-mono text-gray-400 max-w-2xl mx-auto mt-6 text-sm md:text-base">
            Rent Linux VMs and containers that come pre-loaded with AI agents. Host apps, websites and
            domains. Watch every VM and every agent from one command center. Billed in Rand, hosted in SA.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link href="#pricing">
              <Button variant="orange" size="lg">Launch a VM <ArrowRight className="w-4 h-4" /></Button>
            </Link>
            <Link href="/console">
              <Button variant="outline" size="lg">See the Command Center</Button>
            </Link>
          </div>
        </motion.div>

        {/* mock terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-14 max-w-2xl mx-auto text-left"
        >
          <Card className="border-white/10">
            <CardContent className="p-4 font-mono text-xs space-y-1">
              <p className="text-gray-500">$ studexcloud launch --agent openclaw --region jnb1</p>
              <p className="text-cyber-green">✓ Allocating compute in Johannesburg (ZA)</p>
              <p className="text-cyber-green">✓ Installing Docker Engine</p>
              <p className="text-cyber-green">✓ Pulling OpenClaw agent runtime</p>
              <p className="text-cyber-green">✓ Agent online — VM ready in 38s</p>
              <p className="text-cyber-cyan">→ https://your-app.studexcloud.africa  (SSL issued)</p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Card className="border-white/10 h-full hover:border-cyber-cyan/30 transition-all">
                <CardContent className="p-6">
                  <f.icon className="w-7 h-7 text-cyber-cyan mb-3" />
                  <h3 className="font-display text-base text-white font-bold mb-2">{f.title}</h3>
                  <p className="font-mono text-xs text-gray-400 leading-relaxed">{f.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-black text-white text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyber-pink/10 border border-cyber-pink/30 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-6 h-6 text-cyber-pink" />
              </div>
              <p className="font-mono text-[10px] text-gray-600 uppercase mb-1">Step {i + 1}</p>
              <h3 className="font-display text-lg text-white font-bold mb-2">{s.title}</h3>
              <p className="font-mono text-xs text-gray-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge variant="orange" className="mb-4">ZAR PRICING · NO LOCK-IN</Badge>
          <h2 className="font-display text-4xl font-black text-white">Simple, Rand-first pricing</h2>
          <p className="font-mono text-gray-400 mt-3 text-sm">LLM usage billed at cost + small markup. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map((plan) => (
            <Card key={plan.name} className={`h-full flex flex-col ${plan.border} ${plan.popular ? "ring-2 ring-cyber-pink/50 shadow-[0_0_40px_rgba(255,45,120,0.15)]" : ""}`}>
              <CardContent className="p-6 flex flex-col flex-1">
                <Badge variant={plan.variant} className="w-fit">{plan.badge}</Badge>
                <h3 className="font-display text-xl text-white font-bold mt-4">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="font-display text-3xl font-black text-white">{plan.price}</span>
                  <span className="font-mono text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 font-mono text-xs text-gray-300">
                      <Check className={`w-3.5 h-3.5 text-${plan.accent} mt-0.5 flex-shrink-0`} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="#waitlist" className="mt-6">
                  <Button variant={plan.popular ? "pink" : "outline"} className="w-full" size="sm">{plan.cta}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Waitlist / signup */}
      <section id="waitlist" className="relative z-10 max-w-2xl mx-auto px-4 py-20 text-center">
        <Lock className="w-8 h-8 text-cyber-cyan mx-auto mb-4" />
        <h2 className="font-display text-3xl font-black text-white">Get early access</h2>
        <p className="font-mono text-gray-400 mt-3 text-sm mb-8">
          We&apos;re onboarding South African builders and agencies first. Drop your email and we&apos;ll set you up.
        </p>
        {submitted ? (
          <Badge variant="green" className="text-sm py-2 px-4">
            <Check className="w-4 h-4 mr-2" /> You&apos;re on the list — we&apos;ll be in touch.
          </Badge>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.co.za" className="flex-1" />
            <Button type="submit" variant="orange">Request access</Button>
          </form>
        )}
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center">
        <p className="font-mono text-xs text-gray-600">
          StudExClaw Cloud · Linux VMs + agents, hosted in South Africa ·{" "}
          <Link href="/console" className="text-cyber-cyan hover:underline">Command Center</Link>
        </p>
      </footer>
    </main>
  );
}
