/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE ASSESSMENT RESULTS SCREEN
 * ============================================================================
 * Presents formal post-submission summary:
 *  - Total score out of 10 and percentage (tabular numerals)
 *  - Correct, incorrect, and unanswered breakdown
 *  - Encouraging, non-shaming achievement feedback with Mira, Arjun & ShukaJi
 *  - Targeted RevisionRecommendations derived strictly from mistakes
 *  - Full Question-by-Question AnswerReview
 *  - Strict read-only persistence notice
 * ============================================================================
 */

import React from 'react';
import { useReducedMotion } from 'motion/react';
import {
  CheckCircle2,
  Home,
  Lock,
  MinusCircle,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import type {
  AssessmentAttemptRecord,
  AssessmentEvaluationSummary,
  RecommendedMissionStage,
} from '../../../schemas/assessment.schema';
import { AppShellFooter, Button, CelebrationStars } from '../../../components';
import { SpeakerPortrait } from '../../grammar-engine/speakerTheme';
import { getAchievementMessage } from '../scoring';
import { RevisionRecommendations } from './RevisionRecommendations';
import { AnswerReview } from './AnswerReview';
import { playLearningFeedback } from '../../../services/feedback/feedbackService';
import { useFeedbackEvent } from '../../../hooks/useFeedbackEvent';

export interface AssessmentResultsProps {
  evaluation: AssessmentEvaluationSummary;
  attempt: AssessmentAttemptRecord;
  onRevisitStage: (stage: RecommendedMissionStage, stepNumber?: number) => void;
  onBackToMission?: () => void;
  onReviewLesson?: () => void;
  onBackToHome?: () => void;
}

function formatSubmittedTimestamp(isoString: string | null): string | null {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function computeAssessmentStars(percentage: number): 0 | 1 | 2 | 3 {
  if (percentage >= 80) return 3;
  if (percentage >= 50) return 2;
  if (percentage > 0) return 1;
  return 0;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  evaluation,
  attempt,
  onRevisitStage,
  onBackToMission,
  onReviewLesson,
  onBackToHome,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const feedback = getAchievementMessage(evaluation.percentage, attempt.topic);
  const formattedTime = formatSubmittedTimestamp(attempt.submittedAt);
  const earnedStars = computeAssessmentStars(evaluation.percentage);

  useFeedbackEvent(
    attempt.status === 'submitted'
      ? `assessment:${attempt.attemptId}:submitted`
      : null,
    () => playLearningFeedback('complete', `assessment:${attempt.attemptId}:submitted`),
  );

  return (
    <div className="space-y-4">
      {/* Score & Encouraging Feedback Card */}
      <section
        aria-label="Test score summary"
        className="rounded-[20px] bg-white border border-[#E5E2D9] p-4 sm:p-6 space-y-4 shadow-[var(--gq-shadow-card)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#4B5C8A]">
              Test Result
            </p>
            <div className="flex items-baseline gap-3 tabular-nums">
              <span className="font-heading text-3xl sm:text-4xl font-bold text-[#263A70]">
                {evaluation.score} / {evaluation.totalQuestions}
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#0F766E]">
                {evaluation.percentage}%
              </span>
            </div>
            <CelebrationStars
              stars={earnedStars}
              size="lg"
              mutedColorClass="fill-[#E5DEC9] text-[#B8AE94]"
              ariaLabel={`${earnedStars} out of 3 stars earned for scoring ${evaluation.score} out of ${evaluation.totalQuestions}`}
              className="pt-0.5"
            />
          </div>

          <div className="flex items-center -space-x-2 self-start sm:self-center" aria-hidden="true">
            <SpeakerPortrait
              characterId="mira"
              expression={evaluation.percentage >= 80 ? 'celebrating' : 'happy'}
              pose={evaluation.percentage >= 80 ? 'celebrating' : 'pointing'}
              animatePop={!prefersReducedMotion}
              popDelayMs={0}
            />
            <SpeakerPortrait
              characterId="arjun"
              expression="happy"
              pose={evaluation.percentage >= 80 ? 'celebrating' : 'reading'}
              animatePop={!prefersReducedMotion}
              popDelayMs={90}
            />
            <SpeakerPortrait
              characterId="shuka"
              expression={evaluation.percentage >= 80 ? 'celebrating' : 'explaining'}
              pose={evaluation.percentage >= 80 ? 'celebrating' : 'explaining'}
              animatePop={!prefersReducedMotion}
              popDelayMs={180}
            />
          </div>
        </div>

        {/* 3-Stat Breakdown */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-[14px] bg-[#D9FAF5] border border-[#A8E8DF] p-3 text-center space-y-0.5">
            <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#0E5A42]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Correct</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-[#263A70] tabular-nums">
              {evaluation.correctCount}
            </p>
          </div>

          <div className="rounded-[14px] bg-[#FEE8E7] border border-[#F7C2BF] p-3 text-center space-y-0.5">
            <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#9E2A25]">
              <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Incorrect</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-[#263A70] tabular-nums">
              {evaluation.incorrectCount}
            </p>
          </div>

          <div className="rounded-[14px] bg-[#FFF1D5] border border-[#F2DFB6] p-3 text-center space-y-0.5">
            <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#8C4D00]">
              <MinusCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Skipped</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-[#263A70] tabular-nums">
              {evaluation.unansweredCount}
            </p>
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="rounded-[16px] bg-[#FDFCF9] border border-[#E5E2D9] p-3.5 sm:p-4 space-y-1">
          <h3 className="font-heading text-base font-semibold text-[#263A70]">
            {feedback.headline}
          </h3>
          <p className="text-sm text-[#333333] leading-relaxed">{feedback.message}</p>
        </div>

        {/* Read-only Persistence Confirmation */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E5E2D9] text-xs text-[#4B5C8A]">
          <Lock className="w-3.5 h-3.5 text-[#1FA89A] shrink-0" aria-hidden="true" />
          <span>
            {formattedTime
              ? `Submitted ${formattedTime} · Read-only result saved on this device.`
              : 'Submitted · Read-only result saved on this device.'}
          </span>
        </div>
      </section>

      {/* Targeted Revision Recommendations */}
      <RevisionRecommendations
        recommendations={evaluation.revisionRecommendations}
        onRevisitStage={onRevisitStage}
      />

      {/* Per-Question Answer Review */}
      <AnswerReview questionResults={evaluation.questionResults} />

      {/* Region E: Reserved Bottom Navigation Actions */}
      {onReviewLesson || onBackToMission || onBackToHome ? (
        <AppShellFooter>
          <div className="max-w-[920px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
            {onReviewLesson || onBackToMission ? (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={onReviewLesson ?? onBackToMission}
              >
                Review Lesson
              </Button>
            ) : (
              <span />
            )}
            {onBackToHome ? (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Home className="w-4 h-4" />}
                onClick={onBackToHome}
              >
                Back to Home
              </Button>
            ) : null}
          </div>
        </AppShellFooter>
      ) : null}
    </div>
  );
};
