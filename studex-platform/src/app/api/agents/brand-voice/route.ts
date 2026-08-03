import { NextRequest, NextResponse } from 'next/server';
import { brandVoiceAgent } from '@/lib/agents/brand-voice';
import { agentCoordinator } from '@/lib/agents/agent-coordinator';

export async function POST(request: NextRequest) {
  try {
    const { action, niche, taskId, analystTaskId, videoAnalysis, feedback } =
      await request.json();

    if (action === 'generate-content') {
      if (!niche || !['meat', 'coffee', 'saas'].includes(niche)) {
        return NextResponse.json(
          { error: 'Invalid or missing niche' },
          { status: 400 },
        );
      }

      // Check if analyst task completed successfully
      if (analystTaskId) {
        // In a real scenario, verify the analyst task completed
        // For now, proceed with content generation
      }

      // Generate 5 content options
      const contentOptions = await brandVoiceAgent.generateContentOptions(
        niche as 'meat' | 'coffee' | 'saas',
      );

      // Update task status
      if (taskId) {
        await agentCoordinator.updateTaskStatus(taskId, 'completed', {
          content_count: contentOptions.length,
          options: contentOptions,
          generated_niche: niche,
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: `Generated ${contentOptions.length} content options for ${niche}`,
          data: {
            content_count: contentOptions.length,
            options: contentOptions,
            average_predicted_engagement:
              contentOptions.reduce((sum, o) => sum + o.predicted_engagement, 0) /
              contentOptions.length,
          },
        },
        { status: 201 },
      );
    }

    if (action === 'train-brand-voice') {
      if (!videoAnalysis) {
        return NextResponse.json(
          { error: 'Missing videoAnalysis parameter' },
          { status: 400 },
        );
      }

      await brandVoiceAgent.trainBrandVoice(videoAnalysis);

      return NextResponse.json(
        {
          success: true,
          message: 'Brand voice successfully trained from your first episode',
          data: {
            trained_characteristics: videoAnalysis,
          },
        },
        { status: 201 },
      );
    }

    if (action === 'adapt-feedback') {
      if (!feedback) {
        return NextResponse.json(
          { error: 'Missing feedback parameter' },
          { status: 400 },
        );
      }

      await brandVoiceAgent.adaptToBrandVoice(feedback);

      return NextResponse.json(
        {
          success: true,
          message: 'Brand voice adaptation feedback recorded',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: 'Missing or invalid action' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Brand voice agent error:', error);
    const message = error instanceof Error ? error.message : 'Brand voice agent failed';

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const niche = searchParams.get('niche');

    if (action === 'pending-content') {
      const pendingContent = await brandVoiceAgent.getPendingContent(niche || undefined);

      return NextResponse.json(
        {
          success: true,
          pending_count: pendingContent.length,
          content: pendingContent,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: 'Missing or invalid action parameter' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Failed to get brand voice data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get brand voice data' },
      { status: 500 },
    );
  }
}
