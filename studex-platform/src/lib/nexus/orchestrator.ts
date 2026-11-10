/**
 * NEXUS Workflow Orchestrator
 * Manages phase transitions, gates, and escalations
 */

import {
  NEXUSPhase,
  PhaseGateConfig,
  PhaseTransition,
  NEXUSWorkflowState,
  NEXUS_PHASE_GATES,
} from "./phases";

export class NEXUSOrchestrator {
  private state: NEXUSWorkflowState;

  constructor(initialPhase: NEXUSPhase = NEXUSPhase.DISCOVER) {
    this.state = {
      currentPhase: initialPhase,
      retryCount: 0,
      transitions: [],
      evidence: {},
      escalated: false,
    };
  }

  /**
   * Get current workflow state
   */
  getState(): NEXUSWorkflowState {
    return { ...this.state };
  }

  /**
   * Add evidence for current phase
   */
  addEvidence(key: string, value: unknown): void {
    this.state.evidence[key] = value;
  }

  /**
   * Check if current phase gate requirements are met
   */
  canAdvance(): {
    canAdvance: boolean;
    missingEvidence: string[];
  } {
    const gateConfig = NEXUS_PHASE_GATES[this.state.currentPhase];
    const missingEvidence = gateConfig.evidenceRequired.filter(
      (req) => !(req in this.state.evidence)
    );

    return {
      canAdvance: missingEvidence.length === 0 && this.state.retryCount < gateConfig.retryLimit,
      missingEvidence,
    };
  }

  /**
   * Attempt to advance to next phase
   */
  async transitionToNextPhase(approverEmail?: string): Promise<{
    success: boolean;
    currentPhase: NEXUSPhase;
    reason?: string;
  }> {
    const gateConfig = NEXUS_PHASE_GATES[this.state.currentPhase];

    // Check prerequisites
    const { canAdvance, missingEvidence } = this.canAdvance();
    if (!canAdvance) {
      if (this.state.retryCount >= gateConfig.retryLimit) {
        this.state.escalated = true;
        return {
          success: false,
          currentPhase: this.state.currentPhase,
          reason: `Retry limit (${gateConfig.retryLimit}) exceeded. Escalating to human review.`,
        };
      }

      return {
        success: false,
        currentPhase: this.state.currentPhase,
        reason: `Missing evidence: ${missingEvidence.join(", ")}`,
      };
    }

    // Execute transition
    if (gateConfig.nextPhase) {
      const transition: PhaseTransition = {
        fromPhase: this.state.currentPhase,
        toPhase: gateConfig.nextPhase,
        timestamp: new Date(),
        evidenceProvided: { ...this.state.evidence },
        approverEmail,
      };

      this.state.transitions.push(transition);
      this.state.currentPhase = gateConfig.nextPhase;
      this.state.retryCount = 0;
      this.state.evidence = {};
      this.state.escalated = false;

      return {
        success: true,
        currentPhase: this.state.currentPhase,
      };
    }

    // Final phase - mark as complete
    this.state.completedAt = new Date();
    return {
      success: true,
      currentPhase: this.state.currentPhase,
    };
  }

  /**
   * Retry current phase (increment retry count)
   */
  retryPhase(reason: string): void {
    this.state.retryCount += 1;
    console.log(`Retry ${this.state.retryCount}: ${reason}`);
  }

  /**
   * Escalate to human review
   */
  escalateToHuman(reason: string, approverEmail: string): void {
    this.state.escalated = true;
    const transition: PhaseTransition = {
      fromPhase: this.state.currentPhase,
      toPhase: this.state.currentPhase,
      timestamp: new Date(),
      evidenceProvided: { ...this.state.evidence },
      escalationReason: reason,
      approverEmail,
    };
    this.state.transitions.push(transition);
  }

  /**
   * Get timeline of all phase transitions
   */
  getTransitionTimeline(): PhaseTransition[] {
    return [...this.state.transitions];
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.state = {
      currentPhase: NEXUSPhase.DISCOVER,
      retryCount: 0,
      transitions: [],
      evidence: {},
      escalated: false,
    };
  }
}

/**
 * Handoff template for agent-to-agent communication
 */
export interface NEXUSHandoff {
  fromPhase: NEXUSPhase;
  toPhase: NEXUSPhase;
  agentFrom: string;
  agentTo: string;
  evidenceMap: Record<string, unknown>;
  instructions: string;
  deadline: Date;
}

export function createHandoffTemplate(
  fromPhase: NEXUSPhase,
  toPhase: NEXUSPhase,
  evidence: Record<string, unknown>
): NEXUSHandoff {
  return {
    fromPhase,
    toPhase,
    agentFrom: "",
    agentTo: "",
    evidenceMap: evidence,
    instructions: `Handoff from ${fromPhase} to ${toPhase} phase. Complete phase gate requirements and provide evidence.`,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours default
  };
}
