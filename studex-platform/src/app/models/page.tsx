'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocalModel {
  id: string;
  name: string;
  size: string;
  speed: 'ultra-fast' | 'fast' | 'balanced' | 'slow';
  accuracy: 'high' | 'medium' | 'low';
  platforms: string[];
  installed: boolean;
  downloadUrl?: string;
}

interface DeviceRecommendation {
  device: string;
  recommended: string[];
  rationale: string;
}

const LOCAL_MODELS: LocalModel[] = [
  {
    id: 'gemma3-1b-it',
    name: 'Gemma3-1B-IT',
    size: '584MB',
    speed: 'ultra-fast',
    accuracy: 'medium',
    platforms: ['iPhone', 'iPad', 'Android'],
    installed: false,
  },
  {
    id: 'qwen2.5',
    name: 'Qwen2.5',
    size: '1.6GB',
    speed: 'fast',
    accuracy: 'high',
    platforms: ['MacBook', 'Linux', 'Windows'],
    installed: false,
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    size: '1.8GB',
    speed: 'fast',
    accuracy: 'high',
    platforms: ['MacBook', 'Linux', 'Windows'],
    installed: false,
  },
  {
    id: 'gemma-4-e4b-it',
    name: 'Gemma-4-E4B-it',
    size: '3.7GB',
    speed: 'balanced',
    accuracy: 'high',
    platforms: ['MacBook Pro', 'Linux', 'Windows'],
    installed: false,
  },
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 (8B)',
    size: '4.7GB',
    speed: 'balanced',
    accuracy: 'high',
    platforms: ['MacBook Pro', 'Linux', 'Windows'],
    installed: false,
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    size: '3.5GB',
    speed: 'balanced',
    accuracy: 'high',
    platforms: ['MacBook Pro', 'Linux', 'Windows'],
    installed: false,
  },
  {
    id: 'neural-chat-7b',
    name: 'Neural Chat 7B',
    size: '3.8GB',
    speed: 'balanced',
    accuracy: 'medium',
    platforms: ['MacBook', 'Linux', 'Windows'],
    installed: false,
  },
];

const DEVICE_RECOMMENDATIONS: DeviceRecommendation[] = [
  {
    device: 'iPhone / iPad',
    recommended: ['Gemma3-1B-IT'],
    rationale: 'Ultra-lightweight (584MB) for airplane mode and offline operation. Sufficient intelligence for basic tasks.',
  },
  {
    device: 'MacBook Pro M1 Max',
    recommended: ['Gemma-4-E4B-it', 'DeepSeek-R1', 'Qwen2.5'],
    rationale: 'Primary: Gemma-4-E4B-it (3.7GB) for full capability. Secondary: DeepSeek-R1 (1.8GB) and Qwen2.5 (1.6GB) for fast responses and specialized tasks.',
  },
  {
    device: 'Virtual Machines',
    recommended: ['Claude API (Primary)', 'Llama 3.1 (8B)', 'Mistral 7B'],
    rationale: 'Use Claude API as primary for cloud VMs. Local models as fallback for offline scenarios and cost optimization.',
  },
];

export default function ModelsPage() {
  const [models, setModels] = useState<LocalModel[]>(LOCAL_MODELS);
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [blotatoKey, setBlotatoKey] = useState('');
  const [connectivityMode, setConnectivityMode] = useState<'offline' | 'hybrid' | 'online'>('hybrid');
  const [ollamaStatus, setOllamaStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  useEffect(() => {
    testOllamaConnection();
  }, [ollamaUrl]);

  const testOllamaConnection = async () => {
    setOllamaStatus('testing');
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`, { method: 'GET' });
      if (response.ok) {
        setOllamaStatus('connected');
      } else {
        setOllamaStatus('disconnected');
      }
    } catch {
      setOllamaStatus('disconnected');
    }
  };

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    );
  };

  const installModel = async (modelId: string) => {
    try {
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'install',
          modelId,
          ollamaUrl,
        }),
      });

      if (response.ok) {
        setModels((prev) =>
          prev.map((m) => (m.id === modelId ? { ...m, installed: true } : m))
        );
      }
    } catch (error) {
      console.error('Failed to install model:', error);
    }
  };

  const saveConfiguration = async () => {
    try {
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-config',
          ollamaUrl,
          blotatoKey,
          connectivityMode,
          selectedModels,
        }),
      });

      if (response.ok) {
        alert('Configuration saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Local Model Configuration</h1>
        <p className="text-gray-600">
          Manage local AI models for offline and hybrid operation on your devices
        </p>
      </div>

      {/* Connection Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Backend Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Ollama Server URL</label>
            <div className="flex gap-2">
              <Input
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                placeholder="http://localhost:11434"
              />
              <Button onClick={testOllamaConnection}>Test</Button>
            </div>
            <p className={`text-xs mt-1 ${
              ollamaStatus === 'connected' ? 'text-green-600' :
              ollamaStatus === 'testing' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              Status: {ollamaStatus === 'connected' ? '✓ Connected' : ollamaStatus === 'testing' ? 'Testing...' : '✗ Disconnected'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Blotato API Key (Optional)</label>
            <Input
              type="password"
              value={blotatoKey}
              onChange={(e) => setBlotatoKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Connectivity Mode</label>
            <div className="flex gap-4">
              {(['offline', 'hybrid', 'online'] as const).map((mode) => (
                <label key={mode} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={connectivityMode === mode}
                    onChange={() => setConnectivityMode(mode)}
                  />
                  <span className="capitalize">{mode}</span>
                  <span className="text-xs text-gray-500">
                    {mode === 'offline' && '(Local only)'}
                    {mode === 'hybrid' && '(Local + Cloud fallback)'}
                    {mode === 'online' && '(Cloud primary)'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Device Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DEVICE_RECOMMENDATIONS.map((rec) => (
              <div key={rec.device} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{rec.device}</h3>
                <div className="flex gap-2 mb-2">
                  {rec.recommended.map((model) => (
                    <span key={model} className="bg-blue-100 px-2 py-1 rounded text-sm">
                      {model}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{rec.rationale}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Models */}
      <Card>
        <CardHeader>
          <CardTitle>Available Local Models ({models.filter((m) => m.installed).length}/{models.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {models.map((model) => (
              <div
                key={model.id}
                className="p-4 border rounded-lg hover:bg-gray-50 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedModels.includes(model.id)}
                      onChange={() => toggleModelSelection(model.id)}
                      className="w-4 h-4"
                    />
                    <h3 className="font-semibold">{model.name}</h3>
                    {model.installed && <span className="text-xs bg-green-100 px-2 py-1 rounded">Installed</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap text-xs mb-2">
                    <span className="bg-gray-100 px-2 py-1 rounded">{model.size}</span>
                    <span className={`px-2 py-1 rounded ${
                      model.speed === 'ultra-fast' ? 'bg-green-100' :
                      model.speed === 'fast' ? 'bg-green-100' :
                      'bg-yellow-100'
                    }`}>
                      Speed: {model.speed}
                    </span>
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      Accuracy: {model.accuracy}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Platforms: {model.platforms.join(', ')}
                  </p>
                </div>
                {!model.installed && (
                  <Button
                    onClick={() => installModel(model.id)}
                    className="ml-4"
                  >
                    Install
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connectivity Modes Info */}
      <Card>
        <CardHeader>
          <CardTitle>Connectivity Modes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold text-sm">Offline Mode</p>
            <p className="text-xs text-gray-600">Uses only local models. Perfect for airplane mode and isolated environments. Latency: ~50-500ms</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-semibold text-sm">Hybrid Mode (Recommended)</p>
            <p className="text-xs text-gray-600">Primary: Local models. Fallback: Claude API for complex tasks. Optimizes cost and responsiveness. Latency: ~100-2000ms</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="font-semibold text-sm">Online Mode</p>
            <p className="text-xs text-gray-600">Primary: Claude API for maximum intelligence. Fallback: Local models if offline. Latency: ~500-3000ms</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <div className="flex gap-2">
        <Button
          onClick={saveConfiguration}
          className="bg-green-600 hover:bg-green-700"
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
