import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { status } = await request.json();

    if (!status || !['backlog', 'in_progress', 'pending_approval', 'scheduled', 'published'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from('content_posts')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: `Card moved to ${status}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to update kanban card:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update card' },
      { status: 500 },
    );
  }
}
