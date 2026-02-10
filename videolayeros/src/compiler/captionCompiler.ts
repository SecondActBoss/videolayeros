import { WordTiming } from '../schema/captions';

const WPM: Record<string, number> = {
  fast: 220,
  normal: 160,
  slow: 110,
};

const MIN_WORD_DURATION = 0.18;

const PAUSE_AFTER: Record<string, number> = {
  '.': 0.4,
  '!': 0.4,
  ',': 0.15,
  '—': 0.25,
};

function getPause(word: string): number {
  for (const [punct, pause] of Object.entries(PAUSE_AFTER)) {
    if (word.endsWith(punct)) return pause;
  }
  return 0;
}

function isAllCaps(word: string): boolean {
  const letters = word.replace(/[^a-zA-Z]/g, '');
  return letters.length >= 2 && letters === letters.toUpperCase();
}

function shouldEmphasize(
  word: string,
  index: number,
  totalWords: number,
  emphasis: 'fast' | 'normal' | 'slow',
  prevWordHadPause: boolean,
): boolean {
  if (isAllCaps(word)) return true;
  if (prevWordHadPause) return true;
  if (emphasis === 'slow' && totalWords <= 3) return true;
  return false;
}

export function compileCaptionsWithPacing(
  text: string,
  durationSeconds: number,
  emphasis: 'fast' | 'normal' | 'slow',
): WordTiming[] {
  const rawWords = text.split(/\s+/).filter((w) => w.length > 0);
  if (rawWords.length === 0) return [];

  const wpm = WPM[emphasis] ?? WPM.normal;
  const baseSecondsPerWord = 60 / wpm;

  const pauses = rawWords.map((w) => getPause(w));
  let totalPauseTime = pauses.reduce((sum, p) => sum + p, 0);

  const idealWordTime = baseSecondsPerWord * rawWords.length + totalPauseTime;

  let secondsPerWord: number;

  if (idealWordTime <= durationSeconds) {
    secondsPerWord = baseSecondsPerWord;
  } else {
    const available = durationSeconds - totalPauseTime;
    if (available >= rawWords.length * MIN_WORD_DURATION) {
      secondsPerWord = available / rawWords.length;
    } else {
      secondsPerWord = MIN_WORD_DURATION;
      const wordTimeTotal = MIN_WORD_DURATION * rawWords.length;
      const remainingForPauses = Math.max(0, durationSeconds - wordTimeTotal);
      if (totalPauseTime > 0) {
        const pauseScale = remainingForPauses / totalPauseTime;
        for (let i = 0; i < pauses.length; i++) {
          pauses[i] = pauses[i] * pauseScale;
        }
        totalPauseTime = remainingForPauses;
      }
    }
  }

  const result: WordTiming[] = [];
  let cursor = 0;

  for (let i = 0; i < rawWords.length; i++) {
    const word = rawWords[i];
    const wordEnd = Math.min(cursor + secondsPerWord, durationSeconds);
    const prevHadPause = i > 0 && pauses[i - 1] > 0;

    const timing: WordTiming = {
      text: word,
      start: parseFloat(cursor.toFixed(3)),
      end: parseFloat(Math.min(wordEnd, durationSeconds).toFixed(3)),
    };

    if (shouldEmphasize(word, i, rawWords.length, emphasis, prevHadPause)) {
      timing.emphasis = 'strong';
    }

    result.push(timing);
    cursor = wordEnd + pauses[i];
  }

  return result;
}
