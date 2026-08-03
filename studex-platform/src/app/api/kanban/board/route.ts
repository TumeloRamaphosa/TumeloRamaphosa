import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('content_posts')
      .select('*')
      .in('status', ['backlog', 'in_progress', 'pending_approval', 'scheduled', 'published'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group cards by status
    const columns = [
      {
        id: 'backlog',
        title: 'Backlog',
        status: 'backlog',
        cards: data.filter((post: any) => post.status === 'backlog'),
      },
      {
        id: 'in_progress',
        title: 'In Progress',
        status: 'in_progress',
        cards: data.filter((post: any) => post.status === 'in_progress'),
      },
      {
        id: 'pending_approval',
        title: 'Pending Approval',
        status: 'pending_approval',
        cards: data.filter((post: any) => post.status === 'pending_approval'),
      },
      {
        id: 'scheduled',
        title: 'Scheduled',
        status: 'scheduled',
        cards: data.filter((post: any) => post.status === 'scheduled'),
      },
      {
        id: 'published',
        title: 'Published',
        status: 'published',
        cards: data.filter((post: any) => post.status === 'published'),
      },
    ];

    return NextResponse.json(
      {
        success: true,
        columns,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to get kanban board:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get kanban board' },
      { status: 500 },
    );
  }
}
