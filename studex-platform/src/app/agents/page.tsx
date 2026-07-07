import { AgentOrchestration } from '@/components/AgentOrchestration'
import { GoalTracker } from '@/components/GoalTracker'

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">StudEx Agent Orchestration</h1>
          <p className="text-slate-300">Autonomous agent fleet managing LAISA clinic operations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AgentOrchestration />
          </div>
          <div className="lg:col-span-1">
            <GoalTracker />
          </div>
        </div>

        <div className="mt-12 p-8 rounded-lg border border-slate-600 bg-slate-800/50">
          <h2 className="text-xl font-semibold text-white mb-4">Available Endpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-mono text-emerald-400">GET /api/agents</div>
              <p className="text-slate-400">List all available agents</p>
            </div>
            <div>
              <div className="font-mono text-emerald-400">POST /api/agents</div>
              <p className="text-slate-400">Start/stop agent execution</p>
            </div>
            <div>
              <div className="font-mono text-emerald-400">POST /__remote-workflow</div>
              <p className="text-slate-400">Trigger remote agent workflows</p>
            </div>
            <div>
              <div className="font-mono text-emerald-400">GET /api/goal</div>
              <p className="text-slate-400">View milestone goals & metrics</p>
            </div>
            <div>
              <div className="font-mono text-emerald-400">POST /api/goal</div>
              <p className="text-slate-400">Create new automation goals</p>
            </div>
            <div>
              <div className="font-mono text-emerald-400">POST /api/deep-research</div>
              <p className="text-slate-400">Start research & analysis tasks</p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-lg border border-slate-600 bg-slate-800/50">
          <h2 className="text-xl font-semibold text-white mb-4">Agent Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">🔍 SEO Auditor</h3>
              <p className="text-slate-400">Comprehensive website SEO analysis, E-E-A-T scoring, schema validation</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {['site-crawl', 'schema-validation', 'content-analysis', 'local-seo'].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded bg-emerald-900 text-emerald-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">🔬 Deep Researcher</h3>
              <p className="text-slate-400">Multi-source research, market analysis, patient insights synthesis</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {['web-search', 'data-extraction', 'synthesis', 'report-gen'].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded bg-blue-900 text-blue-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">✅ Code Reviewer</h3>
              <p className="text-slate-400">Automated code quality analysis, test coverage, security scanning</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {['static-analysis', 'test-coverage', 'performance', 'security'].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded bg-purple-900 text-purple-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">📝 Content Generator</h3>
              <p className="text-slate-400">SEO-optimized medical content creation, fact-checking, publishing</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {['content-creation', 'seo-opt', 'fact-checking'].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded bg-orange-900 text-orange-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
