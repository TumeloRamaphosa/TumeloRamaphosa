-- Social Media Influencer Content Engine Schema
-- For generating and managing AI influencer personas

-- Influencer Personas table
CREATE TABLE IF NOT EXISTS influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  handle TEXT NOT NULL UNIQUE,
  bio TEXT,
  niche TEXT NOT NULL CHECK (niche IN ('meat', 'coffee', 'saas')),
  avatar_url TEXT,
  follower_count INTEGER DEFAULT 0,
  engagement_rate FLOAT DEFAULT 0,
  personality_traits JSONB DEFAULT '{}',
  audience_demographics JSONB DEFAULT '{}',
  content_style TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  blotato_account_id TEXT,
  pik_brand_id TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Media Content Posts table
CREATE TABLE IF NOT EXISTS content_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'instagram', 'tiktok', 'linkedin', 'youtube')),
  caption TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('image', 'video', 'carousel', 'reel', 'short')),
  pik_image_url TEXT,
  pik_design_id TEXT,
  hashtags TEXT[],
  call_to_action TEXT,
  product_mention TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_time TIMESTAMPTZ,
  published_time TIMESTAMPTZ,
  blotato_post_id TEXT,
  engagement_metrics JSONB DEFAULT '{}',
  generated_by_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Templates table (reusable templates)
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  niche TEXT NOT NULL CHECK (niche IN ('meat', 'coffee', 'saas')),
  platform TEXT NOT NULL,
  template TEXT NOT NULL,
  hashtag_suggestions TEXT[],
  visual_style TEXT,
  tone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Tracking table
CREATE TABLE IF NOT EXISTS influencer_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  niche TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10, 2),
  target_audience TEXT,
  campaign_goal TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  influencers UUID[] DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_influencers_niche ON influencers(niche);
CREATE INDEX IF NOT EXISTS idx_influencers_status ON influencers(status);
CREATE INDEX IF NOT EXISTS idx_content_posts_influencer ON content_posts(influencer_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_status ON content_posts(status);
CREATE INDEX IF NOT EXISTS idx_content_posts_platform ON content_posts(platform);
CREATE INDEX IF NOT EXISTS idx_content_posts_created ON content_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_niche ON influencer_campaigns(niche);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON influencer_campaigns(status);

-- Function: Generate influencer handle from name
CREATE OR REPLACE FUNCTION generate_influencer_handle(name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN '@' || lower(replace(replace(name, ' ', '_'), '-', '_'));
END;
$$;

-- Function: Get engagement metrics summary
CREATE OR REPLACE FUNCTION get_influencer_stats(influencer_id UUID)
RETURNS TABLE (
  total_posts BIGINT,
  average_engagement FLOAT,
  total_reach BIGINT,
  platforms TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    AVG((cp.engagement_metrics->>'engagement_rate')::FLOAT)::FLOAT,
    SUM((cp.engagement_metrics->>'reach')::INTEGER)::BIGINT,
    ARRAY_AGG(DISTINCT cp.platform)
  FROM content_posts cp
  WHERE cp.influencer_id = $1 AND cp.status = 'published';
END;
$$;

-- Enable RLS
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active influencers" ON influencers
  FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can read published posts" ON content_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage influencers" ON influencers
  FOR ALL USING (auth.uid() = created_by OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage posts" ON content_posts
  FOR ALL USING (
    influencer_id IN (
      SELECT id FROM influencers WHERE created_by = auth.uid() OR auth.uid() IS NOT NULL
    )
  );

-- Seed content templates
INSERT INTO content_templates (name, niche, platform, template, hashtag_suggestions, visual_style, tone)
VALUES
  (
    'Product Launch',
    'meat',
    'instagram',
    'Introducing our newest {{product}}! 🥩 {{description}} Available now at {{link}}',
    ARRAY['#MeatLovers', '#FreshMeat', '#Butcher', '#Quality', '#Premium'],
    'vibrant_warm_tones',
    'enthusiastic'
  ),
  (
    'Coffee Morning Ritual',
    'coffee',
    'tiktok',
    'POV: Your morning just got better ☕️ {{product}} - {{description}} #CoffeeLovers #MorningVibes',
    ARRAY['#CoffeeAddict', '#Barista', '#CoffeeLife', '#MorningCoffee', '#ArtisanCoffee'],
    'aesthetic_warm_brown',
    'casual_inspiring'
  ),
  (
    'SaaS Power Feature',
    'saas',
    'linkedin',
    'Just shipped: {{feature}} 🚀 This {{benefit}} for your workflow. Watch how {{impact}} {{link}}',
    ARRAY['#SaaS', '#Startup', '#ProductHunt', '#Tech', '#Innovation'],
    'modern_minimalist',
    'professional_innovative'
  );
