import { SilenceWindow } from '../schema/captions';

const SILENCE_TOKEN = '[silence]';
const PAUSE_TOKEN = '[pause]';
const PAUSE_DURATION = 0.6;

export interface SilenceResult {
  cleanedText: string;
  isFullSilence: boolean;
  pauseOffsets: number[];
}

export function detectSilenceTokens(text: string): SilenceResult {
  const trimmed = text.trim();

  if (trimmed.toLowerCase() === SILENCE_TOKEN) {
    return { cleanedText: '', isFullSilence: true, pauseOffsets: [] };
  }

  const pauseOffsets: number[] = [];
  const parts = trimmed.split(/\s+/);
  const cleaned: string[] = [];
  let wordIndex = 0;

  for (const part of parts) {
    if (part.toLowerCase() === PAUSE_TOKEN) {
      pauseOffsets.push(wordIndex);
    } else {
      cleaned.push(part);
      wordIndex++;
    }
  }

  return {
    cleanedText: cleaned.join(' '),
    isFullSilence: false,
    pauseOffsets,
  };
}

export function buildSilenceWindows(
  beatStartTime: number,
  beatDuration: number,
  silenceResult: SilenceResult,
  wordTimings: { start: number; end: number }[],
  dwightPresent: boolean = false,
): SilenceWindow[] {
  const windows: SilenceWindow[] = [];

  if (silenceResult.isFullSilence) {
    windows.push({
      startTime: beatStartTime,
      endTime: beatStartTime + beatDuration,
      dwightExtended: dwightPresent,
    });
    return windows;
  }

  for (const offset of silenceResult.pauseOffsets) {
    let pauseStart: number;

    if (offset < wordTimings.length) {
      pauseStart = wordTimings[offset].start;
    } else if (wordTimings.length > 0) {
      pauseStart = wordTimings[wordTimings.length - 1].end;
    } else {
      pauseStart = beatStartTime;
    }

    let duration = PAUSE_DURATION;
    if (dwightPresent) {
      duration *= 1.15;
    }

    const pauseEnd = Math.min(pauseStart + duration, beatStartTime + beatDuration);

    windows.push({
      startTime: parseFloat(pauseStart.toFixed(3)),
      endTime: parseFloat(pauseEnd.toFixed(3)),
      dwightExtended: dwightPresent,
    });
  }

  return windows;
}
