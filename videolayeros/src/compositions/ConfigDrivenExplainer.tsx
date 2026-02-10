import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { renderScene } from '../factory/renderScene';
import { VideoConfig, SceneConfig } from '../schema/video';
import { WordTiming } from '../schema/captions';
import { CaptionLayer, DensitySegment } from '../components/CaptionLayer';
import { compileScriptToScenes, compileScriptToCaptions } from '../compiler/intentCompiler';
import { ScriptFile } from '../schema/script';
import { resolveDensity } from '../registry/visualDensity';
import { isDwightPresent, applyDwightDensityCap } from '../resolvers/dwightBehaviorResolver';
import captionsData from '../assets/captions/ep01.words.json';
import scriptData from '../assets/scripts/ep01.script.json';

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
      intent: 'overload',
      background: { color: '#F5F5F5' },
      characters: [
        {
          id: 'keith',
          characterId: 'keith',
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

const getSceneDuration = (scene: SceneConfig): number => {
  if (scene.durationInFrames) return scene.durationInFrames;
  if (scene.type === 'character') return scene.duration * FPS;
  if (scene.type === 'multiCharacter') return scene.duration * FPS;
  return 120;
};

function getSceneDensityContext(scene: SceneConfig): { density?: string; intent?: string } {
  if (scene.type === 'multiCharacter') {
    return { density: scene.density, intent: scene.intent };
  }
  if (scene.type === 'character') {
    return { density: scene.density };
  }
  return {};
}

function buildDensitySegments(scenes: SceneConfig[]): DensitySegment[] {
  const segments: DensitySegment[] = [];
  let currentFrame = 0;

  for (const scene of scenes) {
    const duration = getSceneDuration(scene);
    const ctx = getSceneDensityContext(scene);
    let profile = resolveDensity(ctx.density as any, ctx.intent);

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

function resolveConfig(config: VideoConfig): {
  scenes: SceneConfig[];
  captionWords: WordTiming[];
} {
  if (config.scriptFile) {
    const script = scriptData as ScriptFile;
    return {
      scenes: compileScriptToScenes(script),
      captionWords: compileScriptToCaptions(script),
    };
  }

  return {
    scenes: config.scenes ?? [],
    captionWords: config.captions?.enabled ? captionsData.words : [],
  };
}

export const ConfigDrivenExplainer: React.FC = () => {
  const { scenes, captionWords } = resolveConfig(explainerConfig);
  const densitySegments = buildDensitySegments(scenes);
  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {scenes.map((scene, index) => {
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

      {captionWords.length > 0 && (
        <AbsoluteFill style={{ zIndex: 10 }}>
          <CaptionLayer words={captionWords} densitySegments={densitySegments} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
