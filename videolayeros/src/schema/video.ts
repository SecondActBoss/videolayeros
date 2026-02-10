export type SceneType = 'intro' | 'text' | 'quote' | 'character' | 'multiCharacter';

export interface BaseScene {
  type: SceneType;
  durationInFrames?: number;
}

export interface IntroSceneConfig extends BaseScene {
  type: 'intro';
  text: string;
}

export interface TextSceneConfig extends BaseScene {
  type: 'text';
  text: string;
  background?: string;
}

export interface CharacterMotionConfig {
  type: 'static' | 'pan' | 'zoom' | 'panZoom';
  startScale?: number;
  endScale?: number;
  startX?: number;
  endX?: number;
  startY?: number;
  endY?: number;
}

export type FramingType = 'subject-dominant' | 'contextual' | 'supporting';

export type TransitionType = 'cut' | 'push' | 'hold';

export interface CharacterSceneConfig extends BaseScene {
  type: 'character';
  asset: string;
  duration: number;
  motion?: CharacterMotionConfig;
  framing?: FramingType;
  transition?: TransitionType;
}

export interface CharacterLayerConfig {
  id: string;
  asset?: string;
  characterId?: string;
  emotion?: string;
  position: {
    x: number;
    y: number;
  };
  scale?: number;
  motion?: CharacterMotionConfig;
}

export interface MultiCharacterSceneConfig extends BaseScene {
  type: 'multiCharacter';
  duration: number;
  intent?: string;
  framing?: FramingType;
  transition?: TransitionType;
  background?: {
    color?: string;
    image?: string;
  };
  characters: CharacterLayerConfig[];
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export type HeadlinePosition = 'top-left' | 'top-right' | 'top' | 'center' | 'left';

export interface AspectOverrides {
  heroScale?: number;
  offsetX?: number;
  offsetY?: number;
  headlinePosition?: HeadlinePosition;
}

export interface PosterHeadlineConfig {
  text: string;
  position?: HeadlinePosition;
}

export interface PosterConfig {
  enabled: boolean;
  sceneIndex?: number;
  frame?: number;
  aspectRatio?: AspectRatio;
  crop?: {
    zoom: number;
    offsetX: number;
    offsetY: number;
  };
  overrides?: Partial<Record<AspectRatio, AspectOverrides>>;
  headline?: PosterHeadlineConfig;
}

export type SceneConfig =
  | IntroSceneConfig
  | TextSceneConfig
  | CharacterSceneConfig
  | MultiCharacterSceneConfig;

export interface CaptionsConfig {
  enabled: boolean;
  source: string;
}

export interface VideoConfig {
  composition: string;
  scenes?: SceneConfig[];
  scriptFile?: string;
  captions?: CaptionsConfig;
  poster?: PosterConfig;
}

export const ASPECT_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
};
