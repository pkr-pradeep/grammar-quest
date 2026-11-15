/**
 * ============================================================================
 * GRAMMAR QUEST — CARD COMPONENT
 * ============================================================================
 * Consistent rounded container with restrained single-level elevation,
 * balanced padding, and semantic surface tints (white, warm cream, turquoise).
 * ============================================================================
 */

import React from 'react';

export type CardSurface = 'white' | 'cream' | 'turquoise';
export type CardPadding = 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: CardSurface;
  padding?: CardPadding;
  elevated?: boolean;
}

const SURFACE_CLASSES: Record<CardSurface, string> = {
  white: 'bg-white border border-[#E5E2D9]',
  cream: 'bg-[#FFF1D5] border border-[#F2DFB6]',
  turquoise: 'bg-[#D9FAF5] border border-[#A8E8DF]',
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export const Card: React.FC<CardProps> = ({
  surface = 'white',
  padding = 'md',
  elevated = false,
  className = '',
  children,
  ...rest
}) => {
  return (
    <div
      className={[
        'rounded-[20px]',
        SURFACE_CLASSES[surface],
        PADDING_CLASSES[padding],
        elevated
          ? 'shadow-[var(--gq-shadow-elevated)]'
          : 'shadow-[var(--gq-shadow-card)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
};
