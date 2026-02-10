import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { CharacterSceneConfig } from '../schema/video';
import { computeMotion } from '../utils/motion';
import { resolveFraming, anchorToTranslate } from '../registry/framingProfiles';

export const CharacterScene: React.FC<CharacterSceneConfig> = ({
  asset,
  motion,
  framing,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const profile = resolveFraming(framing);

  let scale: number;
  let translateX: number;
  let translateY: number;

  if (profile) {
    const anchorOffset = anchorToTranslate(profile.anchor);
    scale = profile.scale;
    translateX = anchorOffset.x;
    translateY = anchorOffset.y + profile.yOffset;
  } else {
    const motionResult = computeMotion(frame, durationInFrames, motion);
    scale = motionResult.scale;
    translateX = motionResult.translateX;
    translateY = motionResult.translateY;
  }

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
