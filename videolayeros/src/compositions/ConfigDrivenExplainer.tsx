import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { renderScene } from '../factory/renderScene';
import { VideoConfig } from '../schema/video';
import { CaptionLayer } from '../components/CaptionLayer';
import captionsData from '../assets/captions/ep01.words.json';

export const explainerConfig: VideoConfig = {
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
          characterId: 'keith',
          emotion: 'overwhelmed',
          position: { x: -10, y: 5 },
          motion: {
            type: 'panZoom',
            startScale: 1.1,
            endScale: 1.15,
          },
        },
        {
          id: 'rachel',
          characterId: 'rachel',
          emotion: 'concerned',
          position: { x: 15, y: 8 },
        },
        {
          id: 'dwight',
          characterId: 'dwight',
          emotion: 'confident',
          position: { x: -35, y: 0 },
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
  poster: {
    enabled: true,
    sceneIndex: 2,
    aspectRatio: '16:9',
    crop: {
      zoom: 1.35,
      offsetX: -20,
      offsetY: -10,
    },
    overrides: {
      '9:16': {
        heroScale: 1.5,
        offsetY: -15,
        headlinePosition: 'top',
      },
      '1:1': {
        heroScale: 1.3,
        offsetY: -10,
        headlinePosition: 'top',
      },
      '4:5': {
        heroScale: 1.4,
        offsetY: -12,
        headlinePosition: 'top',
      },
    },
    headline: {
      text: 'EVERY LEAD. EVERY TIME.',
      position: 'top-left',
    },
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
      {explainerConfig.scenes.map((scene, index) => {
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

      {explainerConfig.captions?.enabled && (
        <AbsoluteFill style={{ zIndex: 10 }}>
          <CaptionLayer words={captionsData.words} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
