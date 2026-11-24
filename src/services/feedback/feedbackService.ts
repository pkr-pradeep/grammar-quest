export interface FeedbackPreferences {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export type LearningFeedbackKind = 'correct' | 'incorrect' | 'hint' | 'complete';
export type CharacterFeedbackId = 'mira' | 'arjun' | 'shuka';

const STORAGE_KEY = 'grammar-quest.feedback-preferences.v1';
const DEFAULT_PREFERENCES: FeedbackPreferences = {
  soundEnabled: true,
  hapticsEnabled: true,
};
const MAX_REMEMBERED_EVENTS = 500;

interface Tone {
  frequency: number;
  endFrequency?: number;
  startAfter: number;
  duration: number;
  volume: number;
  waveform: OscillatorType;
}

const CHARACTER_TONES: Record<CharacterFeedbackId, Tone[]> = {
  mira: [
    { frequency: 660, endFrequency: 990, startAfter: 0, duration: 0.18, volume: 0.035, waveform: 'sine' },
    { frequency: 1175, endFrequency: 1397, startAfter: 0.07, duration: 0.2, volume: 0.012, waveform: 'sine' },
  ],
  arjun: [
    { frequency: 330, endFrequency: 540, startAfter: 0, duration: 0.17, volume: 0.025, waveform: 'triangle' },
    { frequency: 620, endFrequency: 440, startAfter: 0.035, duration: 0.2, volume: 0.01, waveform: 'sine' },
  ],
  shuka: [
    { frequency: 392, startAfter: 0, duration: 0.43, volume: 0.018, waveform: 'sine' },
    { frequency: 494, startAfter: 0.075, duration: 0.4, volume: 0.014, waveform: 'sine' },
    { frequency: 587, startAfter: 0.15, duration: 0.36, volume: 0.011, waveform: 'sine' },
  ],
};

const LEARNING_TONES: Record<LearningFeedbackKind, Tone[]> = {
  correct: [
    { frequency: 523, endFrequency: 587, startAfter: 0, duration: 0.16, volume: 0.018, waveform: 'sine' },
    { frequency: 659, endFrequency: 740, startAfter: 0.08, duration: 0.18, volume: 0.016, waveform: 'sine' },
  ],
  incorrect: [
    { frequency: 330, endFrequency: 262, startAfter: 0, duration: 0.2, volume: 0.014, waveform: 'sine' },
  ],
  hint: [
    { frequency: 659, endFrequency: 784, startAfter: 0, duration: 0.24, volume: 0.014, waveform: 'sine' },
  ],
  complete: [
    { frequency: 523, startAfter: 0, duration: 0.22, volume: 0.016, waveform: 'sine' },
    { frequency: 659, startAfter: 0.09, duration: 0.24, volume: 0.014, waveform: 'sine' },
    { frequency: 784, startAfter: 0.18, duration: 0.3, volume: 0.012, waveform: 'sine' },
  ],
};

const HAPTIC_PATTERNS: Record<CharacterFeedbackId | LearningFeedbackKind, number[]> = {
  mira: [10],
  arjun: [10],
  shuka: [10, 55, 10],
  correct: [18],
  incorrect: [8],
  hint: [10],
  complete: [12, 45, 18],
};

function readPreferences(): FeedbackPreferences {
  if (typeof window === 'undefined') return { ...DEFAULT_PREFERENCES };

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_PREFERENCES };
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) {
      return { ...DEFAULT_PREFERENCES };
    }

    const candidate = parsed as Record<string, unknown>;
    return {
      soundEnabled:
        typeof candidate.soundEnabled === 'boolean'
          ? candidate.soundEnabled
          : DEFAULT_PREFERENCES.soundEnabled,
      hapticsEnabled:
        typeof candidate.hapticsEnabled === 'boolean'
          ? candidate.hapticsEnabled
          : DEFAULT_PREFERENCES.hapticsEnabled,
    };
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn('Unable to load feedback preferences.', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }
}

let preferences = readPreferences();
const preferenceListeners = new Set<() => void>();
const playedEventIds = new Set<string>();
let audioContext: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let audioPlaybackId = 0;

function notifyPreferenceListeners(): void {
  preferenceListeners.forEach((listener) => listener());
}

export function getFeedbackPreferences(): FeedbackPreferences {
  return preferences;
}

export function subscribeFeedbackPreferences(listener: () => void): () => void {
  preferenceListeners.add(listener);
  return () => preferenceListeners.delete(listener);
}

export function updateFeedbackPreferences(
  changes: Partial<FeedbackPreferences>,
): void {
  const next = { ...preferences, ...changes };
  if (
    next.soundEnabled === preferences.soundEnabled &&
    next.hapticsEnabled === preferences.hapticsEnabled
  ) {
    return;
  }

  preferences = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      if (import.meta.env?.DEV) {
        console.warn('Unable to save feedback preferences.', error);
      }
    }
  }

  if (!preferences.soundEnabled) stopActiveAudio();
  notifyPreferenceListeners();
}

function rememberEvent(eventId: string): boolean {
  if (playedEventIds.has(eventId)) return false;
  playedEventIds.add(eventId);
  if (playedEventIds.size > MAX_REMEMBERED_EVENTS) {
    const oldestEventId = playedEventIds.values().next().value;
    if (oldestEventId) playedEventIds.delete(oldestEventId);
  }
  return true;
}

function getAudioContext(): AudioContext | null {
  if (audioContext) return audioContext;
  if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') {
    return null;
  }

  try {
    audioContext = new window.AudioContext();
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn('Web Audio is unavailable for feedback sounds.', error);
    }
  }
  return audioContext;
}

function stopActiveAudio(): void {
  audioPlaybackId += 1;
  if (!audioContext) return;
  const now = audioContext.currentTime;
  activeOscillators.forEach((oscillator) => {
    try {
      oscillator.stop(now + 0.015);
    } catch {
      // The oscillator may already have stopped.
    }
  });
  activeOscillators = [];
}

function playTones(tones: Tone[]): void {
  if (!preferences.soundEnabled) return;
  const context = getAudioContext();
  if (!context) return;

  stopActiveAudio();
  const playbackId = audioPlaybackId;
  const startPlayback = () => {
    if (!preferences.soundEnabled || playbackId !== audioPlaybackId) return;
    const now = context.currentTime;

    tones.forEach((tone) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const startAt = now + tone.startAfter;
      const endAt = startAt + tone.duration;
      oscillator.type = tone.waveform;
      oscillator.frequency.setValueAtTime(tone.frequency, startAt);
      if (tone.endFrequency) {
        oscillator.frequency.exponentialRampToValueAtTime(tone.endFrequency, endAt);
      }
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.linearRampToValueAtTime(tone.volume, startAt + 0.015);
      gain.gain.setValueAtTime(tone.volume, Math.max(startAt + 0.02, endAt - 0.045));
      gain.gain.exponentialRampToValueAtTime(0.0001, endAt);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => {
        activeOscillators = activeOscillators.filter((active) => active !== oscillator);
        oscillator.disconnect();
        gain.disconnect();
      };
      activeOscillators.push(oscillator);
      oscillator.start(startAt);
      oscillator.stop(endAt + 0.01);
    });
  };

  if (context.state === 'running') {
    startPlayback();
    return;
  }

  void context.resume().then(startPlayback).catch((error: unknown) => {
    if (import.meta.env?.DEV) {
      console.warn('Feedback sound could not be started by the browser.', error);
    }
  });
}

function vibrate(pattern: number[]): void {
  if (
    !preferences.hapticsEnabled ||
    typeof navigator === 'undefined' ||
    typeof window === 'undefined'
  ) {
    return;
  }
  if (typeof navigator.vibrate !== 'function') return;

  try {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const userActivation = Reflect.get(navigator, 'userActivation');
    if (
      typeof userActivation === 'object' &&
      userActivation !== null &&
      Reflect.get(userActivation, 'isActive') === false
    ) {
      return;
    }
    navigator.vibrate(pattern);
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn('Haptic feedback is unavailable on this device.', error);
    }
  }
}

export function playCharacterDialogue(
  characterId: CharacterFeedbackId,
  eventId: string,
): void {
  if (!rememberEvent(`dialogue:${eventId}`)) return;
  vibrate(HAPTIC_PATTERNS[characterId]);
  playTones(CHARACTER_TONES[characterId]);
}

export function playLearningFeedback(
  kind: LearningFeedbackKind,
  eventId?: string,
): void {
  if (eventId && !rememberEvent(`learning:${eventId}`)) return;
  vibrate(HAPTIC_PATTERNS[kind]);
  playTones(LEARNING_TONES[kind]);
}

export function installAudioGestureUnlock(): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const unlock = () => {
    if (!preferences.soundEnabled) return;
    const context = getAudioContext();
    if (context?.state === 'suspended') {
      void context.resume().catch((error: unknown) => {
        if (import.meta.env?.DEV) {
          console.warn('Browser audio could not be enabled.', error);
        }
      });
    }
  };

  window.addEventListener('click', unlock, true);
  window.addEventListener('keyup', unlock, true);
  return () => {
    window.removeEventListener('click', unlock, true);
    window.removeEventListener('keyup', unlock, true);
  };
}
