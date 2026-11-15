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

import React, { useEffect, useState } from 'react';
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
import type { GrammarLessonDefinition } from '../../../schemas/grammarEngine.schema';
import type {
  AssessmentAttemptRecord,
  RecommendedMissionStage,
} from '../../../schemas/assessment.schema';
import { getAssessmentForMission } from '../../../content/assessments/assessmentRegistry';
import { AssessmentRunner } from '../../assessment';
import { Badge, ScrollMoreHint } from '../../../components';
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
  assessmentAttempt?: AssessmentAttemptRecord | null;
  onPhaseChange?: (phase: EnginePhase) => void;
  onAssessmentSubmitted?: (attempt: AssessmentAttemptRecord) => void;
  onExit: () => void;
  onRecordMissionCompleted?: (lesson: GrammarLessonDefinition) => void;
  onCompleteLessonPractice: (lesson: GrammarLessonDefinition) => void;
}

export const GrammarTeachingEngine: React.FC<GrammarTeachingEngineProps> = ({
  lesson,
  initialPhase,
  assessmentAttempt,
  onPhaseChange,
  onAssessmentSubmitted,
  onExit,
  onRecordMissionCompleted,
  onCompleteLessonPractice,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const hasStory = Boolean(lesson.storyIntro && lesson.storyIntro.beats.length > 0);
  const hasIndependent = Boolean(
    lesson.independentPractice && lesson.independentPractice.length > 0,
  );
  const hasCompletionSummary = Boolean(lesson.completionSummary);
  const assessment = getAssessmentForMission(lesson.missionId);

  const resolveInitialPhase = (): EnginePhase => {
    if (initialPhase === 'assess' && assessment) return 'assess';
    if (initialPhase === 'guided') return 'guided';
    if (initialPhase === 'practice' && hasIndependent) return 'practice';
    if (initialPhase === 'learn') return 'learn';
    if (initialPhase === 'complete' && hasCompletionSummary) return 'complete';
    if (initialPhase === 'story' && hasStory) return 'story';
    return hasStory ? 'story' : 'learn';
  };

  const [phase, setPhase] = useState<EnginePhase>(resolveInitialPhase);
  const [completionUnlocked, setCompletionUnlocked] = useState(
    initialPhase === 'complete',
  );
  const [learnJump, setLearnJump] = useState<{
    stepNumber?: number;
    nonce: number;
  }>({ nonce: 0 });

  const updatePhase = (nextPhase: EnginePhase) => {
    setPhase(nextPhase);
    onPhaseChange?.(nextPhase);
  };

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
    { id: 'guided', label: 'Guided', Icon: FlaskConical, visible: true },
    { id: 'practice', label: 'Practice', Icon: CheckCircle2, visible: hasIndependent },
    {
      id: 'complete',
      label: 'Finish',
      Icon: Award,
      visible: hasCompletionSummary && completionUnlocked,
    },
    { id: 'assess', label: 'Test', Icon: ClipboardCheck, visible: Boolean(assessment) },
  ];

  const visibleTabs = phaseTabs.filter((t) => t.visible);

  const handleFinishIndependent = () => {
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
      className="min-h-[100dvh] flex flex-col bg-[#FDFCF9]"
    >
      {/* Zone A: Single Compact Sticky Lesson Header (Zero Duplicate App Bar) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E2D9]">
        <div className="max-w-[920px] mx-auto px-3 sm:px-6 pt-2 pb-1.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2 min-h-[40px]">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={onExit}
                aria-label="Back to Missions"
                className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#E5E2D9] bg-[#FDFCF9] text-[#263A70] hover:bg-[#F5F2EA] cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="min-w-0">
                <h1 className="font-heading text-sm sm:text-base font-semibold text-[#263A70] truncate">
                  {lesson.missionTitle}
                </h1>
                <p className="text-[11px] text-[#4B5C8A] truncate">
                  {lesson.moduleTitle} · {lesson.topic}
                </p>
              </div>
            </div>

            <Badge tone="turquoise">Class {lesson.classLevel}</Badge>
          </div>

          {/* 360px-safe Compact Stage Switcher */}
          <div
            role="tablist"
            aria-label="Mission stages"
            className="grid gap-0.5 sm:gap-1 p-1 rounded-[12px] bg-[#F5F2EA] border border-[#E5E2D9]"
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
                    'inline-flex items-center justify-center gap-0.5 sm:gap-1 min-h-[36px] px-1 sm:px-1.5 rounded-[9px] text-[10.5px] sm:text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer min-w-0',
                    isSelected
                      ? 'bg-[#FFC64B] text-[#263A70] shadow-xs'
                      : 'text-[#4B5C8A] hover:text-[#263A70]',
                  ].join(' ')}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Active Mission Stage */}
      {phase === 'story' && lesson.storyIntro ? (
        <StoryIntroStage
          missionTitle={lesson.missionTitle}
          storyIntro={lesson.storyIntro}
          onStartTeaching={() => updatePhase('learn')}
        />
      ) : null}

      {phase === 'learn' ? (
        <TeachingSequence
          lesson={lesson}
          initialStepNumber={learnJump.stepNumber}
          stepJumpNonce={learnJump.nonce}
          onCompleteSequence={() => updatePhase('guided')}
        />
      ) : null}

      {phase === 'guided' ? (
        <div className="flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-[120px]">
          <WordLaboratory
            activities={lesson.wordLabActivities}
            hasIndependentPractice={hasIndependent}
            onBackToLesson={() => updatePhase('learn')}
            onFinishMissionPractice={() => {
              if (hasIndependent) {
                updatePhase('practice');
              } else {
                onCompleteLessonPractice(lesson);
              }
            }}
          />
        </div>
      ) : null}

      {phase === 'practice' && lesson.independentPractice ? (
        <div className="flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-[120px]">
          <IndependentPracticeStage
            items={lesson.independentPractice}
            onBackToGuided={() => updatePhase('guided')}
            onFinishIndependentPractice={handleFinishIndependent}
          />
        </div>
      ) : null}

      {phase === 'complete' && lesson.completionSummary ? (
        <div className="flex-1 w-full max-w-[920px] mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-[120px]">
          <MissionCompletionStage
            missionTitle={lesson.missionTitle}
            classLevel={lesson.classLevel}
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
            onBackToHome={onExit}
            onAssessmentSubmitted={onAssessmentSubmitted}
          />
        </div>
      ) : null}

      <ScrollMoreHint
        label="Scroll for more"
        ariaLabel="Scroll down to see more"
        fadeColor="#FDFCF9"
        bottomOffsetMode={phase === 'story' || phase === 'learn' ? 'lesson-nav' : 'none'}
        recheckKey={phase}
      />
    </motion.div>
  );
};
