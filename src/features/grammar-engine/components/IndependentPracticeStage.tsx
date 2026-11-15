/**
 * ============================================================================
 * GRAMMAR QUEST — STAGE 9: INDEPENDENT PRACTICE STAGE
 * ============================================================================
 * Presents new, unfamiliar sentences WITHOUT pre-revealed answers and with
 * gradually reduced guidance ('gentle' -> 'minimal' -> 'none').
 * Learners identify Subject and Predicate (or recognise understood '(You)' in
 * imperatives), check their response, and receive immediate feedback only after
 * submitting each attempt.
 * ============================================================================
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Layers, MessageSquare, RotateCcw } from 'lucide-react';
import type { IndependentPracticeItem } from '../../../schemas/grammarEngine.schema';
import { Button } from '../../../components';
import { WordToken } from './WordToken';
import { WordGroup } from './WordGroup';
import { PracticeFeedback } from './PracticeFeedback';

export interface IndependentPracticeStageProps {
  items: IndependentPracticeItem[];
  onBackToGuided: () => void;
  onFinishIndependentPractice: () => void;
}

function sameIds(a: string[], b: string[]): boolean {
  const sA = new Set(a);
  const sB = new Set(b);
  return sA.size === sB.size && [...sB].every((id) => sA.has(id));
}

export const IndependentPracticeStage: React.FC<IndependentPracticeStageProps> = ({
  items,
  onBackToGuided,
  onFinishIndependentPractice,
}) => {
  const [itemIndex, setItemIndex] = useState(0);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  // Per-item interactive state keyed cleanly by item id
  const [phaseById, setPhaseById] = useState<Record<string, 'subject' | 'predicate' | 'done'>>({});
  const [subjSelById, setSubjSelById] = useState<Record<string, string[]>>({});
  const [predSelById, setPredSelById] = useState<Record<string, string[]>>({});
  const [targetSelById, setTargetSelById] = useState<Record<string, string[]>>({});
  const [targetConfirmedById, setTargetConfirmedById] = useState<Record<string, boolean>>({});
  const [impChoiceById, setImpChoiceById] = useState<Record<string, string | null>>({});
  const [feedbackById, setFeedbackById] = useState<
    Record<string, { status: 'correct' | 'try-again'; title: string; message: string } | null>
  >({});

  const currentItem = items[itemIndex] ?? items[0];
  if (!currentItem) return null;

  const currentPhase = phaseById[currentItem.id] ?? 'subject';
  const subjSel = subjSelById[currentItem.id] ?? [];
  const predSel = predSelById[currentItem.id] ?? [];
  const targetSel = targetSelById[currentItem.id] ?? [];
  const targetConfirmed = Boolean(targetConfirmedById[currentItem.id]);
  const impChoice = impChoiceById[currentItem.id] ?? null;
  const feedback = feedbackById[currentItem.id] ?? null;
  const allSolved = items.length > 0 && items.every((item) => solvedIds.includes(item.id));
  const isCurrentSolved = solvedIds.includes(currentItem.id);

  const markSolved = (id: string) => {
    setSolvedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const toggleToken = (tokenId: string) => {
    if (currentItem.mode === 'token-and-choice') {
      if (targetConfirmed || currentPhase === 'done') return;
      setFeedbackById((prev) => ({ ...prev, [currentItem.id]: null }));
      const next = targetSel.includes(tokenId)
        ? targetSel.filter((id) => id !== tokenId)
        : [...targetSel, tokenId];
      setTargetSelById((prev) => ({ ...prev, [currentItem.id]: next }));
      return;
    }

    if (currentItem.mode !== 'dual-identify' || currentPhase === 'done') return;
    setFeedbackById((prev) => ({ ...prev, [currentItem.id]: null }));

    if (currentPhase === 'subject') {
      const next = subjSel.includes(tokenId)
        ? subjSel.filter((id) => id !== tokenId)
        : [...subjSel, tokenId];
      setSubjSelById((prev) => ({ ...prev, [currentItem.id]: next }));
    } else {
      if (currentItem.subjectTokenIds.includes(tokenId)) return;
      const next = predSel.includes(tokenId)
        ? predSel.filter((id) => id !== tokenId)
        : [...predSel, tokenId];
      setPredSelById((prev) => ({ ...prev, [currentItem.id]: next }));
    }
  };

  const handleCheckTargetTokens = () => {
    const expected = currentItem.targetTokenIds ?? [];
    if (sameIds(targetSel, expected)) {
      setTargetConfirmedById((prev) => ({ ...prev, [currentItem.id]: true }));
      setFeedbackById((prev) => ({
        ...prev,
        [currentItem.id]: {
          status: 'correct',
          title: 'Key word spotted!',
          message: 'Now choose the correct explanation or verb form below.',
        },
      }));
    } else {
      setFeedbackById((prev) => ({
        ...prev,
        [currentItem.id]: {
          status: 'try-again',
          title: 'Look closely at the sentence',
          message:
            currentItem.retrySubjectFeedback ??
            'Tap the exact word or clue specified in the prompt above.',
        },
      }));
    }
  };

  const handleCheckDual = () => {
    if (currentPhase === 'subject') {
      if (sameIds(subjSel, currentItem.subjectTokenIds)) {
        setPhaseById((prev) => ({ ...prev, [currentItem.id]: 'predicate' }));
        setFeedbackById((prev) => ({ ...prev, [currentItem.id]: null }));
      } else {
        setFeedbackById((prev) => ({
          ...prev,
          [currentItem.id]: {
            status: 'try-again',
            title: 'Look closely at the Subject',
            message:
              currentItem.retrySubjectFeedback ??
              'Select every word that names who or what this sentence is about before the finite verb.',
          },
        }));
      }
      return;
    }

    if (currentPhase === 'predicate') {
      if (sameIds(predSel, currentItem.predicateTokenIds)) {
        setPhaseById((prev) => ({ ...prev, [currentItem.id]: 'done' }));
        setFeedbackById((prev) => ({
          ...prev,
          [currentItem.id]: {
            status: 'correct',
            title: 'Well done!',
            message: currentItem.successFeedback,
          },
        }));
        markSolved(currentItem.id);
      } else {
        setFeedbackById((prev) => ({
          ...prev,
          [currentItem.id]: {
            status: 'try-again',
            title: 'Check the Predicate',
            message:
              currentItem.retryPredicateFeedback ??
              'The Predicate starts at the finite verb and includes all remaining words.',
          },
        }));
      }
    }
  };

  const handlePickImperative = (optionId: string) => {
    const opt = currentItem.imperativeOptions?.find((o) => o.id === optionId);
    if (!opt) return;
    setImpChoiceById((prev) => ({ ...prev, [currentItem.id]: optionId }));
    if (opt.isCorrect) {
      setPhaseById((prev) => ({ ...prev, [currentItem.id]: 'done' }));
      setFeedbackById((prev) => ({
        ...prev,
        [currentItem.id]: {
          status: 'correct',
          title: 'Accurate analysis!',
          message: opt.feedback,
        },
      }));
      markSolved(currentItem.id);
    } else {
      setFeedbackById((prev) => ({
        ...prev,
        [currentItem.id]: {
          status: 'try-again',
          title:
            currentItem.mode === 'imperative-check'
              ? 'Think about who hears this instruction'
              : 'Look again at the time clue or Subject',
          message: opt.feedback,
        },
      }));
    }
  };

  const handleResetCurrent = () => {
    setPhaseById((prev) => ({ ...prev, [currentItem.id]: 'subject' }));
    setSubjSelById((prev) => ({ ...prev, [currentItem.id]: [] }));
    setPredSelById((prev) => ({ ...prev, [currentItem.id]: [] }));
    setTargetSelById((prev) => ({ ...prev, [currentItem.id]: [] }));
    setTargetConfirmedById((prev) => ({ ...prev, [currentItem.id]: false }));
    setImpChoiceById((prev) => ({ ...prev, [currentItem.id]: null }));
    setFeedbackById((prev) => ({ ...prev, [currentItem.id]: null }));
  };

  const subjectTokens = currentItem.sentence.tokens.filter((t) => t.groupRole === 'subject');
  const predicateTokens = currentItem.sentence.tokens.filter((t) => t.groupRole === 'predicate');

  return (
    <div className="space-y-4">
      {/* Compact Progress Pills */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5" aria-label="Independent practice challenges">
          {items.map((item, idx) => {
            const isCurrent = idx === itemIndex;
            const isDone = solvedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setItemIndex(idx)}
                aria-current={isCurrent ? 'step' : undefined}
                className={[
                  'inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  isCurrent
                    ? 'bg-[#263A70] text-white'
                    : isDone
                      ? 'bg-[#D9FAF5] text-[#263A70] border border-[#65D8CA]'
                      : 'bg-white text-[#4B5C8A] border border-[#E5E2D9] hover:border-[#263A70]',
                ].join(' ')}
              >
                {isDone ? <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> : null}
                <span>Try {idx + 1}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs font-medium text-[#4B5C8A] tabular-nums">
          {solvedIds.length} of {items.length} solved
        </span>
      </div>

      {/* Main Independent Practice Card */}
      <div className="rounded-[20px] bg-white border border-[#E5E2D9] p-4 sm:p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#A15C00]">
              Independent Practice · {itemIndex + 1} of {items.length}
            </span>
            <span className="text-[11px] font-medium text-[#4B5C8A]">
              {currentItem.cueLevel === 'gentle'
                ? 'Light cue'
                : currentItem.cueLevel === 'minimal'
                  ? 'Minimal cue'
                  : 'On your own'}
            </span>
          </div>

          <h2 className="font-heading text-base sm:text-lg font-semibold text-[#263A70]">
            {currentItem.title}
          </h2>
          <p className="text-sm text-[#333333]">{currentItem.instruction}</p>

          {currentItem.cueText && currentItem.cueLevel !== 'none' ? (
            <p className="text-xs rounded-[10px] bg-[#FFF9EC] border border-[#F2DFB6] px-3 py-1.5 text-[#4B5C8A]">
              {currentItem.cueText}
            </p>
          ) : null}
        </div>

        {currentItem.mode === 'dual-identify' ? (
          <>
            {/* Active Selection Phase Banner */}
            <div
              className={[
                'rounded-[12px] border px-3 py-2 flex items-center gap-2 text-xs font-semibold',
                currentPhase === 'subject'
                  ? 'bg-[#FFF4D6] border-[#F59B19] text-[#263A70]'
                  : 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]',
              ].join(' ')}
            >
              {currentPhase === 'subject' ? (
                <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <MessageSquare className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              )}
              <span>
                {currentPhase === 'subject'
                  ? 'Step 1: Select the Subject'
                  : currentPhase === 'predicate'
                    ? 'Step 2: Select the Predicate'
                    : 'Sentence structure verified!'}
              </span>
            </div>

            {/* Interactive Word Tokens (no pre-revealed categories before solving) */}
            <div className="rounded-[16px] bg-[#FDFCF9] border border-[#E5E2D9] p-3.5 sm:p-4">
              <div className="flex flex-wrap items-center gap-2">
                {currentItem.sentence.tokens.map((token, idx) => {
                  const isConfirmedSubject =
                    currentPhase !== 'subject' &&
                    currentItem.subjectTokenIds.includes(token.id);
                  const isConfirmedPredicate =
                    currentPhase === 'done' &&
                    currentItem.predicateTokenIds.includes(token.id);
                  const isSelectedNow =
                    (currentPhase === 'subject' && subjSel.includes(token.id)) ||
                    (currentPhase === 'predicate' && predSel.includes(token.id));

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
                      showCategoryBadge={currentPhase === 'done'}
                      showHeadWordMarker={currentPhase === 'done'}
                      animateEntrance={false}
                      onSelect={(t) => toggleToken(t.id)}
                    />
                  );
                })}
              </div>
            </div>

            {currentPhase !== 'done' ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCheckDual}
                  disabled={
                    currentPhase === 'subject'
                      ? subjSel.length === 0
                      : predSel.length === 0
                  }
                >
                  {currentPhase === 'subject' ? 'Confirm Subject' : 'Check Answer'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetCurrent}
                  disabled={subjSel.length === 0 && predSel.length === 0}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset
                </Button>
              </div>
            ) : null}
          </>
        ) : currentItem.mode === 'token-and-choice' ? (
          <div className="space-y-3">
            <div
              className={[
                'rounded-[12px] border px-3 py-2 flex items-center gap-2 text-xs font-semibold',
                !targetConfirmed
                  ? 'bg-[#FFF4D6] border-[#F59B19] text-[#263A70]'
                  : 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]',
              ].join(' ')}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {!targetConfirmed
                  ? (currentItem.targetPrompt ?? 'Step 1: Tap the key word(s) in the sentence')
                  : currentPhase === 'done'
                    ? 'Sentence check completed!'
                    : 'Step 2: Choose the right option below'}
              </span>
            </div>

            <div className="rounded-[16px] bg-[#FDFCF9] border border-[#E5E2D9] p-3.5 sm:p-4">
              <div className="flex flex-wrap items-center gap-2">
                {currentItem.sentence.tokens.map((token, idx) => {
                  const isTarget =
                    targetConfirmed && (currentItem.targetTokenIds ?? []).includes(token.id);
                  const isSelectedNow = !targetConfirmed && targetSel.includes(token.id);
                  return (
                    <WordToken
                      key={token.id}
                      token={token}
                      index={idx}
                      isSelected={isSelectedNow}
                      isHighlighted={isTarget}
                      showCategoryBadge={currentPhase === 'done'}
                      showHeadWordMarker={currentPhase === 'done'}
                      animateEntrance={false}
                      onSelect={(t) => toggleToken(t.id)}
                    />
                  );
                })}
              </div>
            </div>

            {!targetConfirmed ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCheckTargetTokens}
                  disabled={targetSel.length === 0}
                >
                  Check Word
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetCurrent}
                  disabled={targetSel.length === 0}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentItem.imperativeQuestion ? (
                  <p className="text-sm font-semibold text-[#263A70]">
                    {currentItem.imperativeQuestion}
                  </p>
                ) : null}
                <div className="space-y-2">
                  {currentItem.imperativeOptions?.map((opt) => {
                    const isSelected = impChoice === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handlePickImperative(opt.id)}
                        aria-pressed={isSelected}
                        className={[
                          'w-full text-left rounded-[12px] border-2 px-3.5 py-3 min-h-[44px] text-sm font-medium transition-colors cursor-pointer',
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]'
                              : 'bg-[#FEE8E7] border-[#F36F68] text-[#263A70]'
                            : 'bg-[#FDFCF9] border-[#E5E2D9] text-[#263A70] hover:border-[#263A70]',
                        ].join(' ')}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Imperative Check or Choice-Diagnose */
          <div className="space-y-3">
            <div className="rounded-[16px] bg-[#FDFCF9] border border-[#E5E2D9] p-3.5 sm:p-4">
              <p className="text-base sm:text-lg font-semibold text-[#263A70]">
                {currentItem.sentence.rawText}
              </p>
            </div>

            {currentItem.imperativeQuestion ? (
              <p className="text-sm font-semibold text-[#263A70]">
                {currentItem.imperativeQuestion}
              </p>
            ) : null}

            <div className="space-y-2">
              {currentItem.imperativeOptions?.map((opt) => {
                const isSelected = impChoice === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handlePickImperative(opt.id)}
                    aria-pressed={isSelected}
                    className={[
                      'w-full text-left rounded-[12px] border-2 px-3.5 py-3 min-h-[44px] text-sm font-medium transition-colors cursor-pointer',
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]'
                          : 'bg-[#FEE8E7] border-[#F36F68] text-[#263A70]'
                        : 'bg-[#FDFCF9] border-[#E5E2D9] text-[#263A70] hover:border-[#263A70]',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Immediate Feedback After Attempt */}
        {feedback ? (
          <div className="space-y-3">
            <PracticeFeedback
              status={feedback.status}
              title={feedback.title}
              message={feedback.message}
            />

            {currentPhase === 'done' && currentItem.mode === 'dual-identify' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <WordGroup
                  role="subject"
                  tokens={subjectTokens}
                  headWord={currentItem.sentence.structureSummary.subjectHeadWord}
                />
                <WordGroup
                  role="predicate"
                  tokens={predicateTokens}
                  headWord={currentItem.sentence.structureSummary.predicateHeadWord}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (itemIndex > 0) {
              setItemIndex((i) => i - 1);
            } else {
              onBackToGuided();
            }
          }}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          {itemIndex === 0 ? 'Back to Guided Practice' : 'Previous'}
        </Button>

        {itemIndex < items.length - 1 ? (
          <Button
            variant={isCurrentSolved ? 'primary' : 'navy'}
            size="sm"
            onClick={() => setItemIndex((i) => i + 1)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next Sentence
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            disabled={!allSolved}
            onClick={onFinishIndependentPractice}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {allSolved ? 'Complete Mission' : `Solve all ${items.length} to finish`}
          </Button>
        )}
      </div>
    </div>
  );
};
