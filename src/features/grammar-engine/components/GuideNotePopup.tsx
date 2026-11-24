/**
 * ============================================================================
 * GRAMMAR QUEST — LEARN STEP GUIDE NOTE POPUP
 * ============================================================================
 * Centred modal displaying the guide character's Textbook note on Learn step
 * entry via the unified ModalDialog Portal, keeping the underlying page
 * visible, blurred (5px), dimmed, and non-interactive until dismissed.
 * ============================================================================
 */

import React, { useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import {
  ModalDialog,
  type CharacterExpression,
  type CharacterId,
} from '../../../components';
import { SPEAKER_THEMES, SpeakerPortrait } from '../speakerTheme';
import { playCharacterDialogue } from '../../../services/feedback/feedbackService';

export interface GuideNotePopupProps {
  isOpen: boolean;
  isAutoOpened?: boolean;
  characterId?: CharacterId;
  characterExpression?: CharacterExpression;
  dialogueEventId: string;
  badgeLabel: string;
  title: string;
  shortPrompt: string;
  explanation: string;
  dialogRef?: React.RefObject<HTMLDivElement | null>;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  onDismiss: () => void;
  onAfterClose?: () => void;
}

export const GuideNotePopup: React.FC<GuideNotePopupProps> = ({
  isOpen,
  isAutoOpened = false,
  characterId = 'shuka',
  characterExpression = 'explaining',
  dialogueEventId,
  badgeLabel,
  title,
  shortPrompt,
  explanation,
  dialogRef,
  returnFocusRef,
  onDismiss,
  onAfterClose,
}) => {
  const gotItBtnRef = useRef<HTMLButtonElement | null>(null);
  const theme = SPEAKER_THEMES[characterId];

  useEffect(() => {
    if (isOpen) playCharacterDialogue(characterId, dialogueEventId);
  }, [characterId, dialogueEventId, isOpen]);

  const showSecondParagraph =
    Boolean(explanation.trim()) && explanation.trim() !== shortPrompt.trim();

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onDismiss}
      onAfterClose={onAfterClose}
      ariaLabel={`${theme.name}'s note: ${title}`}
      immediateBackdrop={isAutoOpened}
      placement="center"
      closeOnBackdropClick={false}
      closeOnEscape={true}
      initialFocusRef={gotItBtnRef}
      returnFocusRef={returnFocusRef}
      dialogRef={dialogRef}
      dialogStyle={{
        backgroundColor: theme.tint,
        border: `2px solid ${theme.border}`,
        boxShadow: '0 18px 42px rgba(27, 37, 89, 0.24)',
      }}
      dialogClassName="w-full max-w-[400px] max-h-[82dvh] rounded-[26px] flex flex-col overflow-hidden select-text"
    >
      {/* Scrollable body ONLY when a note is unusually long */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-3 sm:px-6 sm:pt-6 space-y-3.5">
        {/* Guide Portrait + Name + Role + Stage */}
        <div className="flex items-center gap-3.5">
          <SpeakerPortrait
            characterId={characterId}
            expression={characterExpression}
            pose="explaining"
            sizePx={56}
            ringWidthPx={3}
            animatePop={false}
            floatGentle={isOpen}
          />

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-white text-xs font-bold leading-snug"
                style={{ backgroundColor: theme.solid }}
              >
                {theme.name}
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: theme.solid }}
              >
                {theme.roleLabel}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#4B5C8A] leading-snug">
              {badgeLabel}
            </p>
          </div>
        </div>

        {/* Textbook note kicker + Title + Explanation */}
        <div className="space-y-2">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-bold"
            style={{ color: theme.solid }}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Grammar note</span>
          </div>

          <h2 className="font-heading text-[20px] sm:text-[21px] font-extrabold text-[#1B2559] leading-[1.25]">
            {title}
          </h2>

          <div className="space-y-2.5 pt-0.5">
            <p className="text-[15px] sm:text-[15.5px] font-semibold text-[#1B2559] leading-[1.5]">
              {shortPrompt}
            </p>
            {showSecondParagraph ? (
              <p className="text-[15px] sm:text-[15.5px] font-normal text-[#3B446B] leading-[1.5]">
                {explanation}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Pinned Bottom Primary Button (52px, full-width, rounded-full) */}
      <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6 shrink-0">
        <button
          ref={gotItBtnRef}
          type="button"
          onClick={onDismiss}
          style={{ backgroundColor: theme.solid }}
          className="w-full h-[52px] min-h-[44px] rounded-full text-white text-[15.5px] font-bold shadow-sm hover:brightness-95 active:scale-[0.99] transition-[filter] duration-150 cursor-pointer focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
        >
          Okay, got it
        </button>
      </div>
    </ModalDialog>
  );
};
