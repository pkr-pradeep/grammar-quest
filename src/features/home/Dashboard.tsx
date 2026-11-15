/**
 * ============================================================================
 * GRAMMAR QUEST — MOBILE-FIRST HOME DASHBOARD (STUDENT EXPERIENCE)
 * ============================================================================
 * Preserves the approved Prompt 2.1 mobile-first layout, colour palette,
 * Inter typography, logo, and character trio while keeping all visible copy
 * strictly student-facing and accurate to current activity availability.
 * ============================================================================
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import type {
  ClassLevel,
  PlaceholderMissionSummary,
  StudentProgressRecord,
} from '../../schemas/lesson.schema';
import { PLACEHOLDER_CLASS_CONTENT } from '../../content/placeholderDashboard';
import {
  Badge,
  Card,
  MissionIllustration,
  Progress,
  WelcomeTrioIllustration,
} from '../../components';

export interface DashboardProps {
  selectedClass: ClassLevel;
  progress: StudentProgressRecord;
  onSelectClass: (classLevel: ClassLevel) => void;
  onPreviewMission: (mission: PlaceholderMissionSummary) => void;
  onOpenMissions: () => void;
}

const CLASS_OPTIONS: { level: ClassLevel; label: string }[] = [
  { level: 9, label: 'Class 9' },
  { level: 10, label: 'Class 10' },
];

export const Dashboard: React.FC<DashboardProps> = ({
  selectedClass,
  progress,
  onSelectClass,
  onPreviewMission,
  onOpenMissions,
}) => {
  const classContent = PLACEHOLDER_CLASS_CONTENT[selectedClass];
  const allMissions = [classContent.featuredMission, ...classContent.plannedTracks];

  const completedInClass = progress.completedMissionIds.filter((id) =>
    id.startsWith(`c${selectedClass}-`),
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5 sm:space-y-6"
    >
      {/* Top Hero Card: Greeting + Compact Character Trio + Class Selection */}
      <Card surface="white" padding="md" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
          {/* Greeting + Class Selection */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <h1 className="font-heading text-2xl sm:text-[28px] font-semibold text-[#263A70] leading-tight">
                Namaste, Learner!
              </h1>
              <p className="text-sm sm:text-base text-[#333333] max-w-md">
                {classContent.welcomeSubtitle}
              </p>
            </div>

            {/* Class 9 / Class 10 Selector */}
            <div>
              <span
                id="class-selector-label"
                className="block text-xs font-medium text-[#4B5C8A] mb-1.5"
              >
                Choose your class
              </span>
              <div
                role="radiogroup"
                aria-labelledby="class-selector-label"
                className="inline-flex p-1 rounded-[14px] bg-[#F5F2EA] border border-[#E5E2D9] gap-1"
              >
                {CLASS_OPTIONS.map(({ level, label }) => {
                  const isSelected = selectedClass === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelectClass(level)}
                      className={[
                        'min-h-[44px] px-4 sm:px-5 py-2 rounded-[10px] text-sm font-medium whitespace-nowrap',
                        'transition-colors duration-150 cursor-pointer',
                        isSelected
                          ? 'bg-[#FFC64B] text-[#263A70] shadow-xs'
                          : 'text-[#4B5C8A] hover:text-[#263A70]',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Compact Trio Illustration */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <WelcomeTrioIllustration className="w-full max-w-[230px] sm:max-w-[260px] md:max-w-[300px] h-auto" />
          </div>
        </div>
      </Card>

      {/* Main Content: Stacked Missions + Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Three Stacked Mission Cards */}
        <section
          aria-labelledby="missions-heading"
          className="lg:col-span-7 space-y-3 order-2 lg:order-1"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="missions-heading"
              className="font-heading text-lg font-semibold text-[#263A70]"
            >
              Missions
            </h2>
            <button
              type="button"
              onClick={onOpenMissions}
              className="text-sm font-medium text-[#263A70] hover:underline min-h-[44px] px-2 cursor-pointer"
            >
              See all
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {allMissions.map((mission, index) => {
              const isPrimaryCard = index === 0;
              const isCompleted = progress.completedMissionIds.includes(mission.id);
              const badgeTone = isCompleted
                ? 'turquoise'
                : mission.status === 'ready'
                  ? 'sunshine'
                  : 'neutral';
              const badgeLabel = isCompleted
                ? 'Completed'
                : mission.status === 'ready'
                  ? 'Ready'
                  : 'Coming soon';
              return (
                <Card
                  key={mission.id}
                  surface={isPrimaryCard ? 'cream' : 'white'}
                  padding="sm"
                  elevated={isPrimaryCard}
                  className="transition-shadow"
                >
                  <button
                    type="button"
                    onClick={() => onPreviewMission(mission)}
                    className="w-full flex items-center gap-3.5 sm:gap-4 text-left cursor-pointer rounded-[12px]"
                  >
                    {/* Mission Icon */}
                    <div
                      className={[
                        'w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] flex items-center justify-center shrink-0 border',
                        isPrimaryCard
                          ? 'bg-white border-[#F2DFB6]'
                          : 'bg-[#FDFCF9] border-[#E5E2D9]',
                      ].join(' ')}
                    >
                      <MissionIllustration
                        kind={mission.iconKind}
                        className="w-10 h-10 sm:w-11 sm:h-11"
                      />
                    </div>

                    {/* Mission Info */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-[#C46B00]">
                          {mission.missionNumber}
                        </span>
                        <Badge tone={badgeTone}>{badgeLabel}</Badge>
                      </div>

                      <h3 className="font-heading text-base sm:text-lg font-semibold text-[#263A70] leading-snug">
                        {mission.title}
                      </h3>

                      <p className="text-xs sm:text-sm font-medium text-[#4B5C8A]">
                        {mission.topicLabel}
                      </p>

                      <p className="text-xs sm:text-sm text-[#333333] line-clamp-2">
                        {mission.shortDescription}
                      </p>
                    </div>

                    {/* Details Disclosure */}
                    <span
                      aria-hidden="true"
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[#4B5C8A] shrink-0"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </button>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Learning Progress */}
        <section
          aria-labelledby="learning-progress-heading"
          className="lg:col-span-5 space-y-3 order-1 lg:order-2"
        >
          <div className="flex items-center justify-between min-h-[32px] lg:min-h-[44px]">
            <h2
              id="learning-progress-heading"
              className="font-heading text-lg font-semibold text-[#263A70]"
            >
              My Progress
            </h2>
            <Badge tone="turquoise">{classContent.classLabel}</Badge>
          </div>

          <Card surface="white" padding="sm" className="sm:p-5 space-y-3.5">
            {completedInClass > 0 ? (
              <Progress
                value={completedInClass}
                max={allMissions.length}
                label="Completed missions"
                summaryText={`${completedInClass} of ${allMissions.length}`}
              />
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#263A70]">
                  No missions completed yet
                </p>
                <p className="text-xs sm:text-sm text-[#4B5C8A]">
                  Your completed missions and scores for {classContent.classLabel} will appear here.
                </p>
              </div>
            )}

            <div className="flex items-start gap-2 pt-2.5 border-t border-[#E5E2D9] text-xs text-[#4B5C8A]">
              <ShieldCheck
                className="w-4 h-4 shrink-0 text-[#24B5A5] mt-0.5"
                aria-hidden="true"
              />
              <p className="leading-snug">
                Your progress is saved on this device without an account.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </motion.div>
  );
};
