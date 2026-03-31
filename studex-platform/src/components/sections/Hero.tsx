"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Rocket, Zap, Globe } from "lucide-react";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-cyber-black via-cyber-dark to-cyber-black" />
  ),
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cyber-black">
      <HeroScene />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-30 z-[1]" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyber-black z-[2]" />
      <div className="absolute inset-0 bg-gradient-radial from-cyber-pink/5 via-transparent to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="pink" className="mb-6 text-xs">
            <Zap className="w-3 h-3 mr-1" />
            POWERED BY TENCENT CLOUD + NVIDIA + VERTEX AI
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-orange via-cyber-pink to-cyber-magenta">
            STUDEX
          </span>
          <span className="text-cyber-cyan">CLAW</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-lg md:text-xl text-cyber-cyan/80 tracking-[0.3em] mb-2 uppercase"
        >
          Tencent Powered StudExClaw
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-display text-base md:text-lg text-cyber-pink tracking-[0.2em] mb-8 uppercase"
        >
          Agentic Force for Africa &bull; 60-75% Lower TCO
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The unified cognitive brain platform merging cyberpunk-grade AI agents,
          Central RAG intelligence, and Tencent Cloud infrastructure.
          Three persistent agents. One unstoppable force.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="orange" size="xl" className="group">
            <Rocket className="w-5 h-5 group-hover:animate-bounce" />
            DEPLOY STUDEXCLAW ON TENCENT NOW
          </Button>
          <Button variant="outline" size="xl">
            <Globe className="w-5 h-5" />
            ENTER THE BRAIN
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { label: "Active Agents", value: "3" },
            { label: "RAG Vectors", value: "2.4M+" },
            { label: "Uptime", value: "99.97%" },
            { label: "Cost Savings", value: "60-75%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-black text-cyber-cyan">
                {stat.value}
              </div>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.1)_2px,rgba(0,240,255,0.1)_4px)]" />
    </section>
  );
}
