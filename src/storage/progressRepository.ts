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
  const existing = progress.missionProgressById?.[missionId];
  const isCompletedInList = progress.completedMissionIds.includes(missionId);
  if (existing) {
    return isCompletedInList && !existing.completed
      ? { ...existing, started: true, completed: true }
      : existing;
  }
  return {
    ...createDefaultMissionProgress(missionId),
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
    totalPilotMissions: 3,
    missionProgressById: {},
    updatedAt: new Date().toISOString(),
  };
}

let inMemoryFallback: StudentProgressRecord = createDefaultProgress(9);

export async function loadStudentProgress(): Promise<StorageReadResult> {
  try {
    const stored = await idbGet<StudentProgressRecord>(PROGRESS_STORE, DEFAULT_RECORD_KEY);

    if (stored && (stored.selectedClass === 9 || stored.selectedClass === 10)) {
      inMemoryFallback = stored;
      return {
        progress: stored,
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
        'Unable to save your class selection on this device right now. Your choice will stay active during this visit.',
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
        'Your class selection could not be saved on this device, but remains active during this visit.',
    };
  }
}

async function updateMissionProgressRecord(
  missionId: string,
  patch: (existing: MissionProgressDetail) => MissionProgressDetail,
  markOverallCompleted = false,
): Promise<StorageReadResult> {
  const current = await loadStudentProgress();
  const prevDetail = getMissionProgressDetail(current.progress, missionId);
  const nextDetail = patch(prevDetail);

  const existingCompleted = current.progress.completedMissionIds;
  const completedMissionIds =
    markOverallCompleted && !existingCompleted.includes(missionId)
      ? [...existingCompleted, missionId]
      : existingCompleted;

  const next: StudentProgressRecord = {
    ...current.progress,
    completedMissionIds,
    activeMissionId: missionId,
    missionProgressById: {
      ...(current.progress.missionProgressById ?? {}),
      [missionId]: nextDetail,
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

