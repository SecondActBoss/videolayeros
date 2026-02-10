import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { CharacterSceneConfig } from '../schema/video';

export const CharacterScene: React.FC<CharacterSceneConfig> = ({
  asset,
  motion,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const startScale = motion?.startScale ?? 1.0;
  const endScale = motion?.endScale ?? 1.03;
  const startX = motion?.startX ?? 0;
  const endX = motion?.endX ?? 0;
  const startY = motion?.startY ?? 0;
  const endY = motion?.endY ?? 0;

  const scale = interpolate(frame, [0, durationInFrames], [startScale, endScale], {
    extrapolateRight: 'clamp',
  });

  const translateX = interpolate(frame, [0, durationInFrames], [startX, endX], {
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [0, durationInFrames], [startY, endY], {
    extrapolateRight: 'clamp',
  });

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
