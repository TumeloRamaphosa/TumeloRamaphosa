import { NextRequest, NextResponse } from 'next/server';
import { gmailService } from '@/lib/gmail-service';
import { priorityEngine } from '@/lib/priority-engine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');

  try {
    if (accessToken && refreshToken) {
      await gmailService.initialize(accessToken, refreshToken);
    }

    if (action === 'inbox-summary') {
      const summary = await gmailService.getInboxSummary();
      return NextResponse.json(summary);
    }

    if (action === 'fetch-emails') {
      const maxResults = searchParams.get('maxResults') || '10';
      const emails = await gmailService.fetchEmails(parseInt(maxResults));
      return NextResponse.json(emails);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, accessToken, refreshToken } = body;

    if (accessToken && refreshToken) {
      await gmailService.initialize(accessToken, refreshToken);
    }

    if (type === 'create-tasks-from-emails') {
      const emails = await gmailService.fetchEmails(data.maxEmails || 10);
      const tasks = await gmailService.createTasksFromEmails(emails);

      // Add tasks to priority engine
      for (const task of tasks) {
        task.dueDate = new Date(task.dueDate);
        priorityEngine.addTask(task);
      }

      return NextResponse.json({ success: true, taskCount: tasks.length, tasks });
    }

    if (type === 'analyze-email') {
      const analysis = await gmailService.analyzeEmail(data.email);
      return NextResponse.json(analysis);
    }

    if (type === 'archive-email') {
      const archived = await gmailService.archiveEmail(data.emailId);
      return NextResponse.json({ success: archived });
    }

    if (type === 'sync-inbox') {
      const summary = await gmailService.getInboxSummary();
      const emails = await gmailService.fetchEmails(data.maxEmails || 20);
      const tasks = await gmailService.createTasksFromEmails(emails);

      for (const task of tasks) {
        task.dueDate = new Date(task.dueDate);
        priorityEngine.addTask(task);
      }

      return NextResponse.json({
        success: true,
        inboxSummary: summary,
        tasksCreated: tasks.length,
        emails: emails.length,
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
