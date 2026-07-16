'use client';

import { useState } from 'react';
import { PriorityDashboard } from '@/components/priority-dashboard';
import { GmailInbox } from '@/components/gmail-inbox';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'priorities' | 'gmail'>('priorities');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6">
          <button
            onClick={() => setActiveTab('priorities')}
            className={`font-semibold transition-colors ${
              activeTab === 'priorities'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Daily Priorities
          </button>
          <button
            onClick={() => setActiveTab('gmail')}
            className={`font-semibold transition-colors ${
              activeTab === 'gmail'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📧 Gmail Inbox
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'priorities' && <PriorityDashboard />}
        {activeTab === 'gmail' && <GmailInbox />}
      </div>
    </div>
  );
}
