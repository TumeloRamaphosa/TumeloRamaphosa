'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    agentName: 'Claude Agent',
    agentEmail: 'claude.assistant@studex.cloud',
    primaryBackend: 'claude',
    connectivityMode: 'hybrid',
    maxConcurrentTasks: 5,
    enableAutoSync: true,
    syncInterval: 5,
    enableNotifications: true,
  });

  const [status, setStatus] = useState<SystemStatus>({
    ollamaStatus: 'disconnected',
    blotatoStatus: 'disconnected',
    tailscaleStatus: 'disconnected',
    gmailStatus: 'disconnected',
    notionStatus: 'disconnected',
    lastSync: null,
    activeTasks: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    try {
      const response = await fetch('/api/settings?action=status', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to check system status:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-settings',
          settings,
        }),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnections = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-connections',
        }),
      });

      if (response.ok) {
        await checkSystemStatus();
        alert('Connection tests completed. Check status below.');
      }
    } catch (error) {
      console.error('Failed to test connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'connected' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Agent Settings & System Status</h1>
        <p className="text-gray-600">
          Configure your distributed agent system and monitor connectivity across all backends
        </p>
      </div>

      {/* System Status Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="p-3 border rounded-lg">
              <p className="text-sm font-semibold">Ollama</p>
              <p className={`text-xs mt-1 ${getStatusColor(status.ollamaStatus)}`}>
                {status.ollamaStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm font-semibold">Blotato</p>
              <p className={`text-xs mt-1 ${getStatusColor(status.blotatoStatus)}`}>
                {status.blotatoStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm font-semibold">Tailscale</p>
              <p className={`text-xs mt-1 ${getStatusColor(status.tailscaleStatus)}`}>
                {status.tailscaleStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm font-semibold">Gmail</p>
              <p className={`text-xs mt-1 ${getStatusColor(status.gmailStatus)}`}>
                {status.gmailStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm font-semibold">Notion</p>
              <p className={`text-xs mt-1 ${getStatusColor(status.notionStatus)}`}>
                {status.notionStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm font-semibold">Active Tasks</p>
              <p className="text-xs mt-1 text-blue-600">{status.activeTasks} running</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={testConnections}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Test All Connections
            </Button>
            {status.lastSync && (
              <p className="text-xs text-gray-500 self-center">
                Last sync: {new Date(status.lastSync).toLocaleTimeString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agent Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Agent Name</label>
            <Input
              value={settings.agentName}
              onChange={(e) => setSettings({ ...settings, agentName: e.target.value })}
              placeholder="Claude Agent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Agent Email Address</label>
            <Input
              type="email"
              value={settings.agentEmail}
              onChange={(e) => setSettings({ ...settings, agentEmail: e.target.value })}
              placeholder="claude.assistant@studex.cloud"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Primary Backend</label>
            <div className="flex gap-4">
              {(['claude', 'ollama', 'blotato'] as const).map((backend) => (
                <label key={backend} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={settings.primaryBackend === backend}
                    onChange={() => setSettings({ ...settings, primaryBackend: backend })}
                  />
                  <span className="text-sm capitalize">{backend}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {settings.primaryBackend === 'claude' && 'Use Claude API for maximum intelligence'}
              {settings.primaryBackend === 'ollama' && 'Use local Ollama models for privacy and speed'}
              {settings.primaryBackend === 'blotato' && 'Use Blotato for specialized model inference'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Connectivity Mode</label>
            <div className="flex gap-4">
              {(['offline', 'hybrid', 'online'] as const).map((mode) => (
                <label key={mode} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={settings.connectivityMode === mode}
                    onChange={() => setSettings({ ...settings, connectivityMode: mode })}
                  />
                  <span className="text-sm capitalize">{mode}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance & Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Performance & Synchronization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Max Concurrent Tasks</label>
            <Input
              type="number"
              value={settings.maxConcurrentTasks}
              onChange={(e) => setSettings({ ...settings, maxConcurrentTasks: parseInt(e.target.value) })}
              min="1"
              max="20"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum number of tasks to run simultaneously
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.enableAutoSync}
              onChange={(e) => setSettings({ ...settings, enableAutoSync: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-semibold">
              Enable automatic synchronization
            </label>
          </div>

          {settings.enableAutoSync && (
            <div>
              <label className="block text-sm font-semibold mb-2">Sync Interval (minutes)</label>
              <Input
                type="number"
                value={settings.syncInterval}
                onChange={(e) => setSettings({ ...settings, syncInterval: parseInt(e.target.value) })}
                min="1"
                max="60"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-semibold">
              Enable notifications for task updates
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Priority System:</span> Ready
            </p>
            <p>
              <span className="font-semibold">Local Models (Ollama):</span>{' '}
              {status.ollamaStatus === 'connected' ? 'Connected' : 'Not configured'}
            </p>
            <p>
              <span className="font-semibold">Email (Gmail/Agent Mail):</span>{' '}
              {status.gmailStatus === 'connected' ? 'Connected' : 'Not configured'}
            </p>
            <p>
              <span className="font-semibold">Storage (Notion):</span>{' '}
              {status.notionStatus === 'connected' ? 'Connected' : 'Not configured'}
            </p>
            <p>
              <span className="font-semibold">Distributed VM Access (Tailscale):</span>{' '}
              {status.tailscaleStatus === 'connected' ? 'Connected' : 'Not configured'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <div className="flex gap-2">
        <Button
          onClick={saveSettings}
          className="bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
