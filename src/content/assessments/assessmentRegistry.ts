/**
 * ============================================================================
 * GRAMMAR QUEST — ASSESSMENT CONTENT REGISTRY
 * ============================================================================
 * Loads JSON assessment definitions by missionId so the reusable assessment
 * engine remains completely decoupled from Mission 1 question data.
 * Assessments for Missions 2 and 3 are intentionally not registered yet.
 * ============================================================================
 */

import type { AssessmentDefinition } from '../../schemas/assessment.schema';
import class9Mission1Assessment from '../class9/sentenceBasicsAssessment.json';
import class10Mission1Assessment from '../class10/sentenceBasicsAssessment.json';

const ASSESSMENTS_BY_MISSION_ID: Record<string, AssessmentDefinition> = {
  'c9-mission-01': class9Mission1Assessment as AssessmentDefinition,
  'c10-mission-01': class10Mission1Assessment as AssessmentDefinition,
};

export function getAssessmentForMission(
  missionId: string,
): AssessmentDefinition | null {
  return ASSESSMENTS_BY_MISSION_ID[missionId] ?? null;
}

export function hasFormalAssessment(missionId: string): boolean {
  return Boolean(ASSESSMENTS_BY_MISSION_ID[missionId]);
}
