/**
 * ============================================================================
 * GRAMMAR QUEST — STAGE 1: STORY INTRODUCTION (COURTYARD & NOTICEBOARD)
 * ============================================================================
 * Introduces the broken noticeboard problem in an Indian school courtyard with
 * Mira, Arjun, and Gyan. Features speaker colour-coding, cropped master
 * character portraits, sliding diamond pointer, pausable typewriter dialogue,
 * per-scene courtyard animations, and full reduced-motion accessibility.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { FastForward, Wind } from 'lucide-react';
import type { MissionStoryIntro } from '../../../schemas/grammarEngine.schema';
import {
  CHARACTER_MASTERS,
  Character,
  CourtyardNoticeboardScene,
} from '../../../components';
import type { CharacterId } from '../../../components';
import { LessonNavigation } from './LessonNavigation';

export interface StoryIntroStageProps {
  missionTitle: string;
  storyIntro: MissionStoryIntro;
  onStartTeaching: () => void;
}

interface SpeakerTheme {
  solid: string;
  tint: string;
  roleLabel: string;
  pointerLeft: string;
}

const SPEAKER_THEMES: Record<CharacterId, SpeakerTheme> = {
  mira: {
    solid: '#C94A3A',
    tint: '#FDE6E1',
    roleLabel: 'Student',
    pointerLeft: '12%',
  },
  arjun: {
    solid: '#0F7F76',
    tint: '#DDF4F0',
    roleLabel: 'Student',
    pointerLeft: '28%',
  },
  gyan: {
    solid: '#5B43C2',
    tint: '#ECE6FB',
    roleLabel: 'Robot guide',
    pointerLeft: '87%',
  },
};

const TYPEWRITER_CHAR_MS = 26;
const PORTRAIT_LEAD_MS = 320;

export const StoryIntroStage: React.FC<StoryIntroStageProps> = ({
  missionTitle,
  storyIntro,
  onStartTeaching,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [beatIndex, setBeatIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animationSeed, setAnimationSeed] = useState(0);

  const beats = storyIntro.beats;
  const activeBeat = beats[beatIndex] ?? beats[0];
  const fullDialogue = activeBeat.dialogue;
  const speakerSpec = CHARACTER_MASTERS[activeBeat.speaker];
  const theme = SPEAKER_THEMES[activeBeat.speaker];
  const isLastBeat = beatIndex >= beats.length - 1;

  const [typedCount, setTypedCount] = useState<number>(() =>
    prefersReducedMotion ? fullDialogue.length : 0,
  );

  // Reset typewriter cleanly on scene change or replay
  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedCount(fullDialogue.length);
    } else {
      setTypedCount(0);
    }
  }, [beatIndex, animationSeed, fullDialogue.length, prefersReducedMotion]);

  // Pausable 26ms/char typewriter timer
  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedCount(fullDialogue.length);
      return;
    }
    if (isPaused || typedCount >= fullDialogue.length) {
      return;
    }

    const delay = typedCount === 0 ? PORTRAIT_LEAD_MS : TYPEWRITER_CHAR_MS;
    const timer = window.setTimeout(() => {
      setTypedCount((count) => Math.min(count + 1, fullDialogue.length));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    typedCount,
    fullDialogue.length,
    isPaused,
    prefersReducedMotion,
    beatIndex,
    animationSeed,
  ]);

  const isTypingComplete = typedCount >= fullDialogue.length;
  const isActivelyTyping = !prefersReducedMotion && !isTypingComplete;
  const displayedDialogue = fullDialogue.slice(0, typedCount);

  const handleNext = () => {
    if (!isLastBeat) {
      setIsPaused(false);
      setBeatIndex((i) => i + 1);
      setAnimationSeed((s) => s + 1);
    } else {
      onStartTeaching();
    }
  };

  const handlePrevious = () => {
    if (beatIndex > 0) {
      setIsPaused(false);
      setBeatIndex((i) => i - 1);
      setAnimationSeed((s) => s + 1);
    }
  };

  const handleReplay = () => {
    setIsPaused(false);
    setTypedCount(prefersReducedMotion ? fullDialogue.length : 0);
    setAnimationSeed((s) => s + 1);
  };

  const handleRevealDialogue = () => {
    if (!isTypingComplete) {
      setTypedCount(fullDialogue.length);
    }
  };

  const renderSpeakerPortrait = () => {
    const id = activeBeat.speaker;
    const positionClass =
      id === 'mira'
        ? '-top-[20px]'
        : id === 'arjun'
          ? '-top-[16px]'
          : '-top-[36px]';
    const sizePx = id === 'gyan' ? 82 : 96;

    return (
      <div
        key={`portrait-${activeBeat.id}-${animationSeed}`}
        aria-hidden="true"
        className={[
          'relative w-[44px] h-[44px] rounded-full overflow-hidden shrink-0 bg-[#FFFDF8]',
          !prefersReducedMotion ? 'gq-story-portrait-pop' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          border: `2.5px solid ${theme.solid}`,
        }}
      >
        <div className={`absolute left-1/2 -translate-x-1/2 ${positionClass}`}>
          <Character
            characterId={id}
            pose={
              id === 'mira'
                ? 'pointing'
                : id === 'arjun'
                  ? 'reading'
                  : 'explaining'
            }
            expression={activeBeat.expression}
            animationState="none"
            size={sizePx}
            flipHorizontal={id === 'gyan'}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={[
        'gq-story-stage flex-1 flex flex-col justify-between min-h-0',
        isPaused ? 'gq-story-paused' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
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
              className="inline-flex items-center gap-1 min-h-[44px] px-3.5 rounded-[12px] border border-[#E5E2D9] bg-white text-xs font-semibold text-[#263A70] hover:bg-[#F5F2EA] cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Skip intro</span>
              <FastForward className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {/* 2D Courtyard & Noticeboard Scene (with Story spotlight + per-scene effects) */}
        <CourtyardNoticeboardScene
          mode="scattered"
          sceneFocus={activeBeat.sceneFocus}
          isPaused={isPaused}
          isTyping={isActivelyTyping}
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
            {storyIntro.scatteredFragments.map((fragment, idx) => {
              const isCricketChip = fragment.toLowerCase().includes('plays cricket');
              const isSubjectChip = fragment.toLowerCase().includes('the little boy');
              const pulseInScene2 =
                activeBeat.sceneFocus === 'arjun-picks-up' && isCricketChip;
              const pulseInScene3 =
                activeBeat.sceneFocus === 'gyan-explains' &&
                (isCricketChip || isSubjectChip);

              const pulseClass =
                !prefersReducedMotion && (pulseInScene2 || (pulseInScene3 && isCricketChip))
                  ? 'gq-story-chip-glow-teal'
                  : !prefersReducedMotion && pulseInScene3 && isSubjectChip
                    ? 'gq-story-chip-glow-amber'
                    : '';

              return (
                <span
                  key={fragment}
                  className={[
                    'px-2.5 py-1 rounded-[9px] border text-xs font-medium transition-colors',
                    pulseInScene2 || (pulseInScene3 && isCricketChip)
                      ? 'bg-[#DDF4F0] border-[#0F7F76] text-[#263A70] font-semibold'
                      : pulseInScene3 && isSubjectChip
                        ? 'bg-[#FFF4D6] border-[#D97706] text-[#263A70] font-semibold'
                        : idx % 2 === 0
                          ? 'bg-[#FFF4D6] border-[#F2DFB6] text-[#263A70]'
                          : 'bg-[#D9FAF5] border-[#A8E8DF] text-[#263A70]',
                    pulseClass,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {fragment}
                </span>
              );
            })}
          </div>
        </div>

        {/* Interactive Speaker Dialogue Card (tap to finish typing immediately) */}
        <section
          aria-label={`${speakerSpec.name} (${theme.roleLabel}) speaks`}
          role={!isTypingComplete ? 'button' : undefined}
          tabIndex={!isTypingComplete ? 0 : undefined}
          onClick={!isTypingComplete ? handleRevealDialogue : undefined}
          onKeyDown={
            !isTypingComplete
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRevealDialogue();
                  }
                }
              : undefined
          }
          className={[
            'relative rounded-[16px] p-3.5 sm:p-4 space-y-2.5 select-text',
            !isTypingComplete ? 'cursor-pointer' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            backgroundColor: theme.tint,
            border: `1.5px solid ${theme.solid}`,
            transition: prefersReducedMotion
              ? 'none'
              : 'background-color 0.35s ease, border-color 0.35s ease',
          }}
        >
          {/* Top-edge diamond pointer aligned under speaking character */}
          <span
            aria-hidden="true"
            className="absolute -top-[7px] w-3 h-3 rotate-45 -translate-x-1/2 pointer-events-none"
            style={{
              left: theme.pointerLeft,
              backgroundColor: theme.tint,
              borderLeft: `1.5px solid ${theme.solid}`,
              borderTop: `1.5px solid ${theme.solid}`,
              transition: prefersReducedMotion
                ? 'none'
                : 'left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.35s ease, border-color 0.35s ease',
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {renderSpeakerPortrait()}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className="px-2.5 py-0.5 rounded-[8px] text-white text-xs font-bold leading-snug"
                    style={{ backgroundColor: theme.solid }}
                  >
                    {speakerSpec.name}
                  </span>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: theme.solid }}
                  >
                    {theme.roleLabel}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#263A70]/85 mt-0.5">
                  {activeBeat.actionLabel}
                </p>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {beats.map((b, idx) => {
                const isActive = idx === beatIndex;
                const isCompleted = idx < beatIndex;
                return (
                  <span
                    key={b.id}
                    className={[
                      'h-2 rounded-full',
                      isActive ? 'w-6' : 'w-2',
                    ].join(' ')}
                    style={{
                      backgroundColor:
                        isActive || isCompleted
                          ? theme.solid
                          : 'rgba(38, 58, 112, 0.2)',
                      opacity: isCompleted ? 0.45 : 1,
                      transition: prefersReducedMotion
                        ? 'none'
                        : 'width 0.3s ease, background-color 0.3s ease, opacity 0.3s ease',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Typewriter Dialogue Box (invisible full-height clone prevents height jump) */}
          <div className="grid">
            <p
              aria-hidden="true"
              className="col-start-1 row-start-1 invisible pointer-events-none select-none text-sm sm:text-base font-medium text-[#263A70] leading-snug"
            >
              “{fullDialogue}”
            </p>
            <p
              aria-live="polite"
              className="col-start-1 row-start-1 text-sm sm:text-base font-medium text-[#263A70] leading-snug"
            >
              “{displayedDialogue}
              {isActivelyTyping ? (
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[1em] align-middle ml-0.5 rounded-full gq-story-caret"
                  style={{ backgroundColor: theme.solid }}
                />
              ) : (
                '”'
              )}
            </p>
          </div>

          {activeBeat.cardPreviewText ? (
            <div
              key={`preview-${activeBeat.id}-${animationSeed}`}
              className={[
                'rounded-[10px] bg-white border border-dashed px-3 py-2 text-xs sm:text-sm font-semibold text-[#263A70]',
                !prefersReducedMotion ? 'gq-story-card-fade-up' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ borderColor: theme.solid }}
            >
              Scrap on the ground:{' '}
              <span style={{ color: theme.solid }}>{activeBeat.cardPreviewText}</span>
            </div>
          ) : null}
        </section>
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
        nudgeNextArrow={isTypingComplete && !isPaused && !prefersReducedMotion}
      />
    </div>
  );
};
