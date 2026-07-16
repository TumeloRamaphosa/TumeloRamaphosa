'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmailPreview {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  timestamp: Date;
  importance: 'high' | 'medium' | 'low';
  actionItems: number;
}

export function GmailInbox() {
  const [emails, setEmails] = useState<EmailPreview[]>([]);
  const [inboxSummary, setInboxSummary] = useState({ total: 0, unread: 0, urgent: 0 });
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    loadInboxSummary();
  }, []);

  const loadInboxSummary = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/gmail?action=inbox-summary&accessToken=${accessToken}`
      );
      const data = await response.json();
      setInboxSummary(data);
    } catch (error) {
      console.error('Failed to load inbox summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncEmails = async () => {
    if (!accessToken) {
      alert('Please authenticate with Gmail first');
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch('/api/gmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sync-inbox',
          accessToken,
          data: { maxEmails: 20 },
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(`✅ Synced! Created ${result.tasksCreated} tasks from ${result.emails} emails`);
        loadInboxSummary();
      }
    } catch (error) {
      console.error('Failed to sync emails:', error);
      alert('Failed to sync inbox');
    } finally {
      setSyncing(false);
    }
  };

  const handleGoogleAuth = () => {
    // This would trigger Google OAuth flow
    alert('Google OAuth integration needed - placeholder for auth implementation');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Email Integration</h2>
      </div>

      {/* Authentication */}
      {!accessToken && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="mb-4 text-gray-700">
              Connect your Gmail account to automatically convert emails into tasks.
            </p>
            <Button onClick={handleGoogleAuth}>
              🔐 Connect Google Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Inbox Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Inbox Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{inboxSummary.total}</p>
              <p className="text-sm text-gray-600">Total Emails</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{inboxSummary.unread}</p>
              <p className="text-sm text-gray-600">Unread</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{inboxSummary.urgent}</p>
              <p className="text-sm text-gray-600">Urgent</p>
            </div>
          </div>

          {accessToken && (
            <Button
              onClick={handleSyncEmails}
              disabled={syncing}
              className="w-full"
            >
              {syncing ? '⏳ Syncing...' : '📨 Sync Inbox → Tasks'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Sample Emails */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Emails</CardTitle>
        </CardHeader>
        <CardContent>
          {emails.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {accessToken ? 'No emails loaded' : 'Connect Gmail to view emails'}
            </p>
          ) : (
            <div className="space-y-3">
              {emails.map(email => (
                <div key={email.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{email.subject}</h3>
                      <p className="text-sm text-gray-600">From: {email.from}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      email.importance === 'high' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {email.importance}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{email.snippet}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      📋 {email.actionItems} action items
                    </span>
                    <span className="text-gray-500">
                      {new Date(email.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</span>
            <div>
              <p className="font-semibold">Connect Gmail</p>
              <p className="text-sm text-gray-600">Authenticate with your Google account</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</span>
            <div>
              <p className="font-semibold">Analyze Emails</p>
              <p className="text-sm text-gray-600">AI extracts action items automatically</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</span>
            <div>
              <p className="font-semibold">Create Tasks</p>
              <p className="text-sm text-gray-600">Tasks added to your daily priorities</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
