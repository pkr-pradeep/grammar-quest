/**
 * ============================================================================
 * GRAMMAR QUEST — WORD GROUP COMPONENT
 * ============================================================================
 * Groups sentence tokens visually into Subject or Predicate zones with explicit
 * icon + text badges and optional textbook rule disclosure.
 * ============================================================================
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Layers, MessageSquare } from 'lucide-react';
import type { SentenceToken, WordGroupRole } from '../../../schemas/grammarEngine.schema';
import { GROUP_ROLE_META } from '../categoryMeta';

export interface WordGroupProps {
  role: WordGroupRole;
  tokens: SentenceToken[];
  questionPrompt?: string;
  explanation?: string;
  headWord?: string;
  isActive?: boolean;
  onSelectGroup?: (role: WordGroupRole) => void;
}

export const WordGroup: React.FC<WordGroupProps> = ({
  role,
  tokens,
  questionPrompt,
  explanation,
  headWord,
  isActive = false,
  onSelectGroup,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const meta = GROUP_ROLE_META[role];
  const Icon = role === 'subject' ? Layers : MessageSquare;

  return (
    <motion.div
      layout={!prefersReducedMotion}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'rounded-[16px] border-2 p-3.5 sm:p-4 space-y-2.5 transition-shadow duration-150',
        meta.bgClass,
        meta.borderClass,
        isActive ? 'ring-2 ring-[#263A70]/25 shadow-sm' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelectGroup?.(role)}
          className={[
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-semibold min-h-[32px]',
            'cursor-pointer whitespace-nowrap',
            meta.badgeBgClass,
          ].join(' ')}
        >
          <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{meta.label}</span>
        </button>

        <span className="text-xs font-medium text-[#4B5C8A]">
          {questionPrompt ?? meta.questionCue}
        </span>
      </div>

      {/* Grouped Words */}
      <div className="flex flex-wrap items-center gap-1.5">
        {tokens.map((t) => (
          <span
            key={t.id}
            className={[
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-[10px] bg-white border text-sm sm:text-base font-semibold text-[#263A70]',
              t.isHeadWord ? 'border-[#263A70]' : 'border-[#E5E2D9]',
            ].join(' ')}
          >
            <span>
              {t.text}
              {t.punctuationAfter ?? ''}
            </span>
            {t.isHeadWord ? (
              <span className="text-[10px] font-semibold text-[#A15C00]">Head</span>
            ) : null}
          </span>
        ))}
      </div>

      {explanation ? (
        <p className="text-xs sm:text-sm text-[#333333] leading-snug">{explanation}</p>
      ) : null}

      {headWord ? (
        <p className="text-xs font-medium text-[#4B5C8A]">
          Core word: <span className="font-semibold text-[#263A70]">{headWord}</span>
        </p>
      ) : null}
    </motion.div>
  );
};
