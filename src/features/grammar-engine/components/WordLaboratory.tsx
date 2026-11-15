/**
 * ============================================================================
 * GRAMMAR QUEST — INTERACTIVE WORD LABORATORY
 * ============================================================================
 * Coordinates all six reusable interactive activity types (A–F) from JSON
 * lesson data with immediate guided-practice feedback and completion summary.
 * ============================================================================
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Check } from 'lucide-react';
import type { WordLabActivity } from '../../../schemas/grammarEngine.schema';
import { Button, Character } from '../../../components';
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
  hasIndependentPractice?: boolean;
  onBackToLesson: () => void;
  onFinishMissionPractice: () => void;
}

const LAB_SHORT_LABELS = ['A. Identify', 'B. Sort', 'C. Build', 'D. Swap', 'E. Complete', 'F. Fix'];

export const WordLaboratory: React.FC<WordLaboratoryProps> = ({
  activities,
  hasIndependentPractice = false,
  onBackToLesson,
  onFinishMissionPractice,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  const currentActivity = activities[activeIndex] ?? activities[0];
  const allSolved = activities.length > 0 && activities.every((a) => solvedIds.includes(a.id));

  const markSolved = (id: string) => {
    setSolvedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  if (!currentActivity) return null;

  return (
    <div className="space-y-4">
      {/* Guided Practice Activity Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1" aria-label="Guided practice activities">
        {activities.map((act, idx) => {
          const isCurrent = idx === activeIndex;
          const isDone = solvedIds.includes(act.id);
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-current={isCurrent ? 'step' : undefined}
              className={[
                'inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0',
                isCurrent
                  ? 'bg-[#263A70] text-white'
                  : isDone
                    ? 'bg-[#D9FAF5] text-[#263A70] border border-[#65D8CA]'
                    : 'bg-white text-[#4B5C8A] border border-[#E5E2D9] hover:border-[#263A70]',
              ].join(' ')}
            >
              {isDone ? <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> : null}
              <span>{LAB_SHORT_LABELS[idx] ?? `Task ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {/* Active Guided Practice Card */}
      <div className="rounded-[20px] bg-[#FDFCF9] border border-[#E5E2D9] p-4 sm:p-5">
        {currentActivity.kind === 'identify-group' ? (
          <IdentifyGroupActivity
            key={currentActivity.id}
            activity={currentActivity}
            onSolved={() => markSolved(currentActivity.id)}
          />
        ) : null}

        {currentActivity.kind === 'identify-both' ? (
          <IdentifyBothActivity
            key={currentActivity.id}
            activity={currentActivity}
            onSolved={() => markSolved(currentActivity.id)}
          />
        ) : null}

        {currentActivity.kind === 'categorise' ? (
          <CategorisationActivity
            key={currentActivity.id}
            activity={currentActivity}
            onSolved={() => markSolved(currentActivity.id)}
          />
        ) : null}

        {currentActivity.kind === 'sentence-construction' ? (
          <SentenceBuilder
            key={currentActivity.id}
            activity={currentActivity}
            onSolved={() => markSolved(currentActivity.id)}
          />
        ) : null}

        {currentActivity.kind === 'word-replacement' ? (
          <WordReplacementView
            key={currentActivity.id}
            activity={currentActivity}
            onSolved={() => markSolved(currentActivity.id)}
          />
        ) : null}

        {currentActivity.kind === 'missing-words' ? (
          <MissingWordsView
            key={currentActivity.id}
            activity={currentActivity}
            onSolved={() => markSolved(currentActivity.id)}
          />
        ) : null}

        {currentActivity.kind === 'error-identification' ? (
          <ErrorIdentificationView
            key={currentActivity.id}
            activity={currentActivity}
            onSolved={() => markSolved(currentActivity.id)}
          />
        ) : null}
      </div>

      {/* Completion Banner once all Guided Practice activities are completed */}
      {allSolved ? (
        <div className="rounded-[18px] bg-[#FFF1D5] border border-[#F2DFB6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Character
              characterId="gyan"
              expression="celebrating"
              pose="celebrating"
              animationState="celebrate"
              size="xs"
            />
            <div className="space-y-0.5">
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#263A70]">
                <Award className="w-4 h-4 text-[#A15C00]" aria-hidden="true" />
                <span>Guided practice complete!</span>
              </p>
              <p className="text-xs sm:text-sm text-[#333333]">
                {hasIndependentPractice
                  ? 'You are ready to try new sentences on your own in Independent Practice.'
                  : 'You explored every Subject and Predicate tool.'}
              </p>
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={onFinishMissionPractice}>
            {hasIndependentPractice ? 'Start Independent Practice' : 'Save & Return to Home'}
          </Button>
        </div>
      ) : null}

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (activeIndex > 0) {
              setActiveIndex((i) => i - 1);
            } else {
              onBackToLesson();
            }
          }}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          {activeIndex === 0 ? 'Back to Lesson' : 'Previous Task'}
        </Button>

        <span className="text-xs font-medium text-[#4B5C8A] tabular-nums">
          {solvedIds.length} of {activities.length} completed
        </span>

        {activeIndex < activities.length - 1 ? (
          <Button
            variant="navy"
            size="sm"
            onClick={() => setActiveIndex((i) => i + 1)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next Task
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={onFinishMissionPractice}>
            {hasIndependentPractice ? 'Independent Practice' : 'Finish Practice'}
          </Button>
        )}
      </div>
    </div>
  );
};
