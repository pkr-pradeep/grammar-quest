/**
 * ============================================================================
 * GRAMMAR QUEST — LEARN STEP GUIDE NOTE POPUP
 * ============================================================================
 * Centred modal displaying the guide character's Textbook note on Learn step
 * entry so the Starter Sentence sits immediately visible without scrolling.
 * Supports fly-to-corner dismiss, grow-from-corner reopen, strict focus
 * trapping, visibility:hidden hiding when closed, and reduced-motion fade.
 * ============================================================================
 */

import React, { useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import type { CharacterExpression, CharacterId } from '../../../components';
import { SPEAKER_THEMES, SpeakerPortrait } from '../speakerTheme';

export type GuidePopupPhase =
  | 'closed'
  | 'opening'
  | 'open'
  | 'opening-from-corner'
  | 'closing';

export interface GuideNotePopupProps {
  phase: GuidePopupPhase;
  characterId?: CharacterId;
  characterExpression?: CharacterExpression;
  badgeLabel: string;
  title: string;
  shortPrompt: string;
  explanation: string;
  flyOffset: { x: number; y: number };
  dialogRef: React.RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
}

export const GuideNotePopup: React.FC<GuideNotePopupProps> = ({
  phase,
  characterId = 'gyan',
  characterExpression = 'explaining',
  badgeLabel,
  title,
  shortPrompt,
  explanation,
  flyOffset,
  dialogRef,
  onDismiss,
}) => {
  const gotItBtnRef = useRef<HTMLButtonElement | null>(null);
  const theme = SPEAKER_THEMES[characterId];
  const isClosed = phase === 'closed';
  const isInteractive = phase !== 'closed' && phase !== 'closing';

  // Move keyboard focus into the popup when opened
  useEffect(() => {
    if (!isInteractive) return;
    const raf = window.requestAnimationFrame(() => {
      gotItBtnRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [isInteractive]);

  // Escape to close + strict Tab focus trap while open
  useEffect(() => {
    if (!isInteractive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onDismiss();
        return;
      }

      if (event.key === 'Tab') {
        const container = dialogRef.current;
        if (!container) return;
        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (!container.contains(active)) {
          event.preventDefault();
          first.focus();
          return;
        }

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInteractive, onDismiss, dialogRef]);

  const backdropAnimClass =
    phase === 'closing'
      ? 'gq-guide-backdrop-out'
      : phase === 'opening-from-corner' || phase === 'opening' || phase === 'open'
        ? 'gq-guide-backdrop-in'
        : '';

  const cardAnimClass =
    phase === 'closing'
      ? 'gq-guide-popup-close'
      : phase === 'opening-from-corner'
        ? 'gq-guide-popup-open'
        : phase === 'opening'
          ? 'gq-guide-backdrop-in'
          : '';

  const showSecondParagraph =
    Boolean(explanation.trim()) && explanation.trim() !== shortPrompt.trim();

  return (
    <div
      aria-hidden={isClosed}
      style={{
        visibility: isClosed ? 'hidden' : 'visible',
        backgroundColor: 'rgba(27, 37, 89, 0.55)',
      }}
      className={[
        'fixed inset-0 z-50 flex items-center justify-center p-5',
        isInteractive ? 'pointer-events-auto' : 'pointer-events-none',
        backdropAnimClass,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${theme.name}'s note: ${title}`}
        style={
          {
            backgroundColor: theme.tint,
            border: `2px solid ${theme.border}`,
            boxShadow: '0 18px 42px rgba(27, 37, 89, 0.24)',
            '--gq-fly-x': `${flyOffset.x}px`,
            '--gq-fly-y': `${flyOffset.y}px`,
          } as React.CSSProperties
        }
        className={[
          'w-full max-w-[400px] max-h-[80dvh] rounded-[26px] flex flex-col overflow-hidden select-text',
          cardAnimClass,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Scrollable body ONLY when a note is unusually long */}
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3 sm:px-6 sm:pt-6 space-y-3.5">
          {/* Guide Portrait + Name + Role + Stage */}
          <div className="flex items-center gap-3.5">
            <SpeakerPortrait
              characterId={characterId}
              expression={characterExpression}
              pose="explaining"
              sizePx={56}
              ringWidthPx={3}
              animatePop={false}
              floatGentle={!isClosed}
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
              <span>Textbook note</span>
            </div>

            <h2 className="font-heading text-[21px] font-extrabold text-[#1B2559] leading-[1.25]">
              {title}
            </h2>

            <div className="space-y-2.5 pt-0.5">
              <p className="text-[15.5px] font-semibold text-[#1B2559] leading-[1.5]">
                {shortPrompt}
              </p>
              {showSecondParagraph ? (
                <p className="text-[15.5px] font-normal text-[#3B446B] leading-[1.5]">
                  {explanation}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Pinned Bottom Primary Button (52px, full-width, rounded-full) */}
        <div className="px-5 pb-5 pt-2 sm:px-6 sm:pb-6 shrink-0">
          <button
            ref={gotItBtnRef}
            type="button"
            tabIndex={isClosed ? -1 : 0}
            onClick={onDismiss}
            style={{ backgroundColor: theme.solid }}
            className="w-full h-[52px] min-h-[44px] rounded-full text-white text-[15.5px] font-bold shadow-sm hover:brightness-95 active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
          >
            Okay, got it
          </button>
        </div>
      </div>
    </div>
  );
};
