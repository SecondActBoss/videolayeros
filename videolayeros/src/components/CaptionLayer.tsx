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
            const isActive = windowStart + i === activeIndex;
            return (
              <span
                key={windowStart + i}
                style={{
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
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
