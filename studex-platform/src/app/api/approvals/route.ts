import { NextRequest, NextResponse } from 'next/server';
import { approvalEngine } from '@/lib/approval-engine';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'pending') {
      // Get all pending approvals
      const pending = await approvalEngine.getPendingApprovals();
      return NextResponse.json({
        success: true,
        count: pending.length,
        pending,
      });
    }

    if (action === 'summary') {
      // Get approval workflow summary
      const summary = await approvalEngine.getApprovalSummary();
      return NextResponse.json({
        success: true,
        summary,
      });
    }

    return NextResponse.json(
      { error: 'Missing or invalid action parameter' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Failed to fetch approvals:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch approvals' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, postId, approvalId, userId, comments, feedback, postIds } = await request.json();

    if (action === 'submit') {
      // Submit content for approval
      const result = await approvalEngine.submitForApproval(postId, userId);
      return NextResponse.json(
        {
          success: true,
          approval_id: result.approval_id,
          message: `Content submitted for approval`,
        },
        { status: 201 },
      );
    }

    if (action === 'approve') {
      // Approve content
      const result = await approvalEngine.approveContent(approvalId, userId, comments);
      return NextResponse.json(
        {
          success: result.success,
          message: result.message,
          published: result.published,
        },
        { status: 200 },
      );
    }

    if (action === 'reject') {
      // Reject content and request revision
      const result = await approvalEngine.rejectContent(approvalId, userId, feedback);
      return NextResponse.json(
        {
          success: result.success,
          message: result.message,
        },
        { status: 200 },
      );
    }

    if (action === 'batch-approve') {
      // Batch approve multiple items
      const result = await approvalEngine.batchApproveContent(postIds, userId);
      return NextResponse.json(
        {
          success: result.failed === 0,
          approved: result.success,
          failed: result.failed,
        },
        { status: 200 },
      );
    }

    if (action === 'comment') {
      // Add comment to approval
      const success = await approvalEngine.addApprovalComment(approvalId, userId, comments);
      return NextResponse.json(
        {
          success,
          message: 'Comment added',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: 'Missing or invalid action' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Failed to process approval:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process approval' },
      { status: 500 },
    );
  }
}
