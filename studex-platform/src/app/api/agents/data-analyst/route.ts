import { NextRequest, NextResponse } from 'next/server';
import { dataAnalystAgent } from '@/lib/agents/data-analyst';
import { agentCoordinator } from '@/lib/agents/agent-coordinator';

export async function POST(request: NextRequest) {
  try {
    const { niche, taskId, scoutTaskId } = await request.json();

    if (!niche || !['meat', 'coffee', 'saas'].includes(niche)) {
      return NextResponse.json(
        { error: 'Invalid or missing niche' },
        { status: 400 },
      );
    }

    // Check if scout task completed successfully
    if (scoutTaskId) {
      // In a real scenario, we'd verify the scout task completed
      // For now, proceed with analysis
    }

    // Extract insights from competitor data
    const insights = await dataAnalystAgent.extractInsights(niche as 'meat' | 'coffee' | 'saas');

    // Update task status
    if (taskId) {
      await agentCoordinator.updateTaskStatus(taskId, 'completed', {
        insights_count: Object.keys(insights).length,
        recommendation: insights.recommendation,
        trending_topics: insights.trending_topics,
        analyzed_niche: niche,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Analyzed competitor data and extracted insights for ${niche}`,
        data: {
          insights,
          gap_opportunities: insights.gap_opportunities,
          recommendation: insights.recommendation,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Data analyst error:', error);
    const message = error instanceof Error ? error.message : 'Data analyst failed';

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const niche = searchParams.get('niche');
    const action = searchParams.get('action');

    if (!niche) {
      return NextResponse.json(
        { error: 'Missing niche parameter' },
        { status: 400 },
      );
    }

    if (action === 'latest-insights') {
      const insights = await dataAnalystAgent.getLatestInsights(
        niche as 'meat' | 'coffee' | 'saas',
      );

      if (!insights) {
        return NextResponse.json(
          { error: 'No insights available yet' },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          niche,
          insights,
        },
        { status: 200 },
      );
    }

    if (action === 'compare-performance') {
      const yourViews = parseInt(searchParams.get('views') || '0');
      const yourLikes = parseInt(searchParams.get('likes') || '0');
      const yourComments = parseInt(searchParams.get('comments') || '0');

      const comparison = await dataAnalystAgent.comparePerformance(
        niche as 'meat' | 'coffee' | 'saas',
        {
          views: yourViews,
          likes: yourLikes,
          comments: yourComments,
        },
      );

      return NextResponse.json(
        {
          success: true,
          niche,
          comparison,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: 'Missing or invalid action parameter' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Failed to get analyst data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get analyst data' },
      { status: 500 },
    );
  }
}
