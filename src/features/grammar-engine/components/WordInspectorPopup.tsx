/**
 * ============================================================================
 * GRAMMAR QUEST — WORD INSPECTOR POPUP
 * ============================================================================
 * Accessible modal popup displaying the exact role, grammatical category,
 * group belonging, and meaning explanation when a student taps any word in
 * either the primary sentence or the comparison sentence — rendered via the
 * unified ModalDialog portal system.
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { Layers, MessageSquare, X } from 'lucide-react';
import type { SentenceToken } from '../../../schemas/grammarEngine.schema';
import { ModalDialog } from '../../../components';
import { GRAMMATICAL_CATEGORY_META, GROUP_ROLE_META } from '../categoryMeta';

export interface WordInspectorPopupProps {
  token: SentenceToken | null;
  sentenceLabel?: string;
  onClose: () => void;
}

export const WordInspectorPopup: React.FC<WordInspectorPopupProps> = ({
  token,
  sentenceLabel,
  onClose,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  // Preserve last viewed token during the 200ms exit fade so content stays intact
  const [renderedToken, setRenderedToken] = useState<SentenceToken | null>(token);

  useEffect(() => {
    if (token) {
      setRenderedToken(token);
    }
  }, [token]);

  const activeToken = token ?? renderedToken;
  const catMeta = activeToken ? GRAMMATICAL_CATEGORY_META[activeToken.category] : null;
  const groupMeta = activeToken ? GROUP_ROLE_META[activeToken.groupRole] : null;
  const GroupIcon = activeToken?.groupRole === 'subject' ? Layers : MessageSquare;

  return (
    <ModalDialog
      isOpen={Boolean(token)}
      onClose={onClose}
      onAfterClose={() => setRenderedToken(null)}
      ariaLabelledBy="word-inspector-title"
      placement="center"
      closeOnBackdropClick={true}
      closeOnEscape={true}
      initialFocusRef={closeBtnRef}
      dialogClassName="w-full max-w-md max-h-[85dvh] overflow-y-auto rounded-[20px] bg-white border-2 border-[#263A70] shadow-xl p-4 sm:p-5 space-y-3.5"
    >
      {activeToken && catMeta && groupMeta ? (
        <>
          {/* Top Header + Close Icon Button */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              {sentenceLabel ? (
                <p className="text-[11px] font-semibold text-[#4B5C8A]">
                  {sentenceLabel}
                </p>
              ) : null}
              <h3
                id="word-inspector-title"
                className="font-heading text-base sm:text-lg font-semibold text-[#263A70] leading-snug break-words"
              >
                “{activeToken.text}” — {activeToken.roleLabel}
              </h3>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close word details"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-[10px] border border-[#E5E2D9] bg-[#FDFCF9] text-[#263A70] hover:bg-[#F5F2EA] inline-flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Category & Group Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              style={{ backgroundColor: catMeta.bgVar, color: catMeta.fgVar }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-semibold"
            >
              <span aria-hidden="true">{catMeta.symbol}</span>
              <span>{catMeta.label}</span>
            </span>

            <span
              className={[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-semibold',
                groupMeta.badgeBgClass,
              ].join(' ')}
            >
              <GroupIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Part of {groupMeta.label}</span>
            </span>
          </div>

          {/* Meaning & Grammatical Role Explanation */}
          <div
            className={[
              'rounded-[14px] border p-3.5 text-sm text-[#333333] leading-relaxed',
              groupMeta.bgClass,
              groupMeta.borderClass,
            ].join(' ')}
          >
            {activeToken.meaningInSentence} {activeToken.grammaticalRoleExplanation}
          </div>

          {/* Optional Tense / Agreement Breakdown (Missions 2 & 3) */}
          {activeToken.verbMeta ? (
            <div className="rounded-[14px] bg-[#FDFCF9] border border-[#E5E2D9] p-3 space-y-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-[#4B5C8A]">Time communicated:</span>
                <span className="font-bold text-[#263A70]">
                  {activeToken.verbMeta.timeCommunicated}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-[#4B5C8A]">Verb form:</span>
                <span className="font-bold text-[#0F7F76]">
                  {activeToken.verbMeta.verbForm}
                </span>
              </div>
              <p className="text-[#333333] pt-1 border-t border-[#E5E2D9] leading-snug">
                <strong className="text-[#263A70]">Why this fits: </strong>
                {activeToken.verbMeta.whyAppropriate}
              </p>
              {activeToken.verbMeta.subjectLinkNote ? (
                <p className="text-[#4B5C8A] leading-snug">
                  <strong className="text-[#263A70]">Subject link: </strong>
                  {activeToken.verbMeta.subjectLinkNote}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Explicit Close Footer Button */}
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 rounded-[12px] bg-[#263A70] hover:bg-[#1E2F5C] text-white text-sm font-medium cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </>
      ) : null}
    </ModalDialog>
  );
};
