import { CharacterMotionConfig } from '../schema/video';

export type EmotionState = {
  asset: string;
  defaultScale?: number;
  defaultMotion?: CharacterMotionConfig;
};

export type CharacterEmotionMap = {
  [emotion: string]: Omit<EmotionState, 'asset'> & { asset?: string };
};

export type CharacterRegistry = {
  [characterId: string]: CharacterEmotionMap;
};

function canonicalAssetPath(characterId: string, emotion: string): string {
  return `assets/characters/${characterId}/${characterId}_${emotion}_master.png`;
}

export const CharacterEmotions: CharacterRegistry = {
  keith: {
    neutral: {},
    overwhelmed: { defaultScale: 1.1 },
    focused: {},
    relieved: {},
  },
  rachel: {
    neutral: {},
    concerned: {},
    supportive: {},
  },
  dwight: {
    neutral: {},
    confident: { defaultScale: 1.25 },
    active: {
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

  const entry = character[emotion];
  if (entry) {
    return {
      ...entry,
      asset: entry.asset ?? canonicalAssetPath(characterId, emotion),
    };
  }

  console.warn(
    `[CharacterEmotions] Emotion "${emotion}" not found for "${characterId}". Falling back to neutral.`,
  );

  const neutral = character['neutral'];
  if (neutral) {
    return {
      ...neutral,
      asset: neutral.asset ?? canonicalAssetPath(characterId, 'neutral'),
    };
  }

  console.warn(`[CharacterEmotions] No neutral fallback for "${characterId}". Using canonical neutral path.`);
  return {
    asset: canonicalAssetPath(characterId, 'neutral'),
  };
}
