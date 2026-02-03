import React from 'react';
import {AbsoluteFill} from 'remotion';

interface FullscreenCenteredProps {
  children: React.ReactNode;
  background?: string;
}

export const FullscreenCentered: React.FC<FullscreenCenteredProps> = ({
  children,
  background = 'linear-gradient(135deg, #6B5BFF, #9B8CFF)',
}) => {
  return (
    <AbsoluteFill
      style={{
        background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
