import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { renderScene } from '../factory/renderScene';
import { SceneConfig } from '../schema/video';
import { CaptionLayer } from '../components/CaptionLayer';
import { compileScriptToScenes, compileScriptToCaptions } from '../compiler/intentCompiler';
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
          <CaptionLayer words={compiledCaptions} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
