/**
 * ============================================================================
 * GRAMMAR QUEST — 2D INDIAN SCHOOL COURTYARD & NOTICEBOARD SCENE
 * ============================================================================
 * Strictly 2D flat-vector SVG backdrop paired with the immutable master
 * designs of Mira, Arjun, and Gyan. Supports:
 *  - 'scattered': Wind-blown noticeboard cards in the school courtyard (Stage 1)
 *  - 'repaired': Neatly pinned Subject + Predicate strips on the board (Stage 10)
 * ============================================================================
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Character } from '../Character';

export interface CourtyardNoticeboardSceneProps {
  mode: 'scattered' | 'repaired';
  sceneFocus?: 'mira-notices' | 'arjun-picks-up' | 'gyan-explains';
  isPaused?: boolean;
  animationSeed?: number;
  className?: string;
}

export const CourtyardNoticeboardScene: React.FC<CourtyardNoticeboardSceneProps> = ({
  mode,
  sceneFocus = 'mira-notices',
  isPaused = false,
  animationSeed = 0,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && !isPaused;

  const miraPose =
    mode === 'repaired'
      ? 'celebrating'
      : sceneFocus === 'mira-notices'
        ? 'pointing'
        : sceneFocus === 'arjun-picks-up'
          ? 'thinking'
          : 'encouraging';

  const miraExpr =
    mode === 'repaired'
      ? 'celebrating'
      : sceneFocus === 'mira-notices'
        ? 'surprised'
        : sceneFocus === 'arjun-picks-up'
          ? 'curious'
          : 'happy';

  const arjunPose =
    mode === 'repaired'
      ? 'celebrating'
      : sceneFocus === 'arjun-picks-up'
        ? 'reading'
        : sceneFocus === 'gyan-explains'
          ? 'encouraging'
          : 'thinking';

  const arjunExpr =
    mode === 'repaired'
      ? 'happy'
      : sceneFocus === 'arjun-picks-up'
        ? 'curious'
        : sceneFocus === 'gyan-explains'
          ? 'happy'
          : 'confused';

  const gyanPose =
    mode === 'repaired'
      ? 'celebrating'
      : sceneFocus === 'gyan-explains'
        ? 'explaining'
        : 'pointing';

  const gyanExpr =
    mode === 'repaired'
      ? 'celebrating'
      : sceneFocus === 'gyan-explains'
        ? 'explaining'
        : 'curious';

  return (
    <div
      key={`${mode}-${sceneFocus}-${animationSeed}`}
      className={[
        'relative w-full overflow-hidden rounded-[18px] border border-[#E5E2D9] bg-gradient-to-b from-[#F4FBF9] via-[#FFF9EC] to-[#FFF1D5]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 2D Courtyard & Wooden Noticeboard SVG Backdrop */}
      <svg
        viewBox="0 0 640 250"
        role="img"
        aria-label={
          mode === 'scattered'
            ? 'Indian school courtyard with a wooden noticeboard and wind-scattered message cards'
            : 'Indian school courtyard with neatly repaired notices pinned to the wooden noticeboard'
        }
        className="w-full h-[178px] sm:h-[220px] block select-none"
      >
        {/* Warm Courtyard Ground */}
        <rect x="0" y="182" width="640" height="68" fill="#F6E4BD" />
        <path
          d="M0 182 Q320 174 640 182"
          fill="none"
          stroke="#263A70"
          strokeWidth="2.5"
        />

        {/* Indian School Veranda Building in Soft Background */}
        <rect
          x="24"
          y="74"
          width="210"
          height="108"
          rx="6"
          fill="#FFFDF8"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        <rect
          x="16"
          y="64"
          width="226"
          height="14"
          rx="5"
          fill="#F59B19"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        {/* Veranda Arches */}
        <path
          d="M46 182 V118 A22 22 0 0 1 90 118 V182 Z"
          fill="#F5E6C8"
          stroke="#263A70"
          strokeWidth="2.2"
        />
        <path
          d="M110 182 V118 A22 22 0 0 1 154 118 V182 Z"
          fill="#F5E6C8"
          stroke="#263A70"
          strokeWidth="2.2"
        />
        <path
          d="M174 182 V118 A22 22 0 0 1 218 118 V182 Z"
          fill="#F5E6C8"
          stroke="#263A70"
          strokeWidth="2.2"
        />

        {/* Courtyard Potted Plant */}
        <path
          d="M258 182 L264 156 H290 L296 182 Z"
          fill="#D97A36"
          stroke="#263A70"
          strokeWidth="2.2"
        />
        <ellipse
          cx="277"
          cy="146"
          rx="18"
          ry="14"
          fill="#49B58C"
          stroke="#263A70"
          strokeWidth="2.2"
        />

        {/* Shade Tree Foliage on Right Edge */}
        <circle
          cx="592"
          cy="52"
          r="46"
          fill="#63C7A4"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        <circle
          cx="548"
          cy="68"
          r="30"
          fill="#49B58C"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        <rect
          x="582"
          y="94"
          width="18"
          height="88"
          fill="#B67237"
          stroke="#263A70"
          strokeWidth="2.5"
        />

        {/* Wooden School Noticeboard */}
        <rect
          x="336"
          y="162"
          width="14"
          height="30"
          fill="#A15C00"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        <rect
          x="490"
          y="162"
          width="14"
          height="30"
          fill="#A15C00"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        <rect
          x="314"
          y="42"
          width="212"
          height="124"
          rx="12"
          fill="#C97E39"
          stroke="#263A70"
          strokeWidth="2.5"
        />
        <rect
          x="326"
          y="54"
          width="188"
          height="100"
          rx="8"
          fill="#F9E9C6"
          stroke="#263A70"
          strokeWidth="2"
        />

        {mode === 'scattered' ? (
          <>
            {/* Empty Pin Marks & Leftover Half Strip on Noticeboard */}
            <g>
              <rect
                x="342"
                y="70"
                width="82"
                height="24"
                rx="6"
                fill="#FFF4D6"
                stroke="#F59B19"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <line x1="352" y1="82" x2="412" y2="82" stroke="#263A70" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="348" cy="74" r="3" fill="#F36F68" stroke="#263A70" strokeWidth="1.5" />

              {/* Missing Second Half Outline */}
              <rect
                x="428"
                y="70"
                width="72"
                height="24"
                rx="6"
                fill="#FFFFFF"
                fillOpacity="0.45"
                stroke="#A15C00"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />

              {/* Tilted Remaining Notice Strip */}
              <g transform="rotate(-6 410 124)">
                <rect
                  x="346"
                  y="112"
                  width="124"
                  height="24"
                  rx="6"
                  fill="#D9FAF5"
                  stroke="#1FA89A"
                  strokeWidth="2"
                />
                <line x1="358" y1="124" x2="452" y2="124" stroke="#263A70" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="408" cy="116" r="3" fill="#FFC64B" stroke="#263A70" strokeWidth="1.5" />
              </g>
            </g>

            {/* Gentle 2D Breeze Swirls */}
            <motion.g
              initial={shouldAnimate ? { opacity: 0.45, x: -8 } : false}
              animate={shouldAnimate ? { opacity: [0.45, 0.9, 0.45], x: [0, 12, 0] } : undefined}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M220 44 Q258 34 290 48 Q304 54 294 64"
                fill="none"
                stroke="#65D8CA"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M250 100 Q282 90 310 102"
                fill="none"
                stroke="#8DECE0"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Drifting & Fallen Message Strips on the Courtyard */}
            <motion.g
              initial={shouldAnimate ? { y: -10, rotate: -10, opacity: 0.7 } : false}
              animate={shouldAnimate ? { y: [0, 5, 0], rotate: [-8, -4, -8], opacity: 1 } : undefined}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <rect
                x="266"
                y="118"
                width="60"
                height="20"
                rx="5"
                fill="#FFFFFF"
                stroke="#263A70"
                strokeWidth="2"
              />
              <line x1="276" y1="128" x2="314" y2="128" stroke="#F59B19" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>

            <motion.g
              initial={shouldAnimate ? { y: -6, rotate: 10, opacity: 0.7 } : false}
              animate={shouldAnimate ? { y: [0, -4, 0], rotate: [10, 6, 10], opacity: 1 } : undefined}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <rect
                x="498"
                y="138"
                width="62"
                height="20"
                rx="5"
                fill="#FFF4D6"
                stroke="#263A70"
                strokeWidth="2"
              />
              <line x1="508" y1="148" x2="548" y2="148" stroke="#1FA89A" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>

            <g transform="rotate(-7 390 212)">
              <rect
                x="348"
                y="202"
                width="74"
                height="18"
                rx="5"
                fill="#FFFFFF"
                stroke="#263A70"
                strokeWidth="2"
              />
              <line x1="358" y1="211" x2="408" y2="211" stroke="#263A70" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </>
        ) : (
          /* Repaired Noticeboard: Subject (Amber) + Predicate (Turquoise) Strips Pinned Cleanly */
          <g>
            {/* Row 1 */}
            <motion.g
              initial={shouldAnimate ? { opacity: 0, scale: 0.94 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28 }}
            >
              <rect x="340" y="66" width="76" height="22" rx="6" fill="#FFC64B" stroke="#263A70" strokeWidth="2" />
              <line x1="350" y1="77" x2="404" y2="77" stroke="#263A70" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="420" y="66" width="80" height="22" rx="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2" />
              <line x1="430" y1="77" x2="488" y2="77" stroke="#263A70" strokeWidth="2.4" strokeLinecap="round" />
            </motion.g>

            {/* Row 2 */}
            <motion.g
              initial={shouldAnimate ? { opacity: 0, scale: 0.94 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, delay: 0.08 }}
            >
              <rect x="340" y="95" width="84" height="22" rx="6" fill="#FFC64B" stroke="#263A70" strokeWidth="2" />
              <line x1="350" y1="106" x2="412" y2="106" stroke="#263A70" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="428" y="95" width="72" height="22" rx="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2" />
              <line x1="438" y1="106" x2="488" y2="106" stroke="#263A70" strokeWidth="2.4" strokeLinecap="round" />
            </motion.g>

            {/* Row 3 */}
            <motion.g
              initial={shouldAnimate ? { opacity: 0, scale: 0.94 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, delay: 0.16 }}
            >
              <rect x="340" y="124" width="68" height="22" rx="6" fill="#FFC64B" stroke="#263A70" strokeWidth="2" />
              <line x1="350" y1="135" x2="396" y2="135" stroke="#263A70" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="412" y="124" width="88" height="22" rx="6" fill="#8DECE0" stroke="#263A70" strokeWidth="2" />
              <line x1="422" y1="135" x2="488" y2="135" stroke="#263A70" strokeWidth="2.4" strokeLinecap="round" />
            </motion.g>

            {/* Star Seal at Top Center of Board */}
            <circle cx="420" cy="42" r="13" fill="#FFC64B" stroke="#263A70" strokeWidth="2.2" />
            <path
              d="M420 33 L422.7 38.5 L428.8 39.4 L424.4 43.7 L425.4 49.8 L420 46.9 L414.6 49.8 L415.6 43.7 L411.2 39.4 L417.3 38.5 Z"
              fill="#FFFFFF"
              stroke="#263A70"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>

      {/* Foreground Master Characters Overlay (Immutable SVG Masters) */}
      <div className="pointer-events-none flex items-end justify-between px-3 sm:px-8 -mt-20 sm:-mt-24 pb-2 relative z-10">
        <div className="flex items-end gap-1 sm:gap-2">
          <Character
            characterId="mira"
            pose={miraPose}
            expression={miraExpr}
            animationState={
              isPaused
                ? 'none'
                : mode === 'repaired'
                  ? 'celebrate'
                  : sceneFocus === 'mira-notices'
                    ? 'point'
                    : 'idle'
            }
            size={68}
            className="sm:scale-110 origin-bottom"
          />
          <Character
            characterId="arjun"
            pose={arjunPose}
            expression={arjunExpr}
            animationState={
              isPaused
                ? 'none'
                : mode === 'repaired'
                  ? 'celebrate'
                  : sceneFocus === 'arjun-picks-up'
                    ? 'talk'
                    : 'idle'
            }
            size={68}
            className="sm:scale-110 origin-bottom"
          />
        </div>

        <Character
          characterId="gyan"
          pose={gyanPose}
          expression={gyanExpr}
          animationState={
            isPaused
              ? 'none'
              : mode === 'repaired'
                ? 'celebrate'
                : sceneFocus === 'gyan-explains'
                  ? 'talk'
                  : 'idle'
          }
          size={64}
          flipHorizontal
          className="sm:scale-110 origin-bottom"
        />
      </div>
    </div>
  );
};
