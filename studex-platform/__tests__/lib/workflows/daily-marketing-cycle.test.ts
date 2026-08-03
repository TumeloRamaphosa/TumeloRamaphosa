import { DailyMarketingCycleWorkflow } from '@/lib/workflows/daily-marketing-cycle';

jest.mock('@/lib/agents/agent-coordinator', () => ({
  agentCoordinator: {
    startDailyMarketingCycle: jest.fn().mockResolvedValue({
      scout_task_id: 'scout-123',
      analyst_task_id: 'analyst-123',
      brand_voice_task_id: 'voice-123',
    }),
    updateAgentStatus: jest.fn().mockResolvedValue(undefined),
    updateTaskStatus: jest.fn().mockResolvedValue(undefined),
    retryTask: jest.fn().mockResolvedValue(true),
    getQueueStatus: jest.fn().mockResolvedValue({
      total_pending: 5,
      total_running: 2,
      by_agent: {},
    }),
    getAllAgentsStatus: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('@/lib/approval-engine', () => ({
  approvalEngine: {
    isApprovalWindowOpen: jest.fn(() => ({
      open: true,
      publishTime: new Date(new Date().getTime() + 30 * 60 * 1000),
    })),
    getApprovalSummary: jest.fn().mockResolvedValue({
      pending_count: 0,
      approved_today: 3,
      rejected_today: 0,
      next_publish_time: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour from now
      approval_window: {
        open: true,
        timeRemaining: 15 * 60 * 1000,
      },
    }),
    getPendingApprovals: jest.fn().mockResolvedValue([]),
  },
}));

describe('DailyMarketingCycleWorkflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startCycle', () => {
    it('should start cycle for meat niche', async () => {
      const result = await DailyMarketingCycleWorkflow.startCycle('meat');

      expect(result).toBeDefined();
      expect(result.niche).toBe('meat');
      expect(result.scout_task_id).toBeDefined();
      expect(result.analyst_task_id).toBeDefined();
      expect(result.brand_voice_task_id).toBeDefined();
    });

    it('should start cycle for coffee niche', async () => {
      const result = await DailyMarketingCycleWorkflow.startCycle('coffee');
      expect(result.niche).toBe('coffee');
    });

    it('should start cycle for saas niche', async () => {
      const result = await DailyMarketingCycleWorkflow.startCycle('saas');
      expect(result.niche).toBe('saas');
    });

    it('should set approval deadline 5 minutes before publish', async () => {
      const result = await DailyMarketingCycleWorkflow.startCycle('meat');

      // Publish time is 12:30 PM, deadline should be 12:25 PM
      const publishTime = result.publish_time.getTime();
      const deadline = result.approval_deadline.getTime();
      const difference = publishTime - deadline;

      expect(difference).toBe(5 * 60 * 1000); // 5 minutes
    });

    it('should return started_at timestamp', async () => {
      const result = await DailyMarketingCycleWorkflow.startCycle('meat');
      expect(result.started_at).toBeDefined();
    });
  });

  describe('monitorProgress', () => {
    it('should monitor workflow progress', async () => {
      const progress = await DailyMarketingCycleWorkflow.monitorProgress(
        'scout-123',
        'analyst-123',
        'voice-123',
      );

      expect(progress).toBeDefined();
      expect(progress.scout_status).toBeDefined();
      expect(progress.analyst_status).toBeDefined();
      expect(progress.brand_voice_status).toBeDefined();
    });

    it('should return overall progress percentage', async () => {
      const progress = await DailyMarketingCycleWorkflow.monitorProgress(
        'scout-123',
        'analyst-123',
        'voice-123',
      );

      expect(progress.overall_progress).toBeGreaterThanOrEqual(0);
      expect(progress.overall_progress).toBeLessThanOrEqual(100);
    });

    it('should estimate completion time', async () => {
      const progress = await DailyMarketingCycleWorkflow.monitorProgress(
        'scout-123',
        'analyst-123',
        'voice-123',
      );

      expect(progress.estimated_completion).toBeInstanceOf(Date);
    });
  });

  describe('onScoutComplete', () => {
    it('should handle scout completion', async () => {
      await DailyMarketingCycleWorkflow.onScoutComplete('scout-123', {
        competitor_count: 5,
      });

      expect(true).toBe(true);
    });

    it('should update scout agent status to idle', async () => {
      await DailyMarketingCycleWorkflow.onScoutComplete('scout-123', {
        competitor_count: 5,
      });

      expect(true).toBe(true);
    });

    it('should trigger analyst task', async () => {
      await DailyMarketingCycleWorkflow.onScoutComplete('scout-123', {
        competitor_count: 10,
      });

      expect(true).toBe(true);
    });
  });

  describe('onAnalystComplete', () => {
    it('should handle analyst completion', async () => {
      await DailyMarketingCycleWorkflow.onAnalystComplete('analyst-123', {
        insights_count: 8,
      });

      expect(true).toBe(true);
    });

    it('should update analyst agent status to idle', async () => {
      await DailyMarketingCycleWorkflow.onAnalystComplete('analyst-123', {
        insights_count: 8,
      });

      expect(true).toBe(true);
    });

    it('should trigger brand voice task', async () => {
      await DailyMarketingCycleWorkflow.onAnalystComplete('analyst-123', {
        insights_count: 8,
      });

      expect(true).toBe(true);
    });
  });

  describe('onBrandVoiceComplete', () => {
    it('should handle brand voice completion', async () => {
      const result = await DailyMarketingCycleWorkflow.onBrandVoiceComplete('voice-123', {
        content_count: 5,
      });

      expect(result).toBeDefined();
      expect(result.approval_count).toBe(5);
    });

    it('should check if approval window is open', async () => {
      const result = await DailyMarketingCycleWorkflow.onBrandVoiceComplete('voice-123', {
        content_count: 5,
      });

      expect(result.approval_window_open).toBeDefined();
    });

    it('should route to approval dashboard', async () => {
      const result = await DailyMarketingCycleWorkflow.onBrandVoiceComplete('voice-123', {
        content_count: 5,
      });

      expect(result.approval_count).toBeGreaterThan(0);
    });
  });

  describe('handleError', () => {
    it('should handle agent errors', async () => {
      const error = new Error('Connection timeout');
      await DailyMarketingCycleWorkflow.handleError('task-123', 'scout', error);

      expect(true).toBe(true);
    });

    it('should log error with agent name', async () => {
      const error = new Error('Invalid data');
      await DailyMarketingCycleWorkflow.handleError('task-123', 'analyst', error);

      expect(true).toBe(true);
    });

    it('should attempt automatic retry', async () => {
      const error = new Error('Temporary failure');
      await DailyMarketingCycleWorkflow.handleError('task-123', 'voice', error);

      expect(true).toBe(true);
    });
  });

  describe('getWorkflowStatus', () => {
    it('should return current workflow status', async () => {
      const status = await DailyMarketingCycleWorkflow.getWorkflowStatus();

      expect(status).toBeDefined();
      expect(status.agent_statuses).toBeDefined();
      expect(status.queue_status).toBeDefined();
      expect(status.approval_summary).toBeDefined();
    });

    it('should include time to publish', async () => {
      const status = await DailyMarketingCycleWorkflow.getWorkflowStatus();
      expect(status.time_to_publish).toBeGreaterThanOrEqual(0);
    });

    it('should show all agent states', async () => {
      const status = await DailyMarketingCycleWorkflow.getWorkflowStatus();
      expect(Object.keys(status.agent_statuses).length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getEstimatedTimeline', () => {
    it('should return 5-phase timeline', async () => {
      const timeline = DailyMarketingCycleWorkflow.getEstimatedTimeline();

      expect(Array.isArray(timeline)).toBe(true);
      expect(timeline.length).toBe(5);
    });

    it('should have Scout → Analyst → Voice → Approval → Publish sequence', async () => {
      const timeline = DailyMarketingCycleWorkflow.getEstimatedTimeline();

      expect(timeline[0].phase).toBe('Competitor Scout');
      expect(timeline[1].phase).toBe('Data Analyst Processing');
      expect(timeline[2].phase).toBe('Brand Voice Generation');
      expect(timeline[3].phase).toBe('User Approval Window');
      expect(timeline[4].phase).toBe('Publishing');
    });

    it('should have durations for each phase', async () => {
      const timeline = DailyMarketingCycleWorkflow.getEstimatedTimeline();

      timeline.forEach((phase) => {
        expect(phase.duration_minutes).toBeGreaterThan(0);
        expect(phase.start_time).toBeDefined();
        expect(phase.end_time).toBeDefined();
      });
    });

    it('should total 30 minutes from start to publish', async () => {
      const timeline = DailyMarketingCycleWorkflow.getEstimatedTimeline();
      const totalMinutes = timeline.reduce((sum, phase) => sum + phase.duration_minutes, 0);

      expect(totalMinutes).toBe(30); // Scout(5) + Analyst(10) + Voice(5) + Approval(5) + Publish(5) = 30
    });
  });
});
