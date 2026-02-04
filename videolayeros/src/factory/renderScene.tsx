import React from 'react';
import { IntroScene } from '../scenes/IntroScene';
import { TextScene } from '../scenes/TextScene';
import { SceneConfig } from '../schema/video';

export const renderScene = (scene: SceneConfig) => {
  switch (scene.type) {
    case 'intro':
      return <IntroScene title={scene.text} />;

    case 'text':
      return (
        <TextScene
          text={scene.text}
          background={scene.background}
        />
      );

    default:
      return null;
  }
};
