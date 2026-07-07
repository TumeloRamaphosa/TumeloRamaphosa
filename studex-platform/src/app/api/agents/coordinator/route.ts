import { NextRequest, NextResponse } from 'next/server';
import { agentCoordinator } from '@/lib/agents/agent-coordinator';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'status') {
      // Get all agents status
      const allStatus = await agentCoordinator.getAllAgentsStatus();
      return NextResponse.json({
        success: true,
        agents: allStatus,
      });
    }

    if (action === 'queue') {
      // Get task queue status
      const queueStatus = await agentCoordinator.getQueueStatus();
      return NextResponse.json({
        success: true,
        queue: queueStatus,
      });
    }

    const agentName = searchParams.get('agent');
    if (agentName) {
      // Get specific agent status
      const status = await agentCoordinator.getAgentStatus(agentName);
      if (!status) {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        agent: status,
      });
    }

    return NextResponse.json(
      { error: 'Missing action parameter' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Failed to get agent info:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get agent info' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, niche, agentName, taskType, payload, priority } = await request.json();

    if (action === 'start-cycle') {
      // Start daily marketing cycle for a niche
      if (!niche || !['meat', 'coffee', 'saas'].includes(niche)) {
        return NextResponse.json(
          { error: 'Invalid or missing niche' },
          { status: 400 },
        );
      }

      const taskIds = await agentCoordinator.startDailyMarketingCycle(niche);
      return NextResponse.json(
        {
          success: true,
          message: `Daily marketing cycle started for ${niche}`,
          tasks: taskIds,
        },
        { status: 201 },
      );
    }

    if (action === 'queue-task') {
      // Queue a custom task for an agent
      if (!agentName || !taskType) {
        return NextResponse.json(
          { error: 'Missing agentName or taskType' },
          { status: 400 },
        );
      }

      const task = await agentCoordinator.queueTask(
        agentName,
        taskType,
        payload || {},
        priority || 0,
        niche,
      );

      return NextResponse.json(
        {
          success: true,
          task_id: task.id,
          message: `Task queued for ${agentName}`,
        },
        { status: 201 },
      );
    }

    if (action === 'update-status') {
      // Update agent status
      if (!agentName) {
        return NextResponse.json(
          { error: 'Missing agentName' },
          { status: 400 },
        );
      }

      const status = payload?.status || 'idle';
      await agentCoordinator.updateAgentStatus(agentName, status as any);

      return NextResponse.json(
        {
          success: true,
          message: `${agentName} status updated to ${status}`,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: 'Missing or invalid action' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Failed to coordinate agents:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to coordinate agents' },
      { status: 500 },
    );
  }
}

// Get next task for an agent to process
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const agentName = searchParams.get('agent');

    if (!agentName) {
      return NextResponse.json(
        { error: 'Missing agent name' },
        { status: 400 },
      );
    }

    const nextTask = await agentCoordinator.getNextTask(agentName);

    if (!nextTask) {
      return NextResponse.json(
        {
          success: true,
          task: null,
          message: 'No tasks available',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        task: nextTask,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to get next task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get next task' },
      { status: 500 },
    );
  }
}
