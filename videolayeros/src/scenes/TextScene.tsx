import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const TextScene: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = interpolate(frame, [0, 30], [0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: 60,
        fontWeight: 500,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {text}
    </AbsoluteFill>
  );
};
