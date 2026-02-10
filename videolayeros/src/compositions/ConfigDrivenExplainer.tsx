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
      type: 'character',
      asset: 'keith_overload.png',
      duration: 5,
      motion: {
        type: 'panZoom',
        startScale: 1.0,
        endScale: 1.06,
        startX: 0,
        endX: -3,
        startY: 0,
        endY: 0,
      },
    },
    {
      type: 'multiCharacter',
      duration: 6,
      background: { color: '#F5F5F5' },
      characters: [
        {
          id: 'keith',
          asset: 'keith_overload.png',
          position: { x: -10, y: 5 },
          scale: 1.1,
          motion: {
            type: 'panZoom',
            startScale: 1.1,
            endScale: 1.15,
          },
        },
        {
          id: 'rachel',
          asset: 'rachel_concerned.png',
          position: { x: 15, y: 8 },
          scale: 1.0,
        },
        {
          id: 'dwight',
          asset: 'dwight_confident.png',
          position: { x: -35, y: 0 },
          scale: 1.25,
        },
      ],
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

const FPS = 30;

const getSceneDuration = (scene: VideoConfig['scenes'][number]): number => {
  if (scene.durationInFrames) return scene.durationInFrames;
  if (scene.type === 'character') return scene.duration * FPS;
  if (scene.type === 'multiCharacter') return scene.duration * FPS;
  return 120;
};

export const ConfigDrivenExplainer: React.FC = () => {
  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {config.scenes.map((scene, index) => {
        const duration = getSceneDuration(scene);
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
