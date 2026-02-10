import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { renderScene } from '../factory/renderScene';
import { VideoConfig, SceneConfig, AspectRatio } from '../schema/video';
import { PosterLayer } from '../components/PosterLayer';

const FPS = 30;

const getSceneDuration = (scene: SceneConfig): number => {
  if (scene.durationInFrames) return scene.durationInFrames;
  if (scene.type === 'character') return scene.duration * FPS;
  if (scene.type === 'multiCharacter') return scene.duration * FPS;
  return 120;
};

const findTargetScene = (config: VideoConfig): { scene: SceneConfig; localFrame: number } | null => {
  const scenes = config.scenes ?? [];
  if (scenes.length === 0) return null;

  const poster = config.poster;
  if (!poster) {
    return { scene: scenes[0], localFrame: 0 };
  }

  if (poster.sceneIndex !== undefined && poster.sceneIndex < scenes.length) {
    const scene = scenes[poster.sceneIndex];
    const duration = getSceneDuration(scene);
    const localFrame = poster.frame ?? Math.floor(duration / 2);
    return { scene, localFrame: Math.min(localFrame, duration - 1) };
  }

  if (poster.frame !== undefined) {
    let accumulated = 0;
    for (const scene of scenes) {
      const duration = getSceneDuration(scene);
      if (poster.frame < accumulated + duration) {
        return { scene, localFrame: poster.frame - accumulated };
      }
      accumulated += duration;
    }
  }

  const characterIdx = scenes.findIndex(
    (s) => s.type === 'character' || s.type === 'multiCharacter',
  );
  if (characterIdx >= 0) {
    const scene = scenes[characterIdx];
    const duration = getSceneDuration(scene);
    return { scene, localFrame: Math.floor(duration / 2) };
  }

  return { scene: scenes[0], localFrame: 0 };
};

interface PosterCompositionProps {
  config: VideoConfig;
  aspectRatio: AspectRatio;
}

export const PosterComposition: React.FC<PosterCompositionProps> = ({ config, aspectRatio }) => {
  const result = findTargetScene(config);
  if (!result) return <AbsoluteFill />;

  const { scene, localFrame } = result;
  const sceneDuration = getSceneDuration(scene);

  return (
    <AbsoluteFill>
      <PosterLayer poster={config.poster} activeAspect={aspectRatio}>
        <Sequence from={-localFrame} durationInFrames={sceneDuration}>
          {renderScene(scene)}
        </Sequence>
      </PosterLayer>
    </AbsoluteFill>
  );
};
