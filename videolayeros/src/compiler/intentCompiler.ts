import { ScriptFile, ScriptBeat } from '../schema/script';
import { SceneConfig, MultiCharacterSceneConfig, CharacterLayerConfig } from '../schema/video';
import { SCENE_INTENTS } from '../registry/sceneIntents';
import { WordTiming } from '../schema/captions';

const EMPHASIS_DURATION: Record<string, number> = {
  fast: 2.5,
  normal: 4,
  slow: 6,
};

const DEFAULT_POSITIONS: Record<string, { x: number; y: number }> = {
  keith: { x: -10, y: 5 },
  rachel: { x: 15, y: 8 },
  dwight: { x: -35, y: 0 },
};

function getCharactersForIntent(intent: string): CharacterLayerConfig[] {
  const intentMap = SCENE_INTENTS[intent];
  if (!intentMap) {
    console.warn(`[IntentCompiler] Unknown intent: "${intent}". Defaulting to keith.`);
    return [
      {
        id: 'keith',
        characterId: 'keith',
        position: DEFAULT_POSITIONS['keith'],
      },
    ];
  }

  return Object.keys(intentMap).map((characterId) => ({
    id: characterId,
    characterId,
    position: DEFAULT_POSITIONS[characterId] ?? { x: 0, y: 0 },
  }));
}

function beatToScene(beat: ScriptBeat): MultiCharacterSceneConfig {
  const duration = EMPHASIS_DURATION[beat.emphasis ?? 'normal'] ?? 4;
  const characters = getCharactersForIntent(beat.intent);

  return {
    type: 'multiCharacter',
    duration,
    intent: beat.intent,
    characters,
  };
}

export function compileScriptToScenes(script: ScriptFile): SceneConfig[] {
  return script.beats.map((beat) => beatToScene(beat));
}

export function compileScriptToCaptions(script: ScriptFile): WordTiming[] {
  const words: WordTiming[] = [];
  let currentTime = 0;

  for (const beat of script.beats) {
    const duration = EMPHASIS_DURATION[beat.emphasis ?? 'normal'] ?? 4;
    const beatWords = beat.text.split(/\s+/).filter((w) => w.length > 0);

    if (beatWords.length === 0) {
      currentTime += duration;
      continue;
    }

    const wordDuration = duration / beatWords.length;

    for (let i = 0; i < beatWords.length; i++) {
      words.push({
        text: beatWords[i],
        start: currentTime + i * wordDuration,
        end: currentTime + (i + 1) * wordDuration,
      });
    }

    currentTime += duration;
  }

  return words;
}
