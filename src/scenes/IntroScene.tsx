import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const IntroScene: React.FC<{title: string}> = ({title}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #6B5BFF, #9B8CFF)',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: 80,
        fontWeight: 600,
        opacity,
      }}
    >
      {title}
    </AbsoluteFill>
  );
};
