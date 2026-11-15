/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE ANSWER REVIEW COMPONENT
 * ============================================================================
 * Displays post-submission per-question review including question text,
 * student's selected answer, correct answer, explanation, and learning
 * objective tested. Always pairs colour with explicit icon + text status.
 * ============================================================================
 */

import React, { useMemo, useState } from 'react';
import { CheckCircle2, MinusCircle, XCircle } from 'lucide-react';
import type { EvaluatedQuestionResult } from '../../../schemas/assessment.schema';

export interface AnswerReviewProps {
  questionResults: EvaluatedQuestionResult[];
}

type ReviewFilter = 'all' | 'missed' | 'correct';

export const AnswerReview: React.FC<AnswerReviewProps> = ({ questionResults }) => {
  const [filter, setFilter] = useState<ReviewFilter>('all');

  const counts = useMemo(() => {
    const correct = questionResults.filter((r) => r.isCorrect).length;
    const missed = questionResults.length - correct;
    return { all: questionResults.length, missed, correct };
  }, [questionResults]);

  const visibleResults = useMemo(() => {
    if (filter === 'missed') return questionResults.filter((r) => !r.isCorrect);
    if (filter === 'correct') return questionResults.filter((r) => r.isCorrect);
    return questionResults;
  }, [questionResults, filter]);

  return (
    <section
      aria-labelledby="answer-review-heading"
      className="rounded-[20px] bg-white border border-[#E5E2D9] p-4 sm:p-6 space-y-4 shadow-[var(--gq-shadow-card)]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3
            id="answer-review-heading"
            className="font-heading text-base sm:text-lg font-semibold text-[#263A70]"
          >
            Question-by-Question Review
          </h3>
          <p className="text-xs sm:text-sm text-[#4B5C8A]">
            Inspect every answer, the correct choice, and why it works.
          </p>
        </div>

        {/* Interactive Filter Segmented Bar */}
        <div
          role="tablist"
          aria-label="Filter reviewed questions"
          className="grid grid-cols-3 gap-1 p-1 rounded-[12px] bg-[#F5F2EA] border border-[#E5E2D9] w-full sm:w-auto"
        >
          {(
            [
              { id: 'all', label: `All (${counts.all})` },
              { id: 'missed', label: `Review (${counts.missed})` },
              { id: 'correct', label: `Correct (${counts.correct})` },
            ] as { id: ReviewFilter; label: string }[]
          ).map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={[
                  'min-h-[38px] px-2.5 py-1.5 rounded-[9px] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer tabular-nums',
                  active
                    ? 'bg-white text-[#263A70] shadow-xs'
                    : 'text-[#4B5C8A] hover:text-[#263A70]',
                ].join(' ')}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {visibleResults.length === 0 ? (
        <div className="rounded-[14px] bg-[#FDFCF9] border border-[#E5E2D9] p-4 text-sm text-[#4B5C8A]">
          No questions match this filter.
        </div>
      ) : (
        <ol className="space-y-3">
          {visibleResults.map((item) => {
            const statusConfig = item.isCorrect
              ? {
                  label: 'Correct',
                  Icon: CheckCircle2,
                  badgeClass: 'bg-[#D9FAF5] text-[#0E5A42] border-[#65D8CA]',
                  cardClass: 'bg-[#FDFCF9] border-[#E5E2D9]',
                }
              : !item.isAnswered
                ? {
                    label: 'Unanswered',
                    Icon: MinusCircle,
                    badgeClass: 'bg-[#FFF1D5] text-[#8C4D00] border-[#EAB030]',
                    cardClass: 'bg-[#FFFDF8] border-[#F2DFB6]',
                  }
                : {
                    label: 'Incorrect',
                    Icon: XCircle,
                    badgeClass: 'bg-[#FEE8E7] text-[#9E2A25] border-[#F7C2BF]',
                    cardClass: 'bg-[#FFF9F9] border-[#F7C2BF]',
                  };

            const StatusIcon = statusConfig.Icon;

            return (
              <li
                key={item.questionId}
                className={`rounded-[16px] border p-3.5 sm:p-4 space-y-2.5 ${statusConfig.cardClass}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#4B5C8A]">
                    <span className="font-semibold text-[#263A70] tabular-nums">
                      Question {item.questionNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.learningObjective}</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] border text-xs font-semibold whitespace-nowrap ${statusConfig.badgeClass}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{statusConfig.label}</span>
                  </span>
                </div>

                <p className="text-sm sm:text-[15px] font-semibold text-[#263A70] leading-snug">
                  {item.questionText}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm pt-0.5">
                  <div className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="font-semibold text-[#4B5C8A] shrink-0">
                      Your answer:
                    </span>
                    <span
                      className={
                        item.isCorrect
                          ? 'font-medium text-[#0E5A42]'
                          : !item.isAnswered
                            ? 'font-medium text-[#8C4D00]'
                            : 'font-medium text-[#9E2A25]'
                      }
                    >
                      {item.selectedOptionText ?? 'Not answered'}
                    </span>
                  </div>

                  {!item.isCorrect ? (
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-semibold text-[#4B5C8A] shrink-0">
                        Correct answer:
                      </span>
                      <span className="font-semibold text-[#0E5A42]">
                        {item.correctOptionText}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-[12px] bg-white border border-[#E5E2D9] px-3 py-2.5 text-xs sm:text-sm text-[#333333] leading-relaxed">
                  <span className="font-semibold text-[#263A70]">Why: </span>
                  {item.explanation}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};
