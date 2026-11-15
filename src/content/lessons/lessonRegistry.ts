/**
 * ============================================================================
 * GRAMMAR QUEST — LESSON CONTENT REGISTRY
 * ============================================================================
 * Loads versioned JSON lesson definitions by mission ID or class level so the
 * Visual Grammar Teaching Engine remains completely independent of lesson data.
 * ============================================================================
 */

import type { ClassLevel } from '../../schemas/lesson.schema';
import type { GrammarLessonDefinition } from '../../schemas/grammarEngine.schema';
import class9SentenceBasics from '../class9/sentenceBasicsLesson.json';
import class10SentenceBasics from '../class10/sentenceBasicsLesson.json';

const LESSONS_BY_MISSION_ID: Record<string, GrammarLessonDefinition> = {
  'c9-mission-01': class9SentenceBasics as GrammarLessonDefinition,
  'c10-mission-01': class10SentenceBasics as GrammarLessonDefinition,
};

export function getLessonForMission(missionId: string): GrammarLessonDefinition | null {
  return LESSONS_BY_MISSION_ID[missionId] ?? null;
}

export function getSentenceBasicsLesson(classLevel: ClassLevel): GrammarLessonDefinition {
  return (classLevel === 10
    ? class10SentenceBasics
    : class9SentenceBasics) as GrammarLessonDefinition;
}

export function hasInteractiveLesson(missionId: string): boolean {
  return Boolean(LESSONS_BY_MISSION_ID[missionId]);
}
