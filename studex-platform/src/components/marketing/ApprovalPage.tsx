'use client';

import React, { useState, useEffect } from 'react';

interface ContentOption {
  id?: string;
  niche: 'meat' | 'coffee' | 'saas';
  title: string;
  hook: string;
  description: string;
  hashtags: string[];
  cta: string;
  thumbnail_concept: string;
  predicted_engagement: number;
  reasoning: string;
  inspired_by_competitor?: string;
  created_at?: string;
}

interface ApprovalItem {
  id: string;
  niche: 'meat' | 'coffee' | 'saas';
  content_option: ContentOption;
  status: 'pending' | 'approved' | 'rejected';
  user_comment?: string;
}

export const ApprovalPage: React.FC = () => {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNiche, setSelectedNiche] = useState<'all' | 'meat' | 'coffee' | 'saas'>('all');
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/approvals?action=pending');
      if (!response.ok) throw new Error('Failed to fetch approvals');

      const data = await response.json();
      setItems(data.pending || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    selectedNiche === 'all' ? items : items.filter((item) => item.niche === selectedNiche);

  const currentItem = filteredItems[currentIndex];

  const handleApprove = async () => {
    if (!currentItem) return;

    try {
      const response = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          approvalId: currentItem.id,
          userId: 'current-user',
          comments,
        }),
      });

      if (!response.ok) throw new Error('Failed to approve');

      // Move to next item
      if (currentIndex < filteredItems.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setComments('');
      } else {
        alert('All items approved!');
        fetchPendingApprovals();
      }
    } catch (err) {
      alert('Error approving item: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleReject = async () => {
    if (!currentItem) return;

    try {
      const response = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          approvalId: currentItem.id,
          userId: 'current-user',
          feedback: comments,
        }),
      });

      if (!response.ok) throw new Error('Failed to reject');

      // Move to next item
      if (currentIndex < filteredItems.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setComments('');
      } else {
        fetchPendingApprovals();
      }
    } catch (err) {
      alert('Error rejecting item: ' + (err instanceof Error ? err.message : 'Unknown error'));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading pending approvals...</div>
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

  if (filteredItems.length === 0) {
    return (
      <div className="text-center p-12">
        <div className="text-6xl mb-4">✓</div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          All Caught Up!
        </h3>
        <p className="text-gray-600">
          No pending approvals at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Content Approval Dashboard
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredItems.length} pending approvals • Review and approve content before 12:30 PM
          </p>
          <div className="text-2xl font-bold text-blue-600">
            {currentIndex + 1} / {filteredItems.length}
          </div>
        </div>
      </div>

      {/* Niche Filter */}
      <div className="mb-6 flex gap-2">
        {(['all', 'meat', 'coffee', 'saas'] as const).map((niche) => (
          <button
            key={niche}
            onClick={() => {
              setSelectedNiche(niche);
              setCurrentIndex(0);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedNiche === niche
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {niche.charAt(0).toUpperCase() + niche.slice(1)}
          </button>
        ))}
      </div>

      {currentItem && (
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content Display */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Niche Badge */}
              <div className="mb-6">
                <span
                  className={`px-4 py-2 rounded-full font-semibold border ${getNicheColor(currentItem.niche)}`}
                >
                  {currentItem.niche.toUpperCase()}
                </span>
              </div>

              {/* Title & Hook */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentItem.content_option.title}
                </h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-lg text-gray-800 font-medium">
                    {currentItem.content_option.hook}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Opening hook (first 3 seconds)</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentItem.content_option.description}
                </p>
              </div>

              {/* Hashtags */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentItem.content_option.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Call to Action
                </h3>
                <p className="text-green-700 font-medium">
                  {currentItem.content_option.cta}
                </p>
              </div>

              {/* Thumbnail Concept */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Thumbnail Concept
                </h3>
                <p className="text-gray-700">
                  {currentItem.content_option.thumbnail_concept}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar: Analysis & Decision */}
          <div>
            {/* Competitor Inspiration */}
            {currentItem.content_option.inspired_by_competitor && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-amber-900 mb-2">
                  📊 Inspired by Competitor
                </h4>
                <p className="text-sm text-amber-800">
                  {currentItem.content_option.inspired_by_competitor}
                </p>
              </div>
            )}

            {/* Engagement Prediction */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">
                🎯 Predicted Engagement
              </h4>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {(currentItem.content_option.predicted_engagement * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-blue-700">
                Expected engagement rate based on competitive analysis
              </p>
            </div>

            {/* Reasoning */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                💡 AI Reasoning
              </h4>
              <p className="text-sm text-gray-700">
                {currentItem.content_option.reasoning}
              </p>
            </div>

            {/* Your Comment */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Your Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add notes or feedback (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleApprove}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                ✓ Approve & Publish
              </button>
              <button
                onClick={handleReject}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                ✕ Reject & Revise
              </button>
              <button
                onClick={() => {
                  if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                    setComments('');
                  }
                }}
                disabled={currentIndex === 0}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold disabled:opacity-50"
              >
                ← Previous
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
