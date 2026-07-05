import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { influencerEngine } from '@/lib/influencer-engine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const { niche } = await request.json();

    if (!['meat', 'coffee', 'saas'].includes(niche)) {
      return NextResponse.json({ error: 'Invalid niche' }, { status: 400 });
    }

    const influencer = await influencerEngine.generateInfluencerPersona(niche);

    const { data, error } = await supabase
      .from('influencers')
      .insert({
        name: influencer.name,
        handle: influencer.handle,
        bio: influencer.bio,
        niche,
        personality_traits: influencer.personality_traits,
        audience_demographics: influencer.audience_demographics,
        content_style: influencer.content_style,
        follower_count: influencer.follower_count,
        engagement_rate: influencer.engagement_rate,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        influencer: data,
        message: `Created ${influencer.name} for ${niche} niche`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to generate influencer:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate influencer' },
      { status: 500 },
    );
  }
}
