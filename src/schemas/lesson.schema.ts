/**
 * ============================================================================
 * GRAMMAR QUEST — SCHEMA & DOMAIN TYPES (FOUNDATION)
 * ============================================================================
 * Defines core TypeScript contracts for classes, placeholder mission metadata,
 * and local IndexedDB progress state. Full lesson/assessment engine schemas
 * will build on these foundational types in subsequent milestones.
 * ============================================================================
 */

export type ClassLevel = 9 | 10;

export type AppSection = 'home' | 'missions' | 'guide' | 'progress';

export type MissionStatus = 'ready' | 'upcoming' | 'completed';

export interface PlaceholderMissionSummary {
  id: string;
  missionNumber: string;
  classLevel: ClassLevel;
  title: string;
  topicLabel: string;
  shortDescription: string;
  estimatedMinutes: number;
  iconKind: 'scroll' | 'hourglass' | 'magnifier';
  status: MissionStatus;
  isPlaceholder?: boolean;
}

export interface MissionProgressDetail {
  missionId: string;
  started: boolean;
  teachingStagesCompleted: boolean;
  guidedPracticeCompleted: boolean;
  independentPracticeCompleted: boolean;
  completed: boolean;
  wordLabStarsByActivityId?: Record<string, number>;
  wordLabSolvedIds?: string[];
  independentSolvedIds?: string[];
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface StudentProgressRecord {
  id: 'default-learner';
  selectedClass: ClassLevel;
  completedMissionIds: string[];
  activeMissionId: string | null;
  totalPilotMissions: number;
  missionProgressById?: Record<string, MissionProgressDetail>;
  updatedAt: string;
}

export interface StorageReadResult {
  progress: StudentProgressRecord;
  storageAvailable: boolean;
  storageMessage?: string;
}
