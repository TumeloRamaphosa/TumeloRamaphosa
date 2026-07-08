'use client'

import React, { useState, useMemo } from 'react'
import { ChevronDown, Check, Lock, Zap, TrendingUp, Filter, Search } from 'lucide-react'

type PriceTier = 'Starter' | 'Growth' | 'Scale'
type SkillStatus = 'Active' | 'Locked' | 'Available'

interface SkillMetric {
  label: string
  value: string
  unit?: string
}

interface Skill {
  id: string
  name: string
  description: string
  category: string
  status: SkillStatus
  tier: PriceTier
  roi: SkillMetric[]
  icon: React.ComponentType<{ className?: string }>
  activated?: boolean
}

const SKILLS_DATA: Skill[] = [
  { id: 'seo-audit', name: 'SEO Audit Engine', description: 'Comprehensive site analysis, keyword mapping, and competitor benchmarking', category: 'SEO', status: 'Active', tier: 'Starter', roi: [{ label: 'Avg. Traffic Lift', value: '34', unit: '%' }, { label: 'Keyword Rank Gains', value: '127' }], icon: TrendingUp, activated: true },
  { id: 'content-optimizer', name: 'Content Optimizer Pro', description: 'AI-driven content scoring and on-page optimization', category: 'SEO', status: 'Available', tier: 'Growth', roi: [{ label: 'Content Score Gain', value: '22', unit: 'pts' }, { label: 'Click-Through Rate', value: '18', unit: '%' }], icon: Zap },
  { id: 'backlink-analyzer', name: 'Backlink Analyzer', description: 'Link profile analysis and outreach automation', category: 'SEO', status: 'Available', tier: 'Growth', roi: [{ label: 'Authority Gain', value: '12', unit: 'pts' }, { label: 'Link Ops/week', value: '45' }], icon: TrendingUp },
  { id: 'rank-tracker', name: 'Rank Tracker', description: 'Daily keyword tracking across search engines', category: 'SEO', status: 'Locked', tier: 'Scale', roi: [{ label: 'Keywords Tracked', value: '5000+' }, { label: 'Position Updates', value: 'Daily' }], icon: TrendingUp },
  { id: 'market-research', name: 'Market Research Agent', description: 'Competitor research and trend analysis', category: 'Research', status: 'Active', tier: 'Growth', roi: [{ label: 'Research Hours/mo', value: '120', unit: 'saved' }, { label: 'Insights Generated', value: '80+' }], icon: TrendingUp, activated: true },
  { id: 'consumer-insights', name: 'Consumer Insights Engine', description: 'Sentiment analysis and behavior tracking', category: 'Research', status: 'Available', tier: 'Scale', roi: [{ label: 'Data Sources', value: '200+' }, { label: 'Accuracy', value: '94', unit: '%' }], icon: TrendingUp },
  { id: 'code-review', name: 'Code Review Agent', description: 'Automated quality, security, and performance analysis', category: 'Code', status: 'Active', tier: 'Starter', roi: [{ label: 'Issues Found', value: '340+', unit: '/mo' }, { label: 'Security CVEs', value: '15+' }], icon: Zap, activated: true },
  { id: 'test-generator', name: 'Test Generation Engine', description: 'Auto-generate unit and integration tests', category: 'Code', status: 'Available', tier: 'Growth', roi: [{ label: 'Avg. Coverage', value: '87', unit: '%' }, { label: 'Test Cases/day', value: '200+' }], icon: Zap },
  { id: 'blog-writer', name: 'Blog Writer Pro', description: 'Automated blog generation with SEO', category: 'Content', status: 'Active', tier: 'Growth', roi: [{ label: 'Posts/week', value: '5' }, { label: 'Avg. Word Count', value: '1800' }], icon: TrendingUp, activated: true },
  { id: 'social-scheduler', name: 'Social Content Scheduler', description: 'AI social media content and scheduling', category: 'Content', status: 'Available', tier: 'Starter', roi: [{ label: 'Posts/day', value: '10+' }, { label: 'Engagement Lift', value: '42', unit: '%' }], icon: TrendingUp },
  { id: 'lead-scorer', name: 'Lead Scoring Engine', description: 'ML-based lead qualification', category: 'Sales', status: 'Active', tier: 'Starter', roi: [{ label: 'Sales Cycle', value: '-22', unit: 'days' }, { label: 'Close Rate', value: '+18', unit: '%' }], icon: Zap, activated: true },
  { id: 'prospecting-agent', name: 'B2B Prospecting Agent', description: 'Lead generation and outreach', category: 'Sales', status: 'Available', tier: 'Growth', roi: [{ label: 'Leads Generated/mo', value: '500+' }, { label: 'Response Rate', value: '12', unit: '%' }], icon: Zap },
  { id: 'churn-predictor', name: 'Churn Prediction Engine', description: 'Early warning for at-risk customers', category: 'Customer Success', status: 'Available', tier: 'Scale', roi: [{ label: 'Retention Lift', value: '19', unit: '%' }, { label: 'ARR Saved', value: '$240k+' }], icon: TrendingUp },
  { id: 'support-bot', name: 'AI Support Agent', description: '24/7 customer support automation', category: 'Customer Success', status: 'Available', tier: 'Starter', roi: [{ label: 'Tickets Resolved', value: '68', unit: '%' }, { label: 'Response Time', value: '<2 min' }], icon: Zap },
  { id: 'campaign-optimizer', name: 'Campaign Optimizer', description: 'Real-time performance optimization', category: 'Marketing', status: 'Available', tier: 'Growth', roi: [{ label: 'ROAS Improvement', value: '+38', unit: '%' }, { label: 'Cost Per Lead', value: '-22', unit: '%' }], icon: Zap },
  { id: 'funnel-analyzer', name: 'Funnel Analyzer', description: 'Automated funnel analysis', category: 'Analytics', status: 'Active', tier: 'Starter', roi: [{ label: 'Conversion Lift', value: '+27', unit: '%' }, { label: 'Drop-offs Found', value: '12+' }], icon: TrendingUp, activated: true },
  { id: 'workflow-automation', name: 'Workflow Automation Engine', description: 'No-code process automation', category: 'Operations', status: 'Available', tier: 'Starter', roi: [{ label: 'Processes Automated', value: '50+' }, { label: 'Hours Saved/mo', value: '240+' }], icon: Zap },
]

const CATEGORY_COLORS: Record<string, string> = {
  SEO: '#2E6B54',
  Research: '#3B6B8F',
  Code: '#C8862B',
  Content: '#C0492F',
  Sales: '#2FA572',
  'Customer Success': '#1F4D3D',
  Marketing: '#6B6457',
  Analytics: '#A39A87',
  Operations: '#C9A86A',
}

function StatusBadge({ status }: { status: SkillStatus }) {
  const config = {
    Active: { bg: '#2FA57222', text: '#2FA572', icon: Check },
    Locked: { bg: '#C0492F22', text: '#C0492F', icon: Lock },
    Available: { bg: '#3B6B8F22', text: '#3B6B8F', icon: Zap },
  }
  const c = config[status]
  const Icon = c.icon
  return <div style={{ background: c.bg, color: c.text }} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"><Icon className="w-3 h-3" />{status}</div>
}

function TierBadge({ tier }: { tier: PriceTier }) {
  const colors = { Starter: { bg: '#F2EEE622', text: '#6B6457' }, Growth: { bg: '#2E6B5422', text: '#2E6B54' }, Scale: { bg: '#C9A86A22', text: '#C9A86A' } }
  const c = colors[tier]
  return <div style={c} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold">{tier}</div>
}

function SkillCard({ skill, onActivate }: { skill: Skill; onActivate: (id: string) => void }) {
  const Icon = skill.icon
  const isDisabled = skill.status === 'Locked'
  return (
    <div className={`rounded-lg border p-5 transition-all ${isDisabled ? 'opacity-75 bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div style={{ background: CATEGORY_COLORS[skill.category] }} className="rounded-lg p-2"><Icon className="w-5 h-5 text-white" /></div>
          <div><h3 className="font-semibold text-sm text-gray-900 dark:text-gray-50">{skill.name}</h3><p style={{ color: '#6B6457' }} className="text-xs mt-1 dark:text-gray-400">{skill.category}</p></div>
        </div>
        <StatusBadge status={skill.status} />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{skill.description}</p>
      <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-b border-gray-100 dark:border-gray-800">
        {skill.roi.map((m, i) => <div key={i}><p className="text-xs text-gray-500">{m.label}</p><p className="text-sm font-semibold text-gray-900 dark:text-gray-50 mt-1">{m.value}{m.unit && <span className="text-xs font-normal ml-1">{m.unit}</span>}</p></div>)}
      </div>
      <div className="flex items-center justify-between">
        <TierBadge tier={skill.tier} />
        <button onClick={() => onActivate(skill.id)} disabled={isDisabled} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${skill.activated ? 'border border-gray-300' : ''}`} style={skill.activated ? { color: '#2E6B54', borderColor: '#2E6B54' } : { background: '#2E6B54', color: 'white' }}>
          {skill.activated ? <>✓ Activated</> : isDisabled ? <>🔒 Locked</> : <>⚡ Activate</>}
        </button>
      </div>
    </div>
  )
}

export function SkillMarketplace() {
  const [selectedTiers, setSelectedTiers] = useState<PriceTier[]>(['Starter', 'Growth', 'Scale'])
  const [searchQuery, setSearchQuery] = useState('')
  const [activatedSkills, setActivatedSkills] = useState<Set<string>>(new Set(SKILLS_DATA.filter(s => s.activated).map(s => s.id)))

  const categories = Array.from(new Set(SKILLS_DATA.map(s => s.category))).sort()
  const filteredSkills = useMemo(() => {
    return SKILLS_DATA.map(s => ({ ...s, activated: activatedSkills.has(s.id) })).filter(s => selectedTiers.includes(s.tier) && (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase())))
  }, [selectedTiers, searchQuery, activatedSkills])

  const skillsByCategory = useMemo(() => {
    const g: Record<string, typeof filteredSkills> = {}
    filteredSkills.forEach(s => { if (!g[s.category]) g[s.category] = []; g[s.category].push(s) })
    return g
  }, [filteredSkills])

  const toggleTier = (tier: PriceTier) => setSelectedTiers(p => p.includes(tier) ? p.filter(t => t !== tier) : [...p, tier])

  return (
    <div style={{ background: '#FBF8F3' }} className="w-full">
      <div className="border-b border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 style={{ color: '#1A1714' }} className="text-4xl font-bold mb-2">Skill Marketplace</h1>
          <p style={{ color: '#6B6457' }} className="text-lg mb-6">Discover and activate AI agents to scale your business</p>
          <div className="flex gap-6 text-sm">
            <div><span className="font-semibold text-gray-900 dark:text-gray-50">{activatedSkills.size}</span><span style={{ color: '#6B6457' }} className="ml-2">Activated</span></div>
            <div><span className="font-semibold text-gray-900 dark:text-gray-50">{SKILLS_DATA.length}</span><span style={{ color: '#6B6457' }} className="ml-2">Available</span></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="mb-6 relative" style={{ border: '1px solid #E8D5C4', borderRadius: '10px', background: 'white' }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search skills..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none text-sm" style={{ color: '#1A1714' }} />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm"><Filter className="w-4 h-4" style={{ color: '#6B6457' }} /><span style={{ color: '#1A1714' }} className="font-medium">Tier:</span></div>
            {(['Starter', 'Growth', 'Scale'] as const).map(t => <button key={t} onClick={() => toggleTier(t)} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors" style={selectedTiers.includes(t) ? { background: t === 'Starter' ? '#2E6B54' : t === 'Growth' ? '#2FA572' : '#C9A86A', color: 'white' } : { background: '#f3f3f3', color: '#666' }}>{t}</button>)}
          </div>
        </div>
        <div className="space-y-10">
          {categories.map(cat => {
            const skills = skillsByCategory[cat] || []
            if (skills.length === 0) return null
            return (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-5"><h2 style={{ color: CATEGORY_COLORS[cat] }} className="text-xl font-bold">{cat}</h2><span className="text-sm font-medium px-2 py-1 rounded-full" style={{ background: `${CATEGORY_COLORS[cat]}22`, color: CATEGORY_COLORS[cat] }}>{skills.length}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {skills.map(s => <SkillCard key={s.id} skill={s} onActivate={id => { const n = new Set(activatedSkills); n.has(id) ? n.delete(id) : n.add(id); setActivatedSkills(n) }} />)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
