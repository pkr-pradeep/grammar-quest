/**
 * ============================================================================
 * GRAMMAR QUEST — 2D INDIAN SCHOOL COURTYARD & NOTICEBOARD SCENE
 * ============================================================================
 * Strictly 2D flat-vector SVG backdrop paired with the immutable master
 * designs of Mira, Arjun, and ShukaJi. Supports:
 *  - 'scattered': Wind-blown noticeboard cards in the school courtyard (Stage 1)
 *    with speaker spotlighting, name tags, ambient life, and per-scene effects
 *  - 'repaired': Neatly pinned Subject + Predicate strips on the board (Stage 10)
 * ============================================================================
 */

import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ZoomIn } from 'lucide-react';
import { Character } from '../Character';
import { ModalDialog } from '../Modal/ModalDialog';
import type {
  CharacterExpression,
  CharacterId,
  CharacterPose,
} from '../Character';

import type { StorySceneVariant } from '../../schemas/grammarEngine.schema';

export interface CourtyardNoticeboardSceneProps {
  mode: 'scattered' | 'repaired';
  sceneVariant?: StorySceneVariant;
  sceneFocus?: 'mira-notices' | 'arjun-picks-up' | 'shuka-explains';
  isPaused?: boolean;
  isTyping?: boolean;
  animationSeed?: number;
  className?: string;
  zoomedView?: boolean;
}

const SPEAKER_BY_FOCUS: Record<
  NonNullable<CourtyardNoticeboardSceneProps['sceneFocus']>,
  CharacterId
> = {
  'mira-notices': 'mira',
  'arjun-picks-up': 'arjun',
  'shuka-explains': 'shuka',
};

const SPEAKER_COLOR: Record<CharacterId, string> = {
  mira: '#C94A3A',
  arjun: '#0F7F76',
  shuka: '#26734D',
};

const SPEAKER_NAME: Record<CharacterId, string> = {
  mira: 'Mira',
  arjun: 'Arjun',
  shuka: 'Śukaji',
};

const SCENE_ARIA_LABEL: Record<
  StorySceneVariant,
  Record<NonNullable<CourtyardNoticeboardSceneProps['sceneFocus']>, string>
> = {
  noticeboard: {
    'mira-notices':
      'Indian school courtyard where Mira points at the wooden noticeboard as a breeze scatters six paper scraps.',
    'arjun-picks-up':
      'Indian school courtyard where Arjun picks up a scattered "... plays cricket." scrap from the ground while Mira and Śukaji watch.',
    'shuka-explains':
      'Indian school courtyard where Śukaji guides learners through Subject and Predicate strips on the noticeboard.',
  },
  'records-timeline': {
    'mira-notices':
      'Indian school courtyard where Mira points at old school activity record pages fluttering out of order beside the timeline board.',
    'arjun-picks-up':
      'Indian school courtyard where Arjun holds up a school activity record card with a mismatched verb form.',
    'shuka-explains':
      'Indian school courtyard where Śukaji explains the Past, Present, and Future Time timeline on the school board.',
  },
  'detective-board': {
    'mira-notices':
      'Indian school courtyard where Mira inspects the school heritage fair board with mismatched Subject and Verb cards.',
    'arjun-picks-up':
      'Indian school courtyard where Arjun examines a poster strip where a plural verb clashes with a singular Subject.',
    'shuka-explains':
      'Indian school courtyard where Śukaji explains how the Subject head-noun connects to the agreeing Verb.',
  },
};

interface ScrapConfig {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  fill: string;
  stroke: string;
  lineColor: string;
  delay: string;
  onBoard: boolean;
}

const SCENE_1_SCRAPS: ScrapConfig[] = [
  {
    id: 'scrap-board-1',
    x: 342,
    y: 66,
    w: 76,
    h: 22,
    rotate: -4,
    fill: '#FFF4D6',
    stroke: '#F59B19',
    lineColor: '#263A70',
    delay: '0.1s',
    onBoard: true,
  },
  {
    id: 'scrap-board-2',
    x: 426,
    y: 68,
    w: 74,
    h: 22,
    rotate: 5,
    fill: '#FFFFFF',
    stroke: '#263A70',
    lineColor: '#0F7F76',
    delay: '0.26s',
    onBoard: true,
  },
  {
    id: 'scrap-board-3',
    x: 350,
    y: 112,
    w: 112,
    h: 22,
    rotate: -6,
    fill: '#D9FAF5',
    stroke: '#1FA89A',
    lineColor: '#263A70',
    delay: '0.42s',
    onBoard: true,
  },
  {
    id: 'scrap-ground-1',
    x: 266,
    y: 132,
    w: 58,
    h: 19,
    rotate: -9,
    fill: '#FFFFFF',
    stroke: '#263A70',
    lineColor: '#F59B19',
    delay: '0.58s',
    onBoard: false,
  },
  {
    id: 'scrap-ground-2',
    x: 498,
    y: 142,
    w: 62,
    h: 19,
    rotate: 10,
    fill: '#FFF4D6',
    stroke: '#263A70',
    lineColor: '#1FA89A',
    delay: '0.74s',
    onBoard: false,
  },
  {
    id: 'scrap-ground-3',
    x: 348,
    y: 202,
    w: 74,
    h: 18,
    rotate: -7,
    fill: '#FFFFFF',
    stroke: '#263A70',
    lineColor: '#263A70',
    delay: '0.9s',
    onBoard: false,
  },
];

export const CourtyardNoticeboardScene: React.FC<CourtyardNoticeboardSceneProps> = ({
  mode,
  sceneVariant = 'noticeboard',
  sceneFocus = 'mira-notices',
  isPaused = false,
  isTyping = false,
  animationSeed = 0,
  className = '',
  zoomedView = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isBoardZoomOpen, setIsBoardZoomOpen] = useState(false);
  const zoomTriggerRef = useRef<HTMLButtonElement | null>(null);
  const zoomOkayRef = useRef<HTMLButtonElement | null>(null);
  const shouldAnimate = !prefersReducedMotion && !isPaused;
  const activeSpeaker = SPEAKER_BY_FOCUS[sceneFocus];
  const isStoryMode = mode === 'scattered';

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
        : sceneFocus === 'shuka-explains'
          ? 'encouraging'
          : 'thinking';

  const arjunExpr =
    mode === 'repaired'
      ? 'happy'
      : sceneFocus === 'arjun-picks-up'
        ? 'curious'
        : sceneFocus === 'shuka-explains'
          ? 'happy'
          : 'confused';

  const shukaPose =
    mode === 'repaired'
      ? 'celebrating'
      : sceneFocus === 'shuka-explains'
        ? 'explaining'
        : 'pointing';

  const shukaExpr =
    mode === 'repaired'
      ? 'celebrating'
      : sceneFocus === 'shuka-explains'
        ? 'explaining'
        : 'curious';

  const sceneAriaLabel =
    mode === 'scattered'
      ? SCENE_ARIA_LABEL[sceneVariant][sceneFocus]
      : sceneVariant === 'records-timeline'
        ? 'Indian school courtyard with sorted Past, Present, and Future Time school activity records on the board'
        : sceneVariant === 'detective-board'
          ? 'Indian school courtyard with corrected Subject and Verb pairs locked cleanly on the school noticeboard'
          : 'Indian school courtyard with neatly repaired notices pinned to the wooden noticeboard';

  const renderSpeakerTag = (characterId: CharacterId) => {
    const isActive = activeSpeaker === characterId;
    if (!isActive) return null;
    const color = SPEAKER_COLOR[characterId];
    return (
      <div
        key={`tag-${characterId}-${sceneFocus}`}
        aria-hidden="true"
        className={[
          'absolute left-1/2 -translate-x-1/2 -top-7 z-20 flex flex-col items-center pointer-events-none',
          !prefersReducedMotion ? 'gq-story-tag-pop' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          className="px-2 py-0.5 rounded-full text-[11px] font-bold leading-tight text-white shadow-sm whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          {SPEAKER_NAME[characterId]}
        </span>
        <span
          className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent -mt-[1px]"
          style={{ borderTopColor: color }}
        />
      </div>
    );
  };

  const renderStoryCharacter = (
    characterId: CharacterId,
    size: number,
    pose: CharacterPose,
    expression: CharacterExpression,
    flipHorizontal = false,
  ) => {
    const isActive = activeSpeaker === characterId;
    const color = SPEAKER_COLOR[characterId];
    const isTalkingNow = isActive && isTyping && !isPaused && !prefersReducedMotion;

    return (
      <div
        aria-hidden="true"
        className="relative flex flex-col items-center origin-bottom"
        style={{
          transformOrigin: 'bottom center',
          transform: isActive ? 'scale(1.12)' : 'scale(0.94)',
          opacity: isActive ? 1 : 0.8,
          filter: isActive ? 'saturate(1)' : 'saturate(0.7)',
          transition: prefersReducedMotion
            ? 'none'
            : 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease, filter 0.35s ease',
        }}
      >
        {/* Active speaker floating name tag */}
        {renderSpeakerTag(characterId)}

        {/* Ambient float (ShukaJi) -> Breathe -> Talking bob */}
        <div
          className={
            characterId === 'shuka' && !prefersReducedMotion
              ? 'gq-story-shuka-float'
              : ''
          }
        >
          <div
            className={!prefersReducedMotion ? 'gq-story-breathe' : ''}
            style={{ transformOrigin: 'bottom center' }}
          >
            <div className={isTalkingNow ? 'gq-story-talk-bob relative' : 'relative'}>
              <Character
                characterId={characterId}
                pose={pose}
                expression={expression}
                animationState="none"
                size={size}
                flipHorizontal={flipHorizontal}
                className="sm:scale-110 origin-bottom"
              />

            </div>
          </div>
        </div>

        {/* Soft coloured ground glow ellipse under active speaker */}
        <div
          aria-hidden="true"
          className="pointer-events-none -mt-1.5 w-14 h-2.5 rounded-full blur-[1px]"
          style={{
            backgroundColor: color,
            opacity: isActive ? 0.4 : 0,
            transform: isActive ? 'scale(1)' : 'scale(0.65)',
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.35s ease, transform 0.35s ease',
          }}
        />
      </div>
    );
  };

  return (
    <div
      role="group"
      aria-label={sceneAriaLabel}
      className={[
        'relative w-full overflow-hidden rounded-[18px] border border-[#E5E2D9] bg-gradient-to-b from-[#F4FBF9] via-[#FFF9EC] to-[#FFF1D5]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 2D Courtyard & Wooden Noticeboard SVG Backdrop */}
      <svg
        viewBox={zoomedView ? '304 28 236 154' : '0 0 640 250'}
        aria-hidden="true"
        className={
          zoomedView
            ? 'mx-auto block h-auto max-h-[46dvh] w-full max-w-full select-none'
            : 'w-full h-[186px] sm:h-[224px] block select-none'
        }
      >
        {/* Subtle Drifting Clouds in Sky (Story & Repaired ambient life) */}
        <g className={!prefersReducedMotion ? 'gq-story-cloud' : ''} opacity="0.78">
          <path
            d="M96 34 C96 28 102 24 109 25 C113 18 126 18 131 25 C137 24 143 28 143 34 Z"
            fill="#FFFFFF"
          />
          <path
            d="M242 26 C242 21 247 17 253 18 C257 12 269 12 273 18 C278 17 283 21 283 26 Z"
            fill="#FFFFFF"
          />
          <path
            d="M446 30 C446 25 451 21 456 22 C460 16 471 16 475 22 C480 21 484 25 484 30 Z"
            fill="#FFFFFF"
          />
        </g>

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

        {/* Shade Tree Foliage on Right Edge (gently sways) */}
        <g className={!prefersReducedMotion ? 'gq-story-tree' : ''}>
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
        </g>

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

        {mode === 'scattered' && sceneVariant === 'records-timeline' ? (
          <g key={`records-scene-${sceneFocus}-${animationSeed}`}>
            {/* Timeline axis inside the wooden board */}
            <line x1="342" y1="104" x2="498" y2="104" stroke="#263A70" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="364" cy="104" r="5" fill="#F59B19" stroke="#263A70" strokeWidth="1.8" />
            <circle cx="420" cy="104" r="5" fill="#1FA89A" stroke="#263A70" strokeWidth="1.8" />
            <circle cx="476" cy="104" r="5" fill="#5B43C2" stroke="#263A70" strokeWidth="1.8" />
            <text x="364" y="121" textAnchor="middle" fill="#A15C00" fontSize="8.5" fontWeight="800">PAST</text>
            <text x="420" y="121" textAnchor="middle" fill="#0F7F76" fontSize="8.5" fontWeight="800">NOW</text>
            <text x="476" y="121" textAnchor="middle" fill="#5B43C2" fontSize="8.5" fontWeight="800">FUTURE</text>

            {sceneFocus === 'mira-notices' ? (
              <g>
                <g transform="rotate(-7 368 76)">
                  <rect x="336" y="64" width="66" height="24" rx="5" fill="#FFF4D6" stroke="#C94A3A" strokeWidth="2" />
                  <text x="369" y="79" textAnchor="middle" fill="#263A70" fontSize="8" fontWeight="700">Yesterday?</text>
                </g>
                <g transform="rotate(6 446 78)">
                  <rect x="412" y="64" width="68" height="24" rx="5" fill="#FFFFFF" stroke="#263A70" strokeWidth="2" />
                  <text x="446" y="79" textAnchor="middle" fill="#263A70" fontSize="8" fontWeight="700">Tomorrow?</text>
                </g>
                <g className={!prefersReducedMotion ? 'gq-story-scrap-bob' : ''}>
                  <rect x="266" y="122" width="52" height="20" rx="5" fill="#FFFFFF" stroke="#263A70" strokeWidth="2" />
                  <line x1="274" y1="132" x2="308" y2="132" stroke="#F59B19" strokeWidth="2.4" strokeLinecap="round" />
                </g>
              </g>
            ) : null}

            {sceneFocus === 'arjun-picks-up' ? (
              <g>
                <g className={!prefersReducedMotion ? 'gq-story-scrap-lift' : ''}>
                  <rect x="160" y="143" width="96" height="25" rx="7" fill="#DDF4F0" stroke="#0F7F76" strokeWidth="2.2" />
                  <text x="208" y="159" textAnchor="middle" fill="#263A70" fontSize="8.8" fontWeight="700">Yesterday: plant?</text>
                </g>
                <rect x="342" y="64" width="156" height="24" rx="6" fill="#FEE8E7" stroke="#C94A3A" strokeWidth="1.8" strokeDasharray="4 3" />
                <text x="420" y="79" textAnchor="middle" fill="#9E2A25" fontSize="8.2" fontWeight="700">Time clue ≠ Verb form</text>
              </g>
            ) : null}

            {sceneFocus === 'shuka-explains' ? (
              <g>
                <g className={!prefersReducedMotion ? 'gq-story-slide-left' : ''}>
                  <rect x="336" y="64" width="76" height="24" rx="6" fill="#FFC64B" stroke="#263A70" strokeWidth="2" />
                  <text x="374" y="79" textAnchor="middle" fill="#263A70" fontSize="8.5" fontWeight="700">TIME: Past</text>
                </g>
                <g className={!prefersReducedMotion ? 'gq-story-slide-right' : ''}>
                  <rect x="424" y="64" width="84" height="24" rx="6" fill="#8DECE0" stroke="#0F7F76" strokeWidth="2" />
                  <text x="466" y="79" textAnchor="middle" fill="#263A70" fontSize="8.5" fontWeight="700">VERB: planted</text>
                </g>
                <g className={!prefersReducedMotion ? 'gq-story-badge-check' : ''}>
                  <circle cx="518" cy="46" r="13" fill="#1B8A5A" stroke="#FFFFFF" strokeWidth="2.4" />
                  <path d="M512 46.5 L516.2 50.5 L524.5 41.8" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            ) : null}
          </g>
        ) : mode === 'scattered' && sceneVariant === 'detective-board' ? (
          <g key={`detective-scene-${sceneFocus}-${animationSeed}`}>
            {sceneFocus === 'mira-notices' ? (
              <g>
                <rect x="338" y="64" width="164" height="26" rx="6" fill="#FEE8E7" stroke="#C94A3A" strokeWidth="2" />
                <text x="420" y="80" textAnchor="middle" fill="#9E2A25" fontSize="8.5" fontWeight="700">A basket of mangoes ARE?</text>
                <rect x="338" y="98" width="164" height="24" rx="6" fill="#FFF4D6" stroke="#F59B19" strokeWidth="2" strokeDasharray="4 3" />
                <text x="420" y="113" textAnchor="middle" fill="#A15C00" fontSize="8.2" fontWeight="700">Subject &amp; Verb clash!</text>
              </g>
            ) : null}

            {sceneFocus === 'arjun-picks-up' ? (
              <g>
                <g className={!prefersReducedMotion ? 'gq-story-scrap-lift' : ''}>
                  <rect x="158" y="143" width="98" height="25" rx="7" fill="#DDF4F0" stroke="#0F7F76" strokeWidth="2.2" />
                  <text x="207" y="159" textAnchor="middle" fill="#263A70" fontSize="8.8" fontWeight="700">basket → is / are?</text>
                </g>
                <rect x="338" y="68" width="76" height="24" rx="6" fill="#FFC64B" stroke="#263A70" strokeWidth="2" />
                <text x="376" y="83" textAnchor="middle" fill="#263A70" fontSize="8.5" fontWeight="700">basket (1)</text>
                <rect x="426" y="68" width="76" height="24" rx="6" fill="#FEE8E7" stroke="#C94A3A" strokeWidth="2" />
                <text x="464" y="83" textAnchor="middle" fill="#9E2A25" fontSize="8.5" fontWeight="700">are (plural?)</text>
              </g>
            ) : null}

            {sceneFocus === 'shuka-explains' ? (
              <g>
                <g className={!prefersReducedMotion ? 'gq-story-slide-left' : ''}>
                  <rect x="336" y="72" width="78" height="26" rx="6" fill="#FFC64B" stroke="#263A70" strokeWidth="2" />
                  <text x="375" y="88" textAnchor="middle" fill="#263A70" fontSize="8.8" fontWeight="700">basket (Sg)</text>
                </g>
                <g className={!prefersReducedMotion ? 'gq-story-slide-right' : ''}>
                  <rect x="428" y="72" width="78" height="26" rx="6" fill="#8DECE0" stroke="#0F7F76" strokeWidth="2" />
                  <text x="467" y="88" textAnchor="middle" fill="#263A70" fontSize="8.8" fontWeight="700">is (Sg Verb)</text>
                </g>
                <line x1="414" y1="85" x2="428" y2="85" stroke="#5B43C2" strokeWidth="3" />
                <rect x="348" y="114" width="144" height="22" rx="11" fill="#FFFFFF" stroke="#5B43C2" strokeWidth="1.8" />
                <text x="420" y="128" textAnchor="middle" fill="#263A70" fontSize="8.5" fontWeight="700">Head-noun locks the verb!</text>
                <g className={!prefersReducedMotion ? 'gq-story-badge-check' : ''}>
                  <circle cx="518" cy="46" r="13" fill="#1B8A5A" stroke="#FFFFFF" strokeWidth="2.4" />
                  <path d="M512 46.5 L516.2 50.5 L524.5 41.8" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            ) : null}
          </g>
        ) : mode === 'scattered' ? (
          <g key={`scene-layer-${sceneFocus}-${animationSeed}`}>
            {/* Base Board Outline State */}
            <g>
              {/* Missing Second Half Outline on Board */}
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
            </g>

            {/* SCENE 1: Mira Notices — Breeze lines + 6 flying tumbling scraps */}
            {sceneFocus === 'mira-notices' ? (
              <g>
                {/* Leftover half strip on board */}
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
                  <line
                    x1="352"
                    y1="82"
                    x2="412"
                    y2="82"
                    stroke="#263A70"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="348"
                    cy="74"
                    r="3"
                    fill="#F36F68"
                    stroke="#263A70"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Two top-left curved dashed breeze lines */}
                <path
                  d="M28 36 Q130 14 226 42 Q264 52 296 40"
                  fill="none"
                  stroke="#65D8CA"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="10 8"
                  className={!prefersReducedMotion ? 'gq-story-breeze-1' : ''}
                />
                <path
                  d="M48 56 Q146 38 238 60 Q276 70 306 58"
                  fill="none"
                  stroke="#8DECE0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="8 8"
                  className={!prefersReducedMotion ? 'gq-story-breeze-2' : ''}
                />

                {/* 6 paper scraps flying in from right edge and settling */}
                {SCENE_1_SCRAPS.map((scrap) => (
                  <g
                    key={scrap.id}
                    className={!prefersReducedMotion ? 'gq-story-scrap-flyin' : ''}
                    style={{ animationDelay: scrap.delay }}
                  >
                    <g
                      className={
                        scrap.onBoard && !prefersReducedMotion ? 'gq-story-scrap-bob' : ''
                      }
                      style={{
                        animationDelay: scrap.onBoard ? scrap.delay : undefined,
                      }}
                    >
                      <g
                        transform={`rotate(${scrap.rotate} ${scrap.x + scrap.w / 2} ${
                          scrap.y + scrap.h / 2
                        })`}
                      >
                        <rect
                          x={scrap.x}
                          y={scrap.y}
                          width={scrap.w}
                          height={scrap.h}
                          rx="5"
                          fill={scrap.fill}
                          stroke={scrap.stroke}
                          strokeWidth="2"
                        />
                        <line
                          x1={scrap.x + 10}
                          y1={scrap.y + scrap.h / 2}
                          x2={scrap.x + scrap.w - 10}
                          y2={scrap.y + scrap.h / 2}
                          stroke={scrap.lineColor}
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                        {scrap.onBoard ? (
                          <circle
                            cx={scrap.x + 10}
                            cy={scrap.y + 5}
                            r="2.6"
                            fill="#FFC64B"
                            stroke="#263A70"
                            strokeWidth="1.4"
                          />
                        ) : null}
                      </g>
                    </g>
                  </g>
                ))}
              </g>
            ) : null}

            {/* SCENE 2: Arjun Picks Up — Dashed ground outline + lifted glowing scrap */}
            {sceneFocus === 'arjun-picks-up' ? (
              <g>
                {/* Remaining board strips settled */}
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
                <line
                  x1="352"
                  y1="82"
                  x2="412"
                  y2="82"
                  stroke="#263A70"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
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
                  <line
                    x1="358"
                    y1="124"
                    x2="452"
                    y2="124"
                    stroke="#263A70"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>

                {/* Other courtyard scraps */}
                <g transform="rotate(-8 296 128)">
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
                  <line
                    x1="276"
                    y1="128"
                    x2="314"
                    y2="128"
                    stroke="#F59B19"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </g>
                <g transform="rotate(8 529 148)">
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
                  <line
                    x1="508"
                    y1="148"
                    x2="548"
                    y2="148"
                    stroke="#1FA89A"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </g>

                {/* Dashed outline left on the courtyard ground where the scrap was picked up */}
                <g transform="rotate(-7 386 211)">
                  <rect
                    x="348"
                    y="201"
                    width="82"
                    height="20"
                    rx="5"
                    fill="#FFFFFF"
                    fillOpacity="0.35"
                    stroke="#0F7F76"
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                  />
                </g>

                {/* Lifted "... plays cricket." scrap arcing up near Arjun's hand + pulsing glow */}
                <g
                  className={!prefersReducedMotion ? 'gq-story-scrap-lift' : ''}
                  style={{
                    transformOrigin: '205px 158px',
                    transform: prefersReducedMotion ? 'scale(1.1)' : undefined,
                  }}
                >
                  {/* Soft pulsing halo ring after landing */}
                  <rect
                    x="159"
                    y="144"
                    width="92"
                    height="28"
                    rx="8"
                    fill="none"
                    stroke="#0F7F76"
                    strokeWidth="3"
                    className={!prefersReducedMotion ? 'gq-story-scrap-ring' : ''}
                    style={{
                      transformOrigin: '205px 158px',
                      opacity: prefersReducedMotion ? 0.45 : undefined,
                    }}
                  />
                  <rect
                    x="162"
                    y="147"
                    width="86"
                    height="22"
                    rx="6"
                    fill="#DDF4F0"
                    stroke="#0F7F76"
                    strokeWidth="2.2"
                  />
                  <text
                    x="205"
                    y="161"
                    textAnchor="middle"
                    fill="#263A70"
                    fontSize="9.5"
                    fontWeight="700"
                  >
                    ... plays cricket.
                  </text>
                </g>
              </g>
            ) : null}

            {/* SCENE 3: ShukaJi explains Subject + Predicate with a matching check. */}
            {sceneFocus === 'shuka-explains' ? (
              <g>
                {/* Faint fallen ground scraps */}
                <g transform="rotate(8 529 148)" opacity="0.6">
                  <rect
                    x="498"
                    y="138"
                    width="62"
                    height="18"
                    rx="5"
                    fill="#FFF4D6"
                    stroke="#263A70"
                    strokeWidth="1.8"
                  />
                </g>

                {/* Amber SUBJECT chip sliding from left */}
                <g className={!prefersReducedMotion ? 'gq-story-slide-left' : ''}>
                  <text
                    x="373"
                    y="78"
                    textAnchor="middle"
                    fill="#A15C00"
                    fontSize="8"
                    fontWeight="800"
                    letterSpacing="0.06em"
                  >
                    SUBJECT
                  </text>
                  <rect
                    x="333"
                    y="83"
                    width="80"
                    height="26"
                    rx="6"
                    fill="#FFC64B"
                    stroke="#263A70"
                    strokeWidth="2"
                  />
                  <text
                    x="373"
                    y="99"
                    textAnchor="middle"
                    fill="#263A70"
                    fontSize="9"
                    fontWeight="700"
                  >
                    The little boy ...
                  </text>
                </g>

                {/* Teal PREDICATE chip sliding from right */}
                <g className={!prefersReducedMotion ? 'gq-story-slide-right' : ''}>
                  <text
                    x="469"
                    y="78"
                    textAnchor="middle"
                    fill="#0F7F76"
                    fontSize="8"
                    fontWeight="800"
                    letterSpacing="0.06em"
                  >
                    PREDICATE
                  </text>
                  <rect
                    x="429"
                    y="83"
                    width="80"
                    height="26"
                    rx="6"
                    fill="#8DECE0"
                    stroke="#0F7F76"
                    strokeWidth="2"
                  />
                  <text
                    x="469"
                    y="99"
                    textAnchor="middle"
                    fill="#263A70"
                    fontSize="9"
                    fontWeight="700"
                  >
                    ... plays cricket.
                  </text>
                </g>

                {/* Dark round "+" badge popping between Subject and Predicate */}
                <g
                  className={!prefersReducedMotion ? 'gq-story-badge-plus' : ''}
                  style={{ transformOrigin: '421px 96px' }}
                >
                  <circle
                    cx="421"
                    cy="96"
                    r="10"
                    fill="#263A70"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M416.5 96H425.5 M421 91.5V100.5"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </g>

                {/* Complete Sentence summary pill inside board */}
                <g
                  className={!prefersReducedMotion ? 'gq-story-badge-check' : ''}
                  style={{ transformOrigin: '421px 129px' }}
                >
                  <rect
                    x="346"
                    y="119"
                    width="150"
                    height="20"
                    rx="10"
                    fill="#FFFFFF"
                    stroke="#5B43C2"
                    strokeWidth="1.8"
                  />
                  <text
                    x="421"
                    y="132"
                    textAnchor="middle"
                    fill="#263A70"
                    fontSize="8.8"
                    fontWeight="700"
                  >
                    The little boy plays cricket.
                  </text>
                </g>

                {/* Green check badge at top-right corner of the noticeboard */}
                <g
                  className={!prefersReducedMotion ? 'gq-story-badge-check' : ''}
                  style={{ transformOrigin: '518px 46px' }}
                >
                  <circle
                    cx="518"
                    cy="46"
                    r="13"
                    fill="#1B8A5A"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                  />
                  <path
                    d="M512 46.5 L516.2 50.5 L524.5 41.8"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            ) : null}
          </g>
        ) : (
          /* Repaired Noticeboard: Cleanly aligned strips by variant */
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

            {/* Celebratory Sparkle Glints Around the Repaired Noticeboard */}
            <g
              className={!prefersReducedMotion ? 'gq-story-sparkle' : ''}
              style={{ transformOrigin: '312px 38px' }}
            >
              <path
                d="M312 31L314 36L319 38L314 40L312 45L310 40L305 38L310 36Z"
                fill="#FFC64B"
                stroke="#263A70"
                strokeWidth="1.2"
              />
            </g>
            <g
              className={!prefersReducedMotion ? 'gq-story-sparkle' : ''}
              style={{ transformOrigin: '528px 36px', animationDelay: '0.45s' }}
            >
              <path
                d="M528 29L530 34L535 36L530 38L528 43L526 38L521 36L526 34Z"
                fill="#8DECE0"
                stroke="#263A70"
                strokeWidth="1.2"
              />
            </g>
            <g
              className={!prefersReducedMotion ? 'gq-story-sparkle' : ''}
              style={{ transformOrigin: '454px 25px', animationDelay: '0.9s' }}
            >
              <path
                d="M454 20L455.6 23.8L459.5 25L455.6 26.2L454 30L452.4 26.2L448.5 25L452.4 23.8Z"
                fill="#5B43C2"
              />
            </g>
          </g>
        )}
        {!zoomedView ? (
          <g
            onClick={() => setIsBoardZoomOpen(true)}
            style={{ cursor: 'zoom-in' }}
          >
            <rect
              x="314"
              y="42"
              width="212"
              height="124"
              fill="transparent"
              pointerEvents="all"
            />
          </g>
        ) : null}
      </svg>

      {/* Foreground Master Characters Overlay (Immutable SVG Masters) */}
      {!zoomedView && isStoryMode ? (
        <div className="pointer-events-none flex items-end justify-between px-3 sm:px-8 -mt-[76px] sm:-mt-[92px] pb-2 relative z-10">
          <div className="flex items-end gap-2 sm:gap-4">
            {renderStoryCharacter('mira', 68, miraPose, miraExpr)}
            {renderStoryCharacter('arjun', 68, arjunPose, arjunExpr)}
          </div>
          {renderStoryCharacter('shuka', 64, shukaPose, shukaExpr, true)}
        </div>
      ) : !zoomedView ? (
        <div className="pointer-events-none flex items-end justify-between px-3 sm:px-8 -mt-[76px] sm:-mt-[92px] pb-2 relative z-10">
          <div className="flex items-end gap-2 sm:gap-4">
            {(
              [
                { id: 'mira' as const, size: 68, pose: miraPose, expr: miraExpr, flip: false, delay: '0ms' },
                { id: 'arjun' as const, size: 68, pose: arjunPose, expr: arjunExpr, flip: false, delay: '120ms' },
              ] as const
            ).map((c) => (
              <div key={c.id} aria-hidden="true" className="relative flex flex-col items-center">
                <div
                  className={[
                    'mb-1 px-2 py-0.5 rounded-full text-[11px] font-bold leading-tight text-white shadow-xs',
                    !prefersReducedMotion ? 'gq-story-tag-pop' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ backgroundColor: SPEAKER_COLOR[c.id], animationDelay: c.delay }}
                >
                  {SPEAKER_NAME[c.id]}
                </div>
                <div className={!prefersReducedMotion ? 'gq-story-breathe' : ''} style={{ animationDelay: c.delay }}>
                  <Character
                    characterId={c.id}
                    pose={c.pose}
                    expression={c.expr}
                    animationState={isPaused ? 'none' : 'celebrate'}
                    size={c.size}
                    flipHorizontal={c.flip}
                    className="sm:scale-110 origin-bottom"
                  />
                </div>
                <div
                  className="pointer-events-none -mt-1.5 w-12 h-2 rounded-full blur-[1px] opacity-35"
                  style={{ backgroundColor: SPEAKER_COLOR[c.id] }}
                />
              </div>
            ))}
          </div>

          <div aria-hidden="true" className="relative flex flex-col items-center">
            <div
              className={[
                'mb-1 px-2 py-0.5 rounded-full text-[11px] font-bold leading-tight text-white shadow-xs',
                !prefersReducedMotion ? 'gq-story-tag-pop' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ backgroundColor: SPEAKER_COLOR.shuka, animationDelay: '220ms' }}
            >
              {SPEAKER_NAME.shuka}
            </div>
            <div className={!prefersReducedMotion ? 'gq-story-shuka-float relative' : 'relative'}>
              <Character
                characterId="shuka"
                pose={shukaPose}
                expression={shukaExpr}
                animationState={isPaused ? 'none' : 'celebrate'}
                size={64}
                flipHorizontal
                className="sm:scale-110 origin-bottom"
              />
            </div>
            <div
              className="pointer-events-none -mt-1.5 w-12 h-2 rounded-full blur-[1px] opacity-35"
              style={{ backgroundColor: SPEAKER_COLOR.shuka }}
            />
          </div>
        </div>
      ) : null}

      {!zoomedView ? (
        <>
          <button
            ref={zoomTriggerRef}
            type="button"
            onClick={() => setIsBoardZoomOpen(true)}
            className="absolute bottom-2 left-1/2 z-20 inline-flex min-h-[44px] -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#D8D2C5] bg-white/95 px-3.5 text-sm font-bold text-[#263A70] shadow-md hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#263A70]"
          >
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
            <span>Read board</span>
          </button>

          <ModalDialog
            isOpen={isBoardZoomOpen}
            onClose={() => setIsBoardZoomOpen(false)}
            ariaLabel="Noticeboard close-up"
            placement="center"
            closeOnBackdropClick={false}
            initialFocusRef={zoomOkayRef}
            returnFocusRef={zoomTriggerRef}
            dialogClassName="flex w-full max-w-[720px] max-h-[90dvh] flex-col overflow-hidden rounded-[24px] bg-white shadow-xl"
          >
            <div className="flex max-h-[90dvh] min-h-0 flex-col gap-3 p-4 sm:gap-4 sm:p-6">
              <div className="shrink-0">
                <h2 className="font-heading text-xl font-extrabold text-[#263A70] sm:text-2xl">
                  Noticeboard close-up
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[#4B5C8A]">
                  Take a closer look at the board. Select Okay to return to the scene.
                </p>
              </div>

              <div className="flex min-h-0 flex-1 items-center justify-center">
                <CourtyardNoticeboardScene
                  mode={mode}
                  sceneVariant={sceneVariant}
                  sceneFocus={sceneFocus}
                  isPaused
                  animationSeed={animationSeed}
                  zoomedView
                />
              </div>

              <button
                ref={zoomOkayRef}
                type="button"
                onClick={() => setIsBoardZoomOpen(false)}
                className="min-h-[48px] w-full shrink-0 rounded-full bg-[#263A70] px-6 text-base font-bold text-white shadow-sm hover:bg-[#1D2D59] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#263A70]"
              >
                Okay
              </button>
            </div>
          </ModalDialog>
        </>
      ) : null}
    </div>
  );
};
