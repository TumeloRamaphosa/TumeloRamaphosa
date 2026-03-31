import { NextRequest, NextResponse } from "next/server";

interface RocketTarget {
  name: string;
  ip: string;
  gpus: string;
  script: string;
}

const ROCKET_TARGETS: Record<string, RocketTarget> = {
  "windows-2gpu": {
    name: "Windows 2-GPU Workstation",
    ip: "192.168.1.100",
    gpus: "2x NVIDIA RTX 4090",
    script: "start-agents.ps1",
  },
  "mac-mini": {
    name: "Mac Mini M4 Pro",
    ip: "192.168.1.101",
    gpus: "Apple M4 Pro Neural Engine",
    script: "start-agents.sh",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { target } = await request.json();

    const machine = ROCKET_TARGETS[target];
    if (!machine) {
      return NextResponse.json({ error: "Invalid target machine" }, { status: 400 });
    }

    // In production, this would SSH into the machine and run the script
    // For now, simulate the launch sequence
    const launchSequence = {
      target: machine.name,
      status: "launched",
      timestamp: new Date().toISOString(),
      steps: [
        { step: "SSH Connection", status: "connected", time: "0.3s" },
        { step: "GPU Detection", status: machine.gpus, time: "0.8s" },
        { step: "Agent Bootstrap", status: "initializing", time: "1.2s" },
        { step: "RAG Index Sync", status: "syncing", time: "2.1s" },
        { step: "System Ready", status: "operational", time: "3.5s" },
      ],
      message: `Rocket launched to ${machine.name}. Script ${machine.script} triggered on ${machine.ip}.`,
    };

    return NextResponse.json(launchSequence);
  } catch {
    return NextResponse.json({ error: "Launch failed" }, { status: 500 });
  }
}
