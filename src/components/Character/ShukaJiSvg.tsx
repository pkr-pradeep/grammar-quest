import React from 'react';
import type { CharacterExpression, CharacterPose } from './types';
import mainArtwork from '../../assets/shukaji/main.png';
import curiousArtwork from '../../assets/shukaji/curious.png';
import thinkingArtwork from '../../assets/shukaji/thinking.png';
import confusedArtwork from '../../assets/shukaji/confused.png';
import surprisedArtwork from '../../assets/shukaji/surprised.png';
import explainingArtwork from '../../assets/shukaji/explaining.png';
import encouragingArtwork from '../../assets/shukaji/encouraging.png';
import celebratingArtwork from '../../assets/shukaji/celebrating.png';

interface ShukaJiSvgProps {
  pose: CharacterPose;
  expression: CharacterExpression;
  className?: string;
}

const EXPRESSION_ARTWORK: Record<CharacterExpression, string> = {
  happy: mainArtwork,
  curious: curiousArtwork,
  thinking: thinkingArtwork,
  confused: confusedArtwork,
  surprised: surprisedArtwork,
  explaining: explainingArtwork,
  encouraging: encouragingArtwork,
  celebrating: celebratingArtwork,
};

function resolveArtwork(pose: CharacterPose, expression: CharacterExpression): string {
  if (expression !== 'happy') return EXPRESSION_ARTWORK[expression];

  if (pose === 'waving' || pose === 'encouraging') return encouragingArtwork;
  if (pose === 'reading' || pose === 'thinking') return thinkingArtwork;
  if (pose === 'pointing' || pose === 'explaining') return explainingArtwork;
  if (pose === 'confused') return confusedArtwork;
  if (pose === 'celebrating') return celebratingArtwork;

  return mainArtwork;
}

export const ShukaJiArtwork: React.FC<ShukaJiSvgProps> = ({ pose, expression, className = '' }) => (
  <image
    href={resolveArtwork(pose, expression)}
    x="0"
    y="0"
    width="180"
    height="200"
    preserveAspectRatio="xMidYMid meet"
    className={className}
  />
);

export const ShukaJiSvg: React.FC<ShukaJiSvgProps> = ({
  pose,
  expression,
  className = '',
}) => (
  <svg
    viewBox="0 0 180 200"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <ShukaJiArtwork pose={pose} expression={expression} />
  </svg>
);
