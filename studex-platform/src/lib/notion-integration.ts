// Notion integration for task and priority synchronization
import { Task, Objective, DailyRoutine } from './priority-engine';

interface NotionDatabase {
  id: string;
  name: string;
  type: 'tasks' | 'objectives' | 'diary' | 'email';
}

interface NotionPage {
  id: string;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
}

export class NotionIntegration {
  private notionToken: string;
  private databaseIds: Map<string, string> = new Map();
  private isConnected: boolean = false;

  constructor(notionToken?: string) {
    this.notionToken = notionToken || process.env.NOTION_TOKEN || '';
  }

  async connect(): Promise<boolean> {
    try {
      const response = await fetch('https://api.notion.com/v1/databases', {
        headers: {
          Authorization: `Bearer ${this.notionToken}`,
          'Notion-Version': '2022-06-28',
        },
      });

      if (response.ok) {
        this.isConnected = true;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async createTasksDatabase(): Promise<string> {
    const payload = {
      parent: { type: 'workspace', workspace: true },
      title: [
        {
          type: 'text',
          text: { content: 'StudEx Tasks' },
        },
      ],
      properties: {
        Title: { title: {} },
        Description: { rich_text: {} },
        Status: {
          select: {
            options: [
              { name: 'Pending', color: 'yellow' },
              { name: 'In Progress', color: 'blue' },
              { name: 'Completed', color: 'green' },
              { name: 'Blocked', color: 'red' },
            ],
          },
        },
        Priority: {
          select: {
            options: [
              { name: 'High', color: 'red' },
              { name: 'Medium', color: 'orange' },
              { name: 'Low', color: 'green' },
            ],
          },
        },
        Urgency: {
          select: {
            options: [
              { name: 'Urgent', color: 'red' },
              { name: 'Important', color: 'orange' },
              { name: 'Normal', color: 'blue' },
            ],
          },
        },
        'Due Date': { date: {} },
        'Time Required': { number: { format: 'number' } },
        Tags: { multi_select: {} },
        'Score': { number: { format: 'number' } },
      },
    };

    try {
      const response = await fetch('https://api.notion.com/v1/databases', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        this.databaseIds.set('tasks', data.id);
        return data.id;
      }
      return '';
    } catch {
      return '';
    }
  }

  async syncTaskToNotion(task: Task, databaseId: string): Promise<string> {
    const payload = {
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [{ type: 'text', text: { content: task.title } }],
        },
        Description: {
          rich_text: [{ type: 'text', text: { content: task.description } }],
        },
        Status: {
          select: {
            name: task.status === 'completed' ? 'Completed' : task.status === 'in-progress' ? 'In Progress' : task.status === 'blocked' ? 'Blocked' : 'Pending',
          },
        },
        Priority: {
          select: { name: task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low' },
        },
        Urgency: {
          select: { name: task.urgency === 'urgent' ? 'Urgent' : task.urgency === 'important' ? 'Important' : 'Normal' },
        },
        'Due Date': {
          date: { start: task.dueDate.toISOString().split('T')[0] },
        },
        'Time Required': {
          number: task.timeRequired,
        },
        Tags: {
          multi_select: task.tags.map((tag) => ({ name: tag })),
        },
      },
    };

    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        return data.id;
      }
      return '';
    } catch {
      return '';
    }
  }

  async syncDailyRoutineToNotion(routine: DailyRoutine, databaseId: string): Promise<void> {
    for (const task of routine.tasks) {
      if (task.status !== 'completed') {
        await this.syncTaskToNotion(task, databaseId);
      }
    }
  }

  async createDiaryEntry(date: Date, notes: string, summary: string, completionRate: number): Promise<string> {
    const diaryDbId = this.databaseIds.get('diary') || '';
    if (!diaryDbId) return '';

    const payload = {
      parent: { database_id: diaryDbId },
      properties: {
        Title: {
          title: [{ type: 'text', text: { content: `Daily Summary - ${date.toDateString()}` } }],
        },
        Date: {
          date: { start: date.toISOString().split('T')[0] },
        },
        Notes: {
          rich_text: [{ type: 'text', text: { content: notes } }],
        },
        Summary: {
          rich_text: [{ type: 'text', text: { content: summary } }],
        },
        'Completion Rate': {
          number: completionRate,
        },
      },
    };

    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        return data.id;
      }
      return '';
    } catch {
      return '';
    }
  }

  setDatabaseId(type: string, id: string): void {
    this.databaseIds.set(type, id);
  }

  getDatabaseId(type: string): string | undefined {
    return this.databaseIds.get(type);
  }

  isReady(): boolean {
    return this.isConnected && this.notionToken.length > 0;
  }
}

// Singleton instance
export const notionIntegration = new NotionIntegration();
