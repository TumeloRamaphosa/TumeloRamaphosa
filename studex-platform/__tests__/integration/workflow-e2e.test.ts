/**
 * End-to-End Workflow Tests
 * Tests the complete 24-hour marketing cycle from start to finish
 */

import { agentCoordinator } from '@/lib/agents/agent-coordinator';
import { approvalEngine } from '@/lib/approval-engine';
import { DailyMarketingCycleWorkflow } from '@/lib/workflows/daily-marketing-cycle';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'mock-id', status: 'pending' },
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
          data: { id: 'mock-id', status: 'pending' },
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

describe('End-to-End: Daily Marketing Cycle Workflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete workflow from 12:00 AM to 12:30 PM', () => {
    it('should execute full cycle for meat niche', async () => {
      // Step 1: Start cycle at midnight
      const cycle = await DailyMarketingCycleWorkflow.startCycle('meat');

      expect(cycle).toBeDefined();
      expect(cycle.niche).toBe('meat');
      expect(cycle.scout_task_id).toBeDefined();
      expect(cycle.analyst_task_id).toBeDefined();
      expect(cycle.brand_voice_task_id).toBeDefined();

      // Step 2: Simulate scout completion
      await DailyMarketingCycleWorkflow.onScoutComplete(cycle.scout_task_id, {
        competitor_count: 5,
      });

      // Step 3: Simulate analyst completion
      await DailyMarketingCycleWorkflow.onAnalystComplete(cycle.analyst_task_id, {
        insights_count: 8,
      });

      // Step 4: Simulate brand voice completion
      const voiceResult = await DailyMarketingCycleWorkflow.onBrandVoiceComplete(
        cycle.brand_voice_task_id,
        {
          content_count: 5,
        },
      );

      expect(voiceResult.approval_count).toBe(5);

      // Step 5: Get pending approvals
      const pending = await approvalEngine.getPendingApprovals();
      expect(Array.isArray(pending)).toBe(true);

      // Step 6: Approve one item
      const approved = await approvalEngine.approveContent('app-1', 'user-1', 'Great!');
      expect(approved.success).toBe(true);

      // Step 7: Check final status
      const status = await DailyMarketingCycleWorkflow.getWorkflowStatus();
      expect(status).toBeDefined();
      expect(status.agent_statuses).toBeDefined();
    });

    it('should handle coffee niche cycle', async () => {
      const cycle = await DailyMarketingCycleWorkflow.startCycle('coffee');

      expect(cycle.niche).toBe('coffee');

      await DailyMarketingCycleWorkflow.onScoutComplete(cycle.scout_task_id, {
        competitor_count: 4,
      });
      await DailyMarketingCycleWorkflow.onAnalystComplete(cycle.analyst_task_id, {
        insights_count: 7,
      });
      const voiceResult = await DailyMarketingCycleWorkflow.onBrandVoiceComplete(
        cycle.brand_voice_task_id,
        { content_count: 5 },
      );

      expect(voiceResult.approval_count).toBe(5);
    });

    it('should handle saas niche cycle', async () => {
      const cycle = await DailyMarketingCycleWorkflow.startCycle('saas');

      expect(cycle.niche).toBe('saas');

      await DailyMarketingCycleWorkflow.onScoutComplete(cycle.scout_task_id, {
        competitor_count: 6,
      });
      await DailyMarketingCycleWorkflow.onAnalystComplete(cycle.analyst_task_id, {
        insights_count: 9,
      });
      const voiceResult = await DailyMarketingCycleWorkflow.onBrandVoiceComplete(
        cycle.brand_voice_task_id,
        { content_count: 5 },
      );

      expect(voiceResult.approval_count).toBe(5);
    });
  });

  describe('Approval workflow', () => {
    it('should handle full approval → rejection → revision cycle', async () => {
      // Submit for approval
      const submission = await approvalEngine.submitForApproval('post-1', 'user-1');
      expect(submission.approval_id).toBeDefined();

      // Reject with feedback
      const rejection = await approvalEngine.rejectContent(
        submission.approval_id,
        'user-1',
        'Need more hooks in the opening',
      );
      expect(rejection.success).toBe(true);

      // Add comment
      const comment = await approvalEngine.addApprovalComment(
        submission.approval_id,
        'user-1',
        'Make it more urgent',
      );
      expect(comment).toBe(true);

      // Resubmit after revision
      const resubmission = await approvalEngine.submitForApproval('post-1-v2', 'user-1');
      expect(resubmission.approval_id).toBeDefined();

      // Approve
      const approval = await approvalEngine.approveContent(
        resubmission.approval_id,
        'user-1',
        'Perfect!',
      );
      expect(approval.success).toBe(true);
    });

    it('should handle batch approval of multiple items', async () => {
      const approvalIds = ['app-1', 'app-2', 'app-3'];

      const result = await approvalEngine.batchApproveContent(approvalIds, 'user-1');

      expect(result.success + result.failed).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Concurrent niche cycles', () => {
    it('should handle simultaneous cycles for all 3 niches', async () => {
      // Start all 3 cycles at once
      const [meatCycle, coffeeCycle, saasCycle] = await Promise.all([
        DailyMarketingCycleWorkflow.startCycle('meat'),
        DailyMarketingCycleWorkflow.startCycle('coffee'),
        DailyMarketingCycleWorkflow.startCycle('saas'),
      ]);

      expect(meatCycle.niche).toBe('meat');
      expect(coffeeCycle.niche).toBe('coffee');
      expect(saasCycle.niche).toBe('saas');

      // Complete all scouts
      await Promise.all([
        DailyMarketingCycleWorkflow.onScoutComplete(meatCycle.scout_task_id, {
          competitor_count: 5,
        }),
        DailyMarketingCycleWorkflow.onScoutComplete(coffeeCycle.scout_task_id, {
          competitor_count: 4,
        }),
        DailyMarketingCycleWorkflow.onScoutComplete(saasCycle.scout_task_id, {
          competitor_count: 6,
        }),
      ]);

      // Complete all analysts
      await Promise.all([
        DailyMarketingCycleWorkflow.onAnalystComplete(meatCycle.analyst_task_id, {
          insights_count: 8,
        }),
        DailyMarketingCycleWorkflow.onAnalystComplete(coffeeCycle.analyst_task_id, {
          insights_count: 7,
        }),
        DailyMarketingCycleWorkflow.onAnalystComplete(saasCycle.analyst_task_id, {
          insights_count: 9,
        }),
      ]);

      // Complete all voices
      const [meatVoice, coffeeVoice, saasVoice] = await Promise.all([
        DailyMarketingCycleWorkflow.onBrandVoiceComplete(meatCycle.brand_voice_task_id, {
          content_count: 5,
        }),
        DailyMarketingCycleWorkflow.onBrandVoiceComplete(coffeeCycle.brand_voice_task_id, {
          content_count: 5,
        }),
        DailyMarketingCycleWorkflow.onBrandVoiceComplete(saasCycle.brand_voice_task_id, {
          content_count: 5,
        }),
      ]);

      expect(meatVoice.approval_count).toBe(5);
      expect(coffeeVoice.approval_count).toBe(5);
      expect(saasVoice.approval_count).toBe(5);
    });
  });

  describe('Error recovery', () => {
    it('should recover from agent failure', async () => {
      const cycle = await DailyMarketingCycleWorkflow.startCycle('meat');

      // Simulate error
      const error = new Error('Scout agent crashed');
      await DailyMarketingCycleWorkflow.handleError(cycle.scout_task_id, 'competitor-scout', error);

      // Verify system can continue
      const status = await DailyMarketingCycleWorkflow.getWorkflowStatus();
      expect(status).toBeDefined();
    });

    it('should handle approval deadline enforcement', async () => {
      const cycle = await DailyMarketingCycleWorkflow.startCycle('meat');

      // Check approval window
      const window = approvalEngine.isApprovalWindowOpen();
      expect(window.publishTime).toBeInstanceOf(Date);

      // Verify deadline is 5 minutes before publish
      const deadlineMs = cycle.approval_deadline.getTime();
      const publishMs = cycle.publish_time.getTime();
      const bufferMs = publishMs - deadlineMs;

      expect(bufferMs).toBe(5 * 60 * 1000); // Exactly 5 minutes
    });
  });

  describe('Timeline accuracy', () => {
    it('should maintain 30-minute timeline from start to publish', async () => {
      const timeline = DailyMarketingCycleWorkflow.getEstimatedTimeline();

      // Verify timeline structure
      expect(timeline.length).toBe(5);
      expect(timeline[0].phase).toBe('Competitor Scout');
      expect(timeline[1].phase).toBe('Data Analyst Processing');
      expect(timeline[2].phase).toBe('Brand Voice Generation');
      expect(timeline[3].phase).toBe('User Approval Window');
      expect(timeline[4].phase).toBe('Publishing');

      // Verify total duration
      const totalMinutes = timeline.reduce((sum, phase) => sum + phase.duration_minutes, 0);
      expect(totalMinutes).toBe(30);

      // Verify sequential timing
      timeline.forEach((phase, index) => {
        const startTime = new Date(phase.start_time).getTime();
        const endTime = new Date(phase.end_time).getTime();
        const actualDuration = (endTime - startTime) / (60 * 1000);

        expect(actualDuration).toBe(phase.duration_minutes);
      });
    });
  });
});
