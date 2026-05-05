export interface Agent {
  id: string;
  name: string;
  codename: string;
  role: string;
  status: "online" | "offline" | "processing";
  last_active: string;
  tasks_completed: number;
  current_task: string | null;
  avatar_color: string;
}

export interface Conversation {
  id: string;
  agent_id: string;
  user_id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  agent?: string;
}

export interface Embedding {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  agent_id: string | null;
  created_at: string;
}

export interface RocketStatus {
  id: string;
  machine: string;
  status: "idle" | "launching" | "running" | "error";
  gpu_info: string;
  last_launched: string;
}
