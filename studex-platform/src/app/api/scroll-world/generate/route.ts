import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const { project_id, scene_ids, regenerate_all } = body;

    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      );
    }

    // Get project and verify access
    const { data: project, error: projectError } = await supabase
      .from('scroll_world_projects')
      .select('workspace_id, config, status')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Verify edit permission
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

    // Check usage/credits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        *,
        scroll_world_plans (
          features
        )
      `)
      .eq('workspace_id', project.workspace_id)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 402 }
      );
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: usage } = await supabase
      .from('scroll_world_usage')
      .select('*')
      .eq('workspace_id', project.workspace_id)
      .eq('month', currentMonth)
      .single();

    const monthlyCredits = (subscription.scroll_world_plans as any)?.features?.monthly_credits || 1000;
    const creditsAvailable = monthlyCredits - (usage?.credits_used || 0);

    if (creditsAvailable <= 0) {
      return NextResponse.json(
        { error: 'Monthly credit limit exceeded', credits_available: 0 },
        { status: 402 }
      );
    }

    // Update project status to generating
    await supabase
      .from('scroll_world_projects')
      .update({ status: 'generating' })
      .eq('id', project_id);

    // Create generation records for each scene
    const { data: scenes } = await supabase
      .from('scenes')
      .select('*')
      .eq('project_id', project_id)
      .in('id', scene_ids || [])
      .order('order', { ascending: true });

    if (!scenes || scenes.length === 0) {
      return NextResponse.json(
        { error: 'No scenes found for generation' },
        { status: 400 }
      );
    }

    const generations = [];
    for (const scene of scenes) {
      const prompt = scene.custom_prompt || buildPrompt(project as any, scene);

      const { data: generation, error: genError } = await supabase
        .from('generations')
        .insert({
          project_id,
          scene_id: scene.id,
          input_prompt: prompt,
          status: 'pending',
        })
        .select()
        .single();

      if (!genError) {
        generations.push(generation);
      }
    }

    // Queue generation jobs (in a real system, this would queue to a job processor)
    // For now, we'll trigger them asynchronously
    triggerScrollWorldGeneration(project_id, generations);

    return NextResponse.json({
      success: true,
      project_id,
      generations,
      message: 'Generation started. Your scroll-world will be ready soon!',
    }, { status: 202 });
  } catch (error) {
    console.error('Error triggering generation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function buildPrompt(project: any, scene: any): string {
  return `Create an isometric diorama scene for a ${project.company_name} scroll-world:

Title: ${scene.title}
Description: ${scene.description}
Style: ${scene.diorama_style || 'modern and professional'}

Context: ${project.description || 'This is part of an interactive brand experience'}

Requirements:
- Beautiful isometric view
- High quality and professional
- Consistent with the brand: ${project.company_name}
- Aspect ratio: ${scene.aspect_ratio === '9:16' ? 'Portrait (mobile-optimized)' : 'Landscape (16:9)'}
- Seamless transition to next scene

${scene.briefing ? `Additional brief: ${scene.briefing}` : ''}`;
}

async function triggerScrollWorldGeneration(projectId: string, generations: any[]) {
  // This would be called asynchronously in a real implementation
  // For now, we're simulating the trigger

  try {
    // In production, this would:
    // 1. Call the Claude Code scroll-world skill
    // 2. Use the generation records to store asset URLs
    // 3. Update project status when complete

    // For demo purposes, we'll update the status after a delay
    setTimeout(async () => {
      await supabase
        .from('scroll_world_projects')
        .update({ status: 'completed' })
        .eq('id', projectId);
    }, 5000);
  } catch (error) {
    console.error('Error in generation trigger:', error);
  }
}
