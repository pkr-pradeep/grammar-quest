/**
 * ============================================================================
 * GRAMMAR QUEST — MISSION 2D SVG ILLUSTRATIONS
 * ============================================================================
 * Consistent 2D flat-vector mission spot artwork sharing #263A70 2.2px strokes,
 * warm cream/sunshine/turquoise palette, and zero baked-in text.
 * ============================================================================
 */

import React from 'react';
import type { PlaceholderMissionSummary } from '../../schemas/lesson.schema';

interface MissionIllustrationProps {
  kind: PlaceholderMissionSummary['iconKind'];
  className?: string;
}

export const MissionIllustration: React.FC<MissionIllustrationProps> = ({
  kind,
  className = '',
}) => {
  if (kind === 'hourglass') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <rect x="16" y="10" width="32" height="6" rx="3" fill="#F59B19" stroke="#263A70" strokeWidth="2.4" />
        <rect x="16" y="48" width="32" height="6" rx="3" fill="#F59B19" stroke="#263A70" strokeWidth="2.4" />
        <path
          d="M20 16H44V22C44 27 36 31 32 32C36 33 44 37 44 42V48H20V42C20 37 28 33 32 32C28 31 20 27 20 22V16Z"
          fill="#FFFDF7"
          stroke="#263A70"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M24 22H40C38 26 34.5 29 32 29.5C29.5 29 26 26 24 22Z" fill="#FFC64B" />
        <path d="M23 45C25 40 29 38 32 38C35 38 39 40 41 45H23Z" fill="#FFC64B" />
      </svg>
    );
  }

  if (kind === 'magnifier') {
    return (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z"
          stroke="#1B2559"
        />
        <path
          d="M15.4 15.4L20.5 20.5M7.5 9.5h6M7.5 12.5h4"
          stroke="#D9741A"
        />
      </svg>
    );
  }

  /* Default: Scroll & Reed Pen (Mission 01 — Repair the Broken Message) */
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Scroll sheet */}
      <path
        d="M14 14C14 11.8 15.8 10 18 10H43C45.2 10 47 11.8 47 14V47C47 50.3 44.3 53 41 53H18C15.8 53 14 51.2 14 49V14Z"
        fill="#FFFDF7"
        stroke="#263A70"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Top rolled scroll curl */}
      <rect x="11" y="10" width="33" height="7" rx="3.5" fill="#FFC64B" stroke="#263A70" strokeWidth="2.2" />
      {/* Script lines */}
      <line x1="21" y1="24" x2="38" y2="24" stroke="#263A70" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21" y1="31" x2="35" y2="31" stroke="#F59B19" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21" y1="38" x2="32" y2="38" stroke="#8DECE0" strokeWidth="2.2" strokeLinecap="round" />
      {/* Reed / Feather pen */}
      <path
        d="M39 45L53 18C55 15 58 17 56 21L44 46L37 49L39 45Z"
        fill="#FFC64B"
        stroke="#263A70"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <line x1="42" y1="43" x2="53" y2="21" stroke="#F59B19" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};
