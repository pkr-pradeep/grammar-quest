/**
 * ============================================================================
 * GRAMMAR QUEST — MASTER 2D VECTOR CHARACTER: MIRA
 * ============================================================================
 * Consistent master anatomy (viewBox 0 0 180 240, baseline y=224):
 * - Dark brown hair (#3A241D) with centre part & braided side tail + yellow ribbon
 * - Warm light-medium skin (#F2B488) with coral bindi (#F36F68) & blush
 * - Sunshine-yellow collared kurti (#FFC64B), cream collar (#FFF1D5), orange placket (#F59B19)
 * - Deep navy satchel strap & trousers (#263A70), white/navy shoes
 * - Turquoise notebook (#8DECE0)
 * ============================================================================
 */

import React from 'react';
import type { CharacterExpression, CharacterPose } from './types';
import { HumanFaceFeatures } from './expressions';

interface MiraSvgProps {
  pose: CharacterPose;
  expression: CharacterExpression;
  isTalking?: boolean;
  className?: string;
}

export const MiraSvg: React.FC<MiraSvgProps> = ({
  pose,
  expression,
  isTalking = false,
  className = '',
}) => {
  const headTilt =
    pose === 'thinking'
      ? 'rotate(-5 90 95)'
      : pose === 'confused'
        ? 'rotate(7 90 95)'
        : pose === 'reading'
          ? 'rotate(5 90 95)'
          : pose === 'walking'
            ? 'rotate(2 90 95)'
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
        <g id="mira-legs-walking">
          {/* Back leg */}
          <path
            d="M80 172L68 214H79L90 174Z"
            fill="#263A70"
            stroke="#263A70"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <ellipse cx="72" cy="217" rx="9" ry="5.5" fill="#FFFDF7" stroke="#263A70" strokeWidth="2.3" />
          {/* Front leg */}
          <path
            d="M95 172L108 214H119L105 172Z"
            fill="#263A70"
            stroke="#263A70"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <ellipse cx="115" cy="217" rx="9" ry="5.5" fill="#FFFDF7" stroke="#263A70" strokeWidth="2.3" />
        </g>
      );
    }

    return (
      <g id="mira-legs-standing">
        <rect x="75" y="172" width="12" height="43" rx="5" fill="#263A70" stroke="#263A70" strokeWidth="2.2" />
        <rect x="93" y="172" width="12" height="43" rx="5" fill="#263A70" stroke="#263A70" strokeWidth="2.2" />
        <ellipse cx="79" cy="217" rx="9.5" ry="5.5" fill="#FFFDF7" stroke="#263A70" strokeWidth="2.3" />
        <ellipse cx="101" cy="217" rx="9.5" ry="5.5" fill="#FFFDF7" stroke="#263A70" strokeWidth="2.3" />
      </g>
    );
  };

  const renderArmsAndProps = () => {
    switch (pose) {
      case 'walking':
        return (
          <g>
            {/* Left arm swinging back */}
            <path
              d="M68 128L55 158"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M68 128L55 158"
              stroke="#FFC64B"
              strokeWidth="9.5"
              strokeLinecap="round"
            />
            <circle cx="54" cy="161" r="6" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

            {/* Right arm swinging forward holding notebook */}
            <path
              d="M112 128L124 156"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M112 128L124 156"
              stroke="#FFC64B"
              strokeWidth="9.5"
              strokeLinecap="round"
            />
            <rect
              x="114"
              y="148"
              width="22"
              height="28"
              rx="4"
              transform="rotate(-12 114 148)"
              fill="#8DECE0"
              stroke="#263A70"
              strokeWidth="2.3"
            />
            <circle cx="123" cy="158" r="6" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'waving':
        return (
          <g>
            {/* Left arm holding notebook at hip */}
            <path d="M68 128L61 155" stroke="#FFC64B" strokeWidth="12" strokeLinecap="round" />
            <rect
              x="54"
              y="144"
              width="24"
              height="30"
              rx="4"
              transform="rotate(8 54 144)"
              fill="#8DECE0"
              stroke="#263A70"
              strokeWidth="2.3"
            />
            <rect x="61" y="152" width="10" height="4.5" rx="1.5" transform="rotate(8 61 152)" fill="#FFFFFF" />
            <circle cx="62" cy="158" r="6" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

            {/* Right arm raised waving */}
            <g className="gq-char-arm-wave" style={{ transformOrigin: '112px 127px' }}>
              <path
                d="M112 127L131 114L138 92"
                stroke="#263A70"
                strokeWidth="15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M112 127L131 114L138 92"
                stroke="#FFC64B"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="139" cy="88" r="6.5" fill="#F2B488" stroke="#263A70" strokeWidth="2.3" />
            </g>
          </g>
        );

      case 'reading':
        return (
          <g>
            {/* Both arms forward holding open book */}
            <path d="M67 128L63 149L78 154" stroke="#263A70" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M67 128L63 149L78 154" stroke="#FFC64B" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M113 128L117 149L102 154" stroke="#263A70" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M113 128L117 149L102 154" stroke="#FFC64B" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Open Turquoise Book */}
            <path
              d="M65 139L90 144L115 139V167L90 172L65 167V139Z"
              fill="#8DECE0"
              stroke="#263A70"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M68 141L90 145.5L112 141V164L90 168.5L68 164V141Z"
              fill="#FFFDF7"
              stroke="#263A70"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <line x1="90" y1="145.5" x2="90" y2="168.5" stroke="#263A70" strokeWidth="2" />
            <line x1="73" y1="149" x2="85" y2="151" stroke="#F59B19" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="95" y1="151" x2="107" y2="149" stroke="#263A70" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="72" cy="155" r="5.5" fill="#F2B488" stroke="#263A70" strokeWidth="2.1" />
            <circle cx="108" cy="155" r="5.5" fill="#F2B488" stroke="#263A70" strokeWidth="2.1" />
          </g>
        );

      case 'pointing':
        return (
          <g>
            {/* Left arm holding notebook */}
            <path d="M68 128L62 156" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M68 128L62 156" stroke="#FFC64B" strokeWidth="9.5" strokeLinecap="round" />
            <rect
              x="53"
              y="144"
              width="25"
              height="31"
              rx="4"
              transform="rotate(8 53 144)"
              fill="#8DECE0"
              stroke="#263A70"
              strokeWidth="2.3"
            />
            <circle cx="63" cy="158" r="5.8" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

            {/* Right arm pointing outward */}
            <g className="gq-char-arm-point" style={{ transformOrigin: '112px 127px' }}>
              <path
                d="M112 127L148 122"
                stroke="#263A70"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M112 127L148 122"
                stroke="#FFC64B"
                strokeWidth="9.5"
                strokeLinecap="round"
              />
              <circle cx="149" cy="122" r="5.8" fill="#F2B488" stroke="#263A70" strokeWidth="2.1" />
              <line x1="153" y1="121" x2="163" y2="120" stroke="#263A70" strokeWidth="4.6" strokeLinecap="round" />
              <line x1="153" y1="121" x2="163" y2="120" stroke="#F2B488" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          </g>
        );

      case 'explaining':
        return (
          <g>
            {/* Left arm holding notebook against side */}
            <path d="M68 128L61 155" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M68 128L61 155" stroke="#FFC64B" strokeWidth="9.5" strokeLinecap="round" />
            <rect
              x="54"
              y="144"
              width="25"
              height="31"
              rx="4"
              transform="rotate(8 54 144)"
              fill="#8DECE0"
              stroke="#263A70"
              strokeWidth="2.3"
            />
            <circle cx="62" cy="158" r="5.8" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

            {/* Right arm open-palm gesture */}
            <g className="gq-char-arm-gesture" style={{ transformOrigin: '112px 127px' }}>
              <path
                d="M112 127L131 134L142 117"
                stroke="#263A70"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M112 127L131 134L142 117"
                stroke="#FFC64B"
                strokeWidth="9.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="144" cy="113" r="6.2" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
            </g>
          </g>
        );

      case 'thinking':
        return (
          <g>
            {/* Left arm holding notebook across waist */}
            <path d="M68 128L64 155" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M68 128L64 155" stroke="#FFC64B" strokeWidth="9.5" strokeLinecap="round" />
            <rect
              x="59"
              y="146"
              width="25"
              height="30"
              rx="4"
              transform="rotate(6 59 146)"
              fill="#8DECE0"
              stroke="#263A70"
              strokeWidth="2.3"
            />
            <circle cx="66" cy="159" r="5.8" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

            {/* Right hand resting on chin */}
            <path
              d="M112 127L122 142L103 108"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M112 127L122 142L103 108"
              stroke="#FFC64B"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="101" cy="106" r="5.8" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'confused':
        return (
          <g>
            {/* Left shoulder shrug out */}
            <path
              d="M68 128L51 142L42 132"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M68 128L51 142L42 132"
              stroke="#FFC64B"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="40" cy="129" r="6" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

            {/* Right hand near head */}
            <path
              d="M112 127L129 116L117 89"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M112 127L129 116L117 89"
              stroke="#FFC64B"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="116" cy="86" r="5.8" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
          </g>
        );

      case 'celebrating':
        return (
          <g>
            {/* Both arms raised high */}
            <g className="gq-char-arm-wave" style={{ transformOrigin: '68px 127px' }}>
              <path
                d="M68 127L49 107L44 82"
                stroke="#263A70"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M68 127L49 107L44 82"
                stroke="#FFC64B"
                strokeWidth="9.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="43" cy="78" r="6.2" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
            </g>
            <g className="gq-char-arm-wave" style={{ transformOrigin: '112px 127px' }}>
              <path
                d="M112 127L131 107L136 82"
                stroke="#263A70"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M112 127L131 107L136 82"
                stroke="#FFC64B"
                strokeWidth="9.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="137" cy="78" r="6.2" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
            </g>
            {/* 2D Sparkle accents */}
            <path d="M32 62L35 68L41 70L35 72L32 78L29 72L23 70L29 68Z" fill="#FFC64B" stroke="#263A70" strokeWidth="1.5" />
            <path d="M148 60L150.5 65L156 67L150.5 69L148 74L145.5 69L140 67L145.5 65Z" fill="#8DECE0" stroke="#263A70" strokeWidth="1.5" />
          </g>
        );

      case 'encouraging':
        return (
          <g>
            {/* Left arm holding turquoise notebook */}
            <path d="M68 128L62 156" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M68 128L62 156" stroke="#FFC64B" strokeWidth="9.5" strokeLinecap="round" />
            <rect
              x="54"
              y="144"
              width="25"
              height="31"
              rx="4"
              transform="rotate(8 54 144)"
              fill="#8DECE0"
              stroke="#263A70"
              strokeWidth="2.3"
            />
            <circle cx="62" cy="158" r="5.8" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

            {/* Right arm giving warm thumbs up */}
            <path
              d="M112 127L131 136L136 118"
              stroke="#263A70"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M112 127L131 136L136 118"
              stroke="#FFC64B"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g transform="translate(128 103)">
              <rect x="2" y="9" width="14" height="12" rx="5" fill="#F2B488" stroke="#263A70" strokeWidth="2.1" />
              <path
                d="M8 9V3C8 1 12 1 12 4V9"
                fill="#F2B488"
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
            {/* Left arm holding turquoise notebook neatly */}
            <path d="M68 128L63 156" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M68 128L63 156" stroke="#FFC64B" strokeWidth="9.5" strokeLinecap="round" />
            {/* Right arm resting naturally */}
            <path d="M112 128L118 158" stroke="#263A70" strokeWidth="14" strokeLinecap="round" />
            <path d="M112 128L118 158" stroke="#FFC64B" strokeWidth="9.5" strokeLinecap="round" />
            <circle cx="119" cy="161" r="5.8" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

            <rect
              x="54"
              y="143"
              width="27"
              height="34"
              rx="4.5"
              transform="rotate(7 54 143)"
              fill="#8DECE0"
              stroke="#263A70"
              strokeWidth="2.3"
            />
            <rect
              x="61"
              y="151"
              width="12"
              height="5"
              rx="1.5"
              transform="rotate(7 61 151)"
              fill="#FFFFFF"
            />
            <circle cx="64" cy="158" r="5.8" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
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
      <ellipse cx="90" cy="224" rx="34" ry="5.5" fill="#263A70" opacity="0.1" />

      {/* Legs & Shoes */}
      {renderLegs()}

      {/* Torso + Arms + Head */}
      <g className="gq-char-body" transform={torsoShift}>
        {/* Back Hair Braid (consistent side braid with yellow ribbon) */}
        <path
          d="M67 84C59 102 58 124 64 139C69 139 74 132 76 121"
          fill="#3A241D"
          stroke="#263A70"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M57 116L67 121L59 127L57 116Z"
          fill="#FFC64B"
          stroke="#263A70"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="66" cy="121" r="3.4" fill="#F59B19" stroke="#263A70" strokeWidth="1.8" />

        {/* Sunshine Yellow Collared Kurti Tunic */}
        <path
          d="M68 124C68 117 76 113 90 113C104 113 112 117 112 124L117 177H63L68 124Z"
          fill="#FFC64B"
          stroke="#263A70"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Cream Collar & Orange Placket */}
        <path
          d="M80 114L90 125L100 114"
          fill="#FFF1D5"
          stroke="#263A70"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <line x1="90" y1="125" x2="90" y2="145" stroke="#F59B19" strokeWidth="2.5" strokeLinecap="round" />

        {/* Deep Navy Satchel Strap */}
        <path d="M72 116L110 176" stroke="#263A70" strokeWidth="5.8" strokeLinecap="round" />

        {/* Neck */}
        <rect
          x="84"
          y="101"
          width="12"
          height="15"
          rx="5"
          fill="#E8A477"
          stroke="#263A70"
          strokeWidth="2.2"
        />

        {/* Head Group */}
        <g className="gq-char-head" transform={headTilt}>
          {/* Ears */}
          <circle cx="66" cy="79" r="5.5" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
          <circle cx="114" cy="79" r="5.5" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

          {/* Face Silhouette */}
          <path
            d="M67 74C67 55 77 45 90 45C103 45 113 55 113 74C113 92 103 104 90 104C77 104 67 92 67 74Z"
            fill="#F2B488"
            stroke="#263A70"
            strokeWidth="2.5"
          />

          {/* Centre-Parted Dark Brown Hair */}
          <path
            d="M66 74C65 53 76 40 90 40C104 40 115 53 114 74C110 62 101 57 90 54C79 57 70 62 66 74Z"
            fill="#3A241D"
            stroke="#263A70"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Subtle Bindi & Cheek Blush */}
          <circle cx="90" cy="63" r="2.1" fill="#F36F68" />
          <ellipse cx="75" cy="84" rx="4" ry="2.2" fill="#F36F68" opacity="0.32" />
          <ellipse cx="105" cy="84" rx="4" ry="2.2" fill="#F36F68" opacity="0.32" />

          {/* Expression Features */}
          <HumanFaceFeatures
            expression={expression}
            pose={pose}
            cx={90}
            cy={76}
            isTalking={isTalking}
          />
        </g>

        {/* Arms & Learning Props */}
        {renderArmsAndProps()}
      </g>
    </svg>
  );
};
