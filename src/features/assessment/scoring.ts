/**
 * ============================================================================
 * GRAMMAR QUEST — ASSESSMENT SCORING, SANITIZER & REVISION ENGINE
 * ============================================================================
 * Pure, deterministic functions separating assessment evaluation from UI state:
 *  - sanitizeQuestionForStudent: strips correctOptionId & explanation before submission
 *  - evaluateAssessment: computes score, percentage, counts & per-question review
 *  - computeRevisionRecommendations: builds unique revision targets ONLY from
 *    objectives where the learner made mistakes or left questions unanswered
 * ============================================================================
 */

import type {
  AssessmentDefinition,
  AssessmentEvaluationSummary,
  AssessmentObjectiveId,
  AssessmentQuestion,
  EvaluatedQuestionResult,
  RevisionRecommendationItem,
  StudentQuestionView,
} from '../../schemas/assessment.schema';

const OBJECTIVE_DEFAULT_STAGE: Record<
  AssessmentObjectiveId,
  { actionLabel: string; stage: 'learn' | 'guided' | 'practice'; stepNumber?: number }
> = {
  'recognising-complete-sentence': {
    actionLabel: 'Revisit Stage 2: Complete Sentences',
    stage: 'learn',
    stepNumber: 1,
  },
  'identifying-subject': {
    actionLabel: 'Revisit Stage 3: Discover the Subject',
    stage: 'learn',
    stepNumber: 2,
  },
  'identifying-predicate': {
    actionLabel: 'Revisit Stage 5: Discover the Predicate',
    stage: 'learn',
    stepNumber: 4,
  },
  'distinguishing-subject-predicate': {
    actionLabel: 'Revisit Stage 6: Noticeboard Split',
    stage: 'learn',
    stepNumber: 5,
  },
  'understanding-subject-meaning': {
    actionLabel: 'Revisit Stage 4: Subject Head-Noun Meaning',
    stage: 'learn',
    stepNumber: 3,
  },
  'understanding-predicate-meaning': {
    actionLabel: 'Revisit Stage 5: Action & Finite Verb',
    stage: 'learn',
    stepNumber: 4,
  },
  'recognising-varied-structures': {
    actionLabel: 'Revisit Guided Practice Activities',
    stage: 'guided',
  },
  'applying-to-unfamiliar': {
    actionLabel: 'Revisit Independent Practice Challenges',
    stage: 'practice',
  },
  'time-vs-verb-form': {
    actionLabel: 'Revisit Timeline: Time vs Verb Form',
    stage: 'learn',
    stepNumber: 2,
  },
  'present-simple-vs-progressive': {
    actionLabel: 'Revisit Present Habit vs Ongoing Action',
    stage: 'learn',
    stepNumber: 3,
  },
  'stative-verbs-no-ing': {
    actionLabel: 'Revisit Stative Verbs & Common Errors',
    stage: 'learn',
    stepNumber: 5,
  },
  'past-simple-vs-perfect': {
    actionLabel: 'Revisit Past & Perfect Time Links',
    stage: 'learn',
    stepNumber: 6,
  },
  'future-time-expressions': {
    actionLabel: 'Revisit Expressing Future Time',
    stage: 'learn',
    stepNumber: 7,
  },
  'tense-error-diagnosis': {
    actionLabel: 'Revisit Guided Time & Tense Lab',
    stage: 'guided',
  },
  'core-number-person-concord': {
    actionLabel: 'Revisit Subject–Verb Concord Lock',
    stage: 'learn',
    stepNumber: 2,
  },
  'intervening-phrases-trap': {
    actionLabel: 'Revisit Intervening Phrases Trap',
    stage: 'learn',
    stepNumber: 3,
  },
  'compound-and-single-idea': {
    actionLabel: 'Revisit Compound & Single-Idea Subjects',
    stage: 'learn',
    stepNumber: 4,
  },
  'correlative-and-with-joiners': {
    actionLabel: 'Revisit Either/Or & As Well As Rules',
    stage: 'learn',
    stepNumber: 5,
  },
  'tricky-nouns-and-indefinites': {
    actionLabel: 'Revisit Tricky Nouns & Indefinites',
    stage: 'learn',
    stepNumber: 6,
  },
  'agreement-error-diagnosis': {
    actionLabel: 'Revisit Guided Detective Lab',
    stage: 'guided',
  },
};

/**
 * Strips answer keys and explanations before passing question objects into
 * active pre-submission assessment UI components.
 */
export function sanitizeQuestionForStudent(
  question: AssessmentQuestion,
): StudentQuestionView {
  return {
    id: question.id,
    questionText: question.questionText,
    options: question.options.map((opt) => ({ id: opt.id, text: opt.text })),
    learningObjectiveId: question.learningObjectiveId,
    learningObjective: question.learningObjective,
    difficulty: question.difficulty,
  };
}

/**
 * Computes revision recommendations strictly from missed or unanswered
 * objectives. Any objective answered 100% accurately is excluded.
 */
export function computeRevisionRecommendations(
  questions: AssessmentQuestion[],
  results: EvaluatedQuestionResult[],
): RevisionRecommendationItem[] {
  const statsByObjective = new Map<
    AssessmentObjectiveId,
    {
      objectiveLabel: string;
      total: number;
      missed: number;
      recommendedStage: 'learn' | 'guided' | 'practice';
      recommendedStepNumber?: number;
    }
  >();

  questions.forEach((question, index) => {
    const result = results[index];
    const defaults = OBJECTIVE_DEFAULT_STAGE[question.learningObjectiveId];
    const current = statsByObjective.get(question.learningObjectiveId) ?? {
      objectiveLabel: question.learningObjective,
      total: 0,
      missed: 0,
      recommendedStage: question.recommendedStage ?? defaults.stage,
      recommendedStepNumber: question.recommendedStepNumber ?? defaults.stepNumber,
    };

    current.total += 1;
    if (!result?.isCorrect) {
      current.missed += 1;
    }
    statsByObjective.set(question.learningObjectiveId, current);
  });

  const recommendations: RevisionRecommendationItem[] = [];
  for (const [objectiveId, stat] of statsByObjective.entries()) {
    if (stat.missed > 0) {
      const defaults = OBJECTIVE_DEFAULT_STAGE[objectiveId];
      recommendations.push({
        objectiveId,
        objectiveLabel: stat.objectiveLabel,
        missedCount: stat.missed,
        totalForObjective: stat.total,
        actionLabel: defaults.actionLabel,
        recommendedStage: stat.recommendedStage,
        recommendedStepNumber: stat.recommendedStepNumber,
      });
    }
  }

  return recommendations;
}

/**
 * Evaluates a submitted assessment against official answer keys.
 * Intended to be called strictly after explicit student submission.
 */
export function evaluateAssessment(
  assessment: AssessmentDefinition,
  selectedAnswers: Record<string, string>,
): AssessmentEvaluationSummary {
  const questionResults: EvaluatedQuestionResult[] = assessment.questions.map(
    (question, index) => {
      const rawSelectedId = selectedAnswers[question.id] ?? null;
      const selectedOption = rawSelectedId
        ? question.options.find((o) => o.id === rawSelectedId) ?? null
        : null;
      const correctOption =
        question.options.find((o) => o.id === question.correctOptionId) ?? null;

      const isAnswered = Boolean(selectedOption);
      const isCorrect =
        isAnswered && selectedOption?.id === question.correctOptionId;

      return {
        questionId: question.id,
        questionNumber: index + 1,
        questionText: question.questionText,
        options: question.options,
        selectedOptionId: selectedOption?.id ?? null,
        selectedOptionText: selectedOption?.text ?? null,
        correctOptionId: question.correctOptionId,
        correctOptionText: correctOption?.text ?? '',
        isAnswered,
        isCorrect,
        explanation: question.explanation,
        learningObjectiveId: question.learningObjectiveId,
        learningObjective: question.learningObjective,
        difficulty: question.difficulty,
      };
    },
  );

  const totalQuestions = questionResults.length;
  const answeredCount = questionResults.filter((r) => r.isAnswered).length;
  const correctCount = questionResults.filter((r) => r.isCorrect).length;
  const unansweredCount = questionResults.filter((r) => !r.isAnswered).length;
  const incorrectCount = totalQuestions - correctCount - unansweredCount;
  const score = correctCount;
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const revisionRecommendations = computeRevisionRecommendations(
    assessment.questions,
    questionResults,
  );

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    incorrectCount,
    unansweredCount,
    score,
    percentage,
    questionResults,
    revisionRecommendations,
  };
}

export function getAchievementMessage(
  percentage: number,
  topicLabel = 'this grammar topic',
): {
  headline: string;
  message: string;
} {
  if (percentage === 100) {
    return {
      headline: 'Outstanding Mastery!',
      message: `You answered every question accurately. Mira, Arjun, and Gyan say you have mastered ${topicLabel}!`,
    };
  }
  if (percentage >= 80) {
    return {
      headline: 'Strong Grammar Sense!',
      message: `Well done! You have a solid grasp of ${topicLabel}. A quick look at any missed items below will make your foundation even stronger.`,
    };
  }
  if (percentage >= 50) {
    return {
      headline: 'Good Effort — Keep Building!',
      message:
        'You already have several core ideas right. Review the explanations and revision focus areas below, then revisit any lesson step you want to practise.',
    };
  }
  return {
    headline: 'Every Attempt Helps You Grow!',
    message: `Thank you for completing the full assessment. Use the clear explanations and revision links below to explore ${topicLabel} step by step.`,
  };
}
