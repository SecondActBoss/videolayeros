import { ScriptFile, ScriptBeat } from '../schema/script';
import { SceneConfig, MultiCharacterSceneConfig, CharacterLayerConfig } from '../schema/video';
import { SCENE_INTENTS } from '../registry/sceneIntents';
import { WordTiming } from '../schema/captions';
import { compileCaptionsWithPacing } from './captionCompiler';
import { DWIGHT_CHARACTER_ID } from '../registry/dwightPersonality';
import { getDwightWpmMultiplier } from '../resolvers/dwightBehaviorResolver';

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

  const scene: MultiCharacterSceneConfig = {
    type: 'multiCharacter',
    duration,
    intent: beat.intent,
    characters,
  };

  if (beat.framing) {
    scene.framing = beat.framing;
  }

  if (beat.transition) {
    scene.transition = beat.transition;
  }

  if (beat.density) {
    scene.density = beat.density;
  }

  return scene;
}

export function compileScriptToScenes(script: ScriptFile): SceneConfig[] {
  return script.beats.map((beat) => beatToScene(beat));
}

export function compileScriptToCaptions(script: ScriptFile): WordTiming[] {
  const allWords: WordTiming[] = [];
  let currentTime = 0;

  for (const beat of script.beats) {
    const duration = EMPHASIS_DURATION[beat.emphasis ?? 'normal'] ?? 4;
    const emphasis = beat.emphasis ?? 'normal';

    const characters = getCharactersForIntent(beat.intent);
    const hasDwight = characters.some((c) => c.characterId === DWIGHT_CHARACTER_ID);
    const wpmMultiplier = getDwightWpmMultiplier(hasDwight);

    const beatWords = compileCaptionsWithPacing(beat.text, duration, emphasis, wpmMultiplier);

    for (const word of beatWords) {
      allWords.push({
        ...word,
        start: parseFloat((word.start + currentTime).toFixed(3)),
        end: parseFloat((word.end + currentTime).toFixed(3)),
      });
    }

    currentTime += duration;
  }

  return allWords;
}
