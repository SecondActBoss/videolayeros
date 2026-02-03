import React from 'react';
import {Composition} from 'remotion';
import {IntroScene} from './scenes/IntroScene';

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
    </>
  );
};
