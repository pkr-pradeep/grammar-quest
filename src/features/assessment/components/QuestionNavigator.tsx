/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE QUESTION NAVIGATOR COMPONENT
 * ============================================================================
 * Allows free movement across all questions (Previous, Next, and numbered
 * jump buttons) while showing current, answered, and unanswered states without
 * revealing correctness. Never auto-submits when reaching the final question.
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Button } from '../../../components';

export interface QuestionNavigatorProps {
  questionIds: string[];
  currentIndex: number;
  selectedAnswers: Record<string, string>;
  hidePrimaryControls?: boolean;
  onJumpToQuestion: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onRequestSubmit: () => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questionIds,
  currentIndex,
  selectedAnswers,
  hidePrimaryControls = false,
  onJumpToQuestion,
  onPrevious,
  onNext,
  onRequestSubmit,
}) => {
  const totalQuestions = questionIds.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= totalQuestions - 1;
  const answeredCount = questionIds.filter((id) => Boolean(selectedAnswers[id])).length;

  return (
    <section
      aria-label="Question navigation and submission"
      className="rounded-[20px] bg-white border border-[#E5E2D9] p-4 sm:p-5 space-y-4 shadow-[var(--gq-shadow-card)]"
    >
      {/* Previous / Next Row (hidden when rendered in AppShellFooter) */}
      {!hidePrimaryControls ? (
        <div className="flex items-center justify-between gap-2.5">
          <Button
            variant="secondary"
            size="md"
            disabled={isFirst}
            onClick={onPrevious}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Previous
          </Button>

          {isLast ? (
            <Button
              variant="navy"
              size="md"
              onClick={onRequestSubmit}
              leftIcon={<Send className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
            >
              Review &amp; Submit
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={onNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
            >
              Next
            </Button>
          )}
        </div>
      ) : null}

      {/* Numbered Jump Grid (5 columns x 2 rows = 360px mobile-safe with >= 44px targets) */}
      <div className={hidePrimaryControls ? 'space-y-2' : 'space-y-2 pt-2 border-t border-[#E5E2D9]'}>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B5C8A]">
          <span className="font-semibold text-[#263A70]">Jump to question</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-[4px] bg-[#263A70] inline-block"
              />
              Current
            </span>
            <span className="inline-flex items-center gap-1">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-[4px] bg-[#FFC64B] border border-[#EAB030] inline-block"
              />
              Answered
            </span>
            <span className="inline-flex items-center gap-1">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-[4px] bg-white border border-[#CFC9BA] inline-block"
              />
              Unanswered
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {questionIds.map((qId, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = Boolean(selectedAnswers[qId]);
            const statusText = isCurrent
              ? 'current'
              : isAnswered
                ? 'answered'
                : 'unanswered';

            return (
              <button
                key={qId}
                type="button"
                onClick={() => onJumpToQuestion(idx)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Question ${idx + 1}, ${statusText}`}
                className={[
                  'min-h-[44px] rounded-[12px] border text-sm font-semibold tabular-nums',
                  'flex items-center justify-center relative transition-colors cursor-pointer',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263A70]',
                  isCurrent
                    ? 'bg-[#263A70] text-white border-[#263A70] shadow-xs'
                    : isAnswered
                      ? 'bg-[#FFF1D5] text-[#263A70] border-[#EAB030] hover:bg-[#FFE6B5]'
                      : 'bg-[#FDFCF9] text-[#4B5C8A] border-[#CFC9BA] hover:bg-[#F5F2EA] hover:text-[#263A70]',
                ].join(' ')}
              >
                <span>{idx + 1}</span>
                {isAnswered && !isCurrent ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1.5 w-3 h-0.5 rounded-full bg-[#C46B00]"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explicit Submit Action Always Available When Reviewing Any Question */}
      {!isLast ? (
        <div className="pt-2 border-t border-[#E5E2D9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <p className="text-xs text-[#4B5C8A] tabular-nums">
            {answeredCount === totalQuestions
              ? 'All questions answered. Review freely or submit when ready.'
              : `${totalQuestions - answeredCount} question${totalQuestions - answeredCount === 1 ? '' : 's'} still unanswered.`}
          </p>
          <Button
            variant="navy"
            size="sm"
            onClick={onRequestSubmit}
            leftIcon={<Send className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Review &amp; Submit Test
          </Button>
        </div>
      ) : null}
    </section>
  );
};
