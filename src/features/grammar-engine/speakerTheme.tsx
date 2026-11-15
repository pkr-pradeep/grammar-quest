/**
 * ============================================================================
 * GRAMMAR QUEST — SPEAKER SIGNATURE PALETTE & CROPPED PORTRAIT
 * ============================================================================
 * Single source of truth for Mira, Arjun, and Gyan conversation cues across
 * Story, Learn, Guided Practice, and Mission Completion screens:
 *  - Consistent accessible solid/tint colours (>= 4.5:1 white text contrast)
 *  - Role labels ('Student' / 'Robot guide')
 *  - 44px round portrait cropped directly from the immutable SVG Character masters
 * ============================================================================
 */

import React from 'react';
import { Character } from '../../components';
import type {
  CharacterExpression,
  CharacterId,
  CharacterPose,
} from '../../components';

export interface SpeakerTheme {
  id: CharacterId;
  name: string;
  solid: string;
  tint: string;
  roleLabel: string;
  pointerLeft: string;
}

export const SPEAKER_THEMES: Record<CharacterId, SpeakerTheme> = {
  mira: {
    id: 'mira',
    name: 'Mira',
    solid: '#C94A3A',
    tint: '#FDE6E1',
    roleLabel: 'Student',
    pointerLeft: '12%',
  },
  arjun: {
    id: 'arjun',
    name: 'Arjun',
    solid: '#0F7F76',
    tint: '#DDF4F0',
    roleLabel: 'Student',
    pointerLeft: '28%',
  },
  gyan: {
    id: 'gyan',
    name: 'Gyan',
    solid: '#5B43C2',
    tint: '#ECE6FB',
    roleLabel: 'Robot guide',
    pointerLeft: '87%',
  },
};

export interface SpeakerPortraitProps {
  characterId: CharacterId;
  expression?: CharacterExpression;
  pose?: CharacterPose;
  animatePop?: boolean;
  isTalking?: boolean;
  popDelayMs?: number;
  className?: string;
}

export const SpeakerPortrait: React.FC<SpeakerPortraitProps> = ({
  characterId,
  expression = 'happy',
  pose,
  animatePop = true,
  isTalking = false,
  popDelayMs = 0,
  className = '',
}) => {
  const theme = SPEAKER_THEMES[characterId];
  const resolvedPose: CharacterPose =
    pose ??
    (characterId === 'mira'
      ? 'pointing'
      : characterId === 'arjun'
        ? 'reading'
        : 'explaining');

  const positionClass =
    characterId === 'mira'
      ? '-top-[20px]'
      : characterId === 'arjun'
        ? '-top-[16px]'
        : '-top-[36px]';
  const sizePx = characterId === 'gyan' ? 82 : 96;

  return (
    <div
      aria-hidden="true"
      className={[isTalking ? 'gq-story-talk-bob' : '', 'shrink-0', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'relative w-[44px] h-[44px] rounded-full overflow-hidden bg-[#FFFDF8]',
          animatePop ? 'gq-story-portrait-pop' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          border: `2.5px solid ${theme.solid}`,
          animationDelay: animatePop && popDelayMs > 0 ? `${popDelayMs}ms` : undefined,
        }}
      >
        <div className={`absolute left-1/2 -translate-x-1/2 ${positionClass}`}>
          <Character
            characterId={characterId}
            pose={resolvedPose}
            expression={expression}
            animationState="none"
            size={sizePx}
            flipHorizontal={characterId === 'gyan'}
          />
        </div>
      </div>
    </div>
  );
};
