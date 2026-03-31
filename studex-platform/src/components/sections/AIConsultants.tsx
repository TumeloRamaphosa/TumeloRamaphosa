"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AGENTS } from "@/lib/agents";
import { Send, Video, Bot, User } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  agent?: string;
}

export default function AIConsultants() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hey! I'm ${AGENTS[0].name}, your ${AGENTS[0].role} consultant. How can I help you today?`,
      agent: AGENTS[0].name,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectAgent = (agent: typeof AGENTS[0]) => {
    setSelectedAgent(agent);
    setMessages([
      {
        role: "assistant",
        content: `Hey! I'm ${agent.name}, your ${agent.role} consultant. How can I help you today?`,
        agent: agent.name,
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          agent: selectedAgent.name.toLowerCase(),
          history: messages.slice(-10),
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, agent: selectedAgent.name },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection to Vertex AI is being established. Please configure your API credentials to enable live responses.",
          agent: selectedAgent.name,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-24 px-4 bg-cyber-black overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-10" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="magenta" className="mb-4">AI CONSULTANTS</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Talk to the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-magenta to-cyber-cyan">
              Brain
            </span>
          </h2>
          <p className="font-mono text-gray-400 max-w-2xl mx-auto">
            Real-time AI consultants powered by Central RAG + Vertex AI. Choose your agent and start building.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent selector */}
          <div className="space-y-4">
            {AGENTS.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => handleSelectAgent(agent)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    selectedAgent.id === agent.id
                      ? "border-cyber-cyan/50 bg-cyber-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                      : "border-white/10 bg-cyber-dark/50 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-sm"
                      style={{ backgroundColor: agent.avatar_color + "33", borderColor: agent.avatar_color, borderWidth: 2 }}
                    >
                      {agent.name[0]}
                    </div>
                    <div>
                      <p className="font-display text-sm text-white font-bold">{agent.name}</p>
                      <p className="font-mono text-xs text-gray-500">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        agent.status === "online"
                          ? "bg-cyber-green"
                          : agent.status === "processing"
                          ? "bg-cyber-yellow animate-pulse"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="font-mono text-xs text-gray-400 uppercase">{agent.status}</span>
                  </div>
                </button>
              </motion.div>
            ))}

            <Button variant="magenta" className="w-full" size="lg">
              <Video className="w-4 h-4" />
              Start Google Meet
            </Button>
          </div>

          {/* Chat area */}
          <Card className="lg:col-span-3 border-white/10 flex flex-col h-[500px]">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm font-bold"
                    style={{ backgroundColor: selectedAgent.avatar_color + "33", color: selectedAgent.avatar_color }}
                  >
                    {selectedAgent.name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-base">{selectedAgent.name}</CardTitle>
                    <p className="font-mono text-xs text-gray-500">{selectedAgent.codename}</p>
                  </div>
                </div>
                <Badge variant="green" className="text-[10px]">
                  RAG CONNECTED
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-cyber-pink/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-cyber-pink" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-xl font-mono text-sm ${
                      msg.role === "user"
                        ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/20"
                        : "bg-white/5 text-gray-300 border border-white/10"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-cyber-cyan/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-cyber-cyan" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyber-pink/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-cyber-pink animate-pulse" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-cyber-pink animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-cyber-pink animate-bounce [animation-delay:0.1s]" />
                      <div className="w-2 h-2 rounded-full bg-cyber-pink animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-3"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${selectedAgent.name} anything...`}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
