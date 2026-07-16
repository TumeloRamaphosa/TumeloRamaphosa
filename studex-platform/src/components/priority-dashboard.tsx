'use client';

import { useState, useEffect } from 'react';
import { DailyRoutine, Task, Objective } from '@/lib/priority-engine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function PriorityDashboard() {
  const [routine, setRoutine] = useState<DailyRoutine | null>(null);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', timeRequired: 30 });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Load daily routine
  useEffect(() => {
    loadDailyRoutine();
  }, [selectedDate]);

  const loadDailyRoutine = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/priority?action=daily-routine&date=${selectedDate}`);
      const data = await response.json();
      setRoutine(data);
    } catch (error) {
      console.error('Failed to load routine:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title) return;

    try {
      const response = await fetch('/api/priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'add-task',
          data: {
            id: `task-${Date.now()}`,
            title: newTask.title,
            description: newTask.description,
            dueDate: selectedDate,
            timeRequired: newTask.timeRequired,
            priority: 'medium',
            urgency: 'important',
            importance: 'high',
            status: 'pending',
            tags: [],
          },
        }),
      });

      if (response.ok) {
        setNewTask({ title: '', description: '', timeRequired: 30 });
        loadDailyRoutine();
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'complete-task',
          data: { taskId },
        }),
      });

      if (response.ok) {
        loadDailyRoutine();
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading your daily routine...</div>;
  }

  if (!routine) {
    return <div className="p-6 text-center">No routine found for this date.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Daily Priority System</h1>
        <div className="flex gap-4 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <p className="text-lg font-semibold">
            {routine.priorities.length} priority tasks • {Math.round(routine.totalAvailableTime / 60)}h available
          </p>
        </div>
      </div>

      {/* Add Task Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <Textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Time required (minutes)"
              value={newTask.timeRequired}
              onChange={(e) => setNewTask({ ...newTask, timeRequired: parseInt(e.target.value) })}
              className="w-48"
            />
            <Button onClick={handleAddTask}>Add Task</Button>
          </div>
        </CardContent>
      </Card>

      {/* Prioritized Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Prioritized Tasks ({routine.priorities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routine.priorities.map((task, index) => (
              <div
                key={task.id}
                className="p-4 border rounded-lg hover:bg-gray-50 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-semibold bg-blue-100 px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <h3 className="font-semibold">{task.title}</h3>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {task.timeRequired}min
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-red-100 px-2 py-1 rounded">
                      Urgency: {task.urgency}
                    </span>
                    <span className="bg-orange-100 px-2 py-1 rounded">
                      Importance: {task.importance}
                    </span>
                    <span className="bg-green-100 px-2 py-1 rounded">
                      Score: {Math.round(task.score)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => handleCompleteTask(task.id)}
                  className={task.status === 'completed' ? 'bg-green-600' : ''}
                >
                  {task.status === 'completed' ? '✓ Done' : 'Complete'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Blocks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {routine.timeBlocks.map((block) => (
              <div
                key={block.id}
                className={`p-3 rounded-lg ${
                  block.type === 'break'
                    ? 'bg-purple-100'
                    : block.type === 'meeting'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{block.title}</p>
                    <p className="text-sm text-gray-600">
                      {block.startTime.toLocaleTimeString()} - {block.endTime.toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-xs bg-white px-2 py-1 rounded">{block.type}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{routine.tasks.length}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {routine.tasks.filter((t) => t.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {Math.round(
                  ((routine.tasks.filter((t) => t.status === 'completed').length || 0) / routine.tasks.length) * 100
                )}
                %
              </p>
              <p className="text-sm text-gray-600">Completion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
