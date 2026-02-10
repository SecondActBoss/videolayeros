export interface WordTiming {
  text: string;
  start: number;
  end: number;
  emphasis?: 'strong';
}

export interface CaptionsFile {
  words: WordTiming[];
}
