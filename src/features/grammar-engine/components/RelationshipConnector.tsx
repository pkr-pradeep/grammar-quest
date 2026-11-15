/**
 * ============================================================================
 * GRAMMAR QUEST — RELATIONSHIP CONNECTOR COMPONENT
 * ============================================================================
 * Renders 2D SVG connecting arcs between related tokens inside the sentence
 * stage AND interactive mobile-friendly relationship cards so students can
 * trace grammatical links (e.g. Adjective -> Noun, Subject <-> Verb) cleanly
 * on both 390px phones and desktop screens.
 * ============================================================================
 */

import React, { useLayoutEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type {
  RelationshipType,
  SentenceToken,
  WordRelationship,
} from '../../../schemas/grammarEngine.schema';

interface ConnectorArc {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isHighlighted: boolean;
  strokeColor: string;
}

export interface RelationshipConnectorOverlayProps {
  stageRef: React.RefObject<HTMLDivElement | null>;
  tokenRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  relationships: WordRelationship[];
  activeRelationshipIds?: string[];
  allowedTypes?: RelationshipType[];
  selectedRelationshipId?: string | null;
  isPaused?: boolean;
  animationSeed?: number;
}

const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
  'determiner-noun': '#BE185D',
  'adjective-noun': '#C2410C',
  'verb-subject': '#263A70',
  'adverb-verb': '#7E22CE',
  'pronoun-noun': '#0F766E',
  'conjunction-elements': '#A16207',
  'preposition-relation': '#B91C1C',
};

export const RelationshipConnectorOverlay: React.FC<RelationshipConnectorOverlayProps> = ({
  stageRef,
  tokenRefs,
  relationships,
  activeRelationshipIds,
  allowedTypes,
  selectedRelationshipId = null,
  isPaused = false,
  animationSeed = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [arcs, setArcs] = useState<ConnectorArc[]>([]);
  const [boxSize, setBoxSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const activeRelKey = activeRelationshipIds?.join(',') ?? '';
  const allowedTypesKey = allowedTypes?.join(',') ?? '';

  const visibleRelationships = useMemo(
    () =>
      relationships.filter((rel) => {
        if (!rel.activeInLesson) return false;
        if (allowedTypes && !allowedTypes.includes(rel.type)) return false;
        if (activeRelationshipIds && activeRelationshipIds.length > 0) {
          return activeRelationshipIds.includes(rel.id);
        }
        return selectedRelationshipId === rel.id;
      }),
    [relationships, allowedTypesKey, activeRelKey, selectedRelationshipId],
  );

  useLayoutEffect(() => {
    const measure = () => {
      const stageEl = stageRef.current;
      if (!stageEl || visibleRelationships.length === 0) {
        setArcs((prev) => (prev.length === 0 ? prev : []));
        return;
      }

      const stageRect = stageEl.getBoundingClientRect();
      if (stageRect.width === 0) return;

      setBoxSize((prev) =>
        prev.width === stageRect.width && prev.height === stageRect.height
          ? prev
          : { width: stageRect.width, height: stageRect.height },
      );

      const nextArcs: ConnectorArc[] = [];
      for (const rel of visibleRelationships) {
        const fromEl = tokenRefs.current[rel.fromTokenIds[0]];
        const toEl = tokenRefs.current[rel.toTokenIds[0]];
        if (!fromEl || !toEl) continue;

        const r1 = fromEl.getBoundingClientRect();
        const r2 = toEl.getBoundingClientRect();

        const y1 = r1.top - stageRect.top;
        const y2 = r2.top - stageRect.top;
        const x1 = r1.left - stageRect.left + r1.width / 2;
        const x2 = r2.left - stageRect.left + r2.width / 2;

        nextArcs.push({
          id: rel.id,
          x1,
          y1,
          x2,
          y2,
          isHighlighted: selectedRelationshipId === rel.id || !selectedRelationshipId,
          strokeColor: RELATIONSHIP_COLORS[rel.type] ?? '#263A70',
        });
      }
      setArcs((prev) => {
        if (
          prev.length === nextArcs.length &&
          prev.every(
            (a, idx) =>
              a.id === nextArcs[idx].id &&
              Math.abs(a.x1 - nextArcs[idx].x1) < 0.5 &&
              Math.abs(a.y1 - nextArcs[idx].y1) < 0.5 &&
              Math.abs(a.x2 - nextArcs[idx].x2) < 0.5 &&
              Math.abs(a.y2 - nextArcs[idx].y2) < 0.5 &&
              a.isHighlighted === nextArcs[idx].isHighlighted,
          )
        ) {
          return prev;
        }
        return nextArcs;
      });
    };

    measure();
    const raf = window.requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    const stageEl = stageRef.current;
    const ro =
      typeof ResizeObserver !== 'undefined' && stageEl
        ? new ResizeObserver(measure)
        : null;
    if (ro && stageEl) ro.observe(stageEl);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [stageRef, tokenRefs, visibleRelationships, selectedRelationshipId, animationSeed]);

  if (arcs.length === 0 || boxSize.width === 0) return null;

  return (
    <svg
      aria-hidden="true"
      width={boxSize.width}
      height={boxSize.height}
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      <defs>
        {Object.entries(RELATIONSHIP_COLORS).map(([type, color]) => (
          <marker
            key={type}
            id={`gq-arrow-${type}`}
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={color} />
          </marker>
        ))}
      </defs>
      {arcs.map((arc, i) => {
        const rel = visibleRelationships.find((r) => r.id === arc.id);
        const midX = (arc.x1 + arc.x2) / 2;
        const archLift = Math.min(34, Math.max(18, Math.abs(arc.x2 - arc.x1) * 0.2));
        const topY = Math.min(arc.y1, arc.y2) - archLift;
        const d = `M ${arc.x1} ${arc.y1 - 2} Q ${midX} ${topY} ${arc.x2} ${arc.y2 - 2}`;

        return (
          <motion.path
            key={arc.id}
            d={d}
            fill="none"
            stroke={arc.strokeColor}
            strokeWidth={arc.isHighlighted ? 2.5 : 1.75}
            strokeLinecap="round"
            markerEnd={rel ? `url(#gq-arrow-${rel.type})` : undefined}
            initial={
              prefersReducedMotion || isPaused ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.2 }
            }
            animate={{ pathLength: 1, opacity: arc.isHighlighted ? 1 : 0.45 }}
            transition={
              prefersReducedMotion || isPaused
                ? { duration: 0 }
                : { duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
            }
          />
        );
      })}
    </svg>
  );
};

export interface RelationshipListProps {
  relationships: WordRelationship[];
  tokens: SentenceToken[];
  allowedTypes?: RelationshipType[];
  selectedRelationshipId: string | null;
  onSelectRelationship: (relationship: WordRelationship | null) => void;
}

export const RelationshipList: React.FC<RelationshipListProps> = ({
  relationships,
  tokens,
  allowedTypes,
  selectedRelationshipId,
  onSelectRelationship,
}) => {
  const tokenMap = new Map(tokens.map((t) => [t.id, t]));
  const filtered = relationships.filter(
    (r) => r.activeInLesson && (!allowedTypes || allowedTypes.includes(r.type)),
  );

  if (filtered.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-[#4B5C8A]">
        Word connections (tap one to highlight):
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map((rel) => {
          const isSelected = selectedRelationshipId === rel.id;
          const fromText = rel.fromTokenIds.map((id) => tokenMap.get(id)?.text).filter(Boolean).join(' ');
          const toText = rel.toTokenIds.map((id) => tokenMap.get(id)?.text).filter(Boolean).join(' ');

          return (
            <button
              key={rel.id}
              type="button"
              onClick={() => onSelectRelationship(isSelected ? null : rel)}
              aria-pressed={isSelected}
              className={[
                'text-left rounded-[12px] border px-3 py-2.5 min-h-[44px] transition-colors duration-150 cursor-pointer',
                isSelected
                  ? 'bg-[#FFF4D6] border-[#F59B19] text-[#263A70]'
                  : 'bg-[#FDFCF9] border-[#E5E2D9] hover:border-[#263A70] text-[#333333]',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#263A70]">
                  <span>&ldquo;{fromText}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F59B19]" aria-hidden="true" />
                  <span>&ldquo;{toText}&rdquo;</span>
                </span>
                <span className="text-[11px] font-medium text-[#4B5C8A] whitespace-nowrap">
                  {rel.label}
                </span>
              </div>
              {isSelected ? (
                <p className="mt-1.5 text-xs text-[#333333] leading-snug">{rel.explanation}</p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
