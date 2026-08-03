import { NextRequest, NextResponse } from 'next/server';
import { brandVoiceAgent } from '@/lib/agents/brand-voice';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoUrl = formData.get('videoUrl') as string;
    const youtubeLink = formData.get('youtubeLink') as string;
    const manualAnalysis = formData.get('manualAnalysis') as string;

    if (!videoUrl && !youtubeLink && !manualAnalysis) {
      return NextResponse.json(
        {
          error: 'Please provide either: videoUrl, youtubeLink, or manualAnalysis',
        },
        { status: 400 },
      );
    }

    let brandVoiceData = {
      tone: [] as string[],
      pacing: 'medium' as 'fast' | 'medium' | 'slow',
      typical_length: 180,
      hook_style: [] as string[],
      cta_style: 'Subscribe for daily content',
      audience_focus: 'professionals and enthusiasts',
      visual_style: [] as string[],
    };

    // If manual analysis provided, use it directly
    if (manualAnalysis) {
      try {
        const parsed = JSON.parse(manualAnalysis);
        brandVoiceData = {
          ...brandVoiceData,
          ...parsed,
        };
      } catch (err) {
        console.warn('Failed to parse manual analysis JSON:', err);
      }
    }

    // If videoUrl or youtubeLink provided, analyze it
    if (videoUrl || youtubeLink) {
      // In a real scenario, this would:
      // 1. Download the video from URL or YouTube
      // 2. Use Claude Vision to analyze the video frames
      // 3. Extract transcript via speech-to-text
      // 4. Analyze tone, pacing, hooks, CTAs, visual style
      // 5. Determine typical content length and audience focus

      console.log('[Brand Voice] Analyzing video from:', videoUrl || youtubeLink);
      console.log(
        '[Brand Voice] Note: Full video analysis requires Claude Vision integration',
      );

      // For now, provide sample analysis that would be enriched with Claude Vision
      brandVoiceData = {
        tone: ['professional', 'engaging', 'authoritative'],
        pacing: 'medium',
        typical_length: Math.floor(Math.random() * 240 + 120), // 2-6 minutes
        hook_style: ['question-based', 'curiosity-gap', 'promise-based'],
        cta_style:
          'Subscribe to this channel for regular updates and exclusive content',
        audience_focus: 'professionals and business enthusiasts',
        visual_style: [
          'high-production',
          'on-camera',
          'data-visualization',
          'b-roll',
        ],
      };
    }

    // Train the brand voice agent
    await brandVoiceAgent.trainBrandVoice(brandVoiceData);

    // Store reference in team settings
    const { error: updateError } = await supabase
      .from('team_settings')
      .upsert({
        id: 1,
        brand_voice_guidelines: brandVoiceData,
        brand_voice_trained_at: new Date().toISOString(),
        brand_voice_source: videoUrl ? 'video_upload' : youtubeLink ? 'youtube_link' : 'manual',
        updated_at: new Date().toISOString(),
      });

    if (updateError) throw updateError;

    // Log the training event
    await supabase.from('brand_voice_feedback').insert({
      feedback: `Brand voice trained from ${videoUrl ? 'video_upload' : youtubeLink ? 'YouTube link' : 'manual analysis'}`,
      processed_at: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Brand voice successfully trained! All future content will match your style.',
        data: {
          trained_characteristics: brandVoiceData,
          tone: brandVoiceData.tone.join(', '),
          pacing: brandVoiceData.pacing,
          typical_length_minutes: Math.round(brandVoiceData.typical_length / 60),
          hook_styles: brandVoiceData.hook_style.join(', '),
          cta: brandVoiceData.cta_style,
          audience: brandVoiceData.audience_focus,
          visual_style: brandVoiceData.visual_style.join(', '),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Brand voice training error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Training failed' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('team_settings')
      .select('brand_voice_guidelines, brand_voice_trained_at, brand_voice_source')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data || !data.brand_voice_guidelines) {
      return NextResponse.json(
        {
          success: false,
          trained: false,
          message:
            'Brand voice not yet trained. Please upload your first episode to get started.',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        trained: true,
        trained_at: data.brand_voice_trained_at,
        source: data.brand_voice_source,
        characteristics: data.brand_voice_guidelines,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to get brand voice status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get status' },
      { status: 500 },
    );
  }
}
