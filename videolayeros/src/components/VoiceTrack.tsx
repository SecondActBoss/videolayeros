import React from 'react';
import { Audio, staticFile } from 'remotion';
import { VoiceConfig } from '../schema/video';

interface VoiceTrackProps {
  voice: VoiceConfig;
}

export const VoiceTrack: React.FC<VoiceTrackProps> = ({ voice }) => {
  const volume = voice.volume ?? 1.0;

  return (
    <Audio
      src={staticFile(voice.src)}
      volume={volume}
      startFrom={0}
    />
  );
};
