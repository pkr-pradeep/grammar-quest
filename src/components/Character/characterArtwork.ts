import type {
  CharacterAnimationState,
  CharacterExpression,
  CharacterId,
  CharacterPose,
} from './types';

type ArtworkVariant =
  | 'normal_pose'
  | 'happy'
  | 'curious'
  | 'thinking'
  | 'confused'
  | 'surprised'
  | 'explaining'
  | 'encouraging'
  | 'celebrating'
  | 'speaking'
  | 'listening';

const artworkFiles: Record<ArtworkVariant, string> = {
  normal_pose: '01_normal_pose',
  happy: '02_happy',
  curious: '03_curious',
  thinking: '04_thinking',
  confused: '05_confused',
  surprised: '06_surprised',
  explaining: '07_explaining',
  encouraging: '08_encouraging',
  celebrating: '09_celebrating',
  speaking: '10_speaking',
  listening: '11_listening',
};

const artworkByPath = import.meta.glob<string>(
  '../../assets/characters/*/*.png',
  { eager: true, import: 'default' },
);

function resolveArtworkVariant(
  pose: CharacterPose,
  expression: CharacterExpression,
  animationState: CharacterAnimationState,
): ArtworkVariant {
  if (pose === 'listening') return 'listening';
  if (animationState === 'talk') return 'speaking';
  if (animationState === 'wave' || pose === 'waving') return 'encouraging';
  if (
    animationState === 'celebrate' ||
    pose === 'celebrating' ||
    expression === 'celebrating'
  ) {
    return 'celebrating';
  }
  if (
    animationState === 'point' ||
    pose === 'pointing' ||
    pose === 'explaining' ||
    expression === 'explaining'
  ) {
    return 'explaining';
  }
  if (pose === 'walking') return 'normal_pose';
  if (
    pose === 'thinking' ||
    pose === 'reading' ||
    expression === 'thinking'
  ) {
    return 'thinking';
  }
  if (pose === 'confused' || expression === 'confused') return 'confused';
  if (expression === 'surprised') return 'surprised';
  if (expression === 'curious') return 'curious';
  if (pose === 'encouraging' || expression === 'encouraging') {
    return 'encouraging';
  }
  if (expression === 'happy') return 'happy';
  return 'normal_pose';
}

export function getCharacterArtwork(
  characterId: Extract<CharacterId, 'mira' | 'arjun'>,
  pose: CharacterPose,
  expression: CharacterExpression,
  animationState: CharacterAnimationState,
): string {
  const variant = resolveArtworkVariant(pose, expression, animationState);
  const filename = `${characterId}_${artworkFiles[variant]}.png`;
  const asset = Object.entries(artworkByPath).find(([path]) =>
    path.endsWith(`/${characterId}/${filename}`),
  )?.[1];

  if (!asset) {
    throw new Error(`Missing character artwork: ${characterId}/${filename}`);
  }

  return asset;
}
