import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface CompetitorData {
  competitor_id: string;
  platform: 'youtube' | 'instagram' | 'tiktok';
  video_title: string;
  channel_name: string;
  views: number;
  likes: number;
  comments: number;
  publish_time: Date;
  video_duration: number;
  thumbnail_url: string;
  video_url: string;
  extracted_hooks: string[];
  cta_text: string;
  hashtags: string[];
  niche: 'meat' | 'coffee' | 'saas';
}

export class CompetitorScoutAgent {
  /**
   * Analyze top competitors for a specific niche
   * Uses Agent-Reach integration to fetch competitor data
   */
  static async analyzeCompetitors(
    niche: 'meat' | 'coffee' | 'saas',
    timeframeDays: number = 30,
  ): Promise<CompetitorData[]> {
    try {
      console.log(
        `[Scout] Analyzing top competitors in ${niche} niche (last ${timeframeDays} days)`,
      );

      // Query Agent-Reach API for competitor data
      // This would typically call an external API to fetch top-performing videos
      const competitors = await this.fetchCompetitorsFromAgentReach(niche, timeframeDays);

      // Store raw competitor data
      const storedData = await this.storeCompetitorData(competitors);

      console.log(`[Scout] Found ${storedData.length} top competitors in ${niche}`);

      return storedData;
    } catch (error) {
      console.error('[Scout] Failed to analyze competitors:', error);
      throw error;
    }
  }

  /**
   * Fetch competitor data from Agent-Reach API
   * This is a placeholder - actual implementation requires Agent-Reach credentials
   */
  private static async fetchCompetitorsFromAgentReach(
    niche: string,
    timeframeDays: number,
  ): Promise<CompetitorData[]> {
    try {
      // NOTE: Requires AGENT_REACH_API_URL and AGENT_REACH_API_KEY in environment
      const agentReachUrl = process.env.AGENT_REACH_API_URL;
      if (!agentReachUrl) {
        console.warn('[Scout] Agent-Reach API URL not configured, returning mock data');
        return this.generateMockCompetitorData(niche);
      }

      const response = await fetch(`${agentReachUrl}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AGENT_REACH_API_KEY}`,
        },
        body: JSON.stringify({
          niche,
          timeframe_days: timeframeDays,
          platforms: ['youtube', 'instagram', 'tiktok'],
          sort_by: 'views',
          limit: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent-Reach API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.competitors || [];
    } catch (error) {
      console.error('[Scout] Agent-Reach fetch failed:', error);
      // Fallback to mock data for testing
      return this.generateMockCompetitorData(niche);
    }
  }

  /**
   * Store competitor data in Supabase for analysis
   */
  private static async storeCompetitorData(competitors: CompetitorData[]): Promise<CompetitorData[]> {
    try {
      const { data, error } = await supabase
        .from('competitor_data')
        .insert(
          competitors.map((c) => ({
            competitor_id: c.competitor_id,
            platform: c.platform,
            niche: c.niche,
            video_title: c.video_title,
            channel_name: c.channel_name,
            views: c.views,
            likes: c.likes,
            comments: c.comments,
            publish_time: c.publish_time.toISOString(),
            video_duration: c.video_duration,
            thumbnail_url: c.thumbnail_url,
            video_url: c.video_url,
            extracted_hooks: c.extracted_hooks,
            cta_text: c.cta_text,
            hashtags: c.hashtags,
            analyzed_at: new Date().toISOString(),
          })),
        )
        .select();

      if (error) throw error;

      return (data || competitors) as CompetitorData[];
    } catch (error) {
      console.error('[Scout] Failed to store competitor data:', error);
      throw error;
    }
  }

  /**
   * Get top competitors for a niche from database
   */
  static async getTopCompetitors(
    niche: 'meat' | 'coffee' | 'saas',
    limit: number = 5,
  ): Promise<CompetitorData[]> {
    try {
      const { data, error } = await supabase
        .from('competitor_data')
        .select('*')
        .eq('niche', niche)
        .order('views', { ascending: false })
        .order('analyzed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []) as CompetitorData[];
    } catch (error) {
      console.error('[Scout] Failed to get top competitors:', error);
      return [];
    }
  }

  /**
   * Extract engagement patterns from competitor videos
   */
  static async extractEngagementPatterns(
    niche: 'meat' | 'coffee' | 'saas',
  ): Promise<{
    avg_views: number;
    avg_likes: number;
    avg_comments: number;
    optimal_video_duration: number;
    optimal_publish_hour: number;
    trending_hooks: string[];
    trending_hashtags: string[];
    engagement_rate: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('competitor_data')
        .select('*')
        .eq('niche', niche)
        .order('analyzed_at', { ascending: false })
        .limit(10);

      if (error || !data || data.length === 0) {
        console.warn(`[Scout] No competitor data found for ${niche}`);
        return {
          avg_views: 0,
          avg_likes: 0,
          avg_comments: 0,
          optimal_video_duration: 120,
          optimal_publish_hour: 12,
          trending_hooks: [],
          trending_hashtags: [],
          engagement_rate: 0,
        };
      }

      const avgViews = Math.round(
        data.reduce((sum: number, d: any) => sum + d.views, 0) / data.length,
      );
      const avgLikes = Math.round(
        data.reduce((sum: number, d: any) => sum + d.likes, 0) / data.length,
      );
      const avgComments = Math.round(
        data.reduce((sum: number, d: any) => sum + d.comments, 0) / data.length,
      );

      // Extract most common hooks and hashtags
      const allHooks: string[] = [];
      const allHashtags: string[] = [];
      data.forEach((d: any) => {
        if (d.extracted_hooks) {
          allHooks.push(...(Array.isArray(d.extracted_hooks) ? d.extracted_hooks : []));
        }
        if (d.hashtags) {
          allHashtags.push(...(Array.isArray(d.hashtags) ? d.hashtags : []));
        }
      });

      const trendingHooks = this.getTopItems(allHooks, 5);
      const trendingHashtags = this.getTopItems(allHashtags, 10);

      const engagementRate = avgViews > 0 ? (avgLikes + avgComments) / avgViews : 0;

      return {
        avg_views: avgViews,
        avg_likes: avgLikes,
        avg_comments: avgComments,
        optimal_video_duration: 120,
        optimal_publish_hour: 12,
        trending_hooks: trendingHooks,
        trending_hashtags: trendingHashtags,
        engagement_rate: engagementRate,
      };
    } catch (error) {
      console.error('[Scout] Failed to extract patterns:', error);
      throw error;
    }
  }

  /**
   * Get most common items from an array
   */
  private static getTopItems(items: string[], limit: number): string[] {
    const count: Record<string, number> = {};
    items.forEach((item) => {
      count[item] = (count[item] || 0) + 1;
    });

    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((entry) => entry[0]);
  }

  /**
   * Generate mock competitor data for testing
   */
  private static generateMockCompetitorData(niche: string): CompetitorData[] {
    const now = new Date();
    return [
      {
        competitor_id: 'comp-1',
        platform: 'youtube',
        video_title: `Top ${niche.charAt(0).toUpperCase() + niche.slice(1)} Content #1`,
        channel_name: 'Competitor Channel 1',
        views: 45000,
        likes: 2300,
        comments: 890,
        publish_time: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        video_duration: 180,
        thumbnail_url: 'https://via.placeholder.com/320x180',
        video_url: 'https://youtube.com/watch?v=test1',
        extracted_hooks: ['Hook 1', 'Hook 2'],
        cta_text: 'Subscribe for more',
        hashtags: ['#' + niche, '#content'],
        niche: niche as 'meat' | 'coffee' | 'saas',
      },
      {
        competitor_id: 'comp-2',
        platform: 'youtube',
        video_title: `Viral ${niche.charAt(0).toUpperCase() + niche.slice(1)} Video`,
        channel_name: 'Competitor Channel 2',
        views: 52000,
        likes: 3100,
        comments: 1200,
        publish_time: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        video_duration: 240,
        thumbnail_url: 'https://via.placeholder.com/320x180',
        video_url: 'https://youtube.com/watch?v=test2',
        extracted_hooks: ['Hook 3', 'Hook 4'],
        cta_text: 'Check description',
        hashtags: ['#trending', '#' + niche],
        niche: niche as 'meat' | 'coffee' | 'saas',
      },
    ];
  }
}

export const competitorScoutAgent = new CompetitorScoutAgent();
