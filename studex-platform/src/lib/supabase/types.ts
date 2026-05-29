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

// ── Home Automation Hub ──────────────────────────────────────────────

export type DeviceSource = "wifi" | "usb" | "ble" | "ha";

export interface Hub {
  id: string;
  owner_id: string | null;
  name: string;
  platform: string | null;
  status: "online" | "offline";
  last_seen: string;
  created_at: string;
}

export interface Device {
  id: string;
  hub_id: string;
  source: DeviceSource;
  external_id: string;
  name: string | null;
  type: string | null;
  manufacturer: string | null;
  model: string | null;
  ip_address: string | null;
  mac_address: string | null;
  capabilities: Record<string, unknown>;
  online: boolean;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface DevicesResponse {
  configured: boolean;
  hubs: Hub[];
  devices: Device[];
  counts: { total: number; online: number; wifi: number; usb: number; ble: number; ha: number };
  error?: string;
}

export type CommandStatus = "pending" | "sent" | "done" | "failed";

export interface Command {
  id: string;
  device_id: string;
  hub_id: string;
  action: string;
  params: Record<string, unknown>;
  status: CommandStatus;
  result: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EnqueueCommandResponse {
  ok: boolean;
  command?: Command;
  error?: string;
}
