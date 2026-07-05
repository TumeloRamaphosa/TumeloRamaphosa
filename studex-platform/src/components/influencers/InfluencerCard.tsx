'use client';

import React from 'react';
import { Users, TrendingUp, Sparkles } from 'lucide-react';

interface InfluencerData {
  id: string;
  name: string;
  handle: string;
  bio: string;
  niche: 'meat' | 'coffee' | 'saas';
  follower_count: number;
  engagement_rate: number;
  content_posts?: Array<{ platform: string; status: string }>;
}

interface InfluencerCardProps {
  influencer: InfluencerData;
  onGenerate?: (id: string) => void;
  onSchedule?: (id: string) => void;
}

const nicheColors = {
  meat: 'bg-red-50 border-red-200 text-red-900',
  coffee: 'bg-amber-50 border-amber-200 text-amber-900',
  saas: 'bg-blue-50 border-blue-200 text-blue-900',
};

const nicheBadgeColors = {
  meat: 'bg-red-100 text-red-800',
  coffee: 'bg-amber-100 text-amber-800',
  saas: 'bg-blue-100 text-blue-800',
};

export function InfluencerCard({
  influencer,
  onGenerate,
  onSchedule,
}: InfluencerCardProps) {
  const platforms = [
    ...new Set(influencer.content_posts?.map((p) => p.platform) || []),
  ];

  return (
    <div className={`rounded-lg border p-4 ${nicheColors[influencer.niche]}`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">{influencer.name}</h3>
          <p className="text-sm font-medium opacity-75">{influencer.handle}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${nicheBadgeColors[influencer.niche]}`}
        >
          {influencer.niche}
        </span>
      </div>

      <p className="mb-3 text-sm line-clamp-2">{influencer.bio}</p>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="flex items-center justify-center gap-1 font-bold">
            <Users size={14} />
            {(influencer.follower_count / 1000).toFixed(0)}K
          </div>
          <span className="text-xs opacity-75">Followers</span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 font-bold">
            <TrendingUp size={14} />
            {influencer.engagement_rate.toFixed(1)}%
          </div>
          <span className="text-xs opacity-75">Engagement</span>
        </div>
        <div>
          <div className="font-bold">
            {influencer.content_posts?.length || 0}
          </div>
          <span className="text-xs opacity-75">Posts</span>
        </div>
      </div>

      {platforms.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold opacity-75 mb-1">Platforms</p>
          <div className="flex flex-wrap gap-1">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="rounded-full bg-black/10 px-2 py-1 text-xs font-medium"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onGenerate?.(influencer.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded bg-white/50 hover:bg-white py-2 text-sm font-semibold transition"
        >
          <Sparkles size={14} />
          Generate
        </button>
        {onSchedule && (
          <button
            onClick={() => onSchedule?.(influencer.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-white/50 hover:bg-white py-2 text-sm font-semibold transition"
          >
            📅 Schedule
          </button>
        )}
      </div>
    </div>
  );
}
