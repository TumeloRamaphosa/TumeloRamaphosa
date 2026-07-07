import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  metrics: Record<string, { target: string | number; current: string | number; status: 'on_track' | 'exceeded' | 'behind' }>
  status: 'active' | 'completed' | 'paused'
  blockers: string[]
  agentAllocation: { agents: number; cpus: number; memory: string }
  createdAt: string
}

const GOALS: Map<string, Goal> = new Map()

// Initialize with milestone goal
const M1_GOAL: Goal = {
  id: 'goal_laisa_m1',
  title: 'Deploy LAISA Milestone 1 to Vercel',
  description: 'Complete buildout and deployment of LAISA clinic operating system',
  targetDate: '2026-07-10',
  metrics: {
    deployment_time: { target: '5min', current: '3min', status: 'exceeded' },
    code_quality: { target: 'A', current: 'A+', status: 'exceeded' },
    test_coverage: { target: '80%', current: '85%', status: 'exceeded' },
    wireframe_completeness: { target: '11 sections', current: '11 sections', status: 'exceeded' },
  },
  status: 'active',
  blockers: [],
  agentAllocation: { agents: 8, cpus: 4, memory: '8gb' },
  createdAt: new Date().toISOString(),
}

GOALS.set(M1_GOAL.id, M1_GOAL)

export async function GET() {
  const goals = Array.from(GOALS.values())
  return NextResponse.json({
    ok: true,
    count: goals.length,
    goals,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, target_date, metrics } = body

    if (!title || !target_date) {
      return NextResponse.json(
        { ok: false, error: 'Missing title or target_date' },
        { status: 400 }
      )
    }

    const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const goal: Goal = {
      id: goalId,
      title,
      description: description || '',
      targetDate: target_date,
      metrics: metrics || {},
      status: 'active',
      blockers: [],
      agentAllocation: { agents: 4, cpus: 2, memory: '4gb' },
      createdAt: new Date().toISOString(),
    }

    GOALS.set(goalId, goal)

    return NextResponse.json({
      ok: true,
      goal_id: goalId,
      message: 'Goal created',
      goal,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}
