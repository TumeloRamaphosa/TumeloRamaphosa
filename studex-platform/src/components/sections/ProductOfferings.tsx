"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Building2 } from "lucide-react";

const plans = [
  {
    name: "General Day-to-Day",
    price: "R1,550",
    period: "/pm",
    icon: Sparkles,
    badge: "STARTER",
    badgeVariant: "default" as const,
    color: "cyber-cyan",
    borderClass: "border-cyber-cyan/20",
    description: "AI-powered daily operations for small teams and solo entrepreneurs.",
    features: [
      "3 AI agent sessions/day",
      "Basic RAG knowledge base",
      "Email & chat support",
      "Tencent Cloud basic tier",
      "Single workspace",
      "5GB vector storage",
    ],
    tcoSaving: "60% lower than AWS equivalent",
    cta: "Start Building",
  },
  {
    name: "Creator Stack",
    price: "R3,500",
    period: "/pm",
    icon: Crown,
    badge: "POPULAR",
    badgeVariant: "pink" as const,
    color: "cyber-pink",
    borderClass: "border-cyber-pink/30",
    popular: true,
    description: "Full creative + development stack with persistent agents and advanced RAG.",
    features: [
      "Unlimited agent sessions",
      "Charlie + Naledi agents",
      "Advanced RAG with pgvector",
      "YouTube R&D integration",
      "NotebookLM summaries",
      "25GB vector storage",
      "Priority support",
      "Google Meet AI sessions",
    ],
    tcoSaving: "68% lower than Azure equivalent",
    cta: "Deploy Now",
  },
  {
    name: "Enterprise Agent Force",
    price: "R15k–R55k",
    period: "/pm",
    icon: Building2,
    badge: "ENTERPRISE",
    badgeVariant: "magenta" as const,
    color: "cyber-magenta",
    borderClass: "border-cyber-magenta/30",
    description: "Full cognitive brain with all 3 agents, custom deployments, and dedicated Tencent infrastructure.",
    features: [
      "All 3 persistent agents",
      "Central Cognitive Brain access",
      "Rocket Launcher (hardware control)",
      "Custom Vertex AI models",
      "Dedicated Tencent Cloud region",
      "Unlimited vector storage",
      "24/7 dedicated support",
      "BMAD + GSD orchestration",
      "White-label deployment",
      "SLA 99.99% uptime",
    ],
    tcoSaving: "75% lower than hyperscaler equivalent",
    cta: "Contact Sales",
  },
];

export default function ProductOfferings() {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-cyber-black via-cyber-dark to-cyber-black overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-5" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="orange" className="mb-4">TENCENT CLOUD PRICING</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-orange to-cyber-pink">
              Agent Force
            </span>
          </h2>
          <p className="font-mono text-gray-400 max-w-2xl mx-auto">
            Africa-optimized pricing with Tencent Cloud. 60-75% lower TCO than traditional hyperscalers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
              <Card
                className={`h-full flex flex-col ${plan.borderClass} ${
                  plan.popular
                    ? "ring-2 ring-cyber-pink/50 shadow-[0_0_40px_rgba(255,45,120,0.2)]"
                    : ""
                } hover:scale-[1.02] transition-transform duration-300`}
              >
                <CardHeader>
                  <Badge variant={plan.badgeVariant} className="w-fit">
                    {plan.badge}
                  </Badge>
                  <div className="flex items-center gap-3 mt-3">
                    <plan.icon className={`w-8 h-8 text-${plan.color}`} />
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  <div className="mt-4">
                    <span className="font-display text-4xl font-black text-white">{plan.price}</span>
                    <span className="font-mono text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="font-mono text-sm text-gray-400 mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 font-mono text-sm">
                        <Check className={`w-4 h-4 text-${plan.color} mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 p-3 rounded-lg bg-cyber-green/5 border border-cyber-green/20">
                    <p className="font-mono text-xs text-cyber-green flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      {plan.tcoSaving}
                    </p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    variant={plan.popular ? "pink" : "outline"}
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
