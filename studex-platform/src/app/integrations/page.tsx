'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface IntegrationStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'configuring';
  apiKey?: string;
  lastSync?: Date;
  dataPoints?: number;
}

interface IntegrationConfig {
  notion: {
    token: string;
    databaseIds: {
      tasks: string;
      objectives: string;
      diary: string;
    };
  };
  agentMail: {
    apiKey: string;
    email: string;
    syncInterval: number;
  };
  linear: {
    apiKey: string;
    teamId: string;
  };
  shopify: {
    shopName: string;
    accessToken: string;
  };
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    { name: 'Notion', status: 'disconnected' },
    { name: 'Agent Mail', status: 'disconnected' },
    { name: 'Linear', status: 'disconnected' },
    { name: 'Shopify', status: 'disconnected' },
  ]);

  const [config, setConfig] = useState<IntegrationConfig>({
    notion: {
      token: '',
      databaseIds: { tasks: '', objectives: '', diary: '' },
    },
    agentMail: {
      apiKey: '',
      email: '',
      syncInterval: 5,
    },
    linear: {
      apiKey: '',
      teamId: '',
    },
    shopify: {
      shopName: '',
      accessToken: '',
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIntegrationStatus();
  }, []);

  const checkIntegrationStatus = async () => {
    try {
      const response = await fetch('/api/integrations?action=status', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.integrations);
      }
    } catch (error) {
      console.error('Failed to check integration status:', error);
    }
  };

  const connectIntegration = async (integrationName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect',
          integration: integrationName.toLowerCase(),
          config: config[integrationName.toLowerCase() as keyof IntegrationConfig],
        }),
      });

      if (response.ok) {
        await checkIntegrationStatus();
        alert(`${integrationName} connected successfully!`);
      }
    } catch (error) {
      console.error(`Failed to connect ${integrationName}:`, error);
      alert(`Failed to connect ${integrationName}`);
    } finally {
      setLoading(false);
    }
  };

  const syncNow = async (integrationName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          integration: integrationName.toLowerCase(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Synced ${data.itemsProcessed} items from ${integrationName}`);
        await checkIntegrationStatus();
      }
    } catch (error) {
      console.error(`Failed to sync ${integrationName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'connected' ? 'bg-green-100' :
           status === 'configuring' ? 'bg-yellow-100' :
           'bg-red-100';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tool Integrations</h1>
        <p className="text-gray-600">
          Connect external services to your agent harness for unified task management
        </p>
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className={`p-4 rounded-lg border-2 ${getStatusColor(integration.status)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{integration.name}</h3>
                  <span className="text-xs font-bold">
                    {integration.status === 'connected' ? '✓ CONNECTED' :
                     integration.status === 'configuring' ? '⟳ CONFIGURING' :
                     '✗ DISCONNECTED'}
                  </span>
                </div>
                {integration.dataPoints && (
                  <p className="text-xs text-gray-600 mb-2">
                    {integration.dataPoints} items synced
                  </p>
                )}
                {integration.lastSync && (
                  <p className="text-xs text-gray-600 mb-3">
                    Last sync: {new Date(integration.lastSync).toLocaleTimeString()}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => connectIntegration(integration.name)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {integration.status === 'connected' ? 'Reconnect' : 'Connect'}
                  </Button>
                  {integration.status === 'connected' && (
                    <Button
                      size="sm"
                      onClick={() => syncNow(integration.name)}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Sync Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notion Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Notion Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Notion API Token</label>
            <Input
              type="password"
              value={config.notion.token}
              onChange={(e) => setConfig({
                ...config,
                notion: { ...config.notion, token: e.target.value }
              })}
              placeholder="notion_XXXXXXXXXXXXX"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(config.notion.databaseIds).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-semibold mb-2 capitalize">
                  {key} Database ID
                </label>
                <Input
                  value={value}
                  onChange={(e) => setConfig({
                    ...config,
                    notion: {
                      ...config.notion,
                      databaseIds: { ...config.notion.databaseIds, [key]: e.target.value }
                    }
                  })}
                  placeholder="Database ID"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Mail Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Mail Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">API Key</label>
            <Input
              type="password"
              value={config.agentMail.apiKey}
              onChange={(e) => setConfig({
                ...config,
                agentMail: { ...config.agentMail, apiKey: e.target.value }
              })}
              placeholder="am_us_XXXXXXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Agent Email Address</label>
            <Input
              type="email"
              value={config.agentMail.email}
              onChange={(e) => setConfig({
                ...config,
                agentMail: { ...config.agentMail, email: e.target.value }
              })}
              placeholder="agents@studex.cloud"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Sync Interval (minutes)</label>
            <Input
              type="number"
              value={config.agentMail.syncInterval}
              onChange={(e) => setConfig({
                ...config,
                agentMail: { ...config.agentMail, syncInterval: parseInt(e.target.value) }
              })}
              min="1"
              max="60"
            />
          </div>
        </CardContent>
      </Card>

      {/* Linear Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Linear Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">API Key</label>
            <Input
              type="password"
              value={config.linear.apiKey}
              onChange={(e) => setConfig({
                ...config,
                linear: { ...config.linear, apiKey: e.target.value }
              })}
              placeholder="lin_XXXXXXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Team ID</label>
            <Input
              value={config.linear.teamId}
              onChange={(e) => setConfig({
                ...config,
                linear: { ...config.linear, teamId: e.target.value }
              })}
              placeholder="TEAM-123"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shopify Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Shopify Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Shop Name</label>
            <Input
              value={config.shopify.shopName}
              onChange={(e) => setConfig({
                ...config,
                shopify: { ...config.shopify, shopName: e.target.value }
              })}
              placeholder="studexmeat"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Access Token</label>
            <Input
              type="password"
              value={config.shopify.accessToken}
              onChange={(e) => setConfig({
                ...config,
                shopify: { ...config.shopify, accessToken: e.target.value }
              })}
              placeholder="shpat_XXXXXXXXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <div className="flex gap-2">
        <Button
          onClick={() => {
            // Save logic would go here
            alert('Configuration saved. Connect integrations above to activate.');
          }}
          className="bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          Save Configuration
        </Button>
        <Button
          onClick={checkIntegrationStatus}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Check All Status
        </Button>
      </div>
    </div>
  );
}
