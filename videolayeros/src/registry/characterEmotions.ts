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
    neutral: { asset: 'characters/keith/keith_neutral.png' },
    overwhelmed: {
      asset: 'characters/keith/keith_overwhelmed.png',
      defaultScale: 1.1,
    },
    focused: { asset: 'characters/keith/keith_focused.png' },
    relieved: { asset: 'characters/keith/keith_relieved.png' },
  },
  rachel: {
    neutral: { asset: 'characters/rachel/rachel_neutral.png' },
    concerned: { asset: 'characters/rachel/rachel_concerned.png' },
    supportive: { asset: 'characters/rachel/rachel_supportive.png' },
  },
  dwight: {
    neutral: { asset: 'characters/dwight/dwight_neutral.png' },
    confident: {
      asset: 'characters/dwight/dwight_confident.png',
      defaultScale: 1.25,
    },
    active: {
      asset: 'characters/dwight/dwight_active.png',
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
