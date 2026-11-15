/**
 * ============================================================================
 * GRAMMAR QUEST — PERSISTENT BOTTOM LESSON NAVIGATION (ZONE E)
 * ============================================================================
 * Single-row, 360px-safe persistent bottom bar holding Back, Pause/Resume,
 * Replay, and Next / Open Word Lab with >= 44px touch targets.
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';

export interface LessonNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  isPaused: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePause: () => void;
  onReplay: () => void;
  nextLabel?: string;
  nudgeNextArrow?: boolean;
}

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  currentStepIndex,
  totalSteps,
  isPaused,
  onPrevious,
  onNext,
  onTogglePause,
  onReplay,
  nextLabel,
  nudgeNextArrow = false,
}) => {
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex >= totalSteps - 1;

  return (
    <nav
      aria-label="Lesson step navigation"
      className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#E5E2D9] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-[920px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Previous */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          aria-label="Previous step"
          className={[
            'inline-flex items-center justify-center gap-1 min-h-[44px] px-2.5 sm:px-3.5 rounded-[12px] border text-xs sm:text-sm font-medium whitespace-nowrap transition-colors',
            isFirst
              ? 'border-[#E5E2D9] bg-[#F8F6F0] text-[#9BA5BF] cursor-not-allowed'
              : 'border-[#CFC9BA] bg-white text-[#263A70] hover:bg-[#F5F2EA] cursor-pointer',
          ].join(' ')}
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Back</span>
        </button>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onTogglePause}
            aria-pressed={isPaused}
            aria-label={isPaused ? 'Resume animations' : 'Pause animations'}
            className={[
              'inline-flex items-center justify-center gap-1 min-h-[44px] px-2.5 sm:px-3 rounded-[12px] border text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
              isPaused
                ? 'border-[#F59B19] bg-[#FFF1D5] text-[#263A70]'
                : 'border-[#CFC9BA] bg-white text-[#263A70] hover:bg-[#F5F2EA]',
            ].join(' ')}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReplay}
            aria-label="Replay step animation"
            className="inline-flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] px-2.5 sm:px-3 rounded-[12px] border border-[#CFC9BA] bg-white text-xs font-medium text-[#263A70] hover:bg-[#F5F2EA] whitespace-nowrap transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>

        {/* Next / Finish Teaching Sequence */}
        <button
          type="button"
          onClick={onNext}
          className={[
            'inline-flex items-center justify-center gap-1 min-h-[44px] px-3 sm:px-4 rounded-[12px] text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer',
            isLast
              ? 'bg-[#FFC64B] hover:bg-[#FFB824] text-[#263A70]'
              : 'bg-[#263A70] hover:bg-[#1E2F5C] text-white',
          ].join(' ')}
        >
          <span>{nextLabel ?? (isLast ? 'Word Lab' : 'Next')}</span>
          <ArrowRight
            className={['w-4 h-4 shrink-0', nudgeNextArrow ? 'gq-story-arrow-nudge' : '']
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          />
        </button>
      </div>
    </nav>
  );
};
