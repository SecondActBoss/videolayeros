export type ScriptBeat = {
  id: string;
  text: string;
  intent: string;
  emphasis?: 'fast' | 'normal' | 'slow';
};

export type ScriptFile = {
  beats: ScriptBeat[];
};
