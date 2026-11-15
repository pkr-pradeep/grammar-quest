/**
 * ============================================================================
 * GRAMMAR QUEST — ASSESSMENT RUNNER ORCHESTRATOR
 * ============================================================================
 * Coordinates IndexedDB persistence, pre-submission sanitized question flow,
 * explicit confirmation modal, one-time read-only submission lock, and
 * post-submission results & revision jumps.
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type {
  AssessmentAttemptRecord,
  AssessmentDefinition,
  RecommendedMissionStage,
} from '../../../schemas/assessment.schema';
import {
  loadAssessmentAttempt,
  saveInProgressAssessmentAttempt,
  submitAssessmentAttempt,
} from '../../../storage/assessmentRepository';
import { evaluateAssessment, sanitizeQuestionForStudent } from '../scoring';
import { AssessmentHeader } from './AssessmentHeader';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigator } from './QuestionNavigator';
import { SubmissionConfirmation } from './SubmissionConfirmation';
import { AssessmentResults } from './AssessmentResults';

export interface AssessmentRunnerProps {
  assessment: AssessmentDefinition;
  onRevisitStage: (stage: RecommendedMissionStage, stepNumber?: number) => void;
  onBackToMission?: () => void;
  onBackToHome?: () => void;
  onAssessmentSubmitted?: (attempt: AssessmentAttemptRecord) => void;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({
  assessment,
  onRevisitStage,
  onBackToMission,
  onBackToHome,
  onAssessmentSubmitted,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState<AssessmentAttemptRecord | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setIsConfirmOpen(false);

    loadAssessmentAttempt(assessment.missionId).then((res) => {
      if (!active) return;
      if (res.attempt) {
        setAttempt(res.attempt);
        setSelectedAnswers(res.attempt.selectedAnswers ?? {});
        const safeIdx = Math.max(
          0,
          Math.min(
            res.attempt.currentQuestionIndex ?? 0,
            Math.max(0, assessment.questions.length - 1),
          ),
        );
        setCurrentIndex(safeIdx);
      } else {
        setAttempt(null);
        setSelectedAnswers({});
        setCurrentIndex(0);
      }
      setStorageWarning(res.storageAvailable ? null : res.storageMessage ?? null);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [assessment.missionId, assessment.questions.length]);

  const sanitizedQuestions = useMemo(
    () => assessment.questions.map(sanitizeQuestionForStudent),
    [assessment.questions],
  );

  const questionIds = useMemo(
    () => sanitizedQuestions.map((q) => q.id),
    [sanitizedQuestions],
  );

  const isSubmitted = attempt?.status === 'submitted';

  const answeredCount = useMemo(
    () => questionIds.filter((id) => Boolean(selectedAnswers[id])).length,
    [questionIds, selectedAnswers],
  );

  // Only compute official evaluation strictly AFTER submission
  const evaluation = useMemo(() => {
    if (!isSubmitted || !attempt) return null;
    return evaluateAssessment(assessment, attempt.selectedAnswers);
  }, [isSubmitted, attempt, assessment]);

  const persistDraft = async (
    nextAnswers: Record<string, string>,
    nextIndex: number,
  ) => {
    if (isSubmitted) return;
    const result = await saveInProgressAssessmentAttempt(
      assessment,
      nextAnswers,
      nextIndex,
      attempt,
    );
    if (result.attempt) {
      setAttempt(result.attempt);
    }
    if (!result.storageAvailable && result.storageMessage) {
      setStorageWarning(result.storageMessage);
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    const currentQuestion = sanitizedQuestions[currentIndex];
    if (!currentQuestion) return;

    const nextAnswers = {
      ...selectedAnswers,
      [currentQuestion.id]: optionId,
    };
    setSelectedAnswers(nextAnswers);
    void persistDraft(nextAnswers, currentIndex);
  };

  const handleMoveToQuestion = (nextIndex: number) => {
    if (isSubmitted) return;
    const clamped = Math.max(0, Math.min(nextIndex, sanitizedQuestions.length - 1));
    setCurrentIndex(clamped);
    void persistDraft(selectedAnswers, clamped);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirmOpen(false);
    const result = await submitAssessmentAttempt(
      assessment,
      selectedAnswers,
      currentIndex,
      attempt,
    );
    if (result.attempt) {
      setAttempt(result.attempt);
      setSelectedAnswers(result.attempt.selectedAnswers);
      onAssessmentSubmitted?.(result.attempt);
    }
    if (!result.storageAvailable && result.storageMessage) {
      setStorageWarning(result.storageMessage);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[20px] bg-white border border-[#E5E2D9] p-6 text-sm text-[#4B5C8A]">
        Loading assessment…
      </div>
    );
  }

  const currentQuestion = sanitizedQuestions[currentIndex] ?? sanitizedQuestions[0];

  return (
    <div className="space-y-4">
      {storageWarning ? (
        <div
          role="status"
          className="rounded-[14px] bg-[#FFF1D5] border border-[#F2DFB6] px-4 py-3 flex items-start gap-2.5 text-xs sm:text-sm text-[#263A70]"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C46B00] mt-0.5" aria-hidden="true" />
          <span>{storageWarning}</span>
        </div>
      ) : null}

      <AssessmentHeader
        title={assessment.title}
        missionTitle={assessment.missionTitle}
        classLevel={assessment.classLevel}
        currentQuestionNumber={currentIndex + 1}
        totalQuestions={sanitizedQuestions.length}
        answeredCount={answeredCount}
        isSubmitted={isSubmitted}
        onBackToMission={onBackToMission}
      />

      {isSubmitted && evaluation && attempt ? (
        <AssessmentResults
          evaluation={evaluation}
          attempt={attempt}
          onRevisitStage={onRevisitStage}
          onBackToMission={onBackToMission}
          onBackToHome={onBackToHome}
        />
      ) : currentQuestion ? (
        <>
          <p className="text-xs sm:text-sm text-[#4B5C8A] px-1">
            {assessment.subtitle}
          </p>

          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={sanitizedQuestions.length}
            selectedOptionId={selectedAnswers[currentQuestion.id] ?? null}
            onSelectOption={handleSelectOption}
          />

          <QuestionNavigator
            questionIds={questionIds}
            currentIndex={currentIndex}
            selectedAnswers={selectedAnswers}
            onJumpToQuestion={handleMoveToQuestion}
            onPrevious={() => handleMoveToQuestion(currentIndex - 1)}
            onNext={() => handleMoveToQuestion(currentIndex + 1)}
            onRequestSubmit={() => setIsConfirmOpen(true)}
          />

          <SubmissionConfirmation
            isOpen={isConfirmOpen}
            totalQuestions={sanitizedQuestions.length}
            answeredCount={answeredCount}
            onCancel={() => setIsConfirmOpen(false)}
            onConfirmSubmit={() => void handleConfirmSubmit()}
          />
        </>
      ) : null}
    </div>
  );
};
