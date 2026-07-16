"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AGENTS } from "@/lib/agents";
import { TaskStream } from "@/components/dark-factory/task-stream";
import { AgentStatusGrid } from "@/components/dark-factory/agent-status-grid";
import { MeetingRoomDetail } from "@/components/dark-factory/meeting-room-detail";
import {
  DEFAULT_ENVIRONMENTS,
  DEFAULT_PRESENTATIONS,
  DEFAULT_MEETING_ROOMS,
  DEFAULT_TASKS,
  type Environment,
  type Presentation,
  type MeetingRoom,
} from "@/lib/dark-factory-config";
import {
  ArrowLeft,
  Activity,
  Factory,
  Users,
  Monitor,
  BarChart3,
  Zap,
  Home,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Terminal,
  Share2,
  Video,
  MessageSquare,
  Settings,
} from "lucide-react";


export default function DarkFactory() {
  const [view, setView] = useState<"boardroom" | "factory" | "environments" | "terminal">("boardroom");
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [selectedMeetingRoom, setSelectedMeetingRoom] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [expandTerminal, setExpandTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "$ dark-factory --init",
    "Initializing Dark Factory Operating System...",
    "[✓] Notion sync: Connected",
    "[✓] Agent Mail: Ready",
    "[✓] Tailscale: Online",
    "[✓] All VMs: Accessible",
    "System ready for presentations.",
  ]);

  const environmentList = DEFAULT_ENVIRONMENTS;
  const presentationList = DEFAULT_PRESENTATIONS;
  const meetingRoomList = DEFAULT_MEETING_ROOMS;
  const taskList = DEFAULT_TASKS;

  const handleTerminalCommand = (command: string) => {
    setTerminalOutput((prev) => [...prev, `$ ${command}`]);
    if (command === "status") {
      setTerminalOutput((prev) => [
        ...prev,
        "System Status Report",
        "─────────────────────",
        "Uptime: 99.97%",
        "Agents Active: 12/15",
        "Notion Sync: OK",
        "All VMs: Online",
      ]);
    } else if (command === "agents") {
      setTerminalOutput((prev) => [
        ...prev,
        "Active Agents:",
        "Naledi (Content CMO): presenting",
        "Charlie (Operations): waiting",
        "OpenCode (Systems): monitoring",
        "Robusca (Chief of Staff): coordinating",
        "Tumelo (Agent Lord): listening",
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Factory className="w-6 h-6 text-amber-400" />
              <h1 className="font-bold text-lg text-white">Dark Factory</h1>
              <span className="font-mono text-xs text-gray-500">Distributed Agent Operating System</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-green-500/30 text-green-400 animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
              <Users className="w-3 h-3 mr-1" />
              12/15 AGENTS
            </Badge>
          </div>
        </div>
      </header>

      {/* View Tabs */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-full mx-auto px-4">
          <div className="flex gap-2 h-12 items-center">
            <button
              onClick={() => { setView("boardroom"); setSelectedEnvironment(null); }}
              className={`px-4 py-2 font-mono text-sm transition-all ${
                view === "boardroom"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              <Video className="w-4 h-4 inline mr-2" />
              Boardroom
            </button>
            <button
              onClick={() => { setView("factory"); setSelectedEnvironment(null); }}
              className={`px-4 py-2 font-mono text-sm transition-all ${
                view === "factory"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              <Factory className="w-4 h-4 inline mr-2" />
              Factory Ops
            </button>
            <button
              onClick={() => { setView("environments"); setSelectedEnvironment(null); }}
              className={`px-4 py-2 font-mono text-sm transition-all ${
                view === "environments"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Environments
            </button>
            <button
              onClick={() => setView("terminal")}
              className={`px-4 py-2 font-mono text-sm transition-all ml-auto ${
                view === "terminal"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              <Terminal className="w-4 h-4 inline mr-2" />
              Terminal
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-full mx-auto px-4 py-8">
        {/* BOARDROOM VIEW */}
        {view === "boardroom" && (
          <div className="space-y-8">
            {/* Live Presentation Area */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Stage */}
              <div className="lg:col-span-2">
                <Card className="border-amber-500/20 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
                  <CardHeader className="border-b border-amber-500/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-amber-400 flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        Live Presentation
                      </CardTitle>
                      <Badge className="bg-red-500/20 text-red-400 animate-pulse">LIVE</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Stage Display */}
                    <div className="aspect-video bg-gradient-to-br from-slate-800 via-slate-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Grid Background */}
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "linear-gradient(0deg, transparent 24%, rgba(255,193,7,.15) 25%, rgba(255,193,7,.15) 26%, transparent 27%, transparent 74%, rgba(255,193,7,.15) 75%, rgba(255,193,7,.15) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,193,7,.15) 25%, rgba(255,193,7,.15) 26%, transparent 27%, transparent 74%, rgba(255,193,7,.15) 75%, rgba(255,193,7,.15) 76%, transparent 77%, transparent)",
                          backgroundSize: "50px 50px",
                        }}
                      />

                      {/* Agent Avatar - Currently Presenting */}
                      <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center font-bold text-4xl text-white shadow-2xl border-2 border-amber-400">
                          N
                        </div>
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-white mb-2">Naledi</h2>
                          <p className="text-amber-400 font-mono text-sm mb-4">CONTENT CMO · Presenting</p>
                          <div className="flex gap-2 justify-center mb-4">
                            <Badge className="bg-green-500/20 text-green-400">Yesterday Metrics</Badge>
                            <Badge className="bg-blue-500/20 text-blue-400">0:02 / 4:00</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Slide Content */}
                      <div className="absolute bottom-8 left-8 right-8 text-white">
                        <h3 className="text-lg font-mono text-amber-400 mb-2">Yesterday's Results</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-gray-400 font-mono text-xs">Reach</p>
                            <p className="text-xl font-bold text-green-400">47.3K ↑8%</p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-gray-400 font-mono text-xs">Engagement</p>
                            <p className="text-xl font-bold text-blue-400">2,138 ↑12%</p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-gray-400 font-mono text-xs">New Followers</p>
                            <p className="text-xl font-bold text-purple-400">+342</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="border-t border-white/10 p-4 bg-slate-900/50 flex gap-2 justify-center">
                      <Button size="sm" variant="outline">
                        <ChevronRight className="w-4 h-4 mr-1" />
                        Next Slide
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Questions
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Presentation Queue */}
              <div className="space-y-4">
                <Card className="border-white/10">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Queue (9:00 AM - 10:00 AM)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {presentationList.map((pres, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border transition-all ${
                          pres.status === "presenting"
                            ? "bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20"
                            : pres.status === "completed"
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-slate-800/50 border-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <p className="font-mono text-sm font-bold text-white">{pres.agentName}</p>
                            <p className="text-xs text-gray-500">{pres.startTime} · {pres.duration}m</p>
                          </div>
                          {pres.status === "presenting" && (
                            <Badge className="bg-red-500/20 text-red-400 text-[10px]">LIVE</Badge>
                          )}
                          {pres.status === "completed" && (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {pres.slides.map((slide, j) => (
                            <span key={j} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400">
                              {slide}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Agent Roster */}
            <section>
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Agent Roster (15 Total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* Core Agents */}
                    {AGENTS.map((agent) => (
                      <div key={agent.id} className="group">
                        <div className="p-3 rounded-lg border border-white/10 hover:border-white/20 transition-all hover:bg-white/5 cursor-pointer">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white mb-2 group-hover:scale-110 transition-transform"
                            style={{
                              backgroundColor: agent.avatar_color + "40",
                              borderColor: agent.avatar_color,
                              borderWidth: 2,
                            }}
                          >
                            {agent.name[0]}
                          </div>
                          <p className="font-mono text-xs font-bold text-white">{agent.name}</p>
                          <p className="text-[10px] text-gray-500">{agent.role}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                agent.status === "online"
                                  ? "bg-green-400"
                                  : agent.status === "processing"
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                              }`}
                            />
                            <span className="text-[10px] text-gray-500">{agent.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Placeholder for additional agents */}
                    {[...Array(12 - AGENTS.length)].map((_, i) => (
                      <div key={`placeholder-${i}`} className="p-3 rounded-lg border border-dashed border-white/20 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-600 mb-1">+</p>
                          <p className="text-[10px] text-gray-600">Agent</p>
                          <p className="text-[10px] text-gray-700">Connect</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Meeting Rooms */}
            <section>
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-pink-400" />
                    Scheduled Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {meetingRoomList.map((room) => (
                      <div key={room.id} className="p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all hover:bg-white/5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className="font-mono text-sm font-bold text-white">{room.name}</h3>
                            <p className="text-xs text-gray-500">{room.startTime}</p>
                          </div>
                          <Badge
                            className={
                              room.status === "live"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-blue-500/20 text-blue-400"
                            }
                          >
                            {room.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase mb-1">Objectives</p>
                            <ul className="text-xs text-gray-300 space-y-1">
                              {room.objectives.map((obj, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-gray-600">•</span> {obj}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase mb-1">Attendees</p>
                            <div className="flex gap-1 flex-wrap">
                              {room.attendees.map((att, i) => (
                                <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300">
                                  {att}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {/* FACTORY OPS VIEW */}
        {view === "factory" && (
          <div className="space-y-8">
            <Card className="border-amber-500/20 bg-gradient-to-b from-slate-800 to-slate-900">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center gap-2">
                  <Factory className="w-5 h-5" />
                  Factory Operations Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Key Metrics */}
                  {[
                    { label: "Tasks Executing", value: "47", unit: "active", color: "text-green-400" },
                    { label: "Environments", value: "10", unit: "live", color: "text-blue-400" },
                    { label: "API Health", value: "99.8%", unit: "uptime", color: "text-cyan-400" },
                    { label: "Notion Sync", value: "2.4K", unit: "tasks synced", color: "text-purple-400" },
                    { label: "Agents Active", value: "12/15", unit: "connected", color: "text-pink-400" },
                    { label: "System Load", value: "34%", unit: "CPU", color: "text-yellow-400" },
                  ].map((metric, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-gray-500 font-mono text-xs uppercase mb-2">{metric.label}</p>
                      <p className={`text-3xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
                      <p className="text-xs text-gray-600">{metric.unit}</p>
                    </div>
                  ))}
                </div>

                {/* Live Tasks */}
                <div className="mt-8">
                  <h3 className="text-sm font-mono font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    Currently Executing (47 Tasks)
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {[
                      "Naledi: Generate Instagram content for Father's Day campaign",
                      "Charlie: Process 28 Shopify orders (fulfillment in progress)",
                      "OpenCode: Sync Notion database with new customer records",
                      "Robusca: Prepare 10 AM board meeting agenda",
                      "Naledi: Review Meta Ads performance (ROAS tracking)",
                      "Charlie: Send WhatsApp tracking updates to 12 customers",
                      "OpenCode: Monitor Cloudflare email delivery (mass send)",
                      "Robusca: Coordinate content approvals from Tumelo",
                      "Naledi: Schedule TikTok reels for 14:00 UTC",
                      "Charlie: Check inventory levels for top 5 products",
                    ].map((task, i) => (
                      <div key={i} className="p-3 rounded border border-white/10 bg-white/3 hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <p className="text-xs text-gray-300 font-mono">{task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ENVIRONMENTS VIEW */}
        {view === "environments" && (
          <div className="space-y-8">
            {selectedEnvironment ? (
              // Environment Detail View
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEnvironment(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                  Back to Environments
                </Button>

                {(() => {
                  const env = environmentList.find((e) => e.id === selectedEnvironment);
                  return env ? (
                    <>
                      <Card className="border-white/10 bg-gradient-to-r from-slate-800 to-slate-900">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold text-white"
                              style={{ backgroundColor: env.color + "40" }}
                            >
                              {env.name[0]}
                            </div>
                            <div className="flex-1">
                              <h2 className="text-2xl font-bold text-white">{env.name}</h2>
                              <p className="text-gray-400 font-mono text-sm">{env.company}</p>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={
                                  env.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : env.status === "idle"
                                    ? "bg-gray-500/20 text-gray-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }
                              >
                                {env.status}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-2">{env.agentsCount} Agents</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Meeting Rooms for this Environment */}
                      <Card className="border-white/10">
                        <CardHeader>
                          <CardTitle className="text-sm">Meeting Rooms</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {meetingRoomList
                              .filter((r) => r.environmentId === selectedEnvironment)
                              .map((room) => (
                                <div key={room.id} className="p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                                  <h3 className="font-mono text-sm font-bold text-white mb-2">{room.name}</h3>
                                  <p className="text-xs text-gray-500 mb-3">{room.startTime}</p>
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-[10px] text-gray-500 uppercase mb-1">Objectives</p>
                                      <ul className="text-xs text-gray-300 space-y-1">
                                        {room.objectives.map((obj, i) => (
                                          <li key={i}>• {obj}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : null;
                })()}
              </div>
            ) : (
              // Environments Grid
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-cyan-400" />
                    10 Working Environments
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {environmentList.map((env) => (
                      <button
                        key={env.id}
                        onClick={() => setSelectedEnvironment(env.id)}
                        className="text-left group"
                      >
                        <Card className="border-white/10 hover:border-white/30 transition-all cursor-pointer h-full">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: env.color + "40" }}
                              >
                                {env.name[0]}
                              </div>
                              <Badge
                                className={
                                  env.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : env.status === "idle"
                                    ? "bg-gray-500/20 text-gray-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }
                              >
                                {env.status}
                              </Badge>
                            </div>
                            <h3 className="font-mono text-sm font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                              {env.name}
                            </h3>
                            <p className="text-xs text-gray-500 mb-4 font-mono">{env.company}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Agents: {env.agentsCount}</span>
                              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TERMINAL VIEW */}
        {view === "terminal" && (
          <div className="space-y-4">
            <Card className="border-green-500/30 bg-black">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-400 flex items-center gap-2 font-mono">
                    <Terminal className="w-5 h-5" />
                    Tailscale Terminal Access
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandTerminal(!expandTerminal)}
                    className="text-green-400"
                  >
                    {expandTerminal ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Terminal Output */}
                <div
                  className={`bg-black border border-green-500/30 rounded-lg p-4 font-mono text-xs text-green-400 overflow-auto ${
                    expandTerminal ? "max-h-none min-h-96" : "max-h-64"
                  }`}
                >
                  {terminalOutput.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="animate-pulse">▋</span>
                  </div>
                </div>

                {/* Command Input */}
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter command (status, agents, help)..."
                      className="flex-1 font-mono text-xs bg-black border-green-500/30 text-green-400 placeholder:text-green-900"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                          handleTerminalCommand((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                  </div>
                  <div className="text-xs text-green-600 font-mono">
                    Try: status · agents · help
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-white/10">
              <CardHeader>
                <CardTitle className="text-sm">Quick Terminal Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleTerminalCommand("status")}
                  >
                    System Status
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleTerminalCommand("agents")}
                  >
                    List Agents
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Check VMs
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
