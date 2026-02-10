import React from 'react';
import { Composition } from 'remotion';
import { SimpleExplainer } from './compositions/SimpleExplainer';
import { ConfigDrivenExplainer, explainerConfig } from './compositions/ConfigDrivenExplainer';
import { PosterComposition } from './compositions/PosterComposition';

const POSTER_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '16:9': { width: 1920, height: 1080 },
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
};

export const Root: React.FC = () => {
  const posterAspect = explainerConfig.poster?.aspectRatio ?? '16:9';
  const posterDims = POSTER_DIMENSIONS[posterAspect] ?? POSTER_DIMENSIONS['16:9'];

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
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Poster"
        component={() => <PosterComposition config={explainerConfig} />}
        durationInFrames={1}
        fps={30}
        width={posterDims.width}
        height={posterDims.height}
      />
    </>
  );
};
