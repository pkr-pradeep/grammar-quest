/**
 * ============================================================================
 * GRAMMAR QUEST — STAGE 10: MISSION COMPLETION CELEBRATION
 * ============================================================================
 * Displays Mira, Arjun, and Gyan celebrating beside the repaired noticeboard,
 * summarises what the learner mastered, shows the healthy reward milestone,
 * and confirms local IndexedDB progress persistence.
 * ============================================================================
 */

import React from 'react';
import { Award, CheckCircle2, Home, ShieldCheck, Sparkles } from 'lucide-react';
import type { MissionCompletionSummary } from '../../../schemas/grammarEngine.schema';
import { Button, CourtyardNoticeboardScene } from '../../../components';

export interface MissionCompletionStageProps {
  missionTitle: string;
  classLevel: 9 | 10;
  summary: MissionCompletionSummary;
  onReturnHome: () => void;
  onReviewLesson: () => void;
}

export const MissionCompletionStage: React.FC<MissionCompletionStageProps> = ({
  missionTitle,
  classLevel,
  summary,
  onReturnHome,
  onReviewLesson,
}) => {
  return (
    <div className="space-y-4">
      {/* Repaired Courtyard Noticeboard Celebration Scene */}
      <CourtyardNoticeboardScene mode="repaired" />

      {/* Completion Summary Card */}
      <section
        aria-label="Mission completed"
        className="rounded-[20px] bg-white border border-[#E5E2D9] p-4 sm:p-6 space-y-4"
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9FAF5] border border-[#65D8CA] text-xs font-semibold text-[#0E5A42]">
            <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Mission Complete · Class {classLevel}</span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-semibold text-[#263A70]">
            {summary.headline}
          </h2>
          <p className="text-sm sm:text-base text-[#333333] leading-snug">
            {summary.celebrationMessage}
          </p>
        </div>

        {/* What You Learned */}
        <div className="rounded-[16px] bg-[#FFF1D5] border border-[#F2DFB6] p-3.5 sm:p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A15C00]">
            What you learned in {missionTitle}
          </p>
          <ul className="space-y-1.5">
            {summary.learnedPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-xs sm:text-sm font-medium text-[#263A70]"
              >
                <CheckCircle2
                  className="w-4 h-4 text-[#1FA89A] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Repaired Noticeboard Messages */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#4B5C8A]">
            Messages restored on the school noticeboard:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {summary.repairedMessages.map((msg) => (
              <div
                key={msg}
                className="rounded-[12px] bg-[#FDFCF9] border border-[#E5E2D9] px-3 py-2 text-xs sm:text-sm font-medium text-[#263A70]"
              >
                “{msg}”
              </div>
            ))}
          </div>
        </div>

        {/* Healthy Learning Milestone */}
        <div className="rounded-[14px] bg-[#D9FAF5] border border-[#A8E8DF] px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#263A70]">
          <Sparkles className="w-4 h-4 text-[#0F766E] shrink-0" aria-hidden="true" />
          <span>Milestone earned: {summary.rewardLabel}</span>
        </div>

        {/* Local Save Confirmation */}
        <div className="flex items-center gap-2 text-xs text-[#4B5C8A] pt-1 border-t border-[#E5E2D9]">
          <ShieldCheck className="w-4 h-4 text-[#1FA89A] shrink-0" aria-hidden="true" />
          <span>Your mission completion is saved locally on this device.</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <Button
            variant="primary"
            size="md"
            onClick={onReturnHome}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Back to Home
          </Button>
          <Button variant="secondary" size="md" onClick={onReviewLesson}>
            Review Lesson
          </Button>
        </div>
      </section>
    </div>
  );
};
