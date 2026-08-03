import { createClient } from '@supabase/supabase-js';
import { competitorScoutAgent } from './competitor-scout';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface AnalysisInsight {
  niche: 'meat' | 'coffee' | 'saas';
  optimal_video_length_seconds: number;
  optimal_publish_hour: number;
  optimal_publish_day: string;
  trending_topics: string[];
  hook_patterns: string[];
  cta_patterns: string[];
  thumbnail_recommendations: string[];
  engagement_rate_benchmark: number;
  top_competitors_this_week: string[];
  gap_opportunities: string[];
  recommendation: string;
}

export class DataAnalystAgent {
  /**
   * Analyze competitor data and extract actionable insights
   * This runs after Competitor Scout completes
   */
  static async extractInsights(
    niche: 'meat' | 'coffee' | 'saas',
  ): Promise<AnalysisInsight> {
    try {
      console.log(`[Analyst] Extracting insights from competitor data for ${niche}`);

      // Get engagement patterns from scout data
      const patterns = await competitorScoutAgent.extractEngagementPatterns(niche);

      // Get top competitors
      const topCompetitors = await competitorScoutAgent.getTopCompetitors(niche, 5);

      // Analyze patterns
      const insight = this.analyzePatterns(niche, patterns, topCompetitors);

      // Store insights in database
      await this.storeInsight(insight);

      console.log(`[Analyst] Generated insights for ${niche}:`, insight.recommendation);

      return insight;
    } catch (error) {
      console.error('[Analyst] Failed to extract insights:', error);
      throw error;
    }
  }

  /**
   * Analyze patterns and generate insights
   */
  private static analyzePatterns(
    niche: string,
    patterns: any,
    competitors: any[],
  ): AnalysisInsight {
    // Determine optimal video length based on engagement
    const optimalLength = this.calculateOptimalLength(competitors);

    // Trending topics based on competitor titles
    const trendingTopics = this.extractTrendingTopics(competitors);

    // Gap opportunities - what competitors don't cover
    const gaps = this.identifyGaps(niche, competitors);

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      niche,
      patterns,
      trendingTopics,
      optimalLength,
    );

    return {
      niche: niche as 'meat' | 'coffee' | 'saas',
      optimal_video_length_seconds: optimalLength,
      optimal_publish_hour: 12, // 12:30 PM publish time
      optimal_publish_day: 'daily',
      trending_topics: trendingTopics,
      hook_patterns: patterns.trending_hooks || [],
      cta_patterns: ['Subscribe', 'Check description', 'Link in bio'],
      thumbnail_recommendations: [
        'Bold contrasting colors',
        'Human face close-up',
        'Text overlay with question',
      ],
      engagement_rate_benchmark: patterns.engagement_rate || 0.05,
      top_competitors_this_week: competitors.slice(0, 3).map((c: any) => c.channel_name),
      gap_opportunities: gaps,
      recommendation,
    };
  }

  /**
   * Calculate optimal video length based on engagement data
   */
  private static calculateOptimalLength(competitors: any[]): number {
    if (competitors.length === 0) return 180; // Default 3 minutes

    const avgLength =
      competitors.reduce((sum: number, c: any) => sum + (c.video_duration || 180), 0) /
      competitors.length;

    // Round to nearest 30 seconds
    return Math.round(avgLength / 30) * 30;
  }

  /**
   * Extract trending topics from competitor titles
   */
  private static extractTrendingTopics(competitors: any[]): string[] {
    const keywords: Record<string, number> = {};

    competitors.forEach((competitor: any) => {
      const title = competitor.video_title || '';
      const words = title.toLowerCase().split(/\s+/);

      words.forEach((word: string) => {
        // Filter out common words
        if (word.length > 4 && !this.isCommonWord(word)) {
          keywords[word] = (keywords[word] || 0) + 1;
        }
      });
    });

    return Object.entries(keywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);
  }

  /**
   * Identify gaps - topics competitors are NOT covering
   */
  private static identifyGaps(niche: string, competitors: any[]): string[] {
    const nichemSpecificTopics: Record<string, string[]> = {
      meat: [
        'sustainable sourcing',
        'health benefits',
        'cooking techniques',
        'local farms',
        'nutrition science',
      ],
      coffee: [
        'bean origin stories',
        'brewing methods',
        'coffee health',
        'sustainability',
        'espresso techniques',
      ],
      saas: [
        'feature deep-dives',
        'customer stories',
        'product updates',
        'industry insights',
        'how-to guides',
      ],
    };

    const nichemTopics = nichemSpecificTopics[niche as keyof typeof nichemSpecificTopics] || [];
    const coveredTopics = new Set<string>();

    // Extract what competitors are covering
    competitors.forEach((c: any) => {
      const title = c.video_title?.toLowerCase() || '';
      nichemTopics.forEach((topic) => {
        if (title.includes(topic)) {
          coveredTopics.add(topic);
        }
      });
    });

    // Return uncovered topics
    return nichemTopics.filter((topic) => !coveredTopics.has(topic)).slice(0, 3);
  }

  /**
   * Check if word is too common
   */
  private static isCommonWord(word: string): boolean {
    const commonWords = ['the', 'and', 'for', 'with', 'from', 'this', 'that', 'you', 'your'];
    return commonWords.includes(word);
  }

  /**
   * Generate actionable recommendation
   */
  private static generateRecommendation(
    niche: string,
    patterns: any,
    trendingTopics: string[],
    optimalLength: number,
  ): string {
    const topic = trendingTopics[0] || niche;
    const minutes = Math.round(optimalLength / 60);

    return `Create ${minutes}-minute video about "${topic}" with strong hook in first 3 seconds. Focus on competitor engagement benchmarks (${(patterns.engagement_rate * 100).toFixed(1)}% engagement rate). Use trending hashtags and direct CTA to boost conversions.`;
  }

  /**
   * Store insight in database
   */
  private static async storeInsight(insight: AnalysisInsight): Promise<void> {
    try {
      const { error } = await supabase.from('daily_analytics').insert({
        niche: insight.niche,
        analysis_date: new Date().toISOString(),
        optimal_video_length: insight.optimal_video_length_seconds,
        optimal_publish_hour: insight.optimal_publish_hour,
        trending_topics: insight.trending_topics,
        hook_patterns: insight.hook_patterns,
        cta_patterns: insight.cta_patterns,
        thumbnail_recommendations: insight.thumbnail_recommendations,
        engagement_rate_benchmark: insight.engagement_rate_benchmark,
        top_competitors: insight.top_competitors_this_week,
        gap_opportunities: insight.gap_opportunities,
        recommendation: insight.recommendation,
      });

      if (error) throw error;
    } catch (error) {
      console.error('[Analyst] Failed to store insight:', error);
      throw error;
    }
  }

  /**
   * Get latest insights for a niche
   */
  static async getLatestInsights(niche: 'meat' | 'coffee' | 'saas'): Promise<AnalysisInsight | null> {
    try {
      const { data, error } = await supabase
        .from('daily_analytics')
        .select('*')
        .eq('niche', niche)
        .order('analysis_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code === 'PGRST116') {
        return null;
      }

      if (error) throw error;

      return {
        niche: data.niche,
        optimal_video_length_seconds: data.optimal_video_length,
        optimal_publish_hour: data.optimal_publish_hour,
        optimal_publish_day: 'daily',
        trending_topics: data.trending_topics || [],
        hook_patterns: data.hook_patterns || [],
        cta_patterns: data.cta_patterns || [],
        thumbnail_recommendations: data.thumbnail_recommendations || [],
        engagement_rate_benchmark: data.engagement_rate_benchmark || 0,
        top_competitors_this_week: data.top_competitors || [],
        gap_opportunities: data.gap_opportunities || [],
        recommendation: data.recommendation || '',
      };
    } catch (error) {
      console.error('[Analyst] Failed to get latest insights:', error);
      return null;
    }
  }

  /**
   * Compare your performance vs competitors
   */
  static async comparePerformance(
    niche: 'meat' | 'coffee' | 'saas',
    yourMetrics: { views: number; likes: number; comments: number },
  ): Promise<{
    your_engagement_rate: number;
    competitor_avg_engagement: number;
    relative_performance: number;
    position_vs_competitors: string;
  }> {
    try {
      const insights = await this.getLatestInsights(niche);

      if (!insights) {
        return {
          your_engagement_rate: 0,
          competitor_avg_engagement: 0,
          relative_performance: 0,
          position_vs_competitors: 'No data',
        };
      }

      const yourEngagement =
        yourMetrics.views > 0
          ? (yourMetrics.likes + yourMetrics.comments) / yourMetrics.views
          : 0;
      const competitorAvg = insights.engagement_rate_benchmark;
      const relativePerf =
        competitorAvg > 0 ? ((yourEngagement - competitorAvg) / competitorAvg) * 100 : 0;

      let position = 'Below benchmark';
      if (relativePerf > 25) position = 'Outperforming';
      else if (relativePerf > 0) position = 'Meeting benchmark';

      return {
        your_engagement_rate: yourEngagement,
        competitor_avg_engagement: competitorAvg,
        relative_performance: relativePerf,
        position_vs_competitors: position,
      };
    } catch (error) {
      console.error('[Analyst] Failed to compare performance:', error);
      throw error;
    }
  }
}

export const dataAnalystAgent = new DataAnalystAgent();
