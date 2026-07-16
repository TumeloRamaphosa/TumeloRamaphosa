'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmailAccount {
  id: string;
  email: string;
  type: 'agent' | 'claude' | 'personal';
  service: 'gmail' | 'agent-mail' | 'notion';
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: Date;
}

interface EmailConfig {
  agentEmail: string;
  claudeEmail: string;
  gmailApiKey: string;
  agentMailApiKey: string;
  notionToken: string;
  autoSyncInterval: number;
  autoCreateTasks: boolean;
}

export default function EmailPage() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([
    { id: 'agent', email: 'agents@studex.cloud', type: 'agent', service: 'agent-mail', status: 'disconnected' },
    { id: 'claude', email: 'claude.assistant@studex.cloud', type: 'claude', service: 'gmail', status: 'disconnected' },
  ]);

  const [config, setConfig] = useState<EmailConfig>({
    agentEmail: 'agents@studex.cloud',
    claudeEmail: 'claude.assistant@studex.cloud',
    gmailApiKey: '',
    agentMailApiKey: '',
    notionToken: '',
    autoSyncInterval: 5,
    autoCreateTasks: true,
  });

  const [loading, setLoading] = useState(false);

  const connectAccount = async (accountId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect-account',
          accountId,
          config,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === accountId ? { ...acc, status: 'connected', lastSync: new Date() } : acc
          )
        );
      }
    } catch (error) {
      console.error('Failed to connect account:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSync = async (accountId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/email?action=test-sync&accountId=${accountId}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Sync successful! Processed ${data.emailsProcessed} emails.`);
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === accountId ? { ...acc, lastSync: new Date() } : acc
          )
        );
      }
    } catch (error) {
      console.error('Failed to test sync:', error);
      alert('Sync failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-config',
          config,
        }),
      });

      if (response.ok) {
        alert('Email configuration saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Email Infrastructure</h1>
        <p className="text-gray-600">
          Configure agent email accounts for Gmail, Agent Mail, and Notion integration
        </p>
      </div>

      {/* Email Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Email Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="p-4 border rounded-lg flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{account.email}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      account.status === 'connected' ? 'bg-green-100 text-green-800' :
                      account.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {account.status === 'connected' ? '✓ Connected' : account.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Type: {account.type} • Service: {account.service}
                  </p>
                  {account.lastSync && (
                    <p className="text-xs text-gray-500">
                      Last sync: {new Date(account.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => connectAccount(account.id)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {account.status === 'connected' ? 'Reconnect' : 'Connect'}
                  </Button>
                  {account.status === 'connected' && (
                    <Button
                      onClick={() => testSync(account.id)}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Test Sync
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Gmail API Key</label>
            <Input
              type="password"
              value={config.gmailApiKey}
              onChange={(e) => setConfig({ ...config, gmailApiKey: e.target.value })}
              placeholder="paste-gmail-api-key-here"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get from: <a href="https://console.cloud.google.com" className="text-blue-600">Google Cloud Console</a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Agent Mail API Key</label>
            <Input
              type="password"
              value={config.agentMailApiKey}
              onChange={(e) => setConfig({ ...config, agentMailApiKey: e.target.value })}
              placeholder="paste-agent-mail-key-here"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notion API Token</label>
            <Input
              type="password"
              value={config.notionToken}
              onChange={(e) => setConfig({ ...config, notionToken: e.target.value })}
              placeholder="notion_XXXXXXXXXXXXX"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get from: <a href="https://www.notion.so/my-integrations" className="text-blue-600">Notion Integrations</a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Synchronization Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Auto-Sync Interval (minutes)</label>
            <Input
              type="number"
              value={config.autoSyncInterval}
              onChange={(e) => setConfig({ ...config, autoSyncInterval: parseInt(e.target.value) })}
              min="1"
              max="120"
            />
            <p className="text-xs text-gray-500 mt-1">
              How often to sync emails from Gmail and Agent Mail (minimum 1 minute)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.autoCreateTasks}
              onChange={(e) => setConfig({ ...config, autoCreateTasks: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-semibold">
              Auto-create tasks from email action items
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-semibold text-sm">agents@studex.cloud</p>
            <p className="text-xs text-gray-600">
              Receives emails from external sources. Extracts action items and creates priority tasks automatically.
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-semibold text-sm">claude.assistant@studex.cloud</p>
            <p className="text-xs text-gray-600">
              Primary agent email for incoming requests. Integrates with priority system and syncs to Notion database.
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="font-semibold text-sm">Notion Sync</p>
            <p className="text-xs text-gray-600">
              All tasks and emails sync to Notion database for persistent storage and cross-platform access.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-2">
        <Button
          onClick={saveConfiguration}
          className="bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          Save Email Configuration
        </Button>
      </div>
    </div>
  );
}
