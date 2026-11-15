/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE ASSESSMENT HEADER
 * ============================================================================
 * Displays assessment title, module/class context, current question position,
 * answered count progress, and read-only lock badge after submission.
 * Never exposes correctness details prior to submission.
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, ClipboardCheck, Lock } from 'lucide-react';
import type { ClassLevel } from '../../../schemas/lesson.schema';

export interface AssessmentHeaderProps {
  title: string;
  missionTitle: string;
  classLevel: ClassLevel;
  currentQuestionNumber: number;
  totalQuestions: number;
  answeredCount: number;
  isSubmitted: boolean;
  onBackToMission?: () => void;
}

export const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({
  title,
  missionTitle,
  classLevel,
  currentQuestionNumber,
  totalQuestions,
  answeredCount,
  isSubmitted,
  onBackToMission,
}) => {
  const answeredPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <section
      aria-label="Assessment header"
      className="rounded-[20px] bg-white border border-[#E5E2D9] p-4 sm:p-5 space-y-3 shadow-[var(--gq-shadow-card)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-medium text-[#4B5C8A]">
            <span>{missionTitle}</span>
            <span aria-hidden="true">·</span>
            <span>Class {classLevel}</span>
          </div>
          <h2 className="font-heading text-lg sm:text-xl font-semibold text-[#263A70] leading-snug">
            {title}
          </h2>
        </div>

        {isSubmitted ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] bg-[#D9FAF5] border border-[#65D8CA] text-xs font-semibold text-[#0E5A42] whitespace-nowrap shrink-0">
            <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Submitted · Read-only</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] bg-[#FFF1D5] border border-[#F2DFB6] text-xs font-semibold text-[#263A70] whitespace-nowrap shrink-0 tabular-nums">
            <ClipboardCheck className="w-3.5 h-3.5 shrink-0 text-[#C46B00]" aria-hidden="true" />
            <span>
              Question {currentQuestionNumber} of {totalQuestions}
            </span>
          </div>
        )}
      </div>

      {!isSubmitted ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#4B5C8A] tabular-nums">
            <span>
              {answeredCount} of {totalQuestions} answered
            </span>
            <span>{answeredPercent}% answered</span>
          </div>
          <div
            aria-hidden="true"
            className="h-2 w-full rounded-full bg-[#F2EFE7] overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-[#263A70] transition-all duration-200"
              style={{ width: `${answeredPercent}%` }}
            />
          </div>
        </div>
      ) : null}

      {onBackToMission ? (
        <div className="pt-0.5">
          <button
            type="button"
            onClick={onBackToMission}
            className="inline-flex items-center gap-1.5 min-h-[44px] -ml-1 px-2 text-xs sm:text-sm font-semibold text-[#263A70] hover:underline rounded-[10px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263A70]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Back to Mission Stages</span>
          </button>
        </div>
      ) : null}
    </section>
  );
};
