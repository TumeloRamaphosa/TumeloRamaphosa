import { ScrollWorldProject, Scene, Generation } from './database.types';

export class ScrollWorldClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string = '/api/scroll-world', token: string = '') {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Projects
  async getProjects(workspaceId: string): Promise<ScrollWorldProject[]> {
    const data = await this.request(`/projects?workspace_id=${workspaceId}`);
    return data.projects;
  }

  async createProject(
    workspaceId: string,
    projectData: Partial<ScrollWorldProject>
  ): Promise<ScrollWorldProject> {
    const data = await this.request('/projects', {
      method: 'POST',
      body: JSON.stringify({
        workspace_id: workspaceId,
        ...projectData,
      }),
    });
    return data.project;
  }

  async getProject(projectId: string): Promise<ScrollWorldProject> {
    const data = await this.request(`/projects/${projectId}`);
    return data.project;
  }

  async updateProject(
    projectId: string,
    updates: Partial<ScrollWorldProject>
  ): Promise<ScrollWorldProject> {
    const data = await this.request(`/projects/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return data.project;
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Scenes
  async addScene(projectId: string, sceneData: Partial<Scene>): Promise<Scene> {
    const data = await this.request(`/projects/${projectId}/scenes`, {
      method: 'POST',
      body: JSON.stringify(sceneData),
    });
    return data.scene;
  }

  async updateScene(
    projectId: string,
    sceneId: string,
    updates: Partial<Scene>
  ): Promise<Scene> {
    const data = await this.request(`/projects/${projectId}/scenes/${sceneId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return data.scene;
  }

  async deleteScene(projectId: string, sceneId: string): Promise<void> {
    await this.request(`/projects/${projectId}/scenes/${sceneId}`, {
      method: 'DELETE',
    });
  }

  // Generation
  async startGeneration(
    projectId: string,
    sceneIds?: string[]
  ): Promise<Generation[]> {
    const data = await this.request('/generate', {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId,
        scene_ids: sceneIds,
      }),
    });
    return data.generations;
  }

  async getGeneration(generationId: string): Promise<Generation> {
    const data = await this.request(`/generations/${generationId}`);
    return data.generation;
  }

  async getGenerations(projectId: string): Promise<Generation[]> {
    const data = await this.request(`/projects/${projectId}/generations`);
    return data.generations;
  }

  // Publishing
  async publishProject(projectId: string): Promise<any> {
    const data = await this.request(`/publish/${projectId}`, {
      method: 'POST',
    });
    return data;
  }

  async getPublishedWorld(publishedId: string): Promise<any> {
    const data = await this.request(`/worlds/${publishedId}`);
    return data;
  }

  async trackWorldView(publishedId: string): Promise<void> {
    await this.request(`/worlds/${publishedId}/track`, {
      method: 'POST',
    });
  }

  // Billing
  async getUsage(workspaceId: string): Promise<any> {
    const data = await this.request(`/usage?workspace_id=${workspaceId}`);
    return data;
  }

  async getPlans(): Promise<any[]> {
    const data = await this.request('/plans');
    return data.plans;
  }

  async subscribe(workspaceId: string, planId: string): Promise<any> {
    const data = await this.request('/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        workspace_id: workspaceId,
        plan_id: planId,
      }),
    });
    return data;
  }

  async cancelSubscription(workspaceId: string): Promise<any> {
    const data = await this.request('/cancel', {
      method: 'POST',
      body: JSON.stringify({ workspace_id: workspaceId }),
    });
    return data;
  }
}

// Export singleton instance for use in components
export function createScrollWorldClient(token?: string): ScrollWorldClient {
  return new ScrollWorldClient('/api/scroll-world', token);
}
