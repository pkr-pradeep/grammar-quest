/**
 * ============================================================================
 * GRAMMAR QUEST — BADGE COMPONENT
 * ============================================================================
 * Restrained semantic label indicator. Uses readable Deep Navy (#263A70)
 * contrast on bright/soft tints and supports icon pairing so colour is never
 * the sole carrier of meaning.
 * ============================================================================
 */

import React from 'react';

export type BadgeTone = 'neutral' | 'sunshine' | 'turquoise' | 'coral' | 'navy';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: React.ReactNode;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-[#F5F2EA] text-[#263A70] border border-[#E5E2D9]',
  sunshine: 'bg-[#FFC64B] text-[#263A70] border border-[#EAB030]',
  turquoise: 'bg-[#8DECE0] text-[#263A70] border border-[#65D8CA]',
  coral: 'bg-[#FEE8E7] text-[#9E2A25] border border-[#F7C2BF]',
  navy: 'bg-[#263A70] text-white border border-[#263A70]',
};

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  icon,
  className = '',
  children,
  ...rest
}) => {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px]',
        'text-xs font-semibold leading-none whitespace-nowrap',
        TONE_CLASSES[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {icon ? <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
    </span>
  );
};
