export interface WordTiming {
  text: string;
  start: number;
  end: number;
  emphasis?: 'strong';
}

export interface SilenceWindow {
  startTime: number;
  endTime: number;
  dwightExtended?: boolean;
}

export interface CaptionsFile {
  words: WordTiming[];
}
