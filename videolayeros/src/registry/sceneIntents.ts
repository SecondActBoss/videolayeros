export type SceneIntentMap = {
  [intent: string]: {
    [characterId: string]: string;
  };
};

export const SCENE_INTENTS: SceneIntentMap = {
  overload: {
    keith: 'overwhelmed',
    rachel: 'concerned',
  },
  relief: {
    keith: 'relieved',
    rachel: 'supportive',
  },
  handoff: {
    dwight: 'confident',
    keith: 'relieved',
    rachel: 'supportive',
  },
};

export function resolveIntentEmotion(
  intent: string,
  characterId: string,
): string | null {
  const intentMap = SCENE_INTENTS[intent];
  if (!intentMap) {
    console.warn(`[SceneIntents] Unknown intent: "${intent}". No emotion resolved.`);
    return null;
  }

  return intentMap[characterId] ?? null;
}
