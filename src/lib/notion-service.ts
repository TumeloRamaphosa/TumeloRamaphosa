// Notion Service: Database storage and synchronization

export interface NotionDatabase {
  id: string;
  name: string;
  createdTime: Date;
  lastEditedTime: Date;
}

export interface NotionTask {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  assignee?: string;
  completionRate?: number;
}

export interface NotionPage {
  id: string;
  title: string;
  createdTime: Date;
  lastEditedTime: Date;
  content: string;
  properties: Record<string, any>;
}

export class NotionService {
  private accessToken: string = '';
  private notionVersion: string = '2022-06-28';

  async initialize(accessToken: string): Promise<void> {
    this.accessToken = accessToken;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Notion-Version': this.notionVersion,
      'Content-Type': 'application/json',
    };
  }

  // Create a new database for tasks
  async createTasksDatabase(parentPageId: string): Promise<NotionDatabase> {
    if (!this.accessToken) throw new Error('Notion not authenticated');

    const payload = {
      parent: { page_id: parentPageId },
      title: [{ text: { content: 'Business Tasks' } }],
      properties: {
        'Title': { title: {} },
        'Description': { rich_text: {} },
        'Due Date': { date: {} },
        'Status': {
          select: {
            options: [
              { name: 'To Do', color: 'gray' },
              { name: 'In Progress', color: 'blue' },
              { name: 'Done', color: 'green' },
              { name: 'Blocked', color: 'red' },
            ],
          },
        },
        'Priority': {
          select: {
            options: [
              { name: 'High', color: 'red' },
              { name: 'Medium', color: 'yellow' },
              { name: 'Low', color: 'green' },
            ],
          },
        },
        'Tags': { multi_select: {} },
        'Assignee': { people: {} },
        'Source': { select: { options: [{ name: 'Email' }, { name: 'Manual' }, { name: 'Meeting' }] } },
      },
    };

    try {
      const response = await fetch('https://api.notion.com/v1/databases', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Notion API error: ${response.status}`);

      const data = await response.json();
      return {
        id: data.id,
        name: 'Business Tasks',
        createdTime: new Date(data.created_time),
        lastEditedTime: new Date(data.last_edited_time),
      };
    } catch (error) {
      console.error('Failed to create database:', error);
      throw error;
    }
  }

  // Create a new database for daily diaries
  async createDiaryDatabase(parentPageId: string): Promise<NotionDatabase> {
    if (!this.accessToken) throw new Error('Notion not authenticated');

    const payload = {
      parent: { page_id: parentPageId },
      title: [{ text: { content: 'Daily Diaries' } }],
      properties: {
        'Date': { title: {} },
        'Summary': { rich_text: {} },
        'Tasks Completed': { number: {} },
        'Tasks Total': { number: {} },
        'Completion Rate': { number: {} },
        'Mood': { select: { options: [{ name: '😀' }, { name: '😐' }, { name: '😔' }] } },
        'Energy Level': { number: {} },
        'Notes': { rich_text: {} },
      },
    };

    try {
      const response = await fetch('https://api.notion.com/v1/databases', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Notion API error: ${response.status}`);

      const data = await response.json();
      return {
        id: data.id,
        name: 'Daily Diaries',
        createdTime: new Date(data.created_time),
        lastEditedTime: new Date(data.last_edited_time),
      };
    } catch (error) {
      console.error('Failed to create diary database:', error);
      throw error;
    }
  }

  // Add task to Notion database
  async addTask(databaseId: string, task: NotionTask): Promise<string> {
    if (!this.accessToken) throw new Error('Notion not authenticated');

    const payload = {
      parent: { database_id: databaseId },
      properties: {
        'Title': { title: [{ text: { content: task.title } }] },
        'Description': { rich_text: [{ text: { content: task.description || '' } }] },
        'Due Date': task.dueDate ? { date: { start: task.dueDate.toISOString() } } : undefined,
        'Status': { select: { name: task.status } },
        'Priority': { select: { name: task.priority } },
        'Tags': {
          multi_select: task.tags.map(tag => ({ name: tag })),
        },
        'Assignee': task.assignee ? { people: [{ object: 'user', id: task.assignee }] } : undefined,
      },
    };

    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Notion API error: ${response.status}`);

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  }

  // Add diary entry to Notion
  async addDiaryEntry(
    databaseId: string,
    date: Date,
    summary: string,
    tasksCompleted: number,
    tasksTotal: number,
    notes: string,
    mood?: string,
    energyLevel?: number
  ): Promise<string> {
    if (!this.accessToken) throw new Error('Notion not authenticated');

    const completionRate = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

    const payload = {
      parent: { database_id: databaseId },
      properties: {
        'Date': { title: [{ text: { content: date.toLocaleDateString() } }] },
        'Summary': { rich_text: [{ text: { content: summary } }] },
        'Tasks Completed': { number: tasksCompleted },
        'Tasks Total': { number: tasksTotal },
        'Completion Rate': { number: Math.round(completionRate) },
        'Mood': mood ? { select: { name: mood } } : undefined,
        'Energy Level': energyLevel ? { number: energyLevel } : undefined,
        'Notes': { rich_text: [{ text: { content: notes } }] },
      },
    };

    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Notion API error: ${response.status}`);

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Failed to add diary entry:', error);
      throw error;
    }
  }

  // Update task status
  async updateTaskStatus(pageId: string, status: 'todo' | 'in-progress' | 'done' | 'blocked'): Promise<boolean> {
    if (!this.accessToken) throw new Error('Notion not authenticated');

    const payload = {
      properties: {
        'Status': { select: { name: status } },
      },
    };

    try {
      const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to update task:', error);
      return false;
    }
  }

  // Query database
  async queryDatabase(databaseId: string, filter?: any): Promise<NotionPage[]> {
    if (!this.accessToken) throw new Error('Notion not authenticated');

    const payload = filter ? { filter } : {};

    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Notion API error: ${response.status}`);

      const data = await response.json();
      return data.results.map((page: any) => ({
        id: page.id,
        title: page.properties.Title?.title[0]?.text?.content || '',
        createdTime: new Date(page.created_time),
        lastEditedTime: new Date(page.last_edited_time),
        content: page.properties.Description?.rich_text[0]?.text?.content || '',
        properties: page.properties,
      }));
    } catch (error) {
      console.error('Failed to query database:', error);
      return [];
    }
  }

  // Archive page
  async archivePage(pageId: string): Promise<boolean> {
    if (!this.accessToken) throw new Error('Notion not authenticated');

    try {
      const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ archived: true }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to archive page:', error);
      return false;
    }
  }
}

export const notionService = new NotionService();
