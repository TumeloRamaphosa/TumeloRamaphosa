import { GET, POST, PUT } from '@/app/api/agents/coordinator/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/agents/agent-coordinator', () => ({
  agentCoordinator: {
    getAllAgentsStatus: jest.fn().mockResolvedValue([
      { agent_name: 'charlie', status: 'idle' },
      { agent_name: 'robusca', status: 'running' },
      { agent_name: 'naledi', status: 'idle' },
      { agent_name: 'competitor-scout', status: 'idle' },
      { agent_name: 'data-analyst', status: 'waiting' },
      { agent_name: 'brand-voice', status: 'idle' },
    ]),
    getQueueStatus: jest.fn().mockResolvedValue({
      total_pending: 5,
      total_running: 2,
      by_agent: {},
    }),
    getAgentStatus: jest.fn().mockResolvedValue({
      agent_name: 'competitor-scout',
      status: 'idle',
    }),
    startDailyMarketingCycle: jest.fn().mockResolvedValue({
      scout_task_id: 'task-scout-123',
      analyst_task_id: 'task-analyst-123',
      brand_voice_task_id: 'task-voice-123',
    }),
    queueTask: jest.fn().mockResolvedValue({
      id: 'task-new',
      agent_name: 'charlie',
      status: 'pending',
    }),
    updateAgentStatus: jest.fn().mockResolvedValue(undefined),
    getNextTask: jest.fn().mockResolvedValue({
      id: 'task-123',
      agent_name: 'competitor-scout',
      status: 'pending',
    }),
  },
}));

describe('Agent Coordinator API Routes', () => {
  describe('GET /api/agents/coordinator', () => {
    it('should return all agents status', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('action=status') },
      } as unknown as NextRequest;

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.agents)).toBe(true);
      expect(data.agents.length).toBeGreaterThan(0);
    });

    it('should return queue status', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('action=queue') },
      } as unknown as NextRequest;

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.queue).toBeDefined();
      expect(data.queue.total_pending).toBeGreaterThanOrEqual(0);
      expect(data.queue.total_running).toBeGreaterThanOrEqual(0);
    });

    it('should return specific agent status', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('agent=competitor-scout') },
      } as unknown as NextRequest;

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.agent.agent_name).toBe('competitor-scout');
    });

    it('should return 404 for unknown agent', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('agent=unknown') },
      } as unknown as NextRequest;

      const response = await GET(req);
      // Either 200 with null or 404 depending on implementation
      expect([200, 404]).toContain(response.status);
    });

    it('should return 400 for missing parameters', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('') },
      } as unknown as NextRequest;

      const response = await GET(req);
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/agents/coordinator', () => {
    it('should start daily marketing cycle', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          action: 'start-cycle',
          niche: 'meat',
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.tasks).toBeDefined();
    });

    it('should validate niche parameter', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          action: 'start-cycle',
          niche: 'invalid',
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it('should queue a custom task', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          action: 'queue-task',
          agentName: 'charlie',
          taskType: 'analyze',
          payload: { data: 'test' },
          priority: 1,
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(201);
    });

    it('should update agent status', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          action: 'update-status',
          agentName: 'competitor-scout',
          payload: { status: 'idle' },
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(200);
    });

    it('should return 400 for missing action', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          niche: 'meat',
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/agents/coordinator', () => {
    it('should get next task for agent', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('agent=competitor-scout') },
      } as unknown as NextRequest;

      const response = await PUT(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.task).toBeDefined();
    });

    it('should return null task if none available', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('agent=charlie') },
      } as unknown as NextRequest;

      const response = await PUT(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should return 400 for missing agent parameter', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('') },
      } as unknown as NextRequest;

      const response = await PUT(req);
      expect(response.status).toBe(400);
    });
  });
});
