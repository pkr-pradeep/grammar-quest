/**
 * ============================================================================
 * GRAMMAR QUEST — INTERNAL DEVELOPER CHARACTER REFERENCE SHEET
 * ============================================================================
 * Internal development resource (accessed via #character-sheet or ?dev=characters).
 * Not exposed in student-facing navigation or Grammar Guide.
 *
 * Verifies:
 * - Standard appearance lineup for Mira, Arjun, and Gyan together
 * - Colour palette hex references and proportions
 * - Isolated expression verification (fixed standing-idle pose)
 * - Isolated 10-pose verification (fixed happy expression)
 * - Interactive single-state inspector separating Pose, Expression, and Motion
 * ============================================================================
 */

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  ALL_ANIMATION_STATES,
  ALL_POSES,
  Badge,
  Button,
  CHARACTER_MASTERS,
  Card,
  Character,
  type CharacterAnimationState,
  type CharacterExpression,
  type CharacterId,
  type CharacterPose,
  type CharacterSize,
} from '../../components';

interface CharacterReferenceSheetProps {
  onBack?: () => void;
}

const CHARACTER_IDS: CharacterId[] = ['mira', 'arjun', 'gyan'];
const INSPECTOR_SIZES: CharacterSize[] = ['sm', 'md', 'lg'];

export const CharacterReferenceSheet: React.FC<CharacterReferenceSheetProps> = ({
  onBack,
}) => {
  const [selectedChar, setSelectedChar] = useState<CharacterId>('mira');
  const [selectedPose, setSelectedPose] = useState<CharacterPose>('standing-idle');
  const [selectedExpression, setSelectedExpression] =
    useState<CharacterExpression>('happy');
  const [selectedAnim, setSelectedAnim] =
    useState<CharacterAnimationState>('idle');
  const [selectedSize, setSelectedSize] = useState<CharacterSize>('lg');
  const [flipHorizontal, setFlipHorizontal] = useState(false);

  const activeMaster = CHARACTER_MASTERS[selectedChar];

  const handleSelectCharacter = (id: CharacterId) => {
    setSelectedChar(id);
    const supported = CHARACTER_MASTERS[id].supportedExpressions;
    if (!supported.includes(selectedExpression)) {
      setSelectedExpression('happy');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <Badge tone="navy">Internal Development Resource</Badge>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#263A70]">
            Character Reference Sheet
          </h1>
          <p className="text-sm text-[#4B5C8A]">
            Master 2D specifications for Mira, Arjun, and Gyan. One active pose, one active expression, and independent animation state.
          </p>
        </div>

        {onBack ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Return to App
          </Button>
        ) : null}
      </div>

      {/* 1. Standard Appearance Trio Lineup + Specifications */}
      <Card surface="cream" padding="md" className="sm:p-6 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold text-[#263A70]">
            1. Standard Appearance — Trio Lineup
          </h2>
          <span className="text-xs font-medium text-[#4B5C8A]">
            180×240 viewBox • 2.5px #263A70 stroke
          </span>
        </div>

        <div className="rounded-[16px] bg-white border border-[#F2DFB6] px-3 py-5 flex flex-wrap items-end justify-center gap-4 sm:gap-10">
          {CHARACTER_IDS.map((id) => (
            <div key={id} className="flex flex-col items-center text-center">
              <Character
                characterId={id}
                pose="standing-idle"
                expression="happy"
                animationState="none"
                size="md"
              />
              <span className="mt-2 text-sm font-semibold text-[#263A70]">
                {CHARACTER_MASTERS[id].name}
              </span>
              <span className="text-xs text-[#4B5C8A]">
                {CHARACTER_MASTERS[id].roleTitle}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {CHARACTER_IDS.map((id) => {
            const spec = CHARACTER_MASTERS[id];
            return (
              <Card key={id} surface="white" padding="sm" className="space-y-2.5">
                <div>
                  <h3 className="font-heading text-base font-semibold text-[#263A70]">
                    {spec.name}
                  </h3>
                  <p className="text-xs font-medium text-[#A15C00]">{spec.roleTitle}</p>
                </div>
                <p className="text-xs text-[#333333] leading-relaxed">{spec.summary}</p>
                <p className="text-[11px] text-[#4B5C8A]">{spec.proportions}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {spec.palette.map((swatch) => (
                    <div
                      key={swatch.hex + swatch.label}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#263A70] bg-[#FDFCF9] border border-[#E5E2D9] rounded-[8px] px-2 py-1"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-[#263A70]/30 shrink-0"
                        style={{ backgroundColor: swatch.hex }}
                        aria-hidden="true"
                      />
                      <span>{swatch.label}</span>
                      <code className="text-[10px] text-[#4B5C8A]">{swatch.hex}</code>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* 2. Interactive Single-State Inspector */}
      <Card surface="white" padding="md" className="sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold text-[#263A70]">
            2. Interactive State Inspector
          </h2>
          <Badge tone="turquoise">Independent Props</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Preview Stage */}
          <div className="lg:col-span-5 rounded-[16px] bg-[#FFF1D5] border border-[#F2DFB6] p-5 flex flex-col items-center justify-center min-h-[280px]">
            <Character
              key={`${selectedChar}-${selectedAnim}`}
              characterId={selectedChar}
              pose={selectedPose}
              expression={selectedExpression}
              animationState={selectedAnim}
              flipHorizontal={flipHorizontal}
              size={selectedSize}
            />
            <code className="mt-3 px-2.5 py-1 rounded-[8px] bg-white border border-[#F2DFB6] text-[11px] text-[#263A70] text-center break-all">
              {`<Character characterId="${selectedChar}" pose="${selectedPose}" expression="${selectedExpression}" animationState="${selectedAnim}" size="${selectedSize}"${flipHorizontal ? ' flipHorizontal' : ''} />`}
            </code>
          </div>

          {/* Controls */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Character */}
              <div>
                <span className="block text-xs font-semibold text-[#4B5C8A] mb-1.5">
                  Character
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CHARACTER_IDS.map((id) => (
                    <Button
                      key={id}
                      size="sm"
                      variant={selectedChar === id ? 'primary' : 'secondary'}
                      onClick={() => handleSelectCharacter(id)}
                    >
                      {CHARACTER_MASTERS[id].name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size & Flip */}
              <div>
                <span className="block text-xs font-semibold text-[#4B5C8A] mb-1.5">
                  Size &amp; Facing
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {INSPECTOR_SIZES.map((sz) => (
                    <button
                      key={String(sz)}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={[
                        'min-h-[40px] px-3 py-1.5 rounded-[10px] text-xs font-medium uppercase cursor-pointer border',
                        selectedSize === sz
                          ? 'bg-[#263A70] text-white border-[#263A70]'
                          : 'bg-white text-[#263A70] border-[#E5E2D9] hover:bg-[#FFF9EC]',
                      ].join(' ')}
                    >
                      {sz}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFlipHorizontal((prev) => !prev)}
                    className={[
                      'min-h-[40px] px-3 py-1.5 rounded-[10px] text-xs font-medium cursor-pointer border',
                      flipHorizontal
                        ? 'bg-[#263A70] text-white border-[#263A70]'
                        : 'bg-white text-[#263A70] border-[#E5E2D9]',
                    ].join(' ')}
                  >
                    Flip: {flipHorizontal ? 'Left' : 'Right'}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Expression (1 at a time) */}
            <div>
              <span className="block text-xs font-semibold text-[#4B5C8A] mb-1.5">
                Active Expression (1 of {activeMaster.supportedExpressions.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeMaster.supportedExpressions.map((expr) => (
                  <button
                    key={expr}
                    type="button"
                    onClick={() => setSelectedExpression(expr)}
                    className={[
                      'min-h-[38px] px-3 py-1.5 rounded-[10px] text-xs font-medium capitalize cursor-pointer border',
                      selectedExpression === expr
                        ? 'bg-[#263A70] text-white border-[#263A70]'
                        : 'bg-white text-[#263A70] border-[#E5E2D9] hover:bg-[#FFF9EC]',
                    ].join(' ')}
                  >
                    {expr}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Pose (1 at a time) */}
            <div>
              <span className="block text-xs font-semibold text-[#4B5C8A] mb-1.5">
                Active Pose (1 of 10)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ALL_POSES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPose(p.id)}
                    className={[
                      'min-h-[38px] px-3 py-1.5 rounded-[10px] text-xs font-medium cursor-pointer border',
                      selectedPose === p.id
                        ? 'bg-[#8DECE0] text-[#263A70] border-[#65D8CA]'
                        : 'bg-white text-[#263A70] border-[#E5E2D9] hover:bg-[#FFF9EC]',
                    ].join(' ')}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Independent Animation State */}
            <div>
              <span className="block text-xs font-semibold text-[#4B5C8A] mb-1.5">
                Animation State (separate from pose &amp; expression)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ALL_ANIMATION_STATES.map((anim) => (
                  <button
                    key={anim.id}
                    type="button"
                    onClick={() => setSelectedAnim(anim.id)}
                    className={[
                      'min-h-[38px] px-3 py-1.5 rounded-[10px] text-xs font-medium cursor-pointer border',
                      selectedAnim === anim.id
                        ? 'bg-[#FFC64B] text-[#263A70] border-[#EAB030]'
                        : 'bg-white text-[#263A70] border-[#E5E2D9] hover:bg-[#FFF9EC]',
                    ].join(' ')}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Isolated Expression Matrix (standing-idle pose fixed) */}
      <Card surface="white" padding="md" className="sm:p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="font-heading text-lg font-semibold text-[#263A70]">
            3. Expressions Reference (Neutral Standing Pose)
          </h2>
          <p className="text-xs text-[#4B5C8A]">
            Rendered in fixed standing-idle pose so facial expressions are verified independently.
          </p>
        </div>

        <div className="space-y-5">
          {CHARACTER_IDS.map((id) => {
            const master = CHARACTER_MASTERS[id];
            return (
              <div key={id} className="space-y-2">
                <h3 className="text-sm font-semibold text-[#263A70]">
                  {master.name} — {master.roleTitle}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                  {master.supportedExpressions.map((expr) => (
                    <div
                      key={expr}
                      className="rounded-[12px] bg-[#FDFCF9] border border-[#E5E2D9] p-2.5 flex flex-col items-center text-center"
                    >
                      <Character
                        characterId={id}
                        pose="standing-idle"
                        expression={expr}
                        animationState="none"
                        size={76}
                      />
                      <span className="mt-1 text-xs font-medium capitalize text-[#263A70]">
                        {expr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Isolated 10-Pose Consistency Matrix (happy expression fixed) */}
      <Card surface="white" padding="md" className="sm:p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="font-heading text-lg font-semibold text-[#263A70]">
            4. Complete 10-Pose Consistency Matrix (Neutral Happy Expression)
          </h2>
          <p className="text-xs text-[#4B5C8A]">
            Rendered in fixed happy expression so posture, clothing, and proportions are verified across all 10 poses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {ALL_POSES.map((poseObj, idx) => (
            <div
              key={poseObj.id}
              className="rounded-[14px] bg-[#FDFCF9] border border-[#E5E2D9] p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[#263A70] tabular-nums">
                  {idx + 1}. {poseObj.label}
                </span>
                <Badge tone="neutral">{poseObj.id}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 items-end justify-items-center bg-white rounded-[12px] border border-[#E5E2D9] py-3 px-2">
                {CHARACTER_IDS.map((charId) => (
                  <div key={charId} className="flex flex-col items-center">
                    <Character
                      characterId={charId}
                      pose={poseObj.id}
                      expression="happy"
                      animationState="none"
                      size={78}
                    />
                    <span className="text-[11px] font-medium text-[#4B5C8A] mt-1">
                      {CHARACTER_MASTERS[charId].name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
