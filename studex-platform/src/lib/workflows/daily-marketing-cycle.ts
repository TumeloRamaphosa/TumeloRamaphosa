import { agentCoordinator } from '@/lib/agents/agent-coordinator';
import { approvalEngine } from '@/lib/approval-engine';

interface DailyMarketingCycleResult {
  started_at: string;
  niche: 'meat' | 'coffee' | 'saas';
  scout_task_id: string;
  analyst_task_id: string;
  brand_voice_task_id: string;
  approval_deadline: Date;
  publish_time: Date;
}

/**
 * Daily Marketing Cycle Workflow (12:00 - 12:30 PM)
 *
 * Timeline:
 * 12:00 PM: Competitor Scout Agent starts analyzing top performers
 * 12:05 PM: Data Analyst Agent processes competitor data
 * 12:15 PM: Brand Voice Agent generates 5 content options
 * 12:20 PM: Content routes to approval dashboard
 * 12:25 PM: User approval window opens
 * 12:30 PM: Approved content publishes via Blotato
 */

export class DailyMarketingCycleWorkflow {
  /**
   * Start the daily marketing cycle for a niche
   */
  static async startCycle(
    niche: 'meat' | 'coffee' | 'saas',
  ): Promise<DailyMarketingCycleResult> {
    const startedAt = new Date();

    console.log(
      `[Daily Cycle] Starting marketing cycle for ${niche} at ${startedAt.toISOString()}`,
    );

    // Step 1: Queue all three agent tasks
    const { scout_task_id, analyst_task_id, brand_voice_task_id } =
      await agentCoordinator.startDailyMarketingCycle(niche);

    console.log(`[Daily Cycle] Tasks queued:
      - Competitor Scout: ${scout_task_id}
      - Data Analyst: ${analyst_task_id}
      - Brand Voice: ${brand_voice_task_id}`);

    // Get approval window info
    const windowStatus = approvalEngine.isApprovalWindowOpen(15);

    return {
      started_at: startedAt.toISOString(),
      niche,
      scout_task_id,
      analyst_task_id,
      brand_voice_task_id,
      approval_deadline: new Date(
        windowStatus.publishTime.getTime() - 5 * 60 * 1000,
      ), // 12:25 PM
      publish_time: windowStatus.publishTime,
    };
  }

  /**
   * Monitor workflow progress
   */
  static async monitorProgress(
    scoutTaskId: string,
    analystTaskId: string,
    brandVoiceTaskId: string,
  ): Promise<{
    scout_status: string;
    analyst_status: string;
    brand_voice_status: string;
    overall_progress: number;
    estimated_completion: Date;
  }> {
    // This would be implemented to query task status
    // For now, returning placeholder
    return {
      scout_status: 'pending',
      analyst_status: 'pending',
      brand_voice_status: 'pending',
      overall_progress: 0,
      estimated_completion: new Date(),
    };
  }

  /**
   * Handle competitor scout completion
   * Triggers data analyst to begin processing
   */
  static async onScoutComplete(
    scoutTaskId: string,
    scoutResult: Record<string, any>,
  ): Promise<void> {
    console.log(`[Workflow] Competitor Scout completed: ${scoutTaskId}`);
    console.log(`[Workflow] Found ${scoutResult.competitor_count || 0} competitors`);

    // Update queue status
    await agentCoordinator.updateAgentStatus(
      'competitor-scout',
      'idle',
      undefined,
      { last_completed_at: new Date().toISOString() },
    );

    // Data Analyst should automatically pick up the dependent task
    console.log('[Workflow] Data Analyst task is now ready to execute');
  }

  /**
   * Handle data analyst completion
   * Triggers brand voice agent to begin generating content
   */
  static async onAnalystComplete(
    analystTaskId: string,
    analystResult: Record<string, any>,
  ): Promise<void> {
    console.log(`[Workflow] Data Analyst completed: ${analystTaskId}`);
    console.log(
      `[Workflow] Extracted ${analystResult.insights_count || 0} insights`,
    );

    await agentCoordinator.updateAgentStatus(
      'data-analyst',
      'idle',
      undefined,
      { last_completed_at: new Date().toISOString() },
    );

    console.log('[Workflow] Brand Voice task is now ready to execute');
  }

  /**
   * Handle brand voice completion
   * Routes content to approval dashboard
   */
  static async onBrandVoiceComplete(
    brandVoiceTaskId: string,
    brandVoiceResult: Record<string, any>,
  ): Promise<{ approval_count: number; approval_window_open: boolean }> {
    console.log(`[Workflow] Brand Voice Agent completed: ${brandVoiceTaskId}`);
    console.log(`[Workflow] Generated ${brandVoiceResult.content_count || 0} content options`);

    await agentCoordinator.updateAgentStatus(
      'brand-voice',
      'idle',
      undefined,
      { last_completed_at: new Date().toISOString() },
    );

    // Check if approval window is still open
    const windowStatus = approvalEngine.isApprovalWindowOpen();

    console.log(
      `[Workflow] Approval window ${windowStatus.open ? 'OPEN' : 'CLOSED'}`,
    );

    return {
      approval_count: brandVoiceResult.content_count || 0,
      approval_window_open: windowStatus.open,
    };
  }

  /**
   * Handle workflow errors
   */
  static async handleError(
    taskId: string,
    agentName: string,
    error: Error,
  ): Promise<void> {
    console.error(
      `[Workflow Error] Agent ${agentName} failed on task ${taskId}:`,
      error.message,
    );

    await agentCoordinator.updateAgentStatus(agentName, 'error', taskId, {
      error: error.message,
      failed_at: new Date().toISOString(),
    });

    // Attempt retry
    const retried = await agentCoordinator.retryTask(taskId);
    console.log(
      `[Workflow] Task retry ${retried ? 'SCHEDULED' : 'FAILED - max retries exceeded'}`,
    );
  }

  /**
   * Get workflow status summary
   */
  static async getWorkflowStatus(): Promise<{
    agent_statuses: Record<string, string>;
    queue_status: any;
    approval_summary: any;
    time_to_publish: number;
  }> {
    const [agentStatuses, queueStatus, approvalSummary] = await Promise.all([
      agentCoordinator.getAllAgentsStatus(),
      agentCoordinator.getQueueStatus(),
      approvalEngine.getApprovalSummary(),
    ]);

    const statusMap: Record<string, string> = {};
    agentStatuses.forEach((agent) => {
      statusMap[agent.agent_name] = agent.status;
    });

    return {
      agent_statuses: statusMap,
      queue_status: queueStatus,
      approval_summary: approvalSummary,
      time_to_publish:
        approvalSummary.next_publish_time.getTime() - new Date().getTime(),
    };
  }

  /**
   * Get estimated timeline
   */
  static getEstimatedTimeline(): {
    phase: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
  }[] {
    const now = new Date();
    const publishTime = new Date(now);
    publishTime.setHours(12, 30, 0, 0);

    if (publishTime < now) {
      publishTime.setDate(publishTime.getDate() + 1);
    }

    const scoutStart = new Date(publishTime.getTime() - 30 * 60 * 1000); // 12:00 PM
    const analystStart = new Date(publishTime.getTime() - 25 * 60 * 1000); // 12:05 PM
    const brandVoiceStart = new Date(publishTime.getTime() - 15 * 60 * 1000); // 12:15 PM
    const approvalStart = new Date(publishTime.getTime() - 10 * 60 * 1000); // 12:20 PM
    const publishStart = new Date(publishTime.getTime() - 0 * 60 * 1000); // 12:30 PM

    return [
      {
        phase: 'Competitor Scout',
        start_time: scoutStart.toISOString(),
        end_time: analystStart.toISOString(),
        duration_minutes: 5,
      },
      {
        phase: 'Data Analyst Processing',
        start_time: analystStart.toISOString(),
        end_time: brandVoiceStart.toISOString(),
        duration_minutes: 10,
      },
      {
        phase: 'Brand Voice Generation',
        start_time: brandVoiceStart.toISOString(),
        end_time: approvalStart.toISOString(),
        duration_minutes: 5,
      },
      {
        phase: 'User Approval Window',
        start_time: approvalStart.toISOString(),
        end_time: new Date(publishStart.getTime() - 5 * 60 * 1000).toISOString(),
        duration_minutes: 5,
      },
      {
        phase: 'Publishing',
        start_time: new Date(publishStart.getTime() - 5 * 60 * 1000).toISOString(),
        end_time: publishStart.toISOString(),
        duration_minutes: 5,
      },
    ];
  }
}
