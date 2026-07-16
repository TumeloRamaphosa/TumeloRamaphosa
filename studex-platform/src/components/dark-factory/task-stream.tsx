import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, AlertTriangle, Clock, Zap } from "lucide-react";
import { Task } from "@/lib/dark-factory-config";

interface TaskStreamProps {
  tasks: Task[];
  maxItems?: number;
}

export function TaskStream({ tasks, maxItems = 10 }: TaskStreamProps) {
  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "executing":
        return <Activity className="w-4 h-4 text-green-400 animate-pulse" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "blocked":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "queued":
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <Zap className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status: Task["status"]) => {
    switch (status) {
      case "executing":
        return "bg-green-500/20 text-green-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "blocked":
        return "bg-yellow-500/20 text-yellow-400";
      case "queued":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "text-red-400";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-2">
      {tasks.slice(0, maxItems).map((task) => (
        <div
          key={task.id}
          className="p-3 rounded-lg border border-white/10 hover:border-white/20 transition-all bg-white/3 hover:bg-white/5 group"
        >
          {/* Task Header */}
          <div className="flex items-start gap-3 mb-2">
            {getStatusIcon(task.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-white truncate">
                  {task.agent}
                </span>
                <Badge className={`text-[10px] ${getStatusBadgeClass(task.status)}`}>
                  {task.status}
                </Badge>
                <span className={`text-[10px] font-mono ${getPriorityColor(task.priority)} uppercase`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-xs text-gray-300 truncate">{task.description}</p>
            </div>
            <span className="text-[10px] text-gray-500 whitespace-nowrap">{task.startTime}</span>
          </div>

          {/* Progress Bar */}
          {task.status !== "queued" && (
            <div className="ml-7">
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/10">
                <div
                  className={`h-full transition-all duration-300 ${
                    task.status === "blocked"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-green-500 to-cyan-500"
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">{task.progress}% complete</p>
            </div>
          )}
        </div>
      ))}

      {tasks.length > maxItems && (
        <div className="p-2 text-center text-[10px] text-gray-600">
          +{tasks.length - maxItems} more tasks
        </div>
      )}
    </div>
  );
}
