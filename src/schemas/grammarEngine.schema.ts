/**
 * ============================================================================
 * GRAMMAR QUEST — VISUAL GRAMMAR TEACHING ENGINE SCHEMAS
 * ============================================================================
 * Reusable TypeScript contracts separating lesson content JSON from React
 * teaching-engine components. Supports word tokens, grammatical categories,
 * word groups, word/phrase relationships, 10-step teaching sequences, and
 * 6 reusable Interactive Word Laboratory activities.
 * ============================================================================
 */

import type { ClassLevel } from './lesson.schema';
import type {
  CharacterExpression,
  CharacterId,
  CharacterPose,
} from '../components/Character';

export type GrammaticalCategory =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'determiner'
  | 'preposition'
  | 'conjunction';

export type WordGroupRole = 'subject' | 'predicate';

export type RelationshipType =
  | 'adjective-noun'
  | 'adverb-verb'
  | 'pronoun-noun'
  | 'determiner-noun'
  | 'verb-subject'
  | 'conjunction-elements'
  | 'preposition-relation';

export type KnowledgeProvenance =
  | 'textbook-derived'
  | 'supplementary-bridge'
  | 'original-practice';

export interface SourceReference {
  id: string;
  sourceTextbookId: string;
  board: string;
  bookTitle: string;
  chapter: string;
  bookPages: string;
  pdfPages: string;
  provenance: KnowledgeProvenance;
  note: string;
}

export interface VerbTokenMeta {
  timeCommunicated: string;
  verbForm: string;
  whyAppropriate: string;
  subjectLinkNote?: string;
}

export interface SentenceToken {
  id: string;
  text: string;
  category: GrammaticalCategory;
  groupRole: WordGroupRole;
  isHeadWord?: boolean;
  roleLabel: string;
  meaningInSentence: string;
  grammaticalRoleExplanation: string;
  punctuationAfter?: string;
  verbMeta?: VerbTokenMeta;
  linkedTokenIds?: string[];
  isInterveningModifier?: boolean;
}

export interface WordGroupDefinition {
  id: string;
  role: WordGroupRole;
  label: string;
  tokenIds: string[];
  questionPrompt: string;
  plainExplanation: string;
  textbookRule: string;
  provenance: KnowledgeProvenance;
  sourceRefIds: string[];
}

export interface WordRelationship {
  id: string;
  type: RelationshipType;
  label: string;
  fromTokenIds: string[];
  toTokenIds: string[];
  explanation: string;
  activeInLesson: boolean;
}

export interface SentenceStructureSummary {
  subjectText: string;
  subjectHeadWord: string;
  predicateText: string;
  predicateHeadWord: string;
  patternNote?: string;
}

export interface SentenceDefinition {
  id: string;
  title: string;
  rawText: string;
  contextTag: string;
  note?: string;
  tokens: SentenceToken[];
  groups: WordGroupDefinition[];
  relationships: WordRelationship[];
  structureSummary: SentenceStructureSummary;
}

export type TeachingStepType =
  | 'show-sentence'
  | 'introduce-objective'
  | 'highlight-group'
  | 'explain-meaning'
  | 'explain-role'
  | 'show-relationship'
  | 'reveal-structure'
  | 'compare-example'
  | 'interact-explore'
  | 'guided-practice';

export type StepVisualMode =
  | 'plain-sentence'
  | 'split-blueprint'
  | 'group-bracket'
  | 'meaning-callout'
  | 'headword-spotlight'
  | 'relationship-arcs'
  | 'structure-split'
  | 'compare-dual'
  | 'guided-explore'
  | 'free-explore'
  | 'practice-ready'
  | 'timeline-shift'
  | 'agreement-lock';

export type TimelinePhase = 'past' | 'present' | 'future';

export interface TimelineVisualData {
  activePhase: TimelinePhase;
  timeLabel: string;
  verbPhrase: string;
  verbFormLabel: string;
  aspectLabel?: string;
  timeMarkerWords?: string[];
  grammarNote: string;
  boardModelNote?: string;
  contrastExample?: {
    incorrectText: string;
    correctText: string;
    reason: string;
  };
}

export interface AgreementLockVisualData {
  subjectHeadText: string;
  subjectNumberPerson: string;
  verbText: string;
  verbFormTag: string;
  interveningText?: string;
  ruleSummary: string;
  contrastIncorrectText?: string;
  contrastReason?: string;
  informalUsageNote?: string;
}

export interface GuidedExploreChallenge {
  promptSubject: string;
  promptPredicate: string;
  subjectTokenIds: string[];
  predicateTokenIds: string[];
  subjectFeedback: string;
  predicateFeedback: string;
  unlockedExplanation: string;
}

export interface StepVisualCallout {
  question?: string;
  label: string;
  detail: string;
  targetTokenIds?: string[];
  targetGroupRole?: WordGroupRole;
}

export interface TeachingStep {
  id: string;
  stepNumber: number;
  type: TeachingStepType;
  visualMode?: StepVisualMode;
  visualCallout?: StepVisualCallout;
  guidedChallenge?: GuidedExploreChallenge;
  timelineData?: TimelineVisualData;
  agreementData?: AgreementLockVisualData;
  dimmedTokenIds?: string[];
  title: string;
  badgeLabel: string;
  shortPrompt: string;
  explanation: string;
  characterId?: CharacterId;
  characterExpression?: CharacterExpression;
  sentenceId: string;
  comparisonSentenceId?: string;
  focusTokenIds?: string[];
  focusGroupRole?: WordGroupRole;
  focusRelationshipIds?: string[];
  showStructureSplit?: boolean;
  allowFreeExplore?: boolean;
  provenance: KnowledgeProvenance;
  sourceRefIds?: string[];
}

/* --------------------------------------------------------------------------
   Interactive Word Laboratory Activity Types (A–F)
   -------------------------------------------------------------------------- */

export interface BaseWordLabActivity {
  id: string;
  kind:
    | 'identify-group'
    | 'identify-both'
    | 'categorise'
    | 'sentence-construction'
    | 'word-replacement'
    | 'missing-words'
    | 'error-identification';
  tabLabel?: string;
  title: string;
  instruction: string;
  provenance: KnowledgeProvenance;
  sourceRefIds: string[];
}

/** A. Identify the group (select Subject, Predicate, Verb, or Clue tokens inside a sentence) */
export interface IdentifyGroupActivity extends BaseWordLabActivity {
  kind: 'identify-group';
  targetRole: WordGroupRole;
  sentence: SentenceDefinition;
  correctTokenIds: string[];
  correctFeedback: string;
  incorrectFeedback: string;
  hint: string;
  correctTitle?: string;
  incorrectTitle?: string;
  hideRoleGroupsOnSuccess?: boolean;
}

/** A2. Identify both Subject and Predicate tokens inside one sentence */
export interface IdentifyBothActivity extends BaseWordLabActivity {
  kind: 'identify-both';
  sentence: SentenceDefinition;
  subjectTokenIds: string[];
  predicateTokenIds: string[];
  correctFeedback: string;
  incorrectSubjectFeedback: string;
  incorrectPredicateFeedback: string;
  hint: string;
}

export type CategoriseBucketTone =
  | 'subject'
  | 'predicate'
  | 'past'
  | 'present'
  | 'future'
  | 'singular'
  | 'plural';

/** B. Categorise (place cards into Subject/Predicate, Time buckets, or Agreement buckets) */
export interface CategoriseItem {
  id: string;
  text: string;
  correctCategory: string;
  explanation: string;
}

export interface CategoriseActivity extends BaseWordLabActivity {
  kind: 'categorise';
  promptText?: string;
  categories: {
    id: string;
    label: string;
    helperText: string;
    tone?: CategoriseBucketTone;
  }[];
  items: CategoriseItem[];
  completeFeedback: string;
  incorrectFeedback?: string;
}

/** C. Sentence construction (arrange scrambled word tiles to build a sentence) */
export interface SentenceConstructionTile {
  id: string;
  text: string;
  groupRole: WordGroupRole;
  category: GrammaticalCategory;
}

export interface SentenceConstructionActivity extends BaseWordLabActivity {
  kind: 'sentence-construction';
  promptContext: string;
  tiles: SentenceConstructionTile[];
  correctOrderIds: string[];
  subjectText: string;
  predicateText: string;
  part1Label?: string;
  part2Label?: string;
  correctFeedback: string;
  incorrectFeedback: string;
}

/** D. Word replacement (swap a word in a sentence and inspect meaning/role shift) */
export interface WordReplacementOption {
  id: string;
  word: string;
  category: GrammaticalCategory;
  meaningEffect: string;
  roleImpactNote: string;
  isGrammatical: boolean;
}

export interface WordReplacementActivity extends BaseWordLabActivity {
  kind: 'word-replacement';
  beforeText: string;
  afterText: string;
  originalWord: string;
  slotGroupRole: WordGroupRole;
  slotLabel?: string;
  options: WordReplacementOption[];
  takeaway: string;
}

/** E. Missing words (complete a sentence with an appropriate word/verb/phrase) */
export interface MissingWordOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface MissingWordsActivity extends BaseWordLabActivity {
  kind: 'missing-words';
  sentenceBeforeBlank: string;
  sentenceAfterBlank: string;
  missingRole: WordGroupRole;
  incorrectTitle?: string;
  options: MissingWordOption[];
}

/** F. Error identification (spot what is wrong or missing in a broken sentence) */
export interface ErrorIdentificationOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface ErrorIdentificationActivity extends BaseWordLabActivity {
  kind: 'error-identification';
  draftBadgeLabel?: string;
  brokenSentence: string;
  repairedSentence: string;
  question: string;
  options: ErrorIdentificationOption[];
}

export type WordLabActivity =
  | IdentifyGroupActivity
  | IdentifyBothActivity
  | CategoriseActivity
  | SentenceConstructionActivity
  | WordReplacementActivity
  | MissingWordsActivity
  | ErrorIdentificationActivity;

export type StorySceneVariant = 'noticeboard' | 'records-timeline' | 'detective-board';

export interface StoryBeat {
  id: string;
  speaker: CharacterId;
  expression: CharacterExpression;
  pose: CharacterPose;
  sceneFocus: 'mira-notices' | 'arjun-picks-up' | 'gyan-explains';
  actionLabel: string;
  dialogue: string;
  cardPreviewText?: string;
}

export interface MissionStoryIntro {
  sceneVariant?: StorySceneVariant;
  sceneTitle: string;
  settingLabel: string;
  previewSectionTitle?: string;
  cardPreviewLabel?: string;
  scatteredFragments: string[];
  highlightFragments?: string[];
  beats: StoryBeat[];
}

export interface IndependentPracticeOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface IndependentPracticeItem {
  id: string;
  mode: 'dual-identify' | 'imperative-check' | 'choice-diagnose' | 'token-and-choice';
  cueLevel: 'gentle' | 'minimal' | 'none';
  cueText?: string;
  title: string;
  instruction: string;
  sentence: SentenceDefinition;
  subjectTokenIds: string[];
  predicateTokenIds: string[];
  targetTokenIds?: string[];
  targetPrompt?: string;
  imperativeQuestion?: string;
  imperativeOptions?: IndependentPracticeOption[];
  successFeedback: string;
  retrySubjectFeedback?: string;
  retryPredicateFeedback?: string;
  provenance: KnowledgeProvenance;
  sourceRefIds: string[];
}

export interface MissionCompletionSummary {
  sceneVariant?: StorySceneVariant;
  headline: string;
  celebrationMessage: string;
  learnedPoints: string[];
  restoredSectionLabel?: string;
  repairedMessages: string[];
  rewardLabel: string;
}

export interface GrammarLessonDefinition {
  lessonId: string;
  missionId: string;
  classLevel: ClassLevel;
  moduleId: string;
  moduleTitle: string;
  missionTitle: string;
  topic: string;
  estimatedMinutes: number;
  situationBrief: {
    title: string;
    description: string;
    characterId: CharacterId;
    characterExpression: CharacterExpression;
  };
  storyIntro?: MissionStoryIntro;
  learningObjectives: {
    grammarOutcomes: string[];
    knowledgeOutcome: string;
  };
  sourceReferences: SourceReference[];
  activeRelationshipTypes: RelationshipType[];
  sentences: SentenceDefinition[];
  teachingSequence: TeachingStep[];
  wordLabActivities: WordLabActivity[];
  independentPractice?: IndependentPracticeItem[];
  completionSummary?: MissionCompletionSummary;
}
