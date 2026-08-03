'use client';

import React, { useState, useEffect } from 'react';

interface TrainingStatus {
  trained: boolean;
  trained_at?: string;
  source?: string;
  characteristics?: {
    tone: string[];
    pacing: 'fast' | 'medium' | 'slow';
    typical_length: number;
    hook_style: string[];
    cta_style: string;
    audience_focus: string;
    visual_style: string[];
  };
}

export const BrandVoiceTraining: React.FC = () => {
  const [status, setStatus] = useState<TrainingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [manualAnalysis, setManualAnalysis] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'youtube' | 'manual'>('youtube');

  useEffect(() => {
    checkTrainingStatus();
  }, []);

  const checkTrainingStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agents/brand-voice/train');
      if (!response.ok) throw new Error('Failed to check status');

      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    if (activeTab === 'youtube' && !youtubeLink) {
      setError('Please enter a YouTube link');
      return;
    }

    if (activeTab === 'manual' && !manualAnalysis) {
      setError('Please provide manual analysis');
      return;
    }

    try {
      setTraining(true);
      setError(null);

      const formData = new FormData();
      if (activeTab === 'youtube') {
        formData.append('youtubeLink', youtubeLink);
      } else {
        formData.append('manualAnalysis', manualAnalysis);
      }

      const response = await fetch('/api/agents/brand-voice/train', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Training failed');
      }

      const result = await response.json();
      setStatus({ trained: true, ...result });
      setYoutubeLink('');
      setManualAnalysis('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Training failed');
    } finally {
      setTraining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading brand voice status...</div>
      </div>
    );
  }

  if (status?.trained) {
    const chars = status.characteristics;
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">✓</div>
            <div>
              <h2 className="text-2xl font-bold text-green-900">
                Brand Voice Trained!
              </h2>
              <p className="text-green-700">
                {new Date(status.trained_at!).toLocaleDateString()} •{' '}
                {status.source?.replace('_', ' ')}
              </p>
            </div>
          </div>

          {chars && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">🎤 Tone</h4>
                <div className="flex flex-wrap gap-2">
                  {chars.tone.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">⏱️ Pacing</h4>
                <p className="text-2xl font-bold text-green-600 capitalize">
                  {chars.pacing}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ~{Math.round(chars.typical_length / 60)} minutes per video
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">🎣 Hook Style</h4>
                <div className="flex flex-wrap gap-2">
                  {chars.hook_style.map((h, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">👥 Audience</h4>
                <p className="text-gray-700">{chars.audience_focus}</p>
              </div>

              <div className="col-span-2 bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">📢 CTA Style</h4>
                <p className="text-gray-700 italic">"{chars.cta_style}"</p>
              </div>

              <div className="col-span-2 bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">🎨 Visual Style</h4>
                <div className="flex flex-wrap gap-2">
                  {chars.visual_style.map((v, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-green-100 rounded-lg text-green-800 text-sm">
            <p className="font-semibold mb-2">✨ What this means:</p>
            <ul className="space-y-1">
              <li>✓ All AI-generated content will match your exact style</li>
              <li>✓ Hook patterns and CTA will feel authentic to your brand</li>
              <li>✓ Video length recommendations will be optimized for your audience</li>
              <li>✓ Thumbnail and visual concepts will align with your aesthetic</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Train Your Brand Voice
          </h2>
          <p className="text-gray-600">
            Upload your first YouTube episode so our agents can learn your unique style and
            replicate it in all generated content.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Tab Selection */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('youtube')}
              className={`pb-4 px-4 font-semibold border-b-2 transition ${
                activeTab === 'youtube'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              YouTube Link
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`pb-4 px-4 font-semibold border-b-2 transition ${
                activeTab === 'manual'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Manual Analysis
            </button>
          </div>
        </div>

        {/* YouTube Link Tab */}
        {activeTab === 'youtube' && (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Your YouTube Video Link
            </label>
            <input
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-2">
              Paste the link to your best YouTube video. We'll analyze your tone, pacing,
              hook style, and visual aesthetic.
            </p>
          </div>
        )}

        {/* Manual Analysis Tab */}
        {activeTab === 'manual' && (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Brand Voice Analysis (JSON)
            </label>
            <textarea
              value={manualAnalysis}
              onChange={(e) => setManualAnalysis(e.target.value)}
              placeholder={`{
  "tone": ["professional", "engaging"],
  "pacing": "medium",
  "typical_length": 180,
  "hook_style": ["question-based"],
  "cta_style": "Subscribe for more",
  "audience_focus": "professionals",
  "visual_style": ["high-production", "on-camera"]
}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows={12}
            />
            <p className="text-sm text-gray-600 mt-2">
              Provide a detailed JSON object describing your brand voice characteristics.
            </p>
          </div>
        )}

        {/* Training Button */}
        <button
          onClick={handleTrain}
          disabled={training}
          className={`w-full py-3 font-semibold rounded-lg text-white transition ${
            training
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {training ? (
            <>
              <span className="inline-block animate-spin mr-2">⚙️</span>
              Training...
            </>
          ) : (
            <>
              <span className="mr-2">🚀</span>
              Train Brand Voice
            </>
          )}
        </button>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">
            🎯 Why brand voice training matters
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              ✓ <strong>Consistency:</strong> Every piece of content feels authentically
              yours
            </li>
            <li>
              ✓ <strong>Trust:</strong> Your audience recognizes your unique voice instantly
            </li>
            <li>
              ✓ <strong>Efficiency:</strong> No need to manually edit AI-generated content
            </li>
            <li>
              ✓ <strong>Scale:</strong> Generate 3 videos daily without losing your essence
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
