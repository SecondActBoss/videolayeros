import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { WordTiming, SilenceWindow } from '../schema/captions';
import { DensityProfile, DENSITY_PROFILES } from '../registry/visualDensity';
import { getDwightSilenceFades } from '../resolvers/dwightBehaviorResolver';

interface CaptionStyle {
  fontSize?: number;
  fontFamily?: string;
  bottom?: number;
  lineHeight?: number;
}

export interface DensitySegment {
  startFrame: number;
  endFrame: number;
  density: DensityProfile;
  dwightPresent?: boolean;
}

interface CaptionLayerProps {
  words: WordTiming[];
  style?: CaptionStyle;
  densitySegments?: DensitySegment[];
  silenceWindows?: SilenceWindow[];
}

const WINDOW_SIZE = 8;
const DEFAULT_DENSITY = DENSITY_PROFILES.medium;

function getSegmentAtFrame(
  frame: number,
  segments?: DensitySegment[],
): DensitySegment | null {
  if (!segments || segments.length === 0) return null;

  for (const seg of segments) {
    if (frame >= seg.startFrame && frame < seg.endFrame) {
      return seg;
    }
  }

  return null;
}

function getSilenceOpacity(
  currentTimeSec: number,
  fps: number,
  silenceWindows?: SilenceWindow[],
  dwightPresent?: boolean,
): number {
  if (!silenceWindows || silenceWindows.length === 0) return 1;

  const fades = getDwightSilenceFades(dwightPresent ?? false);
  const fadeOutSec = fades.fadeOutMs / 1000;
  const fadeInSec = fades.fadeInMs / 1000;

  for (const win of silenceWindows) {
    const fadeOutStart = win.startTime - fadeOutSec;
    const fadeInEnd = win.endTime + fadeInSec;

    if (currentTimeSec >= fadeOutStart && currentTimeSec < win.startTime) {
      const progress = (currentTimeSec - fadeOutStart) / fadeOutSec;
      return 1 - Math.min(1, Math.max(0, progress));
    }

    if (currentTimeSec >= win.startTime && currentTimeSec < win.endTime) {
      return 0;
    }

    if (currentTimeSec >= win.endTime && currentTimeSec < fadeInEnd) {
      const progress = (currentTimeSec - win.endTime) / fadeInSec;
      return Math.min(1, Math.max(0, progress));
    }
  }

  return 1;
}

export const CaptionLayer: React.FC<CaptionLayerProps> = ({
  words,
  style,
  densitySegments,
  silenceWindows,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;

  const fontSize = style?.fontSize ?? 48;
  const fontFamily = style?.fontFamily ?? 'system-ui, -apple-system, sans-serif';
  const bottom = style?.bottom ?? 80;
  const lineHeight = style?.lineHeight ?? 1.4;

  const segment = getSegmentAtFrame(frame, densitySegments);
  const density = segment?.density ?? DEFAULT_DENSITY;
  const dwightPresent = segment?.dwightPresent ?? false;

  const silenceOpacity = getSilenceOpacity(currentTimeSec, fps, silenceWindows, dwightPresent);

  if (silenceOpacity === 0) return null;

  const activeIndex = words.findIndex(
    (w) => currentTimeSec >= w.start && currentTimeSec < w.end
  );

  if (activeIndex === -1) return null;

  const windowStart = Math.max(0, activeIndex - WINDOW_SIZE + 1);
  const visibleWords = words.slice(windowStart, activeIndex + 1);

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: density.captionOpacity * silenceOpacity,
      }}
    >
      <div
        style={{
          backgroundColor: `rgba(0, 0, 0, ${density.captionBackgroundOpacity})`,
          borderRadius: 12,
          padding: '16px 32px',
          maxWidth: '80%',
        }}
      >
        <span
          style={{
            fontSize,
            fontFamily,
            lineHeight,
            color: 'rgba(255, 255, 255, 0.75)',
          }}
        >
          {visibleWords.map((word, i) => {
            const globalIndex = windowStart + i;
            const isActive = globalIndex === activeIndex;
            const isStrong = word.emphasis === 'strong';

            const scale = dwightPresent ? 1 : (isActive && isStrong ? 1.1 : 1);
            const opacity = isActive ? 1 : isStrong ? 0.9 : 0.55;
            const weight = isActive ? 700 : isStrong ? 600 : 400;
            const color = isActive
              ? '#FFFFFF'
              : isStrong
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.55)';

            return (
              <span
                key={globalIndex}
                style={{
                  fontWeight: weight,
                  color,
                  opacity,
                  display: 'inline-block',
                  transform: `scale(${scale})`,
                  transformOrigin: 'center bottom',
                  transition: 'transform 0.1s ease',
                }}
              >
                {word.text}
                {i < visibleWords.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
};
