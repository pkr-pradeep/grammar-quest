import React from 'react';
import type {
  CharacterAnimationState,
  CharacterExpression,
  CharacterId,
  CharacterPose,
} from './types';
import { getCharacterArtwork } from './characterArtwork';

export interface CharacterPortraitProps {
  characterId: Extract<CharacterId, 'mira' | 'arjun'>;
  pose: CharacterPose;
  expression: CharacterExpression;
  animationState?: CharacterAnimationState;
}

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  characterId,
  pose,
  expression,
  animationState = 'none',
}) => (
  <img
    src={getCharacterArtwork(characterId, pose, expression, animationState)}
    alt=""
    draggable={false}
    className="h-full w-full object-cover object-top"
  />
);
