/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE VISUAL GRAMMAR TEACHING ENGINE
 * ============================================================================
 * Focused single-screen mission & lesson workspace organizing:
 *  - Compact sticky mission header (Back, concise title, class badge, phase bar)
 *  - Story Stage (Stage 1): 2D Indian courtyard & noticeboard intro
 *  - Learn Stage (Stages 2–7): Visual Grammar Teaching Engine steps
 *  - Guided Practice Stage (Stage 8): 6 interactive Word Laboratory tasks
 *  - Independent Practice Stage (Stage 9): Graduated unguided challenges
 *  - Completion Stage (Stage 10): Repaired noticeboard celebration & local save
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  Award,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  Sparkles,
} from 'lucide-react';
import type {
  GrammarLessonDefinition,
  WordLabActivity,
} from '../../../schemas/grammarEngine.schema';
import type {
  AssessmentAttemptRecord,
  RecommendedMissionStage,
} from '../../../schemas/assessment.schema';
import type { MissionProgressDetail } from '../../../schemas/lesson.schema';
import { getAssessmentForMission } from '../../../content/assessments/assessmentRegistry';
import { AssessmentRunner } from '../../assessment';
import { ScrollMoreHint } from '../../../components';
import { StoryIntroStage } from './StoryIntroStage';
import { TeachingSequence } from './TeachingSequence';
import { WordLaboratory } from './WordLaboratory';
import { IndependentPracticeStage } from './IndependentPracticeStage';
import { MissionCompletionStage } from './MissionCompletionStage';

export type EnginePhase =
  | 'story'
  | 'learn'
  | 'guided'
  | 'practice'
  | 'complete'
  | 'assess';

export interface GrammarTeachingEngineProps {
  lesson: GrammarLessonDefinition;
  initialPhase?: EnginePhase;
  missionProgress?: MissionProgressDetail;
  assessmentAttempt?: AssessmentAttemptRecord | null;
  onPhaseChange?: (phase: EnginePhase) => void;
  onAssessmentSubmitted?: (attempt: AssessmentAttemptRecord) => void;
  onExit: () => void;
  onRecordMissionStarted?: (lesson: GrammarLessonDefinition) => void;
  onRecordTeachingCompleted?: (lesson: GrammarLessonDefinition) => void;
  onRecordPracticeCompleted?: (
    lesson: GrammarLessonDefinition,
    kind: 'guided' | 'independent',
  ) => void;
  onRecordWordLabStars?: (
    lesson: GrammarLessonDefinition,
    activityId: string,
    stars: 1 | 2 | 3,
  ) => void;
  onRecordWordLabSolvedIds?: (
    lesson: GrammarLessonDefinition,
    solvedIds: string[],
  ) => void;
  onRecordIndependentSolvedIds?: (
    lesson: GrammarLessonDefinition,
    solvedIds: string[],
  ) => void;
  onRecordMissionCompleted?: (lesson: GrammarLessonDefinition) => void;
  onCompleteLessonPractice: (lesson: GrammarLessonDefinition) => void;
}

export const GrammarTeachingEngine: React.FC<GrammarTeachingEngineProps> = ({
  lesson,
  initialPhase,
  missionProgress,
  assessmentAttempt,
  onPhaseChange,
  onAssessmentSubmitted,
  onExit,
  onRecordMissionStarted,
  onRecordTeachingCompleted,
  onRecordPracticeCompleted,
  onRecordWordLabStars,
  onRecordWordLabSolvedIds,
  onRecordIndependentSolvedIds,
  onRecordMissionCompleted,
  onCompleteLessonPractice,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const hasStory = Boolean(lesson.storyIntro && lesson.storyIntro.beats.length > 0);
  const hasGuided = lesson.wordLabActivities.length > 0;
  const hasIndependent = Boolean(
    lesson.independentPractice && lesson.independentPractice.length > 0,
  );
  const hasCompletionSummary = Boolean(lesson.completionSummary);
  const assessment = getAssessmentForMission(lesson.missionId);
  const isAlreadyCompletedOrSubmitted =
    Boolean(missionProgress?.completed) || assessmentAttempt?.status === 'submitted';

  const resolveInitialPhase = (): EnginePhase => {
    if (initialPhase === 'assess' && assessment && isAlreadyCompletedOrSubmitted) {
      return 'assess';
    }
    if (initialPhase === 'guided' && hasGuided) return 'guided';
    if (initialPhase === 'practice' && hasIndependent) return 'practice';
    if (initialPhase === 'learn') return 'learn';
    if (initialPhase === 'complete' && hasCompletionSummary) return 'complete';
    if (initialPhase === 'story' && hasStory) return 'story';
    return hasStory ? 'story' : 'learn';
  };

  const [phase, setPhase] = useState<EnginePhase>(resolveInitialPhase);
  const [hasVisitedGuided, setHasVisitedGuided] = useState(
    () => resolveInitialPhase() === 'guided' && hasGuided,
  );
  const [hasVisitedPractice, setHasVisitedPractice] = useState(
    () => resolveInitialPhase() === 'practice',
  );
  const [completionUnlocked, setCompletionUnlocked] = useState(
    initialPhase === 'complete' || Boolean(missionProgress?.completed),
  );
  const startedRecordedRef = useRef<boolean>(Boolean(missionProgress?.started));
  if (missionProgress?.started) {
    startedRecordedRef.current = true;
  }

  const markStartedOnce = () => {
    if (startedRecordedRef.current) return;
    startedRecordedRef.current = true;
    onRecordMissionStarted?.(lesson);
  };

  const [learnJump, setLearnJump] = useState<{
    stepNumber?: number;
    nonce: number;
  }>({ nonce: 0 });
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  const [learnStepNumber, setLearnStepNumber] = useState<number>(1);
  const [activeWordLabKind, setActiveWordLabKind] = useState<WordLabActivity['kind'] | undefined>(
    () => lesson.wordLabActivities[0]?.kind,
  );
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeightPx, setHeaderHeightPx] = useState<number>(110);

  useEffect(() => {
    if (phase === 'guided') setHasVisitedGuided(true);
    if (phase === 'practice') setHasVisitedPractice(true);
    if (phase !== 'learn') {
      setIsLearnModalOpen(false);
    }
  }, [phase]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const updateHeight = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      if (h > 0) setHeaderHeightPx(h);
    };
    updateHeight();
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateHeight);
      observer.observe(el);
    }
    return () => observer?.disconnect();
  }, []);

  const updatePhase = (nextPhase: EnginePhase) => {
    if (nextPhase !== 'story') {
      markStartedOnce();
    }
    setPhase(nextPhase);
    onPhaseChange?.(nextPhase);
  };

  useEffect(() => {
    setLearnStepNumber(1);
    setLearnJump({ nonce: 0 });
  }, [lesson.missionId]);

  useEffect(() => {
    if (initialPhase) {
      const target = resolveInitialPhase();
      setPhase(target);
      if (target === 'complete') setCompletionUnlocked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.missionId, initialPhase]);

  const phaseTabs: {
    id: EnginePhase;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    visible: boolean;
  }[] = [
    { id: 'story', label: 'Story', Icon: Sparkles, visible: hasStory },
    { id: 'learn', label: 'Learn', Icon: BookOpenCheck, visible: true },
    { id: 'guided', label: 'Guided', Icon: FlaskConical, visible: hasGuided },
    { id: 'practice', label: 'Practice', Icon: CheckCircle2, visible: hasIndependent },
    {
      id: 'complete',
      label: 'Finish',
      Icon: Award,
      visible: hasCompletionSummary && completionUnlocked,
    },
    {
      id: 'assess',
      label: 'Test',
      Icon: ClipboardCheck,
      visible:
        Boolean(assessment) &&
        (completionUnlocked ||
          Boolean(missionProgress?.completed) ||
          assessmentAttempt?.status === 'submitted'),
    },
  ];

  const visibleTabs = phaseTabs.filter((t) => t.visible);

  const handleFinishIndependent = () => {
    onRecordPracticeCompleted?.(lesson, 'independent');
    setCompletionUnlocked(true);
    if (hasCompletionSummary) {
      // Save progress locally in IndexedDB ONLY after completing the mission stages!
      onRecordMissionCompleted?.(lesson);
      updatePhase('complete');
    } else {
      onCompleteLessonPractice(lesson);
    }
  };

  const handleRevisitStageFromAssessment = (
    stage: RecommendedMissionStage,
    stepNumber?: number,
  ) => {
    if (stage === 'learn') {
      setLearnJump((prev) => ({ stepNumber, nonce: prev.nonce + 1 }));
      updatePhase('learn');
    } else if (stage === 'guided') {
      updatePhase('guided');
    } else {
      updatePhase(hasIndependent ? 'practice' : 'guided');
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      style={{ '--gq-lesson-header-h': `${headerHeightPx}px` } as React.CSSProperties}
      className="min-h-[100dvh] flex flex-col bg-[#FDFCF9]"
    >
      {/* Zone A: Single Compact Sticky Lesson Header (Zero Duplicate App Bar) */}
      <header
        ref={headerRef}
        className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E2D9]"
      >
        <div className="max-w-[920px] mx-auto px-3 sm:px-6 pt-2 pb-1.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2 min-h-[44px]">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={onExit}
                aria-label="Back to Lessons"
                className="inline-flex items-center justify-center w-11 h-11 min-h-[44px] min-w-[44px] rounded-[12px] border border-[#E5E2D9] bg-[#FDFCF9] text-[#1B2559] hover:bg-[#F5F2EA] cursor-pointer shrink-0 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
              >
                <ArrowLeft className="w-4.5 h-4.5" aria-hidden="true" />
              </button>

              <div className="min-w-0">
                <h1 className="text-[16px] font-extrabold text-[#1B2559] truncate leading-tight">
                  {lesson.missionTitle}
                </h1>
                <p className="text-[12px] font-medium text-[#4B5C8A] truncate leading-tight">
                  {lesson.moduleTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Equal-Width Mode Tabs (44px min height, icon above label, #F6B93B active) */}
          <div
            role="tablist"
            aria-label="Lesson stages"
            className="grid gap-1 p-1 rounded-[12px] bg-[#F5F2EA] border border-[#E5E2D9]"
            style={{
              gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))`,
            }}
          >
            {visibleTabs.map(({ id, label, Icon }) => {
              const isSelected = phase === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => updatePhase(id)}
                  className={[
                    'flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-1 py-1 rounded-[9px] text-[11px] font-bold leading-none whitespace-nowrap transition-colors cursor-pointer min-w-0',
                    'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                    isSelected
                      ? 'bg-[#F6B93B] text-[#1B2559] shadow-xs'
                      : 'text-[#4B5C8A] hover:text-[#1B2559]',
                  ].join(' ')}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate max-w-full">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Active Lesson Stage */}
      {phase === 'story' && lesson.storyIntro ? (
        <StoryIntroStage
          missionTitle={lesson.missionTitle}
          storyIntro={lesson.storyIntro}
          onAdvanceStory={markStartedOnce}
          onStartTeaching={() => updatePhase('learn')}
        />
      ) : null}

      {phase === 'learn' ? (
        <TeachingSequence
          key={lesson.lessonId}
          lesson={lesson}
          initialStepNumber={learnJump.stepNumber ?? learnStepNumber}
          stepJumpNonce={learnJump.nonce}
          finalNextLabel={
            hasGuided ? 'Guided' : hasIndependent ? 'Practice' : 'Finish Learn'
          }
          onUserEngage={markStartedOnce}
          onCompleteSequence={() => {
            onRecordTeachingCompleted?.(lesson);
            if (hasGuided) {
              updatePhase('guided');
            } else if (hasIndependent) {
              updatePhase('practice');
            } else {
              setCompletionUnlocked(true);
              onCompleteLessonPractice(lesson);
            }
          }}
          onGuideModalOpenChange={setIsLearnModalOpen}
          onStepChange={(stepNumber) => {
            setLearnStepNumber(stepNumber);
            setLearnJump((prev) =>
              prev.stepNumber !== undefined ? { nonce: prev.nonce } : prev,
            );
          }}
        />
      ) : null}

      {hasGuided && (phase === 'guided' || hasVisitedGuided) ? (
        <div
          className={[
            'flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6',
            activeWordLabKind === 'categorise'
              ? 'pt-2 pb-[68px]'
              : 'py-3 sm:py-5 pb-[96px]',
            phase === 'guided' ? '' : 'hidden',
          ].join(' ')}
        >
          <WordLaboratory
            activities={lesson.wordLabActivities}
            initialSolvedIds={missionProgress?.wordLabSolvedIds}
            hasIndependentPractice={hasIndependent}
            onActiveActivityChange={(act) => setActiveWordLabKind(act.kind)}
            onSolvedIdsChange={(ids) => onRecordWordLabSolvedIds?.(lesson, ids)}
            onAllSolved={() => onRecordPracticeCompleted?.(lesson, 'guided')}
            onRecordActivityStars={(activityId, stars) =>
              onRecordWordLabStars?.(lesson, activityId, stars)
            }
            onBackToLesson={() => updatePhase('learn')}
            onFinishMissionPractice={(allSolved) => {
              if (allSolved) {
                onRecordPracticeCompleted?.(lesson, 'guided');
              }
              if (hasIndependent) {
                updatePhase('practice');
              } else if (allSolved) {
                onCompleteLessonPractice(lesson);
              }
            }}
          />
        </div>
      ) : null}

      {(phase === 'practice' || hasVisitedPractice) && lesson.independentPractice ? (
        <div
          className={[
            'flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-[120px]',
            phase === 'practice' ? '' : 'hidden',
          ].join(' ')}
        >
          <IndependentPracticeStage
            items={lesson.independentPractice}
            initialSolvedIds={missionProgress?.independentSolvedIds}
            onSolvedIdsChange={(ids) => onRecordIndependentSolvedIds?.(lesson, ids)}
            onBackToGuided={() => updatePhase('guided')}
            onFinishIndependentPractice={handleFinishIndependent}
          />
        </div>
      ) : null}

      {phase === 'complete' && lesson.completionSummary ? (
        <div className="flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-[120px]">
          <MissionCompletionStage
            missionTitle={lesson.missionTitle}
            summary={lesson.completionSummary}
            assessmentAttempt={assessmentAttempt}
            onStartAssessment={assessment ? () => updatePhase('assess') : undefined}
            onReturnHome={() => {
              if (onRecordMissionCompleted) {
                onExit();
              } else {
                onCompleteLessonPractice(lesson);
              }
            }}
            onReviewLesson={() => updatePhase('learn')}
          />
        </div>
      ) : null}

      {phase === 'assess' && assessment ? (
        <div className="flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-[120px]">
          <AssessmentRunner
            assessment={assessment}
            onRevisitStage={handleRevisitStageFromAssessment}
            onBackToMission={() => updatePhase(hasStory ? 'story' : 'learn')}
            onReviewLesson={() => updatePhase('learn')}
            onBackToHome={onExit}
            onAssessmentSubmitted={onAssessmentSubmitted}
          />
        </div>
      ) : null}

      {!(phase === 'learn' && isLearnModalOpen) &&
      !(phase === 'guided' && activeWordLabKind === 'categorise') ? (
        <ScrollMoreHint
          ariaLabel="Scroll down to see more content"
          fadeColor="#FDFCF9"
          bottomOffsetMode={
            phase === 'story' || phase === 'learn' || phase === 'guided'
              ? 'lesson-nav'
              : 'none'
          }
          minOverflowPx={24}
          recheckKey={`${lesson.missionId}-${phase}-${activeWordLabKind ?? ''}-${learnStepNumber}-${isLearnModalOpen}`}
        />
      ) : null}
    </motion.div>
  );
};
