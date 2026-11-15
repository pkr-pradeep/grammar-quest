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
import class9Tenses from '../class9/tensesLesson.json';
import class10Tenses from '../class10/tensesLesson.json';
import class9SubjectVerbAgreement from '../class9/subjectVerbAgreementLesson.json';
import class10SubjectVerbAgreement from '../class10/subjectVerbAgreementLesson.json';

const LESSONS_BY_MISSION_ID: Record<string, GrammarLessonDefinition> = {
  'c9-mission-01': class9SentenceBasics as GrammarLessonDefinition,
  'c10-mission-01': class10SentenceBasics as GrammarLessonDefinition,
  'c9-mission-02': class9Tenses as GrammarLessonDefinition,
  'c10-mission-02': class10Tenses as GrammarLessonDefinition,
  'c9-mission-03': class9SubjectVerbAgreement as GrammarLessonDefinition,
  'c10-mission-03': class10SubjectVerbAgreement as GrammarLessonDefinition,
};

export function getLessonForMission(missionId: string): GrammarLessonDefinition | null {
  return LESSONS_BY_MISSION_ID[missionId] ?? null;
}

export function getSentenceBasicsLesson(classLevel: ClassLevel): GrammarLessonDefinition {
  return (classLevel === 10
    ? class10SentenceBasics
    : class9SentenceBasics) as GrammarLessonDefinition;
}

export function getTensesLesson(classLevel: ClassLevel): GrammarLessonDefinition {
  return (classLevel === 10 ? class10Tenses : class9Tenses) as GrammarLessonDefinition;
}

export function getSubjectVerbAgreementLesson(
  classLevel: ClassLevel,
): GrammarLessonDefinition {
  return (classLevel === 10
    ? class10SubjectVerbAgreement
    : class9SubjectVerbAgreement) as GrammarLessonDefinition;
}

export function hasInteractiveLesson(missionId: string): boolean {
  return Boolean(LESSONS_BY_MISSION_ID[missionId]);
}
