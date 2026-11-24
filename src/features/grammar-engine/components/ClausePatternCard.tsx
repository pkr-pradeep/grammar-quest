/**
 * ============================================================================
 * GRAMMAR QUEST — CLAUSE PATTERN & SENTENCE TYPES VISUAL CARD
 * ============================================================================
 * Reusable visual teaching block rendered inside SentenceVisualizer for
 * Sentence Types & Clause Patterns:
 *  - Colour-coded sentence components (S, V, IO, DO, C, A)
 *  - Visual separation of Phrases vs Clauses and Independent vs Dependent clauses
 *  - Clause relationship diagrams (equal Coordination vs Subordination)
 *  - Graduated Easy -> Medium -> Challenging example explorer
 *  - Explicit "Why it works", Common Mistake contrast, & Textbook note toggles
 *  - Interactive in-lesson Knowledge Checkpoint with PracticeFeedback
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import type {
  ClausePatternVisualData,
  ClauseSegmentTone,
  TeachingCheckpointData,
} from '../../../schemas/grammarEngine.schema';
import { PracticeFeedback } from './PracticeFeedback';
import { playLearningFeedback } from '../../../services/feedback/feedbackService';

export interface ClausePatternCardProps {
  stepId: string;
  animationSeed?: number;
  clausePatternData?: ClausePatternVisualData;
  checkpointData?: TeachingCheckpointData;
}

const SEGMENT_TONE_STYLES: Record<
  ClauseSegmentTone,
  { bg: string; border: string; badgeBg: string; badgeText: string }
> = {
  subject: {
    bg: 'bg-[#FFF4D6]',
    border: 'border-[#F59B19]',
    badgeBg: 'bg-[#FFC64B]',
    badgeText: 'text-[#1B2559]',
  },
  verb: {
    bg: 'bg-[#D9FAF5]',
    border: 'border-[#1FA89A]',
    badgeBg: 'bg-[#8DECE0]',
    badgeText: 'text-[#0E5A42]',
  },
  object: {
    bg: 'bg-[#E6F2FF]',
    border: 'border-[#3B82F6]',
    badgeBg: 'bg-[#BFDBFE]',
    badgeText: 'text-[#1E3A8A]',
  },
  complement: {
    bg: 'bg-[#ECE6FB]',
    border: 'border-[#5B43C2]',
    badgeBg: 'bg-[#DDD6FE]',
    badgeText: 'text-[#4C1D95]',
  },
  adverbial: {
    bg: 'bg-[#FDE6E1]',
    border: 'border-[#C94A3A]',
    badgeBg: 'bg-[#FECACA]',
    badgeText: 'text-[#7F1D1D]',
  },
  phrase: {
    bg: 'bg-[#F5F2EA]',
    border: 'border-dashed border-[#A69C85]',
    badgeBg: 'bg-[#E9E1CB]',
    badgeText: 'text-[#4A5170]',
  },
  independent: {
    bg: 'bg-[#D9FAF5]',
    border: 'border-[#1FA89A]',
    badgeBg: 'bg-[#0F7F76]',
    badgeText: 'text-white',
  },
  dependent: {
    bg: 'bg-[#FFF4D6]',
    border: 'border-dashed border-[#E07F07]',
    badgeBg: 'bg-[#B4600F]',
    badgeText: 'text-white',
  },
  linker: {
    bg: 'bg-[#ECE6FB]',
    border: 'border-[#5B43C2]',
    badgeBg: 'bg-[#5B43C2]',
    badgeText: 'text-white',
  },
};

export const ClausePatternCard: React.FC<ClausePatternCardProps> = ({
  stepId,
  animationSeed = 0,
  clausePatternData,
  checkpointData,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [activeExampleIdx, setActiveExampleIdx] = useState(0);
  const [showWhyWorks, setShowWhyWorks] = useState(true);
  const [showCommonMistake, setShowCommonMistake] = useState(true);
  const [showBoardNote, setShowBoardNote] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    setActiveExampleIdx(0);
    setShowWhyWorks(true);
    setShowCommonMistake(true);
    setShowBoardNote(false);
    setSelectedOptionId(null);
  }, [stepId]);

  if (!clausePatternData && !checkpointData) return null;

  const progressiveExamples = clausePatternData?.progressiveExamples ?? [];
  const activeExample = progressiveExamples[activeExampleIdx] ?? progressiveExamples[0];

  const selectedOption =
    checkpointData && selectedOptionId
      ? checkpointData.options.find((o) => o.id === selectedOptionId) ?? null
      : null;

  return (
    <div className="space-y-2.5">
      {clausePatternData ? (
        <motion.div
          key={`${stepId}-clause-visual-${animationSeed}`}
          data-testid="step-clause-pattern-card"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="rounded-[14px] border border-[#E5E2D9] bg-[#FDFCF9] p-3 space-y-3"
        >
          {/* Top Badge & Category */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[8px] bg-[#ECE6FB] text-[#5B43C2] text-[11px] font-bold uppercase tracking-wide">
              {clausePatternData.categoryBadge}
            </span>
          </div>

          {/* Colour-Coded Structural Segments */}
          {clausePatternData.segments.length > 0 ? (
            <div
              className="flex flex-wrap items-stretch gap-2"
              role="group"
              aria-label="Colour-coded sentence parts"
            >
              {clausePatternData.segments.map((seg, idx) => {
                const style = SEGMENT_TONE_STYLES[seg.tone];
                return (
                  <div
                    key={`${seg.label}-${idx}`}
                    className={[
                      'rounded-[12px] border-2 px-2.5 py-2 flex flex-col justify-between gap-1 min-w-0',
                      style.bg,
                      style.border,
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'self-start px-2 py-0.5 rounded-[6px] text-[10px] font-extrabold uppercase tracking-wide whitespace-nowrap',
                        style.badgeBg,
                        style.badgeText,
                      ].join(' ')}
                    >
                      {seg.label}
                    </span>
                    <span className="text-[13.5px] sm:text-sm font-bold text-[#1B2559] leading-snug break-words">
                      {seg.text}
                    </span>
                    {seg.subLabel ? (
                      <span className="text-[11px] font-medium text-[#4B5C8A] leading-tight">
                        {seg.subLabel}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Visual Clause Relationship Diagram (Topic 5 & 6) */}
          {clausePatternData.relationDiagram ? (
            <div
              className="rounded-[12px] bg-white border border-[#E5E2D9] p-2.5 sm:p-3 space-y-2"
              aria-label="Clause relationship diagram"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 rounded-[10px] bg-[#D9FAF5] border-2 border-[#1FA89A] px-2.5 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#0E5A42]">
                    {clausePatternData.relationDiagram.leftLabel}
                  </p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#1B2559] leading-snug">
                    {clausePatternData.relationDiagram.leftText}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center justify-center gap-1 px-1.5 py-1 shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-[#ECE6FB] border border-[#5B43C2]/40 text-[#5B43C2] text-[11px] font-extrabold whitespace-nowrap">
                    {clausePatternData.relationDiagram.connectorLabel}
                  </span>
                  {clausePatternData.relationDiagram.relationType === 'equal' ? (
                    <ArrowLeftRight
                      className="w-4 h-4 text-[#5B43C2]"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowRight
                      className="w-4 h-4 text-[#B4600F] sm:rotate-180"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div
                  className={[
                    'flex-1 rounded-[10px] border-2 px-2.5 py-2',
                    clausePatternData.relationDiagram.relationType === 'equal'
                      ? 'bg-[#D9FAF5] border-[#1FA89A]'
                      : clausePatternData.relationDiagram.relationType === 'dependent'
                        ? 'bg-[#FFF4D6] border-dashed border-[#E07F07]'
                        : 'bg-[#F5F2EA] border-[#CFC9BA]',
                  ].join(' ')}
                >
                  <p
                    className={[
                      'text-[10px] font-extrabold uppercase tracking-wide',
                      clausePatternData.relationDiagram.relationType === 'equal'
                        ? 'text-[#0E5A42]'
                        : clausePatternData.relationDiagram.relationType === 'dependent'
                          ? 'text-[#9C4F08]'
                          : 'text-[#4B5C8A]',
                    ].join(' ')}
                  >
                    {clausePatternData.relationDiagram.rightLabel}
                  </p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#1B2559] leading-snug">
                    {clausePatternData.relationDiagram.rightText}
                  </p>
                </div>
              </div>

              <p className="text-[11.5px] text-[#4B5C8A] leading-snug">
                {clausePatternData.relationDiagram.caption}
              </p>
            </div>
          ) : null}

          {/* Unfamiliar Grammar Terms Explained Simply */}
          {clausePatternData.keyTerms && clausePatternData.keyTerms.length > 0 ? (
            <div
              className="rounded-[10px] bg-[#FFF9EC] border border-[#F2DFB6] px-3 py-2 space-y-1.5"
              aria-label="Key grammar terms"
            >
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#9C4F08]">
                Key words explained
              </p>
              <dl className="space-y-1">
                {clausePatternData.keyTerms.map((item) => (
                  <div key={item.term} className="text-xs leading-snug text-[#263A70]">
                    <dt className="inline font-bold text-[#1B2559]">{item.term}: </dt>
                    <dd className="inline text-[#3B446B]">{item.meaning}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {/* Why It Works Explanation */}
          <div className="rounded-[10px] bg-white border border-[#E5E2D9] px-3 py-2 space-y-1">
            <button
              type="button"
              onClick={() => setShowWhyWorks((v) => !v)}
              aria-expanded={showWhyWorks}
              className="w-full min-h-[36px] flex items-center justify-between gap-2 text-left text-xs font-bold text-[#1B2559] cursor-pointer py-0.5"
            >
              <span className="inline-flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#E07F07] shrink-0" aria-hidden="true" />
                <span>Why does this work?</span>
              </span>
              <span className="text-[11px] font-semibold text-[#4B5C8A]">
                {showWhyWorks ? 'Hide' : 'Show'}
              </span>
            </button>
            {showWhyWorks ? (
              <p className="text-xs sm:text-[13px] text-[#333333] leading-snug">
                {clausePatternData.whyItWorks}
              </p>
            ) : null}
          </div>

          {/* Progressive Examples: Easy -> Medium -> Challenging */}
          {progressiveExamples.length > 0 && activeExample ? (
            <div className="rounded-[12px] bg-white border border-[#E5E2D9] p-2.5 sm:p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#4B5C8A]">
                  Examples · Easy to Challenging
                </span>
                <div className="flex items-center gap-1" role="tablist" aria-label="Example difficulty">
                  {progressiveExamples.map((ex, idx) => {
                    const isActive = idx === activeExampleIdx;
                    return (
                      <button
                        key={ex.level}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveExampleIdx(idx)}
                        className={[
                          'min-h-[40px] px-2.5 py-1 rounded-[8px] text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap',
                          isActive
                            ? 'bg-[#1B2559] text-white'
                            : 'bg-[#F5F2EA] text-[#4B5C8A] hover:text-[#1B2559]',
                        ].join(' ')}
                      >
                        {ex.level}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[10px] bg-[#FDFCF9] border border-[#E5E2D9] p-2.5 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[6px] bg-[#FFF4D6] border border-[#F2DFB6] text-[#9C4F08] text-[10.5px] font-extrabold">
                    {activeExample.highlightBadge}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#1B2559] leading-snug break-words">
                  “{activeExample.sentence}”
                </p>
                <p className="text-xs text-[#4B5C8A] leading-snug">
                  <strong className="text-[#263A70]">Step-by-step: </strong>
                  {activeExample.stepByStep}
                </p>
                {activeExample.whyCorrect ? (
                  <p className="text-xs text-[#0E5A42] leading-snug">
                    <strong className="font-bold">Why it is right: </strong>
                    {activeExample.whyCorrect}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Common Mistake & Grammar Note Controls */}
          {clausePatternData.commonMistake || clausePatternData.boardNote ? (
            <div className="flex flex-wrap items-center gap-3">
              {clausePatternData.commonMistake ? (
                <button
                  type="button"
                  onClick={() => setShowCommonMistake((v) => !v)}
                  aria-expanded={showCommonMistake}
                  className="inline-flex items-center gap-1 min-h-[44px] text-xs font-semibold text-[#9E2A25] hover:underline py-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {showCommonMistake ? 'Hide common mistake' : 'See common mistake'}
                  </span>
                </button>
              ) : null}

              {clausePatternData.boardNote ? (
                <button
                  type="button"
                  onClick={() => setShowBoardNote((v) => !v)}
                  aria-expanded={showBoardNote}
                  className="inline-flex items-center gap-1 min-h-[44px] text-xs font-semibold text-[#5B43C2] hover:underline py-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {showBoardNote ? 'Hide grammar note' : clausePatternData.boardNote.label}
                  </span>
                </button>
              ) : null}
            </div>
          ) : null}

          {showCommonMistake && clausePatternData.commonMistake ? (
            <div className="rounded-[10px] bg-white border border-[#E5E2D9] p-2.5 space-y-1.5 text-xs">
              <p className="text-[#9E2A25] font-semibold">
                Watch out: <span className="line-through">{clausePatternData.commonMistake.incorrectText}</span>
              </p>
              <p className="text-[#0E5A42] font-semibold flex items-start gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Better: {clausePatternData.commonMistake.correctText}</span>
              </p>
              <p className="text-[#4B5C8A] leading-snug">
                {clausePatternData.commonMistake.whyWrong}
              </p>
            </div>
          ) : null}

          {showBoardNote && clausePatternData.boardNote ? (
            <div className="rounded-[10px] bg-[#ECE6FB]/60 border border-[#5B43C2]/30 p-2.5 text-xs text-[#263A70] leading-snug">
              <strong className="font-bold text-[#5B43C2]">
                {clausePatternData.boardNote.label}:{' '}
              </strong>
              {clausePatternData.boardNote.text}
            </div>
          ) : null}
        </motion.div>
      ) : null}

      {/* Short Knowledge Checkpoint inside Topic Teaching Step */}
      {checkpointData ? (
        <section
          aria-label={checkpointData.topicLabel}
          className="rounded-[14px] border-2 border-[#CBBDF3] bg-[#F7F4FD] p-3 sm:p-3.5 space-y-2.5"
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#5B43C2]">
            <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{checkpointData.topicLabel}</span>
          </div>

          <p className="text-[13.5px] sm:text-sm font-bold text-[#1B2559] leading-snug">
            {checkpointData.prompt}
          </p>

          <div className="space-y-1.5" role="radiogroup" aria-label={checkpointData.prompt}>
            {checkpointData.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectChoice = isSelected && opt.isCorrect;
              const isWrongChoice = isSelected && !opt.isCorrect;

              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setSelectedOptionId(opt.id);
                    playLearningFeedback(opt.isCorrect ? 'correct' : 'incorrect');
                  }}
                  className={[
                    'w-full min-h-[44px] px-3 py-2 rounded-[11px] border-2 text-left text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer',
                    isCorrectChoice
                      ? 'bg-[#D9FAF5] border-[#1FA89A] text-[#0E5A42]'
                      : isWrongChoice
                        ? 'bg-[#FEE8E7] border-[#C94A3A] text-[#9E2A25]'
                        : 'bg-white border-[#E5E2D9] text-[#1B2559] hover:border-[#5B43C2]',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {selectedOption ? (
            <PracticeFeedback
              status={selectedOption.isCorrect ? 'correct' : 'try-again'}
              title={selectedOption.isCorrect ? 'Spot on!' : 'Try another option'}
              message={selectedOption.explanation}
            />
          ) : null}
        </section>
      ) : null}
    </div>
  );
};
