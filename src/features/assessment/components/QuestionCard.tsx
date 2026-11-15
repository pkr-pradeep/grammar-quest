/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE QUESTION CARD COMPONENT
 * ============================================================================
 * Renders a single sanitized StudentQuestionView and its AnswerOption list.
 * Never receives correctOptionId or explanation, guaranteeing pre-submission
 * integrity inside the active quiz UI.
 * ============================================================================
 */

import React from 'react';
import type { StudentQuestionView } from '../../../schemas/assessment.schema';
import { AnswerOption } from './AnswerOption';

export interface QuestionCardProps {
  question: StudentQuestionView;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  disabled?: boolean;
  onSelectOption: (optionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  disabled = false,
  onSelectOption,
}) => {
  const headingId = `assessment-question-${question.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-[20px] bg-white border border-[#E5E2D9] p-4 sm:p-6 space-y-4 shadow-[var(--gq-shadow-card)]"
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-medium text-[#4B5C8A]">
          <span className="font-semibold text-[#C46B00] tabular-nums">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span aria-hidden="true">·</span>
          <span>{question.learningObjective}</span>
        </div>

        <h3
          id={headingId}
          className="font-heading text-base sm:text-lg font-semibold text-[#263A70] leading-snug"
        >
          {question.questionText}
        </h3>
      </div>

      <div
        role="radiogroup"
        aria-labelledby={headingId}
        className="flex flex-col gap-2.5"
      >
        {question.options.map((option, index) => (
          <AnswerOption
            key={option.id}
            optionId={option.id}
            optionIndex={index}
            text={option.text}
            isSelected={selectedOptionId === option.id}
            disabled={disabled}
            onSelect={onSelectOption}
          />
        ))}
      </div>
    </section>
  );
};
