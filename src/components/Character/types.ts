/**
 * ============================================================================
 * GRAMMAR QUEST — CHARACTER DESIGN SYSTEM TYPES & MASTER SPECS
 * ============================================================================
 * Permanent 2D character definitions for:
 * - Mira (The Curious Learner)
 * - Arjun (The Grammar Explorer)
 * - Gyan (The Learning Robot)
 *
 * Every pose and expression variant derives from these immutable master
 * specifications so proportions, colours, hairstyles, and outlines remain
 * identical across every screen in Grammar Quest.
 * ============================================================================
 */

export type CharacterId = 'mira' | 'arjun' | 'gyan';

export type CharacterPose =
  | 'standing-idle'
  | 'walking'
  | 'waving'
  | 'reading'
  | 'pointing'
  | 'explaining'
  | 'thinking'
  | 'confused'
  | 'celebrating'
  | 'encouraging';

export type CharacterExpression =
  | 'happy'
  | 'curious'
  | 'thinking'
  | 'confused'
  | 'surprised'
  | 'explaining'
  | 'encouraging'
  | 'celebrating';

export type CharacterAnimationState =
  | 'idle'
  | 'blink'
  | 'talk'
  | 'point'
  | 'wave'
  | 'celebrate'
  | 'enter'
  | 'none';

export type CharacterSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface CharacterMasterSpec {
  id: CharacterId;
  name: string;
  roleTitle: string;
  summary: string;
  palette: { label: string; hex: string }[];
  proportions: string;
  supportedExpressions: CharacterExpression[];
}

export const ALL_POSES: { id: CharacterPose; label: string }[] = [
  { id: 'standing-idle', label: 'Standing idle' },
  { id: 'walking', label: 'Walking' },
  { id: 'waving', label: 'Waving' },
  { id: 'reading', label: 'Reading a book' },
  { id: 'pointing', label: 'Pointing' },
  { id: 'explaining', label: 'Explaining' },
  { id: 'thinking', label: 'Thinking' },
  { id: 'confused', label: 'Looking confused' },
  { id: 'celebrating', label: 'Celebrating' },
  { id: 'encouraging', label: 'Encouraging' },
];

export const ALL_ANIMATION_STATES: { id: CharacterAnimationState; label: string }[] = [
  { id: 'idle', label: 'Gentle idle + blink' },
  { id: 'blink', label: 'Blinking' },
  { id: 'talk', label: 'Talking' },
  { id: 'wave', label: 'Hand gesture' },
  { id: 'point', label: 'Pointing cue' },
  { id: 'celebrate', label: 'Celebrating' },
  { id: 'enter', label: 'Entrance' },
  { id: 'none', label: 'Static (none)' },
];

export const CHARACTER_MASTERS: Record<CharacterId, CharacterMasterSpec> = {
  mira: {
    id: 'mira',
    name: 'Mira',
    roleTitle: 'The Curious Learner',
    summary:
      'Indian Class 9–10 schoolgirl with dark brown centre-parted braided hair, sunshine-yellow collared kurti, navy satchel, and turquoise notebook.',
    proportions: 'Full-body 2D vector (180×240 canvas, 2.5px #263A70 outline)',
    palette: [
      { label: 'Dark Brown Hair', hex: '#3A241D' },
      { label: 'Skin', hex: '#F2B488' },
      { label: 'Sunshine Kurti', hex: '#FFC64B' },
      { label: 'Turquoise Book', hex: '#8DECE0' },
      { label: 'Deep Navy', hex: '#263A70' },
    ],
    supportedExpressions: [
      'happy',
      'curious',
      'thinking',
      'confused',
      'surprised',
      'explaining',
      'encouraging',
      'celebrating',
    ],
  },
  arjun: {
    id: 'arjun',
    name: 'Arjun',
    roleTitle: 'The Grammar Explorer',
    summary:
      'Indian Class 9–10 schoolboy with wavy dark hair, turquoise overshirt over a cream tee, navy backpack, and field study pencil/notebook.',
    proportions: 'Full-body 2D vector (180×240 canvas, 2.5px #263A70 outline)',
    palette: [
      { label: 'Dark Hair', hex: '#1F2437' },
      { label: 'Skin', hex: '#DD9768' },
      { label: 'Turquoise Overshirt', hex: '#4FD3C4' },
      { label: 'Cream Tee', hex: '#FFF8EB' },
      { label: 'Deep Navy', hex: '#263A70' },
    ],
    supportedExpressions: [
      'happy',
      'curious',
      'thinking',
      'confused',
      'surprised',
      'explaining',
      'encouraging',
      'celebrating',
    ],
  },
  gyan: {
    id: 'gyan',
    name: 'Gyan',
    roleTitle: 'The Learning Robot',
    summary:
      'Compact rounded 2D educational robot in turquoise, white, orange, and deep navy with a dark screen visor and expressive glowing eyes.',
    proportions: 'Compact 2D companion (180×240 canvas, 2.5px #263A70 outline)',
    palette: [
      { label: 'White Shell', hex: '#FFFFFF' },
      { label: 'Turquoise', hex: '#8DECE0' },
      { label: 'Orange Accent', hex: '#F59B19' },
      { label: 'Navy Visor', hex: '#263A70' },
    ],
    supportedExpressions: [
      'happy',
      'curious',
      'thinking',
      'confused',
      'surprised',
      'explaining',
      'encouraging',
      'celebrating',
    ],
  },
};
