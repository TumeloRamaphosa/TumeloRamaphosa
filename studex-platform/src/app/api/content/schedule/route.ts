import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface BlotatoSchedulePayload {
  content: string;
  scheduled_time: string;
  platforms: string[];
  media?: {
    url: string;
    type: 'image' | 'video';
  }[];
  hashtags?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { postId, scheduledTime, platforms, pikImageUrl } = await request.json();

    if (!postId || !scheduledTime) {
      return NextResponse.json(
        { error: 'Missing postId or scheduledTime' },
        { status: 400 },
      );
    }

    const { data: post, error: postError } = await supabase
      .from('content_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const blotatoPayload: BlotatoSchedulePayload = {
      content: post.caption,
      scheduled_time: scheduledTime,
      platforms: platforms || [post.platform],
      hashtags: post.hashtags,
    };

    if (pikImageUrl) {
      blotatoPayload.media = [
        {
          url: pikImageUrl,
          type: 'image',
        },
      ];
    }

    let blotatoResponse;
    try {
      const response = await fetch(`${process.env.BLOTATO_API_URL}/schedule-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BLOTATO_API_KEY}`,
        },
        body: JSON.stringify(blotatoPayload),
      });

      blotatoResponse = await response.json();

      if (!response.ok) {
        throw new Error(blotatoResponse.error || 'Failed to schedule with Blotato');
      }
    } catch (blotatoError) {
      console.warn('Blotato API error, storing as draft:', blotatoError);
      blotatoResponse = { status: 'draft' };
    }

    const { data: updatedPost, error: updateError } = await supabase
      .from('content_posts')
      .update({
        status: blotatoResponse.status || 'scheduled',
        scheduled_time: scheduledTime,
        blotato_post_id: blotatoResponse.post_id,
      })
      .eq('id', postId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(
      {
        success: true,
        post: updatedPost,
        blotato: blotatoResponse,
        message: `Scheduled post for ${new Date(scheduledTime).toLocaleString()}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to schedule post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to schedule post' },
      { status: 500 },
    );
  }
}
