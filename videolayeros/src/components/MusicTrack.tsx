import React, { useCallback } from 'react';
import { Audio, staticFile, useVideoConfig } from 'remotion';
import { MusicConfig } from '../schema/video';
import { SilenceWindow } from '../schema/captions';

const DUCK_VOICE = 0.35;
const DUCK_SILENCE = 0.6;
const TRANSITION_SEC = 0.2;

interface MusicTrackProps {
  music: MusicConfig;
  hasVoice: boolean;
  silenceWindows?: SilenceWindow[];
}

function getTargetMultiplier(
  timeSec: number,
  hasVoice: boolean,
  silenceWindows?: SilenceWindow[],
): number {
  if (!hasVoice) return 1.0;

  if (silenceWindows && silenceWindows.length > 0) {
    for (const win of silenceWindows) {
      if (timeSec >= win.startTime && timeSec < win.endTime) {
        return DUCK_SILENCE;
      }
    }
  }

  return DUCK_VOICE;
}

function easeMultiplier(
  timeSec: number,
  hasVoice: boolean,
  silenceWindows?: SilenceWindow[],
): number {
  const current = getTargetMultiplier(timeSec, hasVoice, silenceWindows);
  const lookback = getTargetMultiplier(timeSec - TRANSITION_SEC, hasVoice, silenceWindows);

  if (current === lookback) return current;

  let transitionProgress = 1.0;

  if (silenceWindows && silenceWindows.length > 0) {
    for (const win of silenceWindows) {
      if (timeSec >= win.startTime && timeSec < win.startTime + TRANSITION_SEC) {
        transitionProgress = (timeSec - win.startTime) / TRANSITION_SEC;
        return lookback + (current - lookback) * transitionProgress;
      }
      if (timeSec >= win.endTime && timeSec < win.endTime + TRANSITION_SEC) {
        transitionProgress = (timeSec - win.endTime) / TRANSITION_SEC;
        return lookback + (current - lookback) * transitionProgress;
      }
    }
  }

  return current;
}

export const MusicTrack: React.FC<MusicTrackProps> = ({
  music,
  hasVoice,
  silenceWindows,
}) => {
  const baseVolume = music.volume ?? 0.25;
  const { fps } = useVideoConfig();

  const volumeCallback = useCallback(
    (frame: number) => {
      const timeSec = frame / fps;
      const multiplier = easeMultiplier(timeSec, hasVoice, silenceWindows);
      return Math.min(baseVolume, baseVolume * multiplier);
    },
    [baseVolume, fps, hasVoice, silenceWindows],
  );

  return (
    <Audio
      src={staticFile(music.src)}
      volume={volumeCallback}
      startFrom={0}
      loop
    />
  );
};
