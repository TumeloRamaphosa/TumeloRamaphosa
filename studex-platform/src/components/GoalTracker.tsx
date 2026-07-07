'use client'

import { useEffect, useState } from 'react'
import { B } from '@/lib/laisa'

interface Metric {
  target: string | number
  current: string | number
  status: 'on_track' | 'exceeded' | 'behind'
}

interface Goal {
  id: string
  title: string
  targetDate: string
  metrics: Record<string, Metric>
  status: 'active' | 'completed' | 'paused'
  blockers: string[]
}

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/goal')
      .then(r => r.json())
      .then(data => {
        setGoals(data.goals || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'exceeded':
        return { bg: '#3FBE8520', text: '#3FBE85' }
      case 'on_track':
        return { bg: '#3B6B8F20', text: '#3B6B8F' }
      default:
        return { bg: '#D4B57420', text: '#D4B574' }
    }
  }

  return (
    <div className="space-y-4 p-6 rounded-lg border" style={{ borderColor: B.border, backgroundColor: B.card }}>
      <h3 className="text-lg font-semibold" style={{ color: B.text }}>
        Milestone Goals
      </h3>

      {loading ? (
        <div style={{ color: B.muted }}>Loading goals...</div>
      ) : (
        <div className="grid gap-4">
          {goals.map(goal => (
            <div key={goal.id} className="p-4 rounded-lg border" style={{ borderColor: B.border, backgroundColor: `${B.bg}40` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-base" style={{ color: B.text }}>
                    {goal.title}
                  </h4>
                  <p className="text-sm mt-1" style={{ color: B.muted }}>
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: B.primary, color: B.bg }}>
                  {goal.status}
                </span>
              </div>

              <div className="space-y-2">
                {Object.entries(goal.metrics).map(([key, metric]) => {
                  const colors = getMetricColor(metric.status)
                  return (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span style={{ color: B.muted }}>{key.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-3">
                        <span style={{ color: B.text }}>
                          {metric.current} / {metric.target}
                        </span>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.bg, color: colors.text }}>
                          {metric.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {goal.blockers.length > 0 && (
                <div className="mt-3 p-2 rounded text-sm" style={{ backgroundColor: '#C0492F20', color: '#C0492F' }}>
                  Blockers: {goal.blockers.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
