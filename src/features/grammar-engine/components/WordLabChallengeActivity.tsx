/**
 * ============================================================================
 * GRAMMAR QUEST — WORD REPLACEMENT, MISSING WORDS & ERROR LAB ACTIVITIES (D–F)
 * ============================================================================
 * Reusable JSON-driven views for:
 * D. Word replacement (live preview + meaning/grammatical impact)
 * E. Missing words (complete torn sentence with immediate feedback)
 * F. Error identification (diagnose incomplete or broken sentence structure)
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type {
  ErrorIdentificationActivity,
  MissingWordsActivity,
  WordReplacementActivity,
} from '../../../schemas/grammarEngine.schema';
import { GROUP_ROLE_META } from '../categoryMeta';
import { WordTile } from './WordTile';
import { PracticeFeedback } from './PracticeFeedback';

/* --------------------------------------------------------------------------
   D. Word Replacement Activity
   -------------------------------------------------------------------------- */
export const WordReplacementView: React.FC<{
  activity: WordReplacementActivity;
  onSolved?: () => void;
}> = ({ activity, onSolved }) => {
  const prefersReducedMotion = useReducedMotion();
  const [selectedOptId, setSelectedOptId] = useState<string>(activity.options[0]?.id ?? '');
  const [exploredIds, setExploredIds] = useState<string[]>([]);

  const selectedOption =
    activity.options.find((o) => o.id === selectedOptId) ?? activity.options[0];
  const slotMeta = GROUP_ROLE_META[activity.slotGroupRole];

  const handleSelectWord = (optId: string) => {
    setSelectedOptId(optId);
    const nextExplored = exploredIds.includes(optId)
      ? exploredIds
      : [...exploredIds, optId];
    setExploredIds(nextExplored);
    if (nextExplored.length >= 2) {
      onSolved?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-[#263A70]">
          {activity.title}
        </h3>
        <p className="text-sm text-[#333333]">{activity.instruction}</p>
      </div>

      {/* Live Sentence Preview */}
      <div className="rounded-[16px] bg-white border border-[#E5E2D9] p-4 space-y-3">
        <div className="text-xs font-semibold text-[#4B5C8A]">
          {activity.slotLabel ?? `Active slot inside ${slotMeta.label}:`}
        </div>

        <p className="text-base sm:text-xl font-semibold text-[#263A70] leading-relaxed flex flex-wrap items-center gap-1.5">
          <span>{activity.beforeText}</span>
          <motion.span
            key={selectedOption.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className={`inline-flex items-center px-3 py-1 rounded-[10px] border-2 ${slotMeta.bgClass} ${slotMeta.borderClass} text-[#263A70]`}
          >
            {selectedOption.word}
          </motion.span>
          <span>{activity.afterText}</span>
        </p>

        <div className="space-y-1.5 pt-1">
          <p className="text-xs font-medium text-[#4B5C8A]">
            Tap at least two word options to compare how meaning changes:
          </p>
          <div className="flex flex-wrap gap-2">
            {activity.options.map((opt) => (
              <WordTile
                key={opt.id}
                text={opt.word}
                category={opt.category}
                isSelected={selectedOptId === opt.id}
                onClick={() => handleSelectWord(opt.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <PracticeFeedback
        status={exploredIds.length >= 2 ? 'correct' : 'info'}
        title={`Using "${selectedOption.word}"`}
        message={`${selectedOption.meaningEffect} ${selectedOption.roleImpactNote} — ${activity.takeaway}`}
      />
    </div>
  );
};

/* --------------------------------------------------------------------------
   E. Missing Words Activity
   -------------------------------------------------------------------------- */
export const MissingWordsView: React.FC<{
  activity: MissingWordsActivity;
  onSolved?: () => void;
}> = ({ activity, onSolved }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedOption = activity.options.find((o) => o.id === selectedId) ?? null;

  const handlePick = (optId: string, isCorrect: boolean) => {
    setSelectedId(optId);
    if (isCorrect) {
      onSolved?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-[#263A70]">
          {activity.title}
        </h3>
        <p className="text-sm text-[#333333]">{activity.instruction}</p>
      </div>

      <div className="rounded-[16px] bg-white border border-[#E5E2D9] p-4 space-y-3">
        <p className="text-base sm:text-lg font-semibold text-[#263A70] leading-relaxed">
          <span>{activity.sentenceBeforeBlank} </span>
          <span className="inline-block px-3 py-0.5 rounded-[8px] border-2 border-dashed border-[#F59B19] bg-[#FFF4D6] text-[#263A70]">
            {selectedOption ? selectedOption.text : '________'}
          </span>
          <span>{activity.sentenceAfterBlank}</span>
        </p>

        <div className="space-y-2 pt-1">
          {activity.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handlePick(opt.id, opt.isCorrect)}
                aria-pressed={isSelected}
                className={[
                  'w-full text-left rounded-[12px] border-2 px-3.5 py-3 min-h-[44px] text-sm sm:text-base font-medium transition-colors cursor-pointer',
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]'
                      : 'bg-[#FEE8E7] border-[#F36F68] text-[#263A70]'
                    : 'bg-[#FDFCF9] border-[#E5E2D9] text-[#263A70] hover:border-[#263A70]',
                ].join(' ')}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>

      {selectedOption ? (
        <PracticeFeedback
          status={selectedOption.isCorrect ? 'correct' : 'try-again'}
          title={
            selectedOption.isCorrect
              ? 'Message repaired'
              : (activity.incorrectTitle ??
                (activity.missingRole === 'predicate'
                  ? 'Still missing a finite verb'
                  : 'Check your choice'))
          }
          message={selectedOption.feedback}
        />
      ) : null}
    </div>
  );
};

/* --------------------------------------------------------------------------
   F. Error Identification Activity
   -------------------------------------------------------------------------- */
export const ErrorIdentificationView: React.FC<{
  activity: ErrorIdentificationActivity;
  onSolved?: () => void;
}> = ({ activity, onSolved }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedOption = activity.options.find((o) => o.id === selectedId) ?? null;

  const handlePick = (optId: string, isCorrect: boolean) => {
    setSelectedId(optId);
    if (isCorrect) {
      onSolved?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-[#263A70]">
          {activity.title}
        </h3>
        <p className="text-sm text-[#333333]">{activity.instruction}</p>
      </div>

      <div className="rounded-[16px] bg-white border border-[#E5E2D9] p-4 space-y-3">
        <div className="rounded-[12px] bg-[#FEE8E7] border border-[#F7C2BF] px-3.5 py-2.5">
          <p className="text-xs font-semibold text-[#9E2A25]">
            {activity.draftBadgeLabel ?? 'Broken Noticeboard Draft'}
          </p>
          <p className="text-base font-semibold text-[#263A70] mt-0.5">
            {activity.brokenSentence}
          </p>
        </div>

        <p className="text-sm font-semibold text-[#263A70]">{activity.question}</p>

        <div className="space-y-2">
          {activity.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handlePick(opt.id, opt.isCorrect)}
                aria-pressed={isSelected}
                className={[
                  'w-full text-left rounded-[12px] border-2 px-3.5 py-3 min-h-[44px] text-sm font-medium transition-colors cursor-pointer',
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-[#D9FAF5] border-[#1FA89A] text-[#263A70]'
                      : 'bg-[#FEE8E7] border-[#F36F68] text-[#263A70]'
                    : 'bg-[#FDFCF9] border-[#E5E2D9] text-[#263A70] hover:border-[#263A70]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {selectedOption ? (
        <div className="space-y-2.5">
          <PracticeFeedback
            status={selectedOption.isCorrect ? 'correct' : 'try-again'}
            title={selectedOption.isCorrect ? 'Accurate diagnosis' : 'Check again'}
            message={selectedOption.feedback}
          />
          {selectedOption.isCorrect ? (
            <div className="rounded-[12px] bg-[#FFF1D5] border border-[#F2DFB6] px-3.5 py-2.5">
              <p className="text-xs font-semibold text-[#A15C00]">Complete Repaired Sentence</p>
              <p className="text-sm sm:text-base font-semibold text-[#263A70] mt-0.5">
                {activity.repairedSentence}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
