'use client';

import React, { useState, useEffect } from 'react';

interface AgentStatus {
  agent_name: string;
  status: 'idle' | 'running' | 'waiting' | 'error';
  current_task_id?: string;
  last_heartbeat: string;
}

interface QueueStatus {
  total_pending: number;
  total_running: number;
  by_agent: Record<string, { pending: number; running: number }>;
}

interface ApprovalSummary {
  pending_count: number;
  approved_today: number;
  rejected_today: number;
  next_publish_time: string;
}

interface WorkflowStatus {
  agent_statuses: Record<string, string>;
  queue_status: QueueStatus;
  approval_summary: ApprovalSummary;
  time_to_publish: number;
}

export const CommandCenter: React.FC = () => {
  const [status, setStatus] = useState<WorkflowStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/agents/coordinator?action=status');
        if (!response.ok) throw new Error('Failed to fetch status');

        const data = await response.json();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Auto-refresh every 10 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(fetchStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (agentStatus: string) => {
    switch (agentStatus) {
      case 'idle':
        return 'bg-gray-100 text-gray-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeToPublish = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading command center...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="text-center p-8 text-gray-600">
        No status available
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Marketing Command Center
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time OS status & agent coordination
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* 4-Section Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Section 1: Agent Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Agent Status
          </h2>
          <div className="space-y-3">
            {Object.entries(status.agent_statuses).map(([agentName, agentStatus]) => (
              <div key={agentName} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{agentName}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agentStatus as string)}`}>
                  {agentStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Queue Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Task Queue
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Pending Tasks</span>
                <span className="font-semibold text-blue-600">
                  {status.queue_status.total_pending}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min((status.queue_status.total_pending / 10) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Running Tasks</span>
                <span className="font-semibold text-green-600">
                  {status.queue_status.total_running}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min((status.queue_status.total_running / 5) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Approvals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Content Approvals
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Pending Approval</span>
              <span className="font-semibold text-yellow-600">
                {status.approval_summary.pending_count}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Approved Today</span>
              <span className="font-semibold text-green-600">
                {status.approval_summary.approved_today}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Rejected Today</span>
              <span className="font-semibold text-red-600">
                {status.approval_summary.rejected_today}
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Time to Publish */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Next Publish
          </h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {formatTimeToPublish(status.time_to_publish)}
            </div>
            <p className="text-gray-600 text-sm">
              Until {new Date(status.approval_summary.next_publish_time).toLocaleTimeString()}
            </p>
            <div className="mt-4 px-4 py-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                ✓ Daily publish: 12:30 PM UTC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium">
            Start Cycle
          </button>
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium">
            View Approvals
          </button>
          <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium">
            Competitive Data
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};
