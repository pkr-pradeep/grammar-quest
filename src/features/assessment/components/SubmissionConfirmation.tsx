/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE SUBMISSION CONFIRMATION MODAL
 * ============================================================================
 * Prompts the student to confirm final submission before scoring and locking
 * the attempt as read-only via the unified ModalDialog Portal system.
 * ============================================================================
 */

import React from 'react';
import { AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { Button, ModalDialog } from '../../../components';

export interface SubmissionConfirmationProps {
  isOpen: boolean;
  totalQuestions: number;
  answeredCount: number;
  onCancel: () => void;
  onConfirmSubmit: () => void;
}

export const SubmissionConfirmation: React.FC<SubmissionConfirmationProps> = ({
  isOpen,
  totalQuestions,
  answeredCount,
  onCancel,
  onConfirmSubmit,
}) => {
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onCancel}
      ariaLabelledBy="submit-confirm-title"
      ariaDescribedBy="submit-confirm-desc"
      placement="bottom-sheet"
      closeOnBackdropClick={true}
      closeOnEscape={true}
      dialogClassName="w-full max-w-[440px] max-h-[85dvh] overflow-y-auto rounded-t-[24px] sm:rounded-[22px] bg-white border border-[#E5E2D9] p-4 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl space-y-4"
    >
      <div className="space-y-1.5">
        <h3
          id="submit-confirm-title"
          className="font-heading text-lg sm:text-xl font-semibold text-[#263A70]"
        >
          Submit your test?
        </h3>
        <p id="submit-confirm-desc" className="text-sm text-[#4B5C8A] leading-snug">
          Please review your completion count before submitting.
        </p>
      </div>

      {/* Completion Status Summary */}
      {unansweredCount > 0 ? (
        <div className="rounded-[14px] bg-[#FFF1D5] border border-[#F2DFB6] p-3.5 flex items-start gap-2.5 text-sm text-[#263A70]">
          <AlertTriangle
            className="w-5 h-5 text-[#C46B00] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-0.5 tabular-nums min-w-0">
            <p className="font-semibold">
              {answeredCount} of {totalQuestions} answered · {unansweredCount} unanswered
            </p>
            <p className="text-xs text-[#4B5C8A]">
              Unanswered questions count as 0 marks. You can go back to answer them now.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-[14px] bg-[#D9FAF5] border border-[#A8E8DF] p-3.5 flex items-start gap-2.5 text-sm text-[#0E5A42]">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-semibold tabular-nums">
            All {totalQuestions} questions are answered and ready to submit.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 text-xs text-[#4B5C8A]">
        <Lock className="w-4 h-4 shrink-0 text-[#263A70] mt-0.5" aria-hidden="true" />
        <p className="leading-snug">
          Once submitted, your answers are locked as read-only and your score,
          explanations, and revision plan will appear immediately.
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-1">
        <Button
          variant="secondary"
          size="md"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Go Back &amp; Review
        </Button>
        <Button
          variant="navy"
          size="md"
          onClick={onConfirmSubmit}
          className="w-full sm:w-auto"
        >
          Submit Final Test
        </Button>
      </div>
    </ModalDialog>
  );
};
