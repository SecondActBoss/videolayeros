import React from 'react';
import { Sequence } from 'remotion';
import { renderScene } from '../factory/renderScene';
import { VideoConfig } from '../schema/video';

const config: VideoConfig = {
  composition: 'ConfigDrivenExplainer',
  scenes: [
    { type: 'intro', text: 'Meet Your AI Workforce' },
    {
      type: 'text',
      text: 'AI Employees that handle the busywork',
      background: '#4F46E5',
    },
    {
      type: 'text',
      text: 'Define the work. VideoLayerOS renders the rest.',
      background: '#1E293B',
    },
  ],
};

export const ConfigDrivenExplainer: React.FC = () => {
  let currentFrame = 0;

  return (
    <>
      {config.scenes.map((scene, index) => {
        const duration = scene.durationInFrames ?? 120;
        const element = (
          <Sequence
            key={index}
            from={currentFrame}
            durationInFrames={duration}
          >
            {renderScene(scene)}
          </Sequence>
        );

        currentFrame += duration;
        return element;
      })}
    </>
  );
};
