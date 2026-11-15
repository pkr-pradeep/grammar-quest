/**
 * ============================================================================
 * GRAMMAR QUEST — SENTENCE BUILDER ACTIVITY (LAB C)
 * ============================================================================
 * Students tap scrambled word tiles to assemble a sentence in order, see the
 * Subject and Predicate structure reveal on check, and receive immediate feedback.
 * ============================================================================
 */

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { SentenceConstructionActivity } from '../../../schemas/grammarEngine.schema';
import { Button } from '../../../components';
import { WordTile } from './WordTile';
import { PracticeFeedback } from './PracticeFeedback';

export interface SentenceBuilderProps {
  activity: SentenceConstructionActivity;
  onSolved?: () => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  activity,
  onSolved,
}) => {
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [checkedState, setCheckedState] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const tileMap = new Map(activity.tiles.map((t) => [t.id, t]));
  const remainingTiles = activity.tiles.filter((t) => !placedIds.includes(t.id));

  const handleAddTile = (id: string) => {
    setCheckedState('idle');
    setPlacedIds((prev) => [...prev, id]);
  };

  const handleRemoveTile = (id: string) => {
    setCheckedState('idle');
    setPlacedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleCheck = () => {
    const isExact =
      placedIds.length === activity.correctOrderIds.length &&
      activity.correctOrderIds.every((id, idx) => placedIds[idx] === id);

    if (isExact) {
      setCheckedState('correct');
      onSolved?.();
    } else {
      setCheckedState('incorrect');
    }
  };

  const handleReset = () => {
    setPlacedIds([]);
    setCheckedState('idle');
  };

  const allPlaced = placedIds.length === activity.tiles.length;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-[#263A70]">
          {activity.title}
        </h3>
        <p className="text-sm text-[#333333]">{activity.instruction}</p>
        <p className="text-xs font-medium text-[#4B5C8A]">{activity.promptContext}</p>
      </div>

      {/* Sentence Assembly Tray */}
      <div className="rounded-[16px] bg-white border-2 border-dashed border-[#CFC9BA] p-4 min-h-[76px] flex flex-wrap items-center gap-2">
        {placedIds.length === 0 ? (
          <span className="text-xs sm:text-sm text-[#5A6478]">
            Tap word tiles below in order to build your sentence here…
          </span>
        ) : (
          placedIds.map((id) => {
            const tile = tileMap.get(id);
            if (!tile) return null;
            return (
              <WordTile
                key={tile.id}
                text={tile.text}
                category={checkedState === 'correct' ? tile.category : undefined}
                tone={checkedState === 'correct' ? tile.groupRole : 'active'}
                onClick={() => handleRemoveTile(tile.id)}
                ariaLabel={`Remove ${tile.text}`}
              />
            );
          })
        )}
      </div>

      {/* Scrambled Tile Bank */}
      {remainingTiles.length > 0 ? (
        <div className="rounded-[16px] bg-[#FDFCF9] border border-[#E5E2D9] p-3.5 space-y-2">
          <p className="text-xs font-medium text-[#4B5C8A]">Available word tiles:</p>
          <div className="flex flex-wrap gap-2">
            {remainingTiles.map((tile) => (
              <WordTile
                key={tile.id}
                text={tile.text}
                onClick={() => handleAddTile(tile.id)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button variant="primary" size="sm" onClick={handleCheck} disabled={!allPlaced}>
          Check Sentence
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={placedIds.length === 0}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Clear
        </Button>
      </div>

      {/* Feedback & Subject/Predicate Split Reveal */}
      {checkedState === 'correct' ? (
        <div className="space-y-3">
          <PracticeFeedback
            status="correct"
            title="Clear sentence constructed"
            message={activity.correctFeedback}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-[12px] bg-[#FFF4D6] border border-[#F59B19] p-3">
              <p className="text-xs font-semibold text-[#A15C00]">
                {activity.part1Label ?? 'Subject'}
              </p>
              <p className="font-semibold text-[#263A70]">{activity.subjectText}</p>
            </div>
            <div className="rounded-[12px] bg-[#D9FAF5] border border-[#1FA89A] p-3">
              <p className="text-xs font-semibold text-[#0F766E]">
                {activity.part2Label ?? 'Predicate'}
              </p>
              <p className="font-semibold text-[#263A70]">{activity.predicateText}</p>
            </div>
          </div>
        </div>
      ) : null}

      {checkedState === 'incorrect' ? (
        <PracticeFeedback
          status="try-again"
          title="Check your word order"
          message={activity.incorrectFeedback}
        />
      ) : null}
    </div>
  );
};
