import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface AgentTask {
  id: string;
  agent_name: string;
  task_type: string;
  niche?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  payload: Record<string, any>;
  result: Record<string, any>;
  error_message?: string;
}

interface AgentStatus {
  agent_name: string;
  status: 'idle' | 'running' | 'waiting' | 'error';
  current_task_id?: string;
  last_heartbeat: string;
}

export class AgentCoordinator {
  private readonly AGENTS = [
    'charlie',
    'robusca',
    'naledi',
    'competitor-scout',
    'data-analyst',
    'brand-voice',
  ];

  /**
   * Queue a new task for an agent
   */
  async queueTask(
    agentName: string,
    taskType: string,
    payload: Record<string, any>,
    priority: number = 0,
    niche?: string,
  ): Promise<AgentTask> {
    // Validate agent name
    if (!this.AGENTS.includes(agentName)) {
      throw new Error(`Invalid agent name: ${agentName}. Must be one of: ${this.AGENTS.join(', ')}`);
    }

    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .insert({
          agent_name: agentName,
          task_type: taskType,
          niche,
          status: 'pending',
          priority,
          payload,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Failed to queue task:', error);
      throw error;
    }
  }

  /**
   * Get next task for agent to process
   */
  async getNextTask(agentName: string): Promise<AgentTask | null> {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .select('*')
        .eq('agent_name', agentName)
        .in('status', ['pending'])
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows found
        return null;
      }

      if (error) throw error;

      // Mark as running
      await this.updateTaskStatus(data.id, 'running');

      return data;
    } catch (error) {
      console.error('Failed to get next task:', error);
      return null;
    }
  }

  /**
   * Update task status and result
   */
  async updateTaskStatus(
    taskId: string,
    status: 'pending' | 'running' | 'completed' | 'failed',
    result?: Record<string, any>,
    errorMessage?: string,
  ): Promise<void> {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'completed') {
        updates.result = result || {};
        updates.completed_at = new Date().toISOString();
      }

      if (status === 'failed') {
        updates.error_message = errorMessage;
        updates.completed_at = new Date().toISOString();
      }

      if (status === 'running') {
        updates.started_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('agent_tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw error;
    }
  }

  /**
   * Retry a failed task
   */
  async retryTask(taskId: string): Promise<boolean> {
    try {
      const { data: task } = await supabase
        .from('agent_tasks')
        .select('retry_count, max_retries')
        .eq('id', taskId)
        .single();

      if (!task) return false;

      if (task.retry_count >= task.max_retries) {
        console.error(`Task ${taskId} exceeded max retries`);
        return false;
      }

      await supabase
        .from('agent_tasks')
        .update({
          status: 'pending',
          retry_count: task.retry_count + 1,
          error_message: null,
        })
        .eq('id', taskId);

      return true;
    } catch (error) {
      console.error('Failed to retry task:', error);
      return false;
    }
  }

  /**
   * Update agent status
   */
  async updateAgentStatus(
    agentName: string,
    status: 'idle' | 'running' | 'waiting' | 'error',
    currentTaskId?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('agent_coordination')
        .upsert({
          agent_name: agentName,
          status,
          current_task_id: currentTaskId,
          last_heartbeat: new Date().toISOString(),
          metadata: metadata || {},
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update agent status:', error);
      throw error;
    }
  }

  /**
   * Get agent status
   */
  async getAgentStatus(agentName: string): Promise<AgentStatus | null> {
    try {
      const { data, error } = await supabase
        .from('agent_coordination')
        .select('*')
        .eq('agent_name', agentName)
        .single();

      if (error && error.code === 'PGRST116') {
        return null;
      }

      if (error) throw error;

      return {
        agent_name: data.agent_name,
        status: data.status,
        current_task_id: data.current_task_id,
        last_heartbeat: data.last_heartbeat,
      };
    } catch (error) {
      console.error('Failed to get agent status:', error);
      return null;
    }
  }

  /**
   * Get status of all agents
   */
  async getAllAgentsStatus(): Promise<AgentStatus[]> {
    try {
      const { data, error } = await supabase
        .from('agent_coordination')
        .select('agent_name, status, current_task_id, last_heartbeat')
        .in('agent_name', this.AGENTS);

      if (error) throw error;

      return data as AgentStatus[];
    } catch (error) {
      console.error('Failed to get all agents status:', error);
      return [];
    }
  }

  /**
   * Orchestrate daily marketing cycle
   * Sequence: Competitor Scout → Data Analyst → Brand Voice
   */
  async startDailyMarketingCycle(niche: 'meat' | 'coffee' | 'saas'): Promise<{
    scout_task_id: string;
    analyst_task_id: string;
    brand_voice_task_id: string;
  }> {
    try {
      // Queue Competitor Scout task (priority 3 - highest)
      const scoutTask = await this.queueTask(
        'competitor-scout',
        'analyze_competitors',
        { niche, timeframe_days: 30 },
        3,
        niche,
      );

      // Queue Data Analyst task (priority 2)
      // This will wait for scout to complete
      const analystTask = await this.queueTask(
        'data-analyst',
        'extract_insights',
        { niche, depends_on_task: scoutTask.id },
        2,
        niche,
      );

      // Queue Brand Voice task (priority 1)
      // This will wait for analyst to complete
      const brandVoiceTask = await this.queueTask(
        'brand-voice',
        'generate_content',
        { niche, depends_on_task: analystTask.id },
        1,
        niche,
      );

      return {
        scout_task_id: scoutTask.id,
        analyst_task_id: analystTask.id,
        brand_voice_task_id: brandVoiceTask.id,
      };
    } catch (error) {
      console.error('Failed to start daily marketing cycle:', error);
      throw error;
    }
  }

  /**
   * Dispatch task to appropriate handler
   * Returns whether the task was processed successfully
   */
  async processTask(task: AgentTask): Promise<boolean> {
    try {
      await this.updateAgentStatus(task.agent_name, 'running', task.id, {
        task_type: task.task_type,
        progress: 'Starting...',
      });

      // Import appropriate agent handler
      let result: Record<string, any> = {};

      switch (task.agent_name) {
        case 'competitor-scout':
          // This will be called via API route
          // For now, queue for processing
          break;

        case 'data-analyst':
          // Wait for dependency if exists
          if (task.payload.depends_on_task) {
            const depTask = await this.getTaskById(task.payload.depends_on_task);
            if (!depTask || depTask.status !== 'completed') {
              await this.updateAgentStatus(task.agent_name, 'waiting', task.id);
              return false;
            }
          }
          break;

        case 'brand-voice':
          // Wait for dependency if exists
          if (task.payload.depends_on_task) {
            const depTask = await this.getTaskById(task.payload.depends_on_task);
            if (!depTask || depTask.status !== 'completed') {
              await this.updateAgentStatus(task.agent_name, 'waiting', task.id);
              return false;
            }
          }
          break;

        default:
          // Standard agents (Charlie, Robusca, Naledi)
          break;
      }

      // Task queued successfully
      await this.updateAgentStatus(task.agent_name, 'idle');
      return true;
    } catch (error) {
      console.error('Failed to process task:', error);
      await this.updateAgentStatus(task.agent_name, 'error', task.id, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Get task by ID
   */
  private async getTaskById(taskId: string): Promise<AgentTask | null> {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) return null;

      return data;
    } catch (error) {
      console.error('Failed to get task:', error);
      return null;
    }
  }

  /**
   * Get task queue status
   */
  async getQueueStatus(): Promise<{
    total_pending: number;
    total_running: number;
    by_agent: Record<string, { pending: number; running: number }>;
  }> {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .select('agent_name, status')
        .in('status', ['pending', 'running']);

      if (error) throw error;

      const byAgent: Record<string, { pending: number; running: number }> = {};

      this.AGENTS.forEach((agent) => {
        byAgent[agent] = { pending: 0, running: 0 };
      });

      data.forEach((task) => {
        if (byAgent[task.agent_name]) {
          if (task.status === 'pending') {
            byAgent[task.agent_name].pending++;
          } else if (task.status === 'running') {
            byAgent[task.agent_name].running++;
          }
        }
      });

      return {
        total_pending: data.filter((t) => t.status === 'pending').length,
        total_running: data.filter((t) => t.status === 'running').length,
        by_agent: byAgent,
      };
    } catch (error) {
      console.error('Failed to get queue status:', error);
      throw error;
    }
  }
}

export const agentCoordinator = new AgentCoordinator();
