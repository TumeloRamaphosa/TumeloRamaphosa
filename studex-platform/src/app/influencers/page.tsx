'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Zap } from 'lucide-react';
import { InfluencerCard } from '@/components/influencers/InfluencerCard';
import { ContentGenerator } from '@/components/influencers/ContentGenerator';

interface Influencer {
  id: string;
  name: string;
  handle: string;
  bio: string;
  niche: 'meat' | 'coffee' | 'saas';
  follower_count: number;
  engagement_rate: number;
  content_posts?: Array<{ platform: string; status: string }>;
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNiche, setSelectedNiche] = useState<'meat' | 'coffee' | 'saas' | 'all'>('all');
  const [generatingInfluencer, setGeneratingInfluencer] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [error, setError] = useState<string>('');

  const niches: Array<'meat' | 'coffee' | 'saas'> = ['meat', 'coffee', 'saas'];

  useEffect(() => {
    loadInfluencers();
  }, [selectedNiche]);

  const loadInfluencers = async () => {
    setLoading(true);
    setError('');
    try {
      const url =
        selectedNiche === 'all'
          ? '/api/influencers/list'
          : `/api/influencers/list?niche=${selectedNiche}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load influencers');
      const data = await response.json();
      setInfluencers(data.influencers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load influencers');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInfluencer = async (niche: 'meat' | 'coffee' | 'saas') => {
    setGeneratingInfluencer(true);
    setError('');
    try {
      const response = await fetch('/api/influencers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate influencer');
      }

      const data = await response.json();
      setInfluencers([...influencers, data.influencer]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate influencer');
    } finally {
      setGeneratingInfluencer(false);
    }
  };

  const filteredInfluencers =
    selectedNiche === 'all'
      ? influencers
      : influencers.filter((inf) => inf.niche === selectedNiche);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <Sparkles className="text-blue-600" />
              Social Media Influencers
            </h1>
            <p className="mt-2 text-gray-600">Generate and manage AI influencers for your brands</p>
          </div>

          {/* Niche Filter */}
          <div className="flex flex-wrap gap-2">
            {(['all', ...niches] as const).map((niche) => (
              <button
                key={niche}
                onClick={() => setSelectedNiche(niche)}
                className={`rounded-full px-4 py-2 font-medium transition ${
                  selectedNiche === niche
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {niche === 'all'
                  ? 'All Influencers'
                  : niche.charAt(0).toUpperCase() + niche.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
        )}

        {/* Generate New Influencer */}
        <div className="mb-8">
          <h2 className="mb-4 font-bold text-lg">Create New Influencer</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {niches.map((niche) => (
              <button
                key={niche}
                onClick={() => handleGenerateInfluencer(niche)}
                disabled={generatingInfluencer}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 py-3 font-semibold transition ${
                  niche === 'meat'
                    ? 'border-red-200 bg-red-50 text-red-900 hover:bg-red-100'
                    : niche === 'coffee'
                      ? 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100'
                      : 'border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100'
                } disabled:opacity-50`}
              >
                {generatingInfluencer ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    {niche === 'meat'
                      ? '🥩 Meat Influencer'
                      : niche === 'coffee'
                        ? '☕ Coffee Influencer'
                        : '🚀 SaaS Influencer'}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Influencers Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : filteredInfluencers.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-gray-600">
              No influencers yet. Create your first one to get started!
            </p>
          </div>
        ) : (
          <div>
            <h2 className="mb-4 font-bold text-lg">
              {filteredInfluencers.length} Influencer{filteredInfluencers.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInfluencers.map((influencer) => (
                <div key={influencer.id}>
                  <InfluencerCard
                    influencer={influencer}
                    onGenerate={() => setSelectedInfluencer(influencer)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Generator Modal */}
        {selectedInfluencer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
              <button
                onClick={() => setSelectedInfluencer(null)}
                className="sticky top-4 right-4 float-right rounded-full bg-gray-200 p-2 hover:bg-gray-300"
              >
                ✕
              </button>
              <div className="p-6">
                <ContentGenerator
                  influencerId={selectedInfluencer.id}
                  influencerName={selectedInfluencer.name}
                  niche={selectedInfluencer.niche}
                  onGenerateComplete={() => {
                    // Reload influencers to show updated post count
                    loadInfluencers();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
