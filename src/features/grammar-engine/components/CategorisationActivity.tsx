/**
 * ============================================================================
 * GRAMMAR QUEST — CATEGORISATION ACTIVITY (LAB B)
 * ============================================================================
 * Touch-friendly categorisation activity: students tap a word-group tile and
 * tap Subject or Predicate to place it (or tap placed tiles to move/remove).
 * Zero reliance on fragile drag-only gestures on narrow 390px mobile screens.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Clock, Layers, MessageSquare, RotateCcw, ShieldCheck } from 'lucide-react';
import type {
  CategoriseActivity as CategoriseActivityData,
  CategoriseBucketTone,
} from '../../../schemas/grammarEngine.schema';
import { Button } from '../../../components';
import { WordTile } from './WordTile';
import { PracticeFeedback } from './PracticeFeedback';

export interface CategorisationActivityProps {
  activity: CategoriseActivityData;
  onSolved?: () => void;
}

const BUCKET_STYLES: Record<
  CategoriseBucketTone | 'default',
  { box: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  subject: { box: 'bg-[#FFF4D6] border-[#F59B19]', Icon: Layers },
  predicate: { box: 'bg-[#D9FAF5] border-[#1FA89A]', Icon: MessageSquare },
  past: { box: 'bg-[#FFF4D6] border-[#F59B19]', Icon: Clock },
  present: { box: 'bg-[#D9FAF5] border-[#1FA89A]', Icon: Clock },
  future: { box: 'bg-[#ECE6FB] border-[#5B43C2]', Icon: Clock },
  singular: { box: 'bg-[#FFF4D6] border-[#F59B19]', Icon: ShieldCheck },
  plural: { box: 'bg-[#D9FAF5] border-[#1FA89A]', Icon: Layers },
  default: { box: 'bg-[#D9FAF5] border-[#1FA89A]', Icon: MessageSquare },
};

function resolveBucketTone(
  catId: string,
  explicitTone?: CategoriseBucketTone,
): CategoriseBucketTone {
  if (explicitTone) return explicitTone;
  if (
    catId === 'subject' ||
    catId === 'predicate' ||
    catId === 'past' ||
    catId === 'present' ||
    catId === 'future' ||
    catId === 'singular' ||
    catId === 'plural'
  ) {
    return catId;
  }
  return 'predicate';
}

export const CategorisationActivity: React.FC<CategorisationActivityProps> = ({
  activity,
  onSolved,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    activity.items[0]?.id ?? null,
  );
  const [placements, setPlacements] = useState<Record<string, string | undefined>>({});
  const [checked, setChecked] = useState(false);

  const unplacedItems = activity.items.filter((item) => !placements[item.id]);

  const handleAssignCategory = (category: string) => {
    if (!selectedItemId) return;
    setChecked(false);
    setPlacements((prev) => {
      const next = { ...prev, [selectedItemId]: category };
      const nextUnplaced = activity.items.find((it) => !next[it.id]);
      setSelectedItemId(nextUnplaced ? nextUnplaced.id : null);
      return next;
    });
  };

  const handleUnplace = (itemId: string) => {
    setChecked(false);
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setSelectedItemId(itemId);
  };

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = activity.items.every(
      (item) => placements[item.id] === item.correctCategory,
    );
    if (allCorrect) {
      onSolved?.();
    }
  };

  const handleReset = () => {
    setPlacements({});
    setChecked(false);
    setSelectedItemId(activity.items[0]?.id ?? null);
  };

  const allPlaced = activity.items.every((item) => Boolean(placements[item.id]));
  const allCorrect =
    allPlaced && activity.items.every((item) => placements[item.id] === item.correctCategory);

  const gridColsClass =
    activity.categories.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-[#263A70]">
          {activity.title}
        </h3>
        <p className="text-sm text-[#333333]">{activity.instruction}</p>
      </div>

      {/* Unplaced Word Group Bank */}
      <div className="rounded-[16px] bg-white border border-[#E5E2D9] p-4 space-y-2.5">
        <p className="text-xs font-semibold text-[#4B5C8A]">
          {unplacedItems.length > 0
            ? (activity.promptText ?? '1. Tap a card below, then tap the matching group:')
            : 'All cards placed! Tap any placed card to move it back, or check your sorting.'}
        </p>

        <div className="flex flex-wrap gap-2">
          {unplacedItems.map((item) => (
            <WordTile
              key={item.id}
              text={item.text}
              isSelected={selectedItemId === item.id}
              onClick={() => setSelectedItemId(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Category Buckets */}
      <div className={`grid grid-cols-1 ${gridColsClass} gap-3`}>
        {activity.categories.map((cat) => {
          const itemsInCat = activity.items.filter((it) => placements[it.id] === cat.id);
          const resolvedTone = resolveBucketTone(cat.id, cat.tone);
          const { box: bucketStyle, Icon } = BUCKET_STYLES[resolvedTone] ?? BUCKET_STYLES.default;

          return (
            <div
              key={cat.id}
              className={`rounded-[16px] border-2 p-3.5 space-y-2.5 ${bucketStyle}`}
            >
              <button
                type="button"
                onClick={() => handleAssignCategory(cat.id)}
                disabled={!selectedItemId}
                className={[
                  'w-full flex items-center justify-between gap-2 text-left rounded-[12px] px-3 py-2 min-h-[44px]',
                  'bg-white border border-[#E5E2D9] transition-colors',
                  selectedItemId
                    ? 'cursor-pointer hover:border-[#263A70]'
                    : 'opacity-80 cursor-default',
                ].join(' ')}
              >
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#263A70]">
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{cat.label}</span>
                </span>
                <span className="text-xs font-medium text-[#4B5C8A]">
                  {selectedItemId ? 'Tap to place here' : cat.helperText}
                </span>
              </button>

              <div className="flex flex-wrap gap-2 min-h-[44px]">
                {itemsInCat.length === 0 ? (
                  <span className="text-xs text-[#4B5C8A] self-center px-1">
                    {cat.helperText}
                  </span>
                ) : (
                  itemsInCat.map((item) => {
                    const isWrongAfterCheck =
                      checked && item.correctCategory !== cat.id;
                    return (
                      <WordTile
                        key={item.id}
                        text={isWrongAfterCheck ? `${item.text} (Move)` : item.text}
                        tone={resolvedTone}
                        onClick={() => handleUnplace(item.id)}
                        ariaLabel={`Remove ${item.text} from ${cat.label}`}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button variant="primary" size="sm" onClick={handleCheck} disabled={!allPlaced}>
          Check Sorting
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={Object.keys(placements).length === 0}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Reset
        </Button>
      </div>

      {/* Feedback */}
      {checked ? (
        allCorrect ? (
          <PracticeFeedback
            status="correct"
            title="All cards sorted accurately"
            message={activity.completeFeedback}
          />
        ) : (
          <PracticeFeedback
            status="try-again"
            title="One or more cards belong in another group"
            message={
              activity.incorrectFeedback ??
              'Check each clue word or verb form carefully, then tap any marked card to move it.'
            }
          />
        )
      ) : null}
    </div>
  );
};
