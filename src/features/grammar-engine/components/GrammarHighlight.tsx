/**
 * ============================================================================
 * GRAMMAR QUEST — GRAMMAR HIGHLIGHT BANNER
 * ============================================================================
 * Accessible cue strip pairing semantic highlight colour with an explicit text
 * label and icon explaining why the focused token or group is highlighted.
 * ============================================================================
 */

import React from 'react';
import { Crosshair, Layers, MessageSquare } from 'lucide-react';
import type { GrammaticalCategory, WordGroupRole } from '../../../schemas/grammarEngine.schema';
import { GRAMMATICAL_CATEGORY_META, GROUP_ROLE_META } from '../categoryMeta';

export interface GrammarHighlightProps {
  groupRole?: WordGroupRole | null;
  category?: GrammaticalCategory | null;
  label: string;
  detail?: string;
}

export const GrammarHighlight: React.FC<GrammarHighlightProps> = ({
  groupRole = null,
  category = null,
  label,
  detail,
}) => {
  const groupMeta = groupRole ? GROUP_ROLE_META[groupRole] : null;
  const catMeta = category ? GRAMMATICAL_CATEGORY_META[category] : null;
  const Icon = groupRole === 'subject' ? Layers : groupRole === 'predicate' ? MessageSquare : Crosshair;

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'rounded-[12px] border px-3.5 py-2.5 flex items-start gap-2.5 text-sm',
        groupMeta ? `${groupMeta.bgClass} ${groupMeta.borderClass}` : 'bg-[#FDFCF9] border-[#E5E2D9]',
      ].join(' ')}
    >
      <span
        className="w-7 h-7 rounded-[8px] bg-white border border-[#E5E2D9] flex items-center justify-center shrink-0 text-[#263A70]"
        aria-hidden="true"
      >
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[#263A70]">{label}</span>
          {catMeta ? (
            <span
              style={{ backgroundColor: catMeta.bgVar, color: catMeta.fgVar }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-xs font-semibold"
            >
              <span aria-hidden="true">{catMeta.symbol}</span>
              <span>{catMeta.label}</span>
            </span>
          ) : null}
        </div>
        {detail ? <p className="text-xs sm:text-sm text-[#333333] leading-snug">{detail}</p> : null}
      </div>
    </div>
  );
};
