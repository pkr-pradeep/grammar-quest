/**
 * ============================================================================
 * GRAMMAR QUEST — REUSABLE 2D CHARACTER EXPRESSION LAYERS
 * ============================================================================
 * Consistent, mutually exclusive facial expression renderers for Mira, Arjun,
 * and ShukaJi.
 *
 * Design guarantees:
 * - Exactly one active expression renders at a time (never mixed/contradictory).
 * - Animation state (talk/blink) modulates the active expression rather than
 *   replacing or contradicting its emotional shape.
 * - Every expression is visually distinct at both mobile and desktop sizes.
 * ============================================================================
 */

import React from 'react';
import type { CharacterExpression, CharacterPose } from './types';

interface HumanFaceFeaturesProps {
  expression: CharacterExpression;
  pose?: CharacterPose;
  cx?: number;
  cy?: number;
  isTalking?: boolean;
  eyeColor?: string;
}

export const HumanFaceFeatures: React.FC<HumanFaceFeaturesProps> = ({
  expression,
  pose,
  cx = 90,
  cy = 75,
  isTalking = false,
  eyeColor = '#263A70',
}) => {
  const leftEyeX = cx - 10;
  const rightEyeX = cx + 10;
  const eyeY = cy + 2;
  const browY = cy - 6;
  const mouthY = cy + 14;

  const isReading = pose === 'reading';

  const renderBrows = () => {
    switch (expression) {
      case 'curious':
        return (
          <>
            <path
              d={`M${leftEyeX - 5} ${browY - 3} Q${leftEyeX} ${browY - 6.5} ${leftEyeX + 5} ${browY - 2.5}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d={`M${rightEyeX - 5} ${browY + 0.5} Q${rightEyeX} ${browY - 1} ${rightEyeX + 5} ${browY + 0.5}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
          </>
        );
      case 'thinking':
        return (
          <>
            <path
              d={`M${leftEyeX - 5} ${browY + 0.5} H${leftEyeX + 4.5}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d={`M${rightEyeX - 4.5} ${browY - 2.5} Q${rightEyeX} ${browY - 5.5} ${rightEyeX + 5} ${browY - 2}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
          </>
        );
      case 'confused':
        return (
          <>
            <path
              d={`M${leftEyeX - 5} ${browY + 1.5} L${leftEyeX + 4.5} ${browY - 2}`}
              stroke={eyeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d={`M${rightEyeX - 4.5} ${browY - 2.5} L${rightEyeX + 5} ${browY + 1}`}
              stroke={eyeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        );
      case 'surprised':
        return (
          <>
            <path
              d={`M${leftEyeX - 5} ${browY - 3.5} Q${leftEyeX} ${browY - 7.5} ${leftEyeX + 5} ${browY - 3.5}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d={`M${rightEyeX - 5} ${browY - 3.5} Q${rightEyeX} ${browY - 7.5} ${rightEyeX + 5} ${browY - 3.5}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
          </>
        );
      case 'explaining':
      case 'encouraging':
      case 'celebrating':
        return (
          <>
            <path
              d={`M${leftEyeX - 4.5} ${browY - 1} Q${leftEyeX} ${browY - 4} ${leftEyeX + 4.5} ${browY - 1}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d={`M${rightEyeX - 4.5} ${browY - 1} Q${rightEyeX} ${browY - 4} ${rightEyeX + 4.5} ${browY - 1}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
          </>
        );
      default:
        return (
          <>
            <path
              d={`M${leftEyeX - 4.5} ${browY} Q${leftEyeX} ${browY - 2.5} ${leftEyeX + 4.5} ${browY}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d={`M${rightEyeX - 4.5} ${browY} Q${rightEyeX} ${browY - 2.5} ${rightEyeX + 4.5} ${browY}`}
              stroke={eyeColor}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
          </>
        );
    }
  };

  const renderEyes = () => {
    const pupilOffsetY = isReading ? 2.2 : expression === 'thinking' ? -2 : 0;
    const pupilOffsetX = expression === 'thinking' ? 2 : 0;

    if (expression === 'celebrating') {
      return (
        <g className="gq-char-eyes" style={{ transformOrigin: `${cx}px ${eyeY}px` }}>
          <path
            d={`M${leftEyeX - 4} ${eyeY + 1} Q${leftEyeX} ${eyeY - 4.5} ${leftEyeX + 4} ${eyeY + 1}`}
            stroke={eyeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={`M${rightEyeX - 4} ${eyeY + 1} Q${rightEyeX} ${eyeY - 4.5} ${rightEyeX + 4} ${eyeY + 1}`}
            stroke={eyeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      );
    }

    if (expression === 'surprised') {
      return (
        <g className="gq-char-eyes" style={{ transformOrigin: `${cx}px ${eyeY}px` }}>
          <circle cx={leftEyeX} cy={eyeY} r="4.6" fill="#FFFFFF" stroke={eyeColor} strokeWidth="1.6" />
          <circle cx={rightEyeX} cy={eyeY} r="4.6" fill="#FFFFFF" stroke={eyeColor} strokeWidth="1.6" />
          <circle cx={leftEyeX} cy={eyeY} r="2.7" fill={eyeColor} />
          <circle cx={rightEyeX} cy={eyeY} r="2.7" fill={eyeColor} />
          <circle cx={leftEyeX + 0.9} cy={eyeY - 0.9} r="0.9" fill="#FFFFFF" />
          <circle cx={rightEyeX + 0.9} cy={eyeY - 0.9} r="0.9" fill="#FFFFFF" />
        </g>
      );
    }

    if (expression === 'confused') {
      return (
        <g className="gq-char-eyes" style={{ transformOrigin: `${cx}px ${eyeY}px` }}>
          <circle cx={leftEyeX} cy={eyeY + 0.6} r="2.5" fill={eyeColor} />
          <circle cx={rightEyeX} cy={eyeY - 0.4} r="3.2" fill={eyeColor} />
          <circle cx={leftEyeX + 0.8} cy={eyeY - 0.2} r="0.8" fill="#FFFFFF" />
          <circle cx={rightEyeX + 0.9} cy={eyeY - 1.2} r="1" fill="#FFFFFF" />
        </g>
      );
    }

    const r = expression === 'curious' ? 3.2 : 2.9;
    return (
      <g className="gq-char-eyes" style={{ transformOrigin: `${cx}px ${eyeY}px` }}>
        <circle cx={leftEyeX + pupilOffsetX} cy={eyeY + pupilOffsetY} r={r} fill={eyeColor} />
        <circle cx={rightEyeX + pupilOffsetX} cy={eyeY + pupilOffsetY} r={r} fill={eyeColor} />
        <circle cx={leftEyeX + pupilOffsetX + 1} cy={eyeY + pupilOffsetY - 1} r="1" fill="#FFFFFF" />
        <circle cx={rightEyeX + pupilOffsetX + 1} cy={eyeY + pupilOffsetY - 1} r="1" fill="#FFFFFF" />
      </g>
    );
  };

  const renderMouthShape = () => {
    switch (expression) {
      case 'curious':
        return (
          <path
            d={`M${cx - 4.5} ${mouthY + 0.5} Q${cx + 0.5} ${mouthY + 2} ${cx + 5} ${mouthY - 1.5}`}
            stroke={eyeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'thinking':
        return (
          <path
            d={`M${cx - 4} ${mouthY + 1} H${cx + 4}`}
            stroke={eyeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        );
      case 'confused':
        return (
          <path
            d={`M${cx - 5.5} ${mouthY + 1.5} Q${cx - 2} ${mouthY - 1.5} ${cx} ${mouthY + 1} Q${cx + 2.5} ${mouthY + 3} ${cx + 5.5} ${mouthY}`}
            stroke={eyeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'surprised':
        return (
          <ellipse
            cx={cx}
            cy={mouthY + 0.5}
            rx="3.4"
            ry="4.2"
            fill="#C95954"
            stroke={eyeColor}
            strokeWidth="2.1"
          />
        );
      case 'explaining':
        return (
          <path
            d={`M${cx - 5.5} ${mouthY - 1} H${cx + 5.5} C${cx + 5.5} ${mouthY + 5} ${cx - 5.5} ${mouthY + 5} ${cx - 5.5} ${mouthY - 1}Z`}
            fill="#FFFFFF"
            stroke={eyeColor}
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
        );
      case 'encouraging':
        return (
          <path
            d={`M${cx - 6.5} ${mouthY - 1} Q${cx} ${mouthY + 5.5} ${cx + 6.5} ${mouthY - 1}`}
            stroke={eyeColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'celebrating':
        return (
          <path
            d={`M${cx - 6.5} ${mouthY - 1.5} H${cx + 6.5} C${cx + 6.5} ${mouthY + 6} ${cx - 6.5} ${mouthY + 6} ${cx - 6.5} ${mouthY - 1.5}Z`}
            fill="#FFFFFF"
            stroke={eyeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        );
      default:
        return (
          <path
            d={`M${cx - 5.5} ${mouthY - 0.5} Q${cx} ${mouthY + 4.5} ${cx + 5.5} ${mouthY - 0.5}`}
            stroke={eyeColor}
            strokeWidth="2.3"
            strokeLinecap="round"
            fill="none"
          />
        );
    }
  };

  return (
    <g>
      {renderBrows()}
      {renderEyes()}
      <g
        className={isTalking ? 'gq-char-mouth-talk' : ''}
        style={{ transformOrigin: `${cx}px ${mouthY}px` }}
      >
        {renderMouthShape()}
      </g>
    </g>
  );
};
