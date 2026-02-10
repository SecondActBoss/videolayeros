import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { MultiCharacterSceneConfig, CharacterLayerConfig } from '../schema/video';
import { computeMotion } from '../utils/motion';
import { resolveCharacterEmotion } from '../registry/characterEmotions';
import { resolveIntentEmotion } from '../registry/sceneIntents';
import { resolveFraming, anchorToTranslate, FramingProfile } from '../registry/framingProfiles';
import { resolveTransition, computeTransitionScale, TransitionProfile } from '../registry/transitionProfiles';
import { resolveDensity, DensityProfile } from '../registry/visualDensity';
import {
  isDwightPresent,
  isDwightCharacter,
  applyDwightMotion,
  applyDwightFramingBias,
  applyDwightDensityCap,
} from '../resolvers/dwightBehaviorResolver';

function resolveCharacter(
  character: CharacterLayerConfig,
  intent?: string,
): CharacterLayerConfig {
  let emotion = character.emotion;

  if (!emotion && intent && character.characterId) {
    emotion = resolveIntentEmotion(intent, character.characterId) ?? undefined;
  }

  if (character.characterId && emotion !== undefined) {
    const emotionState = resolveCharacterEmotion(character.characterId, emotion);
    if (emotionState) {
      let resolvedMotion = character.motion ?? emotionState.defaultMotion;
      const resolved: CharacterLayerConfig = {
        ...character,
        asset: character.asset ?? emotionState.asset,
        scale: character.scale ?? emotionState.defaultScale,
        motion: resolvedMotion,
      };
      resolved.motion = applyDwightMotion(character, resolved.motion);
      return resolved;
    }
  }

  if (!character.asset) {
    if (character.characterId) {
      const emotionState = resolveCharacterEmotion(character.characterId, 'neutral');
      if (emotionState) {
        const resolved = { ...character, asset: emotionState.asset };
        resolved.motion = applyDwightMotion(character, resolved.motion);
        return resolved;
      }
    }
    console.warn(`[MultiCharacterScene] No asset resolved for character "${character.id}".`);
  }

  const result = { ...character };
  result.motion = applyDwightMotion(character, result.motion);
  return result;
}

const CharacterLayer: React.FC<{
  character: CharacterLayerConfig;
  intent?: string;
  durationInFrames: number;
  fps: number;
  framingProfile: FramingProfile | null;
  transitionProfile: TransitionProfile;
  densityProfile: DensityProfile;
}> = ({ character, intent, durationInFrames, fps, framingProfile, transitionProfile, densityProfile }) => {
  const frame = useCurrentFrame();
  const resolved = resolveCharacter(character, intent);

  if (!resolved.asset) return null;

  let baseScale: number;
  let motionTranslateX: number;
  let motionTranslateY: number;

  if (framingProfile) {
    const anchorOffset = anchorToTranslate(framingProfile.anchor);
    baseScale = (resolved.scale ?? 1.0) * framingProfile.scale;
    motionTranslateX = anchorOffset.x;
    motionTranslateY = anchorOffset.y;
  } else {
    const charBaseScale = resolved.scale ?? 1.0;
    const motionConfig = resolved.motion
      ? {
          ...resolved.motion,
          startScale: resolved.motion.startScale ?? charBaseScale,
          endScale: resolved.motion.endScale ?? charBaseScale,
        }
      : {
          type: 'static' as const,
          startScale: charBaseScale,
          endScale: charBaseScale,
        };
    const motionResult = computeMotion(frame, durationInFrames, motionConfig);
    baseScale = motionResult.scale;
    motionTranslateX = motionResult.translateX;
    motionTranslateY = motionResult.translateY;
  }

  const scale = computeTransitionScale(
    transitionProfile,
    baseScale,
    frame,
    durationInFrames,
    fps,
  );

  const framingYOffset = framingProfile?.yOffset ?? 0;
  const contrastFilter = densityProfile.backgroundContrastBoost
    ? 'contrast(1.08) saturate(1.05)'
    : 'none';

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${resolved.position.x}%, ${resolved.position.y + framingYOffset}%)`,
        height: '100%',
      }}
    >
      <Img
        src={staticFile(resolved.asset)}
        style={{
          height: '100%',
          objectFit: 'contain',
          transform: `scale(${scale}) translate(${motionTranslateX}%, ${motionTranslateY}%)`,
          filter: contrastFilter,
        }}
      />
    </div>
  );
};

export const MultiCharacterScene: React.FC<MultiCharacterSceneConfig> = ({
  background,
  intent,
  framing,
  transition,
  density,
  characters,
}) => {
  const { durationInFrames, fps } = useVideoConfig();

  const hasDwight = isDwightPresent(characters);

  let framingProfile = resolveFraming(framing, intent);
  framingProfile = applyDwightFramingBias(framingProfile, hasDwight);

  const transitionProfile = resolveTransition(transition, intent);

  let densityProfile = resolveDensity(density, intent);
  densityProfile = applyDwightDensityCap(densityProfile, hasDwight);

  const bgStyle: React.CSSProperties = {
    overflow: 'hidden',
  };

  if (background?.color) {
    bgStyle.backgroundColor = background.color;
  }

  return (
    <AbsoluteFill style={bgStyle}>
      {background?.image && (
        <Img
          src={staticFile(background.image)}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {characters.map((character) => (
        <CharacterLayer
          key={character.id}
          character={character}
          intent={intent}
          durationInFrames={durationInFrames}
          fps={fps}
          framingProfile={framingProfile}
          transitionProfile={transitionProfile}
          densityProfile={densityProfile}
        />
      ))}
    </AbsoluteFill>
  );
};
