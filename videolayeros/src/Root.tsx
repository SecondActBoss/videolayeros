import React from 'react';
import { Composition } from 'remotion';
import { SimpleExplainer } from './compositions/SimpleExplainer';
import { ConfigDrivenExplainer } from './compositions/ConfigDrivenExplainer';

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
      <Composition
        id="ConfigDrivenExplainer"
        component={ConfigDrivenExplainer}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
