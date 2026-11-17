/**
 * ============================================================================
 * GRAMMAR QUEST — LOCAL PROGRESS REPOSITORY
 * ============================================================================
 * Manages reading and writing local student preferences (selected Class 9/10)
 * and mission progress in IndexedDB. Falls back gracefully to in-memory state
 * if IndexedDB is blocked or disabled.
 * ============================================================================
 */

import type {
  ClassLevel,
  MissionProgressDetail,
  StorageReadResult,
  StudentProgressRecord,
} from '../schemas/lesson.schema';
import { idbGet, idbPut, PROGRESS_STORE } from './indexedDb';

const DEFAULT_RECORD_KEY = 'default-learner';

function toCanonicalMissionId(missionId: string): string {
  return missionId.replace(/^c(?:9|10)-/, 'c9-');
}

function mergeUniqueIds(a?: string[], b?: string[]): string[] | undefined {
  if (!a?.length && !b?.length) return undefined;
  return Array.from(new Set([...(a ?? []), ...(b ?? [])]));
}

function normalizeStudentProgressRecord(
  record: StudentProgressRecord,
): StudentProgressRecord {
  const completedSet = new Set(
    (record.completedMissionIds ?? []).map(toCanonicalMissionId),
  );
  const normalizedById: Record<string, MissionProgressDetail> = {};

  for (const [rawId, detail] of Object.entries(record.missionProgressById ?? {})) {
    const canonicalId = toCanonicalMissionId(rawId);
    const existing = normalizedById[canonicalId];
    if (!existing) {
      normalizedById[canonicalId] = {
        ...detail,
        missionId: canonicalId,
      };
    } else {
      normalizedById[canonicalId] = {
        ...existing,
        missionId: canonicalId,
        started: existing.started || detail.started,
        teachingStagesCompleted:
          existing.teachingStagesCompleted || detail.teachingStagesCompleted,
        guidedPracticeCompleted:
          existing.guidedPracticeCompleted || detail.guidedPracticeCompleted,
        independentPracticeCompleted:
          existing.independentPracticeCompleted || detail.independentPracticeCompleted,
        completed: existing.completed || detail.completed,
        wordLabStarsByActivityId: {
          ...(detail.wordLabStarsByActivityId ?? {}),
          ...(existing.wordLabStarsByActivityId ?? {}),
        },
        wordLabSolvedIds: mergeUniqueIds(
          existing.wordLabSolvedIds,
          detail.wordLabSolvedIds,
        ),
        independentSolvedIds: mergeUniqueIds(
          existing.independentSolvedIds,
          detail.independentSolvedIds,
        ),
        startedAt: existing.startedAt ?? detail.startedAt,
        completedAt: existing.completedAt ?? detail.completedAt,
        updatedAt:
          existing.updatedAt >= detail.updatedAt ? existing.updatedAt : detail.updatedAt,
      };
    }
  }

  return {
    ...record,
    activeMissionId: record.activeMissionId
      ? toCanonicalMissionId(record.activeMissionId)
      : null,
    completedMissionIds: Array.from(completedSet),
    missionProgressById: normalizedById,
  };
}

export function createDefaultMissionProgress(missionId: string): MissionProgressDetail {
  return {
    missionId,
    started: false,
    teachingStagesCompleted: false,
    guidedPracticeCompleted: false,
    independentPracticeCompleted: false,
    completed: false,
    startedAt: null,
    completedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

export function getMissionProgressDetail(
  progress: StudentProgressRecord,
  missionId: string,
): MissionProgressDetail {
  const canonicalId = toCanonicalMissionId(missionId);
  const existing = progress.missionProgressById?.[canonicalId];
  const isCompletedInList = progress.completedMissionIds.includes(canonicalId);
  if (existing) {
    return isCompletedInList && !existing.completed
      ? { ...existing, started: true, completed: true }
      : existing;
  }
  return {
    ...createDefaultMissionProgress(canonicalId),
    started: isCompletedInList,
    teachingStagesCompleted: isCompletedInList,
    guidedPracticeCompleted: isCompletedInList,
    independentPracticeCompleted: isCompletedInList,
    completed: isCompletedInList,
  };
}

export function createDefaultProgress(selectedClass: ClassLevel = 9): StudentProgressRecord {
  return {
    id: DEFAULT_RECORD_KEY,
    selectedClass,
    completedMissionIds: [],
    activeMissionId: null,
    totalPilotMissions: 4,
    missionProgressById: {},
    updatedAt: new Date().toISOString(),
  };
}

let inMemoryFallback: StudentProgressRecord = createDefaultProgress(9);

export async function loadStudentProgress(): Promise<StorageReadResult> {
  try {
    const stored = await idbGet<StudentProgressRecord>(PROGRESS_STORE, DEFAULT_RECORD_KEY);

    if (stored && (stored.selectedClass === 9 || stored.selectedClass === 10)) {
      const normalized = normalizeStudentProgressRecord(stored);
      inMemoryFallback = normalized;
      return {
        progress: normalized,
        storageAvailable: true,
      };
    }

    const initial = createDefaultProgress(9);
    await idbPut(PROGRESS_STORE, initial);
    inMemoryFallback = initial;

    return {
      progress: initial,
      storageAvailable: true,
    };
  } catch {
    return {
      progress: inMemoryFallback,
      storageAvailable: false,
      storageMessage:
        'Unable to save your lesson progress on this device right now. Your progress will stay active during this visit.',
    };
  }
}

export async function saveSelectedClass(classLevel: ClassLevel): Promise<StorageReadResult> {
  const current = await loadStudentProgress();
  const next: StudentProgressRecord = {
    ...current.progress,
    selectedClass: classLevel,
    updatedAt: new Date().toISOString(),
  };

  inMemoryFallback = next;

  try {
    await idbPut(PROGRESS_STORE, next);
    return {
      progress: next,
      storageAvailable: true,
    };
  } catch {
    return {
      progress: next,
      storageAvailable: false,
      storageMessage:
        'Your lesson progress could not be saved on this device, but remains active during this visit.',
    };
  }
}

async function updateMissionProgressRecord(
  missionId: string,
  patch: (existing: MissionProgressDetail) => MissionProgressDetail,
  markOverallCompleted = false,
): Promise<StorageReadResult> {
  const canonicalId = toCanonicalMissionId(missionId);
  const current = await loadStudentProgress();
  const prevDetail = getMissionProgressDetail(current.progress, canonicalId);
  const nextDetail = patch(prevDetail);

  const existingCompleted = current.progress.completedMissionIds;
  const completedMissionIds =
    markOverallCompleted && !existingCompleted.includes(canonicalId)
      ? [...existingCompleted, canonicalId]
      : existingCompleted;

  const next: StudentProgressRecord = {
    ...current.progress,
    completedMissionIds,
    activeMissionId: canonicalId,
    missionProgressById: {
      ...(current.progress.missionProgressById ?? {}),
      [canonicalId]: nextDetail,
    },
    updatedAt: new Date().toISOString(),
  };

  inMemoryFallback = next;

  try {
    await idbPut(PROGRESS_STORE, next);
    return {
      progress: next,
      storageAvailable: true,
    };
  } catch {
    return {
      progress: next,
      storageAvailable: false,
      storageMessage:
        'Your lesson progress could not be saved on this device, but remains active during this visit.',
    };
  }
}

export async function markMissionStarted(missionId: string): Promise<StorageReadResult> {
  const now = new Date().toISOString();
  return updateMissionProgressRecord(missionId, (prev) => ({
    ...prev,
    started: true,
    startedAt: prev.startedAt ?? now,
    updatedAt: now,
  }));
}

export async function markTeachingCompleted(missionId: string): Promise<StorageReadResult> {
  const now = new Date().toISOString();
  return updateMissionProgressRecord(missionId, (prev) => ({
    ...prev,
    started: true,
    startedAt: prev.startedAt ?? now,
    teachingStagesCompleted: true,
    updatedAt: now,
  }));
}

export async function markPracticeCompleted(
  missionId: string,
  kind: 'guided' | 'independent',
): Promise<StorageReadResult> {
  const now = new Date().toISOString();
  return updateMissionProgressRecord(missionId, (prev) => ({
    ...prev,
    started: true,
    startedAt: prev.startedAt ?? now,
    guidedPracticeCompleted: kind === 'guided' ? true : prev.guidedPracticeCompleted,
    independentPracticeCompleted:
      kind === 'independent' ? true : prev.independentPracticeCompleted,
    updatedAt: now,
  }));
}

export async function saveWordLabActivityStars(
  missionId: string,
  activityId: string,
  stars: 1 | 2 | 3,
): Promise<StorageReadResult> {
  const now = new Date().toISOString();
  return updateMissionProgressRecord(missionId, (prev) => ({
    ...prev,
    started: true,
    startedAt: prev.startedAt ?? now,
    wordLabStarsByActivityId: {
      ...(prev.wordLabStarsByActivityId ?? {}),
      [activityId]: stars,
    },
    updatedAt: now,
  }));
}

export async function saveWordLabSolvedIds(
  missionId: string,
  solvedIds: string[],
): Promise<StorageReadResult> {
  const now = new Date().toISOString();
  return updateMissionProgressRecord(missionId, (prev) => ({
    ...prev,
    started: true,
    startedAt: prev.startedAt ?? now,
    wordLabSolvedIds: Array.from(new Set(solvedIds)),
    updatedAt: now,
  }));
}

export async function saveIndependentSolvedIds(
  missionId: string,
  solvedIds: string[],
): Promise<StorageReadResult> {
  const now = new Date().toISOString();
  return updateMissionProgressRecord(missionId, (prev) => ({
    ...prev,
    started: true,
    startedAt: prev.startedAt ?? now,
    independentSolvedIds: Array.from(new Set(solvedIds)),
    updatedAt: now,
  }));
}

export async function markMissionCompleted(missionId: string): Promise<StorageReadResult> {
  const now = new Date().toISOString();
  return updateMissionProgressRecord(
    missionId,
    (prev) => ({
      ...prev,
      started: true,
      startedAt: prev.startedAt ?? now,
      teachingStagesCompleted: true,
      guidedPracticeCompleted: true,
      independentPracticeCompleted: true,
      completed: true,
      completedAt: prev.completedAt ?? now,
      updatedAt: now,
    }),
    true,
  );
}

