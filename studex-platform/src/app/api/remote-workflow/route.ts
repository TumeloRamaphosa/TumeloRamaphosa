import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface WorkflowTask {
  id: string
  type: 'seo-audit' | 'research' | 'code-review' | 'content-gen'
  status: 'queued' | 'running' | 'completed' | 'failed'
  agents: string[]
  progress: number
  startedAt?: string
  completedAt?: string
  result?: Record<string, unknown>
}

const WORKFLOWS: Map<string, WorkflowTask> = new Map()

export async function GET() {
  const workflows = Array.from(WORKFLOWS.values())
  return NextResponse.json({
    ok: true,
    count: workflows.length,
    workflows,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { task_type, agents, params } = body

    if (!task_type || !agents || agents.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Missing task_type or agents' },
        { status: 400 }
      )
    }

    const workflowId = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const workflow: WorkflowTask = {
      id: workflowId,
      type: task_type,
      status: 'queued',
      agents,
      progress: 0,
      startedAt: new Date().toISOString(),
    }

    WORKFLOWS.set(workflowId, workflow)

    // Simulate workflow progression
    setTimeout(() => {
      if (WORKFLOWS.has(workflowId)) {
        const wf = WORKFLOWS.get(workflowId)!
        wf.status = 'running'
        wf.progress = 25
      }
    }, 1000)

    setTimeout(() => {
      if (WORKFLOWS.has(workflowId)) {
        const wf = WORKFLOWS.get(workflowId)!
        wf.progress = 50
      }
    }, 3000)

    setTimeout(() => {
      if (WORKFLOWS.has(workflowId)) {
        const wf = WORKFLOWS.get(workflowId)!
        wf.status = 'completed'
        wf.progress = 100
        wf.completedAt = new Date().toISOString()
        wf.result = {
          message: `Completed ${task_type} with agents: ${agents.join(', ')}`,
          params,
        }
      }
    }, 8000)

    return NextResponse.json({
      ok: true,
      workflow_id: workflowId,
      message: 'Workflow started',
      workflow,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}
