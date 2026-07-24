// Discord Integration Configuration
// Connected Servers & Channels

export interface DiscordServer {
  id: string;
  name: string;
  purpose: string;
  status: "online" | "offline" | "idle";
  members?: number;
  channels?: DiscordChannel[];
  owner?: string;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: "text" | "voice" | "category";
  topic?: string;
  memberCount?: number;
}

export interface DiscordMessage {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  reactions?: Record<string, number>;
}

// Main Discord Servers
export const DISCORD_SERVERS: DiscordServer[] = [
  {
    id: "903254959703851098",
    name: "Gaming Server 🎮",
    purpose: "Infrastructure & VM Status Updates",
    status: "online",
    members: 15,
    owner: "Tumelo Ramaphosa",
    channels: [
      {
        id: "903254959703851099",
        name: "vm-status",
        type: "text",
        topic: "Real-time VM health reports and alerts",
      },
      {
        id: "903254959703851100",
        name: "agent-updates",
        type: "text",
        topic: "Agent activity and task completion notifications",
      },
      {
        id: "903254959703851101",
        name: "general",
        type: "text",
        topic: "General discussion and announcements",
      },
      {
        id: "903254959703851102",
        name: "voice-chat",
        type: "voice",
        topic: "Real-time coordination and meetings",
      },
    ],
  },
  {
    id: "1527423712595410974",
    name: "Operations Center 🏭",
    purpose: "Primary Command & Control Server",
    status: "online",
    members: 25,
    owner: "Tumelo Ramaphosa",
    channels: [
      {
        id: "1527423712595410975",
        name: "war-room",
        type: "text",
        topic: "War Room mission control updates and decisions",
      },
      {
        id: "1527423712595410976",
        name: "board-meetings",
        type: "text",
        topic: "Board meeting transcripts and decisions",
      },
      {
        id: "1527423712595410977",
        name: "agent-channel",
        type: "text",
        topic: "Direct communication with agents",
      },
      {
        id: "1527423712595410978",
        name: "standups",
        type: "text",
        topic: "Daily standup presentations (9 AM)",
      },
      {
        id: "1527423712595410979",
        name: "alerts",
        type: "text",
        topic: "Critical system alerts and incidents",
      },
      {
        id: "1527423712595410980",
        name: "voice-operations",
        type: "voice",
        topic: "Live operations channel",
      },
    ],
  },
];

// Discord Bot Configuration
export const DISCORD_BOT_CONFIG = {
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  prefix: "!",
  intents: ["Guilds", "GuildMessages", "MessageContent", "DirectMessages"],
};

// Commands available in Discord
export const DISCORD_COMMANDS = {
  status: {
    name: "!status",
    description: "Get War Room VM and agent status",
    example: "!status war-room",
  },
  agents: {
    name: "!agents",
    description: "List all connected agents",
    example: "!agents",
  },
  tasks: {
    name: "!tasks",
    description: "Show current executing tasks",
    example: "!tasks [agent-name]",
  },
  health: {
    name: "!health",
    description: "System health check",
    example: "!health",
  },
  deploy: {
    name: "!deploy",
    description: "Trigger deployment (admin only)",
    example: "!deploy [service]",
  },
};

// Integration status
export const DISCORD_INTEGRATION_STATUS = {
  connectedServers: DISCORD_SERVERS.length,
  totalChannels: DISCORD_SERVERS.reduce((acc, s) => acc + (s.channels?.length || 0), 0),
  botOnline: false, // Set to true when bot connects
  lastSync: new Date().toISOString(),
};
