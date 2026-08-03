import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface ApprovalItem {
  approval_id: string;
  post_id: string;
  influencer_name: string;
  platform: string;
  caption: string;
  submitted_at: string;
  hashtags: string;
  status: string;
}

interface ApprovalComment {
  reviewer_id: string;
  comment: string;
  timestamp: string;
}

export class ApprovalEngine {
  /**
   * Submit content for approval
   * Moves content from draft to pending_approval
   */
  async submitForApproval(postId: string, submittedBy: string): Promise<{
    success: boolean;
    approval_id: string;
    status: string;
  }> {
    try {
      const { data, error } = await supabase.rpc('submit_for_approval', {
        post_id: postId,
        submitted_by_id: submittedBy,
      });

      if (error) throw error;

      return {
        success: true,
        approval_id: data[0].approval_id,
        status: data[0].status,
      };
    } catch (error) {
      console.error('Failed to submit for approval:', error);
      throw error;
    }
  }

  /**
   * Get all pending approvals for dashboard
   */
  async getPendingApprovals(): Promise<ApprovalItem[]> {
    try {
      const { data, error } = await supabase.rpc('get_pending_approvals');

      if (error) throw error;

      return data as ApprovalItem[];
    } catch (error) {
      console.error('Failed to get pending approvals:', error);
      throw error;
    }
  }

  /**
   * Approve content and trigger publishing
   */
  async approveContent(
    approvalId: string,
    approvedBy: string,
    comments?: string,
  ): Promise<{
    success: boolean;
    message: string;
    published: boolean;
  }> {
    try {
      const { data, error } = await supabase.rpc('approve_content', {
        approval_id: approvalId,
        approved_by_id: approvedBy,
        comments: comments || null,
      });

      if (error) throw error;

      const result = Array.isArray(data) ? data[0] : data;

      // If should publish immediately, trigger distribution
      if (result && result.published) {
        await this.triggerPublishing(result.post_id);
      }

      return {
        success: result?.success || true,
        message: result?.message || 'Content approved',
        published: result?.published || false,
      };
    } catch (error) {
      console.error('Failed to approve content:', error);
      throw error;
    }
  }

  /**
   * Reject content and request revision
   */
  async rejectContent(
    approvalId: string,
    rejectedBy: string,
    feedback: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { error } = await supabase
        .from('content_approvals')
        .update({
          status: 'revision_requested',
          reviewer_comments: feedback,
          updated_at: new Date().toISOString(),
        })
        .eq('id', approvalId);

      if (error) throw error;

      // Update kanban card back to in_progress
      const { data: approval } = await supabase
        .from('content_approvals')
        .select('content_post_id')
        .eq('id', approvalId)
        .single();

      if (approval) {
        await supabase
          .from('kanban_cards')
          .update({ column_name: 'in_progress' })
          .eq('content_post_id', approval.content_post_id);
      }

      return {
        success: true,
        message: 'Content rejected and moved back to in progress',
      };
    } catch (error) {
      console.error('Failed to reject content:', error);
      throw error;
    }
  }

  /**
   * Add comment to approval workflow
   */
  async addApprovalComment(
    approvalId: string,
    userId: string,
    comment: string,
  ): Promise<boolean> {
    try {
      const { data: approval, error: fetchError } = await supabase
        .from('content_approvals')
        .select('approval_chain')
        .eq('id', approvalId)
        .single();

      if (fetchError) throw fetchError;

      const chain = approval.approval_chain || [];
      chain.push({
        user_id: userId,
        comment,
        timestamp: new Date().toISOString(),
        action: 'comment',
      });

      const { error: updateError } = await supabase
        .from('content_approvals')
        .update({ approval_chain: chain })
        .eq('id', approvalId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  }

  /**
   * Get approval details with full history
   */
  async getApprovalDetails(approvalId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('content_approvals')
        .select(
          `
          *,
          content_posts(
            id,
            caption,
            hashtags,
            call_to_action,
            platform,
            influencers(name, handle, avatar_url, engagement_rate)
          )
        `,
        )
        .eq('id', approvalId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Failed to get approval details:', error);
      throw error;
    }
  }

  /**
   * Trigger content distribution via Blotato
   */
  private async triggerPublishing(postId: string): Promise<void> {
    try {
      const { data: post, error: postError } = await supabase
        .from('content_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (postError) throw postError;

      // Create publishing schedule for 12:30 PM
      const now = new Date();
      const publishTime = new Date(now);
      publishTime.setHours(12, 30, 0, 0);

      // If 12:30 already passed today, schedule for tomorrow
      if (publishTime < now) {
        publishTime.setDate(publishTime.getDate() + 1);
      }

      const { error: scheduleError } = await supabase
        .from('publishing_schedule')
        .insert({
          content_post_id: postId,
          scheduled_for: publishTime.toISOString(),
          status: 'pending',
        });

      if (scheduleError) throw scheduleError;

      // Update content_posts status
      await supabase
        .from('content_posts')
        .update({
          status: 'scheduled',
          scheduled_time: publishTime.toISOString(),
        })
        .eq('id', postId);
    } catch (error) {
      console.error('Failed to trigger publishing:', error);
      throw error;
    }
  }

  /**
   * Check if approval window is still open
   * Returns false if past 12:30 PM or if approval timed out
   */
  isApprovalWindowOpen(
    approvalWindowMinutes: number = 15,
  ): {
    open: boolean;
    timeRemaining: number;
    publishTime: Date;
  } {
    const now = new Date();
    const publishTime = new Date(now);
    publishTime.setHours(12, 30, 0, 0);

    // If 12:30 already passed today, use tomorrow's time
    if (publishTime < now) {
      publishTime.setDate(publishTime.getDate() + 1);
    }

    const approvalDeadline = new Date(
      publishTime.getTime() - approvalWindowMinutes * 60 * 1000,
    );
    const timeRemaining = approvalDeadline.getTime() - now.getTime();
    const open = timeRemaining > 0;

    return {
      open,
      timeRemaining: Math.max(0, timeRemaining),
      publishTime,
    };
  }

  /**
   * Get approval workflow summary
   */
  async getApprovalSummary(): Promise<{
    pending_count: number;
    approved_today: number;
    rejected_today: number;
    next_publish_time: Date;
    approval_window: { open: boolean; timeRemaining: number };
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: pendingData } = await supabase
        .from('content_approvals')
        .select('id')
        .eq('status', 'pending');

      const { data: approvedData } = await supabase
        .from('content_approvals')
        .select('id')
        .eq('status', 'approved')
        .gte('approved_at', `${today}T00:00:00`);

      const { data: rejectedData } = await supabase
        .from('content_approvals')
        .select('id')
        .eq('status', 'rejected')
        .gte('updated_at', `${today}T00:00:00`);

      const windowStatus = this.isApprovalWindowOpen();

      return {
        pending_count: pendingData?.length || 0,
        approved_today: approvedData?.length || 0,
        rejected_today: rejectedData?.length || 0,
        next_publish_time: windowStatus.publishTime,
        approval_window: {
          open: windowStatus.open,
          timeRemaining: windowStatus.timeRemaining,
        },
      };
    } catch (error) {
      console.error('Failed to get approval summary:', error);
      throw error;
    }
  }

  /**
   * Batch approve multiple content items
   */
  async batchApproveContent(
    postIds: string[],
    approvedBy: string,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const postId of postIds) {
      try {
        // Get approval for this post
        const { data: approval } = await supabase
          .from('content_approvals')
          .select('id')
          .eq('content_post_id', postId)
          .single();

        if (approval) {
          await this.approveContent(approval.id, approvedBy);
          success++;
        }
      } catch (error) {
        console.error(`Failed to approve ${postId}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }
}

export const approvalEngine = new ApprovalEngine();
