'use client';

import React, { useState, useEffect } from 'react';

interface KanbanCard {
  id: string;
  title: string;
  niche: 'meat' | 'coffee' | 'saas';
  predicted_engagement: number;
  created_at: string;
  status: 'backlog' | 'in_progress' | 'pending_approval' | 'scheduled' | 'published';
}

interface KanbanColumn {
  id: string;
  title: string;
  status: 'backlog' | 'in_progress' | 'pending_approval' | 'scheduled' | 'published';
  cards: KanbanCard[];
}

export const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'backlog',
      title: 'Backlog',
      status: 'backlog',
      cards: [],
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      status: 'in_progress',
      cards: [],
    },
    {
      id: 'pending_approval',
      title: 'Pending Approval',
      status: 'pending_approval',
      cards: [],
    },
    {
      id: 'scheduled',
      title: 'Scheduled',
      status: 'scheduled',
      cards: [],
    },
    {
      id: 'published',
      title: 'Published',
      status: 'published',
      cards: [],
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null);

  useEffect(() => {
    fetchBoardData();
  }, []);

  const fetchBoardData = async () => {
    try {
      const response = await fetch('/api/kanban/board');
      if (!response.ok) throw new Error('Failed to fetch board');

      const data = await response.json();
      setColumns(data.columns || columns);
    } catch (error) {
      console.error('Error fetching board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (card: KanbanCard) => {
    setDraggedCard(card);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (fromStatus: string, toStatus: string) => {
    if (!draggedCard || fromStatus === toStatus) return;

    try {
      const response = await fetch(`/api/kanban/card/${draggedCard.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: toStatus }),
      });

      if (!response.ok) throw new Error('Failed to update card');

      // Update local state
      const updatedColumns = columns.map((col) => ({
        ...col,
        cards: col.status === fromStatus
          ? col.cards.filter((c) => c.id !== draggedCard.id)
          : col.status === toStatus
          ? [...col.cards, { ...draggedCard, status: toStatus as any }]
          : col.cards,
      }));

      setColumns(updatedColumns);
    } catch (error) {
      console.error('Error updating card:', error);
    } finally {
      setDraggedCard(null);
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

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'backlog':
        return 'bg-gray-50';
      case 'in_progress':
        return 'bg-blue-50';
      case 'pending_approval':
        return 'bg-yellow-50';
      case 'scheduled':
        return 'bg-purple-50';
      case 'published':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading kanban board...</div>
      </div>
    );
  }

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <div className="w-full max-w-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Content Kanban Board
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Drag and drop cards to move through workflow stages
          </p>
          <div className="text-lg font-semibold text-blue-600">
            {totalCards} items in workflow
          </div>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-5 gap-4 overflow-x-auto">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`flex flex-col rounded-lg p-4 min-w-80 ${getColumnColor(column.status)}`}
          >
            {/* Column Header */}
            <div className="mb-4 pb-4 border-b-2 border-gray-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {column.title}
              </h2>
              <div className="text-sm text-gray-600">
                {column.cards.length} {column.cards.length === 1 ? 'item' : 'items'}
              </div>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(draggedCard?.status || '', column.status)}
              className="flex-1 space-y-3 min-h-96 rounded-lg p-2"
            >
              {column.cards.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-sm">No items yet</p>
                </div>
              ) : (
                column.cards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card)}
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg cursor-move transition border-l-4 border-blue-500"
                  >
                    {/* Niche Badge */}
                    <div className="mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold border ${getNicheColor(card.niche)}`}
                      >
                        {card.niche.toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {card.title}
                    </h3>

                    {/* Engagement Prediction */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Predicted Engagement</span>
                        <span className="text-sm font-bold text-blue-600">
                          {(card.predicted_engagement * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(card.predicted_engagement * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="text-xs text-gray-500">
                      {new Date(card.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Workflow Stages</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            <strong>Backlog:</strong> Ideas waiting to be developed
          </li>
          <li>
            <strong>In Progress:</strong> Content being generated by agents
          </li>
          <li>
            <strong>Pending Approval:</strong> Ready for your review
          </li>
          <li>
            <strong>Scheduled:</strong> Approved and scheduled for publishing
          </li>
          <li>
            <strong>Published:</strong> Live on YouTube and social platforms
          </li>
        </ul>
      </div>
    </div>
  );
};
