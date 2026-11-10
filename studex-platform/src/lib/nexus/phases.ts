/**
 * NEXUS 7-Phase Workflow Framework
 * Core phase definitions for StudBot OS integration
 * Date: 2026-11-10
 */

export enum NEXUSPhase {
  DISCOVER = "discover",
  STRATEGIZE = "strategize",
  SCAFFOLD = "scaffold",
  BUILD = "build",
  HARDEN = "harden",
  LAUNCH = "launch",
  OPERATE = "operate",
}

export interface PhaseGateConfig {
  phase: NEXUSPhase;
  retryLimit: number;
  evidenceRequired: string[];
  nextPhase: NEXUSPhase | null;
  timeoutMinutes: number;
}

export const NEXUS_PHASE_GATES: Record<NEXUSPhase, PhaseGateConfig> = {
  [NEXUSPhase.DISCOVER]: {
    phase: NEXUSPhase.DISCOVER,
    retryLimit: 3,
    evidenceRequired: ["research_summary", "competitor_analysis", "content_brief"],
    nextPhase: NEXUSPhase.STRATEGIZE,
    timeoutMinutes: 120,
  },
  [NEXUSPhase.STRATEGIZE]: {
    phase: NEXUSPhase.STRATEGIZE,
    retryLimit: 3,
    evidenceRequired: ["brand_voice_doc", "platform_strategy", "content_angles"],
    nextPhase: NEXUSPhase.SCAFFOLD,
    timeoutMinutes: 90,
  },
  [NEXUSPhase.SCAFFOLD]: {
    phase: NEXUSPhase.SCAFFOLD,
    retryLimit: 3,
    evidenceRequired: ["variant_options", "approval_checklist", "resource_plan"],
    nextPhase: NEXUSPhase.BUILD,
    timeoutMinutes: 60,
  },
  [NEXUSPhase.BUILD]: {
    phase: NEXUSPhase.BUILD,
    retryLimit: 3,
    evidenceRequired: ["media_assets", "copy_deliverables", "quality_metrics"],
    nextPhase: NEXUSPhase.HARDEN,
    timeoutMinutes: 180,
  },
  [NEXUSPhase.HARDEN]: {
    phase: NEXUSPhase.HARDEN,
    retryLimit: 3,
    evidenceRequired: ["qa_report", "compliance_check", "human_approval"],
    nextPhase: NEXUSPhase.LAUNCH,
    timeoutMinutes: 45,
  },
  [NEXUSPhase.LAUNCH]: {
    phase: NEXUSPhase.LAUNCH,
    retryLimit: 3,
    evidenceRequired: ["publish_log", "distribution_confirmation", "analytics_baseline"],
    nextPhase: NEXUSPhase.OPERATE,
    timeoutMinutes: 30,
  },
  [NEXUSPhase.OPERATE]: {
    phase: NEXUSPhase.OPERATE,
    retryLimit: 3,
    evidenceRequired: ["performance_metrics", "engagement_data", "optimization_notes"],
    nextPhase: null,
    timeoutMinutes: 1440,
  },
};

export interface PhaseTransition {
  fromPhase: NEXUSPhase;
  toPhase: NEXUSPhase;
  timestamp: Date;
  evidenceProvided: Record<string, unknown>;
  approverEmail?: string;
  escalationReason?: string;
}

export interface NEXUSWorkflowState {
  currentPhase: NEXUSPhase;
  retryCount: number;
  transitions: PhaseTransition[];
  evidence: Record<string, unknown>;
  escalated: boolean;
  completedAt?: Date;
}

export const getPhaseDescription = (phase: NEXUSPhase): string => {
  const descriptions: Record<NEXUSPhase, string> = {
    [NEXUSPhase.DISCOVER]: "Research & content discovery - competitive analysis, trends, market intel",
    [NEXUSPhase.STRATEGIZE]: "Strategy development - brand voice, positioning, platform-specific angles",
    [NEXUSPhase.SCAFFOLD]: "Content structure - generate 5+ variants per niche, create approval options",
    [NEXUSPhase.BUILD]: "Asset creation - video, graphics, copy via Higgsfield + Freepik",
    [NEXUSPhase.HARDEN]: "Quality assurance - human review, compliance check, final approvals",
    [NEXUSPhase.LAUNCH]: "Publishing - Blotato distribution to YouTube, Instagram, Facebook, Google Ads",
    [NEXUSPhase.OPERATE]: "Monitoring & optimization - analytics, engagement, iterate learnings",
  };
  return descriptions[phase];
};
