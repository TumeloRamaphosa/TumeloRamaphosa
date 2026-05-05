"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Cpu, Cloud, Flame } from "lucide-react";

const stacks = [
  {
    title: "OpenClaw",
    subtitle: "NVIDIA Foundation",
    icon: Cpu,
    color: "cyber-green",
    borderColor: "border-cyber-green/30",
    glowColor: "shadow-[0_0_30px_rgba(0,255,136,0.15)]",
    badge: "LAYER 1",
    items: [
      "CUDA Core Acceleration",
      "Omniverse Digital Twins",
      "NIM Microservices",
      "DGX Cloud Foundation",
      "TensorRT Optimization",
    ],
    description: "Jensen's GTC 2026 agentic stack foundation — raw GPU compute and AI model serving at planetary scale.",
  },
  {
    title: "NemoClaw",
    subtitle: "NVIDIA NeMo Orchestration",
    icon: Cloud,
    color: "cyber-cyan",
    borderColor: "border-cyber-cyan/30",
    glowColor: "shadow-[0_0_30px_rgba(0,240,255,0.15)]",
    badge: "LAYER 2",
    items: [
      "NeMo Guardrails",
      "Agent Blueprints",
      "RAG Pipeline Orchestration",
      "Multi-Modal Routing",
      "Enterprise Safety Rails",
    ],
    description: "Orchestration layer with NeMo guardrails, agent blueprints, and enterprise-grade safety for production AI.",
  },
  {
    title: "StudExClaw",
    subtitle: "Tencent + Ralf Wigum Edition",
    icon: Flame,
    color: "cyber-pink",
    borderColor: "border-cyber-pink/30",
    glowColor: "shadow-[0_0_30px_rgba(255,45,120,0.15)]",
    badge: "LAYER 3",
    items: [
      "Tencent Cloud JNB1 Region",
      "Ralf Wigum Loop Engine",
      "BMAD + GSD Orchestration",
      "Central Cognitive Brain RAG",
      "Charlie + Robusca + Naledi Agents",
    ],
    description: "Africa-optimized deployment on Tencent Cloud with persistent cognitive agents and 60-75% cost reduction.",
  },
];

export default function JensenStack() {
  return (
    <section className="relative py-24 px-4 bg-cyber-black overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-10" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="green" className="mb-4">JENSEN HUANG GTC 2026 ARCHITECTURE</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            The Agentic{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green via-cyber-cyan to-cyber-pink">
              Stack Breakdown
            </span>
          </h2>
          <p className="font-mono text-gray-400 max-w-2xl mx-auto">
            From NVIDIA&apos;s foundation to Tencent Cloud deployment — the complete
            StudExClaw agentic architecture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {stacks.map((stack, idx) => (
            <motion.div
              key={stack.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative"
            >
              {idx < 2 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-cyber-cyan animate-pulse" />
                </div>
              )}
              <Card className={`h-full ${stack.borderColor} ${stack.glowColor} hover:scale-[1.02] transition-transform duration-300`}>
                <CardHeader>
                  <Badge
                    variant={idx === 0 ? "green" : idx === 1 ? "default" : "pink"}
                    className="w-fit mb-2"
                  >
                    {stack.badge}
                  </Badge>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-${stack.color}/10 border border-${stack.color}/20`}>
                      <stack.icon className={`w-6 h-6 text-${stack.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{stack.title}</CardTitle>
                      <p className="font-mono text-xs text-gray-500 mt-1">{stack.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-6 font-mono leading-relaxed">
                    {stack.description}
                  </p>
                  <ul className="space-y-3">
                    {stack.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 font-mono text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${stack.color} shadow-[0_0_6px] shadow-${stack.color}`} />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
