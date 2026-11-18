/**
 * ============================================================================
 * GRAMMAR QUEST — EXPLANATION PANEL (CONVERSATIONAL TEACHING CUE)
 * ============================================================================
 * Zone B of the focused mobile lesson workspace: displays the speaking
 * character (Mira, Arjun, or ShukaJi) with their signature colour palette,
 * 44px cropped portrait, step title, short prompt, pausable typewriter
 * explanation, and an optional textbook-reference accordion collapsed by default.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type {
  KnowledgeProvenance,
  SourceReference,
} from '../../../schemas/grammarEngine.schema';
import type {
  CharacterExpression,
  CharacterId,
} from '../../../components';
import { SPEAKER_THEMES, SpeakerPortrait } from '../speakerTheme';

export interface ExplanationPanelProps {
  stepId: string;
  badgeLabel: string;
  title: string;
  shortPrompt: string;
  explanation: string;
  characterId?: CharacterId;
  characterExpression?: CharacterExpression;
  provenance?: KnowledgeProvenance;
  sourceReferences?: SourceReference[];
  isPaused?: boolean;
  animationSeed?: number;
  onTypingCompleteChange?: (isComplete: boolean) => void;
}

const PROVENANCE_LABEL: Record<KnowledgeProvenance, string> = {
  'textbook-derived': 'Based on approved textbook rules',
  'supplementary-bridge': 'Interactive teaching bridge built on cited textbook rules',
  'original-practice': 'Original practice item aligned to textbook rules',
};

const TYPEWRITER_CHAR_MS = 18;
const PORTRAIT_LEAD_MS = 260;

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  stepId,
  badgeLabel,
  title,
  shortPrompt,
  explanation,
  characterId = 'shuka',
  characterExpression = 'explaining',
  provenance = 'textbook-derived',
  sourceReferences = [],
  isPaused = false,
  animationSeed = 0,
  onTypingCompleteChange,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [typedCount, setTypedCount] = useState<number>(() =>
    prefersReducedMotion ? explanation.length : 0,
  );

  const theme = SPEAKER_THEMES[characterId];

  // Keep textbook references collapsed and reset typewriter on step change or replay
  useEffect(() => {
    setSourcesOpen(false);
    setTypedCount(prefersReducedMotion ? explanation.length : 0);
  }, [stepId, animationSeed, explanation.length, prefersReducedMotion]);

  // Pausable typewriter timer
  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedCount(explanation.length);
      return;
    }
    if (isPaused || typedCount >= explanation.length) {
      return;
    }

    const delay = typedCount === 0 ? PORTRAIT_LEAD_MS : TYPEWRITER_CHAR_MS;
    const timer = window.setTimeout(() => {
      setTypedCount((c) => Math.min(c + 1, explanation.length));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [typedCount, explanation.length, isPaused, prefersReducedMotion, stepId, animationSeed]);

  const isTypingComplete = typedCount >= explanation.length;
  const isActivelyTyping = !prefersReducedMotion && !isTypingComplete;
  const displayedExplanation = explanation.slice(0, typedCount);

  useEffect(() => {
    onTypingCompleteChange?.(isTypingComplete);
  }, [isTypingComplete, onTypingCompleteChange]);

  const handleRevealExplanation = () => {
    if (!isTypingComplete) {
      setTypedCount(explanation.length);
    }
  };

  return (
    <section
      aria-label={`${theme.name} (${theme.roleLabel}) teaching instruction`}
      role={!isTypingComplete ? 'button' : undefined}
      tabIndex={!isTypingComplete ? 0 : undefined}
      onClick={!isTypingComplete ? handleRevealExplanation : undefined}
      onKeyDown={
        !isTypingComplete
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRevealExplanation();
              }
            }
          : undefined
      }
      className={[
        'rounded-[16px] px-3.5 py-3 sm:p-4 space-y-2 select-text',
        !isTypingComplete ? 'cursor-pointer' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundColor: theme.tint,
        border: `1.5px solid ${theme.solid}`,
        transition: prefersReducedMotion
          ? 'none'
          : 'background-color 0.35s ease, border-color 0.35s ease',
      }}
    >
      {/* Speaker Identity Row (44px Portrait + Signature Name Pill + Stage Tag + Textbook Note) */}
      <div className="flex items-start gap-2.5 sm:gap-3">
        <SpeakerPortrait
          key={`learn-portrait-${stepId}-${characterId}-${animationSeed}`}
          characterId={characterId}
          expression={characterExpression}
          pose="explaining"
          animatePop={!prefersReducedMotion}
          isTalking={isActivelyTyping && !isPaused}
        />

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span
                className="px-2 py-0.5 rounded-[8px] text-white text-[11px] font-bold leading-snug"
                style={{ backgroundColor: theme.solid }}
              >
                {theme.name}
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: theme.solid }}
              >
                {theme.roleLabel}
              </span>
              <span className="text-[11px] font-semibold text-[#4B5C8A]">
                · {badgeLabel}
              </span>
            </div>

            {sourceReferences.length > 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSourcesOpen((prev) => !prev);
                }}
                aria-expanded={sourcesOpen}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#263A70] hover:underline py-0.5 cursor-pointer shrink-0"
              >
                <BookOpen className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>Textbook note</span>
                {sourcesOpen ? (
                  <ChevronUp className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                )}
              </button>
            ) : null}
          </div>

          <h2 className="font-heading text-base sm:text-lg font-semibold text-[#263A70] leading-snug">
            {title}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#263A70] leading-snug">
            {shortPrompt}
          </p>

          {/* Typewriter Conversational Explanation (fixed height clone avoids layout shift) */}
          <div className="grid pt-0.5">
            <p
              aria-hidden="true"
              className="col-start-1 row-start-1 invisible pointer-events-none select-none text-xs sm:text-sm text-[#333333] leading-snug"
            >
              {explanation}
            </p>
            <p
              aria-live="polite"
              className="col-start-1 row-start-1 text-xs sm:text-sm text-[#333333] leading-snug"
            >
              {displayedExplanation}
              {isActivelyTyping ? (
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[1em] align-middle ml-0.5 rounded-full gq-story-caret"
                  style={{ backgroundColor: theme.solid }}
                />
              ) : null}
            </p>
          </div>
        </div>
      </div>

      {sourcesOpen && sourceReferences.length > 0 ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-1.5 rounded-[12px] bg-white/95 border border-[#E5E2D9] p-2.5 space-y-1.5 text-xs text-[#333333]"
        >
          <p className="font-semibold text-[#263A70]">
            {PROVENANCE_LABEL[provenance]}
          </p>
          <ul className="space-y-1">
            {sourceReferences.map((ref) => (
              <li key={ref.id} className="leading-snug">
                <span className="font-semibold text-[#263A70]">{ref.board}</span>
                {' · '}
                <span>{ref.bookTitle}</span>
                {' · '}
                <span>{ref.chapter}</span>
                {ref.bookPages !== 'N/A' ? (
                  <span> (pp. {ref.bookPages})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
};
