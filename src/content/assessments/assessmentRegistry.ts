/**
 * ============================================================================
 * GRAMMAR QUEST — ASSESSMENT CONTENT REGISTRY
 * ============================================================================
 * Loads JSON assessment definitions by missionId so the reusable assessment
 * engine remains completely decoupled from mission-specific question data.
 * ============================================================================
 */

import type { AssessmentDefinition } from '../../schemas/assessment.schema';
import class9Mission1Assessment from '../class9/sentenceBasicsAssessment.json';
import class10Mission1Assessment from '../class10/sentenceBasicsAssessment.json';
import class9Mission2Assessment from '../class9/tensesAssessment.json';
import class10Mission2Assessment from '../class10/tensesAssessment.json';
import class9Mission3Assessment from '../class9/subjectVerbAgreementAssessment.json';
import class10Mission3Assessment from '../class10/subjectVerbAgreementAssessment.json';

const ASSESSMENTS_BY_MISSION_ID: Record<string, AssessmentDefinition> = {
  'c9-mission-01': class9Mission1Assessment as AssessmentDefinition,
  'c10-mission-01': class10Mission1Assessment as AssessmentDefinition,
  'c9-mission-02': class9Mission2Assessment as AssessmentDefinition,
  'c10-mission-02': class10Mission2Assessment as AssessmentDefinition,
  'c9-mission-03': class9Mission3Assessment as AssessmentDefinition,
  'c10-mission-03': class10Mission3Assessment as AssessmentDefinition,
};

export function getAssessmentForMission(
  missionId: string,
): AssessmentDefinition | null {
  return ASSESSMENTS_BY_MISSION_ID[missionId] ?? null;
}

export function hasFormalAssessment(missionId: string): boolean {
  return Boolean(ASSESSMENTS_BY_MISSION_ID[missionId]);
}
