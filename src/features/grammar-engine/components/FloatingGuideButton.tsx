/**
 * ============================================================================
 * GRAMMAR QUEST — FLOATING CORNER GUIDE BUTTON (LEARN STEP)
 * ============================================================================
 * 56px round bottom-right guide button displaying the active character with
 * an amber "i" badge, landing pop, and a post-dismiss pulsing hint.
 * ============================================================================
 */

import React from 'react';
import { Character } from '../../../components';
import type { CharacterExpression, CharacterId } from '../../../components';
import { SPEAKER_THEMES } from '../speakerTheme';
import shukaNotificationArtwork from '../../../assets/shukaji/notification.png';

export interface FloatingGuideButtonProps {
  characterId?: CharacterId;
  characterExpression?: CharacterExpression;
  noteTitle: string;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  isPopupOpen: boolean;
  isPopping: boolean;
  showHint: boolean;
  hintFadingOut: boolean;
  onOpenPopup: () => void;
}

export const FloatingGuideButton: React.FC<FloatingGuideButtonProps> = ({
  characterId = 'shuka',
  characterExpression = 'explaining',
  noteTitle,
  buttonRef,
  isPopupOpen,
  isPopping,
  showHint,
  hintFadingOut,
  onOpenPopup,
}) => {
  const theme = SPEAKER_THEMES[characterId];
  const resolvedPose =
    characterId === 'mira'
      ? 'pointing'
      : characterId === 'arjun'
        ? 'reading'
        : 'explaining';

  // Proportional crop framing inside the 50px inner circle (56px outer with 3px ring)
  const charSizePx = 112;
  const topOffsetPx = characterId === 'mira' ? -22 : -18;

  return (
    <div
      aria-hidden={isPopupOpen || undefined}
      className={[
        'fixed right-4 z-30 pointer-events-none flex flex-col items-end gap-2 transition-opacity duration-150',
        isPopupOpen ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
      style={{
        bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* 4.5s Post-Dismiss Label Hint (renders above the button, clear of bottom-center scroll cue) */}
      {showHint && !isPopupOpen ? (
        <div
          role="status"
          aria-live="polite"
          className={[
            'px-3 py-1.5 rounded-full bg-[#1B2559] text-white text-xs font-semibold shadow-md whitespace-nowrap transition-opacity duration-300',
            hintFadingOut ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        >
          Tap to hear {theme.name} again
        </div>
      ) : null}

      <div className="relative pointer-events-auto">
        {/* Expanding Guide-Coloured Pulsing Ring (disabled under reduced-motion via CSS) */}
        {showHint && !isPopupOpen ? (
          <span
            aria-hidden="true"
            style={
              {
                '--gq-guide-ring-color': theme.ringRgba,
              } as React.CSSProperties
            }
            className={[
              'pointer-events-none absolute inset-0 rounded-full gq-guide-ring-pulse transition-opacity duration-300',
              hintFadingOut ? 'opacity-0' : 'opacity-100',
            ].join(' ')}
          />
        ) : null}

        <button
          ref={buttonRef}
          type="button"
          tabIndex={isPopupOpen ? -1 : 0}
          onClick={onOpenPopup}
          aria-label={`Open ${theme.name}'s note: ${noteTitle}`}
          aria-haspopup="dialog"
          aria-expanded={isPopupOpen}
          style={{
            border: `3px solid ${theme.solid}`,
            boxShadow: '0 8px 20px rgba(27, 37, 89, 0.2)',
          }}
          className={[
            'relative w-[56px] h-[56px] min-h-[44px] min-w-[44px] rounded-full bg-white flex items-center justify-center cursor-pointer transition-transform active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#1B2559]',
            isPopping ? 'gq-guide-btn-pop' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* Inner character artwork */}
          <span
            aria-hidden="true"
            className="relative w-full h-full rounded-full overflow-hidden block"
          >
            {characterId === 'shuka' ? (
              <img
                src={shukaNotificationArtwork}
                alt=""
                draggable={false}
                className="h-full w-full object-contain"
              />
            ) : (
              <span
                className="absolute left-1/2 -translate-x-1/2 block"
                style={{ top: `${topOffsetPx}px` }}
              >
                <Character
                  characterId={characterId}
                  pose={resolvedPose}
                  expression={characterExpression}
                  animationState="none"
                  size={charSizePx}
                />
              </span>
            )}
          </span>

          {/* Top-right Amber "i" Badge (22px) */}
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 w-[22px] h-[22px] rounded-full bg-[#FFC64B] text-[#1B2559] text-[12px] font-extrabold border-2 border-white flex items-center justify-center shadow-xs pointer-events-none"
          >
            i
          </span>
        </button>
      </div>
    </div>
  );
};
