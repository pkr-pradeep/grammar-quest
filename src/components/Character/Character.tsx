/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE CHARACTER COMPONENT
 * ============================================================================
 * Renders any of the three permanent master characters (Mira, Arjun, Gyan)
 * with consistent face, hairstyle, clothing, palette, and proportions.
 *
 * Props:
 * - characterId: 'mira' | 'arjun' | 'gyan'
 * - pose: 10 required poses ('standing-idle' through 'encouraging')
 * - expression: facial / visor expression
 * - animationState: 'idle' | 'blink' | 'talk' | 'point' | 'wave' | 'celebrate' | 'enter' | 'none'
 * - size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number (width in px; 3:4 aspect ratio)
 * - flipHorizontal: mirror horizontally if character faces left
 *
 * Motion & Accessibility:
 * - Purely 2D via CSS + Motion for React.
 * - Respects reduced motion via Motion's useReducedMotion() & CSS media query.
 * - Non-blocking: pointer-events-none prevents interference with student UI.
 * ============================================================================
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type {
  CharacterAnimationState,
  CharacterExpression,
  CharacterId,
  CharacterPose,
  CharacterSize,
} from './types';
import { CHARACTER_MASTERS } from './types';
import { MiraSvg } from './MiraSvg';
import { ArjunSvg } from './ArjunSvg';
import { GyanSvg } from './GyanSvg';

export interface CharacterProps {
  characterId: CharacterId;
  pose?: CharacterPose;
  expression?: CharacterExpression;
  animationState?: CharacterAnimationState;
  size?: CharacterSize;
  flipHorizontal?: boolean;
  className?: string;
  ariaLabel?: string;
}

const SIZE_MAP: Record<Exclude<CharacterSize, number>, number> = {
  xs: 64,
  sm: 96,
  md: 132,
  lg: 168,
  xl: 210,
};

function resolveWidth(size: CharacterSize): number {
  if (typeof size === 'number') return size;
  return SIZE_MAP[size] ?? SIZE_MAP.md;
}

export const Character: React.FC<CharacterProps> = ({
  characterId,
  pose = 'standing-idle',
  expression = 'happy',
  animationState = 'idle',
  size = 'md',
  flipHorizontal = false,
  className = '',
  ariaLabel,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const widthPx = resolveWidth(size);
  const heightPx = Math.round((widthPx * 240) / 180);

  const effectiveAnimation: CharacterAnimationState = prefersReducedMotion
    ? 'none'
    : animationState;

  const isTalking = effectiveAnimation === 'talk';

  const animClass =
    effectiveAnimation === 'idle'
      ? 'gq-anim-idle'
      : effectiveAnimation === 'blink'
        ? 'gq-anim-blink'
        : effectiveAnimation === 'talk'
          ? 'gq-anim-talk gq-anim-blink'
          : effectiveAnimation === 'wave'
            ? 'gq-anim-wave gq-anim-blink'
            : effectiveAnimation === 'point'
              ? 'gq-anim-point gq-anim-blink'
              : '';

  const motionAnimate =
    effectiveAnimation === 'idle'
      ? { y: [0, -2.5, 0] }
      : effectiveAnimation === 'celebrate'
        ? { y: [0, -7, 0], scale: [1, 1.03, 1] }
        : effectiveAnimation === 'enter'
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 1, y: 0, scale: 1 };

  const motionInitial =
    effectiveAnimation === 'enter' ? { opacity: 0, y: 12, scale: 0.96 } : false;

  const motionTransition =
    effectiveAnimation === 'idle'
      ? { duration: 3.4, repeat: Infinity, ease: 'easeInOut' as const }
      : effectiveAnimation === 'celebrate'
        ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' as const }
        : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  const master = CHARACTER_MASTERS[characterId];
  const label =
    ariaLabel ?? `${master.name}, ${master.roleTitle}, ${pose.replace('-', ' ')} (${expression})`;

  const renderSvg = () => {
    const svgClass = 'w-full h-full block';
    if (characterId === 'mira') {
      return (
        <MiraSvg
          pose={pose}
          expression={expression}
          isTalking={isTalking}
          className={svgClass}
        />
      );
    }
    if (characterId === 'arjun') {
      return (
        <ArjunSvg
          pose={pose}
          expression={expression}
          isTalking={isTalking}
          className={svgClass}
        />
      );
    }
    return (
      <GyanSvg
        pose={pose}
        expression={expression}
        isTalking={isTalking}
        className={svgClass}
      />
    );
  };

  return (
    <motion.div
      role="img"
      aria-label={label}
      initial={motionInitial}
      animate={motionAnimate}
      transition={motionTransition}
      style={{
        width: `${widthPx}px`,
        height: `${heightPx}px`,
      }}
      className={[
        'inline-flex items-end justify-center select-none pointer-events-none shrink-0',
        animClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'w-full h-full',
          flipHorizontal ? '-scale-x-100' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {renderSvg()}
      </div>
    </motion.div>
  );
};
