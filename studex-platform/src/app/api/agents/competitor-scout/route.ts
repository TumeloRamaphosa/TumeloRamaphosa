import { NextRequest, NextResponse } from 'next/server';
import { competitorScoutAgent } from '@/lib/agents/competitor-scout';
import { agentCoordinator } from '@/lib/agents/agent-coordinator';

export async function POST(request: NextRequest) {
  try {
    const { niche, taskId } = await request.json();

    if (!niche || !['meat', 'coffee', 'saas'].includes(niche)) {
      return NextResponse.json(
        { error: 'Invalid or missing niche' },
        { status: 400 },
      );
    }

    // Analyze competitors for this niche
    const competitorData = await competitorScoutAgent.analyzeCompetitors(niche, 30);

    // Extract engagement patterns
    const patterns = await competitorScoutAgent.extractEngagementPatterns(niche);

    // Update task status
    if (taskId) {
      await agentCoordinator.updateTaskStatus(taskId, 'completed', {
        competitor_count: competitorData.length,
        patterns,
        analyzed_niches: [niche],
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Analyzed ${competitorData.length} competitors for ${niche}`,
        data: {
          competitor_count: competitorData.length,
          patterns,
          top_competitors: competitorData.slice(0, 5),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Scout agent error:', error);
    const message = error instanceof Error ? error.message : 'Scout agent failed';

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

    if (!niche) {
      return NextResponse.json(
        { error: 'Missing niche parameter' },
        { status: 400 },
      );
    }

    // Get stored competitor data for niche
    const topCompetitors = await competitorScoutAgent.getTopCompetitors(
      niche as 'meat' | 'coffee' | 'saas',
      5,
    );

    const patterns = await competitorScoutAgent.extractEngagementPatterns(
      niche as 'meat' | 'coffee' | 'saas',
    );

    return NextResponse.json(
      {
        success: true,
        niche,
        competitor_count: topCompetitors.length,
        top_competitors: topCompetitors,
        patterns,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to get competitor data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get competitor data' },
      { status: 500 },
    );
  }
}
