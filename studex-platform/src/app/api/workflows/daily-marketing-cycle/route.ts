import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DailyMarketingCycleWorkflow } from '@/lib/workflows/daily-marketing-cycle';
import { agentCoordinator } from '@/lib/agents/agent-coordinator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const { niche } = await request.json();

    if (!niche || !['meat', 'coffee', 'saas'].includes(niche)) {
      return NextResponse.json(
        { error: 'Invalid or missing niche' },
        { status: 400 },
      );
    }

    // Start the daily marketing cycle
    const result = await DailyMarketingCycleWorkflow.startCycle(niche);

    return NextResponse.json(
      {
        success: true,
        message: `Daily marketing cycle started for ${niche}`,
        cycle: result,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to start daily cycle:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start cycle' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));

    // Get scheduled posts for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const { data, error } = await supabase
      .from('publishing_schedule')
      .select('*')
      .gte('publish_date', startDate.toISOString())
      .lte('publish_date', endDate.toISOString())
      .order('publish_date', { ascending: true });

    if (error) throw error;

    // Also get published content from content_posts
    const { data: publishedPosts, error: postsError } = await supabase
      .from('content_posts')
      .select('*')
      .eq('status', 'published')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (postsError) throw postsError;

    // Combine scheduled and published posts
    const posts = [
      ...(data || []).map((post: any) => ({
        id: post.id,
        date: new Date(post.publish_date).toISOString().split('T')[0],
        title: post.title,
        niche: post.niche,
        publish_time: '12:30 PM',
        status: 'scheduled',
      })),
      ...(publishedPosts || []).map((post: any) => ({
        id: post.id,
        date: new Date(post.created_at).toISOString().split('T')[0],
        title: post.title,
        niche: post.niche,
        publish_time: '12:30 PM',
        status: 'published',
        views: post.views || 0,
        engagement: post.engagement_rate || 0,
      })),
    ];

    return NextResponse.json(
      {
        success: true,
        year,
        month,
        posts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to get publishing schedule:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get schedule' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'get-status') {
      // Get current workflow status
      const status = await DailyMarketingCycleWorkflow.getWorkflowStatus();

      return NextResponse.json(
        {
          success: true,
          status,
        },
        { status: 200 },
      );
    }

    if (action === 'get-timeline') {
      // Get estimated timeline
      const timeline = DailyMarketingCycleWorkflow.getEstimatedTimeline();

      return NextResponse.json(
        {
          success: true,
          timeline,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Failed to get workflow data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get workflow data' },
      { status: 500 },
    );
  }
}
