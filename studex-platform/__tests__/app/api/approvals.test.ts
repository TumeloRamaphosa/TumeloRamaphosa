import { POST, GET } from '@/app/api/approvals/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/approval-engine', () => ({
  approvalEngine: {
    getPendingApprovals: jest.fn().mockResolvedValue([
      {
        id: 'app-1',
        status: 'pending',
        content_id: 'post-1',
      },
    ]),
    getApprovalSummary: jest.fn().mockResolvedValue({
      pending_count: 1,
      approved_today: 3,
      rejected_today: 0,
      next_publish_time: new Date(),
    }),
    submitForApproval: jest.fn().mockResolvedValue({
      approval_id: 'app-new',
    }),
    approveContent: jest.fn().mockResolvedValue({
      success: true,
      published: true,
    }),
    rejectContent: jest.fn().mockResolvedValue({
      success: true,
    }),
    addApprovalComment: jest.fn().mockResolvedValue(true),
    batchApproveContent: jest.fn().mockResolvedValue({
      success: 2,
      failed: 0,
    }),
  },
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({})),
}));

describe('Approvals API Routes', () => {
  describe('GET /api/approvals', () => {
    it('should return pending approvals', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('action=pending') },
      } as unknown as NextRequest;

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.pending)).toBe(true);
    });

    it('should return approval summary', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('action=summary') },
      } as unknown as NextRequest;

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.summary).toBeDefined();
    });

    it('should return 400 for missing action', async () => {
      const req = {
        nextUrl: { searchParams: new URLSearchParams('') },
      } as unknown as NextRequest;

      const response = await GET(req);
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/approvals', () => {
    it('should submit content for approval', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          action: 'submit',
          postId: 'post-1',
          userId: 'user-1',
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(201);
    });

    it('should approve content', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          action: 'approve',
          approvalId: 'app-1',
          userId: 'user-1',
          comments: 'Looks good',
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(200);
    });

    it('should reject content', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          action: 'reject',
          approvalId: 'app-1',
          userId: 'user-1',
          feedback: 'Try again',
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(200);
    });

    it('should batch approve multiple items', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          action: 'batch-approve',
          postIds: ['post-1', 'post-2'],
          userId: 'user-1',
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(200);
    });

    it('should add comment to approval', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          action: 'comment',
          approvalId: 'app-1',
          userId: 'user-1',
          comments: 'Add more hooks',
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(200);
    });

    it('should return 400 for missing action', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          postId: 'post-1',
        }),
      } as unknown as NextRequest;

      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });
});
