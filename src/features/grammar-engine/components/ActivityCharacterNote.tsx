/**
 * ============================================================================
 * GRAMMAR QUEST — ACTIVITY CHARACTER NOTE & HINT CONTROLS
 * ============================================================================
 * Compact, accessible helper strips used inside interactive Guided & Practice
 * activities so Mira, Arjun, and ShukaJi provide natural encouragement and hints.
 * ============================================================================
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { ActivityCharacterTip } from '../../../schemas/grammarEngine.schema';
import { SPEAKER_THEMES, SpeakerPortrait } from '../speakerTheme';

export const ActivityCharacterNote: React.FC<{
  tip: ActivityCharacterTip;
}> = ({ tip }) => {
  const theme = SPEAKER_THEMES[tip.characterId];
  return (
    <div
      className="rounded-[14px] px-3 py-2.5 flex items-center gap-2.5"
      style={{
        backgroundColor: theme.tint,
        border: `1.5px solid ${theme.border}`,
      }}
    >
      <SpeakerPortrait
        characterId={tip.characterId}
        expression={tip.expression ?? 'explaining'}
        pose="explaining"
        sizePx={40}
        ringWidthPx={2}
      />
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="px-1.5 py-0.5 rounded-[6px] text-white text-[10px] font-bold leading-none"
            style={{ backgroundColor: theme.solid }}
          >
            {theme.name}
          </span>
          <span
            className="text-[10.5px] font-semibold leading-none"
            style={{ color: theme.solid }}
          >
            {theme.roleLabel}
          </span>
        </div>
        <p className="text-xs sm:text-[13px] text-[#263A70] leading-snug font-medium">
          {tip.quote}
        </p>
      </div>
    </div>
  );
};

export const ActivityHintBox: React.FC<{
  hint: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ hint, isOpen, onToggle }) => (
  <div className="space-y-2">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="inline-flex items-center gap-1.5 min-h-[44px] px-2 rounded-[10px] text-xs font-semibold text-[#263A70] hover:bg-[#FFF1D5]/70 hover:underline cursor-pointer transition-colors"
    >
      <HelpCircle className="w-4 h-4 shrink-0 text-[#A15C00]" aria-hidden="true" />
      <span>{isOpen ? 'Hide hint' : 'Need a hint?'}</span>
    </button>

    {isOpen ? (
      <p className="text-xs sm:text-sm rounded-[10px] bg-[#FFF1D5] border border-[#F2DFB6] px-3 py-2 text-[#333333] leading-snug">
        {hint}
      </p>
    ) : null}
  </div>
);
