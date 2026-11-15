/**
 * ============================================================================
 * GRAMMAR QUEST — MASTER 2D VECTOR CHARACTER: GYAN (THE LEARNING ROBOT)
 * ============================================================================
 * Consistent master anatomy (viewBox 0 0 180 240, baseline y=224):
 * - Colour scheme: Turquoise (#8DECE0), White (#FFFFFF), Orange (#F59B19), Navy (#263A70)
 * - Rounded friendly 2D robot silhouette with leaf-sprout antenna
 * - Deep navy screen visor with expressive turquoise eyes & orange mouth cues
 * - Hover / glide base aligned cleanly to shared 224 ground baseline
 * ============================================================================
 */

import React from 'react';
import type { CharacterExpression, CharacterPose } from './types';
import { GyanScreenFace } from './expressions';

interface GyanSvgProps {
  pose: CharacterPose;
  expression: CharacterExpression;
  isTalking?: boolean;
  className?: string;
}

export const GyanSvg: React.FC<GyanSvgProps> = ({
  pose,
  expression,
  isTalking = false,
  className = '',
}) => {
  const headTilt =
    pose === 'thinking'
      ? 'rotate(-6 90 135)'
      : pose === 'confused'
        ? 'rotate(8 90 135)'
        : pose === 'reading'
          ? 'rotate(4 90 135)'
          : pose === 'walking'
            ? 'rotate(3 90 135)'
            : undefined;

  const bodyShift =
    pose === 'walking'
      ? 'translate(0 -3) rotate(3 90 190)'
      : pose === 'celebrating'
        ? 'translate(0 -6)'
        : undefined;

  const renderArmsAndProps = () => {
    switch (pose) {
      case 'walking':
        return (
          <g>
            {/* Motion glide lines behind base */}
            <line x1="48" y1="211" x2="64" y2="211" stroke="#8DECE0" strokeWidth="3" strokeLinecap="round" />
            <line x1="42" y1="217" x2="59" y2="217" stroke="#F59B19" strokeWidth="2.5" strokeLinecap="round" />
            {/* Left arm back, right arm forward */}
            <path d="M61 172L42 184" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="40" cy="185" r="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2.2" />
            <path d="M119 172L139 160" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="141" cy="159" r="6" fill="#F59B19" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'waving':
        return (
          <g>
            <g className="gq-char-arm-wave" style={{ transformOrigin: '61px 172px' }}>
              <path d="M61 172L44 152" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
              <circle cx="42" cy="150" r="6.5" fill="#F59B19" stroke="#263A70" strokeWidth="2.2" />
            </g>
            <path d="M119 172L131 187" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="132" cy="189" r="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'reading':
        return (
          <g>
            <path d="M61 172L68 185" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <path d="M119 172L112 185" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            {/* Open compact book */}
            <path
              d="M66 173L90 178L114 173V197L90 202L66 197V173Z"
              fill="#F59B19"
              stroke="#263A70"
              strokeWidth="2.3"
              strokeLinejoin="round"
            />
            <path
              d="M69 175L90 179.5L111 175V194L90 198.5L69 194V175Z"
              fill="#FFFFFF"
              stroke="#263A70"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <line x1="90" y1="179.5" x2="90" y2="198.5" stroke="#263A70" strokeWidth="1.9" />
            <circle cx="68" cy="186" r="5.5" fill="#8DECE0" stroke="#263A70" strokeWidth="2.1" />
            <circle cx="112" cy="186" r="5.5" fill="#8DECE0" stroke="#263A70" strokeWidth="2.1" />
          </g>
        );

      case 'pointing':
        return (
          <g>
            <path d="M61 172L49 186" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="48" cy="188" r="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2.2" />

            <g className="gq-char-arm-point" style={{ transformOrigin: '119px 172px' }}>
              <path d="M119 172L146 167" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
              <circle cx="147" cy="167" r="6" fill="#F59B19" stroke="#263A70" strokeWidth="2.2" />
              <line x1="152" y1="167" x2="162" y2="167" stroke="#263A70" strokeWidth="3.8" strokeLinecap="round" />
            </g>
          </g>
        );

      case 'explaining':
        return (
          <g>
            <path d="M61 172L47 166" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="45" cy="165" r="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2.2" />
            <g className="gq-char-arm-gesture" style={{ transformOrigin: '119px 172px' }}>
              <path d="M119 172L138 158" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
              <circle cx="140" cy="156" r="6.5" fill="#F59B19" stroke="#263A70" strokeWidth="2.2" />
              <circle cx="149" cy="147" r="2.8" fill="#8DECE0" stroke="#263A70" strokeWidth="1.5" />
            </g>
          </g>
        );

      case 'thinking':
        return (
          <g>
            <path d="M61 172L50 187" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="49" cy="189" r="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2.2" />
            {/* Right hand resting at visor chin */}
            <path d="M119 172L126 160L106 156" stroke="#263A70" strokeWidth="5.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="104" cy="156" r="5.8" fill="#F59B19" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'confused':
        return (
          <g>
            {/* Left arm shrugged outward */}
            <path d="M61 172L42 162L38 150" stroke="#263A70" strokeWidth="5.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="37" cy="147" r="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2.2" />
            {/* Right hand scratching near ear disc */}
            <path d="M119 172L135 150L125 129" stroke="#263A70" strokeWidth="5.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="124" cy="127" r="5.8" fill="#F59B19" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'celebrating':
        return (
          <g>
            <g className="gq-char-arm-wave" style={{ transformOrigin: '61px 172px' }}>
              <path d="M61 172L42 146" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
              <circle cx="40" cy="144" r="6.5" fill="#F59B19" stroke="#263A70" strokeWidth="2.2" />
            </g>
            <g className="gq-char-arm-wave" style={{ transformOrigin: '119px 172px' }}>
              <path d="M119 172L138 146" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
              <circle cx="140" cy="144" r="6.5" fill="#F59B19" stroke="#263A70" strokeWidth="2.2" />
            </g>
            <path d="M35 112L37.5 117L43 119L37.5 121L35 126L32.5 121L27 119L32.5 117Z" fill="#8DECE0" stroke="#263A70" strokeWidth="1.5" />
            <path d="M145 110L147.5 115L153 117L147.5 119L145 124L142.5 119L137 117L142.5 115Z" fill="#F59B19" stroke="#263A70" strokeWidth="1.5" />
          </g>
        );

      case 'encouraging':
        return (
          <g>
            <path d="M61 172L49 186" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="48" cy="188" r="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2.2" />
            <path d="M119 172L135 162" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <g transform="translate(131 146)">
              <rect x="2" y="8" width="13" height="11" rx="5" fill="#F59B19" stroke="#263A70" strokeWidth="2.1" />
              <path
                d="M7 8V3C7 1 11 1 11 4V8"
                fill="#F59B19"
                stroke="#263A70"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
            </g>
          </g>
        );

      /* Default: standing-idle */
      default:
        return (
          <g>
            <path d="M61 172L50 187" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="48" cy="189" r="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2.2" />
            <path d="M119 172L130 187" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="132" cy="189" r="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 180 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Ground Hover Shadow */}
      <ellipse cx="90" cy="224" rx="28" ry="5" fill="#263A70" opacity="0.1" />

      <g className="gq-char-body" transform={bodyShift}>
        {/* Hover Thruster / Base Foot */}
        <path
          d="M74 208H106L101 217H79L74 208Z"
          fill="#8DECE0"
          stroke="#263A70"
          strokeWidth="2.3"
          strokeLinejoin="round"
        />

        {/* Rounded Robot Torso */}
        <rect
          x="62"
          y="162"
          width="56"
          height="46"
          rx="18"
          fill="#FFFFFF"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        {/* Turquoise Collar Trim */}
        <rect x="74" y="160" width="32" height="7" rx="3.5" fill="#8DECE0" stroke="#263A70" strokeWidth="2" />
        {/* Chest Crest Badge */}
        <circle cx="90" cy="185" r="10.5" fill="#FFF1D5" stroke="#F59B19" strokeWidth="2.2" />
        <path
          d="M90 179L92 183.5L96.5 184L93 187L94 191.5L90 189L86 191.5L87 187L83.5 184L88 183.5Z"
          fill="#F59B19"
        />

        {/* Head Group */}
        <g className="gq-char-head" transform={headTilt}>
          {/* Leaf-Sprout Antenna */}
          <line x1="90" y1="108" x2="90" y2="91" stroke="#263A70" strokeWidth="2.6" strokeLinecap="round" />
          <path
            d="M90 92C90 81 102 77 107 83C109 89 99 95 90 92Z"
            fill="#8DECE0"
            stroke="#263A70"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M90 92C86 82 76 80 73 86C72 91 82 95 90 92Z"
            fill="#F59B19"
            stroke="#263A70"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Orange Ear Discs */}
          <rect x="48" y="125" width="9" height="22" rx="4.5" fill="#F59B19" stroke="#263A70" strokeWidth="2.3" />
          <rect x="123" y="125" width="9" height="22" rx="4.5" fill="#F59B19" stroke="#263A70" strokeWidth="2.3" />

          {/* Rounded Head Shell */}
          <rect
            x="55"
            y="107"
            width="70"
            height="56"
            rx="21"
            fill="#FFFFFF"
            stroke="#263A70"
            strokeWidth="2.5"
          />

          {/* Navy Screen Visor */}
          <rect x="63" y="116" width="54" height="38" rx="13" fill="#263A70" />

          {/* Screen Facial Expressions */}
          <GyanScreenFace
            expression={expression}
            pose={pose}
            cx={90}
            cy={136}
            isTalking={isTalking}
          />
        </g>

        {/* Articulated Arms & Props */}
        {renderArmsAndProps()}
      </g>
    </svg>
  );
};
