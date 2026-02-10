import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { renderScene } from '../factory/renderScene';
import { VideoConfig } from '../schema/video';
import { CaptionLayer } from '../components/CaptionLayer';
import captionsData from '../assets/captions/ep01.words.json';

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
  captions: {
    enabled: true,
    source: 'ep01.words.json',
  },
};

export const ConfigDrivenExplainer: React.FC = () => {
  let currentFrame = 0;

  return (
    <AbsoluteFill>
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

      {config.captions?.enabled && (
        <AbsoluteFill style={{ zIndex: 10 }}>
          <CaptionLayer words={captionsData.words} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
