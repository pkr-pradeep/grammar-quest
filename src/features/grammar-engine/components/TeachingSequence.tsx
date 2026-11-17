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
import { GuideNotePopup } from './GuideNotePopup';
import { FloatingGuideButton } from './FloatingGuideButton';
import { SentenceVisualizer, type SelectedTokenState } from './SentenceVisualizer';
import { SentenceTypesStep1View } from './SentenceTypesStep1View';
import { LessonNavigation } from './LessonNavigation';

export interface TeachingSequenceProps {
  lesson: GrammarLessonDefinition;
  initialStepNumber?: number;
  stepJumpNonce?: number;
  finalNextLabel?: string;
  onCompleteSequence: () => void;
  onGuideModalOpenChange?: (isOpen: boolean) => void;
  onStepChange?: (stepNumber: number) => void;
  onUserEngage?: () => void;
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
  finalNextLabel = 'Guided Practice',
  onCompleteSequence,
  onGuideModalOpenChange,
  onStepChange,
  onUserEngage,
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

  // Guide note popup & bottom-right button state: auto-open immediately if unseen
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(() => {
    const initialStep = steps[resolveStepIndex(initialStepNumber)] ?? steps[0];
    if (!initialStep) return false;
    return !hasSeenStepPopup(lesson.lessonId, initialStep.id);
  });
  const [isPopupMounted, setIsPopupMounted] = useState<boolean>(() => {
    const initialStep = steps[resolveStepIndex(initialStepNumber)] ?? steps[0];
    if (!initialStep) return false;
    return !hasSeenStepPopup(lesson.lessonId, initialStep.id);
  });
  const [isAutoOpened, setIsAutoOpened] = useState<boolean>(() => {
    const initialStep = steps[resolveStepIndex(initialStepNumber)] ?? steps[0];
    if (!initialStep) return false;
    return !hasSeenStepPopup(lesson.lessonId, initialStep.id);
  });
  const [isInitialAutoOpen, setIsInitialAutoOpen] = useState<boolean>(() => {
    const initialStep = steps[resolveStepIndex(initialStepNumber)] ?? steps[0];
    if (!initialStep) return false;
    return !hasSeenStepPopup(lesson.lessonId, initialStep.id);
  });
  const [isButtonPopping, setIsButtonPopping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintFadingOut, setHintFadingOut] = useState(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const guideButtonRef = useRef<HTMLButtonElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const activeStepPopupRef = useRef<string | null>(null);

  const clearAllGuideTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllGuideTimers();
  }, [clearAllGuideTimers]);

  // Sync external initialStepNumber / stepJumpNonce changes immediately
  useEffect(() => {
    if (initialStepNumber) {
      const nextIdx = resolveStepIndex(initialStepNumber);
      setStepIndex(nextIdx);
      const targetStep = steps[nextIdx];
      if (targetStep && !hasSeenStepPopup(lesson.lessonId, targetStep.id)) {
        markStepPopupSeen(lesson.lessonId, targetStep.id);
        activeStepPopupRef.current = `${lesson.lessonId}:${targetStep.id}`;
        setIsAutoOpened(true);
        setIsInitialAutoOpen(true);
        setIsPopupMounted(true);
        setIsPopupOpen(true);
      }
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
    onStepChange?.(currentStep.stepNumber);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [stepIndex, currentStep, onStepChange]);

  // Auto-open guide note popup ONCE per step per session (with immediate blurred backdrop)
  useEffect(() => {
    const key = `${lesson.lessonId}:${currentStep.id}`;
    if (activeStepPopupRef.current === key) {
      return;
    }
    activeStepPopupRef.current = key;
    clearAllGuideTimers();
    setIsButtonPopping(false);
    setShowHint(false);
    setHintFadingOut(false);

    if (hasSeenStepPopup(lesson.lessonId, currentStep.id)) {
      setIsPopupOpen(false);
      setIsPopupMounted(false);
      setIsAutoOpened(false);
      setIsInitialAutoOpen(false);
      return;
    }

    markStepPopupSeen(lesson.lessonId, currentStep.id);
    setIsAutoOpened(true);
    setIsInitialAutoOpen(true);
    setIsPopupMounted(true);
    setIsPopupOpen(true);
  }, [lesson.lessonId, currentStep.id, clearAllGuideTimers]);

  const isPopupVisible = isPopupOpen || isPopupMounted;

  useEffect(() => {
    onGuideModalOpenChange?.(isPopupVisible);
    return () => {
      onGuideModalOpenChange?.(false);
    };
  }, [isPopupVisible, onGuideModalOpenChange]);

  const handleDismissPopup = useCallback(() => {
    if (!isPopupOpen) return;
    onUserEngage?.();
    clearAllGuideTimers();
    setIsPopupOpen(false);
  }, [isPopupOpen, clearAllGuideTimers, onUserEngage]);

  const handlePopupAfterClose = useCallback(() => {
    setIsPopupMounted(false);
    setIsInitialAutoOpen((wasInitial) => {
      if (wasInitial) {
        setAnimationSeed((s) => s + 1);
      }
      return false;
    });
    if (!prefersReducedMotion) {
      setIsButtonPopping(true);
      const popEndTimer = window.setTimeout(() => {
        setIsButtonPopping(false);
      }, 560);
      timersRef.current.push(popEndTimer);
    }
    setShowHint(true);
    setHintFadingOut(false);

    const fadeTimer = window.setTimeout(() => {
      setHintFadingOut(true);
    }, 4200);
    const hideHintTimer = window.setTimeout(() => {
      setShowHint(false);
      setHintFadingOut(false);
    }, 4500);
    timersRef.current.push(fadeTimer, hideHintTimer);
  }, [prefersReducedMotion]);

  const handleReopenPopup = useCallback(() => {
    if (isPopupOpen || isPopupMounted) return;
    clearAllGuideTimers();
    setShowHint(false);
    setHintFadingOut(false);
    setIsButtonPopping(false);
    setIsAutoOpened(false);
    setIsInitialAutoOpen(false);
    setIsPopupMounted(true);
    setIsPopupOpen(true);
  }, [isPopupOpen, isPopupMounted, clearAllGuideTimers]);

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

  const goToStepIndex = useCallback(
    (nextIdx: number) => {
      const bounded = Math.max(0, Math.min(nextIdx, steps.length - 1));
      const nextStep = steps[bounded];
      setStepIndex(bounded);
      if (nextStep) {
        const key = `${lesson.lessonId}:${nextStep.id}`;
        activeStepPopupRef.current = key;
        clearAllGuideTimers();
        setIsButtonPopping(false);
        setShowHint(false);
        setHintFadingOut(false);
        if (!hasSeenStepPopup(lesson.lessonId, nextStep.id)) {
          markStepPopupSeen(lesson.lessonId, nextStep.id);
          setIsAutoOpened(true);
          setIsInitialAutoOpen(true);
          setIsPopupMounted(true);
          setIsPopupOpen(true);
        } else {
          setIsPopupOpen(false);
          setIsPopupMounted(false);
          setIsAutoOpened(false);
          setIsInitialAutoOpen(false);
        }
      }
    },
    [steps, lesson.lessonId, clearAllGuideTimers],
  );

  const handleNext = () => {
    onUserEngage?.();
    if (stepIndex < steps.length - 1) {
      goToStepIndex(stepIndex + 1);
    } else {
      onCompleteSequence();
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      goToStepIndex(stepIndex - 1);
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
        className={[
          'gq-story-stage flex-1 flex flex-col justify-between min-h-0',
          isPaused ? 'gq-story-paused' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Fixed / Sticky Step Progress Row + Expandable Step Switcher */}
        <div
          style={{ top: 'var(--gq-lesson-header-h, 110px)' }}
          className="sticky z-20 bg-white/95 backdrop-blur-md border-b border-[#E5E2D9] px-3 sm:px-6 py-2"
        >
          <div className="max-w-[920px] mx-auto relative">
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="text-xs font-bold text-[#263A70] tabular-nums whitespace-nowrap">
                  Step {stepIndex + 1} of {steps.length}
                </span>
                <div
                  aria-hidden="true"
                  className="flex-1 max-w-[180px] h-2 rounded-full bg-[#F2EFE7] overflow-hidden"
                >
                  <div
                    className="h-full rounded-full bg-[#F6B93B] transition-all duration-200"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#4B5C8A] tabular-nums">
                  {percent}%
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStepsDrawerOpen((prev) => !prev)}
                aria-expanded={stepsDrawerOpen}
                aria-controls="lesson-steps-popover"
                className="inline-flex items-center gap-1 min-h-[36px] px-2.5 py-1 rounded-[10px] border border-[#E5E2D9] bg-[#FDFCF9] text-xs font-bold text-[#263A70] hover:bg-[#F5F2EA] cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
              >
                <ListOrdered className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Steps</span>
                {stepsDrawerOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Expandable Compact All-Steps Popover */}
            {stepsDrawerOpen ? (
              <div
                id="lesson-steps-popover"
                role="region"
                aria-label="Jump to lesson step"
                className="mt-2 max-h-[55dvh] overflow-y-auto rounded-[14px] bg-white border border-[#CFC9BA] shadow-md p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5"
              >
                {steps.map((s, idx) => {
                  const isCurrent = idx === stepIndex;
                  const isVisited = idx < stepIndex;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        goToStepIndex(idx);
                        setStepsDrawerOpen(false);
                      }}
                      aria-current={isCurrent ? 'step' : undefined}
                      className={[
                        'min-h-[44px] px-3 py-1.5 rounded-[10px] text-left flex items-center gap-2 text-xs transition-colors cursor-pointer',
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

        {/* Scrollable Lesson Workspace (with ~112px bottom clearance above fixed controls) */}
        <div className="flex-1 w-full max-w-[920px] mx-auto px-3.5 sm:px-6 pt-3.5 sm:pt-4 pb-[calc(112px+env(safe-area-inset-bottom,0px))]">
          {lesson.missionId === 'c9-mission-04' &&
          currentStep.id === 'stcp-step-01' ? (
            <SentenceTypesStep1View
              stepId={currentStep.id}
              sentence={activeSentence}
              clausePatternData={currentStep.clausePatternData}
              isPaused={isPaused}
              animationSeed={animationSeed}
              onUserEngage={onUserEngage}
            />
          ) : (
            <SentenceVisualizer
              stepId={currentStep.id}
              visualMode={currentStep.visualMode}
              visualCallout={currentStep.visualCallout}
              guidedChallenge={currentStep.guidedChallenge}
              timelineData={currentStep.timelineData}
              agreementData={currentStep.agreementData}
              clausePatternData={currentStep.clausePatternData}
              checkpointData={currentStep.checkpointData}
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
          )}
        </div>

        {/* Fixed Bottom Lesson Control Bar */}
        <LessonNavigation
          fixed
          currentStepIndex={stepIndex}
          totalSteps={steps.length}
          isPaused={isPaused}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onTogglePause={() => setIsPaused((p) => !p)}
          onReplay={handleReplay}
          nextLabel={stepIndex === steps.length - 1 ? finalNextLabel : 'Next'}
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

      {/* Centred Guide Note Modal Popup (Portal) */}
      <GuideNotePopup
        isOpen={isPopupOpen}
        isAutoOpened={isAutoOpened}
        characterId={currentStep.characterId}
        characterExpression={currentStep.characterExpression}
        badgeLabel={currentStep.badgeLabel}
        title={currentStep.title}
        shortPrompt={currentStep.shortPrompt}
        explanation={currentStep.explanation}
        dialogRef={dialogRef}
        returnFocusRef={guideButtonRef}
        onDismiss={handleDismissPopup}
        onAfterClose={handlePopupAfterClose}
      />
    </>
  );
};
