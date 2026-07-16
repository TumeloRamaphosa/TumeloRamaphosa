import { NextRequest, NextResponse } from 'next/server';
import { priorityEngine, Task, Objective } from '@/lib/priority-engine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const date = searchParams.get('date');

  try {
    if (action === 'daily-routine' && date) {
      const routine = priorityEngine.generateDailyRoutine(new Date(date));
      return NextResponse.json(routine);
    }

    if (action === 'tasks-for-date' && date) {
      const tasks = priorityEngine.getTasksForDate(new Date(date));
      return NextResponse.json(tasks);
    }

    if (action === 'export') {
      const data = priorityEngine.exportData();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'add-task') {
      const task: Task = {
        ...data,
        dueDate: new Date(data.dueDate),
      };
      priorityEngine.addTask(task);
      return NextResponse.json({ success: true, task });
    }

    if (type === 'add-objective') {
      const objective: Objective = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      };
      priorityEngine.addObjective(objective);
      return NextResponse.json({ success: true, objective });
    }

    if (type === 'complete-task') {
      priorityEngine.completeTask(data.taskId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
