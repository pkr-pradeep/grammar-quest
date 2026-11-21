/**
 * ============================================================================
 * GRAMMAR QUEST — WORD TOKEN COMPONENT
 * ============================================================================
 * Interactive, touch-friendly (>= 44px) word unit displaying word text,
 * accessible category icon + label, spotlight head-word marker, and dimmed
 * state when highlighting surrounding core words.
 * ============================================================================
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { SentenceToken, WordGroupRole } from '../../../schemas/grammarEngine.schema';
import { GRAMMATICAL_CATEGORY_META } from '../categoryMeta';

export interface WordTokenProps {
  token: SentenceToken;
  index: number;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isSpotlightHead?: boolean;
  isDimmed?: boolean;
  highlightedGroupRole?: WordGroupRole | null;
  showCategoryBadge?: boolean;
  showHeadWordMarker?: boolean;
  animateEntrance?: boolean;
  isPaused?: boolean;
  onSelect?: (token: SentenceToken) => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}

export const WordToken: React.FC<WordTokenProps> = ({
  token,
  index,
  isSelected = false,
  isHighlighted = false,
  isSpotlightHead = false,
  isDimmed = false,
  highlightedGroupRole = null,
  showCategoryBadge = true,
  showHeadWordMarker = false,
  animateEntrance = true,
  isPaused = false,
  onSelect,
  buttonRef,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const catMeta = GRAMMATICAL_CATEGORY_META[token.category];

  const matchesGroupHighlight =
    highlightedGroupRole !== null && token.groupRole === highlightedGroupRole;

  const isSubjectHighlight = matchesGroupHighlight && token.groupRole === 'subject';
  const isPredicateHighlight = matchesGroupHighlight && token.groupRole === 'predicate';

  const containerStyle: React.CSSProperties = isSpotlightHead
    ? {
        backgroundColor: '#FFF4D6',
        borderColor: '#263A70',
        color: '#263A70',
      }
    : isSelected || isHighlighted
      ? {
          backgroundColor: catMeta.bgVar,
          borderColor: '#263A70',
          color: '#263A70',
        }
      : isSubjectHighlight
        ? {
            backgroundColor: '#FFF4D6',
            borderColor: '#F59B19',
            color: '#263A70',
          }
        : isPredicateHighlight
          ? {
              backgroundColor: '#D9FAF5',
              borderColor: '#1FA89A',
              color: '#263A70',
            }
          : {
              backgroundColor: '#FFFFFF',
              borderColor: '#CFC9BA',
              color: '#263A70',
            };

  const shouldAnimate = animateEntrance && !prefersReducedMotion && !isPaused;

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={() => onSelect?.(token)}
      initial={shouldAnimate ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: isDimmed ? 0.62 : 1, y: 0, scale: isSpotlightHead ? 1.04 : 1 }}
      transition={
        shouldAnimate
          ? { duration: 0.18, delay: Math.min(index * 0.045, 0.3), ease: [0.22, 1, 0.36, 1] }
          : { duration: 0 }
      }
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      aria-pressed={isSelected}
      aria-label={`${token.text}, ${catMeta.label}${token.isHeadWord ? ', Head word' : ''}`}
      style={containerStyle}
      className={[
        'group relative inline-flex flex-col items-center justify-center',
        'min-h-[44px] min-w-[44px] px-2.5 sm:px-3 py-1.5 rounded-[12px] border-2',
        'transition-colors duration-150 select-none cursor-pointer touch-manipulation',
        isSpotlightHead
          ? 'ring-3 ring-[#F59B19]/45 shadow-sm'
          : isSelected || isHighlighted
            ? 'ring-2 ring-[#263A70]/25 shadow-xs'
            : 'hover:border-[#263A70]',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isSpotlightHead ? (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-[6px] bg-[#263A70] text-white text-[9px] font-semibold tracking-wide uppercase whitespace-nowrap">
          Core
        </span>
      ) : null}

      <span className="text-[15px] sm:text-base font-semibold leading-tight text-[#263A70] whitespace-nowrap">
        {token.text}
        {token.punctuationAfter ? (
          <span className="text-[#4B5C8A] font-normal">{token.punctuationAfter}</span>
        ) : null}
      </span>

      {showCategoryBadge ? (
        <span
          style={{ color: catMeta.fgVar }}
          className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold leading-none whitespace-nowrap"
        >
          <span aria-hidden="true">{catMeta.symbol}</span>
          <span>{catMeta.shortLabel}</span>
          {showHeadWordMarker && token.isHeadWord ? (
            <span className="text-[#263A70] font-semibold">· Head</span>
          ) : null}
        </span>
      ) : null}
    </motion.button>
  );
};
