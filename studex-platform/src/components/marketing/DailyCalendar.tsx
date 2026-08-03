'use client';

import React, { useState, useEffect } from 'react';

interface ScheduledPost {
  id: string;
  date: string;
  title: string;
  niche: 'meat' | 'coffee' | 'saas';
  publish_time: string;
  status: 'scheduled' | 'published';
  views?: number;
  engagement?: number;
}

export const DailyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduledPosts();
  }, [currentMonth]);

  const fetchScheduledPosts = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      const response = await fetch(
        `/api/workflows/daily-marketing-cycle?year=${year}&month=${month}`
      );
      if (!response.ok) throw new Error('Failed to fetch calendar');

      const data = await response.json();
      setScheduledPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getNicheColor = (niche: string) => {
    switch (niche) {
      case 'meat':
        return 'bg-red-500';
      case 'coffee':
        return 'bg-amber-500';
      case 'saas':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getPostsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return scheduledPosts.filter((post) => post.date === dateStr);
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Publishing Calendar
        </h1>
        <p className="text-gray-600">
          View scheduled content and past performance
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              ← Previous
            </button>
            <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Next →
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayLabels.map((label) => (
              <div
                key={label}
                className="text-center font-semibold text-gray-600 py-2"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const posts = day ? getPostsForDate(day) : [];
              const isToday =
                day &&
                currentDate.getDate() === day &&
                currentDate.getMonth() === currentMonth.getMonth() &&
                currentDate.getFullYear() === currentMonth.getFullYear();
              const isSelected =
                selectedDate &&
                day &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth.getMonth() &&
                selectedDate.getFullYear() === currentMonth.getFullYear();

              return (
                <div
                  key={index}
                  onClick={() => day && setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                  className={`
                    min-h-24 p-2 rounded-lg border-2 cursor-pointer transition
                    ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                    ${isSelected ? 'bg-gray-100' : 'bg-white'}
                    ${!day ? 'bg-gray-50' : ''}
                  `}
                >
                  {day && (
                    <>
                      <div
                        className={`
                          text-sm font-bold mb-1
                          ${isToday ? 'text-blue-600' : 'text-gray-900'}
                        `}
                      >
                        {day}
                      </div>
                      <div className="space-y-1">
                        {posts.map((post) => (
                          <div
                            key={post.id}
                            className={`
                              text-xs px-2 py-1 rounded text-white truncate
                              ${getNicheColor(post.niche)}
                            `}
                            title={post.title}
                          >
                            {post.niche}
                          </div>
                        ))}
                      </div>
                      {posts.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          📍 {posts.length} post{posts.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h3>

            {getPostsForDate(selectedDate.getDate()).length === 0 ? (
              <p className="text-gray-600">No posts scheduled for this date</p>
            ) : (
              <div className="space-y-4">
                {getPostsForDate(selectedDate.getDate()).map((post) => (
                  <div
                    key={post.id}
                    className={`border-l-4 p-4 rounded ${getNicheColor(post.niche).replace('bg-', 'border-')}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs font-semibold ${getNicheColor(post.niche)}`}
                      >
                        {post.niche.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {post.publish_time}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {post.status === 'published' ? (
                        <>
                          <span>👁 {post.views || 0} views</span>
                          <span>
                            💬 {(post.engagement || 0).toFixed(1)}% engagement
                          </span>
                        </>
                      ) : (
                        <span className="text-blue-600 font-medium">
                          ⏰ Scheduled for 12:30 PM UTC
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">📌 Niche Colors</h4>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Meat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-sm text-gray-700">Coffee</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">SaaS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
