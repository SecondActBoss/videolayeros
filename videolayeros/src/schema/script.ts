import { FramingType } from './video';

export type ScriptBeat = {
  id: string;
  text: string;
  intent: string;
  emphasis?: 'fast' | 'normal' | 'slow';
  framing?: FramingType;
};

export type ScriptFile = {
  beats: ScriptBeat[];
};
