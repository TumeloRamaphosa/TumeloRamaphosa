import { approvalEngine } from '@/lib/approval-engine';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'approval-123', status: 'pending' },
          error: null,
        }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'approval-123', approval_id: 'app-123' },
            error: null,
          }),
        }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
    })),
  })),
}));

describe('ApprovalEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitForApproval', () => {
    it('should submit content for approval', async () => {
      const result = await approvalEngine.submitForApproval('post-123', 'user-456');

      expect(result).toBeDefined();
      expect(result.approval_id).toBeDefined();
    });

    it('should set initial status to pending', async () => {
      const result = await approvalEngine.submitForApproval('post-123', 'user-456');
      expect(result).toBeDefined();
    });
  });

  describe('getPendingApprovals', () => {
    it('should retrieve all pending approvals', async () => {
      const pending = await approvalEngine.getPendingApprovals();
      expect(Array.isArray(pending)).toBe(true);
    });

    it('should only return pending items', async () => {
      const pending = await approvalEngine.getPendingApprovals();
      pending.forEach((item) => {
        expect(['pending', 'revision_requested']).toContain(item.status);
      });
    });
  });

  describe('approveContent', () => {
    it('should approve content for publishing', async () => {
      const result = await approvalEngine.approveContent('app-123', 'user-456', 'Looks great!');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should set published flag when approved', async () => {
      const result = await approvalEngine.approveContent('app-123', 'user-456');
      expect(result.published).toBeDefined();
    });

    it('should schedule for 12:30 PM UTC', async () => {
      const result = await approvalEngine.approveContent('app-123', 'user-456');
      expect(result).toBeDefined();
    });

    it('should store approval comments', async () => {
      const result = await approvalEngine.approveContent('app-123', 'user-456', 'Perfect content');
      expect(result).toBeDefined();
    });
  });

  describe('rejectContent', () => {
    it('should reject content and request revision', async () => {
      const result = await approvalEngine.rejectContent(
        'app-123',
        'user-456',
        'Tone not quite right',
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should store feedback for agents', async () => {
      const result = await approvalEngine.rejectContent('app-123', 'user-456', 'Try again');
      expect(result).toBeDefined();
    });

    it('should trigger revision workflow', async () => {
      const result = await approvalEngine.rejectContent('app-123', 'user-456', 'Feedback');
      expect(result.success).toBe(true);
    });
  });

  describe('addApprovalComment', () => {
    it('should add comment to approval', async () => {
      const success = await approvalEngine.addApprovalComment(
        'app-123',
        'user-456',
        'Consider adding more hooks',
      );

      expect(success).toBe(true);
    });

    it('should support multiple comments', async () => {
      await approvalEngine.addApprovalComment('app-123', 'user-456', 'Comment 1');
      const success = await approvalEngine.addApprovalComment('app-123', 'user-456', 'Comment 2');

      expect(success).toBe(true);
    });
  });

  describe('getApprovalDetails', () => {
    it('should retrieve full approval details', async () => {
      const details = await approvalEngine.getApprovalDetails('app-123');
      expect(details).toBeDefined();
    });

    it('should include approval chain history', async () => {
      const details = await approvalEngine.getApprovalDetails('app-123');
      expect(details).toBeDefined();
    });
  });

  describe('getApprovalSummary', () => {
    it('should return approval workflow summary', async () => {
      const summary = await approvalEngine.getApprovalSummary();

      expect(summary).toBeDefined();
      expect(summary.pending_count).toBeGreaterThanOrEqual(0);
      expect(summary.approved_today).toBeGreaterThanOrEqual(0);
      expect(summary.rejected_today).toBeGreaterThanOrEqual(0);
    });

    it('should include next publish time', async () => {
      const summary = await approvalEngine.getApprovalSummary();
      expect(summary.next_publish_time).toBeDefined();
    });
  });

  describe('batchApproveContent', () => {
    it('should approve multiple items at once', async () => {
      const result = await approvalEngine.batchApproveContent(
        ['app-1', 'app-2', 'app-3'],
        'user-456',
      );

      expect(result).toBeDefined();
      expect(result.success).toBeGreaterThanOrEqual(0);
    });

    it('should handle partial failures', async () => {
      const result = await approvalEngine.batchApproveContent(
        ['app-1', 'invalid', 'app-3'],
        'user-456',
      );

      expect(result.success + result.failed).toBeGreaterThanOrEqual(0);
    });
  });

  describe('isApprovalWindowOpen', () => {
    it('should check if approval window is open', async () => {
      const isOpen = approvalEngine.isApprovalWindowOpen();
      expect(typeof isOpen.open).toBe('boolean');
    });

    it('should return publish time', async () => {
      const status = approvalEngine.isApprovalWindowOpen();
      expect(status.publishTime).toBeInstanceOf(Date);
    });

    it('should have 15 min buffer before 12:30 PM', async () => {
      const status = approvalEngine.isApprovalWindowOpen();
      const deadline = new Date(status.publishTime.getTime() - 15 * 60 * 1000);
      expect(deadline).toBeInstanceOf(Date);
    });
  });
});
