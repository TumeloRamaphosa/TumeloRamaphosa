'use client';

import { useState } from 'react';
import { PriorityDashboard } from '@/components/priority-dashboard';
import { GmailInbox } from '@/components/gmail-inbox';
import { NotionStorage } from '@/components/notion-storage';

type TabType = 'priorities' | 'gmail' | 'notion';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('priorities');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'priorities', label: 'Daily Priorities', icon: '📋' },
    { id: 'gmail', label: 'Gmail Inbox', icon: '📧' },
    { id: 'notion', label: 'Notion Storage', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-semibold transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'priorities' && <PriorityDashboard />}
        {activeTab === 'gmail' && <GmailInbox />}
        {activeTab === 'notion' && <NotionStorage />}
      </div>
    </div>
  );
}
