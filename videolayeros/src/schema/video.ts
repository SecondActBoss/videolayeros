export type SceneType = 'intro' | 'text' | 'quote';

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

export type SceneConfig =
  | IntroSceneConfig
  | TextSceneConfig;

export interface VideoConfig {
  composition: string;
  scenes: SceneConfig[];
}
