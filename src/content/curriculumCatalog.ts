/**
 * ============================================================================
 * GRAMMAR QUEST — VERIFIED CURRICULUM TOPIC CATALOG
 * ============================================================================
 * Structured 22-topic curriculum explorer catalogue derived directly from
 * `curriculum-overview.md` and `curriculum-source-map.json` covering Classes 9
 * and 10 across SEBA (Assam), PSEB (Punjab), and BSE Odisha textbooks.
 * ============================================================================
 */

import type { ClassLevel } from '../schemas/lesson.schema';

export type TopicAvailabilityStatus = 'ready' | 'upcoming';

export interface CurriculumTopicItem {
  id: string;
  title: string;
  categoryId: string;
  classLevels: ClassLevel[];
  sourceSummary: string;
  status: TopicAvailabilityStatus;
  missionIdByClass?: Partial<Record<ClassLevel, string>>;
  missionNumber?: string;
  missionTitle?: string;
  estimatedMinutes?: number;
}

export interface CurriculumCategoryGroup {
  id: string;
  title: string;
  subtitle: string;
  defaultExpanded: boolean;
  topics: CurriculumTopicItem[];
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
        status: 'ready',
        missionIdByClass: {
          9: 'c9-mission-01',
          10: 'c10-mission-01',
        },
        missionNumber: 'Mission 01',
        missionTitle: 'Repair the Broken Message',
        estimatedMinutes: 7,
      },
      {
        id: 'topic-sentence-types',
        title: 'Sentence Types & Clause Patterns',
        categoryId: 'cat-sentence-clauses',
        classLevels: [9, 10],
        sourceSummary: 'Odisha IX Ch. 1 Sec. D · Odisha X Ch. 2',
        status: 'upcoming',
      },
      {
        id: 'topic-simple-compound-complex',
        title: 'Simple, Compound & Complex Sentences',
        categoryId: 'cat-sentence-clauses',
        classLevels: [9, 10],
        sourceSummary: 'PSEB IX Ch. 5 · Assam Ch. 1 · Odisha X Ch. 2',
        status: 'upcoming',
      },
      {
        id: 'topic-clauses',
        title: 'Noun, Relative & Adverb Clauses',
        categoryId: 'cat-sentence-clauses',
        classLevels: [10],
        sourceSummary: 'Odisha X Ch. 7–8 · Assam Ch. 7–8',
        status: 'upcoming',
      },
      {
        id: 'topic-conditionals',
        title: 'Conditionals',
        categoryId: 'cat-sentence-clauses',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 8 · PSEB IX p. 43 · Assam Ch. 1',
        status: 'upcoming',
      },
      {
        id: 'topic-negatives-interrogatives',
        title: 'Negatives, Interrogatives & Transformations',
        categoryId: 'cat-sentence-clauses',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 11 · Assam Ch. 3 & 16',
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
        status: 'ready',
        missionIdByClass: {
          9: 'c9-mission-02',
          10: 'c10-mission-02',
        },
        missionNumber: 'Mission 02',
        missionTitle: 'Journey Through Time',
        estimatedMinutes: 8,
      },
      {
        id: 'topic-sva',
        title: 'Subject–Verb Agreement',
        categoryId: 'cat-verbs-agreement',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 3 · PSEB IX Ch. 9 · Odisha IX Ch. 2, 7, 8',
        status: 'ready',
        missionIdByClass: {
          9: 'c9-mission-03',
          10: 'c10-mission-03',
        },
        missionNumber: 'Mission 03',
        missionTitle: 'The Grammar Detective',
        estimatedMinutes: 8,
      },
      {
        id: 'topic-auxiliaries-modals',
        title: 'Auxiliaries, Modals & Special Verbs',
        categoryId: 'cat-verbs-agreement',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 2 & 4 · PSEB IX Ch. 2 · Assam Ch. 10',
        status: 'upcoming',
      },
      {
        id: 'topic-non-finite',
        title: 'Non-Finite Verb Forms',
        categoryId: 'cat-verbs-agreement',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 4 · PSEB IX Ch. 8 · Assam Ch. 10',
        status: 'upcoming',
      },
      {
        id: 'topic-phrasal-verbs',
        title: 'Phrasal Verbs',
        categoryId: 'cat-verbs-agreement',
        classLevels: [10],
        sourceSummary: 'Odisha X Ch. 6 · Assam Ch. 10',
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
        status: 'upcoming',
      },
      {
        id: 'topic-noun-phrases',
        title: 'Noun Phrases & Pre/Post-Modifiers',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 5–6',
        status: 'upcoming',
      },
      {
        id: 'topic-determiners',
        title: 'Determiners & Articles',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 8 · PSEB IX Ch. 1 · Assam Ch. 6',
        status: 'upcoming',
      },
      {
        id: 'topic-pronouns',
        title: 'Pronouns & Case',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9, 10],
        sourceSummary: 'Assam Ch. 5 · Odisha IX Ch. 1 Sec. C',
        status: 'upcoming',
      },
      {
        id: 'topic-adjectives',
        title: 'Adjectives & Comparison',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 9 · Assam Ch. 6 & 16',
        status: 'upcoming',
      },
      {
        id: 'topic-adverbs',
        title: 'Adverbs & Adverbials',
        categoryId: 'cat-nouns-modifiers',
        classLevels: [9],
        sourceSummary: 'Odisha IX Ch. 10 · Assam Ch. 13',
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
        status: 'upcoming',
      },
      {
        id: 'topic-conjunctions',
        title: 'Conjunctions',
        categoryId: 'cat-connectors',
        classLevels: [9, 10],
        sourceSummary: 'PSEB IX Ch. 4 · Assam Ch. 12',
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
        status: 'upcoming',
      },
      {
        id: 'topic-speech',
        title: 'Direct and Indirect Speech',
        categoryId: 'cat-voice-speech',
        classLevels: [9, 10],
        sourceSummary: 'Odisha X Ch. 10 · PSEB IX Ch. 7 · Assam Ch. 15',
        status: 'upcoming',
      },
      {
        id: 'topic-punctuation',
        title: 'Punctuation',
        categoryId: 'cat-voice-speech',
        classLevels: [9, 10],
        sourceSummary: 'Assam Ch. 17',
        status: 'upcoming',
      },
    ],
  },
];
