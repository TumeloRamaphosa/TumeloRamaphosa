import { NextRequest, NextResponse } from 'next/server';

interface VirtualMachine {
  id: string;
  name: string;
  ipAddress: string;
  vncPort: number;
  status: 'running' | 'stopped' | 'connecting';
  os: 'linux' | 'macos' | 'windows';
  cpuUsage: number;
  memoryUsage: number;
  lastSeen?: Date;
  tailscaleIp?: string;
}

interface VMConfig {
  tailscaleApiKey: string;
  vncDefaultPassword: string;
  autoDiscovery: boolean;
  discoveryInterval: number;
  maxVMs: number;
}

let vmConfig: VMConfig = {
  tailscaleApiKey: '',
  vncDefaultPassword: '',
  autoDiscovery: true,
  discoveryInterval: 30,
  maxVMs: 10,
};

let virtualMachines: Map<string, VirtualMachine> = new Map([
  [
    'vm-001',
    {
      id: 'vm-001',
      name: 'MacBook Pro M1 Max',
      ipAddress: '100.64.1.10',
      vncPort: 5900,
      status: 'stopped',
      os: 'macos',
      cpuUsage: 0,
      memoryUsage: 0,
      tailscaleIp: '100.64.1.10',
    },
  ],
  [
    'vm-002',
    {
      id: 'vm-002',
      name: 'Ubuntu Desktop VM',
      ipAddress: '100.64.1.11',
      vncPort: 5900,
      status: 'stopped',
      os: 'linux',
      cpuUsage: 0,
      memoryUsage: 0,
      tailscaleIp: '100.64.1.11',
    },
  ],
  [
    'vm-003',
    {
      id: 'vm-003',
      name: 'iPhone Simulator',
      ipAddress: 'localhost',
      vncPort: 5901,
      status: 'stopped',
      os: 'linux',
      cpuUsage: 0,
      memoryUsage: 0,
    },
  ],
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, vmId, vncPassword, config } = body;

    if (action === 'connect') {
      const vm = virtualMachines.get(vmId);
      if (!vm) {
        return NextResponse.json({ success: false, error: 'VM not found' }, { status: 404 });
      }

      vm.status = 'connecting';
      vm.lastSeen = new Date();

      // Simulate VNC connection initialization
      setTimeout(() => {
        const vmToUpdate = virtualMachines.get(vmId);
        if (vmToUpdate) {
          vmToUpdate.status = 'running';
          vmToUpdate.cpuUsage = Math.floor(Math.random() * 40) + 20;
          vmToUpdate.memoryUsage = Math.floor(Math.random() * 50) + 30;
        }
      }, 2000);

      return NextResponse.json({
        success: true,
        vm,
        vncUrl: `vnc://${vm.tailscaleIp || vm.ipAddress}:${vm.vncPort}`,
      });
    }

    if (action === 'stop') {
      const vm = virtualMachines.get(vmId);
      if (!vm) {
        return NextResponse.json({ success: false, error: 'VM not found' }, { status: 404 });
      }

      vm.status = 'stopped';
      vm.cpuUsage = 0;
      vm.memoryUsage = 0;

      return NextResponse.json({ success: true, vm });
    }

    if (action === 'save-config') {
      vmConfig = config;
      return NextResponse.json({ success: true, config: vmConfig });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  if (action === 'discover') {
    try {
      // Simulate VM discovery via Tailscale
      const vms = Array.from(virtualMachines.values()).map((vm) => ({
        ...vm,
        lastSeen: new Date(),
      }));

      return NextResponse.json({ success: true, vms });
    } catch (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
  }

  if (action === 'list') {
    const vms = Array.from(virtualMachines.values());
    return NextResponse.json({ vms });
  }

  if (action === 'config') {
    return NextResponse.json(vmConfig);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
