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

export interface CharacterSceneConfig extends BaseScene {
  type: 'character';
  asset: string;
  duration: number;
  motion?: CharacterMotionConfig;
}

export interface CharacterLayerConfig {
  id: string;
  asset: string;
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
  background?: {
    color?: string;
    image?: string;
  };
  characters: CharacterLayerConfig[];
}

export type PosterAspectRatio = '16:9' | '1:1' | '4:5';

export interface PosterCropConfig {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface PosterHeadlineConfig {
  text: string;
  position: 'top-left' | 'top-right' | 'left';
}

export interface PosterConfig {
  enabled: boolean;
  sceneIndex?: number;
  frame?: number;
  aspectRatio?: PosterAspectRatio;
  crop?: PosterCropConfig;
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
  scenes: SceneConfig[];
  captions?: CaptionsConfig;
  poster?: PosterConfig;
}
