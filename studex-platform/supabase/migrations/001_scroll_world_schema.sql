-- Scroll-World SaaS Database Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Workspaces
create table public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  metadata jsonb default '{}'::jsonb
);

-- Workspace Members
create table public.workspace_members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  joined_at timestamp with time zone default now(),
  unique(workspace_id, user_id)
);

-- Scroll-World Projects
create table public.scroll_world_projects (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  description text,
  company_name text not null,
  company_logo_url text,
  brand_color text default '#000000',
  brand_accent_color text default '#00FF00',
  industry text,
  status text not null default 'draft' check (status in ('draft', 'generating', 'completed', 'published', 'failed')),
  config jsonb not null default '{}'::jsonb,
  published_url text,
  thumbnail_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  published_at timestamp with time zone,
  created_by uuid not null references auth.users(id)
);

-- Scenes within Projects
create table public.scenes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.scroll_world_projects(id) on delete cascade,
  "order" int not null,
  title text not null,
  description text,
  briefing text,
  aspect_ratio text default '16:9' check (aspect_ratio in ('16:9', '9:16')),
  transition_duration int default 500,
  diorama_style text,
  custom_prompt text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(project_id, "order")
);

-- Generated Assets
create table public.generations (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.scroll_world_projects(id) on delete cascade,
  scene_id uuid references public.scenes(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  input_prompt text not null,
  output_assets jsonb default '[]'::jsonb,
  credits_used int default 0,
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone default now()
);

-- Billing Plans
create table public.scroll_world_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null check (slug in ('starter', 'professional', 'enterprise')),
  price numeric(10,2) not null,
  billing_period text not null check (billing_period in ('monthly', 'annual')),
  features jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id uuid not null references public.scroll_world_plans(id),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(workspace_id)
);

-- Usage Tracking
create table public.scroll_world_usage (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  month text not null, -- YYYY-MM format
  images_generated int default 0,
  videos_generated int default 0,
  credits_used int default 0,
  credits_limit int not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(workspace_id, month)
);

-- Published Worlds (for embedding)
create table public.published_worlds (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.scroll_world_projects(id) on delete cascade,
  slug text unique not null,
  embed_token text unique not null default pgcrypto.gen_random_uuid()::text,
  public_url text,
  view_count int default 0,
  last_viewed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes
create index idx_workspace_members_workspace on public.workspace_members(workspace_id);
create index idx_workspace_members_user on public.workspace_members(user_id);
create index idx_projects_workspace on public.scroll_world_projects(workspace_id);
create index idx_projects_status on public.scroll_world_projects(status);
create index idx_scenes_project on public.scenes(project_id);
create index idx_generations_project on public.generations(project_id);
create index idx_generations_scene on public.generations(scene_id);
create index idx_generations_status on public.generations(status);
create index idx_subscriptions_workspace on public.subscriptions(workspace_id);
create index idx_usage_workspace on public.scroll_world_usage(workspace_id);
create index idx_published_worlds_project on public.published_worlds(project_id);

-- Row Level Security
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.scroll_world_projects enable row level security;
alter table public.scenes enable row level security;
alter table public.generations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.scroll_world_usage enable row level security;
alter table public.published_worlds enable row level security;

-- Policies for Workspaces
create policy "Users can view workspaces they own" on public.workspaces
  for select using (owner_id = auth.uid());

create policy "Users can view workspaces they're members of" on public.workspaces
  for select using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
    )
  );

-- Policies for Projects
create policy "Users can view projects in their workspaces" on public.scroll_world_projects
  for select using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = scroll_world_projects.workspace_id
      and workspace_members.user_id = auth.uid()
    )
    or
    exists (
      select 1 from public.workspaces
      where workspaces.id = scroll_world_projects.workspace_id
      and workspaces.owner_id = auth.uid()
    )
  );

create policy "Editors and above can modify projects" on public.scroll_world_projects
  for update using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = scroll_world_projects.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin', 'editor')
    )
    or
    exists (
      select 1 from public.workspaces
      where workspaces.id = scroll_world_projects.workspace_id
      and workspaces.owner_id = auth.uid()
    )
  );
