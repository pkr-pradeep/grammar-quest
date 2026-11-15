/**
 * ============================================================================
 * GRAMMAR QUEST — LOCAL ASSESSMENT PROGRESS REPOSITORY (INDEXEDDB)
 * ============================================================================
 * Manages browser-local persistence of in-progress and submitted assessment
 * attempts using IndexedDB (`assessmentAttempts` object store), with safe
 * in-memory fallback if IndexedDB is unavailable.
 *
 * Integrity guarantees:
 *  - In-progress drafts preserve selectedAnswers and currentQuestionIndex across
 *    browser refresh WITHOUT marking the attempt submitted or computing scores.
 *  - Submitted attempts become strictly read-only and cannot be overwritten by
 *    draft writes.
 * ============================================================================
 */

import type {
  AssessmentAttemptRecord,
  AssessmentDefinition,
  AssessmentStorageResult,
} from '../schemas/assessment.schema';
import { ASSESSMENT_STORE, idbGet, idbGetAll, idbPut } from './indexedDb';
import { evaluateAssessment } from '../features/assessment/scoring';

const inMemoryAttempts: Record<string, AssessmentAttemptRecord> = {};

function generateAttemptId(missionId: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `att-${missionId}-${Date.now()}-${rand}`;
}

export function createInProgressAttempt(
  assessment: AssessmentDefinition,
): AssessmentAttemptRecord {
  return {
    id: assessment.missionId,
    attemptId: generateAttemptId(assessment.missionId),
    assessmentId: assessment.assessmentId,
    missionId: assessment.missionId,
    classLevel: assessment.classLevel,
    topic: assessment.topic,
    selectedAnswers: {},
    currentQuestionIndex: 0,
    status: 'in-progress',
    score: null,
    totalQuestions: assessment.questions.length,
    percentage: null,
    correctCount: null,
    incorrectCount: null,
    unansweredCount: null,
    submittedAt: null,
    updatedAt: new Date().toISOString(),
    revisionRecommendations: [],
  };
}

export async function loadAssessmentAttempt(
  missionId: string,
): Promise<AssessmentStorageResult> {
  try {
    const stored = await idbGet<AssessmentAttemptRecord>(ASSESSMENT_STORE, missionId);
    if (stored) {
      inMemoryAttempts[missionId] = stored;
      return { attempt: stored, storageAvailable: true };
    }
    return {
      attempt: inMemoryAttempts[missionId] ?? null,
      storageAvailable: true,
    };
  } catch {
    return {
      attempt: inMemoryAttempts[missionId] ?? null,
      storageAvailable: false,
      storageMessage:
        'Local storage is currently restricted. Your assessment responses remain active for this visit.',
    };
  }
}

export async function loadAllAssessmentAttempts(): Promise<AssessmentAttemptRecord[]> {
  try {
    const all = await idbGetAll<AssessmentAttemptRecord>(ASSESSMENT_STORE);
    for (const item of all) {
      inMemoryAttempts[item.missionId] = item;
    }
    return all;
  } catch {
    return Object.values(inMemoryAttempts);
  }
}

export async function saveInProgressAssessmentAttempt(
  assessment: AssessmentDefinition,
  selectedAnswers: Record<string, string>,
  currentQuestionIndex: number,
  existingAttempt?: AssessmentAttemptRecord | null,
): Promise<AssessmentStorageResult> {
  const current = await loadAssessmentAttempt(assessment.missionId);
  if (current.attempt?.status === 'submitted') {
    // Strictly read-only once submitted
    return current;
  }

  const base = existingAttempt ?? current.attempt ?? createInProgressAttempt(assessment);
  const next: AssessmentAttemptRecord = {
    ...base,
    id: assessment.missionId,
    assessmentId: assessment.assessmentId,
    missionId: assessment.missionId,
    classLevel: assessment.classLevel,
    topic: assessment.topic,
    selectedAnswers: { ...selectedAnswers },
    currentQuestionIndex: Math.max(
      0,
      Math.min(currentQuestionIndex, Math.max(0, assessment.questions.length - 1)),
    ),
    status: 'in-progress',
    score: null,
    totalQuestions: assessment.questions.length,
    percentage: null,
    correctCount: null,
    incorrectCount: null,
    unansweredCount: null,
    submittedAt: null,
    updatedAt: new Date().toISOString(),
    revisionRecommendations: [],
  };

  inMemoryAttempts[assessment.missionId] = next;

  try {
    await idbPut(ASSESSMENT_STORE, next);
    return { attempt: next, storageAvailable: true };
  } catch {
    return {
      attempt: next,
      storageAvailable: false,
      storageMessage:
        'Unable to write your draft to device storage, but your selected answers remain active for this visit.',
    };
  }
}

export async function submitAssessmentAttempt(
  assessment: AssessmentDefinition,
  selectedAnswers: Record<string, string>,
  currentQuestionIndex: number,
  existingAttempt?: AssessmentAttemptRecord | null,
): Promise<AssessmentStorageResult> {
  const current = await loadAssessmentAttempt(assessment.missionId);
  if (current.attempt?.status === 'submitted') {
    // Immutable once submitted
    return current;
  }

  const base = existingAttempt ?? current.attempt ?? createInProgressAttempt(assessment);
  const evaluation = evaluateAssessment(assessment, selectedAnswers);
  const now = new Date().toISOString();

  const submitted: AssessmentAttemptRecord = {
    ...base,
    id: assessment.missionId,
    assessmentId: assessment.assessmentId,
    missionId: assessment.missionId,
    classLevel: assessment.classLevel,
    topic: assessment.topic,
    selectedAnswers: { ...selectedAnswers },
    currentQuestionIndex,
    status: 'submitted',
    score: evaluation.score,
    totalQuestions: evaluation.totalQuestions,
    percentage: evaluation.percentage,
    correctCount: evaluation.correctCount,
    incorrectCount: evaluation.incorrectCount,
    unansweredCount: evaluation.unansweredCount,
    submittedAt: now,
    updatedAt: now,
    revisionRecommendations: evaluation.revisionRecommendations,
  };

  inMemoryAttempts[assessment.missionId] = submitted;

  try {
    await idbPut(ASSESSMENT_STORE, submitted);
    return { attempt: submitted, storageAvailable: true };
  } catch {
    return {
      attempt: submitted,
      storageAvailable: false,
      storageMessage:
        'Your assessment result was scored, though device storage could not persist it after closing.',
    };
  }
}
