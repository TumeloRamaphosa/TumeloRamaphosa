"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AGENTS } from "@/lib/agents";
import {
  Brain,
  Rocket,
  ArrowLeft,
  Activity,
  Send,
  Bot,
  User,
  Monitor,
  Laptop,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Database,
  Shield,
} from "lucide-react";

interface RocketStep {
  step: string;
  status: string;
  time: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function BrainDashboard() {
  const [rocketTarget, setRocketTarget] = useState<string | null>(null);
  const [rocketStatus, setRocketStatus] = useState<"idle" | "launching" | "launched">("idle");
  const [rocketSteps, setRocketSteps] = useState<RocketStep[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Central Cognitive Brain online. I have access to all agent knowledge, conversation history, and RAG vectors. Ask me anything.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const launchRocket = async (target: string) => {
    setRocketTarget(target);
    setRocketStatus("launching");
    setRocketSteps([]);

    try {
      const res = await fetch("/api/rocket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();

      // Animate steps one by one
      for (let i = 0; i < data.steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setRocketSteps((prev) => [...prev, data.steps[i]]);
      }
      setRocketStatus("launched");
    } catch {
      setRocketStatus("idle");
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatInput,
          agent: "charlie",
          history: chatMessages.slice(-10),
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Brain connection temporarily unavailable. Please configure Supabase and Vertex AI credentials." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-cyber-dark/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyber-pink" />
              <h1 className="font-display text-lg font-black text-white">
                Central Cognitive Brain
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="green" className="animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              SYSTEM ONLINE
            </Badge>
            <Badge variant="default">
              <Shield className="w-3 h-3 mr-1" />
              PROTECTED
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Agent Status Grid */}
        <section>
          <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyber-cyan" />
            Agent Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AGENTS.map((agent) => (
              <Card key={agent.id} className="border-white/10 hover:border-white/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-lg font-black"
                        style={{
                          backgroundColor: agent.avatar_color + "20",
                          color: agent.avatar_color,
                          borderWidth: 2,
                          borderColor: agent.avatar_color + "40",
                        }}
                      >
                        {agent.name[0]}
                      </div>
                      <div>
                        <p className="font-display text-base text-white font-bold">{agent.name}</p>
                        <p className="font-mono text-xs text-gray-500">{agent.codename}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        agent.status === "online"
                          ? "green"
                          : agent.status === "processing"
                          ? "orange"
                          : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {agent.status}
                    </Badge>
                  </div>

                  <p className="font-mono text-xs text-gray-400 mb-3">{agent.role}</p>

                  {agent.current_task && (
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 mb-3">
                      <p className="font-mono text-xs text-gray-300">
                        <span className="text-cyber-cyan">TASK:</span> {agent.current_task}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between text-center">
                    <div>
                      <p className="font-display text-lg text-white font-bold">{agent.tasks_completed}</p>
                      <p className="font-mono text-[10px] text-gray-600 uppercase">Tasks Done</p>
                    </div>
                    <div>
                      <p className="font-display text-lg text-cyber-green font-bold">99.9%</p>
                      <p className="font-mono text-[10px] text-gray-600 uppercase">Uptime</p>
                    </div>
                    <div>
                      <p className="font-display text-lg text-cyber-cyan font-bold">
                        {Math.floor(Math.random() * 50 + 10)}ms
                      </p>
                      <p className="font-mono text-[10px] text-gray-600 uppercase">Latency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rocket Launcher */}
          <section>
            <Card className="border-white/10 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyber-orange">
                  <Rocket className="w-5 h-5" />
                  ROCKET LAUNCHER
                </CardTitle>
                <p className="font-mono text-xs text-gray-500">
                  Trigger hardware scripts on remote machines
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => launchRocket("windows-2gpu")}
                    disabled={rocketStatus === "launching"}
                    className="p-4 rounded-xl border border-cyber-orange/20 bg-cyber-orange/5 hover:bg-cyber-orange/10 transition-all text-left"
                  >
                    <Monitor className="w-6 h-6 text-cyber-orange mb-2" />
                    <p className="font-display text-sm text-white font-bold">Windows 2-GPU</p>
                    <p className="font-mono text-[10px] text-gray-500">2x RTX 4090</p>
                  </button>
                  <button
                    onClick={() => launchRocket("mac-mini")}
                    disabled={rocketStatus === "launching"}
                    className="p-4 rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/5 hover:bg-cyber-cyan/10 transition-all text-left"
                  >
                    <Laptop className="w-6 h-6 text-cyber-cyan mb-2" />
                    <p className="font-display text-sm text-white font-bold">Mac Mini M4</p>
                    <p className="font-mono text-[10px] text-gray-500">M4 Pro Neural Engine</p>
                  </button>
                </div>

                {/* Launch sequence */}
                {(rocketStatus === "launching" || rocketStatus === "launched") && (
                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      {rocketStatus === "launching" ? (
                        <Loader2 className="w-4 h-4 text-cyber-orange animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                      )}
                      <span className="font-mono text-sm text-white">
                        {rocketTarget === "windows-2gpu" ? "Windows 2-GPU" : "Mac Mini M4"}
                      </span>
                    </div>

                    {rocketSteps.map((step, i) => (
                      <div key={i} className="flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyber-green" />
                          <span className="text-gray-300">{step.step}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{step.status}</span>
                          <span className="text-cyber-cyan">{step.time}</span>
                        </div>
                      </div>
                    ))}

                    {rocketStatus === "launching" && (
                      <div className="flex items-center gap-2 font-mono text-xs text-cyber-orange animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        Launching...
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* RAG Query Interface */}
          <section>
            <Card className="border-white/10 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyber-cyan">
                  <Database className="w-5 h-5" />
                  Central RAG Query
                </CardTitle>
                <p className="font-mono text-xs text-gray-500">
                  Chat with the brain — Supabase pgvector + Vertex AI
                </p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[300px]">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-cyber-pink/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-cyber-pink" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] p-2.5 rounded-lg font-mono text-xs ${
                          msg.role === "user"
                            ? "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20"
                            : "bg-white/5 text-gray-300 border border-white/10"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-6 h-6 rounded-full bg-cyber-cyan/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 text-cyber-cyan" />
                        </div>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-cyber-pink/20 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-cyber-pink animate-pulse" />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyber-pink animate-bounce" />
                          <div className="w-1.5 h-1.5 rounded-full bg-cyber-pink animate-bounce [animation-delay:0.1s]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-cyber-pink animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChat();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Query the cognitive brain..."
                    className="flex-1 text-xs"
                  />
                  <Button type="submit" size="sm" disabled={chatLoading || !chatInput.trim()}>
                    <Send className="w-3 h-3" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* System metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "RAG Vectors", value: "2.4M+", color: "text-cyber-cyan", icon: Database },
            { label: "Agent Uptime", value: "99.97%", color: "text-cyber-green", icon: Activity },
            { label: "Avg Response", value: "47ms", color: "text-cyber-orange", icon: Zap },
            { label: "Brain Status", value: "ACTIVE", color: "text-cyber-pink", icon: Brain },
          ].map((metric) => (
            <Card key={metric.label} className="border-white/10">
              <CardContent className="p-4 text-center">
                <metric.icon className={`w-5 h-5 ${metric.color} mx-auto mb-2`} />
                <p className={`font-display text-2xl font-black ${metric.color}`}>{metric.value}</p>
                <p className="font-mono text-[10px] text-gray-500 uppercase mt-1">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
