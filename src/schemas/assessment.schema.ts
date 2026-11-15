/**
 * ============================================================================
 * GRAMMAR QUEST — FORMAL ASSESSMENT, RESULTS & PROGRESS SCHEMAS
 * ============================================================================
 * Reusable TypeScript contracts separating assessment JSON data from React
 * assessment UI components. Supports pre-submission sanitized question views,
 * read-only post-submission review, per-objective revision recommendations,
 * and browser-local IndexedDB attempt persistence.
 * ============================================================================
 */

import type { ClassLevel } from './lesson.schema';

export type AssessmentObjectiveId =
  | 'recognising-complete-sentence'
  | 'identifying-subject'
  | 'identifying-predicate'
  | 'distinguishing-subject-predicate'
  | 'understanding-subject-meaning'
  | 'understanding-predicate-meaning'
  | 'recognising-varied-structures'
  | 'applying-to-unfamiliar';

export type AssessmentDifficulty = 'foundation' | 'standard' | 'stretch';

export type RecommendedMissionStage = 'learn' | 'guided' | 'practice';

export interface AssessmentOption {
  id: string;
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  options: AssessmentOption[];
  correctOptionId: string;
  explanation: string;
  learningObjectiveId: AssessmentObjectiveId;
  learningObjective: string;
  difficulty: AssessmentDifficulty;
  recommendedStage?: RecommendedMissionStage;
  recommendedStepNumber?: number;
}

/**
 * Student-facing pre-submission view of a question.
 * Intentionally omits correctOptionId and explanation so active quiz
 * components never receive or accidentally render answer data before submission.
 */
export interface StudentQuestionView {
  id: string;
  questionText: string;
  options: AssessmentOption[];
  learningObjectiveId: AssessmentObjectiveId;
  learningObjective: string;
  difficulty: AssessmentDifficulty;
}

export interface AssessmentDefinition {
  assessmentId: string;
  missionId: string;
  classLevel: ClassLevel;
  moduleId: string;
  moduleTitle: string;
  topic: string;
  missionTitle: string;
  title: string;
  subtitle: string;
  questions: AssessmentQuestion[];
}

export interface RevisionRecommendationItem {
  objectiveId: AssessmentObjectiveId;
  objectiveLabel: string;
  missedCount: number;
  totalForObjective: number;
  actionLabel: string;
  recommendedStage: RecommendedMissionStage;
  recommendedStepNumber?: number;
}

export interface EvaluatedQuestionResult {
  questionId: string;
  questionNumber: number;
  questionText: string;
  options: AssessmentOption[];
  selectedOptionId: string | null;
  selectedOptionText: string | null;
  correctOptionId: string;
  correctOptionText: string;
  isAnswered: boolean;
  isCorrect: boolean;
  explanation: string;
  learningObjectiveId: AssessmentObjectiveId;
  learningObjective: string;
  difficulty: AssessmentDifficulty;
}

export interface AssessmentEvaluationSummary {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number;
  percentage: number;
  questionResults: EvaluatedQuestionResult[];
  revisionRecommendations: RevisionRecommendationItem[];
}

export type AssessmentAttemptStatus = 'in-progress' | 'submitted';

export interface AssessmentAttemptRecord {
  /** Storage primary key (unique per active/latest mission attempt: missionId) */
  id: string;
  /** Unique attempt identifier generated when the attempt began */
  attemptId: string;
  assessmentId: string;
  missionId: string;
  classLevel: ClassLevel;
  topic: string;
  selectedAnswers: Record<string, string>;
  currentQuestionIndex: number;
  status: AssessmentAttemptStatus;
  score: number | null;
  totalQuestions: number;
  percentage: number | null;
  correctCount: number | null;
  incorrectCount: number | null;
  unansweredCount: number | null;
  submittedAt: string | null;
  updatedAt: string;
  revisionRecommendations: RevisionRecommendationItem[];
}

export interface AssessmentStorageResult {
  attempt: AssessmentAttemptRecord | null;
  storageAvailable: boolean;
  storageMessage?: string;
}
