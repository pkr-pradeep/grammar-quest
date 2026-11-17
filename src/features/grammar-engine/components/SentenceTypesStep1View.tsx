/**
 * ============================================================================
 * GRAMMAR QUEST — SENTENCE TYPES & CLAUSE PATTERNS: STEP 1 LEARN VIEW
 * ============================================================================
 * Compact, mobile-first interactive Learn screen for Step 1 of 12
 * ("Sentence Types & Clause Patterns"). Preserves all existing lesson data
 * while organising it into:
 *   A. Starter Sentence interactive card (Subject/Predicate/Structure + word tap)
 *   B. Functional Sentence Types 2x2 interactive tile grid + live definition strip
 *   C. Examples · Easy to Challenging tabbed explorer
 *   D. Compact Remember callout
 *   E. Two independent accessible collapsible explanation rows (collapsed by default)
 *   F. 44px icon-only scroll cue with 90px bottom fade
 * ============================================================================
 */

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  Check,
  ChevronDown,
  Layers,
  Lightbulb,
  ListTree,
  MessageSquare,
} from 'lucide-react';
import type {
  ClausePatternVisualData,
  SentenceDefinition,
  SentenceToken,
} from '../../../schemas/grammarEngine.schema';
import { GRAMMATICAL_CATEGORY_META } from '../categoryMeta';

export interface SentenceTypesStep1ViewProps {
  stepId: string;
  sentence: SentenceDefinition;
  clausePatternData?: ClausePatternVisualData;
  isPaused?: boolean;
  animationSeed?: number;
  onUserEngage?: () => void;
}

type StarterConcept = 'subject' | 'predicate' | 'structure';

interface SentenceTypeTileTheme {
  key: 'declarative' | 'interrogative' | 'imperative' | 'exclamatory';
  badgeLabel: string;
  bgHex: string;
  borderHex: string;
  badgeHex: string;
  ringRgba: string;
}

const SENTENCE_TYPE_THEMES: SentenceTypeTileTheme[] = [
  {
    key: 'declarative',
    badgeLabel: 'DECLARATIVE (.)',
    bgHex: '#D7F5EE',
    borderHex: '#1FA89B',
    badgeHex: '#0F7F76',
    ringRgba: 'rgba(31, 168, 155, 0.28)',
  },
  {
    key: 'interrogative',
    badgeLabel: 'INTERROGATIVE (?)',
    bgHex: '#E3EFFE',
    borderHex: '#3E7BD8',
    badgeHex: '#2B5FB4',
    ringRgba: 'rgba(62, 123, 216, 0.28)',
  },
  {
    key: 'imperative',
    badgeLabel: 'IMPERATIVE (. / !)',
    bgHex: '#FDEBC0',
    borderHex: '#E9A62B',
    badgeHex: '#8F4A0C',
    ringRgba: 'rgba(233, 166, 43, 0.32)',
  },
  {
    key: 'exclamatory',
    badgeLabel: 'EXCLAMATORY (!)',
    bgHex: '#ECE6FB',
    borderHex: '#6B4FD1',
    badgeHex: '#4B35A6',
    ringRgba: 'rgba(107, 79, 209, 0.28)',
  },
];

function splitTrailingPunctuation(text: string): {
  body: string;
  punctuation: string;
} {
  const trimmed = text.trim();
  const match = trimmed.match(/^(.*?)([.?!]+)$/);
  if (!match) {
    return { body: trimmed, punctuation: '' };
  }
  return { body: match[1], punctuation: match[2] };
}

function parseStepByStepItems(stepByStep: string): string[] {
  const parts = stepByStep
    .split(/(?:^|\s)\d+\)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [stepByStep.trim()];
}

function ensureEndsWithPeriod(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  return /[.?!)]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export const SentenceTypesStep1View: React.FC<SentenceTypesStep1ViewProps> = ({
  stepId,
  sentence,
  clausePatternData,
  isPaused = false,
  animationSeed = 0,
  onUserEngage,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const baseId = useId();

  // A. Starter Sentence state
  const [selectedConcept, setSelectedConcept] = useState<StarterConcept | null>(null);
  const [selectedToken, setSelectedToken] = useState<SentenceToken | null>(null);

  // B. Functional Sentence Types selection (default Declarative)
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);

  // C. Examples tabs
  const [activeExampleIdx, setActiveExampleIdx] = useState(0);

  // E. Independent collapsible rows (both collapsed by default)
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [optativeExpanded, setOptativeExpanded] = useState(false);

  const whyContentRef = useRef<HTMLDivElement | null>(null);
  const optativeContentRef = useRef<HTMLDivElement | null>(null);

  // Reset per-step interactive state cleanly when opening this step
  useEffect(() => {
    setSelectedConcept(null);
    setSelectedToken(null);
    setSelectedTypeIndex(0);
    setActiveExampleIdx(0);
    setWhyExpanded(false);
    setOptativeExpanded(false);
  }, [stepId]);

  // Enforce inert on collapsed collapsible panels so hidden content cannot receive focus or SR access
  useEffect(() => {
    const el = whyContentRef.current as (HTMLDivElement & { inert: boolean }) | null;
    if (el) {
      el.inert = !whyExpanded;
    }
  }, [whyExpanded]);

  useEffect(() => {
    const el = optativeContentRef.current as (HTMLDivElement & { inert: boolean }) | null;
    if (el) {
      el.inert = !optativeExpanded;
    }
  }, [optativeExpanded]);

  const subjectGroup = useMemo(
    () => sentence.groups.find((g) => g.role === 'subject') ?? null,
    [sentence.groups],
  );
  const predicateGroup = useMemo(
    () => sentence.groups.find((g) => g.role === 'predicate') ?? null,
    [sentence.groups],
  );

  const handleToggleConcept = (concept: StarterConcept) => {
    onUserEngage?.();
    setSelectedToken(null);
    setSelectedConcept((prev) => (prev === concept ? null : concept));
  };

  const handleToggleToken = (token: SentenceToken) => {
    onUserEngage?.();
    setSelectedConcept(null);
    setSelectedToken((prev) => (prev?.id === token.id ? null : token));
  };

  const starterCaption = (() => {
    if (selectedToken) {
      const catMeta = GRAMMATICAL_CATEGORY_META[selectedToken.category];
      return {
        mode: 'word' as const,
        prefix: `${selectedToken.text} · ${selectedToken.roleLabel || catMeta.label}`,
        body: selectedToken.meaningInSentence || selectedToken.grammaticalRoleExplanation,
      };
    }

    if (selectedConcept === 'subject') {
      return {
        mode: 'concept' as const,
        prefix: 'Subject',
        body:
          subjectGroup?.plainExplanation ??
          `'${sentence.structureSummary.subjectText}' names who or what the sentence is about.`,
      };
    }

    if (selectedConcept === 'predicate') {
      return {
        mode: 'concept' as const,
        prefix: 'Predicate',
        body:
          predicateGroup?.plainExplanation ??
          `'${sentence.structureSummary.predicateText}' tells what is said about the Subject.`,
      };
    }

    if (selectedConcept === 'structure') {
      return {
        mode: 'concept' as const,
        prefix: 'Structure',
        body:
          sentence.structureSummary.patternNote ??
          `'${sentence.structureSummary.subjectText}' (Subject) + '${sentence.structureSummary.predicateText}' (Predicate).`,
      };
    }

    return {
      mode: 'default' as const,
      prefix: null,
      body: 'Try it: tap Subject, Predicate or Structure, or tap any word.',
    };
  })();

  // Map 4 Functional Sentence Type tiles strictly from clausePatternData
  const sentenceTypeTiles = useMemo(() => {
    const segments = clausePatternData?.segments ?? [];
    const keyTerms = clausePatternData?.keyTerms ?? [];
    return SENTENCE_TYPE_THEMES.map((theme, idx) => {
      const segment = segments[idx];
      const termEntry = keyTerms[idx];
      return {
        ...theme,
        exampleText: segment?.text ?? '',
        caption: ensureEndsWithPeriod(segment?.subLabel ?? ''),
        definition: termEntry?.meaning ?? '',
        termName: termEntry?.term ?? theme.key,
      };
    });
  }, [clausePatternData]);

  const activeTypeTile =
    sentenceTypeTiles[selectedTypeIndex] ?? sentenceTypeTiles[0];

  const progressiveExamples = clausePatternData?.progressiveExamples ?? [];
  const activeExample =
    progressiveExamples[activeExampleIdx] ?? progressiveExamples[0] ?? null;
  const activeStepItems = activeExample
    ? parseStepByStepItems(activeExample.stepByStep)
    : [];

  const rememberText =
    'Remember: sentence purpose controls both the opening word order and the end punctuation (. ? !).';

  const whyButtonId = `${baseId}-why-btn`;
  const whyPanelId = `${baseId}-why-panel`;
  const optativeButtonId = `${baseId}-optative-btn`;
  const optativePanelId = `${baseId}-optative-panel`;

  return (
      <div className="space-y-3.5 sm:space-y-4">
        {/* A. Starter Sentence Card */}
        <section
          aria-labelledby={`${baseId}-starter-heading`}
          className="rounded-[22px] bg-white border border-[#E9E1CB] p-3.5 sm:p-4 space-y-3 shadow-[var(--gq-shadow-card)]"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id={`${baseId}-starter-heading`}
              className="text-[15.5px] sm:text-base font-extrabold text-[#1B2559] leading-tight"
            >
              Starter Sentence
            </h2>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#D7F5EE] border border-[#9CDFD0] text-[#0F7F76] text-[11px] font-extrabold leading-none whitespace-nowrap">
              Statement
            </span>
          </div>

          {/* Three Equal Concept Buttons */}
          <div
            role="group"
            aria-label="Sentence concepts"
            className="grid grid-cols-3 gap-2"
          >
            {(
              [
                { id: 'subject', label: 'Subject', Icon: Layers },
                { id: 'predicate', label: 'Predicate', Icon: MessageSquare },
                { id: 'structure', label: 'Structure', Icon: ListTree },
              ] as const
            ).map(({ id, label, Icon }) => {
              const isSelected = selectedConcept === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleToggleConcept(id)}
                  aria-pressed={isSelected}
                  className={[
                    'h-[44px] min-h-[44px] px-1.5 min-[360px]:px-2 rounded-[12px] border-[1.5px] inline-flex items-center justify-center gap-1 min-[360px]:gap-1.5 text-[11.5px] min-[360px]:text-[12.5px] sm:text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer',
                    'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                    isSelected
                      ? 'bg-[#1B2559] border-[#1B2559] text-white'
                      : 'bg-[#FDFCF9] border-[#D8D1BE] text-[#1B2559] hover:bg-[#F5F2EA]',
                  ].join(' ')}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Individually Tappable Words */}
          <div
            key={`${sentence.id}-${animationSeed}`}
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5"
          >
            {sentence.tokens.map((token, idx) => {
              const catMeta = GRAMMATICAL_CATEGORY_META[token.category];
              const isWordSelected = selectedToken?.id === token.id;

              const isSubjectWord = token.groupRole === 'subject';
              const isPredicateWord = token.groupRole === 'predicate';
              const isNounHead = Boolean(token.isHeadWord && token.category === 'noun');
              const isVerbHead = Boolean(token.isHeadWord && token.category === 'verb');

              let bgHex = '#FFFFFF';
              let borderHex = '#D8D1BE';
              let isFaded = false;

              if (selectedConcept === 'subject') {
                if (isSubjectWord) {
                  bgHex = '#FDEBC0';
                  borderHex = '#E5B24A';
                } else {
                  isFaded = true;
                }
              } else if (selectedConcept === 'predicate') {
                if (isPredicateWord) {
                  bgHex = '#D7F5EE';
                  borderHex = '#1FA89B';
                } else {
                  isFaded = true;
                }
              } else if (selectedConcept === 'structure') {
                if (isNounHead) {
                  bgHex = '#E3EFFE';
                  borderHex = '#3E7BD8';
                } else if (isVerbHead) {
                  bgHex = '#DDF6E7';
                  borderHex = '#1F9E5A';
                } else {
                  isFaded = true;
                }
              }

              if (isWordSelected) {
                borderHex = '#1B2559';
                isFaded = false;
              }

              const shouldAnimate = !prefersReducedMotion && !isPaused;

              return (
                <motion.button
                  key={token.id}
                  type="button"
                  onClick={() => handleToggleToken(token)}
                  aria-pressed={isWordSelected}
                  aria-label={`${token.text}, ${catMeta.label}${token.isHeadWord ? ', Head word' : ''}`}
                  initial={shouldAnimate ? { opacity: 0, y: 6 } : false}
                  animate={{
                    opacity: isFaded ? 0.45 : 1,
                    y: isWordSelected ? -2 : 0,
                  }}
                  transition={
                    shouldAnimate
                      ? {
                          duration: 0.18,
                          delay: Math.min(idx * 0.04, 0.25),
                          ease: [0.22, 1, 0.36, 1],
                        }
                      : { duration: 0 }
                  }
                  style={{
                    backgroundColor: bgHex,
                    borderColor: borderHex,
                  }}
                  className={[
                    'inline-flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-[12px] border-[2.5px]',
                    'transition-colors duration-150 select-none cursor-pointer',
                    'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                    isWordSelected ? 'shadow-sm' : 'hover:border-[#4B5C8A]',
                  ].join(' ')}
                >
                  <span className="text-[15px] font-bold leading-tight text-[#1B2559] whitespace-nowrap">
                    {token.text}
                    {token.punctuationAfter ? (
                      <span className="text-[#4B5C8A] font-semibold">
                        {token.punctuationAfter}
                      </span>
                    ) : null}
                  </span>

                  <span
                    style={{ color: catMeta.fgVar }}
                    className="mt-0.5 inline-flex items-center gap-0.5 text-[10.5px] font-bold leading-none whitespace-nowrap"
                  >
                    <span aria-hidden="true">{catMeta.symbol}</span>
                    <span>{catMeta.shortLabel}</span>
                    {token.isHeadWord ? (
                      <span className="text-[#1B2559] font-extrabold">· Head</span>
                    ) : null}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Stable Caption Area (>= 58px height) */}
          <div
            aria-live="polite"
            className="min-h-[58px] rounded-[14px] bg-[#FDFCF9] border border-[#E5E2D9] px-3 py-2 flex items-center"
          >
            <p className="text-[13px] leading-snug text-[#4A5170]">
              {starterCaption.prefix ? (
                <>
                  <strong className="font-extrabold text-[#1B2559]">
                    {starterCaption.prefix}:{' '}
                  </strong>
                  <span>{starterCaption.body}</span>
                </>
              ) : (
                <span>{starterCaption.body}</span>
              )}
            </p>
          </div>
        </section>

        {/* B. Functional Sentence Types */}
        <section
          aria-labelledby={`${baseId}-types-heading`}
          className="space-y-2.5"
        >
          <h2
            id={`${baseId}-types-heading`}
            className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#4B5C8A] px-0.5"
          >
            FUNCTIONAL SENTENCE TYPES
          </h2>

          <div className="grid grid-cols-2 gap-[10px]">
            {sentenceTypeTiles.map((tile, idx) => {
              const isSelected = idx === selectedTypeIndex;
              const { body, punctuation } = splitTrailingPunctuation(tile.exampleText);

              return (
                <button
                  key={tile.key}
                  type="button"
                  onClick={() => {
                    onUserEngage?.();
                    setSelectedTypeIndex(idx);
                  }}
                  aria-pressed={isSelected}
                  style={{
                    backgroundColor: tile.bgHex,
                    borderColor: tile.borderHex,
                    boxShadow: isSelected
                      ? `0 0 0 3px ${tile.ringRgba}`
                      : undefined,
                  }}
                  className="relative rounded-[18px] border-[1.5px] p-3 text-left flex flex-col justify-between gap-2 min-h-[116px] transition-shadow cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
                >
                  <div className="space-y-1.5">
                    <span
                      style={{ backgroundColor: tile.badgeHex }}
                      className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-white text-[10px] font-extrabold tracking-[0.04em] uppercase leading-tight max-w-full"
                    >
                      {tile.badgeLabel}
                    </span>

                    <p className="text-[13.5px] font-bold text-[#1B2559] leading-snug break-words">
                      {body}
                      {punctuation ? (
                        <span
                          style={{ color: tile.badgeHex }}
                          className="text-[17px] font-extrabold leading-none ml-0.5"
                        >
                          {punctuation}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-2">
                    <span className="text-[11.5px] font-semibold text-[#3B446B] leading-tight">
                      {tile.caption}
                    </span>
                    {isSelected ? (
                      <span
                        aria-hidden="true"
                        className="w-5 h-5 rounded-full bg-[#1B2559] text-white inline-flex items-center justify-center shrink-0"
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Single Live Definition Strip directly beneath grid */}
          {activeTypeTile?.definition ? (
            <div
              aria-live="polite"
              style={{
                backgroundColor: activeTypeTile.bgHex,
                borderColor: activeTypeTile.borderHex,
              }}
              className="rounded-[14px] border px-3.5 py-2.5 text-[13px] text-[#1B2559] leading-snug"
            >
              <strong
                style={{ color: activeTypeTile.badgeHex }}
                className="font-extrabold"
              >
                {activeTypeTile.termName}:{' '}
              </strong>
              <span className="font-medium">{activeTypeTile.definition}</span>
            </div>
          ) : null}
        </section>

        {/* C. Examples Card (Easy to Challenging) */}
        {progressiveExamples.length > 0 && activeExample ? (
          <section
            aria-labelledby={`${baseId}-examples-heading`}
            className="rounded-[22px] bg-white border border-[#E9E1CB] p-3.5 sm:p-4 space-y-3 shadow-[var(--gq-shadow-card)]"
          >
            <h2
              id={`${baseId}-examples-heading`}
              className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#4B5C8A]"
            >
              EXAMPLES · EASY TO CHALLENGING
            </h2>

            <div
              role="tablist"
              aria-label="Example difficulty"
              className="grid grid-cols-3 gap-1.5 p-1 rounded-[12px] bg-[#F5F2EA]"
            >
              {progressiveExamples.map((ex, idx) => {
                const isSelected = idx === activeExampleIdx;
                return (
                  <button
                    key={ex.level}
                    id={`${baseId}-example-tab-${idx}`}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`${baseId}-example-panel`}
                    onClick={() => {
                      onUserEngage?.();
                      setActiveExampleIdx(idx);
                    }}
                    className={[
                      'min-h-[40px] px-2 py-1 rounded-[9px] text-[12.5px] font-extrabold transition-colors cursor-pointer whitespace-nowrap',
                      'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                      isSelected
                        ? 'bg-[#1B2559] text-white shadow-xs'
                        : 'text-[#4B5C8A] hover:text-[#1B2559]',
                    ].join(' ')}
                  >
                    {ex.level}
                  </button>
                );
              })}
            </div>

            <motion.div
              key={`${activeExample.level}-${activeExampleIdx}`}
              id={`${baseId}-example-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-example-tab-${activeExampleIdx}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
              }
              className="space-y-3 pt-0.5"
            >
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[7px] bg-[#FFF4D6] border border-[#F2DFB6] text-[#8F4A0C] text-[11px] font-extrabold">
                  {activeExample.highlightBadge}
                </span>
              </div>

              <p className="text-[17px] font-extrabold text-[#1B2559] leading-snug break-words">
                “{activeExample.sentence}”
              </p>

              <div className="space-y-2">
                <p className="text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#4B5C8A]">
                  STEP BY STEP
                </p>
                <ol className="space-y-2">
                  {activeStepItems.map((stepText, idx) => (
                    <li
                      key={`${idx}-${stepText.slice(0, 12)}`}
                      className="flex items-start gap-2.5 text-[13px] text-[#333333] leading-snug"
                    >
                      <span
                        aria-hidden="true"
                        className="w-[22px] h-[22px] rounded-full bg-[#1B2559] text-white text-[11px] font-extrabold inline-flex items-center justify-center shrink-0 mt-0.5 tabular-nums"
                      >
                        {idx + 1}
                      </span>
                      <span className="min-w-0 flex-1">{stepText}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {activeExample.whyCorrect ? (
                <div className="rounded-[12px] bg-[#E2F5EE] border border-[#9ADFD0] px-3 py-2.5 text-[12.5px] text-[#0B4A41] leading-snug">
                  <strong className="font-extrabold">Why it is right: </strong>
                  <span>{activeExample.whyCorrect}</span>
                </div>
              ) : null}
            </motion.div>
          </section>
        ) : null}

        {/* D. Remember Callout */}
        <aside
          aria-label="Remember"
          className="rounded-[18px] bg-[#ECE6FB] border border-[#CBBDF3] px-3.5 py-3 flex items-start gap-2.5"
        >
          <Lightbulb
            className="w-4 h-4 text-[#5B43C2] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-[13px] font-semibold text-[#263A70] leading-snug">
            {rememberText}
          </p>
        </aside>

        {/* E. Two Independent Collapsible Explanations */}
        <div className="space-y-2.5">
          {/* Row 1: Why does this work? */}
          {clausePatternData?.whyItWorks ? (
            <div className="rounded-[20px] bg-white border border-[#E9E1CB] overflow-hidden">
              <button
                id={whyButtonId}
                type="button"
                onClick={() => {
                  onUserEngage?.();
                  setWhyExpanded((prev) => !prev);
                }}
                aria-expanded={whyExpanded}
                aria-controls={whyPanelId}
                className="w-full min-h-[56px] px-3.5 py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-[#FDFCF9] transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#1B2559]"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-[11px] bg-[#FFF4D6] text-[#9C4F08] inline-flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-extrabold text-[#1B2559] leading-tight">
                      Why does this work?
                    </span>
                    <span className="block text-[12px] font-medium text-[#4B5C8A] leading-tight mt-0.5">
                      The reason behind the four types.
                    </span>
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#4B5C8A] shrink-0 whitespace-nowrap">
                  <span>{whyExpanded ? 'Hide' : 'Show'}</span>
                  <ChevronDown
                    className={[
                      'w-4 h-4 transition-transform',
                      prefersReducedMotion ? 'duration-0' : 'duration-300',
                      whyExpanded ? 'rotate-180' : 'rotate-0',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                </span>
              </button>

              <div
                id={whyPanelId}
                ref={whyContentRef}
                role="region"
                aria-labelledby={whyButtonId}
                aria-hidden={!whyExpanded}
                className={[
                  'grid',
                  prefersReducedMotion
                    ? ''
                    : 'transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                ].join(' ')}
                style={{
                  gridTemplateRows: whyExpanded ? '1fr' : '0fr',
                }}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="px-3.5 pb-3.5 pt-0.5 border-t border-[#F2EFE7]">
                    <p className="text-[13px] text-[#333333] leading-relaxed pt-2.5">
                      {clausePatternData.whyItWorks}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Row 2: Grammar note: Optative */}
          {clausePatternData?.boardNote ? (
            <div className="rounded-[20px] bg-[#F4F0FD] border border-[#CBBDF3] overflow-hidden">
              <button
                id={optativeButtonId}
                type="button"
                onClick={() => {
                  onUserEngage?.();
                  setOptativeExpanded((prev) => !prev);
                }}
                aria-expanded={optativeExpanded}
                aria-controls={optativePanelId}
                className="w-full min-h-[56px] px-3.5 py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-[#ECE6FB] transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#1B2559]"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-[11px] bg-[#ECE6FB] text-[#5B43C2] inline-flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-extrabold text-[#1B2559] leading-tight">
                      Grammar note: Optative
                    </span>
                    <span className="block text-[12px] font-medium text-[#4B5C8A] leading-tight mt-0.5">
                      Extra: a fifth sentence type.
                    </span>
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#5B43C2] shrink-0 whitespace-nowrap">
                  <span>{optativeExpanded ? 'Hide' : 'Show'}</span>
                  <ChevronDown
                    className={[
                      'w-4 h-4 transition-transform',
                      prefersReducedMotion ? 'duration-0' : 'duration-300',
                      optativeExpanded ? 'rotate-180' : 'rotate-0',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                </span>
              </button>

              <div
                id={optativePanelId}
                ref={optativeContentRef}
                role="region"
                aria-labelledby={optativeButtonId}
                aria-hidden={!optativeExpanded}
                className={[
                  'grid',
                  prefersReducedMotion
                    ? ''
                    : 'transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                ].join(' ')}
                style={{
                  gridTemplateRows: optativeExpanded ? '1fr' : '0fr',
                }}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="px-3.5 pb-3.5 pt-0.5 border-t border-[#DDD4F7]">
                    <p className="text-[13px] text-[#263A70] leading-relaxed pt-2.5">
                      {clausePatternData.boardNote.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
  );
};
