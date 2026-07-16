// Agent Mail integration for email-to-task automation
import { Task } from './priority-engine';

interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  received_at: Date;
  thread_id?: string;
}

interface ActionItem {
  description: string;
  deadline?: Date;
  assignee?: string;
  priority: 'high' | 'medium' | 'low';
}

export class AgentMailIntegration {
  private apiKey: string;
  private baseUrl: string = 'https://api.agentmail.to';
  private isConnected: boolean = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.AGENTMAIL_API_KEY || '';
  }

  async connect(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
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

  async fetchInbox(limit: number = 50): Promise<EmailMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/messages?limit=${limit}&status=unread`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.messages.map((msg: any) => ({
          id: msg.id,
          from: msg.from,
          to: msg.to,
          subject: msg.subject,
          body: msg.body,
          received_at: new Date(msg.received_at),
          thread_id: msg.thread_id,
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  extractActionItems(emailBody: string): ActionItem[] {
    const actionItems: ActionItem[] = [];

    // Simple pattern matching for action items
    const patterns = [
      /(?:action item|TODO|todo|URGENT|urgent|ASAP|asap)[:\s]+([^\n]+)/gi,
      /(?:please|pls)[:\s]+([^\n]+)/gi,
      /(?:need|required)[:\s]+([^\n]+)/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(emailBody)) !== null) {
        actionItems.push({
          description: match[1].trim(),
          priority: emailBody.toUpperCase().includes('URGENT') ? 'high' : 'medium',
        });
      }
    }

    return actionItems;
  }

  async parseEmailForTasks(email: EmailMessage): Promise<Task[]> {
    const actionItems = this.extractActionItems(email.body);
    const tasks: Task[] = [];

    for (const item of actionItems) {
      const task: Task = {
        id: `email-${email.id}-${tasks.length}`,
        title: item.description.substring(0, 100),
        description: `From: ${email.from}\nSubject: ${email.subject}\n\nFull email context:\n${email.body}`,
        dueDate: item.deadline || new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24h
        timeRequired: 30,
        priority: item.priority === 'high' ? 'high' : 'medium',
        urgency: item.priority === 'high' ? 'urgent' : 'important',
        importance: item.priority === 'high' ? 'high' : 'medium',
        status: 'pending',
        tags: ['email', 'action-item', email.from.split('@')[1]],
      };

      tasks.push(task);
    }

    return tasks;
  }

  async markAsRead(messageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/${messageId}/read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  async sendReply(messageId: string, body: string, threadId?: string): Promise<boolean> {
    try {
      const payload = {
        body,
        thread_id: threadId,
        in_reply_to: messageId,
      };

      const response = await fetch(`${this.baseUrl}/messages/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  async syncEmailsToTasks(onTaskCreated?: (task: Task) => void): Promise<Task[]> {
    const emails = await this.fetchInbox();
    const allTasks: Task[] = [];

    for (const email of emails) {
      const tasks = await this.parseEmailForTasks(email);
      allTasks.push(...tasks);

      // Callback for each created task
      for (const task of tasks) {
        onTaskCreated?.(task);
      }

      // Mark email as read
      await this.markAsRead(email.id);
    }

    return allTasks;
  }

  isReady(): boolean {
    return this.isConnected && this.apiKey.length > 0;
  }
}

// Singleton instance
export const agentMailIntegration = new AgentMailIntegration();
