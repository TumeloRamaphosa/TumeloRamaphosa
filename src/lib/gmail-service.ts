// Gmail Service: Email integration and task extraction

export interface Email {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  labels: string[];
  importance: 'high' | 'medium' | 'low';
  hasAttachments: boolean;
}

export interface ActionItem {
  text: string;
  owner?: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface EmailAnalysis {
  email: Email;
  actionItems: ActionItem[];
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  requiresResponse: boolean;
  suggestedTags: string[];
}

export class GmailService {
  private accessToken: string = '';
  private refreshToken: string = '';

  // Initialize with OAuth tokens
  async initialize(accessToken: string, refreshToken: string): Promise<void> {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  // Fetch recent emails
  async fetchEmails(maxResults: number = 10, query?: string): Promise<Email[]> {
    if (!this.accessToken) throw new Error('Gmail not authenticated');

    try {
      const endpoint = `https://www.googleapis.com/gmail/v1/users/me/messages`;
      const params = new URLSearchParams({
        maxResults: maxResults.toString(),
        ...(query && { q: query }),
      });

      const response = await fetch(`${endpoint}?${params}`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      if (!response.ok) throw new Error(`Gmail API error: ${response.status}`);

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      throw error;
    }
  }

  // Extract action items from email text using Claude
  async extractActionItems(emailText: string): Promise<ActionItem[]> {
    const prompt = `Extract action items from this email. Return as JSON array with fields: text, owner, dueDate, priority.
    
Email:
${emailText}

Return ONLY valid JSON array. Example format:
[
  {"text": "Review Q2 budget", "owner": "Finance team", "dueDate": "2024-08-01", "priority": "high"},
  {"text": "Send presentation", "owner": null, "dueDate": null, "priority": "medium"}
]`;

    try {
      // This would call Claude API
      // For now, return mock data
      return [
        {
          text: 'Sample action item from email',
          priority: 'medium',
        },
      ];
    } catch (error) {
      console.error('Failed to extract action items:', error);
      return [];
    }
  }

  // Categorize email importance
  private categorizePriority(subject: string, from: string, body: string): 'high' | 'medium' | 'low' {
    const urgentKeywords = ['urgent', 'asap', 'critical', 'emergency', 'important', 'deadline'];
    const combinedText = `${subject} ${body}`.toLowerCase();

    const hasUrgent = urgentKeywords.some(keyword => combinedText.includes(keyword));
    if (hasUrgent) return 'high';

    const hasDeadline = /due|deadline|by|before/i.test(combinedText);
    if (hasDeadline) return 'high';

    return 'medium';
  }

  // Analyze email for insights
  async analyzeEmail(email: Email): Promise<EmailAnalysis> {
    const actionItems = await this.extractActionItems(email.body);
    const importance = this.categorizePriority(email.subject, email.from, email.body);

    return {
      email: { ...email, importance },
      actionItems,
      summary: email.body.substring(0, 200),
      sentiment: 'neutral',
      requiresResponse: !email.isRead,
      suggestedTags: this.extractTags(email.subject, email.body),
    };
  }

  // Extract tags from email
  private extractTags(subject: string, body: string): string[] {
    const tags: string[] = [];
    const combinedText = `${subject} ${body}`.toLowerCase();

    // Check for project names
    if (combinedText.includes('project') || combinedText.includes('initiative')) tags.push('project');
    if (combinedText.includes('meeting') || combinedText.includes('standup')) tags.push('meeting');
    if (combinedText.includes('review') || combinedText.includes('feedback')) tags.push('review');
    if (combinedText.includes('update') || combinedText.includes('status')) tags.push('status-update');
    if (combinedText.includes('budget') || combinedText.includes('finance')) tags.push('finance');

    return tags;
  }

  // Create tasks from emails
  async createTasksFromEmails(emails: Email[]): Promise<any[]> {
    const tasks = [];

    for (const email of emails) {
      const analysis = await this.analyzeEmail(email);

      for (const actionItem of analysis.actionItems) {
        tasks.push({
          id: `task-${email.id}-${actionItem.text.substring(0, 20)}`,
          title: actionItem.text,
          description: `From: ${email.from}\nSubject: ${email.subject}`,
          dueDate: actionItem.dueDate || new Date(),
          timeRequired: 30,
          priority: actionItem.priority,
          urgency: analysis.requiresResponse ? 'urgent' : 'normal',
          importance: 'high',
          status: 'pending',
          tags: ['email', ...analysis.suggestedTags],
          source: 'gmail',
        });
      }
    }

    return tasks;
  }

  // Archive email
  async archiveEmail(emailId: string): Promise<boolean> {
    if (!this.accessToken) throw new Error('Gmail not authenticated');

    try {
      const response = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.accessToken}` },
          body: JSON.stringify({
            removeLabelIds: ['INBOX'],
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Failed to archive email:', error);
      return false;
    }
  }

  // Mark email as read
  async markAsRead(emailId: string): Promise<boolean> {
    if (!this.accessToken) throw new Error('Gmail not authenticated');

    try {
      const response = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.accessToken}` },
          body: JSON.stringify({
            addLabelIds: ['UNREAD'],
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Failed to mark email as read:', error);
      return false;
    }
  }

  // Get inbox summary
  async getInboxSummary(): Promise<{
    total: number;
    unread: number;
    urgent: number;
  }> {
    try {
      const allEmails = await this.fetchEmails(50);
      const unreadEmails = await this.fetchEmails(50, 'is:unread');
      const urgentEmails = await this.fetchEmails(50, '(urgent OR asap OR critical)');

      return {
        total: allEmails.length,
        unread: unreadEmails.length,
        urgent: urgentEmails.length,
      };
    } catch (error) {
      console.error('Failed to get inbox summary:', error);
      return { total: 0, unread: 0, urgent: 0 };
    }
  }
}

export const gmailService = new GmailService();
