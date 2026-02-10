import React from 'react';
import { Composition } from 'remotion';
import { SimpleExplainer } from './compositions/SimpleExplainer';
import { ConfigDrivenExplainer, explainerConfig } from './compositions/ConfigDrivenExplainer';
import { PosterComposition } from './compositions/PosterComposition';
import { AspectRatio, ASPECT_DIMENSIONS } from './schema/video';

const POSTER_RATIOS: AspectRatio[] = ['16:9', '9:16', '1:1', '4:5'];

const ratioToId = (ratio: AspectRatio): string => {
  return `Poster-${ratio.replace(':', 'x')}`;
};

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
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />
      {POSTER_RATIOS.map((ratio) => {
        const dims = ASPECT_DIMENSIONS[ratio];
        const id = ratioToId(ratio);
        return (
          <React.Fragment key={id}>
            <Composition
              id={id}
              component={() => (
                <PosterComposition config={explainerConfig} aspectRatio={ratio} />
              )}
              durationInFrames={1}
              fps={30}
              width={dims.width}
              height={dims.height}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
