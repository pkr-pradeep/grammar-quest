/**
 * ============================================================================
 * GRAMMAR QUEST — PRACTICE FEEDBACK COMPONENT
 * ============================================================================
 * Immediate, non-shaming explanatory feedback for guided practice activities.
 * Strictly separate from future post-submit assessment review behaviour.
 * ============================================================================
 */

import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';
import { playLearningFeedback } from '../../../services/feedback/feedbackService';

export interface PracticeFeedbackProps {
  status: 'correct' | 'try-again' | 'info';
  title: string;
  message: string;
}

export const PracticeFeedback: React.FC<PracticeFeedbackProps> = ({
  status,
  title,
  message,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const lastCueRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === 'info') return;
    const cueKey = `${status}:${title}:${message}`;
    if (lastCueRef.current === cueKey) return;
    lastCueRef.current = cueKey;
    playLearningFeedback(status === 'correct' ? 'correct' : 'incorrect');
  }, [message, status, title]);

  const styles =
    status === 'correct'
      ? 'bg-[#D9FAF5] border-[#65D8CA] text-[#263A70]'
      : status === 'try-again'
        ? 'bg-[#FEE8E7] border-[#F7C2BF] text-[#263A70]'
        : 'bg-[#FFF1D5] border-[#F2DFB6] text-[#263A70]';

  const Icon = status === 'correct' ? CheckCircle2 : Info;
  const iconColor =
    status === 'correct'
      ? 'text-[#0F766E]'
      : status === 'try-again'
        ? 'text-[#9E2A25]'
        : 'text-[#A15C00]';

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[14px] border p-3.5 flex items-start gap-2.5 ${styles}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
      <div className="space-y-0.5 min-w-0">
        <p className="text-sm font-semibold text-[#263A70]">{title}</p>
        <p className="text-xs sm:text-sm text-[#333333] leading-snug">{message}</p>
      </div>
    </motion.div>
  );
};
