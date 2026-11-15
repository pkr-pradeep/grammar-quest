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
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Link2,
  ListTree,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import type {
  AgreementLockVisualData,
  GuidedExploreChallenge,
  RelationshipType,
  SentenceDefinition,
  SentenceToken,
  StepVisualCallout,
  StepVisualMode,
  TimelinePhase,
  TimelineVisualData,
  WordGroupRole,
  WordRelationship,
} from '../../../schemas/grammarEngine.schema';
import { Button } from '../../../components';
import { WordToken } from './WordToken';
import { WordGroup } from './WordGroup';
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
  timelineData?: TimelineVisualData;
  agreementData?: AgreementLockVisualData;
  dimmedTokenIds?: string[];
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

const TIMELINE_PHASES: { id: TimelinePhase; label: string; sub: string }[] = [
  { id: 'past', label: 'Past', sub: 'Before now' },
  { id: 'present', label: 'Present', sub: 'Now / Habit' },
  { id: 'future', label: 'Future', sub: 'After now' },
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
  timelineData,
  agreementData,
  dimmedTokenIds = EMPTY_STRING_LIST,
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
  const [linksExpanded, setLinksExpanded] = useState(false);
  const [showBoardModelNote, setShowBoardModelNote] = useState(false);
  const [showContrastCard, setShowContrastCard] = useState(false);

  useEffect(() => {
    setGuidedPhase('subject');
    setGuidedSubjIds([]);
    setGuidedPredIds([]);
    setGuidedFeedback(null);
    setLinksExpanded(false);
    setShowBoardModelNote(false);
    setShowContrastCard(false);
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

  const selectedTokenIdInPrimary =
    selectedTokenInfo?.sentenceId === sentence.id ? selectedTokenInfo.token.id : null;
  const linkedTokenIdSet = new Set(
    selectedTokenInfo?.sentenceId === sentence.id
      ? (selectedTokenInfo.token.linkedTokenIds ?? [])
      : [],
  );

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

  const availableRelationships = sentence.relationships.filter(
    (r) => r.activeInLesson && (!allowedRelationshipTypes || allowedRelationshipTypes.includes(r.type)),
  );

  // Build compact Result Card data strictly from existing step, concept-chip, and sentence data
  const resultCardConfig = (() => {
    if (activeRelationship) {
      const linkedFrom = new Set(activeRelationship.fromTokenIds);
      const linkedTo = new Set(activeRelationship.toTokenIds);
      return {
        conceptLabel: `WORD LINK · ${activeRelationship.label}`,
        targetSentence: sentence,
        sentenceLabel: sentence.title,
        explanation: activeRelationship.explanation,
        highlightMode: 'relationship' as const,
        linkedFrom,
        linkedTo,
        modifierIds: EMPTY_STRING_LIST,
      };
    }

    if (showCompare && comparisonSentence) {
      const prepRel = comparisonSentence.relationships.find(
        (r) => r.type === 'preposition-relation',
      );
      return {
        conceptLabel: 'COMPARE',
        targetSentence: comparisonSentence,
        sentenceLabel: `Compare · ${comparisonSentence.contextTag}`,
        explanation:
          comparisonSentence.note ??
          `${comparisonSentence.structureSummary.subjectText} (Subject) + ${comparisonSentence.structureSummary.predicateText} (Predicate).`,
        highlightMode: 'both' as const,
        linkedFrom: new Set<string>(),
        linkedTo: new Set<string>(),
        modifierIds: prepRel?.fromTokenIds ?? EMPTY_STRING_LIST,
      };
    }

    if (showStructureSplit) {
      return {
        conceptLabel: 'STRUCTURE',
        targetSentence: sentence,
        sentenceLabel: sentence.title,
        explanation:
          sentence.structureSummary.patternNote ??
          `'${sentence.structureSummary.subjectText}' (Subject) + '${sentence.structureSummary.predicateText}' (Predicate).`,
        highlightMode: 'both' as const,
        linkedFrom: new Set<string>(),
        linkedTo: new Set<string>(),
        modifierIds: EMPTY_STRING_LIST,
      };
    }

    if (highlightedGroupRole === 'subject') {
      return {
        conceptLabel: 'SUBJECT',
        targetSentence: sentence,
        sentenceLabel: sentence.title,
        explanation:
          visualMode === 'meaning-callout' && visualCallout?.targetGroupRole === 'subject'
            ? visualCallout.detail
            : subjectGroup?.plainExplanation ??
              `'${sentence.structureSummary.subjectText}' names who or what the sentence is about.`,
        highlightMode: 'subject' as const,
        linkedFrom: new Set<string>(),
        linkedTo: new Set<string>(),
        modifierIds: EMPTY_STRING_LIST,
      };
    }

    if (highlightedGroupRole === 'predicate') {
      return {
        conceptLabel: 'PREDICATE',
        targetSentence: sentence,
        sentenceLabel: sentence.title,
        explanation:
          visualMode === 'meaning-callout' && visualCallout?.targetGroupRole === 'predicate'
            ? visualCallout.detail
            : predicateGroup?.plainExplanation ??
              `'${sentence.structureSummary.predicateText}' tells what is said about the Subject.`,
        highlightMode: 'predicate' as const,
        linkedFrom: new Set<string>(),
        linkedTo: new Set<string>(),
        modifierIds: EMPTY_STRING_LIST,
      };
    }

    if (timelineData) {
      return {
        conceptLabel: `TIME & VERB FORM · ${timelineData.timeLabel.toUpperCase()}`,
        targetSentence: sentence,
        sentenceLabel: sentence.title,
        explanation: timelineData.grammarNote,
        highlightMode: 'none' as const,
        linkedFrom: new Set<string>(),
        linkedTo: new Set<string>(),
        modifierIds: EMPTY_STRING_LIST,
      };
    }

    if (agreementData) {
      return {
        conceptLabel: 'SUBJECT–VERB LOCK',
        targetSentence: sentence,
        sentenceLabel: sentence.title,
        explanation: agreementData.ruleSummary,
        highlightMode: 'none' as const,
        linkedFrom: new Set<string>(),
        linkedTo: new Set<string>(),
        modifierIds: EMPTY_STRING_LIST,
      };
    }

    return {
      conceptLabel: 'COMPLETE SENTENCE',
      targetSentence: sentence,
      sentenceLabel: sentence.title,
      explanation:
        visualCallout?.detail ??
        sentence.note ??
        'Tap any word above, or select Subject, Predicate, or Structure.',
      highlightMode: 'none' as const,
      linkedFrom: new Set<string>(),
      linkedTo: new Set<string>(),
      modifierIds: EMPTY_STRING_LIST,
    };
  })();

  const modifierIdSet = new Set(resultCardConfig.modifierIds);

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* Zone C: Interactive Starter Sentence Workspace */}
      <section
        aria-label="Interactive sentence workspace"
        className="rounded-[18px] bg-white border border-[#E5E2D9] p-3.5 sm:p-4 space-y-3 shadow-[var(--gq-shadow-card)]"
      >
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[15px] sm:text-base font-bold text-[#1B2559]">
              {sentence.title}
            </span>
            <span className="text-xs text-[#4B5C8A]">
              {isGuidedLocked ? '· Guided challenge' : '· Tap any word'}
            </span>
          </div>

          {!isGuidedLocked &&
          (selectedTokenInfo || highlightedGroupRole || selectedRelationshipId) ? (
            <button
              type="button"
              onClick={() => {
                onCloseTokenPopup();
                onSelectGroup(null);
                onSelectRelationship(null);
              }}
              aria-label="Reset selection"
              className="inline-flex items-center gap-1 min-h-[32px] px-2 py-1 rounded-[9px] text-xs font-medium text-[#4B5C8A] hover:text-[#1B2559] cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          ) : null}
        </div>

        {/* Concept Chips (2x2 clean grid on mobile, inline wrap on larger screens) */}
        {!isGuidedLocked ? (
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                onSelectGroup(highlightedGroupRole === 'subject' ? null : 'subject')
              }
              aria-pressed={highlightedGroupRole === 'subject'}
              className={[
                'inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-[12px] border text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap',
                highlightedGroupRole === 'subject'
                  ? 'bg-[#FFC64B] border-[#EAB030] text-[#1B2559]'
                  : 'bg-[#FDFCF9] border-[#CFC9BA] text-[#1B2559] hover:bg-[#FFF4D6]',
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
                'inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-[12px] border text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap',
                highlightedGroupRole === 'predicate'
                  ? 'bg-[#8DECE0] border-[#65D8CA] text-[#1B2559]'
                  : 'bg-[#FDFCF9] border-[#CFC9BA] text-[#1B2559] hover:bg-[#D9FAF5]',
              ].join(' ')}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Predicate</span>
            </button>

            <button
              type="button"
              onClick={onToggleStructureSplit}
              aria-pressed={showStructureSplit}
              className={[
                'inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-[12px] border text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap',
                showStructureSplit
                  ? 'bg-[#1B2559] border-[#1B2559] text-white'
                  : 'bg-[#FDFCF9] border-[#CFC9BA] text-[#1B2559] hover:bg-[#F5F2EA]',
              ].join(' ')}
            >
              <ListTree className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Structure</span>
            </button>

            {comparisonSentence && onToggleCompare ? (
              <button
                type="button"
                onClick={onToggleCompare}
                aria-pressed={showCompare}
                className={[
                  'inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-[12px] border text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  showCompare
                    ? 'bg-[#1B2559] border-[#1B2559] text-white'
                    : 'bg-[#FDFCF9] border-[#CFC9BA] text-[#1B2559] hover:bg-[#F5F2EA]',
                ].join(' ')}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Compare</span>
              </button>
            ) : null}
          </div>
        ) : null}

        {/* Guided Explore Prompt Banner (Step 6 before unlocking) */}
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
            showArcPadding && !isGuidedLocked ? 'pt-9' : 'pt-1',
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
                  : showStructureSplit
                    ? token.groupRole
                    : highlightedGroupRole;

              const isStepFocus = !isGuidedLocked && focusTokenIds.includes(token.id);
              const isLinkedToSelected = !isGuidedLocked && linkedTokenIdSet.has(token.id);
              const isFocused =
                !isGuidedLocked &&
                (isStepFocus ||
                  highlightedByRelationship.has(token.id) ||
                  isLinkedToSelected);
              const isSpotlight = isHeadwordSpotlight && isStepFocus;
              const isDimmed =
                (isHeadwordSpotlight && !isStepFocus && !isSelected) ||
                (!isGuidedLocked &&
                  !isStepFocus &&
                  !isSelected &&
                  !isLinkedToSelected &&
                  (dimmedTokenIds.includes(token.id) ||
                    (visualMode === 'agreement-lock' && Boolean(token.isInterveningModifier))));

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

        {/* Visual Mode: split-blueprint (kept compact inside Starter card when active) */}
        {visualMode === 'split-blueprint' && visualCallout ? (
          <motion.div
            key={`${stepId}-${animationSeed}`}
            data-testid="step-split-blueprint"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-2 gap-2 pt-0.5"
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

        {/* Visual Mode: Interactive Timeline Card (Mission 2) */}
        {timelineData ? (
          <motion.div
            key={`${stepId}-timeline-${animationSeed}`}
            data-testid="step-timeline-card"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="rounded-[14px] border border-[#E5E2D9] bg-[#FDFCF9] p-3 space-y-2.5"
          >
            {/* 3-Node Time Bar */}
            <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Time phase on timeline">
              {TIMELINE_PHASES.map((phaseItem) => {
                const isActive = timelineData.activePhase === phaseItem.id;
                const activeClasses =
                  phaseItem.id === 'past'
                    ? 'bg-[#FFF4D6] border-[#F59B19] text-[#263A70]'
                    : phaseItem.id === 'present'
                      ? 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]'
                      : 'bg-[#ECE6FB] border-[#5B43C2] text-[#263A70]';
                return (
                  <div
                    key={phaseItem.id}
                    className={[
                      'rounded-[10px] border-2 px-2 py-1.5 text-center transition-colors',
                      isActive ? activeClasses : 'bg-white border-[#E5E2D9] opacity-65 text-[#4B5C8A]',
                    ].join(' ')}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wide flex items-center justify-center gap-1">
                      {isActive ? <Clock className="w-3 h-3 shrink-0" aria-hidden="true" /> : null}
                      <span>{phaseItem.label}</span>
                    </p>
                    <p className="text-[10px] font-medium leading-tight">{phaseItem.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Active Verb & Time Marker Summary */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-white border border-[#E5E2D9] px-3 py-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4B5C8A]">
                  {timelineData.timeLabel}
                </p>
                <p className="text-sm font-bold text-[#1B2559]">
                  Verb: <span className="text-[#0F7F76]">{timelineData.verbPhrase}</span>{' '}
                  <span className="text-xs font-semibold text-[#4B5C8A]">
                    ({timelineData.verbFormLabel})
                  </span>
                </p>
              </div>
              {timelineData.aspectLabel ? (
                <span className="px-2.5 py-0.5 rounded-[8px] bg-[#ECE6FB] text-[#5B43C2] text-[11px] font-bold whitespace-nowrap">
                  {timelineData.aspectLabel}
                </span>
              ) : null}
            </div>

            {timelineData.timeMarkerWords && timelineData.timeMarkerWords.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-semibold text-[#4B5C8A]">Time clues:</span>
                {timelineData.timeMarkerWords.map((marker) => (
                  <span
                    key={marker}
                    className="px-2 py-0.5 rounded-[7px] bg-[#FFF4D6] border border-[#F2DFB6] font-semibold text-[#263A70]"
                  >
                    {marker}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Optional Toggles for Contrast Error vs Correct & Textbook Naming Bridge */}
            {timelineData.contrastExample || timelineData.boardModelNote ? (
              <div className="flex flex-wrap items-center gap-2">
                {timelineData.contrastExample ? (
                  <button
                    type="button"
                    onClick={() => setShowContrastCard((v) => !v)}
                    aria-expanded={showContrastCard}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E2A25] hover:underline py-1 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{showContrastCard ? 'Hide common mistake' : 'See common mistake'}</span>
                  </button>
                ) : null}
                {timelineData.boardModelNote ? (
                  <button
                    type="button"
                    onClick={() => setShowBoardModelNote((v) => !v)}
                    aria-expanded={showBoardModelNote}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B43C2] hover:underline py-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{showBoardModelNote ? 'Hide textbook naming note' : 'How textbooks name this'}</span>
                  </button>
                ) : null}
              </div>
            ) : null}

            {showContrastCard && timelineData.contrastExample ? (
              <div className="rounded-[10px] bg-white border border-[#E5E2D9] p-2.5 space-y-1.5 text-xs">
                <p className="text-[#9E2A25] font-semibold">
                  Avoid: <span className="line-through">{timelineData.contrastExample.incorrectText}</span>
                </p>
                <p className="text-[#0E5A42] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Correct: {timelineData.contrastExample.correctText}</span>
                </p>
                <p className="text-[#4B5C8A]">{timelineData.contrastExample.reason}</p>
              </div>
            ) : null}

            {showBoardModelNote && timelineData.boardModelNote ? (
              <div className="rounded-[10px] bg-[#ECE6FB]/60 border border-[#5B43C2]/30 p-2.5 text-xs text-[#263A70] leading-snug">
                <strong className="font-bold text-[#5B43C2]">Textbook Naming Bridge: </strong>
                {timelineData.boardModelNote}
              </div>
            ) : null}
          </motion.div>
        ) : null}

        {/* Visual Mode: Subject-Verb Agreement Lock Card (Mission 3) */}
        {agreementData ? (
          <motion.div
            key={`${stepId}-agreement-${animationSeed}`}
            data-testid="step-agreement-card"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="rounded-[14px] border border-[#E5E2D9] bg-[#FDFCF9] p-3 space-y-2.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-[10px] bg-[#FFF4D6] border border-[#F59B19] px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#A15C00]">
                  Real Subject Head
                </p>
                <p className="text-sm font-bold text-[#1B2559]">{agreementData.subjectHeadText}</p>
                <p className="text-[11px] font-medium text-[#4B5C8A]">
                  {agreementData.subjectNumberPerson}
                </p>
              </div>
              <div className="rounded-[10px] bg-[#D9FAF5] border border-[#1FA89A] px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#0F766E]">
                  Locked Verb
                </p>
                <p className="text-sm font-bold text-[#1B2559] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F7F76] shrink-0" aria-hidden="true" />
                  <span>{agreementData.verbText}</span>
                </p>
                <p className="text-[11px] font-medium text-[#4B5C8A]">
                  {agreementData.verbFormTag}
                </p>
              </div>
            </div>

            {agreementData.interveningText ? (
              <div className="rounded-[10px] bg-[#F5F2EA] border border-dashed border-[#CFC9BA] px-3 py-1.5 text-xs text-[#4B5C8A]">
                <strong className="text-[#263A70]">Ignore in-between words:</strong>{' '}
                <span className="italic">{agreementData.interveningText}</span>
              </div>
            ) : null}

            {(agreementData.contrastIncorrectText || agreementData.informalUsageNote) ? (
              <div className="flex flex-wrap items-center gap-3">
                {agreementData.contrastIncorrectText ? (
                  <button
                    type="button"
                    onClick={() => setShowContrastCard((v) => !v)}
                    aria-expanded={showContrastCard}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E2A25] hover:underline py-1 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{showContrastCard ? 'Hide common trap' : 'See common trap'}</span>
                  </button>
                ) : null}
              </div>
            ) : null}

            {showContrastCard && agreementData.contrastIncorrectText ? (
              <div className="rounded-[10px] bg-white border border-[#E5E2D9] p-2.5 space-y-1 text-xs">
                <p className="text-[#9E2A25] font-semibold">
                  Avoid: <span className="line-through">{agreementData.contrastIncorrectText}</span>
                </p>
                {agreementData.contrastReason ? (
                  <p className="text-[#4B5C8A]">{agreementData.contrastReason}</p>
                ) : null}
              </div>
            ) : null}

            {agreementData.informalUsageNote ? (
              <div className="rounded-[10px] bg-[#ECE6FB]/60 border border-[#5B43C2]/30 p-2.5 text-xs text-[#263A70] leading-snug">
                <strong className="font-bold text-[#5B43C2]">Exam vs Conversational Note: </strong>
                {agreementData.informalUsageNote}
              </div>
            ) : null}
          </motion.div>
        ) : null}

        {/* Collapsible Word Links Trigger (keeps 390x844 clean while preserving link arcs) */}
        {!isGuidedLocked && showRelationships && availableRelationships.length > 0 ? (
          <div className="pt-0.5 space-y-2">
            <button
              type="button"
              onClick={() => setLinksExpanded((prev) => !prev)}
              aria-expanded={linksExpanded}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5C8A] hover:text-[#1B2559] py-1 cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {linksExpanded
                  ? 'Hide word connections'
                  : `Word connections (${availableRelationships.length})`}
              </span>
            </button>

            {linksExpanded ? (
              <RelationshipList
                relationships={sentence.relationships}
                tokens={sentence.tokens}
                allowedTypes={allowedRelationshipTypes}
                selectedRelationshipId={selectedRelationshipId}
                onSelectRelationship={onSelectRelationship}
              />
            ) : null}
          </div>
        ) : null}
      </section>

      {/* Compact Result Card directly below Starter Sentence */}
      {!isGuidedLocked ? (
        <section
          aria-label="Sentence breakdown result"
          className="rounded-[18px] bg-white border border-[#E5E2D9] p-3.5 sm:p-4 space-y-2 shadow-[var(--gq-shadow-card)]"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#4B5C8A]">
            {resultCardConfig.conceptLabel}
          </p>

          {/* Highlighted Example Sentence (every word clickable to open WordInspectorPopup) */}
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 leading-relaxed">
            {resultCardConfig.targetSentence.tokens.map((token) => {
              const mode = resultCardConfig.highlightMode;
              const isSubjectHighlight =
                (mode === 'subject' || mode === 'both') &&
                token.groupRole === 'subject';
              const isPredicateHighlight =
                (mode === 'predicate' || mode === 'both') &&
                token.groupRole === 'predicate';
              const isLinkFrom =
                mode === 'relationship' && resultCardConfig.linkedFrom.has(token.id);
              const isLinkTo =
                mode === 'relationship' && resultCardConfig.linkedTo.has(token.id);
              const isModifierBorder =
                (isSubjectHighlight && modifierIdSet.has(token.id)) || isLinkFrom;

              let highlightStyle: React.CSSProperties | undefined;
              if (isSubjectHighlight || isLinkFrom) {
                highlightStyle = {
                  backgroundColor: '#FDEBC0',
                  borderColor: isModifierBorder ? '#E5B24A' : 'transparent',
                };
              } else if (isPredicateHighlight || isLinkTo) {
                highlightStyle = {
                  backgroundColor: '#D7F5EE',
                  borderColor: mode === 'predicate' || isLinkTo ? '#0F7F76' : 'transparent',
                };
              }

              const isHighlightedToken = Boolean(highlightStyle);

              return (
                <button
                  key={token.id}
                  type="button"
                  onClick={() =>
                    onSelectToken(
                      token,
                      resultCardConfig.targetSentence.id,
                      resultCardConfig.sentenceLabel,
                    )
                  }
                  style={highlightStyle}
                  aria-label={`Inspect word ${token.text}`}
                  className={[
                    'inline-flex items-center px-1.5 py-0.5 rounded-[7px] border text-[15px] sm:text-base transition-colors cursor-pointer',
                    isHighlightedToken
                      ? 'font-bold text-[#1B2559] hover:brightness-95'
                      : 'border-transparent font-medium text-[#263A70] hover:bg-[#F5F2EA]',
                  ].join(' ')}
                >
                  <span>
                    {token.text}
                    {token.punctuationAfter ?? ''}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[13px] sm:text-sm text-[#4B5C8A] leading-snug">
            {resultCardConfig.explanation}
          </p>
        </section>
      ) : null}

      {/* Word Inspector Popup Modal */}
      <WordInspectorPopup
        token={selectedTokenInfo?.token ?? null}
        sentenceLabel={selectedTokenInfo?.sentenceLabel}
        onClose={onCloseTokenPopup}
      />
    </div>
  );
};
