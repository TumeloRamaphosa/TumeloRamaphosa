import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
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

    const workspaceId = request.nextUrl.searchParams.get('workspace_id');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }

    // Verify user has access to workspace
    const { data: member, error: memberError } = await supabase
      .from('workspace_members')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !member) {
      // Check if user is workspace owner
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .eq('owner_id', user.id)
        .single();

      if (!workspace) {
        return NextResponse.json(
          { error: 'You do not have access to this workspace' },
          { status: 403 }
        );
      }
    }

    const { data: projects, error } = await supabase
      .from('scroll_world_projects')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const {
      workspace_id,
      name,
      description,
      company_name,
      company_logo_url,
      brand_color,
      brand_accent_color,
      industry,
    } = body;

    if (!workspace_id || !name || !company_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify access to workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspace_id)
      .in('owner_id', [user.id])
      .single();

    if (!workspace) {
      const { data: member } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspace_id)
        .eq('user_id', user.id)
        .eq('role', 'editor')
        .single();

      if (!member) {
        return NextResponse.json(
          { error: 'You do not have permission to create projects' },
          { status: 403 }
        );
      }
    }

    const { data: project, error } = await supabase
      .from('scroll_world_projects')
      .insert({
        workspace_id,
        name,
        description,
        company_name,
        company_logo_url,
        brand_color: brand_color || '#000000',
        brand_accent_color: brand_accent_color || '#00FF00',
        industry,
        created_by: user.id,
        config: {
          title: name,
          scenes: [],
          theme: {
            primaryColor: brand_color || '#000000',
            accentColor: brand_accent_color || '#00FF00',
            backgroundColor: '#ffffff',
            textColor: '#000000',
          },
        },
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
