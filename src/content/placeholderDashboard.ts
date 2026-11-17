/**
 * ============================================================================
 * GRAMMAR QUEST — CLASS OVERVIEW & MISSION SUMMARIES
 * ============================================================================
 * Concise, student-facing mission titles and summaries for Classes 9 and 10.
 * ============================================================================
 */

import type { ClassLevel, PlaceholderMissionSummary } from '../schemas/lesson.schema';

export interface GuideTopicOutline {
  id: string;
  title: string;
  summary: string;
}

export interface ClassOverviewContent {
  classLevel: ClassLevel;
  classLabel: string;
  welcomeSubtitle: string;
  featuredMission: PlaceholderMissionSummary;
  plannedTracks: PlaceholderMissionSummary[];
  guideTopics: GuideTopicOutline[];
}

export const PLACEHOLDER_CLASS_CONTENT: Record<ClassLevel, ClassOverviewContent> = {
  9: {
    classLevel: 9,
    classLabel: 'Class 9',
    welcomeSubtitle: 'Explore English grammar step by step.',
    featuredMission: {
      id: 'c9-mission-01',
      missionNumber: 'Lesson 01',
      classLevel: 9,
      title: 'Repair the Broken Message',
      topicLabel: 'Subject and Predicate',
      shortDescription: 'Identify who or what a sentence is about and what is said about it.',
      estimatedMinutes: 7,
      iconKind: 'scroll',
      status: 'ready',
    },
    plannedTracks: [
      {
        id: 'c9-mission-02',
        missionNumber: 'Lesson 02',
        classLevel: 9,
        title: 'Journey Through Time',
        topicLabel: 'Tenses: Time and Verb Forms',
        shortDescription: 'Connect past, present, and future events with the right verb forms.',
        estimatedMinutes: 8,
        iconKind: 'hourglass',
        status: 'ready',
      },
      {
        id: 'c9-mission-03',
        missionNumber: 'Lesson 03',
        classLevel: 9,
        title: 'The Grammar Detective',
        topicLabel: 'Subject–Verb Agreement',
        shortDescription: 'Match singular and plural subjects with the right verbs.',
        estimatedMinutes: 8,
        iconKind: 'magnifier',
        status: 'ready',
      },
    ],
    guideTopics: [
      {
        id: 'guide-subject-predicate',
        title: 'Subject and Predicate',
        summary: 'Sentence basics',
      },
      {
        id: 'guide-tenses',
        title: 'Tenses: Time and Verb Forms',
        summary: 'Time and verb forms',
      },
      {
        id: 'guide-sva',
        title: 'Subject–Verb Agreement',
        summary: 'Matching subjects and verbs',
      },
    ],
  },
  10: {
    classLevel: 10,
    classLabel: 'Class 10',
    welcomeSubtitle: 'Strengthen English grammar with clear, focused lessons.',
    featuredMission: {
      id: 'c10-mission-01',
      missionNumber: 'Lesson 01',
      classLevel: 10,
      title: 'Repair the Broken Message',
      topicLabel: 'Subject and Predicate',
      shortDescription: 'Identify who or what a sentence is about and what is said about it.',
      estimatedMinutes: 7,
      iconKind: 'scroll',
      status: 'ready',
    },
    plannedTracks: [
      {
        id: 'c10-mission-02',
        missionNumber: 'Lesson 02',
        classLevel: 10,
        title: 'Journey Through Time',
        topicLabel: 'Tenses: Time and Verb Forms',
        shortDescription: 'Connect past, present, and future events with the right verb forms.',
        estimatedMinutes: 8,
        iconKind: 'hourglass',
        status: 'ready',
      },
      {
        id: 'c10-mission-03',
        missionNumber: 'Lesson 03',
        classLevel: 10,
        title: 'The Grammar Detective',
        topicLabel: 'Subject–Verb Agreement',
        shortDescription: 'Match singular and plural subjects with the right verbs.',
        estimatedMinutes: 8,
        iconKind: 'magnifier',
        status: 'ready',
      },
    ],
    guideTopics: [
      {
        id: 'guide-subject-predicate',
        title: 'Subject and Predicate',
        summary: 'Sentence basics',
      },
      {
        id: 'guide-tenses',
        title: 'Tenses: Time and Verb Forms',
        summary: 'Time and verb forms',
      },
      {
        id: 'guide-sva',
        title: 'Subject–Verb Agreement',
        summary: 'Matching subjects and verbs',
      },
    ],
  },
};
