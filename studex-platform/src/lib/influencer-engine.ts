import { VertexAI } from '@google-cloud/vertexai';

interface InfluencerPersona {
  name: string;
  handle: string;
  bio: string;
  niche: 'meat' | 'coffee' | 'saas';
  personality_traits: Record<string, string>;
  audience_demographics: Record<string, any>;
  content_style: string;
  follower_count: number;
  engagement_rate: number;
}

interface ContentPost {
  caption: string;
  hashtags: string[];
  call_to_action: string;
  content_type: 'image' | 'video' | 'carousel' | 'reel' | 'short';
  visual_style: string;
}

interface ContentGenerationRequest {
  influencerId: string;
  niche: 'meat' | 'coffee' | 'saas';
  product?: string;
  platform: 'twitter' | 'instagram' | 'tiktok' | 'linkedin' | 'youtube';
  agent: 'charlie' | 'robusca' | 'naledi';
}

const AGENT_PROMPTS = {
  charlie: `You are Charlie (CHARLIE-OPS), StudEx AI consultant for operations and client support.
    Generate authentic, engaging social media content that feels personal and trusted.
    Focus on product quality, customer satisfaction, and direct engagement.`,
  robusca: `You are Robusca (ROBUSCA-GLOBAL), StudEx AI consultant for global markets.
    Generate strategic, sophisticated content that appeals to international audiences and premium positioning.
    Focus on market trends, global partnerships, and enterprise value.`,
  naledi: `You are Naledi (NALEDI-CREATIVE), StudEx AI consultant for marketing and creative content.
    Generate viral, creative content with high engagement potential.
    Focus on entertainment value, storytelling, and cultural relevance.`,
};

const NICHE_TEMPLATES = {
  meat: {
    description: 'Premium quality meat products and butchery expertise',
    tone: 'warm, professional, passionate about quality',
    audience: 'health-conscious food lovers, BBQ enthusiasts, premium consumers',
    content_pillars: [
      'Product quality & sourcing',
      'Cooking tips & recipes',
      'Nutritional benefits',
      'Chef endorsements',
      'Behind-the-scenes production',
    ],
  },
  coffee: {
    description: 'Artisanal coffee, roasting expertise, and coffee culture',
    tone: 'passionate, aspirational, knowledgeable',
    audience: 'coffee aficionados, morning routine enthusiasts, lifestyle seekers',
    content_pillars: [
      'Origin stories',
      'Brewing techniques',
      'Tasting notes',
      'Coffee culture',
      'Limited editions',
    ],
  },
  saas: {
    description: 'Enterprise software solutions, productivity, and innovation',
    tone: 'professional, innovative, results-driven',
    audience: 'startup founders, enterprise leaders, tech enthusiasts',
    content_pillars: [
      'Product features',
      'Success stories',
      'Industry insights',
      'Growth hacks',
      'Developer resources',
    ],
  },
};

export class InfluencerContentEngine {
  private vertexAI: VertexAI;

  constructor() {
    this.vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: 'us-central1',
    });
  }

  async generateInfluencerPersona(niche: 'meat' | 'coffee' | 'saas'): Promise<InfluencerPersona> {
    const model = this.vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const nicheMeta = NICHE_TEMPLATES[niche];

    const prompt = `Generate a unique social media influencer persona for the ${niche} industry.

Context:
- Niche: ${niche}
- Description: ${nicheMeta.description}
- Target Audience: ${nicheMeta.audience}
- Content Pillars: ${nicheMeta.content_pillars.join(', ')}

Create an authentic influencer with:
1. Real-sounding name and handle
2. Compelling bio (150 chars)
3. Personality traits (3-4 key traits)
4. Audience demographics (age range, interests, location)
5. Unique content style

Format as JSON with keys: name, handle, bio, personality_traits (object), audience_demographics (object), content_style`;

    const response = await model.generateContent(prompt);
    const content = response.response.candidates?.[0]?.content?.parts?.[0];

    if (!content || content.text === undefined) {
      throw new Error('Failed to generate influencer persona');
    }

    let jsonStr = content.text;
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const influencerData = JSON.parse(jsonStr);

    return {
      name: influencerData.name,
      handle: influencerData.handle || `@${influencerData.name.toLowerCase().replace(/\s+/g, '_')}`,
      bio: influencerData.bio,
      niche,
      personality_traits: influencerData.personality_traits || {},
      audience_demographics: influencerData.audience_demographics || {},
      content_style: influencerData.content_style || 'authentic',
      follower_count: Math.floor(Math.random() * 900000) + 100000,
      engagement_rate: Math.random() * 12 + 3,
    };
  }

  async generateContent(
    influencer: InfluencerPersona,
    req: ContentGenerationRequest,
    product?: string,
  ): Promise<ContentPost> {
    const model = this.vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const agentPrompt = AGENT_PROMPTS[req.agent];
    const nicheMeta = NICHE_TEMPLATES[req.niche];

    const platformGuidelines = {
      instagram: 'Caption: 150-300 chars, max 5-7 hashtags, emoji-friendly, story-like',
      twitter: 'Caption: 280 chars max, concise, engaging, 2-3 hashtags',
      tiktok: 'Caption: 150-200 chars, trending sounds/challenges reference, viral potential',
      linkedin: 'Caption: 300-400 chars, professional yet personable, industry insights',
      youtube: 'Title + description with keywords, CTA for subscription, 3-5 hashtags',
    };

    const prompt = `${agentPrompt}

Create a social media post as ${influencer.name} (@${influencer.handle.replace('@', '')})

Influencer Profile:
- Name: ${influencer.name}
- Personality: ${Object.values(influencer.personality_traits).join(', ')}
- Content Style: ${influencer.content_style}
- Audience: ${nicheMeta.audience}

Content Brief:
- Platform: ${req.platform}
- Niche: ${req.niche}
- ${product ? `Product/Topic: ${product}` : ''}
- Guidelines: ${platformGuidelines[req.platform]}

Generate an authentic, engaging post with:
1. Caption (following platform guidelines)
2. Relevant hashtags (3-7)
3. Call-to-action
4. Suggested visual style (tone, colors, mood)

Format as JSON with keys: caption, hashtags (array), call_to_action, visual_style`;

    const response = await model.generateContent(prompt);
    const content = response.response.candidates?.[0]?.content?.parts?.[0];

    if (!content || content.text === undefined) {
      throw new Error('Failed to generate content');
    }

    let jsonStr = content.text;
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const contentData = JSON.parse(jsonStr);

    return {
      caption: contentData.caption,
      hashtags: Array.isArray(contentData.hashtags) ? contentData.hashtags : [],
      call_to_action: contentData.call_to_action || 'Check it out!',
      content_type: this.selectContentType(req.platform),
      visual_style: contentData.visual_style || 'professional',
    };
  }

  private selectContentType(platform: string): 'image' | 'video' | 'carousel' | 'reel' | 'short' {
    const mapping = {
      instagram: 'carousel' as const,
      twitter: 'image' as const,
      tiktok: 'short' as const,
      linkedin: 'image' as const,
      youtube: 'video' as const,
    };
    return mapping[platform] || 'image';
  }

  async generatePikDesign(
    influencer: InfluencerPersona,
    content: ContentPost,
    niche: 'meat' | 'coffee' | 'saas',
  ): Promise<{
    pikDesignPrompt: string;
    visualStyle: Record<string, string>;
  }> {
    const nicheMeta = NICHE_TEMPLATES[niche];

    const colorSchemes = {
      meat: {
        primary: '#8B4513',
        secondary: '#D2691E',
        accent: '#FF6B6B',
        mood: 'warm, appetizing, premium',
      },
      coffee: {
        primary: '#6F4E37',
        secondary: '#8B7355',
        accent: '#D4A574',
        mood: 'cozy, sophisticated, inviting',
      },
      saas: {
        primary: '#0066CC',
        secondary: '#4D94FF',
        accent: '#00CC99',
        mood: 'modern, clean, innovative',
      },
    };

    const colors = colorSchemes[niche];

    const pikDesignPrompt = `Design for ${influencer.name}'s ${niche} social media post:
- Platform: ${content.content_type}
- Theme: ${content.visual_style}
- Color palette: Primary ${colors.primary}, Secondary ${colors.secondary}, Accent ${colors.accent}
- Mood: ${colors.mood}
- Caption: ${content.caption.substring(0, 50)}...
- Style: Modern, on-brand, highly shareable`;

    return {
      pikDesignPrompt,
      visualStyle: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        mood: colors.mood,
        layout: content.content_type === 'carousel' ? 'grid' : 'single',
      },
    };
  }
}

export const influencerEngine = new InfluencerContentEngine();
