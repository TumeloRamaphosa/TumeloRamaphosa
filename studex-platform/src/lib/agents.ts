import type { Agent } from "./supabase/types";

export const AGENTS: Agent[] = [
  {
    id: "charlie-001",
    name: "Charlie",
    codename: "CHARLIE-OPS",
    role: "Client Operations & Voice AI",
    status: "online",
    last_active: new Date().toISOString(),
    tasks_completed: 1247,
    current_task: "Processing studexmeat.com orders",
    avatar_color: "#ff2d78",
  },
  {
    id: "robusca-002",
    name: "Robusca",
    codename: "ROBUSCA-GLOBAL",
    role: "Global Markets & Tencent/Nvidia Partnerships",
    status: "online",
    last_active: new Date().toISOString(),
    tasks_completed: 892,
    current_task: "Analyzing Tencent Cloud JNB1 latency metrics",
    avatar_color: "#00f0ff",
  },
  {
    id: "naledi-003",
    name: "Naledi",
    codename: "NALEDI-CREATIVE",
    role: "Marketing & YouTube R&D & NotebookLM",
    status: "processing",
    last_active: new Date().toISOString(),
    tasks_completed: 634,
    current_task: "Generating YouTube content brief for GTC 2026",
    avatar_color: "#ff00ff",
  },
];

export function getAgent(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id || a.name.toLowerCase() === id.toLowerCase());
}
