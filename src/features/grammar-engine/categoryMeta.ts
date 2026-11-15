/**
 * ============================================================================
 * GRAMMAR QUEST — GRAMMATICAL CATEGORY & ROLE PRESENTATION METADATA
 * ============================================================================
 * Maps grammatical categories and Subject/Predicate roles to approved palette
 * tokens plus text labels and icons so colour is never the only signal.
 * ============================================================================
 */

import type { GrammaticalCategory, WordGroupRole } from '../../schemas/grammarEngine.schema';

export interface CategoryPresentation {
  label: string;
  shortLabel: string;
  symbol: string;
  bgVar: string;
  fgVar: string;
  borderHex: string;
}

export const GRAMMATICAL_CATEGORY_META: Record<GrammaticalCategory, CategoryPresentation> = {
  noun: {
    label: 'Noun',
    shortLabel: 'N',
    symbol: '◆',
    bgVar: 'var(--gq-grammar-noun-bg)',
    fgVar: 'var(--gq-grammar-noun-fg)',
    borderHex: '#7DD3FC',
  },
  verb: {
    label: 'Verb',
    shortLabel: 'V',
    symbol: '▶',
    bgVar: 'var(--gq-grammar-verb-bg)',
    fgVar: 'var(--gq-grammar-verb-fg)',
    borderHex: '#86EFAC',
  },
  adjective: {
    label: 'Adjective',
    shortLabel: 'Adj',
    symbol: '★',
    bgVar: 'var(--gq-grammar-adj-bg)',
    fgVar: 'var(--gq-grammar-adj-fg)',
    borderHex: '#FDBA74',
  },
  adverb: {
    label: 'Adverb',
    shortLabel: 'Adv',
    symbol: '✦',
    bgVar: 'var(--gq-grammar-adv-bg)',
    fgVar: 'var(--gq-grammar-adv-fg)',
    borderHex: '#D8B4FE',
  },
  pronoun: {
    label: 'Pronoun',
    shortLabel: 'Pron',
    symbol: '◉',
    bgVar: 'var(--gq-grammar-pronoun-bg)',
    fgVar: 'var(--gq-grammar-pronoun-fg)',
    borderHex: '#5EEAD4',
  },
  determiner: {
    label: 'Determiner',
    shortLabel: 'Det',
    symbol: '▸',
    bgVar: 'var(--gq-grammar-det-bg)',
    fgVar: 'var(--gq-grammar-det-fg)',
    borderHex: '#F9A8D4',
  },
  preposition: {
    label: 'Preposition',
    shortLabel: 'Prep',
    symbol: '⇄',
    bgVar: 'var(--gq-grammar-prep-bg)',
    fgVar: 'var(--gq-grammar-prep-fg)',
    borderHex: '#FCA5A5',
  },
  conjunction: {
    label: 'Conjunction',
    shortLabel: 'Conj',
    symbol: '+',
    bgVar: 'var(--gq-grammar-conj-bg)',
    fgVar: 'var(--gq-grammar-conj-fg)',
    borderHex: '#FDE047',
  },
};

export interface GroupRolePresentation {
  label: string;
  questionCue: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBgClass: string;
}

export const GROUP_ROLE_META: Record<WordGroupRole, GroupRolePresentation> = {
  subject: {
    label: 'Subject',
    questionCue: 'Who or what?',
    bgClass: 'bg-[#FFF4D6]',
    borderClass: 'border-[#F59B19]',
    textClass: 'text-[#263A70]',
    badgeBgClass: 'bg-[#FFC64B] text-[#263A70]',
  },
  predicate: {
    label: 'Predicate',
    questionCue: 'What is said?',
    bgClass: 'bg-[#D9FAF5]',
    borderClass: 'border-[#1FA89A]',
    textClass: 'text-[#263A70]',
    badgeBgClass: 'bg-[#8DECE0] text-[#263A70]',
  },
};
