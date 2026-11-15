/**
 * ============================================================================
 * GRAMMAR QUEST — MASTER 2D VECTOR CHARACTER: ARJUN
 * ============================================================================
 * Consistent master anatomy (viewBox 0 0 180 240, baseline y=224):
 * - Wavy dark hair (#1F2437)
 * - Warm medium-deep skin (#DD9768)
 * - Turquoise collared overshirt (#4FD3C4 / #8DECE0) over cream tee (#FFF8EB)
 * - Deep navy backpack straps (#263A70), slate-navy trousers (#2F437A)
 * - Optional study pencil / notebook in learning poses
 * ============================================================================
 */

import React from 'react';
import type { CharacterExpression, CharacterPose } from './types';
import { HumanFaceFeatures } from './expressions';

interface ArjunSvgProps {
  pose: CharacterPose;
  expression: CharacterExpression;
  isTalking?: boolean;
  className?: string;
}

export const ArjunSvg: React.FC<ArjunSvgProps> = ({
  pose,
  expression,
  isTalking = false,
  className = '',
}) => {
  const headTilt =
    pose === 'thinking'
      ? 'rotate(5 90 92)'
      : pose === 'confused'
        ? 'rotate(-7 90 92)'
        : pose === 'reading'
          ? 'rotate(5 90 92)'
          : pose === 'walking'
            ? 'rotate(2 90 92)'
            : undefined;

  const torsoShift =
    pose === 'walking'
      ? 'translate(0 -2) rotate(2 90 175)'
      : pose === 'celebrating'
        ? 'translate(0 -3)'
        : undefined;

  const renderLegs = () => {
    if (pose === 'walking') {
      return (
        <g id="arjun-legs-walking">
          <path
            d="M78 172L66 214H78L90 174Z"
            fill="#2F437A"
            stroke="#263A70"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <ellipse cx="70" cy="217" rx="10" ry="5.5" fill="#FFFDF7" stroke="#263A70" strokeWidth="2.3" />
          <path
            d="M95 172L109 214H121L107 172Z"
            fill="#2F437A"
            stroke="#263A70"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <ellipse cx="117" cy="217" rx="10" ry="5.5" fill="#FFFDF7" stroke="#263A70" strokeWidth="2.3" />
        </g>
      );
    }

    return (
      <g id="arjun-legs-standing">
        <rect x="74" y="172" width="13" height="43" rx="5" fill="#2F437A" stroke="#263A70" strokeWidth="2.2" />
        <rect x="93" y="172" width="13" height="43" rx="5" fill="#2F437A" stroke="#263A70" strokeWidth="2.2" />
        <ellipse cx="79" cy="217" rx="10" ry="5.5" fill="#FFFDF7" stroke="#263A70" strokeWidth="2.3" />
        <ellipse cx="101" cy="217" rx="10" ry="5.5" fill="#FFFDF7" stroke="#263A70" strokeWidth="2.3" />
      </g>
    );
  };

  const renderArmsAndProps = () => {
    switch (pose) {
      case 'walking':
        return (
          <g>
            {/* Left arm forward */}
            <path d="M64 123L51 153" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M64 123L51 153" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" />
            <circle cx="50" cy="156" r="6" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
            {/* Right arm holding yellow study pencil/notebook */}
            <path d="M116 123L128 153" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M116 123L128 153" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" />
            <rect
              x="119"
              y="144"
              width="21"
              height="27"
              rx="4"
              transform="rotate(-10 119 144)"
              fill="#FFC64B"
              stroke="#263A70"
              strokeWidth="2.2"
            />
            <circle cx="129" cy="156" r="6" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'waving':
        return (
          <g>
            {/* Left arm resting with pencil */}
            <path d="M64 123L58 156" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M64 123L58 156" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" />
            <circle cx="57" cy="159" r="6" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />

            {/* Right arm raised waving */}
            <g className="gq-char-arm-wave" style={{ transformOrigin: '116px 123px' }}>
              <path
                d="M116 123L136 109L142 87"
                stroke="#263A70"
                strokeWidth="14.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M116 123L136 109L142 87"
                stroke="#4FD3C4"
                strokeWidth="9.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="143" cy="83" r="6.5" fill="#DD9768" stroke="#263A70" strokeWidth="2.3" />
            </g>
          </g>
        );

      case 'reading':
        return (
          <g>
            <path d="M63 123L61 146L76 151" stroke="#263A70" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M63 123L61 146L76 151" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M117 123L119 146L104 151" stroke="#263A70" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M117 123L119 146L104 151" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Open Yellow-Spined Book */}
            <path
              d="M64 136L90 141L116 136V165L90 170L64 165V136Z"
              fill="#FFC64B"
              stroke="#263A70"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M67 138L90 142.5L113 138V162L90 166.5L67 162V138Z"
              fill="#FFFDF7"
              stroke="#263A70"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <line x1="90" y1="142.5" x2="90" y2="166.5" stroke="#263A70" strokeWidth="2" />
            <line x1="72" y1="147" x2="84" y2="149" stroke="#263A70" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="96" y1="149" x2="108" y2="147" stroke="#4FD3C4" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="71" cy="153" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.1" />
            <circle cx="109" cy="153" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.1" />
          </g>
        );

      case 'pointing':
        return (
          <g>
            {/* Left arm at side */}
            <path d="M64 123L58 156" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M64 123L58 156" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" />
            <circle cx="57" cy="159" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />

            {/* Right arm pointing */}
            <g className="gq-char-arm-point" style={{ transformOrigin: '116px 123px' }}>
              <path d="M116 123L151 118" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
              <path d="M116 123L151 118" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" />
              <circle cx="152" cy="118" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.1" />
              <line x1="156" y1="117" x2="166" y2="116" stroke="#263A70" strokeWidth="4.6" strokeLinecap="round" />
              <line x1="156" y1="117" x2="166" y2="116" stroke="#DD9768" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          </g>
        );

      case 'explaining':
        return (
          <g>
            <path d="M64 123L58 155" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M64 123L58 155" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" />
            <rect
              x="47"
              y="143"
              width="22"
              height="28"
              rx="4"
              transform="rotate(8 47 143)"
              fill="#FFC64B"
              stroke="#263A70"
              strokeWidth="2.2"
            />
            <circle cx="58" cy="157" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />

            <g className="gq-char-arm-gesture" style={{ transformOrigin: '116px 123px' }}>
              <path
                d="M116 123L135 130L145 112"
                stroke="#263A70"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M116 123L135 130L145 112"
                stroke="#4FD3C4"
                strokeWidth="9.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="147" cy="108" r="6.2" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
            </g>
          </g>
        );

      case 'thinking':
        return (
          <g>
            {/* Left arm crossed */}
            <path
              d="M64 123L62 145L88 143"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M64 123L62 145L88 143"
              stroke="#4FD3C4"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right hand holding pencil near chin */}
            <path
              d="M116 123L125 137L105 103"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M116 123L125 137L105 103"
              stroke="#4FD3C4"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Pencil prop */}
            <line x1="100" y1="106" x2="112" y2="87" stroke="#263A70" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="106" x2="112" y2="87" stroke="#FFC64B" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="102" cy="102" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'confused':
        return (
          <g>
            {/* Left hand scratching back of hair */}
            <path
              d="M64 123L47 110L61 81"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M64 123L47 110L61 81"
              stroke="#4FD3C4"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="62" cy="78" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />

            {/* Right arm open shrug */}
            <path
              d="M116 123L133 137L143 128"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M116 123L133 137L143 128"
              stroke="#4FD3C4"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="145" cy="125" r="6" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'celebrating':
        return (
          <g>
            <g className="gq-char-arm-wave" style={{ transformOrigin: '64px 123px' }}>
              <path
                d="M64 123L45 103L40 77"
                stroke="#263A70"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M64 123L45 103L40 77"
                stroke="#4FD3C4"
                strokeWidth="9.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="39" cy="73" r="6.2" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
            </g>
            <g className="gq-char-arm-wave" style={{ transformOrigin: '116px 123px' }}>
              <path
                d="M116 123L135 103L140 77"
                stroke="#263A70"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M116 123L135 103L140 77"
                stroke="#4FD3C4"
                strokeWidth="9.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="141" cy="73" r="6.2" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
            </g>
            <path d="M29 57L32 63L38 65L32 67L29 73L26 67L20 65L26 63Z" fill="#8DECE0" stroke="#263A70" strokeWidth="1.5" />
            <path d="M151 56L153.5 61L159 63L153.5 65L151 70L148.5 65L143 63L148.5 61Z" fill="#FFC64B" stroke="#263A70" strokeWidth="1.5" />
          </g>
        );

      case 'encouraging':
        return (
          <g>
            {/* Left arm relaxed */}
            <path d="M64 123L58 156" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M64 123L58 156" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" />
            <circle cx="57" cy="159" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />

            {/* Right arm friendly thumbs-up */}
            <path
              d="M116 123L135 133L139 115"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M116 123L135 133L139 115"
              stroke="#4FD3C4"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g transform="translate(131 100)">
              <rect x="2" y="9" width="14" height="12" rx="5" fill="#DD9768" stroke="#263A70" strokeWidth="2.1" />
              <path
                d="M8 9V3C8 1 12 1 12 4V9"
                fill="#DD9768"
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
            <path d="M64 123L58 156" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M64 123L58 156" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" />
            <circle cx="57" cy="159" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />

            <path d="M116 123L122 155" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M116 123L122 155" stroke="#4FD3C4" strokeWidth="9.5" strokeLinecap="round" />
            {/* Study notebook in right hand */}
            <rect
              x="114"
              y="144"
              width="22"
              height="28"
              rx="4"
              transform="rotate(-8 114 144)"
              fill="#FFC64B"
              stroke="#263A70"
              strokeWidth="2.2"
            />
            <circle cx="122" cy="157" r="5.8" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
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
      {/* Subtle Ground Shadow */}
      <ellipse cx="90" cy="224" rx="35" ry="5.5" fill="#263A70" opacity="0.1" />

      {/* Legs & Shoes */}
      {renderLegs()}

      {/* Torso + Arms + Head */}
      <g className="gq-char-body" transform={torsoShift}>
        {/* Turquoise Overshirt */}
        <path
          d="M64 121C64 113 74 109 90 109C106 109 116 113 116 121L120 175H60L64 121Z"
          fill="#4FD3C4"
          stroke="#263A70"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Cream Inner Tee */}
        <path
          d="M78 110H102L99 175H81L78 110Z"
          fill="#FFF8EB"
          stroke="#263A70"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Overshirt Collar */}
        <path
          d="M78 110L85 125L90 116L95 125L102 110"
          fill="#8DECE0"
          stroke="#263A70"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Navy Backpack Straps */}
        <path d="M70 113L67 174" stroke="#263A70" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M110 113L113 174" stroke="#263A70" strokeWidth="5.5" strokeLinecap="round" />

        {/* Neck */}
        <rect
          x="83"
          y="96"
          width="14"
          height="16"
          rx="6"
          fill="#C98456"
          stroke="#263A70"
          strokeWidth="2.2"
        />

        {/* Head Group */}
        <g className="gq-char-head" transform={headTilt}>
          <circle cx="65" cy="73" r="6" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
          <circle cx="115" cy="73" r="6" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />

          {/* Face Silhouette */}
          <path
            d="M66 68C66 47 77 37 90 37C103 37 114 47 114 68C114 88 103 100 90 100C77 100 66 88 66 68Z"
            fill="#DD9768"
            stroke="#263A70"
            strokeWidth="2.5"
          />

          {/* Wavy Dark Hair */}
          <path
            d="M64 67C62 47 74 29 91 30C108 31 119 45 115 66C111 55 104 51 95 53C85 55 75 52 64 67Z"
            fill="#1F2437"
            stroke="#263A70"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Expression Features */}
          <HumanFaceFeatures
            expression={expression}
            pose={pose}
            cx={90}
            cy={70}
            isTalking={isTalking}
          />
        </g>

        {/* Arms & Props */}
        {renderArmsAndProps()}
      </g>
    </svg>
  );
};
