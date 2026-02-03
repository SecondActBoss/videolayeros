import React from 'react';
import { Composition } from 'remotion';
import { SimpleExplainer } from './compositions/SimpleExplainer';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="SimpleExplainer"
        component={SimpleExplainer}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
