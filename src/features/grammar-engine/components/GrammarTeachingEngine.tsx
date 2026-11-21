/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE VISUAL GRAMMAR TEACHING ENGINE
 * ============================================================================
 * Focused single-screen mission & lesson workspace hosted inside AppShell:
 *  - Region B: Compact lesson header (Back, concise title, equal-width stage tabs)
 *  - Region C: Stage-provided sub-header (Learn Step bar, Guided A–F tabs, Practice Try pills)
 *  - Region D: Single primary scrolling content region + floating overlays & scroll cue
 *  - Region E: Reserved screen-specific bottom action region per stage
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
import { AppShell } from '../../../components';
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
  const lessonScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (phase === 'guided') setHasVisitedGuided(true);
    if (phase === 'practice') setHasVisitedPractice(true);
    if (phase !== 'learn') {
      setIsLearnModalOpen(false);
    }
    lessonScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [phase]);

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
    lessonScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  };

  const lessonHeader = (
    <header>
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
  );

  return (
    <AppShell
      className="bg-[#FDFCF9] text-[#333333]"
      header={lessonHeader}
      utilityMaxWidthClassName="max-w-[920px]"
      scrollContainerRef={lessonScrollRef}
      showScrollHint={!(phase === 'learn' && isLearnModalOpen)}
      scrollHintAriaLabel="Scroll back to top"
      scrollHintMinOverflowPx={24}
      scrollRecheckKey={`${lesson.missionId}-${phase}-${activeWordLabKind ?? ''}-${learnStepNumber}-${isLearnModalOpen}`}
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
        className="w-full"
      >
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
              'w-full max-w-[920px] mx-auto px-3 sm:px-6',
              activeWordLabKind === 'categorise'
                ? 'pt-2.5 pb-6'
                : 'py-3 sm:py-4 pb-6',
              phase === 'guided' ? '' : 'hidden',
            ].join(' ')}
          >
            <WordLaboratory
              isActive={phase === 'guided'}
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
              'w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-4 pb-6',
              phase === 'practice' ? '' : 'hidden',
            ].join(' ')}
          >
            <IndependentPracticeStage
              isActive={phase === 'practice'}
              items={lesson.independentPractice}
              initialSolvedIds={missionProgress?.independentSolvedIds}
              onSolvedIdsChange={(ids) => onRecordIndependentSolvedIds?.(lesson, ids)}
              onBackToGuided={() => updatePhase('guided')}
              onFinishIndependentPractice={handleFinishIndependent}
            />
          </div>
        ) : null}

        {phase === 'complete' && lesson.completionSummary ? (
          <div className="w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-4 pb-6">
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
          <div className="w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-4 pb-6">
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
      </motion.div>
    </AppShell>
  );
};
