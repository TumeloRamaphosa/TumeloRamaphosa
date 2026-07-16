'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SyncStatus {
  tasksSynced: number;
  lastSync?: Date;
}

export function NotionStorage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tasksDatabaseId, setTasksDatabaseId] = useState<string | null>(null);
  const [diaryDatabaseId, setDiaryDatabaseId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [diaryNotes, setDiaryNotes] = useState('');
  const [mood, setMood] = useState('😐');
  const [energyLevel, setEnergyLevel] = useState(5);

  const handleNotionAuth = () => {
    alert('Notion OAuth integration needed - placeholder for auth implementation');
  };

  const handleCreateDatabases = async () => {
    if (!accessToken) {
      alert('Please authenticate with Notion first');
      return;
    }

    setSyncing(true);
    try {
      // Create tasks database
      const tasksResponse = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'create-tasks-database',
          accessToken,
          data: { parentPageId: 'your-page-id' },
        }),
      });

      const tasksDb = await tasksResponse.json();
      if (tasksDb.database) {
        setTasksDatabaseId(tasksDb.database.id);
      }

      // Create diary database
      const diaryResponse = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'create-diary-database',
          accessToken,
          data: { parentPageId: 'your-page-id' },
        }),
      });

      const diaryDb = await diaryResponse.json();
      if (diaryDb.database) {
        setDiaryDatabaseId(diaryDb.database.id);
      }

      alert('✅ Databases created successfully!');
    } catch (error) {
      console.error('Failed to create databases:', error);
      alert('Failed to create databases');
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncTasks = async () => {
    if (!accessToken || !tasksDatabaseId) {
      alert('Please create tasks database first');
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sync-tasks',
          accessToken,
          data: { databaseId: tasksDatabaseId },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSyncStatus({
          tasksSynced: result.tasksSynced,
          lastSync: new Date(),
        });
        alert(`✅ Synced ${result.tasksSynced} tasks to Notion!`);
      }
    } catch (error) {
      console.error('Failed to sync tasks:', error);
      alert('Failed to sync tasks');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateDiaryEntry = async () => {
    if (!accessToken || !diaryDatabaseId) {
      alert('Please create diary database first');
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'add-diary-entry',
          accessToken,
          data: {
            databaseId: diaryDatabaseId,
            date: new Date().toISOString(),
            summary: 'Daily reflection',
            tasksCompleted: 5,
            tasksTotal: 8,
            notes: diaryNotes,
            mood,
            energyLevel,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('✅ Diary entry created!');
        setDiaryNotes('');
        setMood('😐');
        setEnergyLevel(5);
      }
    } catch (error) {
      console.error('Failed to create diary entry:', error);
      alert('Failed to create diary entry');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Notion Storage</h2>
        <p className="text-gray-600">Persist all tasks, diaries, and insights to your Notion workspace</p>
      </div>

      {/* Authentication */}
      {!accessToken && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="mb-4 text-gray-700">
              Connect your Notion workspace to automatically sync all tasks and diary entries.
            </p>
            <Button onClick={handleNotionAuth}>
              🔐 Connect Notion
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Setup */}
      {accessToken && !tasksDatabaseId && (
        <Card>
          <CardHeader>
            <CardTitle>Set Up Databases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Create Notion databases for tasks and daily diaries.
            </p>
            <Button
              onClick={handleCreateDatabases}
              disabled={syncing}
              className="w-full"
            >
              {syncing ? '⏳ Creating...' : '📚 Create Databases'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sync Status */}
      {tasksDatabaseId && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Sync Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncStatus && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-700">✅ Last Sync: {syncStatus.lastSync?.toLocaleTimeString()}</p>
                    <p className="text-sm text-green-600">{syncStatus.tasksSynced} tasks synced</p>
                  </div>
                )}
                <Button
                  onClick={handleSyncTasks}
                  disabled={syncing}
                  className="w-full"
                >
                  {syncing ? '⏳ Syncing...' : '🔄 Sync All Tasks'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Diary Entry */}
          {diaryDatabaseId && (
            <Card>
              <CardHeader>
                <CardTitle>Today's Diary Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Mood</label>
                  <div className="flex gap-2">
                    {['😀', '😐', '😔'].map(m => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`text-2xl p-2 rounded ${mood === m ? 'bg-blue-100' : 'bg-gray-100'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Energy Level (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">{energyLevel}/10</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Notes</label>
                  <Textarea
                    placeholder="Reflect on your day..."
                    value={diaryNotes}
                    onChange={(e) => setDiaryNotes(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <Button
                  onClick={handleCreateDiaryEntry}
                  disabled={syncing}
                  className="w-full"
                >
                  {syncing ? '⏳ Saving...' : '📝 Save Diary Entry'}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</span>
            <div>
              <p className="font-semibold">Connect Notion</p>
              <p className="text-sm text-gray-600">Authenticate with your Notion workspace</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</span>
            <div>
              <p className="font-semibold">Create Databases</p>
              <p className="text-sm text-gray-600">Set up tasks and diary databases automatically</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</span>
            <div>
              <p className="font-semibold">Auto Sync</p>
              <p className="text-sm text-gray-600">Tasks sync to Notion, diaries are archived daily</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
