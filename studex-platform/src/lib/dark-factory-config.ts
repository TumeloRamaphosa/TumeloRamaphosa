export interface Environment {
  id: string;
  name: string;
  company: string;
  status: "active" | "idle" | "maintenance";
  agentsCount: number;
  color: string;
  description: string;
}

export interface MeetingRoom {
  id: string;
  name: string;
  environmentId: string;
  status: "scheduled" | "live" | "ended";
  startTime: string;
  endTime: string;
  objectives: string[];
  attendees: string[];
  notes: string;
}

export interface Presentation {
  agentName: string;
  role: string;
  status: "scheduled" | "presenting" | "completed";
  startTime: string;
  endTime: string;
  duration: number;
  slides: string[];
}

export interface Task {
  id: string;
  agent: string;
  description: string;
  status: "queued" | "executing" | "completed" | "blocked";
  startTime: string;
  priority: "urgent" | "high" | "medium" | "low";
  progress: number;
}

export const DEFAULT_ENVIRONMENTS: Environment[] = [
  {
    id: "env-001",
    name: "StudEx Meat",
    company: "studexmeat.com",
    status: "active",
    agentsCount: 5,
    color: "#ff2d78",
    description: "Main e-commerce platform for premium meat products",
  },
  {
    id: "env-002",
    name: "Global Markets",
    company: "studex-group.com",
    status: "active",
    agentsCount: 4,
    color: "#00f0ff",
    description: "B2B wholesale and international partnerships",
  },
  {
    id: "env-003",
    name: "Rahura Fitness",
    company: "rahura.app",
    status: "idle",
    agentsCount: 3,
    color: "#ff00ff",
    description: "Fitness education and wellness platform",
  },
  {
    id: "env-004",
    name: "Content Studio",
    company: "content.studex.dev",
    status: "active",
    agentsCount: 2,
    color: "#ffd700",
    description: "Content creation and media management",
  },
  {
    id: "env-005",
    name: "Email Operations",
    company: "mail.studex.cloud",
    status: "active",
    agentsCount: 2,
    color: "#00ff88",
    description: "Agent Mail and mass email campaigns",
  },
  {
    id: "env-006",
    name: "Analytics Hub",
    company: "analytics.studex.dev",
    status: "maintenance",
    agentsCount: 2,
    color: "#ff7700",
    description: "Real-time analytics and reporting",
  },
  {
    id: "env-007",
    name: "Payment Gateway",
    company: "payments.studex.cloud",
    status: "active",
    agentsCount: 2,
    color: "#0088ff",
    description: "Payment processing and financial tracking",
  },
  {
    id: "env-008",
    name: "Inventory Mgmt",
    company: "inventory.studex.dev",
    status: "active",
    agentsCount: 2,
    color: "#ff00aa",
    description: "Inventory tracking and warehouse management",
  },
  {
    id: "env-009",
    name: "Customer Support",
    company: "support.studex.dev",
    status: "idle",
    agentsCount: 2,
    color: "#88ff00",
    description: "Customer service and WhatsApp integration",
  },
  {
    id: "env-010",
    name: "Mission Control",
    company: "war-room.studex.dev",
    status: "active",
    agentsCount: 3,
    color: "#00ffff",
    description: "Central War Room dashboard and monitoring",
  },
];

export const DEFAULT_PRESENTATIONS: Presentation[] = [
  {
    agentName: "Naledi",
    role: "Content CMO",
    status: "presenting",
    startTime: "09:15",
    endTime: "09:19",
    duration: 4,
    slides: ["Yesterday Metrics", "Today Plan", "Help Needed"],
  },
  {
    agentName: "Charlie",
    role: "Operations Orchestrator",
    status: "scheduled",
    startTime: "09:20",
    endTime: "09:23",
    duration: 3,
    slides: ["Orders", "Fulfillment", "Blockers"],
  },
  {
    agentName: "OpenCode",
    role: "Systems & Integration",
    status: "scheduled",
    startTime: "09:25",
    endTime: "09:30",
    duration: 5,
    slides: ["System Health", "Automations", "Integrations"],
  },
  {
    agentName: "Robusca",
    role: "Chief of Staff",
    status: "scheduled",
    startTime: "09:31",
    endTime: "09:34",
    duration: 3,
    slides: ["Priorities", "Risks", "Decisions Needed"],
  },
];

export const DEFAULT_MEETING_ROOMS: MeetingRoom[] = [
  {
    id: "room-001",
    name: "Daily Standup",
    environmentId: "env-001",
    status: "live",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    objectives: [
      "Review yesterday metrics",
      "Discuss today priorities",
      "Identify blockers",
    ],
    attendees: ["Naledi", "Charlie", "OpenCode", "Robusca", "Tumelo"],
    notes: "Main coordination meeting for all agents",
  },
  {
    id: "room-002",
    name: "Global Markets Strategy",
    environmentId: "env-002",
    status: "scheduled",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    objectives: [
      "Q3 roadmap discussion",
      "Partnership updates",
      "Revenue targets review",
    ],
    attendees: ["Robusca", "Naledi", "OpenCode"],
    notes: "Strategic planning for Tencent and NVIDIA partnerships",
  },
  {
    id: "room-003",
    name: "Content Planning",
    environmentId: "env-003",
    status: "scheduled",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    objectives: [
      "Weekly content calendar",
      "Campaign alignment",
      "Asset review",
    ],
    attendees: ["Naledi", "Charlie"],
    notes: "Planning content calendar for Rahura fitness platform",
  },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: "task-001",
    agent: "Naledi",
    description: "Generate Instagram content for Father's Day campaign",
    status: "executing",
    startTime: "09:05",
    priority: "high",
    progress: 65,
  },
  {
    id: "task-002",
    agent: "Charlie",
    description: "Process 28 Shopify orders (fulfillment in progress)",
    status: "executing",
    startTime: "09:10",
    priority: "high",
    progress: 42,
  },
  {
    id: "task-003",
    agent: "OpenCode",
    description: "Sync Notion database with new customer records",
    status: "executing",
    startTime: "09:15",
    priority: "medium",
    progress: 88,
  },
  {
    id: "task-004",
    agent: "Robusca",
    description: "Prepare 10 AM board meeting agenda",
    status: "executing",
    startTime: "08:45",
    priority: "urgent",
    progress: 92,
  },
  {
    id: "task-005",
    agent: "Naledi",
    description: "Review Meta Ads performance (ROAS tracking)",
    status: "executing",
    startTime: "09:20",
    priority: "medium",
    progress: 34,
  },
  {
    id: "task-006",
    agent: "Charlie",
    description: "Send WhatsApp tracking updates to 12 customers",
    status: "queued",
    startTime: "09:30",
    priority: "high",
    progress: 0,
  },
  {
    id: "task-007",
    agent: "OpenCode",
    description: "Monitor Cloudflare email delivery (mass send)",
    status: "executing",
    startTime: "09:00",
    priority: "high",
    progress: 75,
  },
  {
    id: "task-008",
    agent: "Robusca",
    description: "Coordinate content approvals from Tumelo",
    status: "blocked",
    startTime: "09:22",
    priority: "urgent",
    progress: 50,
  },
  {
    id: "task-009",
    agent: "Naledi",
    description: "Schedule TikTok reels for 14:00 UTC",
    status: "queued",
    startTime: "10:00",
    priority: "medium",
    progress: 0,
  },
  {
    id: "task-010",
    agent: "Charlie",
    description: "Check inventory levels for top 5 products",
    status: "queued",
    startTime: "09:45",
    priority: "low",
    progress: 0,
  },
];
