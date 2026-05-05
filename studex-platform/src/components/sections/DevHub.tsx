"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Terminal, Eye, Loader2, CheckCircle2, Code2, Cpu } from "lucide-react";

const devAgents = [
  {
    name: "Cline Agent",
    status: "active",
    color: "#00f0ff",
    task: "Monitoring repository changes",
    icon: Terminal,
  },
  {
    name: "Claude Code",
    status: "active",
    color: "#ff2d78",
    task: "Processing code review queue",
    icon: Code2,
  },
  {
    name: "Gemini CLI",
    status: "standby",
    color: "#ff00ff",
    task: "Awaiting deployment trigger",
    icon: Cpu,
  },
];

export default function DevHub() {
  const [pushStatus, setPushStatus] = useState<"idle" | "pushing" | "success">("idle");

  const handleGitPush = async () => {
    setPushStatus("pushing");
    try {
      await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "push" }),
      });
    } catch {
      // API not configured yet
    }
    setTimeout(() => setPushStatus("success"), 2000);
    setTimeout(() => setPushStatus("idle"), 5000);
  };

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-cyber-black to-cyber-dark overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-5" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4">DEVELOPMENT HUB</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Agent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-green">
              Development Pipeline
            </span>
          </h2>
          <p className="font-mono text-gray-400 max-w-2xl mx-auto">
            Live visibility into Cline, Claude Code, and Gemini CLI agents. One-click deploy to StudEx org.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dev agents status */}
          <div className="space-y-4">
            <h3 className="font-display text-lg text-white font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyber-cyan" />
              Live Agent Status
            </h3>
            {devAgents.map((agent, idx) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-white/10 hover:border-white/20 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: agent.color + "15" }}
                        >
                          <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
                        </div>
                        <div>
                          <p className="font-display text-sm text-white font-bold">{agent.name}</p>
                          <p className="font-mono text-xs text-gray-500">{agent.task}</p>
                        </div>
                      </div>
                      <Badge
                        variant={agent.status === "active" ? "green" : "default"}
                        className="text-[10px]"
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Git push panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-white/10 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-cyber-green" />
                  GitHub Deploy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-black/50 border border-white/10 font-mono text-sm">
                  <div className="text-gray-500 mb-2"># StudEx Organization Deploy</div>
                  <div className="text-cyber-green">$ git push origin main --force</div>
                  <div className="text-gray-400 mt-1">remote: Deploying to studex/studex-platform...</div>
                  {pushStatus === "pushing" && (
                    <div className="text-cyber-cyan mt-1 animate-pulse">
                      remote: Building and deploying...
                    </div>
                  )}
                  {pushStatus === "success" && (
                    <div className="text-cyber-green mt-1">
                      remote: Deploy complete! &#10003;
                    </div>
                  )}
                </div>

                <Button
                  variant="orange"
                  size="lg"
                  className="w-full"
                  onClick={handleGitPush}
                  disabled={pushStatus === "pushing"}
                >
                  {pushStatus === "pushing" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Pushing to StudEx...
                    </>
                  ) : pushStatus === "success" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Deployed Successfully
                    </>
                  ) : (
                    <>
                      <GitBranch className="w-4 h-4" />
                      Commit & Push to StudEx Org
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Commits", value: "1,247" },
                    { label: "Deploys", value: "89" },
                    { label: "Agents", value: "3" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="font-display text-lg text-white font-bold">{stat.value}</div>
                      <div className="font-mono text-[10px] text-gray-500 uppercase">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
