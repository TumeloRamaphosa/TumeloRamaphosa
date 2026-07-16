'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export default function VMPage() {
  const [vms, setVms] = useState<VirtualMachine[]>([
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
  ]);

  const [config, setConfig] = useState<VMConfig>({
    tailscaleApiKey: '',
    vncDefaultPassword: '',
    autoDiscovery: true,
    discoveryInterval: 30,
    maxVMs: 10,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.autoDiscovery) {
      const interval = setInterval(() => {
        discoverVMs();
      }, config.discoveryInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [config.autoDiscovery, config.discoveryInterval]);

  const discoverVMs = async () => {
    try {
      const response = await fetch('/api/vm?action=discover', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setVms(data.vms);
      }
    } catch (error) {
      console.error('Failed to discover VMs:', error);
    }
  };

  const connectToVM = async (vmId: string) => {
    setLoading(true);
    try {
      const vm = vms.find((v) => v.id === vmId);
      if (!vm) return;

      const response = await fetch('/api/vm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect',
          vmId,
          vncPassword: config.vncDefaultPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setVms((prev) =>
          prev.map((v) =>
            v.id === vmId ? { ...v, status: 'connecting', lastSeen: new Date() } : v
          )
        );

        // Open VNC viewer
        window.open(
          `vnc://${vm.tailscaleIp || vm.ipAddress}:${vm.vncPort}`,
          'vnc_window',
          'width=1024,height=768'
        );

        setTimeout(() => {
          setVms((prev) =>
            prev.map((v) =>
              v.id === vmId ? { ...v, status: 'running' } : v
            )
          );
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to connect to VM:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopVM = async (vmId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/vm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop',
          vmId,
        }),
      });

      if (response.ok) {
        setVms((prev) =>
          prev.map((v) =>
            v.id === vmId ? { ...v, status: 'stopped', cpuUsage: 0, memoryUsage: 0 } : v
          )
        );
      }
    } catch (error) {
      console.error('Failed to stop VM:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    try {
      const response = await fetch('/api/vm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-config',
          config,
        }),
      });

      if (response.ok) {
        alert('VM configuration saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Virtual Machine Orchestration</h1>
        <p className="text-gray-600">
          Manage and coordinate across all your virtual machines with VNC and Tailscale
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{vms.filter((v) => v.status === 'running').length}</p>
              <p className="text-sm text-gray-600">Running VMs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">{vms.length}</p>
              <p className="text-sm text-gray-600">Total VMs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{config.tailscaleApiKey ? '✓' : '✗'}</p>
              <p className="text-sm text-gray-600">Tailscale Connected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Virtual Machines */}
      <Card>
        <CardHeader>
          <CardTitle>Virtual Machines ({vms.length}/{config.maxVMs})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vms.map((vm) => (
              <div
                key={vm.id}
                className="p-4 border rounded-lg hover:bg-gray-50 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{vm.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      vm.status === 'running' ? 'bg-green-100 text-green-800' :
                      vm.status === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {vm.status === 'running' ? '● Running' : vm.status === 'connecting' ? '⟳ Connecting' : '○ Stopped'}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {vm.os === 'linux' ? '🐧' : vm.os === 'macos' ? '🍎' : '🪟'} {vm.os}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-2 text-xs">
                    {vm.tailscaleIp && (
                      <span className="bg-blue-100 px-2 py-1 rounded">
                        Tailscale: {vm.tailscaleIp}
                      </span>
                    )}
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      VNC: {vm.ipAddress}:{vm.vncPort}
                    </span>
                  </div>
                  {vm.status === 'running' && (
                    <div className="flex gap-2 text-xs">
                      <span className="bg-orange-100 px-2 py-1 rounded">
                        CPU: {vm.cpuUsage}%
                      </span>
                      <span className="bg-purple-100 px-2 py-1 rounded">
                        Memory: {vm.memoryUsage}%
                      </span>
                    </div>
                  )}
                  {vm.lastSeen && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last seen: {new Date(vm.lastSeen).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => connectToVM(vm.id)}
                    disabled={loading || vm.status === 'connecting'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {vm.status === 'running' ? 'Open VNC' : 'Start & Connect'}
                  </Button>
                  {vm.status === 'running' && (
                    <Button
                      onClick={() => stopVM(vm.id)}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Stop
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tailscale Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Tailscale Network Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Tailscale API Key</label>
            <Input
              type="password"
              value={config.tailscaleApiKey}
              onChange={(e) => setConfig({ ...config, tailscaleApiKey: e.target.value })}
              placeholder="tskey-..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Get from: <a href="https://login.tailscale.com/admin/settings/keys" className="text-blue-600">Tailscale Admin</a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">VNC Default Password</label>
            <Input
              type="password"
              value={config.vncDefaultPassword}
              onChange={(e) => setConfig({ ...config, vncDefaultPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.autoDiscovery}
              onChange={(e) => setConfig({ ...config, autoDiscovery: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-semibold">
              Enable automatic VM discovery
            </label>
          </div>

          {config.autoDiscovery && (
            <div>
              <label className="block text-sm font-semibold mb-2">Discovery Interval (seconds)</label>
              <Input
                type="number"
                value={config.discoveryInterval}
                onChange={(e) => setConfig({ ...config, discoveryInterval: parseInt(e.target.value) })}
                min="10"
                max="300"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* VM Architecture Info */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-semibold text-sm">Tailscale Network</p>
            <p className="text-xs text-gray-600">
              All VMs connect via Tailscale mesh VPN. Secure encrypted access without exposing ports to the internet.
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-semibold text-sm">VNC Orchestration</p>
            <p className="text-xs text-gray-600">
              View and control each VM remotely using VNC protocol. Run agents and tasks on any machine.
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="font-semibold text-sm">Distributed Agents</p>
            <p className="text-xs text-gray-600">
              Deploy Claude agents and local models across VMs. Coordinate work and sync results to priority system.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <div className="flex gap-2">
        <Button
          onClick={saveConfiguration}
          className="bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          Save VM Configuration
        </Button>
        <Button
          onClick={discoverVMs}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          Discover VMs Now
        </Button>
      </div>
    </div>
  );
}
