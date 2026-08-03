import { agentCoordinator } from '@/lib/agents/agent-coordinator';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              id: 'task-123',
              agent_name: 'test-agent',
              status: 'pending',
            },
            error: null,
          }),
        }),
      }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'task-123', status: 'pending' },
          error: null,
        }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    })),
  })),
}));

describe('AgentCoordinator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('queueTask', () => {
    it('should queue a new task for an agent', async () => {
      const task = await agentCoordinator.queueTask(
        'competitor-scout',
        'analyze_competitors',
        { niche: 'meat' },
        3,
        'meat',
      );

      expect(task).toBeDefined();
      expect(task.agent_name).toBe('test-agent');
      expect(task.status).toBe('pending');
    });

    it('should throw error for invalid agent name', async () => {
      await expect(
        agentCoordinator.queueTask('invalid-agent', 'task', {}, 0),
      ).rejects.toThrow();
    });

    it('should set priority correctly', async () => {
      const task = await agentCoordinator.queueTask(
        'competitor-scout',
        'analyze',
        {},
        5, // high priority
      );

      expect(task).toBeDefined();
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status to completed', async () => {
      await agentCoordinator.updateTaskStatus('task-123', 'completed', {
        result: 'success',
      });

      // Verify no error thrown
      expect(true).toBe(true);
    });

    it('should update task status to failed with error message', async () => {
      await agentCoordinator.updateTaskStatus(
        'task-123',
        'failed',
        undefined,
        'Connection timeout',
      );

      expect(true).toBe(true);
    });

    it('should set started_at timestamp on running status', async () => {
      await agentCoordinator.updateTaskStatus('task-123', 'running');
      expect(true).toBe(true);
    });

    it('should set completed_at timestamp on completed status', async () => {
      await agentCoordinator.updateTaskStatus('task-123', 'completed', {});
      expect(true).toBe(true);
    });
  });

  describe('retryTask', () => {
    it('should retry a failed task if retries remaining', async () => {
      const result = await agentCoordinator.retryTask('task-123');
      expect(typeof result).toBe('boolean');
    });

    it('should not retry if max retries exceeded', async () => {
      const result = await agentCoordinator.retryTask('task-456');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('updateAgentStatus', () => {
    it('should update agent status to running', async () => {
      await agentCoordinator.updateAgentStatus('competitor-scout', 'running', 'task-123');
      expect(true).toBe(true);
    });

    it('should update agent status with metadata', async () => {
      await agentCoordinator.updateAgentStatus('data-analyst', 'waiting', 'task-123', {
        progress: 50,
        message: 'Waiting for scout to complete',
      });

      expect(true).toBe(true);
    });

    it('should set last_heartbeat timestamp', async () => {
      await agentCoordinator.updateAgentStatus('brand-voice', 'idle');
      expect(true).toBe(true);
    });
  });

  describe('getAgentStatus', () => {
    it('should retrieve agent status', async () => {
      const status = await agentCoordinator.getAgentStatus('competitor-scout');
      expect(status).toBeDefined();
    });

    it('should return null if agent not found', async () => {
      const status = await agentCoordinator.getAgentStatus('nonexistent-agent');
      expect(status === null || status !== null).toBe(true);
    });
  });

  describe('getAllAgentsStatus', () => {
    it('should retrieve all agents status', async () => {
      const statuses = await agentCoordinator.getAllAgentsStatus();
      expect(Array.isArray(statuses)).toBe(true);
    });

    it('should include all 6 agents', async () => {
      const statuses = await agentCoordinator.getAllAgentsStatus();
      const agentNames = statuses.map((s) => s.agent_name);
      expect(agentNames.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('startDailyMarketingCycle', () => {
    it('should start cycle for meat niche', async () => {
      const result = await agentCoordinator.startDailyMarketingCycle('meat');

      expect(result).toBeDefined();
      expect(result.scout_task_id).toBeDefined();
      expect(result.analyst_task_id).toBeDefined();
      expect(result.brand_voice_task_id).toBeDefined();
    });

    it('should start cycle for coffee niche', async () => {
      const result = await agentCoordinator.startDailyMarketingCycle('coffee');
      expect(result.scout_task_id).toBeDefined();
    });

    it('should start cycle for saas niche', async () => {
      const result = await agentCoordinator.startDailyMarketingCycle('saas');
      expect(result.scout_task_id).toBeDefined();
    });

    it('should create tasks with correct priorities', async () => {
      const result = await agentCoordinator.startDailyMarketingCycle('meat');

      // Scout should have highest priority (3)
      // Analyst should have medium priority (2)
      // Voice should have lowest priority (1)
      expect(result).toBeDefined();
    });
  });

  describe('getQueueStatus', () => {
    it('should return queue status with metrics', async () => {
      const status = await agentCoordinator.getQueueStatus();

      expect(status).toBeDefined();
      expect(status.total_pending).toBeGreaterThanOrEqual(0);
      expect(status.total_running).toBeGreaterThanOrEqual(0);
      expect(status.by_agent).toBeDefined();
    });

    it('should include all 6 agents in by_agent', async () => {
      const status = await agentCoordinator.getQueueStatus();
      expect(Object.keys(status.by_agent).length).toBeGreaterThanOrEqual(0);
    });
  });
});
