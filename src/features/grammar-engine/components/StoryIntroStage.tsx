/**
 * ============================================================================
 * GRAMMAR QUEST — STAGE 1: STORY INTRODUCTION (COURTYARD & NOTICEBOARD)
 * ============================================================================
 * Introduces the broken noticeboard problem in an Indian school courtyard with
 * Mira, Arjun, and Gyan. Short 3-beat dialogue with persistent Back, Pause,
 * Replay, and Next / Start Lesson controls so learners begin rapidly.
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FastForward, Wind } from 'lucide-react';
import type { MissionStoryIntro } from '../../../schemas/grammarEngine.schema';
import {
  CHARACTER_MASTERS,
  CourtyardNoticeboardScene,
} from '../../../components';
import { LessonNavigation } from './LessonNavigation';

export interface StoryIntroStageProps {
  missionTitle: string;
  storyIntro: MissionStoryIntro;
  onStartTeaching: () => void;
}

export const StoryIntroStage: React.FC<StoryIntroStageProps> = ({
  missionTitle,
  storyIntro,
  onStartTeaching,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [beatIndex, setBeatIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animationSeed, setAnimationSeed] = useState(0);

  const beats = storyIntro.beats;
  const activeBeat = beats[beatIndex] ?? beats[0];
  const speakerSpec = CHARACTER_MASTERS[activeBeat.speaker];
  const isLastBeat = beatIndex >= beats.length - 1;

  const handleNext = () => {
    if (!isLastBeat) {
      setBeatIndex((i) => i + 1);
      setAnimationSeed((s) => s + 1);
    } else {
      onStartTeaching();
    }
  };

  const handlePrevious = () => {
    if (beatIndex > 0) {
      setBeatIndex((i) => i - 1);
      setAnimationSeed((s) => s + 1);
    }
  };

  const handleReplay = () => {
    setIsPaused(false);
    setAnimationSeed((s) => s + 1);
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0">
      <div className="flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3">
        {/* Compact Scene Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A15C00] uppercase tracking-wide">
              <Wind className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{storyIntro.settingLabel}</span>
            </span>
            <h2 className="font-heading text-base sm:text-lg font-semibold text-[#263A70] truncate">
              {storyIntro.sceneTitle}
            </h2>
          </div>

          {!isLastBeat ? (
            <button
              type="button"
              onClick={onStartTeaching}
              className="inline-flex items-center gap-1 min-h-[38px] px-3 rounded-[10px] border border-[#E5E2D9] bg-white text-xs font-medium text-[#263A70] hover:bg-[#F5F2EA] cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Skip intro</span>
              <FastForward className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {/* 2D Courtyard & Noticeboard Scene */}
        <CourtyardNoticeboardScene
          mode="scattered"
          sceneFocus={activeBeat.sceneFocus}
          isPaused={isPaused}
          animationSeed={animationSeed}
        />

        {/* Scattered Torn Strips Preview */}
        <div className="rounded-[14px] bg-white border border-[#E5E2D9] px-3 py-2.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#4B5C8A]">
            <span>Torn noticeboard scraps ({missionTitle})</span>
            <span className="tabular-nums">
              Scene {beatIndex + 1} of {beats.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {storyIntro.scatteredFragments.map((fragment, idx) => (
              <span
                key={fragment}
                className={[
                  'px-2.5 py-1 rounded-[9px] border text-xs font-medium',
                  idx % 2 === 0
                    ? 'bg-[#FFF4D6] border-[#F2DFB6] text-[#263A70]'
                    : 'bg-[#D9FAF5] border-[#A8E8DF] text-[#263A70]',
                ].join(' ')}
              >
                {fragment}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Speaker Dialogue Card */}
        <motion.section
          key={activeBeat.id}
          aria-label={`${speakerSpec.name} speaks`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-[16px] bg-[#FFF1D5] border border-[#F2DFB6] p-3.5 sm:p-4 space-y-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-[8px] bg-[#263A70] text-white text-xs font-semibold">
                {speakerSpec.name}
              </span>
              <span className="text-xs font-medium text-[#A15C00]">
                {activeBeat.actionLabel}
              </span>
            </div>

            {/* Beat Dots */}
            <div className="flex items-center gap-1" aria-hidden="true">
              {beats.map((b, idx) => (
                <span
                  key={b.id}
                  className={[
                    'h-2 rounded-full transition-all',
                    idx === beatIndex ? 'w-5 bg-[#263A70]' : 'w-2 bg-[#D6C59E]',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>

          <p className="text-sm sm:text-base font-medium text-[#263A70] leading-snug">
            “{activeBeat.dialogue}”
          </p>

          {activeBeat.cardPreviewText ? (
            <div className="rounded-[10px] bg-white border border-dashed border-[#F59B19] px-3 py-2 text-xs sm:text-sm font-semibold text-[#263A70]">
              Scrap on the ground: <span className="text-[#A15C00]">{activeBeat.cardPreviewText}</span>
            </div>
          ) : null}
        </motion.section>
      </div>

      {/* Persistent Bottom Navigation */}
      <LessonNavigation
        currentStepIndex={beatIndex}
        totalSteps={beats.length}
        isPaused={isPaused}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTogglePause={() => setIsPaused((p) => !p)}
        onReplay={handleReplay}
        nextLabel={isLastBeat ? 'Start Mission' : 'Next'}
      />
    </div>
  );
};
