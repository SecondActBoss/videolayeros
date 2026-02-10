import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { WordTiming } from '../schema/captions';

interface CaptionStyle {
  fontSize?: number;
  fontFamily?: string;
  bottom?: number;
  lineHeight?: number;
}

interface CaptionLayerProps {
  words: WordTiming[];
  style?: CaptionStyle;
}

const WINDOW_SIZE = 8;

export const CaptionLayer: React.FC<CaptionLayerProps> = ({
  words,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;

  const fontSize = style?.fontSize ?? 48;
  const fontFamily = style?.fontFamily ?? 'system-ui, -apple-system, sans-serif';
  const bottom = style?.bottom ?? 80;
  const lineHeight = style?.lineHeight ?? 1.4;

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
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
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

            const scale = isActive && isStrong ? 1.1 : 1;
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
