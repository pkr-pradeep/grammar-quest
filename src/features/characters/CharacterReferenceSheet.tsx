/**
 * ============================================================================
 * GRAMMAR QUEST — INTERNAL DEVELOPER CHARACTER REFERENCE SHEET
 * ============================================================================
 * Internal development resource (accessed via #character-sheet or ?dev=characters).
 * Not exposed in student-facing navigation or Grammar Guide.
 *
 * Verifies:
 * - Standard appearance lineup for Mira, Arjun, and ShukaJi together
 * - Colour palette hex references and proportions
 * - Isolated expression verification (fixed standing-idle pose)
 * - Isolated pose verification (fixed happy expression)
 * - Interactive single-state inspector separating Pose, Expression, and Motion
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pause, Volume2 } from 'lucide-react';
import miraIntroSpeech from '../../assets/audio/mira_intro_speech.mp3';
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

const CHARACTER_IDS: CharacterId[] = ['mira', 'arjun', 'shuka'];
const INSPECTOR_SIZES: CharacterSize[] = ['sm', 'md', 'lg'];

const VOICE_SAMPLES: Record<
  CharacterId,
  { line: string | null; accent: string; pitch: number; rate: number }
> = {
  mira: {
    line: null,
    accent: 'Provided Mira recording',
    pitch: 1.08,
    rate: 0.94,
  },
  arjun: {
    line: "Hello, I'm Arjun. Ready to solve a grammar puzzle? Let's figure it out together!",
    accent: 'Youthful English; Odia-influenced Indian accent requested',
    pitch: 1.04,
    rate: 0.94,
  },
  shuka: {
    line: "Namaste, learners! I'm Śukaji. Come along—English is more fun when we learn together!",
    accent: 'Warm feminine Indian English requested',
    pitch: 1.02,
    rate: 0.98,
  },
};

const voiceKey = (voice: SpeechSynthesisVoice) =>
  voice.voiceURI || `${voice.name}-${voice.lang}`;

const preferredVoice = (
  id: CharacterId,
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined => {
  const indianEnglishVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith('en-in'),
  );
  const candidates = indianEnglishVoices.length ? indianEnglishVoices : voices;
  const preference =
    id === 'arjun'
      ? /ravi|male|man|david|mark|hemant/i
      : /heera|female|woman|zira|samantha|karen|kalpana/i;

  return candidates.find((voice) => preference.test(voice.name)) ?? candidates[0];
};

const VoiceSamplePreview: React.FC = () => {
  const [activeSample, setActiveSample] = useState<CharacterId | null>(null);
  const [status, setStatus] = useState('');
  const [deviceVoices, setDeviceVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoices, setSelectedVoices] = useState<
    Partial<Record<CharacterId, string>>
  >({});
  const activeSampleRef = useRef<CharacterId | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const speech = 'speechSynthesis' in window ? window.speechSynthesis : null;
    const loadVoices = () => {
      if (!speech) return;
      setDeviceVoices(
        speech
          .getVoices()
          .filter((voice) => voice.lang.toLowerCase().startsWith('en')),
      );
    };

    if (speech) {
      loadVoices();
      speech.addEventListener('voiceschanged', loadVoices);
    }

    return () => {
      speech?.removeEventListener('voiceschanged', loadVoices);
      speech?.cancel();
      activeAudioRef.current?.pause();
      activeAudioRef.current = null;
    };
  }, []);

  const playSample = (id: CharacterId) => {
    if (typeof window === 'undefined') {
      return;
    }

    const speech =
      'speechSynthesis' in window ? window.speechSynthesis : null;
    if (activeSampleRef.current === id) {
      activeSampleRef.current = null;
      speech?.cancel();
      activeAudioRef.current?.pause();
      activeAudioRef.current = null;
      setActiveSample(null);
      setStatus('Voice sample stopped.');
      return;
    }

    speech?.cancel();
    activeAudioRef.current?.pause();
    activeAudioRef.current = null;

    if (id === 'mira') {
      const audio = new Audio(miraIntroSpeech);
      activeAudioRef.current = audio;
      activeSampleRef.current = id;
      setActiveSample(id);
      setStatus('Playing the provided Mira voice recording.');
      audio.onended = () => {
        if (activeSampleRef.current === id) {
          activeSampleRef.current = null;
          activeAudioRef.current = null;
          setActiveSample(null);
          setStatus('Voice sample finished.');
        }
      };
      audio.onerror = () => {
        if (activeSampleRef.current === id) {
          activeSampleRef.current = null;
          activeAudioRef.current = null;
          setActiveSample(null);
          setStatus('Mira’s audio sample could not be played.');
        }
      };
      void audio.play().catch(() => {
        if (activeSampleRef.current === id) {
          activeSampleRef.current = null;
          activeAudioRef.current = null;
          setActiveSample(null);
          setStatus('Mira’s audio sample could not be played.');
        }
      });
      return;
    }

    if (!speech) {
      setStatus('Speech playback is not supported by this browser.');
      return;
    }

    const availableVoices = speech
      .getVoices()
      .filter((candidate) => candidate.lang.toLowerCase().startsWith('en'));
    const voice =
      availableVoices.find(
        (candidate) => voiceKey(candidate) === selectedVoices[id],
      ) ?? preferredVoice(id, availableVoices);

    if (!voice) {
      setStatus(
        'No English voice is available. Install an English voice in your device speech settings and try again.',
      );
      return;
    }
    const line = VOICE_SAMPLES[id].line;
    if (!line) {
      setStatus('No text sample is available for this character.');
      return;
    }

    speech.cancel();
    activeSampleRef.current = id;
    setActiveSample(id);
    setStatus(`Playing ${CHARACTER_MASTERS[id].name} with the device voice (${voice.lang}).`);

    const utterance = new SpeechSynthesisUtterance(line);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.pitch = VOICE_SAMPLES[id].pitch;
    utterance.rate = VOICE_SAMPLES[id].rate;
    utterance.onend = () => {
      if (activeSampleRef.current === id) {
        activeSampleRef.current = null;
        setActiveSample(null);
        setStatus('Voice sample finished.');
      }
    };
    utterance.onerror = () => {
      if (activeSampleRef.current === id) {
        activeSampleRef.current = null;
        setActiveSample(null);
        setStatus('Voice playback failed. Check your device speech settings.');
      }
    };

    speech.speak(utterance);
  };

  return (
    <Card surface="white" padding="md" className="sm:p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="font-heading text-lg font-semibold text-[#263A70]">
          Voice Sample Preview
        </h2>
        <p className="text-xs leading-relaxed text-[#4B5C8A]">
          Mira plays the supplied recording. Arjun and Śukaji use installed device
          voices; their age and regional accent are not guaranteed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {CHARACTER_IDS.map((id) => {
          const sample = VOICE_SAMPLES[id];
          const defaultVoice = preferredVoice(id, deviceVoices);
          const isActive = activeSample === id;
          return (
            <Card key={id} surface="cream" padding="sm" className="space-y-3">
              <div>
                <h3 className="font-heading text-base font-semibold text-[#263A70]">
                  {CHARACTER_MASTERS[id].name}
                </h3>
                <p className="text-[11px] text-[#A15C00]">{sample.accent}</p>
              </div>
              {sample.line ? (
                <p className="text-sm leading-relaxed text-[#333333]">{sample.line}</p>
              ) : null}
              {id === 'mira' ? (
                <p className="text-xs text-[#4B5C8A]">
                  Plays the supplied MP3 recording.
                </p>
              ) : (
                <label className="block space-y-1 text-xs font-medium text-[#4B5C8A]">
                  <span>Installed English voice</span>
                  <select
                    value={
                      selectedVoices[id] ??
                      (defaultVoice ? voiceKey(defaultVoice) : '')
                    }
                    onChange={(event) =>
                      setSelectedVoices((current) => ({
                        ...current,
                        [id]: event.target.value,
                      }))
                    }
                    disabled={deviceVoices.length === 0}
                    className="min-h-[44px] w-full rounded-[10px] border border-[#E5E2D9] bg-white px-3 text-sm text-[#263A70] disabled:opacity-60"
                  >
                    {deviceVoices.length === 0 ? (
                      <option value="">Loading device voices…</option>
                    ) : null}
                    {deviceVoices.map((voice) => (
                      <option key={voiceKey(voice)} value={voiceKey(voice)}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button
                type="button"
                onClick={() => playSample(id)}
                aria-label={`${isActive ? 'Stop' : 'Play'} ${CHARACTER_MASTERS[id].name} voice sample`}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-[#263A70] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1B2559] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#263A70]"
              >
                {isActive ? (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                )}
                {isActive ? 'Stop sample' : 'Play sample'}
              </button>
            </Card>
          );
        })}
      </div>
      <p className="min-h-5 text-xs text-[#4B5C8A]" role="status" aria-live="polite">
        {status}
      </p>
      <p className="text-[11px] leading-relaxed text-[#4B5C8A]">
        For Arjun and Śukaji, automatic choices prefer Indian English and a voice-name
        hint when available. Choose an installed voice above and compare by listening.
        Device TTS does not expose gender or Telugu/Odia-specific English accents.
      </p>
    </Card>
  );
};

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
            Master character specifications for Mira, Arjun, and Śukaji. One active pose, one active expression, and independent animation state.
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
            Character-specific artwork and expression variants
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

      <VoiceSamplePreview />

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
                Active Pose (1 of {ALL_POSES.length})
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

      {/* 4. Pose Consistency Matrix (happy expression fixed) */}
      <Card surface="white" padding="md" className="sm:p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="font-heading text-lg font-semibold text-[#263A70]">
            4. Complete Pose Consistency Matrix (Neutral Happy Expression)
          </h2>
          <p className="text-xs text-[#4B5C8A]">
            Rendered in a fixed happy expression so the available poses can be compared consistently.
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
