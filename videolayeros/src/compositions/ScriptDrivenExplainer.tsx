import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { renderScene } from '../factory/renderScene';
import { SceneConfig } from '../schema/video';
import { CaptionLayer, DensitySegment } from '../components/CaptionLayer';
import { compileScriptToScenes, compileScriptToCaptions } from '../compiler/intentCompiler';
import { resolveDensity } from '../registry/visualDensity';
import { isDwightPresent, applyDwightDensityCap } from '../resolvers/dwightBehaviorResolver';
import scriptData from '../assets/scripts/ep01.script.json';
import { ScriptFile } from '../schema/script';

const FPS = 30;

const script = scriptData as ScriptFile;
const compiledScenes = compileScriptToScenes(script);
const compiledCaptions = compileScriptToCaptions(script);

const getSceneDuration = (scene: SceneConfig): number => {
  if (scene.durationInFrames) return scene.durationInFrames;
  if (scene.type === 'character') return scene.duration * FPS;
  if (scene.type === 'multiCharacter') return scene.duration * FPS;
  return 120;
};

const totalFrames = compiledScenes.reduce(
  (sum, scene) => sum + getSceneDuration(scene),
  0,
);

function buildDensitySegments(scenes: SceneConfig[]): DensitySegment[] {
  const segments: DensitySegment[] = [];
  let currentFrame = 0;

  for (const scene of scenes) {
    const duration = getSceneDuration(scene);
    const intent = scene.type === 'multiCharacter' ? scene.intent : undefined;
    const density = (scene.type === 'multiCharacter' || scene.type === 'character')
      ? (scene as any).density
      : undefined;
    let profile = resolveDensity(density, intent);

    const hasDwight = scene.type === 'multiCharacter' && isDwightPresent(scene.characters);
    profile = applyDwightDensityCap(profile, hasDwight);

    segments.push({
      startFrame: currentFrame,
      endFrame: currentFrame + duration,
      density: profile,
      dwightPresent: hasDwight,
    });

    currentFrame += duration;
  }

  return segments;
}

const densitySegments = buildDensitySegments(compiledScenes);

export const scriptExplainerDuration = totalFrames;

export const ScriptDrivenExplainer: React.FC = () => {
  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {compiledScenes.map((scene, index) => {
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

      {compiledCaptions.length > 0 && (
        <AbsoluteFill style={{ zIndex: 10 }}>
          <CaptionLayer words={compiledCaptions} densitySegments={densitySegments} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
