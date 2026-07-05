import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { influencerEngine } from '@/lib/influencer-engine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const { influencerId, platform, product, agent, niche } = await request.json();

    if (!influencerId || !platform) {
      return NextResponse.json(
        { error: 'Missing influencerId or platform' },
        { status: 400 },
      );
    }

    const { data: influencer, error: influencerError } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', influencerId)
      .single();

    if (influencerError || !influencer) {
      return NextResponse.json({ error: 'Influencer not found' }, { status: 404 });
    }

    const content = await influencerEngine.generateContent(
      influencer,
      {
        influencerId,
        niche: influencer.niche,
        platform,
        product,
        agent: agent || 'naledi',
      },
      product,
    );

    const pikDesign = await influencerEngine.generatePikDesign(influencer, content, influencer.niche);

    const { data: post, error: postError } = await supabase
      .from('content_posts')
      .insert({
        influencer_id: influencerId,
        platform,
        caption: content.caption,
        content_type: content.content_type,
        hashtags: content.hashtags,
        call_to_action: content.call_to_action,
        visual_style: content.visual_style,
        product_mention: product,
        generated_by_agent: agent || 'naledi',
        pik_design_id: pikDesign.visualStyle,
      })
      .select()
      .single();

    if (postError) throw postError;

    return NextResponse.json(
      {
        success: true,
        post,
        pik_design: pikDesign,
        message: `Generated ${platform} content for ${influencer.name}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to generate content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 },
    );
  }
}
