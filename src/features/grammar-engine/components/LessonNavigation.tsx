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
  fixed?: boolean;
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
    <nav aria-label="Lesson step navigation">
      <div className="max-w-[920px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        {/* Back */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          aria-label="Previous step"
          className={[
            'inline-flex items-center justify-center gap-1.5 min-h-[52px] px-3.5 rounded-[14px] border text-sm font-bold whitespace-nowrap transition-colors',
            'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
            isFirst
              ? 'border-[#E5E2D9] bg-[#F8F6F0] text-[#9BA5BF] cursor-not-allowed'
              : 'border-[#CFC9BA] bg-white text-[#1B2559] hover:bg-[#F5F2EA] cursor-pointer',
          ].join(' ')}
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Back</span>
        </button>

        {/* Compact Icon-Only Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePause}
            aria-pressed={isPaused}
            aria-label={isPaused ? 'Resume animations' : 'Pause animations'}
            className={[
              'inline-flex items-center justify-center min-h-[52px] min-w-[52px] rounded-[14px] border transition-colors cursor-pointer',
              'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
              isPaused
                ? 'border-[#F59B19] bg-[#FFF1D5] text-[#1B2559]'
                : 'border-[#CFC9BA] bg-white text-[#1B2559] hover:bg-[#F5F2EA]',
            ].join(' ')}
          >
            {isPaused ? (
              <Play className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
            ) : (
              <Pause className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onReplay}
            aria-label="Replay step animation"
            className="inline-flex items-center justify-center min-h-[52px] min-w-[52px] rounded-[14px] border border-[#CFC9BA] bg-white text-[#1B2559] hover:bg-[#F5F2EA] transition-colors cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
          >
            <RotateCcw className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Prominent Navy Next Button */}
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center gap-1.5 min-h-[52px] px-3.5 sm:px-5 rounded-[14px] bg-[#1B2559] hover:bg-[#141D47] text-white text-sm font-extrabold whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
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
