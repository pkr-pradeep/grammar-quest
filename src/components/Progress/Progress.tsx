/**
 * ============================================================================
 * GRAMMAR QUEST — PROGRESS COMPONENT
 * ============================================================================
 * Accessible linear progress bar with tabular numeric counter and smooth
 * reduced-motion-safe fill transitions.
 * ============================================================================
 */

import React from 'react';
import { motion } from 'motion/react';

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  summaryText?: string;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label = 'Learning progress',
  summaryText,
  className = '',
}) => {
  const safeMax = max > 0 ? max : 100;
  const clampedValue = Math.min(Math.max(0, value), safeMax);
  const percentage = Math.round((clampedValue / safeMax) * 100);

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      {(label || summaryText) && (
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <span className="text-sm font-semibold text-[#263A70]">{label}</span>
          <span className="text-sm font-semibold text-[#263A70] tabular-nums">
            {summaryText ?? `${percentage}%`}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        className="w-full h-3 rounded-full bg-[#EFECE3] overflow-hidden border border-[#E5E2D9]"
      >
        <motion.div
          className="h-full rounded-full bg-[#24B5A5]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
};
