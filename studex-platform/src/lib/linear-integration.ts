// Linear integration for project and task tracking
import { Task } from './priority-engine';

interface LinearIssue {
  id: string;
  title: string;
  description?: string;
  state: string;
  priority: number;
  dueDate?: string;
  teamId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export class LinearIntegration {
  private apiKey: string;
  private baseUrl: string = 'https://api.linear.app/graphql';
  private isConnected: boolean = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.LINEAR_API_KEY || '';
  }

  async connect(): Promise<boolean> {
    try {
      const query = `
        query {
          viewer {
            id
          }
        }
      `;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        this.isConnected = !data.errors;
        return this.isConnected;
      }
      return false;
    } catch {
      return false;
    }
  }

  async getTeams(): Promise<LinearTeam[]> {
    try {
      const query = `
        query {
          teams {
            nodes {
              id
              name
              key
            }
          }
        }
      `;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.teams.nodes;
      }
      return [];
    } catch {
      return [];
    }
  }

  async createIssue(
    teamId: string,
    title: string,
    description: string,
    priority: number = 2,
    dueDate?: Date
  ): Promise<string> {
    try {
      const query = `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            issue {
              id
            }
          }
        }
      `;

      const variables = {
        input: {
          teamId,
          title,
          description,
          priority,
          dueDate: dueDate?.toISOString().split('T')[0],
        },
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.issueCreate.issue.id;
      }
      return '';
    } catch {
      return '';
    }
  }

  async getIssuesForTeam(teamId: string): Promise<LinearIssue[]> {
    try {
      const query = `
        query GetTeamIssues($teamId: String!) {
          team(id: $teamId) {
            issues {
              nodes {
                id
                title
                description
                state {
                  name
                }
                priority
                dueDate
                createdAt
                updatedAt
              }
            }
          }
        }
      `;

      const variables = { teamId };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.team.issues.nodes.map((issue: any) => ({
          id: issue.id,
          title: issue.title,
          description: issue.description,
          state: issue.state.name,
          priority: issue.priority,
          dueDate: issue.dueDate,
          teamId,
          createdAt: new Date(issue.createdAt),
          updatedAt: new Date(issue.updatedAt),
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  async updateIssueState(issueId: string, newState: string): Promise<boolean> {
    try {
      const query = `
        mutation UpdateIssue($input: IssueUpdateInput!) {
          issueUpdate(input: $input) {
            issue {
              id
            }
          }
        }
      `;

      const variables = {
        input: {
          id: issueId,
          stateId: newState,
        },
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  linearIssueToPriorityTask(issue: LinearIssue): Task {
    const priorityMap = {
      4: 'high' as const,
      3: 'medium' as const,
      2: 'medium' as const,
      1: 'low' as const,
      0: 'low' as const,
    };

    return {
      id: `linear-${issue.id}`,
      title: issue.title,
      description: issue.description || '',
      dueDate: issue.dueDate ? new Date(issue.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      timeRequired: 60,
      priority: priorityMap[issue.priority as keyof typeof priorityMap] || 'medium',
      urgency: issue.state === 'Backlog' ? 'normal' : 'important',
      importance: priorityMap[issue.priority as keyof typeof priorityMap] || 'medium',
      status: issue.state === 'Done' ? 'completed' : issue.state === 'In Progress' ? 'in-progress' : 'pending',
      tags: ['linear', issue.teamId],
    };
  }

  async syncLinearIssuesToTasks(teamId: string): Promise<Task[]> {
    const issues = await this.getIssuesForTeam(teamId);
    return issues.map((issue) => this.linearIssueToPriorityTask(issue));
  }

  isReady(): boolean {
    return this.isConnected && this.apiKey.length > 0;
  }
}

// Singleton instance
export const linearIntegration = new LinearIntegration();
