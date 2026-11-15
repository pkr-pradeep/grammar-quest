/**
 * ============================================================================
 * GRAMMAR QUEST — EXPLANATION PANEL (COMPACT TEACHING INSTRUCTION)
 * ============================================================================
 * Zone B of the focused mobile lesson workspace: displays concise step title,
 * short prompt, focused explanation, mini character mentor cue, and an optional
 * textbook-reference accordion collapsed by default.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type {
  KnowledgeProvenance,
  SourceReference,
} from '../../../schemas/grammarEngine.schema';
import {
  Character,
  type CharacterExpression,
  type CharacterId,
} from '../../../components';

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
}

const PROVENANCE_LABEL: Record<KnowledgeProvenance, string> = {
  'textbook-derived': 'Based on approved textbook rules',
  'supplementary-bridge': 'Interactive teaching bridge built on cited textbook rules',
  'original-practice': 'Original practice item aligned to textbook rules',
};

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  stepId,
  badgeLabel,
  title,
  shortPrompt,
  explanation,
  characterId = 'gyan',
  characterExpression = 'explaining',
  provenance = 'textbook-derived',
  sourceReferences = [],
}) => {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // Keep textbook references collapsed whenever advancing to a new step
  useEffect(() => {
    setSourcesOpen(false);
  }, [stepId]);

  return (
    <section
      aria-label="Teaching instruction"
      className="rounded-[16px] bg-[#FFF1D5] border border-[#F2DFB6] px-3.5 py-2.5 sm:p-4 space-y-1.5"
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className="shrink-0 mt-0.5 hidden sm:block">
          <Character
            characterId={characterId}
            expression={characterExpression}
            pose="explaining"
            animationState="idle"
            size="xs"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-[#A15C00]">{badgeLabel}</span>
            {sourceReferences.length > 0 ? (
              <button
                type="button"
                onClick={() => setSourcesOpen((prev) => !prev)}
                aria-expanded={sourcesOpen}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#263A70] hover:underline py-0.5 cursor-pointer"
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
          <p className="text-xs sm:text-sm text-[#333333] leading-snug">
            {explanation}
          </p>
        </div>
      </div>

      {sourcesOpen && sourceReferences.length > 0 ? (
        <div className="mt-1.5 rounded-[12px] bg-white/95 border border-[#F2DFB6] p-2.5 space-y-1.5 text-xs text-[#333333]">
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
