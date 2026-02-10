import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { renderScene } from '../factory/renderScene';
import { VideoConfig, SceneConfig } from '../schema/video';
import { PosterLayer } from '../components/PosterLayer';

const FPS = 30;

const getSceneDuration = (scene: SceneConfig): number => {
  if (scene.durationInFrames) return scene.durationInFrames;
  if (scene.type === 'character') return scene.duration * FPS;
  if (scene.type === 'multiCharacter') return scene.duration * FPS;
  return 120;
};

const findTargetScene = (config: VideoConfig): { scene: SceneConfig; localFrame: number } => {
  const poster = config.poster;
  if (!poster) {
    return { scene: config.scenes[0], localFrame: 0 };
  }

  if (poster.sceneIndex !== undefined && poster.sceneIndex < config.scenes.length) {
    const scene = config.scenes[poster.sceneIndex];
    const duration = getSceneDuration(scene);
    const localFrame = poster.frame ?? Math.floor(duration / 2);
    return { scene, localFrame: Math.min(localFrame, duration - 1) };
  }

  if (poster.frame !== undefined) {
    let accumulated = 0;
    for (const scene of config.scenes) {
      const duration = getSceneDuration(scene);
      if (poster.frame < accumulated + duration) {
        return { scene, localFrame: poster.frame - accumulated };
      }
      accumulated += duration;
    }
  }

  const characterIdx = config.scenes.findIndex(
    (s) => s.type === 'character' || s.type === 'multiCharacter',
  );
  if (characterIdx >= 0) {
    const scene = config.scenes[characterIdx];
    const duration = getSceneDuration(scene);
    return { scene, localFrame: Math.floor(duration / 2) };
  }

  return { scene: config.scenes[0], localFrame: 0 };
};

interface PosterCompositionProps {
  config: VideoConfig;
}

export const PosterComposition: React.FC<PosterCompositionProps> = ({ config }) => {
  const poster = config.poster;
  const { scene, localFrame } = findTargetScene(config);
  const sceneDuration = getSceneDuration(scene);

  return (
    <AbsoluteFill>
      <PosterLayer crop={poster?.crop} headline={poster?.headline}>
        <Sequence from={-localFrame} durationInFrames={sceneDuration}>
          {renderScene(scene)}
        </Sequence>
      </PosterLayer>
    </AbsoluteFill>
  );
};
