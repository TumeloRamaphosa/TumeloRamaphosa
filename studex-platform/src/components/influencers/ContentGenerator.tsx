'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Share2 } from 'lucide-react';

interface ContentPost {
  id: string;
  caption: string;
  hashtags: string[];
  call_to_action: string;
  content_type: string;
  visual_style: string;
  platform: string;
}

interface ContentGeneratorProps {
  influencerId: string;
  influencerName: string;
  niche: 'meat' | 'coffee' | 'saas';
  onGenerateComplete?: (post: ContentPost) => void;
}

export function ContentGenerator({
  influencerId,
  influencerName,
  niche,
  onGenerateComplete,
}: ContentGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentPost | null>(null);
  const [error, setError] = useState<string>('');
  const [platform, setPlatform] = useState<string>('instagram');
  const [agent, setAgent] = useState<string>('naledi');
  const [product, setProduct] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const platforms = ['instagram', 'twitter', 'tiktok', 'linkedin', 'youtube'];
  const agents = [
    { id: 'charlie', label: 'Charlie (Operations)' },
    { id: 'robusca', label: 'Robusca (Global)' },
    { id: 'naledi', label: 'Naledi (Creative)' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setContent(null);

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          influencerId,
          platform,
          product: product || undefined,
          agent,
          niche,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate content');
      }

      const data = await response.json();
      setContent(data.post);
      onGenerateComplete?.(data.post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullCaption = content
    ? `${content.caption}\n\n${content.hashtags.join(' ')}\n\n${content.call_to_action}`
    : '';

  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
      <div>
        <h3 className="mb-2 font-bold text-lg">Generate Content for {influencerName}</h3>
        <p className="text-sm text-gray-600">Create authentic social media posts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            disabled={loading}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
          >
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">AI Agent</label>
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            disabled={loading}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Product/Topic (Optional)</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            disabled={loading}
            placeholder="e.g., Premium Sirloin, Single Origin Kenya, StudExClaw Pro"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generate Content
          </>
        )}
      </button>

      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      {content && (
        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
          <h4 className="font-semibold">Generated Content</h4>

          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Caption</p>
            <p className="rounded bg-white p-3 text-sm leading-relaxed">
              {content.caption}
            </p>
          </div>

          {content.hashtags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Hashtags</p>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">CTA</p>
            <p className="rounded bg-white p-2 text-sm">{content.call_to_action}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(fullCaption)}
              className="flex items-center gap-2 rounded bg-white px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              <Copy size={14} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => window.open(`https://${platform}.com`, '_blank')}
              className="flex items-center gap-2 rounded bg-white px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              <Share2 size={14} />
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
