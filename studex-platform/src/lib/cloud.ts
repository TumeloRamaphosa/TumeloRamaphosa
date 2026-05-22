// Agentic Cloud domain model + mock data + provisioning seam.
//
// This is the integration boundary for the VM/agent hosting product. Today it
// returns mock data. Each real backend (Coolify for app/site hosting, Orgo for
// agent-controlled desktops, Firecracker/Proxmox for owned nodes) implements the
// CloudProvider interface and gets swapped in behind the API routes — the UI does
// not change. LLM inference is always rented (Anthropic/OpenAI/Bedrock/Vertex).

export type VMStatus = "running" | "provisioning" | "stopped" | "error";
export type VMRegion = "jnb1" | "cpt1" | "eu-central";
export type AgentRuntime = "openclaw" | "hermes" | "claude-code" | "none";
export type RunStatus = "queued" | "running" | "review" | "done" | "failed";

export const REGION_LABELS: Record<VMRegion, string> = {
  jnb1: "Johannesburg (ZA)",
  cpt1: "Cape Town (ZA)",
  "eu-central": "EU Central",
};

export const RUNTIME_LABELS: Record<AgentRuntime, string> = {
  openclaw: "OpenClaw",
  hermes: "Hermes",
  "claude-code": "Claude Code",
  none: "No agent",
};

export interface VM {
  id: string;
  name: string;
  status: VMStatus;
  region: VMRegion;
  owner: string;
  ip: string;
  os: string;
  spec: { cpu: number; ramGb: number; diskGb: number };
  usage: { cpu: number; ram: number; disk: number }; // percent 0-100
  agent: AgentRuntime;
  createdAt: string;
}

export interface AgentRun {
  id: string;
  vmId: string;
  vmName: string;
  runtime: AgentRuntime;
  task: string;
  status: RunStatus;
  startedAt: string;
  runtimeSeconds: number;
  costZar: number;
  tokens: number;
}

export interface ProvisionRequest {
  name: string;
  region: VMRegion;
  spec: { cpu: number; ramGb: number; diskGb: number };
  agent: AgentRuntime;
  owner?: string;
}

export interface BootstrapStep {
  step: string;
  status: string;
}

export interface ProvisionResult {
  vm: VM;
  bootstrap: BootstrapStep[];
}

// A backend that can list and create VMs. Mock today; Coolify/Orgo/Proxmox later.
export interface CloudProvider {
  listVMs(): Promise<VM[]>;
  listRuns(): Promise<AgentRun[]>;
  provision(req: ProvisionRequest): Promise<ProvisionResult>;
}

const MOCK_VMS: VM[] = [
  {
    id: "vm-charlie-01",
    name: "charlie-ops",
    status: "running",
    region: "jnb1",
    owner: "internal / studex",
    ip: "102.66.18.4",
    os: "Ubuntu 24.04 LTS",
    spec: { cpu: 4, ramGb: 16, diskGb: 80 },
    usage: { cpu: 34, ram: 51, disk: 22 },
    agent: "openclaw",
    createdAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "vm-naledi-01",
    name: "naledi-creative",
    status: "running",
    region: "jnb1",
    owner: "internal / studex",
    ip: "102.66.18.5",
    os: "Ubuntu 24.04 LTS",
    spec: { cpu: 8, ramGb: 32, diskGb: 160 },
    usage: { cpu: 71, ram: 63, disk: 40 },
    agent: "hermes",
    createdAt: "2026-05-02T11:30:00Z",
  },
  {
    id: "vm-acme-web",
    name: "acme-web-prod",
    status: "running",
    region: "cpt1",
    owner: "Acme (Pty) Ltd",
    ip: "102.66.20.18",
    os: "Ubuntu 24.04 LTS",
    spec: { cpu: 2, ramGb: 8, diskGb: 40 },
    usage: { cpu: 12, ram: 28, disk: 15 },
    agent: "none",
    createdAt: "2026-05-10T08:15:00Z",
  },
  {
    id: "vm-kora-agent",
    name: "kora-support-bot",
    status: "provisioning",
    region: "jnb1",
    owner: "Kora Fintech",
    ip: "—",
    os: "Ubuntu 24.04 LTS",
    spec: { cpu: 4, ramGb: 16, diskGb: 80 },
    usage: { cpu: 0, ram: 0, disk: 0 },
    agent: "claude-code",
    createdAt: "2026-05-22T07:45:00Z",
  },
  {
    id: "vm-thabo-dev",
    name: "thabo-sandbox",
    status: "stopped",
    region: "eu-central",
    owner: "Thabo M.",
    ip: "159.69.12.7",
    os: "Ubuntu 24.04 LTS",
    spec: { cpu: 2, ramGb: 4, diskGb: 40 },
    usage: { cpu: 0, ram: 0, disk: 18 },
    agent: "openclaw",
    createdAt: "2026-04-28T14:00:00Z",
  },
];

const MOCK_RUNS: AgentRun[] = [
  { id: "run-01", vmId: "vm-kora-agent", vmName: "kora-support-bot", runtime: "claude-code", task: "Bootstrap VM + install Docker", status: "running", startedAt: "2026-05-22T07:46:00Z", runtimeSeconds: 142, costZar: 3.4, tokens: 18400 },
  { id: "run-02", vmId: "vm-naledi-01", vmName: "naledi-creative", runtime: "hermes", task: "Draft GTC content brief", status: "running", startedAt: "2026-05-22T07:30:00Z", runtimeSeconds: 920, costZar: 11.2, tokens: 62000 },
  { id: "run-03", vmId: "vm-charlie-01", vmName: "charlie-ops", runtime: "openclaw", task: "Reconcile studexmeat orders", status: "review", startedAt: "2026-05-22T06:10:00Z", runtimeSeconds: 540, costZar: 6.8, tokens: 31000 },
  { id: "run-04", vmId: "vm-acme-web", vmName: "acme-web-prod", runtime: "openclaw", task: "Deploy site + issue SSL", status: "done", startedAt: "2026-05-21T15:00:00Z", runtimeSeconds: 210, costZar: 2.1, tokens: 9800 },
  { id: "run-05", vmId: "vm-charlie-01", vmName: "charlie-ops", runtime: "openclaw", task: "Nightly knowledge-base sync", status: "done", startedAt: "2026-05-21T02:00:00Z", runtimeSeconds: 1850, costZar: 19.5, tokens: 104000 },
  { id: "run-06", vmId: "vm-thabo-dev", vmName: "thabo-sandbox", runtime: "openclaw", task: "Scrape competitor pricing", status: "failed", startedAt: "2026-05-20T19:30:00Z", runtimeSeconds: 60, costZar: 0.9, tokens: 4200 },
  { id: "run-07", vmId: "vm-naledi-01", vmName: "naledi-creative", runtime: "hermes", task: "Render 12 thumbnails", status: "queued", startedAt: "2026-05-22T08:00:00Z", runtimeSeconds: 0, costZar: 0, tokens: 0 },
];

function bootstrapPlan(req: ProvisionRequest): BootstrapStep[] {
  const steps: BootstrapStep[] = [
    { step: `Allocating compute in ${REGION_LABELS[req.region]}`, status: "ok" },
    { step: `Booting ${req.spec.cpu} vCPU / ${req.spec.ramGb}GB RAM node`, status: "ok" },
    { step: "Installing Docker Engine + container runtime", status: "ok" },
    { step: "Configuring firewall + static IP", status: "ok" },
  ];
  if (req.agent !== "none") {
    steps.push(
      { step: `Pulling ${RUNTIME_LABELS[req.agent]} agent runtime`, status: "ok" },
      { step: "Agent connecting to command center", status: "ok" },
      { step: `${RUNTIME_LABELS[req.agent]} online — VM ready`, status: "ok" }
    );
  } else {
    steps.push({ step: "VM ready (no agent attached)", status: "ok" });
  }
  return steps;
}

// Mock implementation. Swap for CoolifyProvider / OrgoProvider in later phases.
export const mockProvider: CloudProvider = {
  async listVMs() {
    return MOCK_VMS;
  },
  async listRuns() {
    return MOCK_RUNS;
  },
  async provision(req: ProvisionRequest) {
    const id = `vm-${req.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.floor(Math.random() * 1000)}`;
    const octet = Math.floor(Math.random() * 250) + 2;
    const vm: VM = {
      id,
      name: req.name,
      status: "running",
      region: req.region,
      owner: req.owner || "new customer",
      ip: `102.66.${Math.floor(Math.random() * 50) + 18}.${octet}`,
      os: "Ubuntu 24.04 LTS",
      spec: req.spec,
      usage: { cpu: 5, ram: 10, disk: 4 },
      agent: req.agent,
      createdAt: new Date().toISOString(),
    };
    return { vm, bootstrap: bootstrapPlan(req) };
  },
};

export const RUN_COLUMNS: { key: RunStatus; label: string }[] = [
  { key: "queued", label: "Queued" },
  { key: "running", label: "Running" },
  { key: "review", label: "Needs Review" },
  { key: "done", label: "Done" },
  { key: "failed", label: "Failed" },
];
