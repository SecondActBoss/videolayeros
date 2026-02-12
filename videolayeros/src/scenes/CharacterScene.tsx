import React, { useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { CharacterSceneConfig } from '../schema/video';
import { computeMotion } from '../utils/motion';
import { resolveFraming, anchorToTranslate } from '../registry/framingProfiles';
import { resolveTransition, computeTransitionScale } from '../registry/transitionProfiles';
import { resolveDensity } from '../registry/visualDensity';

export const CharacterScene: React.FC<CharacterSceneConfig> = ({
  asset,
  motion,
  framing,
  transition,
  density,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const profile = resolveFraming(framing);
  const transitionProfile = resolveTransition(transition);
  const densityProfile = resolveDensity(density);

  let baseScale: number;
  let translateX: number;
  let translateY: number;

  if (profile) {
    const anchorOffset = anchorToTranslate(profile.anchor);
    baseScale = profile.scale;
    translateX = anchorOffset.x;
    translateY = anchorOffset.y + profile.yOffset;
  } else {
    const motionResult = computeMotion(frame, durationInFrames, motion);
    baseScale = motionResult.scale;
    translateX = motionResult.translateX;
    translateY = motionResult.translateY;
  }

  const scale = computeTransitionScale(
    transitionProfile,
    baseScale,
    frame,
    durationInFrames,
    fps,
  );

  const contrastFilter = densityProfile.backgroundContrastBoost
    ? 'contrast(1.08) saturate(1.05)'
    : 'none';

  const [imgError, setImgError] = useState(false);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {!imgError && (
        <img
          src={staticFile(asset)}
          onError={() => {
            console.warn(`[CharacterScene] Asset not found: "${asset}". Skipping.`);
            setImgError(true);
          }}
          style={{
            height: '75%',
            objectFit: 'contain',
            transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
            filter: contrastFilter,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
