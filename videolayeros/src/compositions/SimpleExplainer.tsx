import React from 'react';
import { Sequence } from 'remotion';
import { TextScene } from '../scenes/TextScene';

export const SimpleExplainer: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={90}>
        <TextScene text="Meet Your AI Workforce" />
      </Sequence>

      <Sequence from={90} durationInFrames={120}>
        <TextScene text="AI Employees that handle the busywork" background="#4F46E5" />
      </Sequence>

      <Sequence from={210} durationInFrames={120}>
        <TextScene text="Define the work. VideoLayerOS renders the rest." background="#1E293B" />
      </Sequence>
    </>
  );
};
