/**
 * ============================================================================
 * GRAMMAR QUEST — SENTENCE TYPES & CLAUSE PATTERNS: UNIFIED LEARN VIEW
 * ============================================================================
 * Compact, mobile-first interactive Learn screen applied consistently across
 * all 12 steps ("stcp-step-01" through "stcp-step-12") of "Sentence Types &
 * Clause Patterns". Follows the exact visual system introduced in Step 1:
 *   A. Starter Sentence interactive card (Subject/Predicate/Structure + word tap
 *      + optional Compare switcher when comparisonSentence is provided)
 *   B. Interactive segment tiles grid + live definition strip (+ compact Key
 *      Terms and Clause Relationship Diagram when applicable)
 *   C. Examples · Easy to Challenging tabbed explorer (when provided)
 *   C2. Checkpoint quick-check quiz card (when provided)
 *   D. Compact Remember callout
 *   E. Independent accessible collapsible explanation rows (collapsed by default)
 * ============================================================================
 */

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Layers,
  Lightbulb,
  ListTree,
  MessageSquare,
} from 'lucide-react';
import type {
  ClausePatternVisualData,
  ClauseSegmentTone,
  SentenceDefinition,
  SentenceToken,
  TeachingCheckpointData,
} from '../../../schemas/grammarEngine.schema';
import { GRAMMATICAL_CATEGORY_META } from '../categoryMeta';
import { playLearningFeedback } from '../../../services/feedback/feedbackService';

export interface SentenceTypesStepViewProps {
  stepId: string;
  sentence: SentenceDefinition;
  comparisonSentence?: SentenceDefinition | null;
  clausePatternData?: ClausePatternVisualData;
  checkpointData?: TeachingCheckpointData;
  isPaused?: boolean;
  animationSeed?: number;
  onUserEngage?: () => void;
}

type StarterConcept = 'subject' | 'predicate' | 'structure';

interface TileTheme {
  bgHex: string;
  borderHex: string;
  badgeHex: string;
  ringRgba: string;
}

const TONE_THEMES: Record<ClauseSegmentTone, TileTheme> = {
  independent: {
    bgHex: '#D7F5EE',
    borderHex: '#1FA89B',
    badgeHex: '#0F7F76',
    ringRgba: 'rgba(31, 168, 155, 0.28)',
  },
  verb: {
    bgHex: '#D7F5EE',
    borderHex: '#1FA89B',
    badgeHex: '#0F7F76',
    ringRgba: 'rgba(31, 168, 155, 0.28)',
  },
  object: {
    bgHex: '#E3EFFE',
    borderHex: '#3E7BD8',
    badgeHex: '#2B5FB4',
    ringRgba: 'rgba(62, 123, 216, 0.28)',
  },
  subject: {
    bgHex: '#FDEBC0',
    borderHex: '#E9A62B',
    badgeHex: '#8F4A0C',
    ringRgba: 'rgba(233, 166, 43, 0.32)',
  },
  dependent: {
    bgHex: '#FDEBC0',
    borderHex: '#E9A62B',
    badgeHex: '#8F4A0C',
    ringRgba: 'rgba(233, 166, 43, 0.32)',
  },
  complement: {
    bgHex: '#ECE6FB',
    borderHex: '#6B4FD1',
    badgeHex: '#4B35A6',
    ringRgba: 'rgba(107, 79, 209, 0.28)',
  },
  linker: {
    bgHex: '#ECE6FB',
    borderHex: '#6B4FD1',
    badgeHex: '#4B35A6',
    ringRgba: 'rgba(107, 79, 209, 0.28)',
  },
  phrase: {
    bgHex: '#F5F2EA',
    borderHex: '#A69C85',
    badgeHex: '#4A5170',
    ringRgba: 'rgba(166, 156, 133, 0.28)',
  },
  adverbial: {
    bgHex: '#FDECE8',
    borderHex: '#D96857',
    badgeHex: '#9E2A25',
    ringRgba: 'rgba(217, 104, 87, 0.28)',
  },
};

const WHY_WORKS_SUBTITLES: Record<string, string> = {
  'stcp-step-01': 'The reason behind the four types.',
  'stcp-step-02': 'How word order separates ! from ?.',
  'stcp-step-03': 'Why the finite verb decides.',
  'stcp-step-04': 'Why -ing and to + verb stay frozen.',
  'stcp-step-05': 'How the main verb selects its slots.',
  'stcp-step-06': 'Why linking verbs take C instead of O.',
  'stcp-step-07': 'How verbs shape the six core patterns.',
  'stcp-step-08': 'Telling SVOC apart from SVOO.',
  'stcp-step-09': 'How hook words create dependency.',
  'stcp-step-10': 'Why dependent clauses need a main clause.',
  'stcp-step-11': 'Equal rank vs helper clauses.',
  'stcp-step-12': 'Why finite verb count proves clause count.',
  'apv-step-01': 'How Voice moves the spotlight, not the facts.',
  'apv-step-02': 'Why helper be—not -ed/-en—shows time.',
  'apv-step-03': 'Why the Object moves and verb splits.',
  'apv-step-04': 'Why be locks onto the new Subject.',
  'apv-step-05': 'Why ongoing actions keep being.',
  'apv-step-06': 'Why Perfect uses been and Modals use be.',
  'apv-step-07': 'Why pronouns swap case across the verb.',
  'apv-step-08': 'How two objects, questions, and commands shift.',
  'apv-step-09': 'When to drop by and choose with for tools.',
  'apv-step-10': 'Why verbs without an Object block Passive.',
  'apv-step-11': 'How the 5-Point Check catches hidden slips.',
  'prep-step-01': 'How one bridge word controls the picture.',
  'prep-step-02': 'Keeping modifiers and object pronouns inside.',
  'prep-step-03': 'Scaling time from clock dot to broad span.',
  'prep-step-04': 'Separating start points, length, and limits.',
  'prep-step-05': 'Seeing places as dots, boxes, or surfaces.',
  'prep-step-06': 'Separating two, many, beside, and opposite.',
  'prep-step-07': 'Why motion entry takes into / onto.',
  'prep-step-08': 'Matching surface, 3D volume, and line paths.',
  'prep-step-09': 'Telling tools, travel modes, and materials apart.',
  'prep-step-10': 'Why surrounding nouns decide the meaning.',
  'prep-step-11': 'Why direct transitive verbs drop extra bridges.',
};

const BOARD_NOTE_SUBTITLES: Record<string, string> = {
  'stcp-step-01': 'Extra: a fifth sentence type.',
  'stcp-step-06': 'How grammar guides label place phrases.',
  'stcp-step-11': 'Where Compound & Complex drills live next.',
  'apv-step-01': 'Quick way to spot Active vs Passive.',
  'apv-step-04': 'Understanding V-en vs V3 labels.',
  'apv-step-06': 'Two continuous forms without passives.',
  'prep-step-02': 'What can sit in the Object slot.',
  'prep-step-11': 'Formal fronting vs everyday questions.',
};

function extractStarterBadge(sentenceTitle: string): string {
  const parts = sentenceTitle.split('·').map((part) => part.trim());
  if (parts.length > 1 && parts[1]) {
    return parts.slice(1).join(' · ');
  }
  return sentenceTitle.trim();
}

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

function formatRememberText(stepId: string, ruleSummary?: string): string | null {
  if (stepId === 'stcp-step-01') {
    return 'Remember: sentence purpose controls both the opening word order and the end punctuation (. ? !).';
  }
  if (!ruleSummary) return null;
  const trimmed = ruleSummary.trim();
  if (!trimmed) return null;

  // Preserve leading uppercase for grammar abbreviations, numbers, or proper terms
  const keepCapsStart =
    /^(?:[0-9]|S\s*=|S\b|V\b|O\b|C\b|A\b|IO\b|DO\b|SV|IC\b|DC\b|ISRO|Independent|Dependent|Coordination|Subordination|Active|Passive|Present|Past|Perfect|Progressive|Future|Modal|Preposition|Subject|Object|Pronoun|Intransitive|Tool\b|Doer\b|Zero\b|V-en\b|V2\b|V3\b)/.test(
      trimmed,
    );
  const formattedBody = keepCapsStart
    ? trimmed
    : trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  return `Remember: ${ensureEndsWithPeriod(formattedBody)}`;
}

function findMatchingKeyTermIndex(
  segmentLabel: string,
  keyTerms: { term: string; meaning: string }[],
): number {
  if (keyTerms.length === 0) return -1;
  const normSeg = segmentLabel.toLowerCase();

  // Direct keyword match (handles Step 1, Step 3, Step 5, Step 9, etc.)
  const exactMatchIdx = keyTerms.findIndex((kt) => {
    const baseTerm = kt.term.replace(/\([^)]*\)/g, '').trim().toLowerCase();
    if (!baseTerm) return false;
    return normSeg.includes(baseTerm);
  });
  if (exactMatchIdx >= 0) return exactMatchIdx;

  // Shorthand element aliases for Step 5 (IO / DO -> Object (O), A -> Adverbial (A))
  if (/^(io|do)$/i.test(segmentLabel.trim())) {
    return keyTerms.findIndex((kt) => /object/i.test(kt.term));
  }
  if (/^a$/i.test(segmentLabel.trim())) {
    return keyTerms.findIndex((kt) => /adverbial/i.test(kt.term));
  }

  return -1;
}

function formatBoardNoteHeading(
  stepId: string,
  label: string,
): { title: string; subtitle: string } {
  if (stepId === 'stcp-step-01' && /optative/i.test(label)) {
    return {
      title: 'Grammar note: Optative',
      subtitle: 'Extra: a fifth sentence type.',
    };
  }
  return {
    title: label.replace(/^Grammar Note\s*[·:]?\s*/i, 'Grammar note: ').trim(),
    subtitle: BOARD_NOTE_SUBTITLES[stepId] ?? 'Additional grammar context.',
  };
}

export const SentenceTypesStepView: React.FC<SentenceTypesStepViewProps> = ({
  stepId,
  sentence,
  comparisonSentence = null,
  clausePatternData,
  checkpointData,
  isPaused = false,
  animationSeed = 0,
  onUserEngage,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const baseId = useId();

  // A. Starter Sentence state (plus optional Compare view toggle)
  const [showingCompare, setShowingCompare] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<StarterConcept | null>(null);
  const [selectedToken, setSelectedToken] = useState<SentenceToken | null>(null);

  // B. Concept / segment tiles selection
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState(0);

  // C. Examples tabs
  const [activeExampleIdx, setActiveExampleIdx] = useState(0);

  // C2. Quick checkpoint selection
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string | null>(null);

  // E. Independent collapsible rows (all collapsed by default)
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [mistakeExpanded, setMistakeExpanded] = useState(false);
  const [boardNoteExpanded, setBoardNoteExpanded] = useState(false);

  const whyContentRef = useRef<HTMLDivElement | null>(null);
  const mistakeContentRef = useRef<HTMLDivElement | null>(null);
  const boardNoteContentRef = useRef<HTMLDivElement | null>(null);

  // Reset per-step interactive state cleanly when opening/switching step
  useEffect(() => {
    setShowingCompare(false);
    setSelectedConcept(null);
    setSelectedToken(null);
    setSelectedSegmentIdx(0);
    setActiveExampleIdx(0);
    setSelectedCheckpointId(null);
    setWhyExpanded(false);
    setMistakeExpanded(false);
    setBoardNoteExpanded(false);
  }, [stepId]);

  // Enforce inert on collapsed collapsible panels so hidden content cannot receive focus or SR access
  useEffect(() => {
    const el = whyContentRef.current as (HTMLDivElement & { inert: boolean }) | null;
    if (el) el.inert = !whyExpanded;
  }, [whyExpanded]);

  useEffect(() => {
    const el = mistakeContentRef.current as (HTMLDivElement & { inert: boolean }) | null;
    if (el) el.inert = !mistakeExpanded;
  }, [mistakeExpanded]);

  useEffect(() => {
    const el = boardNoteContentRef.current as (HTMLDivElement & { inert: boolean }) | null;
    if (el) el.inert = !boardNoteExpanded;
  }, [boardNoteExpanded]);

  const activeDisplaySentence =
    showingCompare && comparisonSentence ? comparisonSentence : sentence;

  const subjectGroup = useMemo(
    () => activeDisplaySentence.groups.find((g) => g.role === 'subject') ?? null,
    [activeDisplaySentence.groups],
  );
  const predicateGroup = useMemo(
    () => activeDisplaySentence.groups.find((g) => g.role === 'predicate') ?? null,
    [activeDisplaySentence.groups],
  );

  const handleSwitchCompare = (nextCompare: boolean) => {
    if (nextCompare === showingCompare) return;
    onUserEngage?.();
    setShowingCompare(nextCompare);
    setSelectedToken(null);
  };

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
          `'${activeDisplaySentence.structureSummary.subjectText}' names who or what the sentence is about.`,
      };
    }

    if (selectedConcept === 'predicate') {
      return {
        mode: 'concept' as const,
        prefix: 'Predicate',
        body:
          predicateGroup?.plainExplanation ??
          `'${activeDisplaySentence.structureSummary.predicateText}' tells what is said about the Subject.`,
      };
    }

    if (selectedConcept === 'structure') {
      return {
        mode: 'concept' as const,
        prefix: 'Structure',
        body:
          activeDisplaySentence.structureSummary.patternNote ??
          `'${activeDisplaySentence.structureSummary.subjectText}' (Subject) + '${activeDisplaySentence.structureSummary.predicateText}' (Predicate).`,
      };
    }

    if (showingCompare && comparisonSentence?.note) {
      return {
        mode: 'compare-default' as const,
        prefix: 'Compare',
        body: comparisonSentence.note,
      };
    }

    return {
      mode: 'default' as const,
      prefix: null,
      body: 'Try it: tap Subject, Predicate or Structure, or tap any word.',
    };
  })();

  // Map Section B segment tiles + matched keyTerms cleanly
  const segmentData = useMemo(() => {
    const segments = clausePatternData?.segments ?? [];
    const keyTerms = clausePatternData?.keyTerms ?? [];
    const matchedTermIndices = new Set<number>();

    const resolvedIndices = segments.map((segment, idx) => {
      const byNameIdx = findMatchingKeyTermIndex(segment.label, keyTerms);
      const fallbackByOrder =
        segments.length === keyTerms.length && keyTerms[idx] ? idx : -1;
      const resolvedTermIdx = byNameIdx >= 0 ? byNameIdx : fallbackByOrder;
      if (resolvedTermIdx >= 0) {
        matchedTermIndices.add(resolvedTermIdx);
      }
      return resolvedTermIdx;
    });

    const isOneToOne =
      segments.length > 0 &&
      segments.length === keyTerms.length &&
      matchedTermIndices.size === keyTerms.length;

    const tiles = segments.map((segment, idx) => {
      const theme = TONE_THEMES[segment.tone] ?? TONE_THEMES.independent;
      const resolvedTermIdx = resolvedIndices[idx];
      const termEntry =
        isOneToOne && resolvedTermIdx >= 0 ? keyTerms[resolvedTermIdx] : undefined;

      const stripTitle = termEntry?.term ?? segment.label;
      const stripBody = termEntry?.meaning
        ? termEntry.meaning
        : segment.subLabel
          ? `“${segment.text}” — ${ensureEndsWithPeriod(segment.subLabel)}`
          : `Part: “${segment.text}”`;

      return {
        key: `${segment.label}-${idx}`,
        badgeLabel: segment.label.toUpperCase(),
        exampleText: segment.text,
        caption: ensureEndsWithPeriod(segment.subLabel ?? ''),
        stripTitle,
        stripBody,
        ...theme,
      };
    });

    const extraKeyTerms = isOneToOne ? [] : keyTerms;
    return { tiles, unmappedTerms: extraKeyTerms };
  }, [clausePatternData]);

  const activeSegmentTile =
    segmentData.tiles[selectedSegmentIdx] ?? segmentData.tiles[0] ?? null;

  const sectionBHeading = clausePatternData?.categoryBadge
    ? clausePatternData.categoryBadge
        .replace(/^Topic\s+\d+\s*·\s*/i, '')
        .trim()
        .toUpperCase()
    : '';

  const gridColumnsClass = (() => {
    const count = segmentData.tiles.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 3 || count === 5) return 'grid-cols-2 sm:grid-cols-3';
    return 'grid-cols-2';
  })();

  const progressiveExamples = clausePatternData?.progressiveExamples ?? [];
  const activeExample =
    progressiveExamples[activeExampleIdx] ?? progressiveExamples[0] ?? null;
  const activeStepItems = activeExample
    ? parseStepByStepItems(activeExample.stepByStep)
    : [];

  const selectedCheckpointOption =
    checkpointData && selectedCheckpointId
      ? checkpointData.options.find((opt) => opt.id === selectedCheckpointId) ?? null
      : null;

  const rememberText = formatRememberText(stepId, clausePatternData?.ruleSummary);
  const starterBadge = extractStarterBadge(activeDisplaySentence.title);

  const whyButtonId = `${baseId}-why-btn`;
  const whyPanelId = `${baseId}-why-panel`;
  const mistakeButtonId = `${baseId}-mistake-btn`;
  const mistakePanelId = `${baseId}-mistake-panel`;
  const boardNoteButtonId = `${baseId}-boardnote-btn`;
  const boardNotePanelId = `${baseId}-boardnote-panel`;

  const boardNoteInfo = clausePatternData?.boardNote
    ? formatBoardNoteHeading(stepId, clausePatternData.boardNote.label)
    : null;

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
            {showingCompare ? 'Compare Sentence' : 'Starter Sentence'}
          </h2>
          <span
            className={[
              'inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-extrabold leading-none whitespace-nowrap max-w-[58%] truncate',
              showingCompare
                ? 'bg-[#E3EFFE] border-[#9CC0F6] text-[#2B5FB4]'
                : 'bg-[#D7F5EE] border-[#9CDFD0] text-[#0F7F76]',
            ].join(' ')}
          >
            {starterBadge}
          </span>
        </div>

        {/* Optional Starter vs Compare Switcher (Steps with comparisonSentenceId) */}
        {comparisonSentence ? (
          <div
            role="tablist"
            aria-label="Compare sentences"
            className="grid grid-cols-2 gap-1.5 p-1 rounded-[12px] bg-[#F5F2EA]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!showingCompare}
              onClick={() => handleSwitchCompare(false)}
              className={[
                'min-h-[40px] px-2.5 py-1 rounded-[9px] text-[12.5px] font-extrabold transition-colors cursor-pointer whitespace-nowrap truncate',
                'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                !showingCompare
                  ? 'bg-[#1B2559] text-white shadow-xs'
                  : 'text-[#4B5C8A] hover:text-[#1B2559]',
              ].join(' ')}
            >
              Starter Sentence
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={showingCompare}
              onClick={() => handleSwitchCompare(true)}
              className={[
                'min-h-[40px] px-2.5 py-1 rounded-[9px] text-[12.5px] font-extrabold transition-colors cursor-pointer whitespace-nowrap truncate',
                'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                showingCompare
                  ? 'bg-[#1B2559] text-white shadow-xs'
                  : 'text-[#4B5C8A] hover:text-[#1B2559]',
              ].join(' ')}
            >
              Compare Sentence
            </button>
          </div>
        ) : null}

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
          key={`${activeDisplaySentence.id}-${animationSeed}`}
          className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5"
        >
          {activeDisplaySentence.tokens.map((token, idx) => {
            const catMeta = GRAMMATICAL_CATEGORY_META[token.category];
            const isWordSelected = selectedToken?.id === token.id;

            const isSubjectWord = token.groupRole === 'subject';
            const isPredicateWord = token.groupRole === 'predicate';
            const isNounHead = Boolean(
              token.isHeadWord && (token.category === 'noun' || token.category === 'pronoun'),
            );
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
                        duration: 0.14,
                        delay: Math.min(idx * 0.02, 0.1),
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

      {/* B. Interactive Concept / Segment Tiles + Live Strip */}
      {segmentData.tiles.length > 0 ? (
        <section
          aria-labelledby={`${baseId}-types-heading`}
          className="space-y-2.5"
        >
          {sectionBHeading ? (
            <h2
              id={`${baseId}-types-heading`}
              className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#4B5C8A] px-0.5"
            >
              {sectionBHeading}
            </h2>
          ) : null}

          <div className={`grid ${gridColumnsClass} gap-[10px]`}>
            {segmentData.tiles.map((tile, idx) => {
              const isSelected = idx === selectedSegmentIdx;
              const { body, punctuation } = splitTrailingPunctuation(tile.exampleText);
              const isLastOddMobile =
                (segmentData.tiles.length === 3 || segmentData.tiles.length === 5) &&
                idx === segmentData.tiles.length - 1;

              return (
                <button
                  key={tile.key}
                  type="button"
                  onClick={() => {
                    onUserEngage?.();
                    setSelectedSegmentIdx(idx);
                  }}
                  aria-pressed={isSelected}
                  style={{
                    backgroundColor: tile.bgHex,
                    borderColor: tile.borderHex,
                    boxShadow: isSelected
                      ? `0 0 0 3px ${tile.ringRgba}`
                      : undefined,
                  }}
                  className={[
                    'relative rounded-[18px] border-[1.5px] p-3 text-left flex flex-col justify-between gap-2 transition-shadow cursor-pointer focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                    isLastOddMobile
                      ? 'col-span-2 sm:col-span-1 min-h-[78px] sm:min-h-[116px]'
                      : 'min-h-[116px]',
                  ].join(' ')}
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
          {activeSegmentTile?.stripBody ? (
            <div
              aria-live="polite"
              style={{
                backgroundColor: activeSegmentTile.bgHex,
                borderColor: activeSegmentTile.borderHex,
              }}
              className="rounded-[14px] border px-3.5 py-2.5 text-[13px] text-[#1B2559] leading-snug"
            >
              <strong
                style={{ color: activeSegmentTile.badgeHex }}
                className="font-extrabold"
              >
                {activeSegmentTile.stripTitle}:{' '}
              </strong>
              <span className="font-medium">{activeSegmentTile.stripBody}</span>
            </div>
          ) : null}

          {/* Key Terms Strip (only rendered for terms not already 1:1 displayed in tiles above) */}
          {segmentData.unmappedTerms.length > 0 ? (
            <div
              aria-label="Key grammar terms"
              className="rounded-[14px] bg-[#FDFCF9] border border-[#E5E2D9] px-3.5 py-2.5 space-y-1.5"
            >
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#4B5C8A]">
                Key terms
              </p>
              <dl className="space-y-1">
                {segmentData.unmappedTerms.map((item) => (
                  <div
                    key={item.term}
                    className="text-[12.5px] leading-snug text-[#263A70]"
                  >
                    <dt className="inline font-extrabold text-[#1B2559]">
                      {item.term}:{' '}
                    </dt>
                    <dd className="inline font-medium text-[#3B446B]">
                      {item.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {/* Visual Clause Relationship Diagram (Steps 11 & 12) */}
          {clausePatternData?.relationDiagram ? (
            <div
              aria-label="Clause relationship diagram"
              className="rounded-[18px] bg-white border border-[#E9E1CB] p-3.5 space-y-2.5 shadow-[var(--gq-shadow-card)]"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 rounded-[14px] bg-[#D7F5EE] border-[1.5px] border-[#1FA89B] px-3 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#0F7F76]">
                    {clausePatternData.relationDiagram.leftLabel}
                  </p>
                  <p className="text-[13px] font-bold text-[#1B2559] leading-snug mt-0.5">
                    {clausePatternData.relationDiagram.leftText}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center justify-center gap-1 px-1 py-0.5 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECE6FB] border border-[#CBBDF3] text-[#4B35A6] text-[11px] font-extrabold whitespace-nowrap">
                    {clausePatternData.relationDiagram.connectorLabel}
                  </span>
                  {clausePatternData.relationDiagram.relationType === 'equal' ? (
                    <ArrowLeftRight
                      className="w-4 h-4 text-[#4B35A6]"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowLeft
                      className="w-4 h-4 text-[#8F4A0C] rotate-90 sm:rotate-0"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div
                  className={[
                    'flex-1 rounded-[14px] border-[1.5px] px-3 py-2',
                    clausePatternData.relationDiagram.relationType === 'equal'
                      ? 'bg-[#D7F5EE] border-[#1FA89B]'
                      : clausePatternData.relationDiagram.relationType === 'dependent'
                        ? 'bg-[#FDEBC0] border-dashed border-[#E9A62B]'
                        : 'bg-[#F5F2EA] border-[#D8D1BE]',
                  ].join(' ')}
                >
                  <p
                    className={[
                      'text-[10px] font-extrabold uppercase tracking-[0.06em]',
                      clausePatternData.relationDiagram.relationType === 'equal'
                        ? 'text-[#0F7F76]'
                        : clausePatternData.relationDiagram.relationType === 'dependent'
                          ? 'text-[#8F4A0C]'
                          : 'text-[#4B5C8A]',
                    ].join(' ')}
                  >
                    {clausePatternData.relationDiagram.rightLabel}
                  </p>
                  <p className="text-[13px] font-bold text-[#1B2559] leading-snug mt-0.5">
                    {clausePatternData.relationDiagram.rightText}
                  </p>
                </div>
              </div>

              <p className="text-[12.5px] font-medium text-[#4A5170] leading-snug">
                {clausePatternData.relationDiagram.caption}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

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

      {/* C2. Checkpoint Quick Check Card (when present on a step) */}
      {checkpointData ? (
        <section
          aria-labelledby={`${baseId}-checkpoint-heading`}
          className="rounded-[22px] bg-white border border-[#E9E1CB] p-3.5 sm:p-4 space-y-3 shadow-[var(--gq-shadow-card)]"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id={`${baseId}-checkpoint-heading`}
              className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#4B5C8A] truncate"
            >
              {checkpointData.topicLabel}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[7px] bg-[#ECE6FB] border border-[#CBBDF3] text-[#4B35A6] text-[10.5px] font-extrabold whitespace-nowrap shrink-0">
              <HelpCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span>Quick Check</span>
            </span>
          </div>

          <p className="text-[15px] sm:text-[15.5px] font-extrabold text-[#1B2559] leading-snug">
            {checkpointData.prompt}
          </p>

          <div
            role="radiogroup"
            aria-labelledby={`${baseId}-checkpoint-heading`}
            className="space-y-2"
          >
            {checkpointData.options.map((opt) => {
              const isSelected = selectedCheckpointId === opt.id;
              const isCorrectChoice = isSelected && opt.isCorrect;
              const isWrongChoice = isSelected && !opt.isCorrect;

              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    onUserEngage?.();
                    if (selectedCheckpointId === opt.id) return;
                    setSelectedCheckpointId(opt.id);
                    playLearningFeedback(opt.isCorrect ? 'correct' : 'incorrect');
                  }}
                  className={[
                    'w-full min-h-[44px] px-3.5 py-2.5 rounded-[14px] border-[1.5px] text-left text-[13px] font-bold flex items-center justify-between gap-2.5 transition-colors cursor-pointer',
                    'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                    isCorrectChoice
                      ? 'bg-[#D7F5EE] border-[#1FA89B] text-[#0B4A41]'
                      : isWrongChoice
                        ? 'bg-[#FDECE8] border-[#D96857] text-[#7F1D1D]'
                        : 'bg-[#FDFCF9] border-[#D8D1BE] text-[#1B2559] hover:bg-[#F5F2EA]',
                  ].join(' ')}
                >
                  <span className="min-w-0 flex-1 leading-snug">{opt.label}</span>
                  {isCorrectChoice ? (
                    <span
                      aria-hidden="true"
                      className="w-5 h-5 rounded-full bg-[#0F7F76] text-white inline-flex items-center justify-center shrink-0"
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                  ) : isWrongChoice ? (
                    <AlertTriangle
                      className="w-4 h-4 text-[#9E2A25] shrink-0"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          {selectedCheckpointOption ? (
            <div
              aria-live="polite"
              className={[
                'rounded-[12px] border px-3 py-2.5 text-[12.5px] leading-snug flex items-start gap-2',
                selectedCheckpointOption.isCorrect
                  ? 'bg-[#E2F5EE] border-[#9ADFD0] text-[#0B4A41]'
                  : 'bg-[#FDECE8] border-[#F0C8C0] text-[#7F1D1D]',
              ].join(' ')}
            >
              {selectedCheckpointOption.isCorrect ? (
                <CheckCircle2
                  className="w-4 h-4 text-[#0F7F76] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              ) : (
                <AlertTriangle
                  className="w-4 h-4 text-[#9E2A25] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              )}
              <p>
                <strong className="font-extrabold">
                  {selectedCheckpointOption.isCorrect ? 'Spot on: ' : 'Try again: '}
                </strong>
                <span>{selectedCheckpointOption.explanation}</span>
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* D. Remember Callout */}
      {rememberText ? (
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
      ) : null}

      {/* E. Independent Collapsible Explanations (collapsed by default) */}
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
                    {WHY_WORKS_SUBTITLES[stepId] ?? 'The grammar logic behind this pattern.'}
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

        {/* Row 2: Common mistake to avoid (when present) */}
        {clausePatternData?.commonMistake ? (
          <div className="rounded-[20px] bg-[#FFF8F6] border border-[#F0C8C0] overflow-hidden">
            <button
              id={mistakeButtonId}
              type="button"
              onClick={() => {
                onUserEngage?.();
                setMistakeExpanded((prev) => !prev);
              }}
              aria-expanded={mistakeExpanded}
              aria-controls={mistakePanelId}
              className="w-full min-h-[56px] px-3.5 py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-[#FDECE8]/60 transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#1B2559]"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-[11px] bg-[#FDECE8] text-[#9E2A25] inline-flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-extrabold text-[#1B2559] leading-tight">
                    Common mistake to avoid
                  </span>
                  <span className="block text-[12px] font-medium text-[#7F1D1D]/85 leading-tight mt-0.5">
                    Spot and fix the usual trap.
                  </span>
                </span>
              </span>

              <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#9E2A25] shrink-0 whitespace-nowrap">
                <span>{mistakeExpanded ? 'Hide' : 'Show'}</span>
                <ChevronDown
                  className={[
                    'w-4 h-4 transition-transform',
                    prefersReducedMotion ? 'duration-0' : 'duration-300',
                    mistakeExpanded ? 'rotate-180' : 'rotate-0',
                  ].join(' ')}
                  aria-hidden="true"
                />
              </span>
            </button>

            <div
              id={mistakePanelId}
              ref={mistakeContentRef}
              role="region"
              aria-labelledby={mistakeButtonId}
              aria-hidden={!mistakeExpanded}
              className={[
                'grid',
                prefersReducedMotion
                  ? ''
                  : 'transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              ].join(' ')}
              style={{
                gridTemplateRows: mistakeExpanded ? '1fr' : '0fr',
              }}
            >
              <div className="overflow-hidden min-h-0">
                <div className="px-3.5 pb-3.5 pt-2.5 border-t border-[#F4D9D3] space-y-2 text-[13px] leading-snug">
                  <p className="text-[#9E2A25] font-semibold">
                    <strong className="font-extrabold">Watch out: </strong>
                    <span className="line-through">
                      {clausePatternData.commonMistake.incorrectText}
                    </span>
                  </p>
                  <p className="text-[#0B4A41] font-semibold flex items-start gap-1.5">
                    <CheckCircle2
                      className="w-4 h-4 text-[#0F7F76] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-extrabold">Better: </strong>
                      {clausePatternData.commonMistake.correctText}
                    </span>
                  </p>
                  <p className="text-[#333333] leading-relaxed">
                    {clausePatternData.commonMistake.whyWrong}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Row 3: Grammar note (when boardNote is present) */}
        {clausePatternData?.boardNote && boardNoteInfo ? (
          <div className="rounded-[20px] bg-[#F4F0FD] border border-[#CBBDF3] overflow-hidden">
            <button
              id={boardNoteButtonId}
              type="button"
              onClick={() => {
                onUserEngage?.();
                setBoardNoteExpanded((prev) => !prev);
              }}
              aria-expanded={boardNoteExpanded}
              aria-controls={boardNotePanelId}
              className="w-full min-h-[56px] px-3.5 py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-[#ECE6FB] transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#1B2559]"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-[11px] bg-[#ECE6FB] text-[#5B43C2] inline-flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-extrabold text-[#1B2559] leading-tight">
                    {boardNoteInfo.title}
                  </span>
                  <span className="block text-[12px] font-medium text-[#4B5C8A] leading-tight mt-0.5">
                    {boardNoteInfo.subtitle}
                  </span>
                </span>
              </span>

              <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#5B43C2] shrink-0 whitespace-nowrap">
                <span>{boardNoteExpanded ? 'Hide' : 'Show'}</span>
                <ChevronDown
                  className={[
                    'w-4 h-4 transition-transform',
                    prefersReducedMotion ? 'duration-0' : 'duration-300',
                    boardNoteExpanded ? 'rotate-180' : 'rotate-0',
                  ].join(' ')}
                  aria-hidden="true"
                />
              </span>
            </button>

            <div
              id={boardNotePanelId}
              ref={boardNoteContentRef}
              role="region"
              aria-labelledby={boardNoteButtonId}
              aria-hidden={!boardNoteExpanded}
              className={[
                'grid',
                prefersReducedMotion
                  ? ''
                  : 'transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              ].join(' ')}
              style={{
                gridTemplateRows: boardNoteExpanded ? '1fr' : '0fr',
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
