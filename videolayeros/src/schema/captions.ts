export interface WordTiming {
  text: string;
  start: number;
  end: number;
}

export interface CaptionsFile {
  words: WordTiming[];
}
