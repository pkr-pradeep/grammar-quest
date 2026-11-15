/**
 * ============================================================================
 * GRAMMAR QUEST — MASTER 2D CHARACTER ILLUSTRATIONS (MIRA, ARJUN & GYAN)
 * ============================================================================
 * Master character specifications (strictly 2D flat/vector SVG):
 * - Outline colour: Deep Navy #263A70, consistent stroke weight (2.5px).
 * - Line caps/joins: round.
 * - Shading: controlled flat cel-shading with soft warm highlights, zero 3D.
 * - Zero text baked into artwork; all labels remain real React HTML elements.
 *
 * Character Masters:
 * 1. MIRA: Indian Class 9/10 student. Warm light-medium skin (#F2B488), dark
 *    centre-parted hair (#1F2437) with sunshine-yellow ribbon (#FFC64B), small
 *    coral bindi (#F36F68), sunshine-yellow collared kurti top (#FFC64B),
 *    navy satchel strap (#263A70), carrying a turquoise notebook (#8DECE0).
 * 2. ARJUN: Indian Class 9/10 student. Warm medium-deep skin (#DD9768), wavy
 *    dark hair (#1F2437), turquoise overshirt (#4ED2C3 / #8DECE0) over a
 *    cream tee (#FFF8EB), navy backpack strap (#263A70).
 * 3. GYAN: Compact 2D study companion. Cream body (#FFFDF7), deep navy visor
 *    (#263A70) with turquoise smiling eyes (#8DECE0), orange ear discs
 *    (#F59B19), and a small green/turquoise leaf-sprout crest.
 * ============================================================================
 */

import React from 'react';

interface TrioIllustrationProps {
  className?: string;
}

/**
 * Welcoming trio illustration for the Grammar Quest Dashboard.
 * Positioned as a cohesive 2D flat-vector scene on a warm cream backdrop arc.
 */
export const WelcomeTrioIllustration: React.FC<TrioIllustrationProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 360 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Mira, Arjun, and study companion Gyan welcoming you to Grammar Quest"
    >
      {/* Subtle warm cream & sunshine backdrop arc */}
      <path
        d="M28 196C28 112 96 42 182 42C268 42 336 112 336 196H28Z"
        fill="#FFF1D5"
      />
      <circle cx="292" cy="52" r="14" fill="#FFC64B" opacity="0.55" />
      <circle cx="66" cy="70" r="9" fill="#8DECE0" opacity="0.7" />

      {/* ================================================================
          MIRA (Left — Indian student holding a turquoise notebook)
         ================================================================ */}
      <g id="character-mira" className="gq-story-breathe" style={{ transformOrigin: '96px 196px' }}>
        {/* Back hair / braid */}
        <path
          d="M72 95C64 114 63 136 69 152C74 152 80 144 82 134"
          fill="#3A241D"
          stroke="#263A70"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Ribbon on braid */}
        <path
          d="M62 128L72 133L64 139L62 128Z"
          fill="#FFC64B"
          stroke="#263A70"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="71" cy="133" r="3.5" fill="#F59B19" stroke="#263A70" strokeWidth="1.8" />

        {/* Torso / Sunshine Yellow Collared Kurti */}
        <path
          d="M74 137C74 129 82 125 96 125C110 125 118 129 118 137L124 196H68L74 137Z"
          fill="#FFC64B"
          stroke="#263A70"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Collar & Placket */}
        <path
          d="M86 126L96 138L106 126"
          fill="#FFF1D5"
          stroke="#263A70"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <line x1="96" y1="138" x2="96" y2="158" stroke="#F59B19" strokeWidth="2.5" strokeLinecap="round" />

        {/* Navy Satchel Strap */}
        <path
          d="M78 128L116 196"
          stroke="#263A70"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Neck */}
        <rect
          x="90"
          y="112"
          width="12"
          height="16"
          rx="5"
          fill="#E8A477"
          stroke="#263A70"
          strokeWidth="2.2"
        />

        {/* Ears */}
        <circle cx="72" cy="92" r="5.5" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
        <circle cx="120" cy="92" r="5.5" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />

        {/* Head */}
        <path
          d="M73 86C73 67 83 57 96 57C109 57 119 67 119 86C119 104 109 116 96 116C83 116 73 104 73 86Z"
          fill="#F2B488"
          stroke="#263A70"
          strokeWidth="2.5"
        />

        {/* Hair Front (Centre-parted smooth dark hair) */}
        <path
          d="M72 86C71 65 82 52 96 52C110 52 121 65 120 86C116 74 107 69 96 66C85 69 76 74 72 86Z"
          fill="#3A241D"
          stroke="#263A70"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Bindi & Eyes & Warm Smile */}
        <circle cx="96" cy="75" r="2.1" fill="#F36F68" />
        <path d="M82 84C84 82 88 82 90 84" stroke="#263A70" strokeWidth="2" strokeLinecap="round" />
        <path d="M102 84C104 82 108 82 110 84" stroke="#263A70" strokeWidth="2" strokeLinecap="round" />
        <circle cx="86" cy="90" r="2.8" fill="#263A70" />
        <circle cx="106" cy="90" r="2.8" fill="#263A70" />
        <circle cx="87" cy="89" r="0.9" fill="#FFFFFF" />
        <circle cx="107" cy="89" r="0.9" fill="#FFFFFF" />
        <ellipse cx="81" cy="96" rx="4" ry="2.2" fill="#F36F68" opacity="0.35" />
        <ellipse cx="111" cy="96" rx="4" ry="2.2" fill="#F36F68" opacity="0.35" />
        <path
          d="M90 101C93 105 99 105 102 101"
          stroke="#263A70"
          strokeWidth="2.3"
          strokeLinecap="round"
        />

        {/* Notebook held by Mira */}
        <rect
          x="93"
          y="153"
          width="34"
          height="42"
          rx="5"
          transform="rotate(-8 93 153)"
          fill="#8DECE0"
          stroke="#263A70"
          strokeWidth="2.4"
        />
        <line
          x1="99"
          y1="158"
          x2="104"
          y2="192"
          stroke="#263A70"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <rect
          x="108"
          y="164"
          width="14"
          height="6"
          rx="2"
          transform="rotate(-8 108 164)"
          fill="#FFFFFF"
        />

        {/* Hand holding notebook */}
        <circle cx="89" cy="176" r="6" fill="#F2B488" stroke="#263A70" strokeWidth="2.2" />
      </g>

      {/* ================================================================
          ARJUN (Center — Indian student in turquoise overshirt)
         ================================================================ */}
      <g id="character-arjun" className="gq-story-breathe" style={{ transformOrigin: '179px 196px', animationDelay: '0.4s' }}>
        {/* Torso / Turquoise Overshirt over Cream Tee */}
        <path
          d="M151 131C151 122 162 117 179 117C196 117 207 122 207 131L214 196H144L151 131Z"
          fill="#4FD3C4"
          stroke="#263A70"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner Cream Tee */}
        <path
          d="M167 118H191L187 196H171L167 118Z"
          fill="#FFF8EB"
          stroke="#263A70"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Shirt Collar */}
        <path
          d="M167 118L174 134L179 125L184 134L191 118"
          fill="#8DECE0"
          stroke="#263A70"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Navy Backpack Straps */}
        <path d="M158 121L154 196" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />
        <path d="M200 121L204 196" stroke="#263A70" strokeWidth="6" strokeLinecap="round" />

        {/* Neck */}
        <rect
          x="172"
          y="102"
          width="14"
          height="17"
          rx="6"
          fill="#C98456"
          stroke="#263A70"
          strokeWidth="2.2"
        />

        {/* Ears */}
        <circle cx="154" cy="80" r="6" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
        <circle cx="204" cy="80" r="6" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />

        {/* Head */}
        <path
          d="M155 75C155 54 166 44 179 44C192 44 203 54 203 75C203 95 192 107 179 107C166 107 155 95 155 75Z"
          fill="#DD9768"
          stroke="#263A70"
          strokeWidth="2.5"
        />

        {/* Wavy Dark Hair */}
        <path
          d="M153 74C151 54 163 36 180 37C197 38 208 52 204 73C200 62 193 58 184 60C174 62 164 59 153 74Z"
          fill="#1F2437"
          stroke="#263A70"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Eyebrows, Eyes & Confident Smile */}
        <path d="M164 73C166 70.5 170 70.5 173 73" stroke="#263A70" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M185 73C188 70.5 192 70.5 194 73" stroke="#263A70" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="169" cy="79" r="3" fill="#263A70" />
        <circle cx="189" cy="79" r="3" fill="#263A70" />
        <circle cx="170" cy="78" r="1" fill="#FFFFFF" />
        <circle cx="190" cy="78" r="1" fill="#FFFFFF" />
        <path
          d="M172 91C176 96 183 96 187 91"
          stroke="#263A70"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Friendly Thumbs-Up Hand */}
        <g transform="translate(132 150)">
          <rect x="4" y="10" width="16" height="14" rx="6" fill="#DD9768" stroke="#263A70" strokeWidth="2.2" />
          <path
            d="M11 10V3C11 1 15 1 15 4V10"
            fill="#DD9768"
            stroke="#263A70"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* ================================================================
          GYAN (Right — Friendly 2D Study Companion Bot)
         ================================================================ */}
      <g id="character-gyan" className="gq-story-gyan-float">
        {/* Leaf-sprout Antenna */}
        <line x1="274" y1="88" x2="274" y2="73" stroke="#263A70" strokeWidth="2.6" strokeLinecap="round" />
        <path
          d="M274 73C274 63 285 59 290 65C292 71 282 76 274 73Z"
          fill="#8DECE0"
          stroke="#263A70"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M274 73C270 64 261 62 258 68C257 73 267 76 274 73Z"
          fill="#FFC64B"
          stroke="#263A70"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Ear Discs */}
        <rect x="234" y="105" width="9" height="22" rx="4.5" fill="#F59B19" stroke="#263A70" strokeWidth="2.3" />
        <rect x="305" y="105" width="9" height="22" rx="4.5" fill="#F59B19" stroke="#263A70" strokeWidth="2.3" />

        {/* Head Shell */}
        <rect
          x="241"
          y="87"
          width="66"
          height="54"
          rx="20"
          fill="#FFFFFF"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        {/* Visor */}
        <rect x="249" y="96" width="50" height="36" rx="12" fill="#263A70" />
        {/* Friendly Smiling Eyes */}
        <path
          d="M259 112C261 108 266 108 268 112"
          stroke="#8DECE0"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M280 112C282 108 287 108 289 112"
          stroke="#8DECE0"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M268 121C271 124 277 124 280 121"
          stroke="#FFC64B"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* Waving Left Arm */}
        <path
          d="M245 152L231 137"
          stroke="#263A70"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="229" cy="135" r="6" fill="#FFC64B" stroke="#263A70" strokeWidth="2.2" />

        {/* Right Arm */}
        <path
          d="M303 154L315 169"
          stroke="#263A70"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="316" cy="171" r="6" fill="#FFC64B" stroke="#263A70" strokeWidth="2.2" />

        {/* Body */}
        <rect
          x="247"
          y="144"
          width="54"
          height="46"
          rx="16"
          fill="#FFFFFF"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        {/* Chest Badge Crest */}
        <circle cx="274" cy="167" r="10" fill="#FFF1D5" stroke="#F59B19" strokeWidth="2" />
        <path
          d="M274 161L276 165.5L280.5 166L277 169L278 173.5L274 171L270 173.5L271 169L267.5 166L272 165.5Z"
          fill="#F59B19"
        />
      </g>

      {/* Clean Ground Line */}
      <line x1="20" y1="196" x2="340" y2="196" stroke="#263A70" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Compact Grammar Quest Brand Emblem (open book + leaf sprout).
 */
export const GrammarQuestEmblem: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 40 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Book cover base */}
      <path
        d="M4 11C4 9.5 5.2 8.5 6.8 8.8L20 11.5L33.2 8.8C34.8 8.5 36 9.5 36 11V28C36 29.3 35 30.2 33.7 30L20 27.5L6.3 30C5 30.2 4 29.3 4 28V11Z"
        fill="#FFC64B"
        stroke="#263A70"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Open cream pages */}
      <path
        d="M7.5 11.5L20 14L32.5 11.5V26.2L20 24L7.5 26.2V11.5Z"
        fill="#FFFDF7"
        stroke="#263A70"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="20" y1="14" x2="20" y2="24" stroke="#263A70" strokeWidth="2" />
      {/* Page text lines */}
      <line x1="11" y1="16.5" x2="16.5" y2="17.5" stroke="#F59B19" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="11" y1="20.5" x2="16.5" y2="21.5" stroke="#8DECE0" strokeWidth="1.8" strokeLinecap="round" />
      {/* Growth leaf */}
      <path
        d="M21 11.5C21 6.5 26.5 3 32 3.5C32.5 8.5 27.5 12.5 21 11.5Z"
        fill="#8DECE0"
        stroke="#263A70"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M21.5 11.2L28 6.8" stroke="#263A70" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
};
