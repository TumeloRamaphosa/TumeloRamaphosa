import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, custom_domain } = body;

    // Get project
    const { data: project } = await supabase
      .from('scroll_world_projects')
      .select('*')
      .eq('id', params.projectId)
      .single();

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Verify permission
    const { data: member } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', project.workspace_id)
      .eq('user_id', user.id)
      .in('role', ['owner', 'admin', 'editor'])
      .single();

    if (!member) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check project status
    if (project.status !== 'completed') {
      return NextResponse.json(
        { error: 'Project must be completed before publishing' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const publishSlug = slug || generateSlug(project.name);

    // Check slug availability
    const { data: existing } = await supabase
      .from('published_worlds')
      .select('id')
      .eq('slug', publishSlug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already taken. Please choose a different one.' },
        { status: 409 }
      );
    }

    // Create published world record
    const publicUrl = custom_domain
      ? `https://${custom_domain}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/worlds/${publishSlug}`;

    const { data: published, error } = await supabase
      .from('published_worlds')
      .insert({
        project_id: params.projectId,
        slug: publishSlug,
        public_url: publicUrl,
      })
      .select()
      .single();

    if (error) throw error;

    // Update project status and URL
    await supabase
      .from('scroll_world_projects')
      .update({
        status: 'published',
        published_url: publicUrl,
        published_at: new Date().toISOString(),
      })
      .eq('id', params.projectId);

    return NextResponse.json({
      success: true,
      published_world: published,
      public_url: publicUrl,
      embed_token: published.embed_token,
    });
  } catch (error) {
    console.error('Error publishing project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Get published worlds for project
    const { data: worlds, error } = await supabase
      .from('published_worlds')
      .select('*')
      .eq('project_id', params.projectId);

    if (error) throw error;

    return NextResponse.json({ worlds });
  } catch (error) {
    console.error('Error fetching published worlds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') + '-' + Math.random().toString(36).substring(7)
  );
}
