/**
 * ============================================================================
 * GRAMMAR QUEST — WORD TILE COMPONENT
 * ============================================================================
 * Tactile, touch-friendly (>= 44px) interactive tile used across Sentence
 * Construction, Categorisation, and Word Replacement activities.
 * ============================================================================
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { GrammaticalCategory } from '../../../schemas/grammarEngine.schema';
import { GRAMMATICAL_CATEGORY_META } from '../categoryMeta';

export interface WordTileProps {
  text: string;
  category?: GrammaticalCategory;
  isSelected?: boolean;
  isDisabled?: boolean;
  tone?: 'default' | 'subject' | 'predicate' | 'active';
  onClick?: () => void;
  ariaLabel?: string;
}

const TONE_CLASSES: Record<NonNullable<WordTileProps['tone']>, string> = {
  default: 'bg-white border-[#CFC9BA] text-[#263A70] hover:border-[#263A70]',
  subject: 'bg-[#FFF4D6] border-[#F59B19] text-[#263A70]',
  predicate: 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]',
  active: 'bg-[#FFC64B] border-[#263A70] text-[#263A70]',
};

export const WordTile: React.FC<WordTileProps> = ({
  text,
  category,
  isSelected = false,
  isDisabled = false,
  tone = 'default',
  onClick,
  ariaLabel,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const catMeta = category ? GRAMMATICAL_CATEGORY_META[category] : null;

  return (
    <motion.button
      layout={!prefersReducedMotion}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-label={ariaLabel ?? text}
      whileTap={isDisabled || prefersReducedMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.14 }}
      className={[
        'inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-[14px] border-2',
        'text-sm sm:text-base font-medium transition-colors duration-150 select-none',
        isDisabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
        isSelected ? 'ring-2 ring-[#263A70]/30 border-[#263A70] bg-[#FFF4D6] text-[#263A70]' : TONE_CLASSES[tone],
      ].join(' ')}
    >
      <span>{text}</span>
      {catMeta ? (
        <span
          style={{ backgroundColor: catMeta.bgVar, color: catMeta.fgVar }}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] text-[11px] font-semibold"
        >
          <span aria-hidden="true">{catMeta.symbol}</span>
          <span>{catMeta.shortLabel}</span>
        </span>
      ) : null}
    </motion.button>
  );
};
