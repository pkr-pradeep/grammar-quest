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

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronDown, ChevronUp, ListOrdered } from 'lucide-react';
import type {
  GrammarLessonDefinition,
  SentenceToken,
  WordGroupRole,
  WordRelationship,
} from '../../../schemas/grammarEngine.schema';
import { GuideNotePopup, type GuidePopupPhase } from './GuideNotePopup';
import { FloatingGuideButton } from './FloatingGuideButton';
import { SentenceVisualizer, type SelectedTokenState } from './SentenceVisualizer';
import { LessonNavigation } from './LessonNavigation';

export interface TeachingSequenceProps {
  lesson: GrammarLessonDefinition;
  initialStepNumber?: number;
  stepJumpNonce?: number;
  onCompleteSequence: () => void;
  onGuideModalOpenChange?: (isOpen: boolean) => void;
}

const seenLearnStepKeys = new Set<string>();

function hasSeenStepPopup(lessonId: string, stepId: string): boolean {
  const key = `${lessonId}:${stepId}`;
  if (seenLearnStepKeys.has(key)) return true;
  try {
    return (
      typeof window !== 'undefined' &&
      window.sessionStorage.getItem(`gq-learn-seen:${key}`) === '1'
    );
  } catch {
    return false;
  }
}

function markStepPopupSeen(lessonId: string, stepId: string): void {
  const key = `${lessonId}:${stepId}`;
  seenLearnStepKeys.add(key);
  try {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(`gq-learn-seen:${key}`, '1');
    }
  } catch {
    // Ignore storage unavailability
  }
}

export const TeachingSequence: React.FC<TeachingSequenceProps> = ({
  lesson,
  initialStepNumber,
  stepJumpNonce = 0,
  onCompleteSequence,
  onGuideModalOpenChange,
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

  // Guide note popup & bottom-right button state
  const [popupPhase, setPopupPhase] = useState<GuidePopupPhase>('closed');
  const [flyOffset, setFlyOffset] = useState<{ x: number; y: number }>({
    x: 130,
    y: 260,
  });
  const [isButtonPopping, setIsButtonPopping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintFadingOut, setHintFadingOut] = useState(false);

  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const guideButtonRef = useRef<HTMLButtonElement | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearAllGuideTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllGuideTimers();
  }, [clearAllGuideTimers]);

  useEffect(() => {
    if (initialStepNumber) {
      setStepIndex(resolveStepIndex(initialStepNumber));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStepNumber, stepJumpNonce]);

  const currentStep = steps[stepIndex] ?? steps[0];

  const [selectedTokenInfo, setSelectedTokenInfo] = useState<SelectedTokenState | null>(
    null,
  );
  const [highlightedGroupRole, setHighlightedGroupRole] =
    useState<WordGroupRole | null>(currentStep?.focusGroupRole ?? null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(
    null,
  );
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

  // Auto-open guide note popup ONCE per step per session
  useEffect(() => {
    clearAllGuideTimers();
    setIsButtonPopping(false);
    setShowHint(false);
    setHintFadingOut(false);

    if (hasSeenStepPopup(lesson.lessonId, currentStep.id)) {
      setPopupPhase('closed');
      return;
    }

    markStepPopupSeen(lesson.lessonId, currentStep.id);
    setPopupPhase('opening');
    const settleMs = prefersReducedMotion ? 200 : 350;
    const t = window.setTimeout(() => {
      setPopupPhase('open');
    }, settleMs);
    timersRef.current.push(t);
  }, [lesson.lessonId, currentStep.id, prefersReducedMotion, clearAllGuideTimers]);

  const isPopupVisible = popupPhase !== 'closed';

  // Make underlying Learn controls inert while the guide popup modal is open
  useEffect(() => {
    const el = workspaceRef.current as (HTMLDivElement & { inert: boolean }) | null;
    if (el) {
      el.inert = isPopupVisible;
    }
    onGuideModalOpenChange?.(isPopupVisible);
    return () => {
      onGuideModalOpenChange?.(false);
    };
  }, [isPopupVisible, onGuideModalOpenChange]);

  const computeFlyOffset = useCallback(() => {
    if (typeof window === 'undefined') return { x: 130, y: 260 };
    const btnRect = guideButtonRef.current?.getBoundingClientRect();
    const dlgRect = dialogRef.current?.getBoundingClientRect();
    if (!btnRect) return { x: 130, y: 260 };

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    const dlgCenterX =
      dlgRect && dlgRect.width > 0
        ? dlgRect.left + dlgRect.width / 2
        : window.innerWidth / 2;
    const dlgCenterY =
      dlgRect && dlgRect.height > 0
        ? dlgRect.top + dlgRect.height / 2
        : window.innerHeight / 2;

    return {
      x: Math.round(btnCenterX - dlgCenterX),
      y: Math.round(btnCenterY - dlgCenterY),
    };
  }, []);

  const handleDismissPopup = useCallback(() => {
    if (popupPhase === 'closed' || popupPhase === 'closing') return;
    clearAllGuideTimers();

    setFlyOffset(computeFlyOffset());
    setPopupPhase('closing');

    const closeDuration = prefersReducedMotion ? 200 : 450;

    if (!prefersReducedMotion) {
      const popStartTimer = window.setTimeout(() => {
        setIsButtonPopping(true);
      }, 390);
      const popEndTimer = window.setTimeout(() => {
        setIsButtonPopping(false);
      }, 960);
      timersRef.current.push(popStartTimer, popEndTimer);
    }

    const closedTimer = window.setTimeout(() => {
      setPopupPhase('closed');
      setShowHint(true);
      setHintFadingOut(false);

      window.requestAnimationFrame(() => {
        guideButtonRef.current?.focus({ preventScroll: true });
      });

      const fadeTimer = window.setTimeout(() => {
        setHintFadingOut(true);
      }, 4200);
      const hideHintTimer = window.setTimeout(() => {
        setShowHint(false);
        setHintFadingOut(false);
      }, 4500);
      timersRef.current.push(fadeTimer, hideHintTimer);
    }, closeDuration);

    timersRef.current.push(closedTimer);
  }, [popupPhase, prefersReducedMotion, clearAllGuideTimers, computeFlyOffset]);

  const handleReopenPopup = useCallback(() => {
    if (popupPhase !== 'closed') return;
    clearAllGuideTimers();
    setShowHint(false);
    setHintFadingOut(false);
    setIsButtonPopping(false);
    setFlyOffset(computeFlyOffset());
    setPopupPhase('opening-from-corner');

    const openDuration = prefersReducedMotion ? 200 : 450;
    const openSettleTimer = window.setTimeout(() => {
      setPopupPhase('open');
    }, openDuration);
    timersRef.current.push(openSettleTimer);
  }, [popupPhase, prefersReducedMotion, clearAllGuideTimers, computeFlyOffset]);

  const activeSentence = useMemo(
    () =>
      lesson.sentences.find((s) => s.id === currentStep.sentenceId) ?? lesson.sentences[0],
    [lesson.sentences, currentStep.sentenceId],
  );

  const comparisonSentence = useMemo(
    () =>
      currentStep.comparisonSentenceId
        ? lesson.sentences.find((s) => s.id === currentStep.comparisonSentenceId) ?? null
        : null,
    [lesson.sentences, currentStep.comparisonSentenceId],
  );

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
    setShowStructureSplit(false);
    setShowCompare(false);
    setHighlightedGroupRole(role);
  };

  const handleToggleStructure = () => {
    setSelectedTokenInfo(null);
    setSelectedRelationshipId(null);
    setHighlightedGroupRole(null);
    setShowCompare(false);
    setShowStructureSplit((prev) => !prev);
  };

  const handleToggleCompare = () => {
    setSelectedTokenInfo(null);
    setSelectedRelationshipId(null);
    setHighlightedGroupRole(null);
    setShowStructureSplit(false);
    setShowCompare((prev) => !prev);
  };

  const handleSelectRelationship = (rel: WordRelationship | null) => {
    setSelectedTokenInfo(null);
    setHighlightedGroupRole(null);
    setShowStructureSplit(false);
    setShowCompare(false);
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
    <>
      <div
        ref={workspaceRef}
        aria-hidden={isPopupVisible || undefined}
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
                className="inline-flex items-center gap-1 min-h-[32px] px-2.5 py-1 rounded-[9px] border border-[#E5E2D9] bg-[#FDFCF9] text-xs font-medium text-[#263A70] hover:bg-[#F5F2EA] cursor-pointer whitespace-nowrap shrink-0"
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

        {/* Starter Sentence + Compact Result Card (Directly Under Step Progress Row) */}
        <div className="flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6 pt-3 pb-20 sm:py-4 sm:pb-24">
          <SentenceVisualizer
            stepId={currentStep.id}
            visualMode={currentStep.visualMode}
            visualCallout={currentStep.visualCallout}
            guidedChallenge={currentStep.guidedChallenge}
            timelineData={currentStep.timelineData}
            agreementData={currentStep.agreementData}
            dimmedTokenIds={currentStep.dimmedTokenIds}
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
            onToggleStructureSplit={handleToggleStructure}
            onToggleCompare={comparisonSentence ? handleToggleCompare : undefined}
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
          nudgeNextArrow={!isPaused && !prefersReducedMotion}
        />
      </div>

      {/* Bottom-Right Floating Guide Button */}
      <FloatingGuideButton
        characterId={currentStep.characterId}
        characterExpression={currentStep.characterExpression}
        noteTitle={currentStep.title}
        buttonRef={guideButtonRef}
        isPopupOpen={isPopupVisible}
        isPopping={isButtonPopping}
        showHint={showHint}
        hintFadingOut={hintFadingOut}
        onOpenPopup={handleReopenPopup}
      />

      {/* Centred Guide Note Modal Popup */}
      <GuideNotePopup
        phase={popupPhase}
        characterId={currentStep.characterId}
        characterExpression={currentStep.characterExpression}
        badgeLabel={currentStep.badgeLabel}
        title={currentStep.title}
        shortPrompt={currentStep.shortPrompt}
        explanation={currentStep.explanation}
        flyOffset={flyOffset}
        dialogRef={dialogRef}
        onDismiss={handleDismissPopup}
      />
    </>
  );
};
