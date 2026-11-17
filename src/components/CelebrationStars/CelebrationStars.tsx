/**
 * ============================================================================
 * GRAMMAR QUEST — POPPING CELEBRATION STARS
 * ============================================================================
 * Reusable 3-star celebration indicator using the staggered scale pop-in
 * animation (.gq-sort-star-pop) with reduced-motion and screen-reader support.
 * ============================================================================
 */

import React from 'react';
import { Star } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

export type CelebrationStarsSize = 'sm' | 'md' | 'lg';

export interface CelebrationStarsProps {
  stars: number;
  total?: number;
  size?: CelebrationStarsSize;
  mutedColorClass?: string;
  ariaLabel?: string;
  className?: string;
}

const SIZE_CLASSES: Record<CelebrationStarsSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const CelebrationStars: React.FC<CelebrationStarsProps> = ({
  stars,
  total = 3,
  size = 'md',
  mutedColorClass = 'fill-[#CFE8D9] text-[#8FB9A0]',
  ariaLabel,
  className = '',
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const clampedStars = Math.max(0, Math.min(stars, total));
  const resolvedLabel = ariaLabel ?? `${clampedStars} out of ${total} stars earned`;

  return (
    <div
      className={['inline-flex items-center gap-1 shrink-0', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={resolvedLabel}
    >
      {Array.from({ length: total }, (_, idx) => {
        const starIndex = idx + 1;
        const earned = starIndex <= clampedStars;
        return (
          <Star
            key={starIndex}
            aria-hidden="true"
            className={[
              SIZE_CLASSES[size],
              earned
                ? 'fill-[#F6B93B] text-[#C87F0A] gq-sort-star-pop'
                : mutedColorClass,
            ].join(' ')}
            style={
              earned && !prefersReducedMotion
                ? { animationDelay: `${idx * 0.18}s` }
                : undefined
            }
          />
        );
      })}
      <span className="sr-only">{resolvedLabel}</span>
    </div>
  );
};
