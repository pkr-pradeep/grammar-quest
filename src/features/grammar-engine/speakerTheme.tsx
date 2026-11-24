/**
 * ============================================================================
 * GRAMMAR QUEST — SPEAKER SIGNATURE PALETTE & CROPPED PORTRAIT
 * ============================================================================
 * Single source of truth for Mira, Arjun, and ShukaJi conversation cues across
 * Story, Learn, Guided Practice, and Mission Completion screens:
 *  - Consistent accessible solid/tint colours (>= 4.5:1 white text contrast)
 *  - Role labels ('Student' / 'Wise parrot guide')
 *  - 44px round portrait cropped directly from the master character artwork
 * ============================================================================
 */

import React from 'react';
import { Character } from '../../components';
import type {
  CharacterExpression,
  CharacterId,
  CharacterPose,
} from '../../components';
import shukaNotificationArtwork from '../../assets/shukaji/notification.png';

export interface SpeakerTheme {
  id: CharacterId;
  name: string;
  solid: string;
  tint: string;
  border: string;
  ringRgba: string;
  roleLabel: string;
  pointerLeft: string;
}

export const SPEAKER_THEMES: Record<CharacterId, SpeakerTheme> = {
  mira: {
    id: 'mira',
    name: 'Mira',
    solid: '#C94A3A',
    tint: '#FDE6E1',
    border: '#F2B8B0',
    ringRgba: 'rgba(201, 74, 58, 0.42)',
    roleLabel: 'Student',
    pointerLeft: '12%',
  },
  arjun: {
    id: 'arjun',
    name: 'Arjun',
    solid: '#0F7F76',
    tint: '#DDF4F0',
    border: '#A2DDD4',
    ringRgba: 'rgba(15, 127, 118, 0.42)',
    roleLabel: 'Student',
    pointerLeft: '28%',
  },
  shuka: {
    id: 'shuka',
    name: 'Śukaji',
    solid: '#26734D',
    tint: '#E5F4E9',
    border: '#A8D4B5',
    ringRgba: 'rgba(38, 115, 77, 0.42)',
    roleLabel: 'Wise parrot guide',
    pointerLeft: '87%',
  },
};

export interface SpeakerPortraitProps {
  characterId: CharacterId;
  expression?: CharacterExpression;
  pose?: CharacterPose;
  sizePx?: number;
  ringWidthPx?: number;
  animatePop?: boolean;
  isTalking?: boolean;
  floatGentle?: boolean;
  popDelayMs?: number;
  className?: string;
}

export const SpeakerPortrait: React.FC<SpeakerPortraitProps> = ({
  characterId,
  expression = 'happy',
  pose,
  sizePx: circleSizePx = 44,
  ringWidthPx = 2.5,
  animatePop = true,
  isTalking = false,
  floatGentle = false,
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

  const scale = circleSizePx / 44;
  const charSizePx = Math.round((characterId === 'shuka' ? 64 : 96) * scale);
  const topOffsetPx = Math.round(
    (characterId === 'mira' ? -20 : characterId === 'arjun' ? -16 : -5) * scale,
  );

  return (
    <div
      aria-hidden="true"
      className={[
        isTalking ? 'gq-story-talk-bob' : '',
        floatGentle ? 'gq-guide-portrait-float' : '',
        'shrink-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'relative rounded-full overflow-hidden bg-[#FFFDF8]',
          animatePop ? 'gq-story-portrait-pop' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          width: `${circleSizePx}px`,
          height: `${circleSizePx}px`,
          border: `${ringWidthPx}px solid ${theme.solid}`,
          animationDelay: animatePop && popDelayMs > 0 ? `${popDelayMs}ms` : undefined,
        }}
      >
        {characterId === 'shuka' ? (
          <img
            src={shukaNotificationArtwork}
            alt=""
            draggable={false}
            className="h-full w-full object-contain"
          />
        ) : (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: `${topOffsetPx}px` }}
          >
            <Character
              characterId={characterId}
              pose={resolvedPose}
              expression={expression}
              animationState="none"
              size={charSizePx}
            />
          </div>
        )}
      </div>
    </div>
  );
};
