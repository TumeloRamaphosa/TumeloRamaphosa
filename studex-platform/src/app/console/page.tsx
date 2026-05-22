"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Server,
  Activity,
  Cpu,
  Bot,
  Plus,
  Loader2,
  CheckCircle2,
  Globe,
  HardDrive,
  Banknote,
  Boxes,
} from "lucide-react";
import {
  type VM,
  type AgentRun,
  type AgentRuntime,
  type VMRegion,
  type BootstrapStep,
  REGION_LABELS,
  RUNTIME_LABELS,
  RUN_COLUMNS,
} from "@/lib/cloud";

const STATUS_VARIANT: Record<VM["status"], "green" | "orange" | "destructive" | "default"> = {
  running: "green",
  provisioning: "orange",
  stopped: "default",
  error: "destructive",
};

const RUN_VARIANT: Record<AgentRun["status"], "green" | "orange" | "destructive" | "default" | "pink"> = {
  queued: "default",
  running: "orange",
  review: "pink",
  done: "green",
  failed: "destructive",
};

function UsageBar({ label, value }: { label: string; value: number }) {
  const color = value > 80 ? "bg-cyber-pink" : value > 60 ? "bg-cyber-orange" : "bg-cyber-green";
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] text-gray-500 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function CommandCenter() {
  const [vms, setVms] = useState<VM[]>([]);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [showForm, setShowForm] = useState(false);

  // provision form
  const [name, setName] = useState("");
  const [region, setRegion] = useState<VMRegion>("jnb1");
  const [agent, setAgent] = useState<AgentRuntime>("openclaw");
  const [size, setSize] = useState<"small" | "medium" | "large">("small");
  const [provisioning, setProvisioning] = useState(false);
  const [bootSteps, setBootSteps] = useState<BootstrapStep[]>([]);

  useEffect(() => {
    fetch("/api/vms").then((r) => r.json()).then((d) => setVms(d.vms || [])).catch(() => {});
    fetch("/api/agent-runs").then((r) => r.json()).then((d) => setRuns(d.runs || [])).catch(() => {});
  }, []);

  const SPECS = {
    small: { cpu: 2, ramGb: 8, diskGb: 40 },
    medium: { cpu: 4, ramGb: 16, diskGb: 80 },
    large: { cpu: 8, ramGb: 32, diskGb: 160 },
  };

  const provision = async () => {
    if (!name.trim() || provisioning) return;
    setProvisioning(true);
    setBootSteps([]);
    try {
      const res = await fetch("/api/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, region, agent, spec: SPECS[size] }),
      });
      const data = await res.json();
      for (let i = 0; i < data.bootstrap.length; i++) {
        await new Promise((r) => setTimeout(r, 450));
        setBootSteps((prev) => [...prev, data.bootstrap[i]]);
      }
      await new Promise((r) => setTimeout(r, 400));
      setVms((prev) => [data.vm, ...prev]);
      setName("");
      setShowForm(false);
      setBootSteps([]);
    } catch {
      setBootSteps([{ step: "Provisioning failed — check provider connection", status: "error" }]);
    } finally {
      setProvisioning(false);
    }
  };

  const activeAgents = vms.filter((v) => v.status === "running" && v.agent !== "none").length;
  const totalSpend = runs.reduce((s, r) => s + r.costZar, 0);
  const avgUtil = vms.length
    ? Math.round(vms.reduce((s, v) => s + v.usage.cpu, 0) / vms.length)
    : 0;

  const metrics = [
    { label: "Active VMs", value: String(vms.filter((v) => v.status === "running").length), icon: Server, color: "text-cyber-cyan" },
    { label: "Active Agents", value: String(activeAgents), icon: Bot, color: "text-cyber-pink" },
    { label: "Agent Spend (24h)", value: `R${totalSpend.toFixed(0)}`, icon: Banknote, color: "text-cyber-green" },
    { label: "Avg CPU", value: `${avgUtil}%`, icon: Cpu, color: "text-cyber-orange" },
  ];

  return (
    <div className="min-h-screen bg-cyber-black">
      <header className="border-b border-white/10 bg-cyber-dark/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Boxes className="w-6 h-6 text-cyber-cyan" />
              <h1 className="font-display text-lg font-black text-white">Command Center</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="green" className="animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              ALL SYSTEMS GO
            </Badge>
            <Button size="sm" variant="pink" onClick={() => setShowForm((s) => !s)}>
              <Plus className="w-4 h-4" />
              New VM + Agent
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label} className="border-white/10">
              <CardContent className="p-4 text-center">
                <m.icon className={`w-5 h-5 ${m.color} mx-auto mb-2`} />
                <p className={`font-display text-2xl font-black ${m.color}`}>{m.value}</p>
                <p className="font-mono text-[10px] text-gray-500 uppercase mt-1">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Provision form */}
        {showForm && (
          <Card className="border-cyber-pink/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display text-lg text-white font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyber-pink" /> Provision new VM + agent
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="font-mono text-[10px] text-gray-500 uppercase">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="client-prod" />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-gray-500 uppercase">Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as VMRegion)}
                    className="flex h-11 w-full rounded-lg border border-white/10 bg-cyber-dark/60 px-3 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50"
                  >
                    {Object.entries(REGION_LABELS).map(([k, v]) => (
                      <option key={k} value={k} className="bg-cyber-dark">{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] text-gray-500 uppercase">Agent</label>
                  <select
                    value={agent}
                    onChange={(e) => setAgent(e.target.value as AgentRuntime)}
                    className="flex h-11 w-full rounded-lg border border-white/10 bg-cyber-dark/60 px-3 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50"
                  >
                    {Object.entries(RUNTIME_LABELS).map(([k, v]) => (
                      <option key={k} value={k} className="bg-cyber-dark">{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] text-gray-500 uppercase">Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as "small" | "medium" | "large")}
                    className="flex h-11 w-full rounded-lg border border-white/10 bg-cyber-dark/60 px-3 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50"
                  >
                    <option value="small" className="bg-cyber-dark">Small · 2vCPU/8GB</option>
                    <option value="medium" className="bg-cyber-dark">Medium · 4vCPU/16GB</option>
                    <option value="large" className="bg-cyber-dark">Large · 8vCPU/32GB</option>
                  </select>
                </div>
              </div>

              {bootSteps.length > 0 && (
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                  {bootSteps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 font-mono text-xs text-gray-300">
                      <CheckCircle2 className="w-3 h-3 text-cyber-green" />
                      {s.step}
                    </div>
                  ))}
                </div>
              )}

              <Button variant="pink" onClick={provision} disabled={provisioning || !name.trim()}>
                {provisioning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {provisioning ? "Provisioning..." : "Launch"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Multi-VM grid */}
        <section>
          <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-cyber-cyan" /> Virtual Machines
            <span className="font-mono text-xs text-gray-500">({vms.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vms.map((vm) => (
              <Card key={vm.id} className="border-white/10 hover:border-cyber-cyan/30 transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-base text-white font-bold">{vm.name}</p>
                      <p className="font-mono text-[10px] text-gray-500 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {REGION_LABELS[vm.region]}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[vm.status]} className="text-[10px]">
                      {vm.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-cyber-cyan" /> {vm.spec.cpu} vCPU</span>
                    <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-cyber-cyan" /> {vm.spec.ramGb}GB</span>
                    <span className="text-gray-500">{vm.ip}</span>
                    <span className="text-gray-500">{vm.spec.diskGb}GB disk</span>
                  </div>

                  <div className="space-y-2">
                    <UsageBar label="CPU" value={vm.usage.cpu} />
                    <UsageBar label="RAM" value={vm.usage.ram} />
                    <UsageBar label="Disk" value={vm.usage.disk} />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="font-mono text-[10px] text-gray-500">{vm.owner}</span>
                    <Badge variant={vm.agent === "none" ? "default" : "pink"} className="text-[9px]">
                      <Bot className="w-3 h-3 mr-1" /> {RUNTIME_LABELS[vm.agent]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Agent activity Kanban */}
        <section>
          <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyber-pink" /> Agent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {RUN_COLUMNS.map((col) => {
              const items = runs.filter((r) => r.status === col.key);
              return (
                <div key={col.key} className="rounded-xl bg-cyber-dark/50 border border-white/10 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-gray-400">{col.label}</span>
                    <span className="font-mono text-[10px] text-gray-600">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((run) => (
                      <div key={run.id} className="rounded-lg bg-black/40 border border-white/10 p-3 space-y-2">
                        <p className="font-mono text-xs text-gray-200 leading-snug">{run.task}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant={RUN_VARIANT[run.status]} className="text-[9px]">
                            {RUNTIME_LABELS[run.runtime]}
                          </Badge>
                          <span className="font-mono text-[9px] text-gray-500">{run.vmName}</span>
                        </div>
                        {run.status !== "queued" && (
                          <div className="flex items-center justify-between font-mono text-[9px] text-gray-600">
                            <span>{Math.round(run.runtimeSeconds / 60)}m · {(run.tokens / 1000).toFixed(0)}k tok</span>
                            <span className="text-cyber-green">R{run.costZar.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {items.length === 0 && (
                      <p className="font-mono text-[10px] text-gray-700 text-center py-4">empty</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
