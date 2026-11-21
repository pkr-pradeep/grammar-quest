/**
 * ============================================================================
 * GRAMMAR QUEST — SEQUENTIAL MCQ SORTING ACTIVITY (GUIDED ACTIVITY A)
 * ============================================================================
 * Clean, mobile-first sequential multiple-choice experience for
 * "Sort Sentences by Purpose" (Declarative, Interrogative, Imperative,
 * Exclamatory). Presents one sentence at a time with four full-width answer
 * options, reserved non-shifting feedback region, per-attempt Fisher-Yates
 * shuffling, mistake tracking, preserved star scoring, and explicit footer
 * progression via AppShellFooter.
 * ============================================================================
 */

import React, { useMemo, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  HelpCircle,
  Megaphone,
  RotateCcw,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import type {
  CategoriseActivity,
  CategoriseItem,
} from '../../../schemas/grammarEngine.schema';
import { AppShellFooter, useAppScroll } from '../../../components';
import { computeSortStars } from './CategorisationActivity';

type CategoriseCategory = CategoriseActivity['categories'][number];

export interface SortSentencesMcqActivityProps {
  activity: CategoriseActivity;
  isActive: boolean;
  onSolved: (stars: 1 | 2 | 3) => void;
  onRetryReset?: () => void;
  onBackToLesson: () => void;
  onNextActivity?: () => void;
}

interface CategoryDisplayMeta {
  meaning: string;
  wrongFeedback: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  iconBg: string;
  iconColor: string;
}

const SENTENCE_PURPOSE_META: Record<string, CategoryDisplayMeta> = {
  declarative: {
    meaning: 'States a fact.',
    wrongFeedback:
      'Not declarative. This sentence does not simply state a neutral fact. Try another option.',
    Icon: FileText,
    iconBg: 'bg-[#FEF3D6]',
    iconColor: 'text-[#9A5B00]',
  },
  interrogative: {
    meaning: 'Asks a question.',
    wrongFeedback:
      'Not interrogative. It does not ask a direct question for information. Try another option.',
    Icon: HelpCircle,
    iconBg: 'bg-[#E5F2FF]',
    iconColor: 'text-[#1D4E89]',
  },
  imperative: {
    meaning: 'Gives a command.',
    wrongFeedback:
      'Not imperative. It does not give an order, advice, or request. Try another option.',
    Icon: Megaphone,
    iconBg: 'bg-[#DFF6F1]',
    iconColor: 'text-[#0E6B5E]',
  },
  exclamatory: {
    meaning: 'Shows strong feeling.',
    wrongFeedback:
      'Not exclamatory. It does not express sudden strong feeling or wonder. Try another option.',
    Icon: Sparkles,
    iconBg: 'bg-[#F0EBFC]',
    iconColor: 'text-[#5B43C2]',
  },
};

function fisherYatesShuffle<T>(source: readonly T[]): T[] {
  const arr = [...source];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCategoryMeta(category: CategoriseCategory): CategoryDisplayMeta {
  const known = SENTENCE_PURPOSE_META[category.id];
  if (known) return known;
  return {
    meaning: category.helperText,
    wrongFeedback: `Not ${category.label.toLowerCase()}. Check the purpose of this sentence and try another option.`,
    Icon: FileText,
    iconBg: 'bg-[#F5EFE0]',
    iconColor: 'text-[#1B2559]',
  };
}

function formatCleanTitle(rawTitle: string): string {
  return rawTitle.replace(/^[A-F]\.\s*/i, '').trim();
}

export const SortSentencesMcqActivity: React.FC<SortSentencesMcqActivityProps> = ({
  activity,
  isActive,
  onSolved,
  onRetryReset,
  onBackToLesson,
  onNextActivity,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollToTop } = useAppScroll();

  const [attemptId, setAttemptId] = useState(0);

  // Shuffle sentences and answer options once per attempt; keep order fixed during the attempt.
  const { orderedItems, orderedCategories } = useMemo(() => {
    void attemptId;
    return {
      orderedItems: fisherYatesShuffle<CategoriseItem>(activity.items),
      orderedCategories: fisherYatesShuffle<CategoriseCategory>(activity.categories),
    };
  }, [activity.items, activity.categories, attemptId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongSelectedIds, setWrongSelectedIds] = useState<string[]>([]);
  const [solvedCategoryId, setSolvedCategoryId] = useState<string | null>(null);
  const [lastWrongCategoryId, setLastWrongCategoryId] = useState<string | null>(null);
  const [shakingCategoryId, setShakingCategoryId] = useState<string | null>(null);
  const [shakeTick, setShakeTick] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const total = orderedItems.length;
  const currentItem = orderedItems[currentIndex];
  const isAnsweredCorrectly = solvedCategoryId !== null;
  const isLastSentence = currentIndex === total - 1;
  const earnedStars = computeSortStars(mistakes, 0);

  const handleSelectCategory = (category: CategoriseCategory) => {
    if (!currentItem || isAnsweredCorrectly || showCompletion) return;
    if (wrongSelectedIds.includes(category.id)) return;

    if (category.id === currentItem.correctCategory) {
      setSolvedCategoryId(category.id);
      setLastWrongCategoryId(null);
      setShakingCategoryId(null);
      return;
    }

    setWrongSelectedIds((prev) => [...prev, category.id]);
    setLastWrongCategoryId(category.id);
    setMistakes((prev) => prev + 1);
    if (!prefersReducedMotion) {
      setShakingCategoryId(category.id);
      setShakeTick((t) => t + 1);
    }
  };

  const handlePrimaryNext = () => {
    if (showCompletion) {
      onNextActivity?.();
      return;
    }
    if (!isAnsweredCorrectly) return;

    if (isLastSentence) {
      setShowCompletion(true);
      onSolved(earnedStars);
      scrollToTop('auto');
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setWrongSelectedIds([]);
    setSolvedCategoryId(null);
    setLastWrongCategoryId(null);
    setShakingCategoryId(null);
    scrollToTop('auto');
  };

  const handleRetry = () => {
    setAttemptId((prev) => prev + 1);
    setCurrentIndex(0);
    setWrongSelectedIds([]);
    setSolvedCategoryId(null);
    setLastWrongCategoryId(null);
    setShakingCategoryId(null);
    setMistakes(0);
    setShowCompletion(false);
    onRetryReset?.();
    scrollToTop('auto');
  };

  const cleanTitle = formatCleanTitle(activity.title);

  const activeCorrectCategory = solvedCategoryId
    ? orderedCategories.find((c) => c.id === solvedCategoryId)
    : null;
  const activeWrongCategory = lastWrongCategoryId
    ? orderedCategories.find((c) => c.id === lastWrongCategoryId)
    : null;

  const primaryButtonLabel = showCompletion
    ? 'Next Activity'
    : !isAnsweredCorrectly
      ? 'Choose an answer'
      : isLastSentence
        ? 'See result'
        : 'Next sentence';

  const isPrimaryDisabled = showCompletion
    ? !onNextActivity
    : !isAnsweredCorrectly;

  if (!currentItem) return null;

  return (
    <div className="space-y-3">
      {/* Title & Segmented Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-heading text-[18px] sm:text-[20px] font-semibold text-[#1B1B1F] leading-snug">
            {cleanTitle}
          </h2>
          <span
            className="text-xs font-semibold text-[#4A5170] tabular-nums shrink-0"
            aria-label={
              showCompletion
                ? `Completed all ${total} sentences`
                : `Sentence ${currentIndex + 1} of ${total}`
            }
          >
            {showCompletion ? `${total} of ${total}` : `${currentIndex + 1} of ${total}`}
          </span>
        </div>

        {/* 8-segment progress bar */}
        <div
          className="flex items-center gap-1"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={
            showCompletion
              ? total
              : currentIndex + (isAnsweredCorrectly ? 1 : 0)
          }
          aria-label="Sorting progress"
        >
          {orderedItems.map((item, idx) => {
            const isSegmentDone =
              showCompletion ||
              idx < currentIndex ||
              (idx === currentIndex && isAnsweredCorrectly);
            const isSegmentCurrent = !showCompletion && idx === currentIndex && !isAnsweredCorrectly;

            return (
              <span
                key={item.id}
                className={[
                  'h-1.5 flex-1 rounded-full transition-colors duration-200',
                  isSegmentDone
                    ? 'bg-[#1E8E5A]'
                    : isSegmentCurrent
                      ? 'bg-[#F2B63A]'
                      : 'bg-[#E4DCC8]',
                ].join(' ')}
              />
            );
          })}
        </div>
      </div>

      {showCompletion ? (
        /* Completion Result Card */
        <section
          aria-label="Activity result"
          className="rounded-[18px] bg-white border border-[#E4DCC8] px-5 py-6 sm:px-6 sm:py-7 text-center shadow-[0_1px_4px_rgba(27,37,89,0.05)] space-y-4"
        >
          <div
            className="flex items-center justify-center gap-2"
            role="img"
            aria-label={`${earnedStars} out of 3 stars earned`}
          >
            {[1, 2, 3].map((starNumber) => {
              const filled = starNumber <= earnedStars;
              return (
                <Star
                  key={starNumber}
                  className={[
                    'w-9 h-9',
                    filled
                      ? 'text-[#D99B16] fill-[#F2B63A]'
                      : 'text-[#CFC6B2] fill-[#F5EFE0]',
                    filled && !prefersReducedMotion ? 'gq-sort-star-pop' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={
                    filled && !prefersReducedMotion
                      ? { animationDelay: `${(starNumber - 1) * 110}ms` }
                      : undefined
                  }
                  aria-hidden="true"
                />
              );
            })}
          </div>

          <div className="space-y-1.5">
            <h3 className="font-heading text-[22px] font-semibold text-[#1B1B1F]">
              All {total} sorted
            </h3>
            <p className="text-[13px] font-semibold text-[#1E8E5A]">
              {mistakes === 0
                ? 'Zero mistakes — every sentence matched on the first try.'
                : mistakes === 1
                  ? 'Finished with 1 mistake.'
                  : `Finished with ${mistakes} mistakes.`}
            </p>
            <p className="text-sm text-[#4A5170] leading-relaxed max-w-[46ch] mx-auto pt-1">
              {activity.completeFeedback}
            </p>
          </div>

          <div className="pt-1 flex justify-center">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-[12px] border border-[#E4DCC8] bg-[#FBF8F1] hover:bg-[#F3EBD8] text-[#1B1B1F] text-sm font-semibold cursor-pointer transition-colors touch-manipulation"
            >
              <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Retry Activity</span>
            </button>
          </div>
        </section>
      ) : (
        /* Active Sequential Question Stage */
        <div className="space-y-2.5">
          {/* Sentence Card — shows only the current sentence */}
          <div className="rounded-[16px] bg-white border border-[#E4DCC8] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_3px_rgba(27,37,89,0.05)] space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5A6478]">
              Sentence {currentIndex + 1}
            </p>
            <p className="text-[18px] sm:text-[20px] font-semibold leading-snug text-[#1B1B1F]">
              &ldquo;{currentItem.text}&rdquo;
            </p>
          </div>

          {/* Reserved Stable Feedback Region (fixed minimum height avoids layout jump) */}
          <div
            role="status"
            aria-live="polite"
            className="min-h-[68px] flex items-center"
          >
            {isAnsweredCorrectly && activeCorrectCategory ? (
              <div className="w-full rounded-[12px] bg-[#EDF9F3] border border-[#1E8E5A]/40 px-3.5 py-2.5 text-[13px] leading-snug text-[#145334]">
                <span className="font-bold">Correct — {activeCorrectCategory.label}. </span>
                <span>{currentItem.explanation}</span>
              </div>
            ) : activeWrongCategory ? (
              <div className="w-full rounded-[12px] bg-[#FFF4EE] border border-[#C2410C]/35 px-3.5 py-2.5 text-[13px] leading-snug text-[#7C2D12]">
                {getCategoryMeta(activeWrongCategory).wrongFeedback}
              </div>
            ) : (
              <div className="w-full rounded-[12px] bg-[#F6F1E5]/70 border border-transparent px-3.5 py-2.5 text-[13px] leading-snug text-[#4A5170]">
                Choose the sentence type that matches the purpose of this sentence.
              </div>
            )}
          </div>

          {/* Four Full-Width Answer Option Rows (Single Column) */}
          <div
            className="flex flex-col gap-2"
            role="group"
            aria-label="Sentence type answer options"
          >
            {orderedCategories.map((category) => {
              const meta = getCategoryMeta(category);
              const Icon = meta.Icon;
              const isCorrectOption = solvedCategoryId === category.id;
              const isWrongOption = wrongSelectedIds.includes(category.id);
              const isOptionDisabled = isAnsweredCorrectly || isWrongOption;
              const isShaking =
                !prefersReducedMotion && shakingCategoryId === category.id;

              const stateLabel = isCorrectOption
                ? 'correct'
                : isWrongOption
                  ? 'wrong'
                  : undefined;

              return (
                <button
                  key={`${category.id}-${isShaking ? shakeTick : 0}`}
                  type="button"
                  disabled={isOptionDisabled}
                  onClick={() => handleSelectCategory(category)}
                  aria-pressed={isCorrectOption || isWrongOption}
                  aria-label={
                    stateLabel
                      ? `${category.label} — ${meta.meaning} (${stateLabel})`
                      : `${category.label} — ${meta.meaning}`
                  }
                  className={[
                    'w-full min-h-[56px] px-3.5 py-2.5 rounded-[14px] border-2 text-left',
                    'flex items-center gap-3 transition-colors duration-150 touch-manipulation',
                    isCorrectOption
                      ? 'bg-[#EDF9F3] border-[#1E8E5A] text-[#1B1B1F] cursor-default'
                      : isWrongOption
                        ? 'bg-[#FFF4EE] border-[#C2410C] text-[#1B1B1F] cursor-default'
                        : isAnsweredCorrectly
                          ? 'bg-white/75 border-[#E4DCC8] text-[#5A6478] opacity-65 cursor-default'
                          : 'bg-white border-[#E4DCC8] text-[#1B1B1F] hover:border-[#1B2559] active:bg-[#FBF8F1] cursor-pointer',
                    isShaking ? 'gq-sort-shake' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span
                    className={[
                      'w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center',
                      isCorrectOption
                        ? 'bg-[#D6F3E4] text-[#146C43]'
                        : isWrongOption
                          ? 'bg-[#FDE4D8] text-[#9A3412]'
                          : `${meta.iconBg} ${meta.iconColor}`,
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    <Icon className="w-[18px] h-[18px]" aria-hidden={true} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold leading-tight text-[#1B1B1F]">
                      {category.label}
                    </span>
                    <span className="block text-[12.5px] leading-snug text-[#4A5170] mt-0.5 break-words">
                      {meta.meaning}
                    </span>
                  </span>

                  <span
                    className="w-7 h-7 shrink-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {isCorrectOption ? (
                      <span className="w-7 h-7 rounded-full bg-[#1E8E5A] text-white flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[2.75]" />
                      </span>
                    ) : isWrongOption ? (
                      <span className="w-7 h-7 rounded-full bg-[#C2410C] text-white flex items-center justify-center">
                        <X className="w-4 h-4 stroke-[2.75]" />
                      </span>
                    ) : null}
                  </span>
                  {stateLabel ? <span className="sr-only">{stateLabel}</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Region E: Clean, Predictable Bottom Action Bar */}
      <AppShellFooter isActive={isActive}>
        <div className="max-w-[920px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToLesson}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 rounded-[12px] border border-[#E4DCC8] bg-white hover:bg-[#F5EFE0] text-[#1B1B1F] text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Back to Lesson</span>
          </button>

          <button
            type="button"
            disabled={isPrimaryDisabled}
            onClick={handlePrimaryNext}
            className={[
              'inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 sm:px-5 rounded-[12px] text-[13px] font-bold whitespace-nowrap transition-colors touch-manipulation',
              isPrimaryDisabled
                ? 'bg-[#D6DAE6] text-[#4A5170] cursor-not-allowed'
                : 'bg-[#1B2559] text-white hover:bg-[#263A70] cursor-pointer',
            ].join(' ')}
          >
            <span>{primaryButtonLabel}</span>
            {!isPrimaryDisabled ? (
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : null}
          </button>
        </div>
      </AppShellFooter>
    </div>
  );
};
