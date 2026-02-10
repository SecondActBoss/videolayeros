import { FramingType, TransitionType } from './video';

export type ScriptBeat = {
  id: string;
  text: string;
  intent: string;
  emphasis?: 'fast' | 'normal' | 'slow';
  framing?: FramingType;
  transition?: TransitionType;
};

export type ScriptFile = {
  beats: ScriptBeat[];
};
