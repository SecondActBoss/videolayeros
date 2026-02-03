import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const QuoteScene: React.FC<{quote: string; author?: string}> = ({quote, author}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 100,
        opacity,
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 50,
          fontWeight: 400,
          fontStyle: 'italic',
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        "{quote}"
      </div>
      {author && (
        <div
          style={{
            color: '#9B8CFF',
            fontSize: 30,
            marginTop: 40,
          }}
        >
          — {author}
        </div>
      )}
    </AbsoluteFill>
  );
};
