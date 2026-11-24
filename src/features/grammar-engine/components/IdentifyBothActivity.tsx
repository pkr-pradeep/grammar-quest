/**
 * ============================================================================
 * GRAMMAR QUEST — DUAL SUBJECT + PREDICATE IDENTIFICATION ACTIVITY
 * ============================================================================
 * Guides the learner to:
 *  1. Select the Subject tokens and verify,
 *  2. Select the Predicate tokens and verify,
 *  3. View the complete Subject + Predicate structure with feedback.
 * Used across Stage 8 Guided Practice (and reusable in other modules).
 * ============================================================================
 */

import React, { useState } from 'react';
import { HelpCircle, Layers, MessageSquare, RotateCcw } from 'lucide-react';
import type { IdentifyBothActivity as IdentifyBothActivityData } from '../../../schemas/grammarEngine.schema';
import { Button } from '../../../components';
import { WordToken } from './WordToken';
import { WordGroup } from './WordGroup';
import { PracticeFeedback } from './PracticeFeedback';
import { playLearningFeedback } from '../../../services/feedback/feedbackService';

export interface IdentifyBothActivityProps {
  activity: IdentifyBothActivityData;
  onSolved?: () => void;
}

function sameTokenSet(a: string[], b: string[]): boolean {
  const setA = new Set(a);
  const setB = new Set(b);
  return setA.size === setB.size && [...setB].every((id) => setA.has(id));
}

export const IdentifyBothActivity: React.FC<IdentifyBothActivityProps> = ({
  activity,
  onSolved,
}) => {
  const [phase, setPhase] = useState<'subject' | 'predicate' | 'done'>('subject');
  const [subjectSelection, setSubjectSelection] = useState<string[]>([]);
  const [predicateSelection, setPredicateSelection] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const toggleToken = (tokenId: string) => {
    if (phase === 'done') return;
    setErrorMsg(null);
    if (phase === 'subject') {
      setSubjectSelection((prev) =>
        prev.includes(tokenId) ? prev.filter((id) => id !== tokenId) : [...prev, tokenId],
      );
    } else {
      if (activity.subjectTokenIds.includes(tokenId)) return;
      setPredicateSelection((prev) =>
        prev.includes(tokenId) ? prev.filter((id) => id !== tokenId) : [...prev, tokenId],
      );
    }
  };

  const handleCheck = () => {
    if (phase === 'subject') {
      if (sameTokenSet(subjectSelection, activity.subjectTokenIds)) {
        playLearningFeedback('correct');
        setErrorMsg(null);
        setPhase('predicate');
      } else {
        playLearningFeedback('incorrect');
        setErrorMsg(activity.incorrectSubjectFeedback);
      }
      return;
    }

    if (phase === 'predicate') {
      if (sameTokenSet(predicateSelection, activity.predicateTokenIds)) {
        playLearningFeedback('correct');
        setErrorMsg(null);
        setPhase('done');
        onSolved?.();
      } else {
        playLearningFeedback('incorrect');
        setErrorMsg(activity.incorrectPredicateFeedback);
      }
    }
  };

  const handleReset = () => {
    setPhase('subject');
    setSubjectSelection([]);
    setPredicateSelection([]);
    setErrorMsg(null);
  };

  const subjectTokens = activity.sentence.tokens.filter((t) => t.groupRole === 'subject');
  const predicateTokens = activity.sentence.tokens.filter((t) => t.groupRole === 'predicate');

  const activeSelection = phase === 'subject' ? subjectSelection : predicateSelection;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-[#263A70]">
          {activity.title}
        </h3>
        <p className="text-sm text-[#333333]">{activity.instruction}</p>
      </div>

      {/* Phase Banner */}
      <div
        className={[
          'rounded-[12px] border px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold',
          phase === 'subject'
            ? 'bg-[#FFF4D6] border-[#F59B19] text-[#263A70]'
            : phase === 'predicate'
              ? 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]'
              : 'bg-[#D9FAF5] border-[#1FA89A] text-[#0E5A42]',
        ].join(' ')}
      >
        <span className="inline-flex items-center gap-1.5">
          {phase === 'subject' ? (
            <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <MessageSquare className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          )}
          <span>
            {phase === 'subject'
              ? 'Part 1 of 2: Tap every word in the Subject (Who or What)'
              : phase === 'predicate'
                ? 'Part 2 of 2: Now tap every word in the Predicate (starts with the verb)'
                : 'Complete structure verified!'}
          </span>
        </span>
      </div>

      {/* Sentence Token Stage */}
      <div className="rounded-[16px] bg-white border border-[#E5E2D9] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {activity.sentence.tokens.map((token, idx) => {
            const isConfirmedSubject =
              phase !== 'subject' && activity.subjectTokenIds.includes(token.id);
            const isConfirmedPredicate =
              phase === 'done' && activity.predicateTokenIds.includes(token.id);
            const isSelectedNow =
              (phase === 'subject' && subjectSelection.includes(token.id)) ||
              (phase === 'predicate' && predicateSelection.includes(token.id));

            return (
              <WordToken
                key={token.id}
                token={token}
                index={idx}
                isSelected={isSelectedNow}
                highlightedGroupRole={
                  isConfirmedSubject
                    ? 'subject'
                    : isConfirmedPredicate
                      ? 'predicate'
                      : null
                }
                showCategoryBadge={phase === 'done'}
                showHeadWordMarker={phase === 'done'}
                animateEntrance={false}
                onSelect={(t) => toggleToken(t.id)}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#4B5C8A]">
          <span className="tabular-nums">
            Selected words:{' '}
            <strong className="text-[#263A70]">
              {phase === 'done'
                ? activity.sentence.tokens.length
                : activeSelection.length}
            </strong>
          </span>

          <button
            type="button"
            onClick={() => {
              if (!showHint) playLearningFeedback('hint');
              setShowHint((h) => !h);
            }}
            className="inline-flex items-center gap-1 font-medium text-[#263A70] hover:underline min-h-[44px] px-1.5 cursor-pointer touch-manipulation"
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showHint ? 'Hide hint' : 'Need a hint?'}</span>
          </button>
        </div>

        {showHint ? (
          <p className="text-xs sm:text-sm rounded-[10px] bg-[#FFF1D5] border border-[#F2DFB6] px-3 py-2 text-[#333333]">
            {activity.hint}
          </p>
        ) : null}
      </div>

      {/* Controls */}
      {phase !== 'done' ? (
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCheck}
            disabled={activeSelection.length === 0}
          >
            {phase === 'subject' ? 'Confirm Subject' : 'Check Sentence Structure'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={subjectSelection.length === 0 && predicateSelection.length === 0}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reset
          </Button>
        </div>
      ) : null}

      {/* Immediate Feedback */}
      {errorMsg ? (
        <PracticeFeedback
          status="try-again"
          title="Check the boundary"
          message={errorMsg}
        />
      ) : null}

      {phase === 'done' ? (
        <div className="space-y-3">
          <PracticeFeedback
            status="correct"
            title="Both parts identified!"
            message={activity.correctFeedback}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <WordGroup
              role="subject"
              tokens={subjectTokens}
              headWord={activity.sentence.structureSummary.subjectHeadWord}
            />
            <WordGroup
              role="predicate"
              tokens={predicateTokens}
              headWord={activity.sentence.structureSummary.predicateHeadWord}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
