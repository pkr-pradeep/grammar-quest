/**
 * ============================================================================
 * GRAMMAR QUEST — HOME DASHBOARD SELECTORS
 * ============================================================================
 * Pure, deterministic view-model builders for the compact Home dashboard.
 * Computes dynamic progress counts, learning journey steps, step progress,
 * Up next selection, and Also ready recommendations strictly from verified
 * catalog and lesson definitions plus local progress state.
 * ============================================================================
 */

import type {
  MissionProgressDetail,
  StudentProgressRecord,
} from '../../schemas/lesson.schema';
import {
  getAvailableLessons,
  getCanonicalMissionId,
  resolveUnifiedLessonStatus,
  type CatalogLessonSummary,
  type UnifiedLessonStatus,
} from '../../content/curriculumCatalog';
import { getLessonForMission } from '../../content/lessons/lessonRegistry';
import { hasFormalAssessment } from '../../content/assessments/assessmentRegistry';
import { getMissionProgressDetail } from '../../storage/progressRepository';

export type LearningJourneyStageLabel =
  | 'Story'
  | 'Learn'
  | 'Guided'
  | 'Practice'
  | 'Test';

export interface HomeStepProgress {
  current: number;
  total: number;
}

export interface HomeLessonCardItem {
  lesson: CatalogLessonSummary;
  status: UnifiedLessonStatus;
  flavourTitle: string | null;
  journeySteps: LearningJourneyStageLabel[];
  journeySummary: string;
  stepProgress: HomeStepProgress | null;
}

export interface HomeDashboardViewModel {
  eligibleCount: number;
  completedCount: number;
  completionPercent: number;
  allEligibleCompleted: boolean;
  upNext: HomeLessonCardItem | null;
  alsoReady: HomeLessonCardItem[];
}

export function getOptionalFlavourTitle(lesson: CatalogLessonSummary): string | null {
  const primary = lesson.title.trim();
  const secondary = lesson.lessonTitle?.trim() ?? '';
  if (!secondary || secondary === primary) {
    return null;
  }
  return secondary;
}

export function getLessonJourneySteps(
  lesson: CatalogLessonSummary,
): LearningJourneyStageLabel[] {
  const def = getLessonForMission(lesson.id);
  const steps: LearningJourneyStageLabel[] = [];

  if (def?.storyIntro && def.storyIntro.beats.length > 0) {
    steps.push('Story');
  }
  if (def?.teachingSequence && def.teachingSequence.length > 0) {
    steps.push('Learn');
  }
  if (def?.wordLabActivities && def.wordLabActivities.length > 0) {
    steps.push('Guided');
  }
  if (def?.independentPractice && def.independentPractice.length > 0) {
    steps.push('Practice');
  }
  if (hasFormalAssessment(lesson.id)) {
    steps.push('Test');
  }

  return steps;
}

export function getLessonStepProgress(
  lesson: CatalogLessonSummary,
  detail: MissionProgressDetail,
): HomeStepProgress | null {
  if (!detail.started || detail.completed) {
    return null;
  }

  const def = getLessonForMission(lesson.id);
  const corePhases: Array<'story' | 'learn' | 'guided' | 'practice'> = [];

  if (def?.storyIntro && def.storyIntro.beats.length > 0) {
    corePhases.push('story');
  }
  if (def?.teachingSequence && def.teachingSequence.length > 0) {
    corePhases.push('learn');
  }
  if (def?.wordLabActivities && def.wordLabActivities.length > 0) {
    corePhases.push('guided');
  }
  if (def?.independentPractice && def.independentPractice.length > 0) {
    corePhases.push('practice');
  }

  if (corePhases.length === 0) {
    return null;
  }

  const findPhaseIndex = (
    preferred: Array<'story' | 'learn' | 'guided' | 'practice'>,
  ): number => {
    for (const candidate of preferred) {
      const idx = corePhases.indexOf(candidate);
      if (idx !== -1) return idx;
    }
    return 0;
  };

  let activeIndex = 0;

  if (detail.independentPracticeCompleted) {
    activeIndex = corePhases.length - 1;
  } else if (detail.guidedPracticeCompleted) {
    activeIndex = findPhaseIndex(['practice', 'guided', 'learn', 'story']);
  } else if ((detail.independentSolvedIds?.length ?? 0) > 0) {
    activeIndex = findPhaseIndex(['practice', 'guided', 'learn', 'story']);
  } else if (
    detail.teachingStagesCompleted ||
    (detail.wordLabSolvedIds?.length ?? 0) > 0 ||
    Object.keys(detail.wordLabStarsByActivityId ?? {}).length > 0
  ) {
    activeIndex = findPhaseIndex(['guided', 'practice', 'learn', 'story']);
  } else {
    activeIndex = 0;
  }

  return {
    current: Math.min(Math.max(1, activeIndex + 1), corePhases.length),
    total: corePhases.length,
  };
}

function parseTimestampMs(iso?: string | null): number {
  if (!iso) return Number.NaN;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : Number.NaN;
}

function buildLessonCardItem(
  lesson: CatalogLessonSummary,
  status: UnifiedLessonStatus,
  detail: MissionProgressDetail,
): HomeLessonCardItem {
  const journeySteps = getLessonJourneySteps(lesson);
  return {
    lesson,
    status,
    flavourTitle: getOptionalFlavourTitle(lesson),
    journeySteps,
    journeySummary: journeySteps.join(' · '),
    stepProgress: getLessonStepProgress(lesson, detail),
  };
}

function normalizeProgressForHome(
  progress: StudentProgressRecord,
): StudentProgressRecord {
  const completedSet = new Set(
    (progress.completedMissionIds ?? []).map(getCanonicalMissionId),
  );
  const byId: Record<string, MissionProgressDetail> = {};

  for (const [rawId, detail] of Object.entries(
    progress.missionProgressById ?? {},
  )) {
    const canonicalId = getCanonicalMissionId(rawId);
    const existing = byId[canonicalId];
    if (!existing) {
      byId[canonicalId] = { ...detail, missionId: canonicalId };
    } else {
      const existingMs = parseTimestampMs(existing.updatedAt);
      const nextMs = parseTimestampMs(detail.updatedAt);
      const laterUpdatedAt =
        !Number.isNaN(nextMs) && (Number.isNaN(existingMs) || nextMs >= existingMs)
          ? detail.updatedAt
          : existing.updatedAt;
      byId[canonicalId] = {
        ...existing,
        missionId: canonicalId,
        started: existing.started || detail.started,
        teachingStagesCompleted:
          existing.teachingStagesCompleted || detail.teachingStagesCompleted,
        guidedPracticeCompleted:
          existing.guidedPracticeCompleted || detail.guidedPracticeCompleted,
        independentPracticeCompleted:
          existing.independentPracticeCompleted ||
          detail.independentPracticeCompleted,
        completed: existing.completed || detail.completed,
        wordLabStarsByActivityId: {
          ...(detail.wordLabStarsByActivityId ?? {}),
          ...(existing.wordLabStarsByActivityId ?? {}),
        },
        wordLabSolvedIds: Array.from(
          new Set([
            ...(existing.wordLabSolvedIds ?? []),
            ...(detail.wordLabSolvedIds ?? []),
          ]),
        ),
        independentSolvedIds: Array.from(
          new Set([
            ...(existing.independentSolvedIds ?? []),
            ...(detail.independentSolvedIds ?? []),
          ]),
        ),
        updatedAt: laterUpdatedAt,
      };
    }
  }

  return {
    ...progress,
    activeMissionId: progress.activeMissionId
      ? getCanonicalMissionId(progress.activeMissionId)
      : null,
    completedMissionIds: Array.from(completedSet),
    missionProgressById: byId,
  };
}

export function buildHomeDashboardViewModel(
  rawProgress: StudentProgressRecord,
): HomeDashboardViewModel {
  const progress = normalizeProgressForHome(rawProgress);
  const eligibleLessons = getAvailableLessons();
  const eligibleCount = eligibleLessons.length;

  const entries = eligibleLessons.map((lesson, catalogIndex) => {
    const detail = getMissionProgressDetail(progress, lesson.id);
    const status = resolveUnifiedLessonStatus(progress, lesson.id);
    return {
      lesson,
      detail,
      status,
      catalogIndex,
    };
  });

  const completedCount = entries.filter(
    (entry) => entry.status === 'completed',
  ).length;
  const completionPercent =
    eligibleCount > 0 ? Math.round((completedCount / eligibleCount) * 100) : 0;
  const allEligibleCompleted =
    eligibleCount > 0 && completedCount === eligibleCount;

  const incompleteEntries = entries.filter(
    (entry) => entry.status !== 'completed',
  );
  const inProgressEntries = incompleteEntries.filter(
    (entry) => entry.status === 'in-progress',
  );

  let upNextEntry: (typeof entries)[number] | null = null;

  if (inProgressEntries.length > 0) {
    const canonicalActiveId = progress.activeMissionId
      ? getCanonicalMissionId(progress.activeMissionId)
      : null;

    const sortedInProgress = [...inProgressEntries].sort((a, b) => {
      const timeA = parseTimestampMs(a.detail.updatedAt);
      const timeB = parseTimestampMs(b.detail.updatedAt);

      if (!Number.isNaN(timeA) && !Number.isNaN(timeB) && timeA !== timeB) {
        return timeB - timeA;
      }
      if (!Number.isNaN(timeB) && Number.isNaN(timeA)) return 1;
      if (!Number.isNaN(timeA) && Number.isNaN(timeB)) return -1;

      const aIsActive = a.lesson.id === canonicalActiveId ? 1 : 0;
      const bIsActive = b.lesson.id === canonicalActiveId ? 1 : 0;
      if (aIsActive !== bIsActive) {
        return bIsActive - aIsActive;
      }

      return a.catalogIndex - b.catalogIndex;
    });

    upNextEntry = sortedInProgress[0];
  } else if (incompleteEntries.length > 0) {
    upNextEntry = incompleteEntries[0];
  }

  const upNext = upNextEntry
    ? buildLessonCardItem(
        upNextEntry.lesson,
        upNextEntry.status,
        upNextEntry.detail,
      )
    : null;

  const alsoReady = incompleteEntries
    .filter((entry) => entry.lesson.id !== upNextEntry?.lesson.id)
    .slice(0, 2)
    .map((entry) =>
      buildLessonCardItem(entry.lesson, entry.status, entry.detail),
    );

  return {
    eligibleCount,
    completedCount,
    completionPercent,
    allEligibleCompleted,
    upNext,
    alsoReady,
  };
}
