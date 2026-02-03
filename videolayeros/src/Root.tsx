import React from 'react';
import {Composition} from 'remotion';
import {IntroScene} from './scenes/IntroScene';
import {SimpleExplainer} from './compositions/SimpleExplainer';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={IntroScene}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Hello VideoLayerOS',
        }}
      />
      <Composition
        id="SimpleExplainer"
        component={SimpleExplainer}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Welcome',
          text: 'This is a simple explainer video',
          quote: 'Create videos with code',
        }}
      />
    </>
  );
};
