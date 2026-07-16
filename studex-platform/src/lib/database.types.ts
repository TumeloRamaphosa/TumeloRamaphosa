// Database types for Scroll-World SaaS
export interface ScrollWorldProject {
  id: string;
  user_id: string;
  workspace_id?: string;
  name: string;
  description: string;
  company_name: string;
  company_logo_url?: string;
  brand_color: string;
  brand_accent_color: string;
  industry: string;
  status: 'draft' | 'generating' | 'completed' | 'published' | 'failed';
  created_at: string;
  updated_at: string;
  published_at?: string;
  config: WorldConfig;
  published_url?: string;
  thumbnail_url?: string;
}

export interface WorldConfig {
  title: string;
  tagline: string;
  scenes: Scene[];
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
  cta: {
    text: string;
    url: string;
    label: string;
  };
  metadata: {
    description: string;
    keywords: string[];
    ogImage?: string;
  };
}

export interface Scene {
  id: string;
  order: number;
  title: string;
  description: string;
  briefing: string; // Used for AI generation
  aspectRatio: '16:9' | '9:16';
  transitionDuration: number; // milliseconds
  dioramaStyle?: string;
  customPrompt?: string;
  generatedAssets?: {
    imageUrl?: string;
    videoUrl?: string;
    mobileVideoUrl?: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
  };
}

export interface Generation {
  id: string;
  project_id: string;
  scene_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input_prompt: string;
  output_assets: GeneratedAsset[];
  credits_used: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface GeneratedAsset {
  type: 'image' | 'video';
  url: string;
  duration?: number;
  fileSize: number;
  format: string;
}

export interface ScrollWorldWorkspace {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joined_at: string;
}

export interface ScrollWorldUsage {
  id: string;
  workspace_id: string;
  month: string; // YYYY-MM
  images_generated: number;
  videos_generated: number;
  credits_used: number;
  credits_limit: number;
}

export interface ScrollWorldPlan {
  id: string;
  name: string;
  slug: 'starter' | 'professional' | 'enterprise';
  price: number;
  billing_period: 'monthly' | 'annual';
  features: {
    max_projects: number;
    monthly_credits: number;
    team_members: number;
    priority_generation: boolean;
    analytics: boolean;
    custom_domain: boolean;
    api_access: boolean;
  };
}

export interface Subscription {
  id: string;
  workspace_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}
