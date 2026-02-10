export type SceneType = 'intro' | 'text' | 'quote' | 'character';

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

export type SceneConfig =
  | IntroSceneConfig
  | TextSceneConfig
  | CharacterSceneConfig;

export interface CaptionsConfig {
  enabled: boolean;
  source: string;
}

export interface VideoConfig {
  composition: string;
  scenes: SceneConfig[];
  captions?: CaptionsConfig;
}
