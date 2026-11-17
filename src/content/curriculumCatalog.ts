/**
 * ============================================================================
 * GRAMMAR QUEST — VERIFIED CURRICULUM TOPIC CATALOG
 * ============================================================================
 * Structured 22-topic curriculum explorer catalogue derived directly from
 * `curriculum-overview.md` and `curriculum-source-map.json` covering Classes 9
 * and 10 across SEBA (Assam), PSEB (Punjab), and BSE Odisha textbooks.
 * ============================================================================
 */

import type {
  ClassLevel,
  PlaceholderMissionSummary,
  StudentProgressRecord,
} from '../schemas/lesson.schema';
import { hasInteractiveLesson } from './lessons/lessonRegistry';
import { hasFormalAssessment } from './assessments/assessmentRegistry';
import { getMissionProgressDetail } from '../storage/progressRepository';

export type TopicAvailabilityStatus = 'ready' | 'upcoming';
export type UnifiedLessonStatus = 'not-started' | 'in-progress' | 'completed';
export type LessonIconKind = PlaceholderMissionSummary['iconKind'];

export interface CurriculumTopicItem {
  id: string;
  title: string;
  categoryId: string;
  classLevels: ClassLevel[];
  sourceSummary: string;
  conceptSummary: string;
  status: TopicAvailabilityStatus;
  missionIdByClass?: Partial<Record<ClassLevel, string>>;
  missionNumber?: string;
  missionTitle?: string;
  estimatedMinutes?: number;
  iconKind?: LessonIconKind;
}

export interface CurriculumCategoryGroup {
  id: string;
  title: string;
  subtitle: string;
  defaultExpanded: boolean;
  topics: CurriculumTopicItem[];
}

export interface CatalogLessonSummary {
  id: string;
  topicId: string;
  title: string;
  lessonTitle: string;
  conceptSummary: string;
  categoryId: string;
  categoryTitle: string;
  estimatedMinutes?: number;
  iconKind: LessonIconKind;
  status: TopicAvailabilityStatus;
  hasTest: boolean;
}

export const CURRICULUM_TOPIC_CATALOG: CurriculumCategoryGroup[] = [
  {
    id: 'cat-sentence-clauses',
    title: 'Sentence Structure & Clauses',
    subtitle: 'How words combine into complete sentences and clauses',
    defaultExpanded: true,
    topics: [
      {
        id: 'topic-subject-predicate',
        title: 'Subject and Predicate',
        categoryId: 'cat-sentence-clauses',
        classLevels: [9, 10],
        sourceSummary: 'Odisha IX Ch. 1 · Assam Ch. 1 · PSEB IX Ch. 5',
        conceptSummary: 'Who or what a sentence is about, and what is said about it',
        status: 'ready',
        missionIdByClass: {
          9: 'c9-mission-01',
          10: 'c10-mission-01',
        },
        missionTitle: 'Repair the Broken Message',
        estimatedMinutes: 7,
        iconKind: 'scroll',
      },
      {
        id: 'topic-sentence-types',
        title: 'Sentence Types & Clause Patterns',
        categoryId: 'cat-sentence-clauses',
        classLevels: [9, 10],
        sourceSummary: 'Odisha IX Ch. 1 Sec. D, Ch. 12 · Odisha X Ch. 2 · Assam Ch. 1–2',
        conceptSummary: 'Sentence purposes, phrases vs clauses, and basic clause patterns',
        status: 'ready',
        missionIdByClass: {
          9: 'c9-mission-04',
          10: 'c10-mission-04',
        },
        missionTitle: 'Sentence Types & Clause Patterns',
        estimatedMinutes: 9,
        iconKind: 'scroll',
      },
      {
        id: 'topic-simple-compound-complex',
        title: 'Simple, Compound & Complex Sentences',
        categoryId: 'cat-sentence-clauses',
        classLevels: [9, 10],
        sourceSummary: 'PSEB IX Ch. 5 · Assam Ch. 1 · Odisha X Ch. 2',
        conceptSummary: 'Combining clauses using coordination and subordination',
        status: 'upcoming',
      },
      {
        id: 'topic-clauses',
        title: 'Noun, Relative & Adverb Clauses',
        categoryId: 'cat-sentence-clauses',
        classLevels: [10],
        sourceSummary: 'Odisha X Ch. 7–8 · Assam Ch. 7–8',
        conceptSummary: 'Subordinate clauses acting as nouns, adjectives, or adverbs',
        status: 'upcoming',
      },
      {
        id: 'topic-conditionals',
        title: 'Conditionals',
        categoryId: 'cat-sentence-clauses',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 8 · PSEB IX p. 43 · Assam Ch. 1',
        conceptSummary: 'If-clauses for real, probable, and imaginary conditions',
        status: 'upcoming',
      },
      {
        id: 'topic-negatives-interrogatives',
        title: 'Negatives, Interrogatives & Transformations',
        categoryId: 'cat-sentence-clauses',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 11 · Assam Ch. 3 & 16',
        conceptSummary: 'Forming negatives, questions, and sentence transformations',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'cat-verbs-agreement',
    title: 'Verbs, Time & Agreement',
    subtitle: 'Verb forms, tense frames, and subject–verb concord',
    defaultExpanded: false,
    topics: [
      {
        id: 'topic-tenses',
        title: 'Tenses: Time and Verb Forms',
        categoryId: 'cat-verbs-agreement',
        classLevels: [9, 10],
        sourceSummary: 'Odisha IX Ch. 3 · X Ch. 1 · PSEB IX Ch. 9 · Assam Ch. 9',
        conceptSummary: 'Connecting past, present, and future time with verb forms',
        status: 'ready',
        missionIdByClass: {
          9: 'c9-mission-02',
          10: 'c10-mission-02',
        },
        missionTitle: 'Journey Through Time',
        estimatedMinutes: 8,
        iconKind: 'hourglass',
      },
      {
        id: 'topic-sva',
        title: 'Subject–Verb Agreement',
        categoryId: 'cat-verbs-agreement',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 3 · PSEB IX Ch. 9 · Odisha IX Ch. 2, 7, 8',
        conceptSummary: 'Matching singular and plural subjects with the right verbs',
        status: 'ready',
        missionIdByClass: {
          9: 'c9-mission-03',
          10: 'c10-mission-03',
        },
        missionTitle: 'The Grammar Detective',
        estimatedMinutes: 8,
        iconKind: 'magnifier',
      },
      {
        id: 'topic-auxiliaries-modals',
        title: 'Auxiliaries, Modals & Special Verbs',
        categoryId: 'cat-verbs-agreement',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 2 & 4 · PSEB IX Ch. 2 · Assam Ch. 10',
        conceptSummary: 'Helping verbs and modals for ability, duty, and possibility',
        status: 'upcoming',
      },
      {
        id: 'topic-non-finite',
        title: 'Non-Finite Verb Forms',
        categoryId: 'cat-verbs-agreement',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 4 · PSEB IX Ch. 8 · Assam Ch. 10',
        conceptSummary: 'Infinitives, gerunds, and participles that do not show tense',
        status: 'upcoming',
      },
      {
        id: 'topic-phrasal-verbs',
        title: 'Phrasal Verbs',
        categoryId: 'cat-verbs-agreement',
        classLevels: [10],
        sourceSummary: 'Odisha X Ch. 6 · Assam Ch. 10',
        conceptSummary: 'Verbs combined with particles to create distinct meanings',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'cat-nouns-modifiers',
    title: 'Nouns, Pronouns & Modifiers',
    subtitle: 'Noun groups, determiners, adjectives, and adverbs',
    defaultExpanded: false,
    topics: [
      {
        id: 'topic-countables',
        title: 'Countables, Uncountables & Noun Numbers',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 7 · Assam Ch. 4',
        conceptSummary: 'Singular, plural, countable, and uncountable noun usage',
        status: 'upcoming',
      },
      {
        id: 'topic-noun-phrases',
        title: 'Noun Phrases & Pre/Post-Modifiers',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 5–6',
        conceptSummary: 'Expanding nouns with modifiers before and after the head word',
        status: 'upcoming',
      },
      {
        id: 'topic-determiners',
        title: 'Determiners & Articles',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 8 · PSEB IX Ch. 1 · Assam Ch. 6',
        conceptSummary: 'Articles (a, an, the) and words that specify nouns',
        status: 'upcoming',
      },
      {
        id: 'topic-pronouns',
        title: 'Pronouns & Case',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9, 10],
        sourceSummary: 'Assam Ch. 5 · Odisha IX Ch. 1 Sec. C',
        conceptSummary: 'Personal, reflexive, and relative pronouns in subject and object roles',
        status: 'upcoming',
      },
      {
        id: 'topic-adjectives',
        title: 'Adjectives & Comparison',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 9 · Assam Ch. 6 & 16',
        conceptSummary: 'Describing nouns and forming comparative and superlative degrees',
        status: 'upcoming',
      },
      {
        id: 'topic-adverbs',
        title: 'Adverbs & Adverbials',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 10 · Assam Ch. 13',
        conceptSummary: 'Modifying verbs, adjectives, and clauses for time, place, and manner',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'cat-connectors',
    title: 'Connectors & Prepositions',
    subtitle: 'Linking words that show position, time, and relation',
    defaultExpanded: false,
    topics: [
      {
        id: 'topic-prepositions',
        title: 'Prepositions',
        categoryId: 'cat-connectors',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 5 · PSEB IX Ch. 3 · Assam Ch. 14',
        conceptSummary: 'Showing relationships of place, time, direction, and means',
        status: 'ready',
        missionIdByClass: {
          9: 'c9-mission-06',
          10: 'c10-mission-06',
        },
        missionTitle: 'Prepositions',
        estimatedMinutes: 9,
        iconKind: 'magnifier',
      },
      {
        id: 'topic-conjunctions',
        title: 'Conjunctions',
        categoryId: 'cat-connectors',
        classLevels: [9, 10],
        sourceSummary: 'PSEB IX Ch. 4 · Assam Ch. 12',
        conceptSummary: 'Linking words, phrases, and clauses clearly and logically',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'cat-voice-speech',
    title: 'Voice, Speech & Mechanics',
    subtitle: 'Active/passive voice, reported speech, and punctuation',
    defaultExpanded: false,
    topics: [
      {
        id: 'topic-voice',
        title: 'Active and Passive Voice',
        categoryId: 'cat-voice-speech',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 9 · PSEB IX Ch. 6 · Assam Ch. 11',
        conceptSummary: 'Shifting focus between the doer and the receiver of an action',
        status: 'ready',
        missionIdByClass: {
          9: 'c9-mission-05',
          10: 'c10-mission-05',
        },
        missionTitle: 'Active and Passive Voice',
        estimatedMinutes: 9,
        iconKind: 'scroll',
      },
      {
        id: 'topic-speech',
        title: 'Direct and Indirect Speech',
        categoryId: 'cat-voice-speech',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 10 · PSEB IX Ch. 7 · Assam Ch. 15',
        conceptSummary: 'Reporting spoken words accurately with direct and indirect speech',
        status: 'upcoming',
      },
      {
        id: 'topic-punctuation',
        title: 'Punctuation',
        categoryId: 'cat-voice-speech',
        classLevels: [9, 10],
        sourceSummary: 'Assam Ch. 17',
        conceptSummary: 'Using commas, stops, apostrophes, and quotation marks clearly',
        status: 'upcoming',
      },
    ],
  },
];

export function getCanonicalMissionId(missionId: string): string {
  return missionId.replace(/^c(?:9|10)-/, 'c9-');
}

export function getMissionIdForTopic(topic: CurriculumTopicItem): string | undefined {
  const raw = topic.missionIdByClass?.[9] ?? topic.missionIdByClass?.[10];
  return raw ? getCanonicalMissionId(raw) : undefined;
}

export function getAllCatalogLessons(): CatalogLessonSummary[] {
  const lessons: CatalogLessonSummary[] = [];
  for (const group of CURRICULUM_TOPIC_CATALOG) {
    for (const topic of group.topics) {
      const missionId = getMissionIdForTopic(topic);
      const isActuallyReady =
        topic.status === 'ready' && Boolean(missionId && hasInteractiveLesson(missionId));
      lessons.push({
        id: missionId ?? topic.id,
        topicId: topic.id,
        title: topic.title,
        lessonTitle: topic.missionTitle ?? topic.title,
        conceptSummary: topic.conceptSummary,
        categoryId: group.id,
        categoryTitle: group.title,
        estimatedMinutes: topic.estimatedMinutes,
        iconKind: topic.iconKind ?? 'scroll',
        status: isActuallyReady ? 'ready' : 'upcoming',
        hasTest: Boolean(missionId && isActuallyReady && hasFormalAssessment(missionId)),
      });
    }
  }
  return lessons;
}

export function getAvailableLessons(): CatalogLessonSummary[] {
  return getAllCatalogLessons().filter((lesson) => lesson.status === 'ready');
}

export function getUpcomingLessons(): CatalogLessonSummary[] {
  return getAllCatalogLessons().filter((lesson) => lesson.status === 'upcoming');
}

export function getCategoryIdForMissionId(missionId: string): string | null {
  const canonicalId = getCanonicalMissionId(missionId);
  for (const group of CURRICULUM_TOPIC_CATALOG) {
    for (const topic of group.topics) {
      const topicMissionId = getMissionIdForTopic(topic);
      if (topicMissionId && topicMissionId === canonicalId) {
        return group.id;
      }
    }
  }
  return null;
}

export function resolveUnifiedLessonStatus(
  progress: StudentProgressRecord,
  missionId?: string,
): UnifiedLessonStatus {
  if (!missionId) return 'not-started';
  const detail = getMissionProgressDetail(progress, getCanonicalMissionId(missionId));
  if (detail.completed) return 'completed';
  if (detail.started) return 'in-progress';
  return 'not-started';
}

