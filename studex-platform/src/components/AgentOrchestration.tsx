'use client'

import { useEffect, useState } from 'react'
import { B } from '@/lib/laisa'

interface Agent {
  id: string
  name: string
  description: string
  status: 'idle' | 'running' | 'paused' | 'completed'
  skills: string[]
}

export function AgentOrchestration() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => {
        setAgents(data.agents || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-emerald-500'
      case 'paused':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-blue-500'
      default:
        return 'bg-slate-400'
    }
  }

  return (
    <div className="space-y-4 p-6 rounded-lg border" style={{ borderColor: B.border, backgroundColor: B.card }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: B.text }}>
          StudEx Super Agent
        </h3>
        <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: B.primary, color: B.bg }}>
          {agents.filter(a => a.status === 'running').length} Active
        </span>
      </div>

      {loading ? (
        <div style={{ color: B.muted }}>Loading agents...</div>
      ) : (
        <div className="grid gap-3">
          {agents.map(agent => (
            <div
              key={agent.id}
              className="p-4 rounded-lg border flex items-start justify-between"
              style={{ borderColor: B.border, backgroundColor: `${B.bg}40` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                  <h4 className="font-medium" style={{ color: B.text }}>
                    {agent.name}
                  </h4>
                </div>
                <p className="text-sm mb-3" style={{ color: B.muted }}>
                  {agent.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {agent.skills.map(skill => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: B.primary, color: B.bg }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  const action = agent.status === 'running' ? 'stop' : 'start'
                  fetch('/api/agents', {
                    method: 'POST',
                    body: JSON.stringify({ agent_id: agent.id, action }),
                  })
                }}
                className="px-3 py-1 rounded text-sm font-medium ml-4"
                style={{
                  backgroundColor: agent.status === 'running' ? '#C0492F' : B.primary,
                  color: B.bg,
                }}
              >
                {agent.status === 'running' ? 'Stop' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
