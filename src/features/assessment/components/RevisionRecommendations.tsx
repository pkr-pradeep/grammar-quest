/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE REVISION RECOMMENDATIONS COMPONENT
 * ============================================================================
 * Renders targeted "Needs revision: <Objective>" guidance derived strictly
 * from missed or unanswered questions, with direct actions to revisit the
 * corresponding lesson step or practice stage.
 * ============================================================================
 */

import React from 'react';
import { BookOpenCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import type {
  RecommendedMissionStage,
  RevisionRecommendationItem,
} from '../../../schemas/assessment.schema';
import { Button } from '../../../components';

export interface RevisionRecommendationsProps {
  recommendations: RevisionRecommendationItem[];
  onRevisitStage: (stage: RecommendedMissionStage, stepNumber?: number) => void;
}

export const RevisionRecommendations: React.FC<RevisionRecommendationsProps> = ({
  recommendations,
  onRevisitStage,
}) => {
  if (recommendations.length === 0) {
    return (
      <section
        aria-label="Revision guidance"
        className="rounded-[20px] bg-[#D9FAF5] border border-[#A8E8DF] p-4 sm:p-5 flex items-start gap-3"
      >
        <CheckCircle2
          className="w-5 h-5 text-[#0E5A42] shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <h3 className="font-heading text-base font-semibold text-[#0E5A42]">
            All objectives mastered
          </h3>
          <p className="text-sm text-[#263A70] leading-snug">
            Every learning objective in this assessment was answered accurately.
            No extra revision is needed right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="revision-recommendations-heading"
      className="rounded-[20px] bg-white border border-[#E5E2D9] p-4 sm:p-6 space-y-3.5 shadow-[var(--gq-shadow-card)]"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[#263A70]">
          <BookOpenCheck className="w-4 h-4 text-[#C46B00] shrink-0" aria-hidden="true" />
          <h3
            id="revision-recommendations-heading"
            className="font-heading text-base sm:text-lg font-semibold"
          >
            Recommended Revision Focus
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#4B5C8A]">
          Based on the questions you missed or left unanswered, focus on these areas:
        </p>
      </div>

      <ul className="space-y-2.5">
        {recommendations.map((item) => (
          <li
            key={item.objectiveId}
            className="rounded-[16px] bg-[#FFFDF8] border border-[#F2DFB6] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-semibold text-[#263A70]">
                Needs revision: {item.objectiveLabel}
              </p>
              <p className="text-xs text-[#4B5C8A] tabular-nums">
                {item.missedCount} of {item.totalForObjective} question
                {item.totalForObjective === 1 ? '' : 's'} missed or unanswered
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() =>
                onRevisitStage(item.recommendedStage, item.recommendedStepNumber)
              }
              className="w-full sm:w-auto min-h-[44px] shrink-0"
            >
              {item.actionLabel}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
};
