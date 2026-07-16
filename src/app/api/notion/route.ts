import { NextRequest, NextResponse } from 'next/server';
import { notionService } from '@/lib/notion-service';
import { priorityEngine } from '@/lib/priority-engine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const accessToken = searchParams.get('accessToken');
  const databaseId = searchParams.get('databaseId');

  try {
    if (accessToken) {
      await notionService.initialize(accessToken);
    }

    if (action === 'query-tasks' && databaseId) {
      const tasks = await notionService.queryDatabase(databaseId);
      return NextResponse.json(tasks);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, accessToken } = body;

    if (accessToken) {
      await notionService.initialize(accessToken);
    }

    if (type === 'create-tasks-database') {
      const db = await notionService.createTasksDatabase(data.parentPageId);
      return NextResponse.json({ success: true, database: db });
    }

    if (type === 'create-diary-database') {
      const db = await notionService.createDiaryDatabase(data.parentPageId);
      return NextResponse.json({ success: true, database: db });
    }

    if (type === 'add-task') {
      const taskId = await notionService.addTask(data.databaseId, data.task);
      return NextResponse.json({ success: true, pageId: taskId });
    }

    if (type === 'add-diary-entry') {
      const entryId = await notionService.addDiaryEntry(
        data.databaseId,
        new Date(data.date),
        data.summary,
        data.tasksCompleted,
        data.tasksTotal,
        data.notes,
        data.mood,
        data.energyLevel
      );
      return NextResponse.json({ success: true, pageId: entryId });
    }

    if (type === 'sync-tasks') {
      const allData = priorityEngine.exportData();
      const createdTasks = [];

      for (const task of allData.tasks) {
        try {
          const taskId = await notionService.addTask(data.databaseId, {
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            status: task.status as 'todo' | 'in-progress' | 'done' | 'blocked',
            priority: task.priority,
            tags: task.tags,
          });
          createdTasks.push(taskId);
        } catch (error) {
          console.error(`Failed to sync task ${task.id}:`, error);
        }
      }

      return NextResponse.json({
        success: true,
        tasksSynced: createdTasks.length,
        totalTasks: allData.tasks.length,
      });
    }

    if (type === 'update-task-status') {
      const success = await notionService.updateTaskStatus(data.pageId, data.status);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
