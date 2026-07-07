-- Marketing Automation Platform Schema
-- Approval workflows, competitive analysis, agent tasks

-- Content Approvals table
CREATE TABLE IF NOT EXISTS content_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_post_id UUID REFERENCES content_posts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revision_requested')),
  submitted_by UUID,
  approved_by UUID,
  reviewer_comments TEXT,
  approval_chain JSONB DEFAULT '[]',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitor Data table (daily snapshots)
CREATE TABLE IF NOT EXISTS competitor_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  niche TEXT NOT NULL CHECK (niche IN ('meat', 'coffee', 'saas')),
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'tiktok', 'linkedin')),
  competitor_channel_name TEXT NOT NULL,
  competitor_url TEXT,
  video_title TEXT NOT NULL,
  video_description TEXT,
  publish_time TIMESTAMPTZ NOT NULL,
  video_duration_seconds INTEGER,
  view_count INTEGER,
  engagement_count INTEGER,
  engagement_rate FLOAT,
  thumbnail_url TEXT,
  hooks_identified TEXT[],
  key_patterns JSONB DEFAULT '{}',
  raw_data JSONB DEFAULT '{}',
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Analytics table (aggregated insights)
CREATE TABLE IF NOT EXISTS daily_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  niche TEXT NOT NULL CHECK (niche IN ('meat', 'coffee', 'saas')),
  date DATE NOT NULL,
  top_competitors JSONB DEFAULT '[]',
  avg_views INTEGER,
  avg_engagement_rate FLOAT,
  optimal_publish_time TEXT,
  trending_topics TEXT[],
  content_pillars TEXT[],
  hook_patterns JSONB DEFAULT '{}',
  thumbnail_recommendations JSONB DEFAULT '{}',
  length_recommendations TEXT,
  your_channel_performance JSONB DEFAULT '{}',
  gaps_and_opportunities JSONB DEFAULT '{}',
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(niche, date)
);

-- Agent Tasks queue
CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('analyze_competitors', 'extract_insights', 'generate_content', 'monitor_engagement', 'distribute_content')),
  niche TEXT CHECK (niche IN ('meat', 'coffee', 'saas')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  priority INTEGER DEFAULT 0,
  payload JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}',
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kanban Board cards
CREATE TABLE IF NOT EXISTS kanban_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_post_id UUID REFERENCES content_posts(id) ON DELETE CASCADE,
  column_name TEXT NOT NULL CHECK (column_name IN ('backlog', 'in_progress', 'pending_approval', 'scheduled', 'published')),
  position INTEGER DEFAULT 0,
  assigned_to UUID,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_post_id)
);

-- Team Settings table
CREATE TABLE IF NOT EXISTS team_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  description TEXT,
  last_modified_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Publishing Schedule
CREATE TABLE IF NOT EXISTS publishing_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publish_time TIME NOT NULL DEFAULT '12:30:00',
  timezone TEXT DEFAULT 'UTC',
  enabled BOOLEAN DEFAULT true,
  content_post_id UUID REFERENCES content_posts(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'publishing', 'published', 'failed')),
  published_at TIMESTAMPTZ,
  blotato_job_id TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Status & Coordination
CREATE TABLE IF NOT EXISTS agent_coordination (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL UNIQUE,
  current_task_id UUID REFERENCES agent_tasks(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'waiting', 'error')),
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_approvals_status ON content_approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_content_post ON content_approvals(content_post_id);
CREATE INDEX IF NOT EXISTS idx_approvals_created ON content_approvals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_competitor_data_niche ON competitor_data(niche);
CREATE INDEX IF NOT EXISTS idx_competitor_data_platform ON competitor_data(platform);
CREATE INDEX IF NOT EXISTS idx_competitor_data_collected ON competitor_data(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_competitor_data_views ON competitor_data(view_count DESC);

CREATE INDEX IF NOT EXISTS idx_daily_analytics_niche_date ON daily_analytics(niche, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent ON agent_tasks(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_priority ON agent_tasks(priority DESC);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created ON agent_tasks(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kanban_cards_column ON kanban_cards(column_name);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_content_post ON kanban_cards(content_post_id);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_assigned ON kanban_cards(assigned_to);

CREATE INDEX IF NOT EXISTS idx_publishing_schedule_scheduled ON publishing_schedule(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_publishing_schedule_status ON publishing_schedule(status);

CREATE INDEX IF NOT EXISTS idx_agent_coord_name ON agent_coordination(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_coord_status ON agent_coordination(status);

-- Functions for approval workflow
CREATE OR REPLACE FUNCTION submit_for_approval(post_id UUID, submitted_by_id UUID)
RETURNS TABLE (approval_id UUID, status TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_approval_id UUID;
BEGIN
  INSERT INTO content_approvals (content_post_id, submitted_by, status)
  VALUES (post_id, submitted_by_id, 'pending')
  RETURNING id INTO v_approval_id;

  UPDATE kanban_cards
  SET column_name = 'pending_approval', updated_at = NOW()
  WHERE content_post_id = post_id;

  RETURN QUERY SELECT v_approval_id, 'pending'::TEXT;
END;
$$;

-- Function to approve content
CREATE OR REPLACE FUNCTION approve_content(approval_id UUID, approved_by_id UUID, comments TEXT DEFAULT NULL)
RETURNS TABLE (success BOOLEAN, message TEXT, published BOOLEAN)
LANGUAGE plpgsql
AS $$
DECLARE
  v_post_id UUID;
  v_scheduled_time TIMESTAMPTZ;
BEGIN
  UPDATE content_approvals
  SET status = 'approved', approved_by = approved_by_id, approved_at = NOW(), reviewer_comments = comments
  WHERE id = approval_id
  RETURNING content_post_id INTO v_post_id;

  UPDATE kanban_cards
  SET column_name = 'scheduled', updated_at = NOW()
  WHERE content_post_id = v_post_id;

  SELECT scheduled_time INTO v_scheduled_time FROM content_posts WHERE id = v_post_id;

  RETURN QUERY SELECT true, 'Content approved successfully', (v_scheduled_time IS NOT NULL AND v_scheduled_time <= NOW());
END;
$$;

-- Function to get approval dashboard data
CREATE OR REPLACE FUNCTION get_pending_approvals()
RETURNS TABLE (
  approval_id UUID,
  post_id UUID,
  influencer_name TEXT,
  platform TEXT,
  caption TEXT,
  submitted_at TIMESTAMPTZ,
  hashtags TEXT,
  status TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ca.id,
    cp.id,
    i.name,
    cp.platform,
    cp.caption,
    ca.submitted_at,
    array_to_string(cp.hashtags, ' '),
    ca.status
  FROM content_approvals ca
  JOIN content_posts cp ON ca.content_post_id = cp.id
  JOIN influencers i ON cp.influencer_id = i.id
  WHERE ca.status IN ('pending', 'revision_requested')
  ORDER BY ca.submitted_at DESC;
END;
$$;

-- Function: Get top competitors for niche
CREATE OR REPLACE FUNCTION get_top_competitors(v_niche TEXT, v_limit INT DEFAULT 5)
RETURNS TABLE (
  competitor_channel TEXT,
  platform TEXT,
  avg_views BIGINT,
  avg_engagement FLOAT,
  total_videos INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cd.competitor_channel_name,
    cd.platform,
    AVG(cd.view_count)::BIGINT,
    AVG(cd.engagement_rate)::FLOAT,
    COUNT(*)::INT
  FROM competitor_data cd
  WHERE cd.niche = v_niche AND cd.collected_at >= NOW() - INTERVAL '7 days'
  GROUP BY cd.competitor_channel_name, cd.platform
  ORDER BY AVG(cd.view_count) DESC
  LIMIT v_limit;
END;
$$;

-- Initialize Team Settings
INSERT INTO team_settings (setting_key, setting_value, description)
VALUES
  ('publish_time', '"12:30"'::JSONB, 'Daily publish time (HH:MM)'),
  ('timezone', '"UTC"'::JSONB, 'Timezone for scheduling'),
  ('approval_required', 'true'::JSONB, 'Require human approval before publishing'),
  ('approval_window_minutes', '15'::JSONB, 'Minutes before publish to request approvals'),
  ('blotato_enabled', 'true'::JSONB, 'Use Blotato for distribution'),
  ('auto_publish_on_timeout', 'false'::JSONB, 'Auto-publish if no approval/rejection within window'),
  ('track_competitors', 'true'::JSONB, 'Daily competitor analysis enabled'),
  ('brand_voice', '{"attributes": ["authentic", "innovative", "customer-focused"]}'::JSONB, 'Brand voice guidelines');

-- Enable RLS
ALTER TABLE content_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_coordination ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read competitor data" ON competitor_data
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read daily analytics" ON daily_analytics
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage approvals" ON content_approvals
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their kanban cards" ON kanban_cards
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage publishing" ON publishing_schedule
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage agent coordination" ON agent_coordination
  FOR ALL USING (auth.uid() IS NOT NULL);
