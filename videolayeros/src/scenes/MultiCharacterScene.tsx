import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { MultiCharacterSceneConfig, CharacterLayerConfig } from '../schema/video';
import { computeMotion } from '../utils/motion';
import { resolveCharacterEmotion } from '../registry/characterEmotions';

function resolveCharacter(character: CharacterLayerConfig): CharacterLayerConfig {
  if (character.characterId && character.emotion !== undefined) {
    const emotionState = resolveCharacterEmotion(character.characterId, character.emotion);
    if (emotionState) {
      return {
        ...character,
        asset: character.asset ?? emotionState.asset,
        scale: character.scale ?? emotionState.defaultScale,
        motion: character.motion ?? emotionState.defaultMotion,
      };
    }
  }

  if (!character.asset) {
    if (character.characterId) {
      const emotionState = resolveCharacterEmotion(character.characterId, 'neutral');
      if (emotionState) {
        return { ...character, asset: emotionState.asset };
      }
    }
    console.warn(`[MultiCharacterScene] No asset resolved for character "${character.id}".`);
  }

  return character;
}

const CharacterLayer: React.FC<{
  character: CharacterLayerConfig;
  durationInFrames: number;
}> = ({ character, durationInFrames }) => {
  const frame = useCurrentFrame();
  const resolved = resolveCharacter(character);

  const baseScale = resolved.scale ?? 1.0;

  const motionConfig = resolved.motion
    ? {
        ...resolved.motion,
        startScale: resolved.motion.startScale ?? baseScale,
        endScale: resolved.motion.endScale ?? baseScale,
      }
    : {
        type: 'static' as const,
        startScale: baseScale,
        endScale: baseScale,
      };

  const { scale, translateX, translateY } = computeMotion(
    frame,
    durationInFrames,
    motionConfig,
  );

  if (!resolved.asset) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${resolved.position.x}%, ${resolved.position.y}%)`,
        height: '100%',
      }}
    >
      <Img
        src={staticFile(resolved.asset)}
        style={{
          height: '100%',
          objectFit: 'contain',
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
        }}
      />
    </div>
  );
};

export const MultiCharacterScene: React.FC<MultiCharacterSceneConfig> = ({
  background,
  characters,
}) => {
  const { durationInFrames } = useVideoConfig();

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
          durationInFrames={durationInFrames}
        />
      ))}
    </AbsoluteFill>
  );
};
