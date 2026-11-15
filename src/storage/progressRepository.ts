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
  StorageReadResult,
  StudentProgressRecord,
} from '../schemas/lesson.schema';
import { idbGet, idbPut, PROGRESS_STORE } from './indexedDb';

const DEFAULT_RECORD_KEY = 'default-learner';

export function createDefaultProgress(selectedClass: ClassLevel = 9): StudentProgressRecord {
  return {
    id: DEFAULT_RECORD_KEY,
    selectedClass,
    completedMissionIds: [],
    activeMissionId: null,
    totalPilotMissions: 3,
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

export async function markMissionCompleted(missionId: string): Promise<StorageReadResult> {
  const current = await loadStudentProgress();
  const existing = current.progress.completedMissionIds;
  const completedMissionIds = existing.includes(missionId)
    ? existing
    : [...existing, missionId];

  const next: StudentProgressRecord = {
    ...current.progress,
    completedMissionIds,
    activeMissionId: missionId,
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

