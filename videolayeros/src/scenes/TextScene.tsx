import React from 'react';
import { AbsoluteFill } from 'remotion';

export const TextScene: React.FC<{
  text: string;
  background?: string;
}> = ({ text, background = '#6B5BFF' }) => {
  return (
    <AbsoluteFill
      style={{
        background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 72,
        fontWeight: 600,
        padding: 80,
        textAlign: 'center',
      }}
    >
      {text}
    </AbsoluteFill>
  );
};
