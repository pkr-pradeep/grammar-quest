/**
 * ============================================================================
 * GRAMMAR QUEST — SENTENCE VISUALIZER (ZONES C & D)
 * ============================================================================
 * Interactive sentence stage driving distinct visual transitions for every
 * consecutive teaching step, supporting clickable word tokens across both the
 * starter sentence and the comparison sentence, and displaying tapped word
 * details inside a compact WordInspectorPopup dialog instead of bloating page height.
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Columns2, Layers, MessageSquare, RotateCcw, Sparkles } from 'lucide-react';
import type {
  GuidedExploreChallenge,
  RelationshipType,
  SentenceDefinition,
  SentenceToken,
  StepVisualCallout,
  StepVisualMode,
  WordGroupRole,
  WordRelationship,
} from '../../../schemas/grammarEngine.schema';
import { Button } from '../../../components';
import { WordToken } from './WordToken';
import { WordGroup } from './WordGroup';
import { GrammarHighlight } from './GrammarHighlight';
import { PracticeFeedback } from './PracticeFeedback';
import { WordInspectorPopup } from './WordInspectorPopup';
import {
  RelationshipConnectorOverlay,
  RelationshipList,
} from './RelationshipConnector';

export interface SelectedTokenState {
  sentenceId: string;
  sentenceLabel: string;
  token: SentenceToken;
}

export interface SentenceVisualizerProps {
  stepId: string;
  visualMode?: StepVisualMode;
  visualCallout?: StepVisualCallout;
  guidedChallenge?: GuidedExploreChallenge;
  sentence: SentenceDefinition;
  comparisonSentence?: SentenceDefinition | null;
  allowedRelationshipTypes?: RelationshipType[];
  selectedTokenInfo: SelectedTokenState | null;
  highlightedGroupRole: WordGroupRole | null;
  focusTokenIds?: string[];
  focusRelationshipIds?: string[];
  selectedRelationshipId: string | null;
  showStructureSplit: boolean;
  showCompare: boolean;
  showRelationships?: boolean;
  allowFreeExplore?: boolean;
  isPaused?: boolean;
  animationSeed?: number;
  onSelectToken: (token: SentenceToken, sentenceId: string, sentenceLabel: string) => void;
  onCloseTokenPopup: () => void;
  onSelectGroup: (role: WordGroupRole | null) => void;
  onToggleStructureSplit: () => void;
  onToggleCompare?: () => void;
  onSelectRelationship: (relationship: WordRelationship | null) => void;
}

const EMPTY_STRING_LIST: string[] = [];

const WORD_LAB_PREVIEW_PILLS = [
  'A. Identify Subject & Predicate',
  'B. Sort Cards',
  'C. Build Sentence',
  'D. Swap Word',
  'E. Complete Notice',
  'F. Fix Fragment',
];

function sameTokenIds(a: string[], b: string[]): boolean {
  const sA = new Set(a);
  const sB = new Set(b);
  return sA.size === sB.size && [...sB].every((id) => sA.has(id));
}

export const SentenceVisualizer: React.FC<SentenceVisualizerProps> = ({
  stepId,
  visualMode = 'plain-sentence',
  visualCallout,
  guidedChallenge,
  sentence,
  comparisonSentence = null,
  allowedRelationshipTypes,
  selectedTokenInfo,
  highlightedGroupRole,
  focusTokenIds = EMPTY_STRING_LIST,
  focusRelationshipIds = EMPTY_STRING_LIST,
  selectedRelationshipId,
  showStructureSplit,
  showCompare,
  showRelationships = true,
  allowFreeExplore = false,
  isPaused = false,
  animationSeed = 0,
  onSelectToken,
  onCloseTokenPopup,
  onSelectGroup,
  onToggleStructureSplit,
  onToggleCompare,
  onSelectRelationship,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tokenRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [guidedPhase, setGuidedPhase] = useState<'subject' | 'predicate' | 'unlocked'>('subject');
  const [guidedSubjIds, setGuidedSubjIds] = useState<string[]>([]);
  const [guidedPredIds, setGuidedPredIds] = useState<string[]>([]);
  const [guidedFeedback, setGuidedFeedback] = useState<{
    status: 'correct' | 'try-again';
    text: string;
  } | null>(null);

  useEffect(() => {
    setGuidedPhase('subject');
    setGuidedSubjIds([]);
    setGuidedPredIds([]);
    setGuidedFeedback(null);
  }, [stepId, sentence.id]);

  const activeGroup = highlightedGroupRole
    ? sentence.groups.find((g) => g.role === highlightedGroupRole) ?? null
    : null;
  const activeRelationship = selectedRelationshipId
    ? sentence.relationships.find((r) => r.id === selectedRelationshipId) ?? null
    : null;

  const subjectTokens = sentence.tokens.filter((t) => t.groupRole === 'subject');
  const predicateTokens = sentence.tokens.filter((t) => t.groupRole === 'predicate');
  const subjectGroup = sentence.groups.find((g) => g.role === 'subject');
  const predicateGroup = sentence.groups.find((g) => g.role === 'predicate');

  const highlightedByRelationship = new Set<string>();
  const activeRelIds =
    focusRelationshipIds.length > 0
      ? focusRelationshipIds
      : selectedRelationshipId
        ? [selectedRelationshipId]
        : [];
  for (const rel of sentence.relationships) {
    if (activeRelIds.includes(rel.id)) {
      rel.fromTokenIds.forEach((id) => highlightedByRelationship.add(id));
      rel.toTokenIds.forEach((id) => highlightedByRelationship.add(id));
    }
  }

  const showArcPadding = activeRelIds.length > 0;
  const isHeadwordSpotlight = visualMode === 'headword-spotlight';
  const showGroupBracket =
    visualMode === 'group-bracket' || visualMode === 'meaning-callout';
  const bracketRole: WordGroupRole | null = showGroupBracket
    ? highlightedGroupRole ?? visualCallout?.targetGroupRole ?? 'subject'
    : null;

  const selectedTokenIdInPrimary =
    selectedTokenInfo?.sentenceId === sentence.id ? selectedTokenInfo.token.id : null;
  const selectedTokenIdInCompare =
    comparisonSentence && selectedTokenInfo?.sentenceId === comparisonSentence.id
      ? selectedTokenInfo.token.id
      : null;

  const isGuidedLocked =
    visualMode === 'guided-explore' && Boolean(guidedChallenge) && guidedPhase !== 'unlocked';

  const handleTokenTap = (tok: SentenceToken) => {
    if (isGuidedLocked && guidedChallenge) {
      setGuidedFeedback(null);
      if (guidedPhase === 'subject') {
        setGuidedSubjIds((prev) =>
          prev.includes(tok.id) ? prev.filter((id) => id !== tok.id) : [...prev, tok.id],
        );
      } else if (!guidedChallenge.subjectTokenIds.includes(tok.id)) {
        setGuidedPredIds((prev) =>
          prev.includes(tok.id) ? prev.filter((id) => id !== tok.id) : [...prev, tok.id],
        );
      }
      return;
    }

    onSelectToken(tok, sentence.id, sentence.title);
  };

  const handleCheckGuided = () => {
    if (!guidedChallenge) return;
    if (guidedPhase === 'subject') {
      if (sameTokenIds(guidedSubjIds, guidedChallenge.subjectTokenIds)) {
        setGuidedPhase('predicate');
        setGuidedFeedback({
          status: 'correct',
          text: 'Yes! You found the Subject. Now select the Predicate.',
        });
      } else {
        setGuidedFeedback({
          status: 'try-again',
          text: guidedChallenge.subjectFeedback,
        });
      }
      return;
    }

    if (guidedPhase === 'predicate') {
      if (sameTokenIds(guidedPredIds, guidedChallenge.predicateTokenIds)) {
        setGuidedPhase('unlocked');
        setGuidedFeedback({
          status: 'correct',
          text: guidedChallenge.unlockedExplanation,
        });
      } else {
        setGuidedFeedback({
          status: 'try-again',
          text: guidedChallenge.predicateFeedback,
        });
      }
    }
  };

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* Zone C: Interactive Sentence Workspace */}
      <section
        aria-label="Interactive sentence workspace"
        className="rounded-[16px] bg-white border border-[#E5E2D9] p-3 sm:p-4 space-y-3"
      >
        {/* Top Row: Title + Compact Quick Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#263A70]">
              {sentence.title}
            </span>
            <span className="text-[11px] text-[#4B5C8A]">
              {isGuidedLocked ? '· Guided challenge' : '· Tap any word'}
            </span>
          </div>

          {!isGuidedLocked ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onSelectGroup(highlightedGroupRole === 'subject' ? null : 'subject')
                }
                aria-pressed={highlightedGroupRole === 'subject'}
                className={[
                  'inline-flex items-center gap-1 min-h-[34px] px-2.5 py-1 rounded-[10px] border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                  highlightedGroupRole === 'subject'
                    ? 'bg-[#FFC64B] border-[#EAB030] text-[#263A70]'
                    : 'bg-[#FDFCF9] border-[#CFC9BA] text-[#263A70] hover:bg-[#FFF4D6]',
                ].join(' ')}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Subject</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onSelectGroup(highlightedGroupRole === 'predicate' ? null : 'predicate')
                }
                aria-pressed={highlightedGroupRole === 'predicate'}
                className={[
                  'inline-flex items-center gap-1 min-h-[34px] px-2.5 py-1 rounded-[10px] border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                  highlightedGroupRole === 'predicate'
                    ? 'bg-[#8DECE0] border-[#65D8CA] text-[#263A70]'
                    : 'bg-[#FDFCF9] border-[#CFC9BA] text-[#263A70] hover:bg-[#D9FAF5]',
                ].join(' ')}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Predicate</span>
              </button>

              {(allowFreeExplore || showStructureSplit) ? (
                <button
                  type="button"
                  onClick={onToggleStructureSplit}
                  aria-pressed={showStructureSplit}
                  className={[
                    'inline-flex items-center gap-1 min-h-[34px] px-2.5 py-1 rounded-[10px] border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                    showStructureSplit
                      ? 'bg-[#263A70] border-[#263A70] text-white'
                      : 'bg-[#FDFCF9] border-[#CFC9BA] text-[#263A70] hover:bg-[#F5F2EA]',
                  ].join(' ')}
                >
                  <span>Structure</span>
                </button>
              ) : null}

              {comparisonSentence && onToggleCompare ? (
                <button
                  type="button"
                  onClick={onToggleCompare}
                  aria-pressed={showCompare}
                  className={[
                    'inline-flex items-center gap-1 min-h-[34px] px-2.5 py-1 rounded-[10px] border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                    showCompare
                      ? 'bg-[#FFF1D5] border-[#F59B19] text-[#263A70]'
                      : 'bg-[#FDFCF9] border-[#CFC9BA] text-[#263A70] hover:bg-[#FFF9EC]',
                  ].join(' ')}
                >
                  <Columns2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Compare</span>
                </button>
              ) : null}

              {(selectedTokenInfo || highlightedGroupRole || selectedRelationshipId) ? (
                <button
                  type="button"
                  onClick={() => {
                    onCloseTokenPopup();
                    onSelectGroup(null);
                    onSelectRelationship(null);
                  }}
                  aria-label="Reset selection"
                  className="inline-flex items-center gap-1 min-h-[34px] px-2 py-1 rounded-[10px] text-xs font-medium text-[#4B5C8A] hover:text-[#263A70] cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Guided Explore Prompt Banner (before explanation is unlocked) */}
        {isGuidedLocked && guidedChallenge ? (
          <div
            className={[
              'rounded-[12px] border px-3 py-2 text-xs font-semibold flex items-center gap-2',
              guidedPhase === 'subject'
                ? 'bg-[#FFF4D6] border-[#F59B19] text-[#263A70]'
                : 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]',
            ].join(' ')}
          >
            {guidedPhase === 'subject' ? (
              <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {guidedPhase === 'subject'
                ? guidedChallenge.promptSubject
                : guidedChallenge.promptPredicate}
            </span>
          </div>
        ) : null}

        {/* Interactive Sentence Tokens + Relationship SVG Overlay */}
        <div
          ref={stageRef}
          className={[
            'relative pb-1',
            showArcPadding && !isGuidedLocked ? 'pt-9' : 'pt-1.5',
          ].join(' ')}
        >
          <div
            key={`${sentence.id}-${animationSeed}`}
            className="flex flex-wrap items-center gap-1.5 sm:gap-2"
          >
            {sentence.tokens.map((token, idx) => {
              const isSelected = isGuidedLocked
                ? (guidedPhase === 'subject' && guidedSubjIds.includes(token.id)) ||
                  (guidedPhase === 'predicate' && guidedPredIds.includes(token.id))
                : selectedTokenIdInPrimary === token.id;

              const guidedRoleHighlight: WordGroupRole | null =
                visualMode === 'guided-explore' && guidedChallenge
                  ? guidedPhase === 'predicate' && guidedChallenge.subjectTokenIds.includes(token.id)
                    ? 'subject'
                    : guidedPhase === 'unlocked'
                      ? token.groupRole
                      : null
                  : highlightedGroupRole;

              const isStepFocus = !isGuidedLocked && focusTokenIds.includes(token.id);
              const isFocused =
                !isGuidedLocked && (isStepFocus || highlightedByRelationship.has(token.id));
              const isSpotlight = isHeadwordSpotlight && isStepFocus;
              const isDimmed = isHeadwordSpotlight && !isStepFocus && !isSelected;

              return (
                <WordToken
                  key={token.id}
                  token={token}
                  index={idx}
                  isSelected={isSelected}
                  isHighlighted={isFocused}
                  isSpotlightHead={isSpotlight}
                  isDimmed={isDimmed}
                  highlightedGroupRole={guidedRoleHighlight}
                  showCategoryBadge={!isGuidedLocked}
                  showHeadWordMarker={!isGuidedLocked && (showStructureSplit || isStepFocus)}
                  animateEntrance
                  isPaused={isPaused}
                  onSelect={handleTokenTap}
                  buttonRef={(el) => {
                    tokenRefs.current[token.id] = el;
                  }}
                />
              );
            })}
          </div>

          {!isGuidedLocked ? (
            <RelationshipConnectorOverlay
              stageRef={stageRef}
              tokenRefs={tokenRefs}
              relationships={sentence.relationships}
              activeRelationshipIds={focusRelationshipIds}
              allowedTypes={allowedRelationshipTypes}
              selectedRelationshipId={selectedRelationshipId}
              isPaused={isPaused}
              animationSeed={animationSeed}
            />
          ) : null}
        </div>

        {/* Guided Explore Check Button & Immediate Feedback */}
        {isGuidedLocked && guidedChallenge ? (
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleCheckGuided}
                disabled={
                  guidedPhase === 'subject'
                    ? guidedSubjIds.length === 0
                    : guidedPredIds.length === 0
                }
              >
                {guidedPhase === 'subject' ? 'Check Subject' : 'Reveal Structure'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setGuidedPhase('subject');
                  setGuidedSubjIds([]);
                  setGuidedPredIds([]);
                  setGuidedFeedback(null);
                }}
                disabled={guidedSubjIds.length === 0 && guidedPredIds.length === 0}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset
              </Button>
            </div>

            {guidedFeedback ? (
              <PracticeFeedback
                status={guidedFeedback.status}
                title={
                  guidedFeedback.status === 'correct'
                    ? 'Good spot!'
                    : 'Try another look'
                }
                message={guidedFeedback.text}
              />
            ) : null}
          </div>
        ) : null}

        {/* Unlocked Full Explanation for Guided Explore */}
        {visualMode === 'guided-explore' &&
        guidedChallenge &&
        guidedPhase === 'unlocked' ? (
          <div className="space-y-3">
            <PracticeFeedback
              status="correct"
              title="Both parts discovered!"
              message={guidedChallenge.unlockedExplanation}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <WordGroup
                role="subject"
                tokens={subjectTokens}
                questionPrompt={subjectGroup?.questionPrompt}
                explanation={subjectGroup?.plainExplanation}
                headWord={sentence.structureSummary.subjectHeadWord}
              />
              <WordGroup
                role="predicate"
                tokens={predicateTokens}
                questionPrompt={predicateGroup?.questionPrompt}
                explanation={predicateGroup?.plainExplanation}
                headWord={sentence.structureSummary.predicateHeadWord}
              />
            </div>
          </div>
        ) : null}

        {/* Distinct Step Visual Cues */}

        {/* Visual Mode: split-blueprint (Step 2) */}
        {visualMode === 'split-blueprint' && visualCallout ? (
          <motion.div
            key={`${stepId}-${animationSeed}`}
            data-testid="step-split-blueprint"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-2 gap-2 pt-1"
          >
            <div className="rounded-[12px] border-2 border-dashed border-[#F59B19] bg-[#FFF9EC] px-2.5 py-2 text-center">
              <p className="text-[11px] font-semibold text-[#A15C00]">Part 1 · Subject</p>
              <p className="text-xs font-medium text-[#263A70]">Who / What?</p>
            </div>
            <div className="rounded-[12px] border-2 border-dashed border-[#1FA89A] bg-[#F2FCFA] px-2.5 py-2 text-center">
              <p className="text-[11px] font-semibold text-[#137268]">Part 2 · Predicate</p>
              <p className="text-xs font-medium text-[#263A70]">What is said?</p>
            </div>
          </motion.div>
        ) : null}

        {/* Visual Mode: group-bracket (Discover Subject / Discover Predicate) */}
        {visualMode === 'group-bracket' && bracketRole ? (
          <motion.div
            key={`${stepId}-${animationSeed}`}
            data-testid="step-group-bracket"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={[
              'rounded-[12px] border-2 px-3 py-2 flex flex-wrap items-center justify-between gap-2',
              bracketRole === 'subject'
                ? 'border-[#F59B19] bg-[#FFF4D6]'
                : 'border-[#1FA89A] bg-[#D9FAF5]',
            ].join(' ')}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={[
                  'px-2 py-0.5 rounded-[7px] text-[11px] font-semibold whitespace-nowrap',
                  bracketRole === 'subject'
                    ? 'bg-[#FFC64B] text-[#263A70]'
                    : 'bg-[#8DECE0] text-[#263A70]',
                ].join(' ')}
              >
                {bracketRole === 'subject' ? 'Subject Group' : 'Predicate Group'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#263A70]">
                “
                {(bracketRole === 'subject' ? subjectTokens : predicateTokens)
                  .map((t) => t.text)
                  .join(' ')}
                ”
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#4B5C8A]">
              {(bracketRole === 'subject' ? subjectTokens : predicateTokens).length} words together
            </span>
          </motion.div>
        ) : null}

        {/* Visual Mode: meaning-callout or headword-spotlight */}
        {(visualMode === 'meaning-callout' || visualMode === 'headword-spotlight') &&
        visualCallout ? (
          <motion.div
            key={`${stepId}-${animationSeed}`}
            data-testid="step-visual-callout"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative pt-2"
          >
            <svg
              aria-hidden="true"
              width="28"
              height="14"
              viewBox="0 0 28 14"
              className={[
                'block',
                visualCallout.targetGroupRole === 'predicate' ? 'ml-auto mr-12' : 'ml-8',
              ].join(' ')}
            >
              <path
                d="M14 0 L24 14 L4 14 Z"
                fill={visualCallout.targetGroupRole === 'predicate' ? '#D9FAF5' : '#FFF1D5'}
                stroke={visualCallout.targetGroupRole === 'predicate' ? '#1FA89A' : '#F59B19'}
                strokeWidth="1.5"
              />
            </svg>

            <div
              className={[
                'rounded-[12px] border-2 px-3 py-2.5 space-y-1',
                visualCallout.targetGroupRole === 'predicate'
                  ? 'bg-[#D9FAF5] border-[#1FA89A]'
                  : 'bg-[#FFF1D5] border-[#F59B19]',
              ].join(' ')}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {visualCallout.question ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[7px] bg-[#263A70] text-white text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>{visualCallout.question}</span>
                  </span>
                ) : null}
                <span className="text-xs font-semibold text-[#263A70]">
                  {visualCallout.label}
                </span>
              </div>
              <p className="text-xs text-[#333333] leading-snug">{visualCallout.detail}</p>
            </div>
          </motion.div>
        ) : null}

        {/* Progressive Structure Reveal + Animated Noticeboard Strip (Stage 6 & toggled) */}
        {showStructureSplit ? (
          <div className="space-y-2.5 pt-0.5">
            {visualMode === 'structure-split' ? (
              <div
                key={`board-${stepId}-${animationSeed}`}
                className="rounded-[14px] border-2 border-[#C97E39] bg-[#F9E9C6] px-3 py-2.5 space-y-1.5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A4D00]">
                  Pinned on the school noticeboard
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <motion.span
                    initial={prefersReducedMotion || isPaused ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[9px] bg-[#FFC64B] border border-[#263A70] text-xs sm:text-sm font-semibold text-[#263A70]"
                  >
                    <span>{sentence.structureSummary.subjectText}</span>
                  </motion.span>
                  <span className="text-xs font-bold text-[#263A70]" aria-hidden="true">
                    +
                  </span>
                  <motion.span
                    initial={prefersReducedMotion || isPaused ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[9px] bg-[#8DECE0] border border-[#263A70] text-xs sm:text-sm font-semibold text-[#263A70]"
                  >
                    <span>{sentence.structureSummary.predicateText}.</span>
                  </motion.span>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <WordGroup
                role="subject"
                tokens={subjectTokens}
                questionPrompt={subjectGroup?.questionPrompt}
                explanation={subjectGroup?.plainExplanation}
                headWord={sentence.structureSummary.subjectHeadWord}
                isActive={highlightedGroupRole === 'subject'}
                onSelectGroup={(role) =>
                  onSelectGroup(highlightedGroupRole === role ? null : role)
                }
              />
              <WordGroup
                role="predicate"
                tokens={predicateTokens}
                questionPrompt={predicateGroup?.questionPrompt}
                explanation={predicateGroup?.plainExplanation}
                headWord={sentence.structureSummary.predicateHeadWord}
                isActive={highlightedGroupRole === 'predicate'}
                onSelectGroup={(role) =>
                  onSelectGroup(highlightedGroupRole === role ? null : role)
                }
              />
            </div>
          </div>
        ) : null}

        {/* Interactive Relationships */}
        {!isGuidedLocked && showRelationships && sentence.relationships.length > 0 ? (
          <RelationshipList
            relationships={sentence.relationships}
            tokens={sentence.tokens}
            allowedTypes={allowedRelationshipTypes}
            selectedRelationshipId={selectedRelationshipId}
            onSelectRelationship={onSelectRelationship}
          />
        ) : null}

        {/* Visual Mode: practice-ready */}
        {visualMode === 'practice-ready' ? (
          <div
            data-testid="step-practice-preview"
            className="rounded-[12px] bg-[#F8F6F0] border border-[#E5E2D9] p-2.5 space-y-1.5"
          >
            <p className="text-[11px] font-semibold text-[#263A70]">
              Guided Practice Activities Next:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {WORD_LAB_PREVIEW_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="px-2 py-0.5 rounded-[7px] bg-white border border-[#E5E2D9] text-[11px] font-medium text-[#263A70]"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Two-Sentence Comparison Panel (Compact with clickable WordTokens!) */}
      {showCompare && comparisonSentence ? (
        <section
          aria-label="Comparison sentence"
          className="rounded-[16px] bg-[#FFFDF8] border border-[#F2DFB6] p-3 sm:p-4 space-y-2.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-xs font-semibold text-[#A15C00]">
              Compare · {comparisonSentence.contextTag}
            </span>
            <span className="text-[11px] text-[#4B5C8A]">
              Tap any word to inspect
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {comparisonSentence.tokens.map((token, idx) => (
              <WordToken
                key={token.id}
                token={token}
                index={idx}
                isSelected={selectedTokenIdInCompare === token.id}
                highlightedGroupRole={highlightedGroupRole}
                showCategoryBadge
                showHeadWordMarker
                animateEntrance={false}
                isPaused={isPaused}
                onSelect={(tok) =>
                  onSelectToken(
                    tok,
                    comparisonSentence.id,
                    `Compare · ${comparisonSentence.contextTag}`,
                  )
                }
              />
            ))}
          </div>

          {/* Slim Subject + Predicate summary pills (keeps page compact) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            <div className="rounded-[10px] bg-[#FFF4D6] border border-[#F2DFB6] px-2.5 py-1.5 flex items-center justify-between gap-2">
              <span className="font-semibold text-[#A15C00]">Subject:</span>
              <span className="font-medium text-[#263A70] truncate">
                {comparisonSentence.structureSummary.subjectText}
              </span>
            </div>
            <div className="rounded-[10px] bg-[#D9FAF5] border border-[#A8E8DF] px-2.5 py-1.5 flex items-center justify-between gap-2">
              <span className="font-semibold text-[#137268]">Predicate:</span>
              <span className="font-medium text-[#263A70] truncate">
                {comparisonSentence.structureSummary.predicateText}
              </span>
            </div>
          </div>
        </section>
      ) : null}

      {/* Zone D: Compact Contextual Cue (Group/Relationship highlight or lightweight prompt) */}
      <section aria-label="Teaching feedback">
        {activeRelationship ? (
          <GrammarHighlight
            label={activeRelationship.label}
            detail={activeRelationship.explanation}
          />
        ) : activeGroup && visualMode !== 'meaning-callout' ? (
          <GrammarHighlight
            groupRole={activeGroup.role}
            label={`${activeGroup.label} (${activeGroup.questionPrompt})`}
            detail={activeGroup.plainExplanation}
          />
        ) : (
          <div className="rounded-[12px] bg-[#F8F6F0] border border-[#E5E2D9] px-3 py-2 text-xs text-[#4B5C8A]">
            Tap any word above to see its role in a popup.
          </div>
        )}
      </section>

      {/* Word Inspector Popup Modal */}
      <WordInspectorPopup
        token={selectedTokenInfo?.token ?? null}
        sentenceLabel={selectedTokenInfo?.sentenceLabel}
        onClose={onCloseTokenPopup}
      />
    </div>
  );
};
