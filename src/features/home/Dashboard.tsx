/**
 * ============================================================================
 * GRAMMAR QUEST — HOME DASHBOARD
 * ============================================================================
 * Compact, personalised mobile-first learning dashboard answering:
 * "What should I learn next?"
 *
 * Sections in exact order:
 *  1. Hero Card ("Namaste, Learner!" + preserved trio character artwork)
 *  2. My Progress Card (dynamic completion against eligible lessons)
 *  3. Up next Card (highlighted next recommended lesson or caught-up state)
 *  4. Also ready Section (up to 2 additional ready, incomplete lessons)
 * ============================================================================
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ChevronRight,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type {
  PlaceholderMissionSummary,
  StudentProgressRecord,
} from '../../schemas/lesson.schema';
import type { CatalogLessonSummary } from '../../content/curriculumCatalog';
import {
  MissionIllustration,
  WelcomeTrioIllustration,
} from '../../components';
import { buildHomeDashboardViewModel } from './homeSelectors';

export interface DashboardProps {
  progress: StudentProgressRecord;
  onStartLesson?: (missionId: string) => void;
  onPreviewMission?: (mission: PlaceholderMissionSummary) => void;
  onOpenMissions: () => void;
}

const FADE_UP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onStartLesson,
  onPreviewMission,
  onOpenMissions,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const {
    eligibleCount,
    completedCount,
    completionPercent,
    allEligibleCompleted,
    upNext,
    alsoReady,
  } = buildHomeDashboardViewModel(progress);

  const handleOpenLesson = (lesson: CatalogLessonSummary) => {
    if (onStartLesson) {
      onStartLesson(lesson.id);
      return;
    }
    if (onPreviewMission) {
      onPreviewMission({
        id: lesson.id,
        missionNumber: '',
        classLevel: 9,
        title: lesson.title,
        topicLabel: lesson.categoryTitle,
        shortDescription: lesson.conceptSummary,
        estimatedMinutes: lesson.estimatedMinutes ?? 8,
        iconKind: lesson.iconKind,
        status: lesson.status,
      });
    }
  };

  const fadeUpProps = (delaySeconds: number) =>
    prefersReducedMotion
      ? {
          initial: { opacity: 1, y: 0 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.42, delay: delaySeconds, ease: FADE_UP_EASE },
        };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-5">
      {/* 1. Hero Card */}
      <motion.section
        aria-label="Welcome to Grammar Quest"
        {...fadeUpProps(0)}
        className="relative overflow-hidden rounded-[22px] bg-[#FFFDF6] border-[1.5px] border-[#E9E1CB] px-4 py-3.5 sm:px-5 sm:py-4 min-h-[124px] sm:min-h-[154px] flex items-center"
      >
        <div className="relative z-20 max-w-[172px] min-[360px]:max-w-[196px] min-[390px]:max-w-[214px] sm:max-w-[380px] md:max-w-[460px]">
          <h1 className="text-[20px] min-[360px]:text-[22px] sm:text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#1B2559] min-[375px]:whitespace-nowrap sm:whitespace-normal">
            Namaste, Learner!
          </h1>
          <p className="text-[13px] sm:text-[14px] font-medium leading-[1.35] text-[#4A5170] mt-1">
            Explore English grammar step by step.
          </p>
        </div>

        {/* Preserved Trio Artwork */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-[-4px] bottom-0 z-10 w-[124px] h-[94px] min-[360px]:w-[152px] min-[360px]:h-[112px] min-[390px]:w-[170px] min-[390px]:h-[124px] sm:w-[228px] sm:h-[150px] md:w-[256px] md:h-[164px] flex items-end justify-end"
        >
          <span className="absolute right-2 bottom-[-14px] w-[108px] h-[108px] min-[390px]:w-[136px] min-[390px]:h-[136px] sm:w-[192px] sm:h-[192px] rounded-full bg-[#FCE9BE]" />
          <WelcomeTrioIllustration className="relative z-10 w-full h-auto max-h-full block translate-y-[2px]" />
        </div>
      </motion.section>

      {/* Main Content Grid (Mobile exact order: My Progress -> Up next -> Also ready) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-5 items-start">
        {/* 2. My Progress Card */}
        <motion.section
          aria-labelledby="learning-progress-heading"
          {...fadeUpProps(0.06)}
          className="lg:col-span-5 lg:order-2 rounded-[20px] bg-[#FFFDF6] border-[1.5px] border-[#E9E1CB] px-4 py-3.5 space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="learning-progress-heading"
              className="text-[15.5px] sm:text-[16.5px] font-extrabold leading-tight text-[#1B2559]"
            >
              My Progress
            </h2>
            <span className="text-[12.5px] font-extrabold text-[#0B5F58] tabular-nums">
              {completionPercent}%
            </span>
          </div>

          <div className="space-y-1.5">
            <div
              role="progressbar"
              aria-label="Completed lessons"
              aria-valuemin={0}
              aria-valuemax={eligibleCount}
              aria-valuenow={completedCount}
              className="w-full h-2.5 rounded-full bg-[#EFECE3] border border-[#E5E2D9] overflow-hidden"
            >
              <div
                className="h-full rounded-full bg-[#24B5A5] transition-[width] duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <p className="text-[13px] leading-snug tabular-nums text-[#4A5170]">
              <strong className="font-extrabold text-[#1B2559]">
                {completedCount} of {eligibleCount}
              </strong>{' '}
              {eligibleCount === 1 ? 'lesson' : 'lessons'} completed
            </p>
          </div>

          <p className="flex items-center gap-1.5 text-[11.5px] leading-snug text-[#0B5F58]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Your learning progress is saved on this device.</span>
          </p>
        </motion.section>

        {/* 3. Up next Card + 4. Also ready Section */}
        <div className="lg:col-span-7 lg:order-1 space-y-3 sm:space-y-4">
          {upNext ? (
            <motion.article
              aria-labelledby="up-next-heading"
              {...fadeUpProps(0.12)}
              className="rounded-[22px] bg-[#FDEBC0] border-[1.5px] border-[#F0CF86] p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span
                  id="up-next-heading"
                  className="inline-flex items-center px-2.5 py-1 rounded-[8px] bg-[#1B2559] text-white text-[10.5px] font-extrabold uppercase tracking-[0.06em] leading-none whitespace-nowrap"
                >
                  UP NEXT
                </span>

                {upNext.status === 'in-progress' && upNext.stepProgress ? (
                  <span className="text-[12px] font-extrabold text-[#8B4506] tabular-nums whitespace-nowrap">
                    In progress · Step {upNext.stepProgress.current} of {upNext.stepProgress.total}
                  </span>
                ) : (
                  <span className="text-[12px] font-bold text-[#4A5170] whitespace-nowrap">
                    Not started
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <span className="w-12 h-12 rounded-[14px] bg-white border-[1.5px] border-[#E9DFC5] flex items-center justify-center shrink-0 mt-0.5">
                  <MissionIllustration
                    kind={upNext.lesson.iconKind}
                    className="w-7 h-7"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-[0.06em] text-[#8B4506] leading-tight truncate">
                    {upNext.lesson.categoryTitle}
                  </p>
                  <h3 className="text-[17px] sm:text-[18.5px] font-extrabold text-[#1B2559] leading-snug mt-0.5 break-words">
                    {upNext.lesson.title}
                  </h3>
                  {upNext.flavourTitle ? (
                    <p className="text-[12.5px] font-semibold text-[#4A5170] leading-snug mt-0.5 truncate">
                      {upNext.flavourTitle}
                    </p>
                  ) : null}
                  {upNext.journeySummary ? (
                    <p className="text-[11.5px] font-semibold text-[#5C5446] leading-snug mt-1.5">
                      {upNext.journeySummary}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenLesson(upNext.lesson)}
                className="w-full min-h-[48px] px-4 rounded-[14px] bg-[#1B2559] hover:bg-[#141D47] text-white text-[14.5px] font-extrabold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
              >
                <Play className="w-4 h-4 fill-current shrink-0" aria-hidden="true" />
                <span>
                  {upNext.status === 'in-progress' ? 'Continue lesson' : 'Start lesson'}
                </span>
              </button>
            </motion.article>
          ) : allEligibleCompleted ? (
            <motion.article
              aria-labelledby="caught-up-heading"
              {...fadeUpProps(0.12)}
              className="rounded-[22px] bg-[#E2F5EE] border-[1.5px] border-[#9ADFD0] p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-9 h-9 rounded-[12px] bg-white border border-[#9ADFD0] flex items-center justify-center shrink-0 text-[#0B5F58]">
                  <Sparkles className="w-4.5 h-4.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 space-y-1">
                  <h2
                    id="caught-up-heading"
                    className="text-[17.5px] sm:text-[18.5px] font-extrabold text-[#1B2559] leading-snug"
                  >
                    You are all caught up!
                  </h2>
                  <p className="text-[13px] font-medium text-[#0B4A41] leading-snug">
                    Great work completing every ready lesson. Revisit any lesson whenever you want a quick refresher.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenMissions}
                className="w-full min-h-[48px] px-4 rounded-[14px] bg-[#1B2559] hover:bg-[#141D47] text-white text-[14.5px] font-extrabold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
              >
                <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Review lessons</span>
              </button>

              <p className="text-[12px] font-semibold text-[#0E5A42] leading-snug">
                More lessons are on the way.
              </p>
            </motion.article>
          ) : null}

          {/* 4. Also ready Section */}
          {alsoReady.length > 0 ? (
            <motion.section
              aria-labelledby="also-ready-heading"
              {...fadeUpProps(0.18)}
              className="space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <h2
                  id="also-ready-heading"
                  className="text-[15.5px] sm:text-[16.5px] font-extrabold leading-tight text-[#1B2559]"
                >
                  Also ready
                </h2>
                <button
                  type="button"
                  onClick={onOpenMissions}
                  className="inline-flex items-center gap-0.5 min-h-[44px] -my-2 px-1.5 -mr-1.5 rounded-[10px] text-[13px] font-extrabold text-[#1B2559] hover:underline whitespace-nowrap cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
                >
                  <span>See all {eligibleCount} lessons</span>
                  <ChevronRight className="w-4 h-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {alsoReady.map(({ lesson, flavourTitle }) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => handleOpenLesson(lesson)}
                    className="w-full min-h-[58px] rounded-[16px] bg-[#FFFDF6] hover:bg-[#FFF8E6] border-[1.5px] border-[#E9E1CB] px-3.5 py-2.5 flex items-center gap-3 text-left transition-colors cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
                  >
                    <span className="w-10 h-10 rounded-[12px] bg-[#FBF6EA] border border-[#E9E1CB] flex items-center justify-center shrink-0">
                      <MissionIllustration
                        kind={lesson.iconKind}
                        className="w-5 h-5"
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-extrabold text-[#1B2559] leading-snug truncate">
                        {lesson.title}
                      </span>
                      {flavourTitle ? (
                        <span className="block text-[12px] font-medium text-[#4A5170] leading-snug truncate">
                          {flavourTitle}
                        </span>
                      ) : null}
                    </span>

                    <ChevronRight
                      className="w-4 h-4 text-[#4A5170] shrink-0"
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </motion.section>
          ) : !allEligibleCompleted && eligibleCount > 0 ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onOpenMissions}
                className="inline-flex items-center gap-0.5 min-h-[44px] px-1.5 -mr-1.5 rounded-[10px] text-[13px] font-extrabold text-[#1B2559] hover:underline whitespace-nowrap cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
              >
                <span>See all {eligibleCount} lessons</span>
                <ChevronRight className="w-4 h-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
