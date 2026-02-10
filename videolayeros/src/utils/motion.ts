import { interpolate } from 'remotion';
import { CharacterMotionConfig } from '../schema/video';

export interface MotionValues {
  scale: number;
  translateX: number;
  translateY: number;
}

export const computeMotion = (
  frame: number,
  durationInFrames: number,
  motion?: CharacterMotionConfig,
): MotionValues => {
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

  return { scale, translateX, translateY };
};
