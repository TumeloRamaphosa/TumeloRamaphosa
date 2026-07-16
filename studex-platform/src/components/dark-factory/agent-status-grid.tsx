import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, Clock } from "lucide-react";
import type { Agent } from "@/lib/supabase/types";

interface AgentStatusGridProps {
  agents: Agent[];
  selectedAgent?: string;
  onAgentSelect?: (agentId: string) => void;
}

export function AgentStatusGrid({
  agents,
  selectedAgent,
  onAgentSelect,
}: AgentStatusGridProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Activity className="w-3 h-3 text-green-400 animate-pulse" />;
      case "processing":
        return <Clock className="w-3 h-3 text-yellow-400 animate-spin" />;
      case "offline":
        return <Activity className="w-3 h-3 text-red-400" />;
      default:
        return <Activity className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/20 text-green-400";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "offline":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onAgentSelect?.(agent.id)}
          className={`text-left group transition-all ${
            selectedAgent === agent.id
              ? "ring-2 ring-cyan-400"
              : ""
          }`}
        >
          <div className="p-3 rounded-lg border border-white/10 hover:border-white/20 transition-all hover:bg-white/5">
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
            <p className="font-mono text-xs font-bold text-white truncate">
              {agent.name}
            </p>
            <p className="text-[10px] text-gray-500 truncate">{agent.role}</p>
            <div className="flex items-center gap-1 mt-2">
              {getStatusIcon(agent.status)}
              <Badge
                className={`text-[10px] ${getStatusBadgeClass(agent.status)}`}
                variant="secondary"
              >
                {agent.status}
              </Badge>
            </div>
            {agent.current_task && (
              <p className="text-[9px] text-gray-400 mt-2 line-clamp-2">
                {agent.current_task}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
