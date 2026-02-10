import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { CharacterSceneConfig } from '../schema/video';
import { computeMotion } from '../utils/motion';

export const CharacterScene: React.FC<CharacterSceneConfig> = ({
  asset,
  motion,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const { scale, translateX, translateY } = computeMotion(frame, durationInFrames, motion);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <Img
        src={staticFile(asset)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
        }}
      />
    </AbsoluteFill>
  );
};
