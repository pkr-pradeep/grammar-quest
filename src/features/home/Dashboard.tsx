/**
 * ============================================================================
 * GRAMMAR QUEST — COMPACT MOBILE-FIRST HOME DASHBOARD
 * ============================================================================
 * Fits greeting + class selector, My Progress card, and all 3 mission rows
 * comfortably within a 390x844 mobile viewport while expanding cleanly on
 * desktop screens. Preserves all data, routing, accessibility, and local
 * progress/assessment logic.
 * ============================================================================
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, ChevronRight, ClipboardCheck, Lock, ShieldCheck } from 'lucide-react';
import type {
  ClassLevel,
  PlaceholderMissionSummary,
  StudentProgressRecord,
} from '../../schemas/lesson.schema';
import type { AssessmentAttemptRecord } from '../../schemas/assessment.schema';
import { PLACEHOLDER_CLASS_CONTENT } from '../../content/placeholderDashboard';
import { getMissionProgressDetail } from '../../storage/progressRepository';
import {
  MissionIllustration,
  WelcomeTrioIllustration,
} from '../../components';

export interface DashboardProps {
  selectedClass: ClassLevel;
  progress: StudentProgressRecord;
  assessmentAttemptsByMission?: Record<string, AssessmentAttemptRecord>;
  onSelectClass: (classLevel: ClassLevel) => void;
  onPreviewMission: (mission: PlaceholderMissionSummary) => void;
  onOpenMissions: () => void;
  onOpenAssessment?: (missionId: string, preferredClass: ClassLevel) => void;
}

const CLASS_OPTIONS: { level: ClassLevel; label: string }[] = [
  { level: 9, label: 'Class 9' },
  { level: 10, label: 'Class 10' },
];

const FADE_UP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const Dashboard: React.FC<DashboardProps> = ({
  selectedClass,
  progress,
  assessmentAttemptsByMission = {},
  onSelectClass,
  onPreviewMission,
  onOpenMissions,
  onOpenAssessment,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const classContent = PLACEHOLDER_CLASS_CONTENT[selectedClass];
  const allMissions = [classContent.featuredMission, ...classContent.plannedTracks];

  const completedInClass = allMissions.filter(
    (mission) => getMissionProgressDetail(progress, mission.id).completed,
  ).length;

  const submittedAssessments = allMissions
    .map((mission, idx) => {
      const attempt = assessmentAttemptsByMission[mission.id];
      if (
        attempt?.status === 'submitted' &&
        attempt.score !== null &&
        attempt.percentage !== null
      ) {
        return {
          shortLabel: `M${idx + 1}`,
          score: attempt.score,
          total: attempt.totalQuestions,
          percentage: attempt.percentage,
        };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const recommendedMissionId =
    allMissions.find(
      (mission) =>
        mission.status === 'ready' &&
        !getMissionProgressDetail(progress, mission.id).completed,
    )?.id ?? allMissions[0]?.id;

  const fadeUpProps = (delaySeconds: number) =>
    prefersReducedMotion
      ? {
          initial: { opacity: 1, y: 0 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: delaySeconds, ease: FADE_UP_EASE },
        };

  return (
    <div className="space-y-3 lg:space-y-5">
      {/* Compact Hero Card */}
      <motion.section
        aria-label="Welcome and class selection"
        {...fadeUpProps(0)}
        className="relative overflow-hidden rounded-[24px] bg-[#FFFDF6] border-[1.5px] border-[#E9E1CB] p-4 min-h-[178px] flex items-center"
      >
        {/* Left Column: Greeting + Class Segmented Control */}
        <div className="relative z-10 w-[204px] min-[375px]:w-[214px] sm:w-auto sm:max-w-[360px] md:max-w-[440px]">
          <h1 className="text-[22px] sm:text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#1B2559]">
            Namaste, Learner!
          </h1>
          <p className="text-[13px] leading-[1.35] text-[#4A5170] mt-1">
            {classContent.welcomeSubtitle}
          </p>

          <div className="mt-2.5">
            <span
              id="class-selector-label"
              className="block text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#6B6557] mb-1.5"
            >
              Choose your class
            </span>
            <div
              role="group"
              aria-labelledby="class-selector-label"
              className="grid grid-cols-2 gap-1 p-1 rounded-[16px] bg-[#F3ECD8] w-full max-w-[214px] sm:max-w-[240px]"
            >
              {CLASS_OPTIONS.map(({ level, label }) => {
                const isSelected = selectedClass === level;
                return (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onSelectClass(level)}
                    className={[
                      'h-10 px-3 rounded-[12px] text-[13px] font-extrabold whitespace-nowrap',
                      'transition-colors duration-150 cursor-pointer',
                      'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                      isSelected
                        ? 'bg-[#F6B93B] text-[#1B2559] shadow-xs'
                        : 'bg-transparent text-[#4A5170] hover:text-[#1B2559]',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Bottom-Right Anchored Existing Trio Artwork + Soft Warm Circle */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-[-6px] bottom-0 w-[150px] h-[116px] min-[375px]:w-[170px] min-[375px]:h-[130px] sm:w-[230px] sm:h-[152px] md:w-[260px] md:h-[164px] flex items-end justify-end"
        >
          <span className="absolute right-2 bottom-[-14px] w-[132px] h-[132px] min-[375px]:w-[148px] min-[375px]:h-[148px] sm:w-[196px] sm:h-[196px] rounded-full bg-[#FCE9BE]" />
          <WelcomeTrioIllustration className="relative z-10 w-full h-auto max-h-full block translate-y-[2px]" />
        </div>
      </motion.section>

      {/* Main Content: My Progress + Missions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5 items-start">
        {/* Tight My Progress Card */}
        <motion.section
          aria-labelledby="learning-progress-heading"
          {...fadeUpProps(0.1)}
          className="lg:col-span-5 lg:order-2 rounded-[22px] bg-[#FFFDF6] border-[1.5px] border-[#E9E1CB] px-4 py-[14px] flex flex-col gap-[10px]"
        >
          {/* Row 1: Title + Class Pill */}
          <div className="flex items-center justify-between gap-2">
            <h2
              id="learning-progress-heading"
              className="text-[17px] font-extrabold leading-tight text-[#1B2559]"
            >
              My Progress
            </h2>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#8CE6D3] text-[#0B4A41] text-[11.5px] font-bold leading-none whitespace-nowrap">
              {classContent.classLabel}
            </span>
          </div>

          {/* Row 2: 3-Segment Progress Bar + Real Count */}
          <div className="flex items-center gap-3">
            <div
              role="progressbar"
              aria-label="Completed missions"
              aria-valuemin={0}
              aria-valuemax={allMissions.length}
              aria-valuenow={completedInClass}
              className="flex-1 grid grid-cols-3 gap-[5px]"
            >
              {allMissions.map((mission) => {
                const isDone = getMissionProgressDetail(progress, mission.id).completed;
                return (
                  <span
                    key={mission.id}
                    className={[
                      'h-2 rounded-full transition-colors duration-200',
                      isDone ? 'bg-[#F6B93B]' : 'bg-[#EDE5CF]',
                    ].join(' ')}
                  />
                );
              })}
            </div>
            <p className="text-[13px] leading-none whitespace-nowrap shrink-0 tabular-nums">
              <strong className="font-extrabold text-[#1B2559]">
                {completedInClass} of {allMissions.length}
              </strong>{' '}
              <span className="font-semibold text-[#6B6557]">missions</span>
            </p>
          </div>

          {/* Row 3: Empty-State or Compact Score Summary */}
          <p className="text-[12.5px] leading-[1.35] text-[#4A5170]">
            {submittedAssessments.length > 0 ? (
              <>
                <span className="font-semibold text-[#1B2559]">
                  {classContent.classLabel} scores:{' '}
                </span>
                <span className="tabular-nums">
                  {submittedAssessments
                    .map((s) => `${s.shortLabel} ${s.score}/${s.total} (${s.percentage}%)`)
                    .join(' · ')}
                </span>
              </>
            ) : completedInClass > 0 ? (
              `${completedInClass} of ${allMissions.length} missions completed in ${classContent.classLabel}. Take a test below to record your score.`
            ) : (
              `No missions completed yet. Scores for ${classContent.classLabel} will appear here.`
            )}
          </p>

          {/* Row 4: Local Storage Privacy Note */}
          <div className="flex items-center gap-1.5 text-[11.5px] leading-tight text-[#0B5F58]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Saved on this device, no account needed.</span>
          </div>
        </motion.section>

        {/* Missions List */}
        <section
          aria-labelledby="missions-heading"
          className="lg:col-span-7 lg:order-1 space-y-2"
        >
          <motion.div
            {...fadeUpProps(0.16)}
            className="flex items-center justify-between gap-2"
          >
            <h2
              id="missions-heading"
              className="text-[17px] font-extrabold leading-tight text-[#1B2559]"
            >
              Missions
            </h2>
            <button
              type="button"
              onClick={onOpenMissions}
              className="inline-flex items-center gap-0.5 h-[36px] min-h-[44px] -my-1 px-1.5 -mr-1.5 rounded-[10px] text-[13.5px] font-extrabold text-[#1B2559] hover:underline cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
            >
              <span>See all</span>
              <ChevronRight className="w-4 h-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </motion.div>

          <div className="flex flex-col gap-[10px]">
            {allMissions.map((mission, index) => {
              const detail = getMissionProgressDetail(progress, mission.id);
              const isCompleted = detail.completed;
              const isInProgress = !isCompleted && detail.started;
              const isLocked = mission.status !== 'ready';
              const isHighlighted = mission.id === recommendedMissionId && !isLocked;

              const attempt = assessmentAttemptsByMission[mission.id] ?? null;
              const isSubmitted =
                attempt?.status === 'submitted' &&
                attempt.score !== null &&
                attempt.percentage !== null;
              const isTestInProgress = attempt?.status === 'in-progress';

              const testStatusText = isLocked
                ? 'Locked'
                : isSubmitted
                  ? `${attempt.percentage}% · Done`
                  : isTestInProgress
                    ? 'In progress'
                    : 'Not submitted';

              return (
                <motion.div
                  key={mission.id}
                  {...fadeUpProps(0.2 + index * 0.08)}
                  className={[
                    'rounded-[20px] p-3 border-[1.5px] flex items-center gap-[10px]',
                    isHighlighted
                      ? 'bg-[#FDEBC0] border-[#F0CF86]'
                      : 'bg-[#FFFDF6] border-[#E9E1CB]',
                  ].join(' ')}
                >
                  {/* Left: Tappable Mission Area */}
                  <button
                    type="button"
                    onClick={() => onPreviewMission(mission)}
                    className="flex-1 min-w-0 flex items-center gap-[10px] text-left cursor-pointer rounded-[12px] min-h-[44px] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
                  >
                    {/* 44px Rounded Icon Tile */}
                    <span className="w-11 h-11 rounded-[14px] bg-white border-[1.5px] border-[#E4DCC6] flex items-center justify-center shrink-0">
                      <MissionIllustration
                        kind={mission.iconKind}
                        className="w-[26px] h-[26px]"
                      />
                    </span>

                    {/* 3-Line Mission Copy */}
                    <span className="flex-1 min-w-0 block">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#9C4F08] whitespace-nowrap">
                          {mission.missionNumber}
                        </span>

                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8CE6D3] text-[#0B4A41] text-[10.5px] font-extrabold leading-none whitespace-nowrap">
                            <Check className="w-3 h-3 shrink-0" strokeWidth={2.7} aria-hidden="true" />
                            <span>Completed</span>
                          </span>
                        ) : isLocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDE5CF] text-[#4A5170] text-[10.5px] font-extrabold leading-none whitespace-nowrap">
                            <Lock className="w-2.5 h-2.5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
                            <span>Locked</span>
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F6B93B] text-[#1B2559] text-[10.5px] font-extrabold leading-none whitespace-nowrap">
                            In progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F6B93B] text-[#1B2559] text-[10.5px] font-extrabold leading-none whitespace-nowrap">
                            Ready
                          </span>
                        )}
                      </span>

                      <span className="block text-[15px] font-extrabold text-[#1B2559] leading-snug truncate mt-0.5">
                        {mission.title}
                      </span>

                      <span className="block text-[12px] font-medium text-[#6B6557] leading-snug truncate">
                        {mission.topicLabel}
                      </span>
                    </span>
                  </button>

                  {/* Right: Compact Assessment Button + Tiny Status Line */}
                  {onOpenAssessment ? (
                    <div className="shrink-0 flex flex-col items-center gap-0.5">
                      <button
                        type="button"
                        disabled={isLocked}
                        aria-label={`Take ${mission.missionNumber} Assessment`}
                        onClick={() => onOpenAssessment(mission.id, selectedClass)}
                        className={[
                          'h-11 min-h-[44px] px-3 rounded-[14px] border-[1.5px] inline-flex items-center justify-center gap-1.5',
                          'text-[13px] font-extrabold leading-none whitespace-nowrap transition-colors',
                          'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                          isLocked
                            ? 'bg-[#EDE5CF] border-[#D8CEB3] text-[#4A5170] opacity-75 cursor-not-allowed'
                            : 'bg-[#F6B93B] hover:bg-[#ECAC27] border-[#E5A21F] text-[#1B2559] cursor-pointer',
                        ].join(' ')}
                      >
                        {isLocked ? (
                          <Lock className="w-3.5 h-3.5 shrink-0" strokeWidth={2.3} aria-hidden="true" />
                        ) : (
                          <ClipboardCheck
                            className="w-3.5 h-3.5 shrink-0"
                            strokeWidth={2.3}
                            aria-hidden="true"
                          />
                        )}
                        <span className="tabular-nums">
                          {isSubmitted ? `${attempt.score}/${attempt.totalQuestions}` : 'Test'}
                        </span>
                      </button>

                      <span className="text-[10px] font-semibold leading-tight text-[#575145] tabular-nums whitespace-nowrap">
                        {testStatusText}
                      </span>
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
