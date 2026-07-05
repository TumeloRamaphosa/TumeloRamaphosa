import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const niche = searchParams.get('niche');
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('influencers')
      .select(
        `
        *,
        content_posts(
          id,
          platform,
          status,
          engagement_metrics
        )
      `,
      )
      .eq('status', status)
      .limit(limit)
      .order('engagement_rate', { ascending: false });

    if (niche) {
      query = query.eq('niche', niche);
    }

    const { data: influencers, error } = await query;

    if (error) throw error;

    const withStats = influencers?.map((inf: any) => ({
      ...inf,
      stats: {
        total_posts: inf.content_posts?.length || 0,
        average_engagement: inf.engagement_rate,
        platforms: [...new Set(inf.content_posts?.map((p: any) => p.platform))],
      },
    }));

    return NextResponse.json(
      {
        success: true,
        total: withStats?.length || 0,
        influencers: withStats,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to list influencers:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list influencers' },
      { status: 500 },
    );
  }
}
