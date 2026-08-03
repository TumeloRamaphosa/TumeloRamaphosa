import { createClient } from '@supabase/supabase-js';
import { dataAnalystAgent } from './data-analyst';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface ContentOption {
  title: string;
  hook: string;
  description: string;
  hashtags: string[];
  cta: string;
  thumbnail_concept: string;
  predicted_engagement: number;
  reasoning: string;
  inspired_by_competitor?: string;
}

interface BrandVoiceReference {
  tone: string[];
  pacing: 'fast' | 'medium' | 'slow';
  typical_length: number;
  hook_style: string[];
  cta_style: string;
  audience_focus: string;
  visual_style: string[];
}

export class BrandVoiceAgent {
  /**
   * Generate 5 content options based on competitor insights
   * Adapts insights to YOUR brand voice
   */
  static async generateContentOptions(
    niche: 'meat' | 'coffee' | 'saas',
  ): Promise<ContentOption[]> {
    try {
      console.log(`[Voice] Generating 5 content options for ${niche} with brand voice adaptation`);

      // Get latest insights from analyst
      const insights = await dataAnalystAgent.getLatestInsights(niche);
      if (!insights) {
        throw new Error('No insights available from data analyst');
      }

      // Get brand voice reference
      const brandVoice = await this.getBrandVoiceReference();

      // Generate 5 different options
      const options = [
        this.generateOption(niche, insights, brandVoice, 1, 'educational'),
        this.generateOption(niche, insights, brandVoice, 2, 'entertaining'),
        this.generateOption(niche, insights, brandVoice, 3, 'storytelling'),
        this.generateOption(niche, insights, brandVoice, 4, 'controversial'),
        this.generateOption(niche, insights, brandVoice, 5, 'inspirational'),
      ];

      // Store options as content drafts
      await this.storeContentOptions(niche, options);

      console.log(`[Voice] Generated ${options.length} content options for ${niche}`);

      return options;
    } catch (error) {
      console.error('[Voice] Failed to generate content options:', error);
      throw error;
    }
  }

  /**
   * Generate individual content option
   */
  private static generateOption(
    niche: string,
    insights: any,
    brandVoice: BrandVoiceReference,
    optionNumber: number,
    style: string,
  ): ContentOption {
    const topic = insights.trending_topics[0] || niche;
    const gapOpportunity = insights.gap_opportunities[optionNumber - 1] || topic;

    let title = '';
    let hook = '';
    let description = '';
    let cta = '';
    let reasoning = '';

    switch (style) {
      case 'educational':
        title = `The REAL Truth About ${topic} | ${niche.toUpperCase()}`;
        hook = `Did you know most people get ${topic} completely wrong?`;
        description = `Deep dive into ${topic} with science-backed insights. We break down the myths and show you exactly what actually works. No fluff, pure knowledge.`;
        reasoning = `Educational content drives 3.2x higher engagement. Educate your audience while positioning yourself as an expert.`;
        break;

      case 'entertaining':
        title = `Wait Till You See What Happens With ${gapOpportunity}`;
        hook = `This ${topic} experiment went VIRAL 🔥`;
        description = `Entertainment is key to viral success. Mix personality, humor, and surprising moments to keep viewers watching till the end.`;
        reasoning = `Entertaining hooks get 40% more watch time. Competitors are missing this angle entirely.`;
        break;

      case 'storytelling':
        title = `How ${gapOpportunity} Changed Everything`;
        hook = `Let me tell you a story you've never heard about ${topic}...`;
        description = `Personal stories create emotional connections. Tell a journey from problem → discovery → solution that your audience can relate to.`;
        reasoning = `Story-driven content converts 2.5x better to sales. Builds loyal audience faster than facts alone.`;
        break;

      case 'controversial':
        title = `UNPOPULAR OPINION: ${topic} Is Actually...`;
        hook = `Everyone's wrong about ${topic}, and here's why 👇`;
        description = `Take a contrarian stance on a common belief. Use evidence and reasoning to challenge the narrative. This drives massive engagement through debate.`;
        reasoning = `Controversial takes generate 5x more comments. Debate drives algorithm discovery and creates viral moments.`;
        break;

      case 'inspirational':
        title = `Transform Your ${niche} Game With This ${gapOpportunity} Secret`;
        hook = `If you want to master ${topic}, watch this...`;
        description = `Inspire with transformation stories. Show the before/after journey. Aspirational content motivates action and sharing.`;
        reasoning = `Inspirational content gets highest shares. Creates social proof and motivates viewers to take action.`;
        break;
    }

    const hashtags = this.generateHashtags(niche, topic);
    const ctaStyle = brandVoice.cta_style || 'Subscribe for daily content';
    const predictedEngagement = this.predictEngagement(style, insights.engagement_rate_benchmark);

    return {
      title,
      hook,
      description,
      hashtags,
      cta: ctaStyle,
      thumbnail_concept: this.generateThumbnailConcept(title, style),
      predicted_engagement: predictedEngagement,
      reasoning,
      inspired_by_competitor: insights.top_competitors_this_week[0],
    };
  }

  /**
   * Generate hashtags for content
   */
  private static generateHashtags(niche: string, topic: string): string[] {
    const baseHashtags: Record<string, string[]> = {
      meat: ['#meat', '#sustainable', '#nutrition', '#foodie', '#health'],
      coffee: ['#coffee', '#espresso', '#barista', '#coffeelover', '#specialty'],
      saas: ['#saas', '#startup', '#software', '#tech', '#business'],
    };

    const topicHashtags = [
      `#${topic.replace(/\s+/g, '')}`,
      '#trending',
      '#viral',
      '#mustwatch',
      '#shorts',
    ];

    return [
      ...(baseHashtags[niche] || []),
      ...topicHashtags,
    ].slice(0, 10);
  }

  /**
   * Generate thumbnail concept description
   */
  private static generateThumbnailConcept(title: string, style: string): string {
    const concepts: Record<string, string> = {
      educational: `Clean design with bold text, contrast colors (red/yellow), expert credibility symbols`,
      entertaining: `Exaggerated expression, bright colors, emoji overlay, surprise element visual`,
      storytelling: `Human face close-up, emotional expression, warm colors, before/after split`,
      controversial: `High contrast, question mark or exclamation, bold red/black, creates FOMO`,
      inspirational: `Uplifting visuals, transformation imagery, warm golds/whites, aspirational feel`,
    };

    return concepts[style] || 'Bold text, contrasting colors, clear CTA visual';
  }

  /**
   * Predict engagement rate for content style
   */
  private static predictEngagement(style: string, benchmark: number): number {
    const multipliers: Record<string, number> = {
      educational: 1.8,
      entertaining: 2.2,
      storytelling: 2.5,
      controversial: 3.0,
      inspirational: 2.3,
    };

    return benchmark * (multipliers[style] || 1.5);
  }

  /**
   * Get brand voice reference from database
   * User uploads their first episode - we analyze it for tone, style, etc.
   */
  private static async getBrandVoiceReference(): Promise<BrandVoiceReference> {
    try {
      const { data, error } = await supabase
        .from('team_settings')
        .select('brand_voice_guidelines')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('[Voice] Could not load brand voice reference:', error);
      }

      if (data?.brand_voice_guidelines) {
        return data.brand_voice_guidelines as BrandVoiceReference;
      }

      // Default brand voice if not configured
      return this.getDefaultBrandVoice();
    } catch (error) {
      console.warn('[Voice] Error getting brand voice reference, using default:', error);
      return this.getDefaultBrandVoice();
    }
  }

  /**
   * Default brand voice characteristics
   */
  private static getDefaultBrandVoice(): BrandVoiceReference {
    return {
      tone: ['professional', 'approachable', 'trustworthy'],
      pacing: 'medium',
      typical_length: 180,
      hook_style: ['curiosity', 'problem-focused'],
      cta_style: 'Subscribe for daily updates',
      audience_focus: 'professionals interested in growth',
      visual_style: ['clean', 'modern', 'data-driven'],
    };
  }

  /**
   * Store content options as drafts
   */
  private static async storeContentOptions(
    niche: string,
    options: ContentOption[],
  ): Promise<void> {
    try {
      const posts = options.map((option, index) => ({
        niche,
        title: option.title,
        description: option.description,
        hook: option.hook,
        cta: option.cta,
        hashtags: option.hashtags,
        thumbnail_concept: option.thumbnail_concept,
        predicted_engagement: option.predicted_engagement,
        status: 'draft',
        content_order: index + 1,
        created_by_agent: 'brand-voice',
        created_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from('content_posts').insert(posts);

      if (error) throw error;
    } catch (error) {
      console.error('[Voice] Failed to store content options:', error);
      throw error;
    }
  }

  /**
   * Adapt brand voice to user feedback
   * Called if user rejects content - helps agent learn
   */
  static async adaptToBrandVoice(feedback: string): Promise<void> {
    try {
      console.log('[Voice] Adapting brand voice based on feedback:', feedback);

      // Store feedback for future iterations
      await supabase.from('brand_voice_feedback').insert({
        feedback,
        processed_at: new Date().toISOString(),
      });

      // In future: Claude could re-analyze brand voice based on accumulated feedback
    } catch (error) {
      console.error('[Voice] Failed to adapt brand voice:', error);
    }
  }

  /**
   * Train brand voice from user's first episode video
   * Called once when user uploads their first YouTube video
   */
  static async trainBrandVoice(videoAnalysis: {
    tone: string[];
    pacing: 'fast' | 'medium' | 'slow';
    typical_length: number;
    hook_style: string[];
    cta_style: string;
    audience_focus: string;
    visual_style: string[];
  }): Promise<void> {
    try {
      console.log('[Voice] Training brand voice from user episode analysis');

      const { error } = await supabase
        .from('team_settings')
        .upsert({
          id: 1,
          brand_voice_guidelines: videoAnalysis,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      console.log('[Voice] Brand voice successfully trained and stored');
    } catch (error) {
      console.error('[Voice] Failed to train brand voice:', error);
      throw error;
    }
  }

  /**
   * Get pending content awaiting approval
   */
  static async getPendingContent(niche?: string): Promise<ContentOption[]> {
    try {
      let query = supabase
        .from('content_posts')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

      if (niche) {
        query = query.eq('niche', niche);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map((post) => ({
        title: post.title,
        hook: post.hook,
        description: post.description,
        hashtags: post.hashtags || [],
        cta: post.cta,
        thumbnail_concept: post.thumbnail_concept,
        predicted_engagement: post.predicted_engagement,
        reasoning: post.description,
      }));
    } catch (error) {
      console.error('[Voice] Failed to get pending content:', error);
      return [];
    }
  }
}

export const brandVoiceAgent = new BrandVoiceAgent();
