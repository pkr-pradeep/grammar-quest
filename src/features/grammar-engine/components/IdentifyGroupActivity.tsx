/**
 * ============================================================================
 * GRAMMAR QUEST — IDENTIFY GROUP ACTIVITY (LAB A)
 * ============================================================================
 * Reusable activity where students tap individual words belonging to the
 * target grammatical group (Subject or Predicate), check their selection, and
 * receive immediate explanatory feedback.
 * ============================================================================
 */

import React, { useState } from 'react';
import { HelpCircle, RotateCcw } from 'lucide-react';
import type { IdentifyGroupActivity as IdentifyGroupActivityData } from '../../../schemas/grammarEngine.schema';
import { Button } from '../../../components';
import { WordToken } from './WordToken';
import { WordGroup } from './WordGroup';
import { PracticeFeedback } from './PracticeFeedback';
import { ActivityCharacterNote } from './ActivityCharacterNote';

export interface IdentifyGroupActivityProps {
  activity: IdentifyGroupActivityData;
  onSolved?: () => void;
}

export const IdentifyGroupActivity: React.FC<IdentifyGroupActivityProps> = ({
  activity,
  onSolved,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [checkedState, setCheckedState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);

  const toggleToken = (tokenId: string) => {
    setCheckedState('idle');
    setSelectedIds((prev) =>
      prev.includes(tokenId) ? prev.filter((id) => id !== tokenId) : [...prev, tokenId],
    );
  };

  const handleCheck = () => {
    const selectedSet = new Set(selectedIds);
    const correctSet = new Set(activity.correctTokenIds);
    const isExactMatch =
      selectedSet.size === correctSet.size &&
      [...correctSet].every((id) => selectedSet.has(id));

    if (isExactMatch) {
      setCheckedState('correct');
      onSolved?.();
    } else {
      setCheckedState('incorrect');
    }
  };

  const handleReset = () => {
    setSelectedIds([]);
    setCheckedState('idle');
  };

  const subjectTokens = activity.sentence.tokens.filter((t) => t.groupRole === 'subject');
  const predicateTokens = activity.sentence.tokens.filter((t) => t.groupRole === 'predicate');

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-[#263A70]">
          {activity.title}
        </h3>
        <p className="text-sm text-[#333333]">{activity.instruction}</p>
      </div>

      {activity.characterTip ? <ActivityCharacterNote tip={activity.characterTip} /> : null}

      {/* Tap-to-select sentence tokens */}
      <div className="rounded-[16px] bg-white border border-[#E5E2D9] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {activity.sentence.tokens.map((token, idx) => (
            <WordToken
              key={token.id}
              token={token}
              index={idx}
              isSelected={selectedIds.includes(token.id)}
              showCategoryBadge={checkedState === 'correct'}
              showHeadWordMarker={checkedState === 'correct'}
              animateEntrance={false}
              onSelect={(t) => toggleToken(t.id)}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#4B5C8A]">
          <span className="tabular-nums">
            Selected words: <strong className="text-[#263A70]">{selectedIds.length}</strong>
          </span>
          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
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

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          variant="primary"
          size="sm"
          onClick={handleCheck}
          disabled={selectedIds.length === 0}
        >
          Check Answer
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={selectedIds.length === 0 && checkedState === 'idle'}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Clear
        </Button>
      </div>

      {/* Immediate Feedback */}
      {checkedState === 'correct' ? (
        <div className="space-y-3">
          <PracticeFeedback
            status="correct"
            title={activity.correctTitle ?? 'Correct group selected'}
            message={activity.correctFeedback}
          />
          {!activity.hideRoleGroupsOnSuccess ? (
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
          ) : null}
        </div>
      ) : null}

      {checkedState === 'incorrect' ? (
        <PracticeFeedback
          status="try-again"
          title={activity.incorrectTitle ?? 'Look closely at the boundary'}
          message={activity.incorrectFeedback}
        />
      ) : null}
    </div>
  );
};
