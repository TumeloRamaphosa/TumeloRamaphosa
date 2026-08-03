'use client';

import React, { useState, useEffect } from 'react';

interface CompetitorData {
  id: string;
  channel_name: string;
  platform: 'youtube' | 'instagram' | 'tiktok';
  views: number;
  likes: number;
  comments: number;
  engagement_rate: number;
  video_title: string;
  publish_time: string;
  niche: 'meat' | 'coffee' | 'saas';
}

interface EngagementPatterns {
  avg_views: number;
  avg_likes: number;
  avg_comments: number;
  optimal_video_duration: number;
  trending_hooks: string[];
  trending_hashtags: string[];
  engagement_rate: number;
}

export const CompetitiveIntelligence: React.FC = () => {
  const [selectedNiche, setSelectedNiche] = useState<'meat' | 'coffee' | 'saas'>('meat');
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [patterns, setPatterns] = useState<EngagementPatterns | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompetitiveData();
  }, [selectedNiche]);

  const fetchCompetitiveData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/agents/competitor-scout?niche=${selectedNiche}`
      );
      if (!response.ok) throw new Error('Failed to fetch competitive data');

      const data = await response.json();
      setCompetitors(data.top_competitors || []);
      setPatterns(data.patterns || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getNicheColor = (niche: string) => {
    switch (niche) {
      case 'meat':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'coffee':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'saas':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return '▶️';
      case 'instagram':
        return '📸';
      case 'tiktok':
        return '🎵';
      default:
        return '📱';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading competitive intelligence...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Competitive Intelligence Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Real-time analysis of top competitors in your niche
        </p>

        {/* Niche Selector */}
        <div className="flex gap-3">
          {(['meat', 'coffee', 'saas'] as const).map((niche) => (
            <button
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedNiche === niche
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {niche.charAt(0).toUpperCase() + niche.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Engagement Benchmarks */}
        {patterns && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Engagement Benchmark
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Avg Engagement Rate</span>
                    <span className="font-bold text-blue-600">
                      {(patterns.engagement_rate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(patterns.engagement_rate * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-2">Avg Views per Video</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {patterns.avg_views.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Optimal Video Length</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(patterns.optimal_video_duration / 60)} min
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Hooks */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎣 Trending Opening Hooks
              </h3>
              <div className="space-y-2">
                {patterns.trending_hooks.slice(0, 5).map((hook, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-gray-700"
                  >
                    "{hook}"
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Hashtags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                #️⃣ Top Hashtags
              </h3>
              <div className="flex flex-wrap gap-2">
                {patterns.trending_hashtags.slice(0, 8).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Top Competitors */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🏆 Top Performers This Week
        </h2>

        {competitors.length === 0 ? (
          <p className="text-gray-600">No competitor data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Channel
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Platform
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Views
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Engagement
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Likes
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Comments
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Content
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((competitor, idx) => (
                  <tr key={competitor.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                        </span>
                        <span className="font-medium text-gray-900">
                          {competitor.channel_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-lg">{getPlatformIcon(competitor.platform)}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-gray-900">
                        {(competitor.views / 1000).toFixed(1)}K
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(competitor.engagement_rate * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                          {(competitor.engagement_rate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-gray-900">
                      {competitor.likes.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-gray-900">
                      {competitor.comments.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-gray-700 max-w-xs truncate">
                      {competitor.video_title}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            💡 Key Insights
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              ✓ Average video length: {patterns?.optimal_video_duration ? `${Math.round(patterns.optimal_video_duration / 60)} min` : 'N/A'}
            </li>
            <li>
              ✓ Best engagement rate: {patterns?.engagement_rate ? `${(patterns.engagement_rate * 100).toFixed(1)}%` : 'N/A'}
            </li>
            <li>✓ Peak posting day: Varies by platform</li>
            <li>✓ Top performing hook style: Question-based openers</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            🎯 Recommendations
          </h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>✓ Create {patterns?.optimal_video_duration ? `${Math.round(patterns.optimal_video_duration / 60)}-min` : 'medium-length'} content</li>
            <li>✓ Open with trending hook patterns</li>
            <li>✓ Include top hashtags in description</li>
            <li>✓ Focus on gap opportunities competitors miss</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
