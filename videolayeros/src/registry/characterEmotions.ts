import { CharacterMotionConfig } from '../schema/video';

export type EmotionState = {
  asset: string;
  defaultScale?: number;
  defaultMotion?: CharacterMotionConfig;
};

export type CharacterEmotionMap = {
  [emotion: string]: EmotionState;
};

export type CharacterRegistry = {
  [characterId: string]: CharacterEmotionMap;
};

export const CharacterEmotions: CharacterRegistry = {
  keith: {
    neutral: { asset: 'keith_neutral.png' },
    overwhelmed: {
      asset: 'keith_overwhelmed.png',
      defaultScale: 1.1,
    },
    focused: { asset: 'keith_focused.png' },
    relieved: { asset: 'keith_relieved.png' },
  },
  rachel: {
    neutral: { asset: 'rachel_neutral.png' },
    concerned: { asset: 'rachel_concerned.png' },
    supportive: { asset: 'rachel_supportive.png' },
  },
  dwight: {
    neutral: { asset: 'dwight_neutral.png' },
    confident: {
      asset: 'dwight_confident.png',
      defaultScale: 1.25,
    },
    active: {
      asset: 'dwight_active.png',
      defaultMotion: {
        type: 'panZoom',
        startScale: 1.2,
        endScale: 1.3,
      },
    },
  },
};

export function resolveCharacterEmotion(
  characterId: string,
  emotion: string,
): EmotionState | null {
  const character = CharacterEmotions[characterId];
  if (!character) {
    console.warn(`[CharacterEmotions] Unknown character: "${characterId}". No asset resolved.`);
    return null;
  }

  const state = character[emotion];
  if (state) return state;

  console.warn(
    `[CharacterEmotions] Emotion "${emotion}" not found for "${characterId}". Falling back to neutral.`,
  );

  const neutral = character['neutral'];
  if (neutral) return neutral;

  console.warn(`[CharacterEmotions] No neutral fallback for "${characterId}".`);
  return null;
}
