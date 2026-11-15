/**
 * ============================================================================
 * GRAMMAR QUEST — TEACHING SEQUENCE ORCHESTRATOR
 * ============================================================================
 * Drives the reusable 10-step visual lesson flow inside the focused mobile
 * workspace:
 *  - Compact Step X of 10 progress bar + expandable All-Steps popover
 *  - Zone B: Compact ExplanationPanel
 *  - Zone C & D: Interactive SentenceVisualizer + WordInspectorPopup
 *  - Zone E: Persistent bottom LessonNavigation
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronDown, ChevronUp, ListOrdered } from 'lucide-react';
import type {
  GrammarLessonDefinition,
  SentenceToken,
  WordGroupRole,
  WordRelationship,
} from '../../../schemas/grammarEngine.schema';
import { ExplanationPanel } from './ExplanationPanel';
import { SentenceVisualizer, type SelectedTokenState } from './SentenceVisualizer';
import { LessonNavigation } from './LessonNavigation';

export interface TeachingSequenceProps {
  lesson: GrammarLessonDefinition;
  initialStepNumber?: number;
  stepJumpNonce?: number;
  onCompleteSequence: () => void;
}

export const TeachingSequence: React.FC<TeachingSequenceProps> = ({
  lesson,
  initialStepNumber,
  stepJumpNonce = 0,
  onCompleteSequence,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const steps = lesson.teachingSequence;
  const resolveStepIndex = (stepNum?: number) => {
    if (!stepNum || steps.length === 0) return 0;
    const found = steps.findIndex((s) => s.stepNumber === stepNum);
    if (found >= 0) return found;
    return Math.max(0, Math.min(stepNum - 1, steps.length - 1));
  };

  const [stepIndex, setStepIndex] = useState(() => resolveStepIndex(initialStepNumber));
  const [isPaused, setIsPaused] = useState(false);
  const [animationSeed, setAnimationSeed] = useState(0);
  const [stepsDrawerOpen, setStepsDrawerOpen] = useState(false);
  const [isExplanationTyped, setIsExplanationTyped] = useState(prefersReducedMotion);

  useEffect(() => {
    if (initialStepNumber) {
      setStepIndex(resolveStepIndex(initialStepNumber));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStepNumber, stepJumpNonce]);

  const currentStep = steps[stepIndex] ?? steps[0];

  const [selectedTokenInfo, setSelectedTokenInfo] = useState<SelectedTokenState | null>(null);
  const [highlightedGroupRole, setHighlightedGroupRole] = useState<WordGroupRole | null>(
    currentStep?.focusGroupRole ?? null,
  );
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);
  const [showStructureSplit, setShowStructureSplit] = useState<boolean>(
    Boolean(currentStep?.showStructureSplit),
  );
  const [showCompare, setShowCompare] = useState<boolean>(
    Boolean(currentStep?.comparisonSentenceId && currentStep?.type === 'compare-example'),
  );

  // Sync visual focus defaults whenever the student advances or steps back
  useEffect(() => {
    setSelectedTokenInfo(null);
    setHighlightedGroupRole(currentStep.focusGroupRole ?? null);
    setSelectedRelationshipId(currentStep.focusRelationshipIds?.[0] ?? null);
    setShowStructureSplit(Boolean(currentStep.showStructureSplit));
    setShowCompare(
      Boolean(currentStep.comparisonSentenceId && currentStep.type === 'compare-example'),
    );
    setStepsDrawerOpen(false);
    setAnimationSeed((s) => s + 1);
  }, [stepIndex, currentStep]);

  const activeSentence = useMemo(
    () => lesson.sentences.find((s) => s.id === currentStep.sentenceId) ?? lesson.sentences[0],
    [lesson.sentences, currentStep.sentenceId],
  );

  const comparisonSentence = useMemo(
    () =>
      currentStep.comparisonSentenceId
        ? lesson.sentences.find((s) => s.id === currentStep.comparisonSentenceId) ?? null
        : null,
    [lesson.sentences, currentStep.comparisonSentenceId],
  );

  const stepRefs = useMemo(() => {
    const ids = currentStep.sourceRefIds ?? [];
    if (ids.length === 0) return lesson.sourceReferences;
    return lesson.sourceReferences.filter((ref) => ids.includes(ref.id));
  }, [lesson.sourceReferences, currentStep.sourceRefIds]);

  const handleSelectToken = (
    token: SentenceToken,
    sentenceId: string,
    sentenceLabel: string,
  ) => {
    setSelectedRelationshipId(null);
    setSelectedTokenInfo((prev) =>
      prev && prev.sentenceId === sentenceId && prev.token.id === token.id
        ? null
        : { sentenceId, sentenceLabel, token },
    );
  };

  const handleSelectGroup = (role: WordGroupRole | null) => {
    setSelectedTokenInfo(null);
    setSelectedRelationshipId(null);
    setHighlightedGroupRole(role);
  };

  const handleSelectRelationship = (rel: WordRelationship | null) => {
    setSelectedTokenInfo(null);
    setHighlightedGroupRole(null);
    setSelectedRelationshipId(rel ? rel.id : null);
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      onCompleteSequence();
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  };

  const handleReplay = () => {
    setIsPaused(false);
    setAnimationSeed((s) => s + 1);
  };

  const percent = steps.length > 0 ? Math.round(((stepIndex + 1) / steps.length) * 100) : 0;

  return (
    <div
      className={[
        'gq-story-stage flex-1 flex flex-col justify-between min-h-0',
        isPaused ? 'gq-story-paused' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Slim Progress Indicator + Expandable Step Switcher */}
      <div className="bg-white border-b border-[#E5E2D9] px-3 sm:px-6 py-1.5">
        <div className="max-w-[920px] mx-auto relative">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xs font-semibold text-[#263A70] tabular-nums whitespace-nowrap">
                Step {stepIndex + 1} of {steps.length}
              </span>
              <div
                aria-hidden="true"
                className="flex-1 max-w-[180px] h-1.5 rounded-full bg-[#F2EFE7] overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-[#FFC64B] transition-all duration-200"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-[#4B5C8A] tabular-nums">
                {percent}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStepsDrawerOpen((prev) => !prev)}
              aria-expanded={stepsDrawerOpen}
              aria-controls="lesson-steps-popover"
              className="inline-flex items-center gap-1 min-h-[32px] px-2 py-1 rounded-[8px] border border-[#E5E2D9] bg-[#FDFCF9] text-[11px] font-medium text-[#263A70] hover:bg-[#F5F2EA] cursor-pointer whitespace-nowrap shrink-0"
            >
              <ListOrdered className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Steps</span>
              {stepsDrawerOpen ? (
                <ChevronUp className="w-3 h-3" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3 h-3" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Expandable Compact All-Steps Popover */}
          {stepsDrawerOpen ? (
            <div
              id="lesson-steps-popover"
              role="region"
              aria-label="Jump to lesson step"
              className="mt-2 rounded-[14px] bg-white border border-[#CFC9BA] shadow-md p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5"
            >
              {steps.map((s, idx) => {
                const isCurrent = idx === stepIndex;
                const isVisited = idx < stepIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStepIndex(idx);
                      setStepsDrawerOpen(false);
                    }}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={[
                      'min-h-[38px] px-2.5 py-1.5 rounded-[10px] text-left flex items-center gap-2 text-xs transition-colors cursor-pointer',
                      isCurrent
                        ? 'bg-[#263A70] text-white font-semibold'
                        : isVisited
                          ? 'bg-[#D9FAF5] text-[#263A70] hover:bg-[#C3F5EE]'
                          : 'bg-[#FDFCF9] text-[#263A70] border border-[#E5E2D9] hover:bg-[#F5F2EA]',
                    ].join(' ')}
                  >
                    <span className="tabular-nums font-semibold shrink-0">
                      {s.stepNumber}.
                    </span>
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Zones B, C & D: Compact Instruction + Sentence Stage + Popup Feedback */}
      <div className="flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6 py-2.5 sm:py-4 space-y-2.5 sm:space-y-3">
        <ExplanationPanel
          stepId={currentStep.id}
          badgeLabel={currentStep.badgeLabel}
          title={currentStep.title}
          shortPrompt={currentStep.shortPrompt}
          explanation={currentStep.explanation}
          characterId={currentStep.characterId}
          characterExpression={currentStep.characterExpression}
          provenance={currentStep.provenance}
          sourceReferences={stepRefs}
          isPaused={isPaused}
          animationSeed={animationSeed}
          onTypingCompleteChange={setIsExplanationTyped}
        />

        <SentenceVisualizer
          stepId={currentStep.id}
          visualMode={currentStep.visualMode}
          visualCallout={currentStep.visualCallout}
          guidedChallenge={currentStep.guidedChallenge}
          sentence={activeSentence}
          comparisonSentence={comparisonSentence}
          allowedRelationshipTypes={lesson.activeRelationshipTypes}
          selectedTokenInfo={selectedTokenInfo}
          highlightedGroupRole={highlightedGroupRole}
          focusTokenIds={currentStep.focusTokenIds ?? []}
          focusRelationshipIds={currentStep.focusRelationshipIds ?? []}
          selectedRelationshipId={selectedRelationshipId}
          showStructureSplit={showStructureSplit}
          showCompare={showCompare}
          showRelationships={
            currentStep.type === 'show-relationship' ||
            currentStep.type === 'interact-explore' ||
            currentStep.allowFreeExplore === true
          }
          allowFreeExplore={currentStep.allowFreeExplore === true}
          isPaused={isPaused}
          animationSeed={animationSeed}
          onSelectToken={handleSelectToken}
          onCloseTokenPopup={() => setSelectedTokenInfo(null)}
          onSelectGroup={handleSelectGroup}
          onToggleStructureSplit={() => setShowStructureSplit((v) => !v)}
          onToggleCompare={
            comparisonSentence ? () => setShowCompare((v) => !v) : undefined
          }
          onSelectRelationship={handleSelectRelationship}
        />
      </div>

      {/* Zone E: Persistent Bottom Navigation */}
      <LessonNavigation
        currentStepIndex={stepIndex}
        totalSteps={steps.length}
        isPaused={isPaused}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTogglePause={() => setIsPaused((p) => !p)}
        onReplay={handleReplay}
        nextLabel={stepIndex === steps.length - 1 ? 'Guided Practice' : 'Next'}
        nudgeNextArrow={isExplanationTyped && !isPaused && !prefersReducedMotion}
      />
    </div>
  );
};
