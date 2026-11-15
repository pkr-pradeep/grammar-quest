/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE ANSWER OPTION COMPONENT
 * ============================================================================
 * Touch-friendly (>= 48px) multiple-choice option row.
 * Uses strictly neutral selected styling prior to submission—no correctness
 * colours, icons, or hints are ever displayed during active testing.
 * ============================================================================
 */

import React from 'react';

export interface AnswerOptionProps {
  optionId: string;
  optionIndex: number;
  text: string;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  optionId,
  optionIndex,
  text,
  isSelected,
  disabled = false,
  onSelect,
}) => {
  const letter = OPTION_LETTERS[optionIndex] ?? String(optionIndex + 1);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={disabled}
      onClick={() => onSelect(optionId)}
      className={[
        'w-full min-h-[48px] px-3.5 py-3 rounded-[14px] border text-left',
        'flex items-start gap-3 transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263A70]',
        disabled ? 'cursor-default opacity-80' : 'cursor-pointer',
        isSelected
          ? 'bg-[#FFF1D5] border-[#263A70] ring-1 ring-[#263A70]'
          : 'bg-[#FDFCF9] border-[#E5E2D9] hover:bg-[#FFF9EC] hover:border-[#CFC9BA]',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'w-7 h-7 rounded-[8px] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors',
          isSelected
            ? 'bg-[#263A70] text-white'
            : 'bg-[#F5F2EA] text-[#263A70] border border-[#E5E2D9]',
        ].join(' ')}
      >
        {letter}
      </span>

      <span className="flex-1 text-sm sm:text-[15px] font-medium text-[#263A70] leading-snug pt-0.5">
        {text}
      </span>
    </button>
  );
};
