"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AGENTS } from "@/lib/agents";
import {
  ArrowLeft,
  Zap,
  Radio,
  Users,
  Cpu,
  GitBranch,
  Scan,
  Rss,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";

interface District {
  id: string;
  name: string;
  zone: string;
  color: string;
  agents: number;
  status: "online" | "idle" | "maintenance";
  description: string;
}

export default function CyberWorld() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const districts: District[] = [
    {
      id: "meat-district",
      name: "MEAT DISTRICT",
      zone: "studexmeat.com",
      color: "from-red-600 to-red-900",
      agents: 5,
      status: "online",
      description: "Prime retail operations center. 24/7 commerce flow.",
    },
    {
      id: "nexus-global",
      name: "NEXUS GLOBAL",
      zone: "studex-group.com",
      color: "from-cyan-600 to-blue-900",
      agents: 4,
      status: "online",
      description: "B2B partnerships & international trade hub.",
    },
    {
      id: "rahura-labs",
      name: "RAHURA LABS",
      zone: "rahura.app",
      color: "from-purple-600 to-pink-900",
      agents: 3,
      status: "idle",
      description: "Fitness & wellness neural network.",
    },
    {
      id: "content-forge",
      name: "CONTENT FORGE",
      zone: "content.studex.dev",
      color: "from-amber-600 to-orange-900",
      agents: 2,
      status: "online",
      description: "AI media generation & creative synthesis.",
    },
    {
      id: "mail-nexus",
      name: "MAIL NEXUS",
      zone: "mail.studex.cloud",
      color: "from-lime-600 to-green-900",
      agents: 2,
      status: "online",
      description: "Distributed communication layer.",
    },
    {
      id: "analytics-core",
      name: "ANALYTICS CORE",
      zone: "analytics.studex.dev",
      color: "from-orange-600 to-red-900",
      agents: 2,
      status: "maintenance",
      description: "Real-time data synthesis & insights.",
    },
    {
      id: "payment-nexus",
      name: "PAYMENT NEXUS",
      zone: "payments.studex.cloud",
      color: "from-blue-600 to-indigo-900",
      agents: 2,
      status: "online",
      description: "Financial transaction hub.",
    },
    {
      id: "inventory-grid",
      name: "INVENTORY GRID",
      zone: "inventory.studex.dev",
      color: "from-pink-600 to-rose-900",
      agents: 2,
      status: "online",
      description: "Warehouse automation network.",
    },
    {
      id: "support-channel",
      name: "SUPPORT CHANNEL",
      zone: "support.studex.dev",
      color: "from-green-600 to-emerald-900",
      agents: 2,
      status: "idle",
      description: "Customer service neural interface.",
    },
    {
      id: "war-room",
      name: "WAR ROOM",
      zone: "war-room.studex.dev",
      color: "from-cyan-500 to-cyan-900",
      agents: 3,
      status: "online",
      description: "Mission control & central intelligence.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollLeft);
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [soundEnabled]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
      </div>

      {/* Header */}
      <header className="relative z-40 border-b border-cyan-500/30 bg-black/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit World
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                <h1 className="font-mono text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-red-500">
                  STUDEX.CYBER
                </h1>
              </div>
              <span className="font-mono text-xs text-gray-500">v2077.07.16</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-mono">
              <Zap className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Audio Background */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
        loop
      />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full opacity-20 blur-3xl animate-pulse" />
          <div className="absolute w-64 h-64 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-10 blur-3xl animate-pulse" />
        </div>

        <div className="relative z-20 text-center space-y-8 max-w-3xl">
          <div className="space-y-4">
            <h1 className="font-mono text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-red-500 leading-tight">
              DARK FACTORY
            </h1>
            <p className="font-mono text-xl text-cyan-300 tracking-widest">
              // DISTRIBUTED NEURAL OPERATING SYSTEM
            </p>
          </div>

          <div className="space-y-2 text-gray-400 font-mono text-sm">
            <p>» 15 AUTONOMOUS AGENTS</p>
            <p>» 10 ACTIVE DISTRICTS</p>
            <p>» 99.97% UPTIME</p>
            <p>» REAL-TIME COORDINATION</p>
          </div>

          <div className="flex justify-center gap-4 pt-8">
            <Link href="/dark-factory">
              <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 font-mono">
                <Cpu className="w-4 h-4 mr-2" />
                ENTER MISSION CONTROL
              </Button>
            </Link>
            <button
              onClick={() => {
                containerRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-2 border border-cyan-400 hover:border-pink-400 hover:bg-pink-500/10 rounded-lg font-mono transition-all"
            >
              SCAN DISTRICTS <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Districts Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-mono text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              NEURAL DISTRICTS
            </h2>
            <p className="text-gray-500 font-mono text-sm">
              // 10 OPERATIONAL ZONES ACROSS THE NETWORK
            </p>
          </div>

          {/* Horizontal Scroll Districts */}
          <div
            ref={containerRef}
            className="overflow-x-auto pb-6 scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex gap-6 px-4 min-w-max">
              {districts.map((district, idx) => (
                <div
                  key={district.id}
                  onClick={() => setSelectedDistrict(district.id)}
                  className="group cursor-pointer transition-all"
                >
                  <Card className="w-96 bg-black/40 border-2 border-transparent hover:border-cyan-400/50 group-hover:bg-black/60 overflow-hidden transition-all">
                    {/* District Banner */}
                    <div
                      className={`h-32 bg-gradient-to-br ${district.color} relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                        {/* Animated scan lines */}
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage:
                            "repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.1) 0px, rgba(0, 255, 255, 0.1) 1px, transparent 1px, transparent 2px)",
                        }} />
                      </div>
                      <div className="absolute inset-0 flex items-end p-4">
                        <div>
                          <h3 className="font-mono font-black text-white text-lg">
                            {district.name}
                          </h3>
                          <p className="font-mono text-xs text-gray-300">{district.zone}</p>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-4">
                      {/* Status Indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full animate-pulse ${
                              district.status === "online"
                                ? "bg-green-400"
                                : district.status === "maintenance"
                                ? "bg-yellow-400"
                                : "bg-gray-600"
                            }`}
                          />
                          <span className="font-mono text-xs text-gray-400">
                            {district.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-cyan-400">
                          {district.agents} AGENTS
                        </span>
                      </div>

                      {/* Description */}
                      <p className="font-mono text-xs text-gray-400 leading-relaxed">
                        {district.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700/50">
                        <div className="text-center">
                          <p className="font-mono text-xl font-black text-cyan-400">
                            {district.agents}
                          </p>
                          <p className="font-mono text-[10px] text-gray-600">NODES</p>
                        </div>
                        <div className="text-center">
                          <p className="font-mono text-xl font-black text-pink-400">
                            {Math.floor(Math.random() * 50 + 30)}
                          </p>
                          <p className="font-mono text-[10px] text-gray-600">LOAD</p>
                        </div>
                        <div className="text-center">
                          <p className="font-mono text-xl font-black text-green-400">
                            {Math.floor(Math.random() * 40 + 60)}
                          </p>
                          <p className="font-mono text-[10px] text-gray-600">UPTIME</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-mono text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
              NEURAL AGENTS (15)
            </h2>
            <p className="text-gray-500 font-mono text-sm">
              // AUTONOMOUS INTELLIGENCES OPERATING IN PARALLEL
            </p>
          </div>

          {/* Agent Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {AGENTS.map((agent, idx) => (
              <div
                key={agent.id}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all" />
                <Card className="bg-black/60 border border-gray-700 hover:border-cyan-400/50 group-hover:border-cyan-400 transition-all">
                  <CardContent className="p-4 space-y-3">
                    {/* Agent Avatar */}
                    <div className="flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-white text-lg group-hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: agent.avatar_color + "40",
                          borderColor: agent.avatar_color,
                          borderWidth: 2,
                        }}
                      >
                        {agent.name[0]}
                      </div>
                    </div>

                    {/* Agent Info */}
                    <div className="text-center space-y-2">
                      <p className="font-mono font-bold text-white text-sm">
                        {agent.name}
                      </p>
                      <p className="font-mono text-[10px] text-gray-500">
                        {agent.codename}
                      </p>
                      <p className="font-mono text-[10px] text-gray-600 line-clamp-2">
                        {agent.role}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          agent.status === "online"
                            ? "bg-green-400"
                            : agent.status === "processing"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                      />
                      <span className="font-mono text-[10px] text-gray-500">
                        {agent.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Task Count */}
                    <div className="pt-2 border-t border-gray-700/50 text-center">
                      <p className="font-mono text-xs text-cyan-400">
                        {agent.tasks_completed} TASKS
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "ACTIVE AGENTS", value: "15/15", color: "text-green-400" },
              { label: "DISTRICTS ONLINE", value: "10/10", color: "text-cyan-400" },
              { label: "UPTIME", value: "99.97%", color: "text-blue-400" },
              { label: "LATENCY", value: "47ms", color: "text-pink-400" },
            ].map((stat, i) => (
              <Card key={i} className="bg-black/60 border border-gray-700 hover:border-cyan-400/50 transition-all">
                <CardContent className="p-6 text-center space-y-2">
                  <p className={`font-mono text-2xl font-black ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="font-mono text-xs text-gray-500 uppercase">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/30 bg-black/80 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-500 font-mono text-sm">
            <Scan className="w-4 h-4" />
            <span>SYSTEM STATUS: ALL NETWORKS OPERATIONAL</span>
            <Zap className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-gray-600 font-mono text-xs">
            © 2077 STUDEX CYBER NETWORKS. ALL SYSTEMS GO.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dark-factory">
              <Button variant="outline" size="sm" className="border-cyan-400/30 text-cyan-400 hover:text-cyan-300">
                MISSION CONTROL
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-cyan-400/30 text-cyan-400 hover:text-cyan-300">
                DASHBOARD
              </Button>
            </Link>
          </div>
        </div>
      </footer>

      {/* Glitch Effects */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes scan-line {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes glitch {
          0% {
            clip-path: inset(40% 0 61% 0);
            transform: translate(-2px, -2px);
          }
          20% {
            clip-path: inset(92% 0 1% 0);
            transform: translate(2px, 2px);
          }
          40% {
            clip-path: inset(43% 0 1% 0);
            transform: translate(-2px, 2px);
          }
          60% {
            clip-path: inset(25% 0 58% 0);
            transform: translate(2px, -2px);
          }
          80% {
            clip-path: inset(54% 0 7% 0);
            transform: translate(-2px, -2px);
          }
          100% {
            clip-path: inset(58% 0 43% 0);
            transform: translate(2px, 2px);
          }
        }
      `}</style>
    </div>
  );
}
