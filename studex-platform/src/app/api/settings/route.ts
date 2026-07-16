import { NextRequest, NextResponse } from 'next/server';

interface SystemSettings {
  agentName: string;
  agentEmail: string;
  primaryBackend: 'claude' | 'ollama' | 'blotato';
  connectivityMode: 'offline' | 'hybrid' | 'online';
  maxConcurrentTasks: number;
  enableAutoSync: boolean;
  syncInterval: number;
  enableNotifications: boolean;
}

interface SystemStatus {
  ollamaStatus: 'connected' | 'disconnected';
  blotatoStatus: 'connected' | 'disconnected';
  tailscaleStatus: 'connected' | 'disconnected';
  gmailStatus: 'connected' | 'disconnected';
  notionStatus: 'connected' | 'disconnected';
  lastSync: Date | null;
  activeTasks: number;
}

let systemSettings: SystemSettings = {
  agentName: 'Claude Agent',
  agentEmail: 'claude.assistant@studex.cloud',
  primaryBackend: 'claude',
  connectivityMode: 'hybrid',
  maxConcurrentTasks: 5,
  enableAutoSync: true,
  syncInterval: 5,
  enableNotifications: true,
};

let systemStatus: SystemStatus = {
  ollamaStatus: 'disconnected',
  blotatoStatus: 'disconnected',
  tailscaleStatus: 'disconnected',
  gmailStatus: 'disconnected',
  notionStatus: 'disconnected',
  lastSync: null,
  activeTasks: 0,
};

async function checkOllamaStatus(): Promise<'connected' | 'disconnected'> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', { method: 'GET' });
    return response.ok ? 'connected' : 'disconnected';
  } catch {
    return 'disconnected';
  }
}

async function checkBlotatoStatus(): Promise<'connected' | 'disconnected'> {
  try {
    const response = await fetch('https://api.blotato.ai/health', {
      headers: { Authorization: 'Bearer blt_y5mVD6oMJrgFb8UsfWN3T4GSYN2ZvCeGsVWWwdaf8Og=' },
    });
    return response.ok ? 'connected' : 'disconnected';
  } catch {
    return 'disconnected';
  }
}

async function checkTailscaleStatus(): Promise<'connected' | 'disconnected'> {
  try {
    // In production, check Tailscale daemon or API
    return 'disconnected'; // Placeholder
  } catch {
    return 'disconnected';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, settings } = body;

    if (action === 'save-settings') {
      systemSettings = settings;
      return NextResponse.json({ success: true, settings: systemSettings });
    }

    if (action === 'test-connections') {
      const [ollamaStatus, blotatoStatus, tailscaleStatus] = await Promise.all([
        checkOllamaStatus(),
        checkBlotatoStatus(),
        checkTailscaleStatus(),
      ]);

      systemStatus = {
        ...systemStatus,
        ollamaStatus,
        blotatoStatus,
        tailscaleStatus,
        lastSync: new Date(),
      };

      return NextResponse.json({ success: true, status: systemStatus });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  if (action === 'status') {
    return NextResponse.json(systemStatus);
  }

  if (action === 'settings') {
    return NextResponse.json(systemSettings);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
