import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ResearchTask {
  id: string
  query: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress: number
  sources: Array<{ title: string; url: string; relevance: number }>
  findings: string[]
  createdAt: string
  completedAt?: string
}

const RESEARCH_TASKS: Map<string, ResearchTask> = new Map()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const taskId = searchParams.get('id')

  if (taskId && RESEARCH_TASKS.has(taskId)) {
    return NextResponse.json({
      ok: true,
      task: RESEARCH_TASKS.get(taskId),
    })
  }

  const tasks = Array.from(RESEARCH_TASKS.values())
  return NextResponse.json({
    ok: true,
    count: tasks.length,
    tasks,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { ok: false, error: 'Missing query' },
        { status: 400 }
      )
    }

    const taskId = `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const task: ResearchTask = {
      id: taskId,
      query,
      status: 'queued',
      progress: 0,
      sources: [],
      findings: [],
      createdAt: new Date().toISOString(),
    }

    RESEARCH_TASKS.set(taskId, task)

    // Simulate research progression
    setTimeout(() => {
      if (RESEARCH_TASKS.has(taskId)) {
        const t = RESEARCH_TASKS.get(taskId)!
        t.status = 'running'
        t.progress = 25
      }
    }, 1000)

    setTimeout(() => {
      if (RESEARCH_TASKS.has(taskId)) {
        const t = RESEARCH_TASKS.get(taskId)!
        t.sources = [
          { title: 'Sample source 1', url: 'https://example.com/1', relevance: 0.95 },
          { title: 'Sample source 2', url: 'https://example.com/2', relevance: 0.87 },
        ]
        t.progress = 60
      }
    }, 3000)

    setTimeout(() => {
      if (RESEARCH_TASKS.has(taskId)) {
        const t = RESEARCH_TASKS.get(taskId)!
        t.status = 'completed'
        t.progress = 100
        t.completedAt = new Date().toISOString()
        t.findings = ['Finding 1: Key insight from research', 'Finding 2: Market trend analysis']
      }
    }, 8000)

    return NextResponse.json({
      ok: true,
      task_id: taskId,
      message: 'Research task started',
      task,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}
