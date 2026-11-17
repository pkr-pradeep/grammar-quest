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

function toCanonicalMissionId(missionId: string): string {
  return missionId.replace(/^c(?:9|10)-/, 'c9-');
}

function normalizeAttemptMissionId(attempt: AssessmentAttemptRecord): AssessmentAttemptRecord {
  const canonicalId = toCanonicalMissionId(attempt.missionId);
  if (canonicalId === attempt.missionId && attempt.id === canonicalId) {
    return attempt;
  }
  return {
    ...attempt,
    id: canonicalId,
    missionId: canonicalId,
  };
}

export async function loadAssessmentAttempt(
  missionId: string,
): Promise<AssessmentStorageResult> {
  const canonicalId = toCanonicalMissionId(missionId);
  try {
    let stored = await idbGet<AssessmentAttemptRecord>(ASSESSMENT_STORE, canonicalId);
    if (!stored && canonicalId.startsWith('c9-')) {
      const legacyId = canonicalId.replace(/^c9-/, 'c10-');
      stored = await idbGet<AssessmentAttemptRecord>(ASSESSMENT_STORE, legacyId);
    }
    if (stored) {
      const normalized = normalizeAttemptMissionId(stored);
      inMemoryAttempts[canonicalId] = normalized;
      return { attempt: normalized, storageAvailable: true };
    }
    return {
      attempt: inMemoryAttempts[canonicalId] ?? null,
      storageAvailable: true,
    };
  } catch {
    return {
      attempt: inMemoryAttempts[canonicalId] ?? null,
      storageAvailable: false,
      storageMessage:
        'Local storage is currently restricted. Your assessment responses remain active for this visit.',
    };
  }
}

export async function loadAllAssessmentAttempts(): Promise<AssessmentAttemptRecord[]> {
  try {
    const all = await idbGetAll<AssessmentAttemptRecord>(ASSESSMENT_STORE);
    const mergedByMission: Record<string, AssessmentAttemptRecord> = {};
    for (const raw of all) {
      const normalized = normalizeAttemptMissionId(raw);
      const existing = mergedByMission[normalized.missionId];
      if (!existing) {
        mergedByMission[normalized.missionId] = normalized;
      } else if (
        normalized.status === 'submitted' && existing.status !== 'submitted'
      ) {
        mergedByMission[normalized.missionId] = normalized;
      } else if (
        normalized.status === existing.status &&
        normalized.updatedAt > existing.updatedAt
      ) {
        mergedByMission[normalized.missionId] = normalized;
      }
    }
    for (const item of Object.values(mergedByMission)) {
      inMemoryAttempts[item.missionId] = item;
    }
    return Object.values(mergedByMission);
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
        'Your test result was scored, though device storage could not persist it after closing.',
    };
  }
}
