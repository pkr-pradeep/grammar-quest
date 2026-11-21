/**
 * ============================================================================
 * GRAMMAR QUEST — INTERACTIVE CATEGORISATION ACTIVITY (LAB B: SORT)
 * ============================================================================
 * Tap-to-select + tap-to-place + optional pointer drag-and-drop sorting
 * workspace with instant checking, live 3-star scoring, ShukaJi guide reactions
 * & hints, celebration confetti, and full-sentence pair reveal.
 * ============================================================================
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Clock,
  HelpCircle,
  Layers,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import type {
  CategoriseActivity as CategoriseActivityData,
  CategoriseBucketTone,
  CategoriseItem,
} from '../../../schemas/grammarEngine.schema';
import { SpeakerPortrait } from '../speakerTheme';

export interface CategorisationActivityProps {
  activity: CategoriseActivityData;
  resetNonce?: number;
  onSolved?: (stars: 1 | 2 | 3) => void;
  onProgressChange?: (hasProgress: boolean) => void;
}

type BubbleMood = 'neutral' | 'success' | 'wrong';
type BadgeStatus = 'none' | 'correct' | 'wrong';

interface ConfettiPiece {
  id: number;
  leftPercent: number;
  color: string;
  widthPx: number;
  heightPx: number;
  durationSec: number;
  delaySec: number;
  driftPx: number;
  rotateDeg: number;
}

const CONFETTI_COLORS = ['#F6B93B', '#1FA89B', '#E55B4B', '#5B43C2', '#22A06B'];

const CONFETTI_PIECES: ConfettiPiece[] = Array.from({ length: 30 }, (_, idx) => ({
  id: idx,
  leftPercent: 3 + ((idx * 3.25) % 94),
  color: CONFETTI_COLORS[idx % CONFETTI_COLORS.length],
  widthPx: idx % 3 === 0 ? 10 : 8,
  heightPx: idx % 2 === 0 ? 6 : 10,
  durationSec: 1.7 + ((idx * 17) % 13) * 0.1,
  delaySec: ((idx * 7) % 10) * 0.04,
  driftPx: (idx % 2 === 0 ? 1 : -1) * (12 + ((idx * 11) % 28)),
  rotateDeg: (idx % 2 === 0 ? 1 : -1) * (240 + ((idx * 37) % 240)),
}));

interface BucketPalette {
  boxBg: string;
  boxBorder: string;
  iconBg: string;
  iconText: string;
  chipBorder: string;
  checkColor: string;
  defaultShortHelper: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const BUCKET_PALETTES: Record<CategoriseBucketTone, BucketPalette> = {
  subject: {
    boxBg: '#FEF1CC',
    boxBorder: '#E9A62B',
    iconBg: '#FDE29B',
    iconText: '#8A4B08',
    chipBorder: '#E9A62B',
    checkColor: '#B4600F',
    defaultShortHelper: 'Who / What',
    Icon: Layers,
  },
  predicate: {
    boxBg: '#D7F5EE',
    boxBorder: '#1FA89B',
    iconBg: '#B3ECE0',
    iconText: '#0A5C55',
    chipBorder: '#1FA89B',
    checkColor: '#0F7F76',
    defaultShortHelper: 'What is said',
    Icon: MessageSquare,
  },
  past: {
    boxBg: '#FEF1CC',
    boxBorder: '#E9A62B',
    iconBg: '#FDE29B',
    iconText: '#8A4B08',
    chipBorder: '#E9A62B',
    checkColor: '#B4600F',
    defaultShortHelper: 'Already finished',
    Icon: Clock,
  },
  present: {
    boxBg: '#D7F5EE',
    boxBorder: '#1FA89B',
    iconBg: '#B3ECE0',
    iconText: '#0A5C55',
    chipBorder: '#1FA89B',
    checkColor: '#0F7F76',
    defaultShortHelper: 'Habit or now',
    Icon: Clock,
  },
  future: {
    boxBg: '#ECE6FB',
    boxBorder: '#5B43C2',
    iconBg: '#DDD3F8',
    iconText: '#432E9E',
    chipBorder: '#5B43C2',
    checkColor: '#5B43C2',
    defaultShortHelper: 'Planned ahead',
    Icon: Clock,
  },
  singular: {
    boxBg: '#FEF1CC',
    boxBorder: '#E9A62B',
    iconBg: '#FDE29B',
    iconText: '#8A4B08',
    chipBorder: '#E9A62B',
    checkColor: '#B4600F',
    defaultShortHelper: 'is / was / has',
    Icon: ShieldCheck,
  },
  plural: {
    boxBg: '#D7F5EE',
    boxBorder: '#1FA89B',
    iconBg: '#B3ECE0',
    iconText: '#0A5C55',
    chipBorder: '#1FA89B',
    checkColor: '#0F7F76',
    defaultShortHelper: 'are / were / have',
    Icon: Layers,
  },
  sky: {
    boxBg: '#EBF2FF',
    boxBorder: '#4C6EF5',
    iconBg: '#D5E3FF',
    iconText: '#2A43A6',
    chipBorder: '#4C6EF5',
    checkColor: '#2A43A6',
    defaultShortHelper: 'Question or clue',
    Icon: HelpCircle,
  },
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
    catId === 'plural' ||
    catId === 'sky'
  ) {
    return catId;
  }
  return 'predicate';
}

export function computeSortStars(mistakes: number, hintsUsed: number): 1 | 2 | 3 {
  if (mistakes === 0 && hintsUsed === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

function buildFallbackHint(item: CategoriseItem, activity: CategoriseActivityData): string {
  if (item.hint) return item.hint;
  if (item.correctCategory === 'subject') {
    return 'Check if this phrase names who or what, without starting with a verb.';
  }
  if (item.correctCategory === 'predicate') {
    return 'Look at the opening word — does it start with a finite verb telling what happens?';
  }
  const cat = activity.categories.find((c) => c.id === item.correctCategory);
  return cat
    ? `Look closely at the verb or clue words — think about "${cat.helperText}".`
    : 'Look closely at the verb and clue words in this card.';
}

function getDefaultBubbleText(activity: CategoriseActivityData): string {
  const isSubjectPredicate =
    activity.categories.some((c) => c.id === 'subject') &&
    activity.categories.some((c) => c.id === 'predicate');
  if (isSubjectPredicate) {
    return 'Tap a card below, then tap Subject or Predicate to sort it!';
  }
  const names = activity.categories.map((c) => c.label).join(' / ');
  return `Tap a card below, then tap the right group (${names}).`;
}

export const CategorisationActivity: React.FC<CategorisationActivityProps> = ({
  activity,
  resetNonce = 0,
  onSolved,
  onProgressChange,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [placedMap, setPlacedMap] = useState<Record<string, string>>({});
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintedItemIds, setHintedItemIds] = useState<string[]>([]);

  const [bubbleMood, setBubbleMood] = useState<BubbleMood>('neutral');
  const [bubbleText, setBubbleText] = useState<string>(() => getDefaultBubbleText(activity));
  const [badgeStatus, setBadgeStatus] = useState<BadgeStatus>('none');
  const [hopNonce, setHopNonce] = useState(0);

  const [justPlacedId, setJustPlacedId] = useState<string | null>(null);
  const [flashCorrectGroupId, setFlashCorrectGroupId] = useState<string | null>(null);
  const [shakingCardId, setShakingCardId] = useState<string | null>(null);
  const [wrongGroupId, setWrongGroupId] = useState<string | null>(null);
  const [wrongTagGroupId, setWrongTagGroupId] = useState<string | null>(null);
  const [shakeNonce, setShakeNonce] = useState(0);

  const [showConfetti, setShowConfetti] = useState(false);

  // Pointer drag state (optional alongside tap-to-place)
  const [dragState, setDragState] = useState<{
    itemId: string;
    text: string;
    x: number;
    y: number;
    hoverGroupId: string | null;
  } | null>(null);
  const suppressNextClickRef = useRef(false);

  const timersRef = useRef<number[]>([]);
  const registerTimer = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };
  const clearAllTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  // External reset trigger from pinned bottom bar
  useEffect(() => {
    if (resetNonce === 0) return;
    clearAllTimers();
    setSelectedItemId(null);
    setPlacedMap({});
    setMistakes(0);
    setHintsUsed(0);
    setHintedItemIds([]);
    setBubbleMood('neutral');
    setBubbleText(getDefaultBubbleText(activity));
    setBadgeStatus('none');
    setJustPlacedId(null);
    setFlashCorrectGroupId(null);
    setShakingCardId(null);
    setWrongGroupId(null);
    setWrongTagGroupId(null);
    setShowConfetti(false);
    setDragState(null);
    onProgressChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetNonce]);

  const totalCount = activity.items.length;
  const placedCount = Object.keys(placedMap).length;
  const unplacedItems = activity.items.filter((item) => !placedMap[item.id]);
  const isFinished = totalCount > 0 && placedCount === totalCount;
  const liveStars = computeSortStars(mistakes, hintsUsed);

  const hasProgress =
    placedCount > 0 || mistakes > 0 || hintsUsed > 0 || selectedItemId !== null;

  useEffect(() => {
    onProgressChange?.(hasProgress);
  }, [hasProgress, onProgressChange]);

  const expectedCountsByGroup = useMemo(() => {
    const counts: Record<string, number> = {};
    activity.categories.forEach((c) => {
      counts[c.id] = activity.items.filter((it) => it.correctCategory === c.id).length;
    });
    return counts;
  }, [activity]);

  const triggerShukaJiHop = () => {
    setHopNonce((n) => n + 1);
  };

  const handleCardSelect = (item: CategoriseItem) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    if (placedMap[item.id] || isFinished) return;

    setBadgeStatus('none');
    setWrongTagGroupId(null);

    if (selectedItemId === item.id) {
      setSelectedItemId(null);
      setBubbleMood('neutral');
      setBubbleText(getDefaultBubbleText(activity));
    } else {
      setSelectedItemId(item.id);
      setBubbleMood('neutral');
      const isSP =
        activity.categories.some((c) => c.id === 'subject') &&
        activity.categories.some((c) => c.id === 'predicate');
      setBubbleText(
        isSP
          ? `Selected! Now tap Subject (Who/What) or Predicate (What is said).`
          : `Selected! Now tap the right group below for this card.`,
      );
    }
  };

  const attemptPlaceCard = (itemId: string, categoryId: string) => {
    const item = activity.items.find((it) => it.id === itemId);
    if (!item || placedMap[item.id] || isFinished) return;

    const targetCategory = activity.categories.find((c) => c.id === categoryId);
    const catLabel = targetCategory?.label ?? categoryId;

    if (item.correctCategory === categoryId) {
      const nextPlaced = { ...placedMap, [item.id]: categoryId };
      const nextPlacedCount = Object.keys(nextPlaced).length;
      const finishedNow = nextPlacedCount === totalCount;

      setPlacedMap(nextPlaced);
      setSelectedItemId(null);
      setWrongTagGroupId(null);
      setWrongGroupId(null);
      setShakingCardId(null);
      setJustPlacedId(item.id);
      setFlashCorrectGroupId(categoryId);
      setBadgeStatus('correct');
      setBubbleMood('success');
      triggerShukaJiHop();

      registerTimer(() => {
        setFlashCorrectGroupId((curr) => (curr === categoryId ? null : curr));
      }, 650);
      registerTimer(() => {
        setJustPlacedId((curr) => (curr === item.id ? null : curr));
      }, 650);

      if (finishedNow) {
        const finalStars = computeSortStars(mistakes, hintsUsed);
        const isSubjectPredicateSort =
          activity.categories.some((c) => c.id === 'subject') &&
          activity.categories.some((c) => c.id === 'predicate');
        setBubbleText(
          mistakes === 0 && hintsUsed === 0 && isSubjectPredicateSort
            ? 'All sorted with zero slips! Read how the Subjects and Predicates pair up.'
            : activity.completeFeedback,
        );
        if (!prefersReducedMotion) {
          setShowConfetti(true);
          registerTimer(() => setShowConfetti(false), 3200);
        }
        onSolved?.(finalStars);
      } else if (categoryId === 'subject') {
        setBubbleText(`Yes! "${item.text}" names who or what — that's the Subject.`);
      } else if (categoryId === 'predicate') {
        setBubbleText(`Spot on! "${item.text}" starts with the verb — that's the Predicate.`);
      } else {
        setBubbleText(
          item.explanation
            ? `Yes (${catLabel})! ${item.explanation}`
            : `Yes! "${item.text}" belongs in ${catLabel}.`,
        );
      }
      return;
    }

    // Wrong placement
    setMistakes((m) => m + 1);
    setSelectedItemId(item.id);
    setShakingCardId(item.id);
    setWrongGroupId(categoryId);
    setWrongTagGroupId(categoryId);
    setShakeNonce((n) => n + 1);
    setBadgeStatus('wrong');
    setBubbleMood('wrong');
    triggerShukaJiHop();

    if (categoryId === 'subject') {
      setBubbleText(
        `Not Subject — check the start of "${item.text}"! Look for the verb.`,
      );
    } else if (categoryId === 'predicate') {
      setBubbleText(
        `Not Predicate — "${item.text}" has no verb yet; it names who or what!`,
      );
    } else {
      setBubbleText(
        `Not quite ${catLabel} — check the clue or verb form and try another group.`,
      );
    }

    registerTimer(() => {
      setShakingCardId((curr) => (curr === item.id ? null : curr));
      setWrongGroupId((curr) => (curr === categoryId ? null : curr));
    }, 520);
  };

  const handleGroupTap = (categoryId: string) => {
    if (isFinished) return;
    if (!selectedItemId) {
      setBubbleMood('neutral');
      setBadgeStatus('none');
      setBubbleText('Tap a card first, then tap the group it belongs to.');
      triggerShukaJiHop();
      return;
    }
    attemptPlaceCard(selectedItemId, categoryId);
  };

  const handleHint = () => {
    if (isFinished) return;
    const targetItem =
      (selectedItemId ? unplacedItems.find((it) => it.id === selectedItemId) : null) ??
      unplacedItems[0];
    if (!targetItem) return;

    if (!selectedItemId) {
      setSelectedItemId(targetItem.id);
    }
    if (!hintedItemIds.includes(targetItem.id)) {
      setHintedItemIds((prev) => [...prev, targetItem.id]);
      setHintsUsed((h) => h + 1);
    }
    setBadgeStatus('none');
    setBubbleMood('neutral');
    setBubbleText(`Hint: ${buildFallbackHint(targetItem, activity)}`);
    triggerShukaJiHop();
  };

  // Optional pointer drag-and-drop without interfering with tap-to-place or mobile vertical touch scroll
  const handleCardPointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    item: CategoriseItem,
  ) => {
    if (placedMap[item.id] || isFinished) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const isTouch = e.pointerType === 'touch';
    const startX = e.clientX;
    const startY = e.clientY;
    let dragging = false;
    let cancelledForScroll = false;

    const findGroupUnderPoint = (cx: number, cy: number): string | null => {
      const els = document.elementsFromPoint(cx, cy);
      for (const el of els) {
        const dropZone = (el as HTMLElement).closest?.('[data-group-dropzone]') as
          | HTMLElement
          | null;
        if (dropZone?.dataset.groupDropzone) {
          return dropZone.dataset.groupDropzone;
        }
      }
      return null;
    };

    const cleanup = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (cancelledForScroll) return;
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (!dragging) {
        if (isTouch) {
          // Yield to native vertical scroll whenever vertical motion dominates
          if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx)) {
            cancelledForScroll = true;
            cleanup();
            return;
          }
          // Only enter drag on touch when deliberately dragging horizontally
          if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            dragging = true;
            setSelectedItemId(item.id);
            setWrongTagGroupId(null);
          }
        } else if (Math.hypot(dx, dy) > 9) {
          dragging = true;
          setSelectedItemId(item.id);
          setWrongTagGroupId(null);
        }
      }

      if (dragging) {
        const hoverGroupId = findGroupUnderPoint(moveEvent.clientX, moveEvent.clientY);
        setDragState({
          itemId: item.id,
          text: item.text,
          x: moveEvent.clientX,
          y: moveEvent.clientY,
          hoverGroupId,
        });
      }
    };

    const handlePointerCancel = () => {
      cleanup();
      dragging = false;
      setDragState(null);
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      cleanup();

      if (dragging) {
        suppressNextClickRef.current = true;
        const dropGroupId = findGroupUnderPoint(upEvent.clientX, upEvent.clientY);
        setDragState(null);
        if (dropGroupId) {
          attemptPlaceCard(item.id, dropGroupId);
        }
        window.setTimeout(() => {
          suppressNextClickRef.current = false;
        }, 80);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
  };

  // Derive sentence pairs for completion display (explicit in JSON or fallback pairing)
  const resolvedSentencePairs = useMemo(() => {
    if (activity.sentencePairs && activity.sentencePairs.length > 0) {
      return activity.sentencePairs;
    }
    const subjects = activity.items.filter((it) => it.correctCategory === 'subject');
    const predicates = activity.items.filter((it) => it.correctCategory === 'predicate');
    if (subjects.length > 0 && subjects.length === predicates.length) {
      return subjects.map((subj, idx) => ({
        id: `${subj.id}-${predicates[idx].id}`,
        subjectText: subj.text,
        predicateText: predicates[idx].text,
      }));
    }
    return [];
  }, [activity]);

  const bubbleColors =
    bubbleMood === 'success'
      ? 'bg-[#DDF6E7] border-[#8FD9AE] text-[#144D2E]'
      : bubbleMood === 'wrong'
        ? 'bg-[#FFEBDD] border-[#F2B79A] text-[#6E2C0E]'
        : 'bg-[#E5F4E9] border-[#A8D4B5] text-[#1D4932]';

  const bubbleArrowFill =
    bubbleMood === 'success'
      ? '#DDF6E7'
      : bubbleMood === 'wrong'
        ? '#FFEBDD'
        : '#E5F4E9';

  const bubbleArrowBorder =
    bubbleMood === 'success'
      ? '#8FD9AE'
      : bubbleMood === 'wrong'
        ? '#F2B79A'
        : '#A8D4B5';

  const shukaExpression = isFinished
    ? 'celebrating'
    : bubbleMood === 'wrong'
      ? 'encouraging'
      : bubbleMood === 'success'
        ? 'happy'
        : 'explaining';

  const groupGridClass =
    activity.categories.length === 2 || activity.categories.length === 4
      ? 'grid grid-cols-2 gap-[10px]'
      : 'grid grid-cols-1 sm:grid-cols-3 gap-2.5';

  return (
    <div className="space-y-2">
      {/* Celebration Confetti Layer (3.2s, non-blocking, hidden in reduced-motion) */}
      {showConfetti && !prefersReducedMotion ? (
        <div
          aria-hidden="true"
          className="gq-sort-confetti-layer pointer-events-none fixed inset-0 z-40 overflow-hidden"
        >
          {CONFETTI_PIECES.map((piece) => (
            <span
              key={piece.id}
              className="gq-sort-confetti-piece absolute top-0 rounded-[2px]"
              style={
                {
                  left: `${piece.leftPercent}%`,
                  width: `${piece.widthPx}px`,
                  height: `${piece.heightPx}px`,
                  backgroundColor: piece.color,
                  animationDuration: `${piece.durationSec}s`,
                  animationDelay: `${piece.delaySec}s`,
                  '--gq-conf-dx': `${piece.driftPx}px`,
                  '--gq-conf-rot': `${piece.rotateDeg}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      {/* Floating Drag Ghost */}
      {dragState ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 rounded-[16px] bg-[#FDEBC0] border-[2.5px] border-[#1B2559] px-[14px] py-[9px] text-[13.5px] font-bold text-[#1B2559] shadow-[0_12px_24px_rgba(27,37,89,0.22)] -translate-x-1/2 -translate-y-1/2"
          style={{ left: dragState.x, top: dragState.y }}
        >
          {dragState.text}
        </div>
      ) : null}

      {/* 1. Title + Live Stars + N-Segment Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-[17px] leading-tight font-extrabold text-[#1B2559] truncate">
            {activity.title}
          </h2>

          <div
            className="inline-flex items-center gap-0.5 shrink-0"
            role="img"
            aria-label={`${liveStars} out of 3 stars`}
          >
            {[1, 2, 3].map((idx) => {
              const earned = idx <= liveStars;
              return (
                <Star
                  key={idx}
                  aria-hidden="true"
                  className={[
                    'w-4 h-4 transition-colors duration-200',
                    earned
                      ? 'fill-[#F6B93B] text-[#C87F0A]'
                      : 'fill-[#E5DEC9] text-[#B8AE94]',
                  ].join(' ')}
                />
              );
            })}
            <span className="sr-only">{liveStars} out of 3 stars</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className="flex-1 grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${Math.max(totalCount, 1)}, minmax(0, 1fr))`,
            }}
            aria-hidden="true"
          >
            {activity.items.map((item, idx) => {
              const isFilled = idx < placedCount;
              return (
                <div
                  key={item.id}
                  className={[
                    'h-[8px] rounded-full transition-colors duration-200',
                    isFilled ? 'bg-[#F6B93B]' : 'bg-[#EDE5CF]',
                  ].join(' ')}
                />
              );
            })}
          </div>
          <span className="text-[11.5px] font-bold text-[#4A5170] tabular-nums shrink-0">
            {placedCount} of {totalCount} sorted
          </span>
        </div>
      </div>

      {/* 2. ShukaJi Guide Strip + Hint Button */}
      <div className="flex items-center gap-2.5">
        <div
          key={`shuka-hop-${hopNonce}`}
          className={[
            'relative shrink-0',
            hopNonce > 0 && !prefersReducedMotion ? 'gq-sort-shuka-hop' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <SpeakerPortrait
            characterId="shuka"
            expression={shukaExpression}
            pose={isFinished ? 'celebrating' : 'explaining'}
            sizePx={48}
            ringWidthPx={3}
            animatePop={false}
            floatGentle={!prefersReducedMotion}
          />
          {badgeStatus !== 'none' ? (
            <span
              aria-hidden="true"
              className={[
                'absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center shadow-xs',
                badgeStatus === 'correct' ? 'bg-[#1A8754]' : 'bg-[#B83E14]',
              ].join(' ')}
            >
              {badgeStatus === 'correct' ? (
                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
              ) : (
                <X className="w-2.5 h-2.5 text-white stroke-[3]" />
              )}
            </span>
          ) : null}
        </div>

        <div
          className={[
            'relative flex-1 min-w-0 rounded-[16px] border-[1.5px] px-3 py-1.5 min-h-[54px] flex items-center justify-between gap-2 transition-colors duration-250',
            bubbleColors,
          ].join(' ')}
        >
          {/* Speech bubble pointer toward ShukaJi */}
          <span
            aria-hidden="true"
            className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-l-[1.5px] border-b-[1.5px] transition-colors duration-250"
            style={{
              backgroundColor: bubbleArrowFill,
              borderColor: bubbleArrowBorder,
            }}
          />

          <p
            aria-live="polite"
            className="relative z-10 text-[12.5px] leading-[1.32] font-semibold min-w-0"
          >
            {bubbleText}
          </p>

          {!isFinished ? (
            <button
              type="button"
              onClick={handleHint}
              className="relative z-10 inline-flex items-center justify-center gap-1 min-h-[44px] px-2.5 rounded-[12px] bg-white border border-[#CBBDF3] text-[#5B43C2] hover:bg-[#F7F4FF] text-[12px] font-bold shrink-0 cursor-pointer transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Hint</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* 3. Card Tray OR Finish Celebration */}
      {!isFinished ? (
        <div className="rounded-[20px] bg-white border-[1.5px] border-[#E9E1CB] p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12.5px] font-extrabold text-[#1B2559]">
              {selectedItemId ? 'Now tap the right group below' : '1. Tap a card'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#F5EFE0] text-[#4A5170] text-[11px] font-bold tabular-nums shrink-0">
              {unplacedItems.length} left
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {unplacedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              const isShaking = shakingCardId === item.id;
              const isDraggingThis = dragState?.itemId === item.id;

              return (
                <button
                  key={`${item.id}-${isShaking ? shakeNonce : 'idle'}`}
                  type="button"
                  aria-pressed={isSelected}
                  onPointerDown={(e) => handleCardPointerDown(e, item)}
                  onClick={() => handleCardSelect(item)}
                  className={[
                    'min-h-[44px] rounded-[16px] px-[14px] py-[9px] text-[13.5px] font-bold text-[#1B2559] text-left leading-tight cursor-pointer select-none touch-pan-y transition-all duration-200',
                    isShaking
                      ? 'gq-sort-shake bg-[#FFEBDD] border-[2.5px] border-[#D95D24] -translate-y-[3px]'
                      : isSelected
                        ? 'bg-[#FDEBC0] border-[2.5px] border-[#1B2559] -translate-y-[3px] shadow-[0_6px_14px_rgba(27,37,89,0.16)]'
                        : 'bg-white border-2 border-[#D9CFB3] hover:border-[#1B2559]/50',
                    isDraggingThis ? 'opacity-40' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-[20px] bg-[#E4F6EC] border-2 border-[#8FD9AE] p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[15.5px] font-extrabold text-[#144D2E] leading-tight">
                All sorted!
              </h3>
              <p className="text-[12px] font-semibold text-[#1E6B42]">
                {mistakes === 0 && hintsUsed === 0
                  ? 'No mistakes. Brilliant!'
                  : mistakes === 0
                    ? 'No mistakes! Try without hints for 3 stars.'
                    : mistakes === 1
                      ? '1 slip, but you got there.'
                      : `${mistakes} slips, but you got there.`}
              </p>
            </div>

            <div
              className="inline-flex items-center gap-0.5 shrink-0 pt-0.5"
              role="img"
              aria-label={`${liveStars} out of 3 stars earned`}
            >
              {[1, 2, 3].map((idx) => {
                const earned = idx <= liveStars;
                return (
                  <Star
                    key={idx}
                    aria-hidden="true"
                    className={[
                      'w-5 h-5',
                      earned
                        ? 'fill-[#F6B93B] text-[#C87F0A] gq-sort-star-pop'
                        : 'fill-[#CFE8D9] text-[#8FB9A0]',
                    ].join(' ')}
                    style={
                      earned && !prefersReducedMotion
                        ? { animationDelay: `${(idx - 1) * 0.18}s` }
                        : undefined
                    }
                  />
                );
              })}
              <span className="sr-only">{liveStars} out of 3 stars</span>
            </div>
          </div>

          {resolvedSentencePairs.length > 0 ? (
            <div className="space-y-1.5 pt-0.5">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#1E6B42]">
                Read the full sentences
              </p>
              <div className="space-y-1.5">
                {resolvedSentencePairs.map((pair) => (
                  <div
                    key={pair.id}
                    className="flex flex-wrap items-center gap-1 text-[12px] leading-snug"
                  >
                    <span className="inline-block rounded-[10px] bg-[#FDEBC0] border-[1.5px] border-[#E5B24A] px-2 py-0.5 font-bold text-[#1B2559]">
                      {pair.subjectText}
                    </span>
                    <span className="inline-block rounded-[10px] bg-[#D7F5EE] border-[1.5px] border-[#0F7F76] px-2 py-0.5 font-bold text-[#1B2559]">
                      {pair.predicateText}
                    </span>
                    <span className="font-extrabold text-[#1B2559]">.</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[12.5px] font-semibold text-[#144D2E]">
              {activity.completeFeedback}
            </p>
          )}
        </div>
      )}

      {/* 4. Group Boxes Side by Side */}
      <div className={groupGridClass}>
        {activity.categories.map((cat) => {
          const tone = resolveBucketTone(cat.id, cat.tone);
          const palette = BUCKET_PALETTES[tone];
          const { Icon } = palette;
          const itemsInCat = activity.items.filter((it) => placedMap[it.id] === cat.id);
          const expectedCount = expectedCountsByGroup[cat.id] ?? 0;
          const isGroupFull = expectedCount > 0 && itemsInCat.length >= expectedCount;
          const isFlashCorrect = flashCorrectGroupId === cat.id;
          const isShakingGroup = wrongGroupId === cat.id;
          const showWrongTag = wrongTagGroupId === cat.id;
          const isDragHover = dragState?.hoverGroupId === cat.id && !isGroupFull;

          const shortSubLabel =
            cat.id === 'subject' || cat.id === 'predicate'
              ? palette.defaultShortHelper
              : cat.helperText;

          return (
            <div
              key={`${cat.id}-${isShakingGroup ? shakeNonce : 'idle'}`}
              data-group-dropzone={cat.id}
              className={[
                'rounded-[20px] border-2 p-[10px] flex flex-col gap-2 transition-all duration-200',
                activity.categories.length === 2
                  ? 'min-h-[214px]'
                  : 'min-h-[120px] sm:min-h-[200px]',
                isShakingGroup ? 'gq-sort-shake' : '',
                isFlashCorrect ? 'ring-4 ring-[#22A06B]/60' : '',
                isShakingGroup ? 'ring-4 ring-[#D95D24]/55' : '',
                isDragHover ? 'ring-4 ring-[#1B2559]/45' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                backgroundColor: palette.boxBg,
                borderColor: isFlashCorrect
                  ? '#22A06B'
                  : isShakingGroup
                    ? '#D95D24'
                    : palette.boxBorder,
              }}
            >
              {/* Tappable Group Header */}
              <button
                type="button"
                onClick={() => handleGroupTap(cat.id)}
                disabled={isFinished}
                aria-label={`Place the selected card in ${cat.label}`}
                className={[
                  'w-full min-h-[44px] rounded-[12px] bg-white/90 border border-black/10 px-2 py-1.5 flex items-center justify-between gap-1.5 text-left transition-colors',
                  isFinished ? 'cursor-default' : 'cursor-pointer hover:bg-white',
                ].join(' ')}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: palette.iconBg, color: palette.iconText }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-extrabold text-[#1B2559] leading-tight truncate">
                      {cat.label}
                    </div>
                    <div className="text-[10.5px] font-semibold text-[#4A5170] leading-tight truncate">
                      {shortSubLabel}
                    </div>
                  </div>
                </div>

                <span className="px-1.5 py-0.5 rounded-full bg-black/5 text-[11px] font-extrabold text-[#1B2559] tabular-nums shrink-0">
                  {itemsInCat.length}/{expectedCount}
                </span>
              </button>

              {/* Wrong-Group Warning Tag */}
              {showWrongTag ? (
                <div
                  role="status"
                  className="inline-flex items-center self-start rounded-[10px] bg-[#B83E14] text-white px-2 py-0.5 text-[11px] font-bold"
                >
                  {activity.categories.length > 2
                    ? 'Not this group — try another'
                    : 'Not here, try the other'}
                </div>
              ) : null}

              {/* Placed & Locked Cards */}
              {itemsInCat.length > 0 ? (
                <div className="space-y-1.5">
                  {itemsInCat.map((item) => {
                    const isDropIn = justPlacedId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={[
                          'rounded-[12px] bg-white px-2.5 py-2 flex items-center justify-between gap-1.5 shadow-[0_1px_2px_rgba(27,37,89,0.06)]',
                          isDropIn && !prefersReducedMotion ? 'gq-sort-drop-in' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ border: `2px solid ${palette.chipBorder}` }}
                      >
                        <span className="text-[12px] sm:text-[12.5px] font-bold text-[#1B2559] leading-snug">
                          {item.text}
                        </span>
                        <Check
                          aria-hidden="true"
                          className="w-4 h-4 shrink-0 stroke-[2.75]"
                          style={{ color: palette.checkColor }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* Drop Slot Target */}
              {!isFinished && !isGroupFull ? (
                selectedItemId ? (
                  <button
                    type="button"
                    onClick={() => handleGroupTap(cat.id)}
                    aria-label={`Place the selected card in ${cat.label}`}
                    className={[
                      'w-full min-h-[48px] mt-auto rounded-[14px] border-2 border-dashed border-[#1B2559] bg-white/70 px-2 text-[12px] font-bold text-[#1B2559] flex items-center justify-center cursor-pointer transition-colors hover:bg-white/90',
                      !prefersReducedMotion ? 'gq-sort-slot-pulse' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    Tap to place here
                  </button>
                ) : itemsInCat.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => handleGroupTap(cat.id)}
                    aria-label={`Place the selected card in ${cat.label}`}
                    className="w-full min-h-[48px] mt-auto rounded-[14px] border-2 border-dashed border-[#1B2559]/25 bg-white/35 px-2 text-[11.5px] font-semibold text-[#4A5170] flex items-center justify-center cursor-pointer"
                  >
                    Cards land here
                  </button>
                ) : null
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
