/**
 * ============================================================================
 * GRAMMAR QUEST — INTERACTIVE WORD LABORATORY
 * ============================================================================
 * Coordinates reusable interactive activity types (A–F) from JSON lesson data
 * with an equal-width activity tab grid, pinned bottom navigation + reset bar,
 * and completion summary.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Award, Check, RotateCcw } from 'lucide-react';
import type { WordLabActivity } from '../../../schemas/grammarEngine.schema';
import { Button } from '../../../components';
import { SPEAKER_THEMES, SpeakerPortrait } from '../speakerTheme';
import { IdentifyGroupActivity } from './IdentifyGroupActivity';
import { IdentifyBothActivity } from './IdentifyBothActivity';
import { CategorisationActivity } from './CategorisationActivity';
import { SentenceBuilder } from './SentenceBuilder';
import {
  ErrorIdentificationView,
  MissingWordsView,
  WordReplacementView,
} from './WordLabChallengeActivity';

export interface WordLaboratoryProps {
  activities: WordLabActivity[];
  initialSolvedIds?: string[];
  hasIndependentPractice?: boolean;
  onActiveActivityChange?: (activity: WordLabActivity) => void;
  onSolvedIdsChange?: (solvedIds: string[]) => void;
  onAllSolved?: () => void;
  onRecordActivityStars?: (activityId: string, stars: 1 | 2 | 3) => void;
  onBackToLesson: () => void;
  onFinishMissionPractice: (allSolved: boolean) => void;
}

const LAB_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const LAB_SHORT_NAMES = ['Identify', 'Sort', 'Build', 'Swap', 'Complete', 'Fix'];

function getActivityTabParts(
  activity: WordLabActivity,
  index: number,
): { letter: string; shortName: string } {
  const defaultLetter = LAB_LETTERS[index] ?? String.fromCharCode(65 + index);
  const defaultName = LAB_SHORT_NAMES[index] ?? `Task ${index + 1}`;
  if (!activity.tabLabel) {
    return { letter: defaultLetter, shortName: defaultName };
  }
  const match = /^([A-F])\.\s*(.+)$/i.exec(activity.tabLabel.trim());
  if (match) {
    return {
      letter: match[1].toUpperCase(),
      shortName: match[2].trim(),
    };
  }
  return {
    letter: defaultLetter,
    shortName: activity.tabLabel.trim(),
  };
}

export const WordLaboratory: React.FC<WordLaboratoryProps> = ({
  activities,
  initialSolvedIds,
  hasIndependentPractice = false,
  onActiveActivityChange,
  onSolvedIdsChange,
  onAllSolved,
  onRecordActivityStars,
  onBackToLesson,
  onFinishMissionPractice,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [solvedIds, setSolvedIds] = useState<string[]>(() => initialSolvedIds ?? []);
  const solvedIdsRef = React.useRef<string[]>(solvedIds);
  solvedIdsRef.current = solvedIds;
  const [categoriseResetNonce, setCategoriseResetNonce] = useState(0);
  const [categoriseHasProgress, setCategoriseHasProgress] = useState(false);
  const gyanTheme = SPEAKER_THEMES.gyan;

  const currentActivity = activities[activeIndex] ?? activities[0];
  const allSolved = activities.length > 0 && activities.every((a) => solvedIds.includes(a.id));

  useEffect(() => {
    if (!initialSolvedIds?.length) return;
    setSolvedIds((prev) => {
      const merged = Array.from(new Set([...prev, ...initialSolvedIds]));
      return merged.length === prev.length ? prev : merged;
    });
  }, [initialSolvedIds]);

  useEffect(() => {
    if (currentActivity) {
      onActiveActivityChange?.(currentActivity);
    }
  }, [currentActivity, onActiveActivityChange]);

  const markSolved = (id: string) => {
    const prev = solvedIdsRef.current;
    if (prev.includes(id)) return;
    const next = [...prev, id];
    solvedIdsRef.current = next;
    setSolvedIds(next);
    onSolvedIdsChange?.(next);
    if (activities.length > 0 && activities.every((a) => next.includes(a.id))) {
      onAllSolved?.();
    }
  };

  if (!currentActivity) return null;

  const isSortActivity = currentActivity.kind === 'categorise';
  const isCurrentSolved = solvedIds.includes(currentActivity.id);
  const isNextBlocked = !isCurrentSolved;

  const handleResetSort = () => {
    setCategoriseResetNonce((n) => n + 1);
    setCategoriseHasProgress(false);
    const prev = solvedIdsRef.current;
    const next = prev.filter((id) => id !== currentActivity.id);
    if (next.length !== prev.length) {
      solvedIdsRef.current = next;
      setSolvedIds(next);
      onSolvedIdsChange?.(next);
    }
  };

  return (
    <div className={isSortActivity ? 'space-y-2' : 'space-y-4'}>
      {/* Equal-Width Guided Practice Activity Tab Grid */}
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${Math.max(activities.length, 1)}, minmax(0, 1fr))`,
        }}
        role="tablist"
        aria-label="Guided practice activities"
      >
        {activities.map((act, idx) => {
          const isCurrent = idx === activeIndex;
          const isDone = solvedIds.includes(act.id);
          const { letter, shortName } = getActivityTabParts(act, idx);

          return (
            <button
              key={act.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-current={isCurrent ? 'step' : undefined}
              onClick={() => setActiveIndex(idx)}
              className={[
                'h-[48px] min-h-[48px] px-0.5 rounded-[11px] border flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer min-w-0',
                isCurrent
                  ? 'bg-[#1B2559] text-white border-[#1B2559] shadow-xs'
                  : isDone
                    ? 'bg-[#D7F5EE] text-[#1B2559] border-[#65D8CA]'
                    : 'bg-white text-[#4A5170] border-[#E5E2D9] hover:border-[#1B2559]/40 hover:text-[#1B2559]',
              ].join(' ')}
            >
              <span className="inline-flex items-center gap-0.5 text-[14px] font-extrabold leading-none">
                <span>{letter}</span>
                {isDone ? (
                  <Check
                    className={[
                      'w-3 h-3 shrink-0 stroke-[2.75]',
                      isCurrent ? 'text-[#8FD9AE]' : 'text-[#0F7F76]',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                ) : null}
              </span>
              <span className="text-[10.5px] font-semibold leading-none tracking-tight truncate max-w-full px-0.5">
                {shortName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Guided Practice Views (kept mounted so switching A–F preserves task state) */}
      {activities.map((act, idx) => {
        const isVisible = idx === activeIndex;
        return (
          <div key={act.id} className={isVisible ? '' : 'hidden'} aria-hidden={!isVisible}>
            {act.kind === 'categorise' ? (
              <CategorisationActivity
                activity={act}
                resetNonce={categoriseResetNonce}
                onProgressChange={isVisible ? setCategoriseHasProgress : undefined}
                onSolved={(stars) => {
                  markSolved(act.id);
                  onRecordActivityStars?.(act.id, stars);
                }}
              />
            ) : (
              <div className="rounded-[20px] bg-[#FDFCF9] border border-[#E5E2D9] p-4 sm:p-5 space-y-3">
                {solvedIds.includes(act.id) ? (
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[8px] bg-[#D9FAF5] border border-[#65D8CA] text-[11px] font-semibold text-[#0E5A42]">
                      <Check className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span>Completed</span>
                    </span>
                  </div>
                ) : null}
                {act.kind === 'identify-group' ? (
                  <IdentifyGroupActivity
                    activity={act}
                    onSolved={() => markSolved(act.id)}
                  />
                ) : null}

                {act.kind === 'identify-both' ? (
                  <IdentifyBothActivity
                    activity={act}
                    onSolved={() => markSolved(act.id)}
                  />
                ) : null}

                {act.kind === 'sentence-construction' ? (
                  <SentenceBuilder
                    activity={act}
                    onSolved={() => markSolved(act.id)}
                  />
                ) : null}

                {act.kind === 'word-replacement' ? (
                  <WordReplacementView
                    activity={act}
                    onSolved={() => markSolved(act.id)}
                  />
                ) : null}

                {act.kind === 'missing-words' ? (
                  <MissingWordsView
                    activity={act}
                    onSolved={() => markSolved(act.id)}
                  />
                ) : null}

                {act.kind === 'error-identification' ? (
                  <ErrorIdentificationView
                    activity={act}
                    onSolved={() => markSolved(act.id)}
                  />
                ) : null}
              </div>
            )}
          </div>
        );
      })}

      {/* Completion Banner once all Guided Practice activities are completed */}
      {allSolved ? (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[18px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: gyanTheme.tint,
            border: `1.5px solid ${gyanTheme.solid}`,
          }}
        >
          <div className="flex items-start sm:items-center gap-3">
            <SpeakerPortrait
              characterId="gyan"
              expression="celebrating"
              pose="celebrating"
              animatePop={!prefersReducedMotion}
              isTalking={!prefersReducedMotion}
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className="px-2 py-0.5 rounded-[8px] text-white text-[11px] font-bold leading-snug"
                  style={{ backgroundColor: gyanTheme.solid }}
                >
                  {gyanTheme.name}
                </span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: gyanTheme.solid }}
                >
                  {gyanTheme.roleLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#263A70]">
                  <Award className="w-3.5 h-3.5 text-[#5B43C2]" aria-hidden="true" />
                  <span>Guided practice complete!</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#263A70]">
                {hasIndependentPractice
                  ? 'You are ready to try new sentences on your own in Independent Practice.'
                  : 'You explored every interactive grammar tool in this lab.'}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onFinishMissionPractice(allSolved)}
          >
            {hasIndependentPractice ? 'Start Independent Practice' : 'Save & Return to Home'}
          </Button>
        </motion.div>
      ) : null}

      {/* Pinned Bottom Navigation & Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#E5E2D9]">
        <div className="max-w-[920px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (activeIndex > 0) {
                  setActiveIndex((i) => i - 1);
                } else {
                  onBackToLesson();
                }
              }}
              className="inline-flex items-center justify-center gap-1 min-h-[44px] px-2.5 sm:px-3.5 rounded-[12px] border border-[#E5E2D9] bg-[#FDFCF9] hover:bg-[#F5EFE0] text-[#1B2559] text-[12px] sm:text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {activeIndex === 0 ? (
                <span>Back to Lesson</span>
              ) : (
                <span>
                  Previous<span className="hidden min-[390px]:inline"> Activity</span>
                </span>
              )}
            </button>

            {isSortActivity ? (
              <button
                type="button"
                onClick={handleResetSort}
                disabled={!categoriseHasProgress && !isCurrentSolved}
                aria-label="Reset this activity"
                className={[
                  'inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-[12px] border transition-colors shrink-0',
                  categoriseHasProgress || isCurrentSolved
                    ? 'border-[#E5E2D9] bg-[#FDFCF9] text-[#1B2559] hover:bg-[#F5EFE0] cursor-pointer'
                    : 'border-[#EDE8DA] bg-[#F8F5EC] text-[#8E93A6] cursor-not-allowed',
                ].join(' ')}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <span className="text-[11px] sm:text-xs font-semibold text-[#4A5170] tabular-nums text-center truncate">
            {solvedIds.length} of {activities.length} completed
          </span>

          {activeIndex < activities.length - 1 ? (
            <button
              type="button"
              disabled={isNextBlocked}
              onClick={() => setActiveIndex((i) => i + 1)}
              className={[
                'inline-flex items-center justify-center gap-1 min-h-[44px] px-3 sm:px-4 rounded-[12px] text-[12px] sm:text-xs font-bold whitespace-nowrap shrink-0 transition-all',
                isNextBlocked
                  ? 'bg-[#C9CDDC] text-[#2B3554] cursor-not-allowed'
                  : 'bg-[#1B2559] text-white hover:bg-[#263A70] cursor-pointer',
                isSortActivity && isCurrentSolved && !prefersReducedMotion
                  ? 'gq-sort-next-pulse'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span>Next Activity</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={!allSolved}
              aria-label={
                !allSolved
                  ? `Complete all ${activities.length} activities to continue`
                  : undefined
              }
              onClick={() => onFinishMissionPractice(allSolved)}
            >
              {!allSolved
                ? 'Complete all tasks'
                : hasIndependentPractice
                  ? 'Independent Practice'
                  : 'Finish Practice'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
