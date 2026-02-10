import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { MultiCharacterSceneConfig, CharacterLayerConfig } from '../schema/video';
import { computeMotion } from '../utils/motion';

const CharacterLayer: React.FC<{
  character: CharacterLayerConfig;
  durationInFrames: number;
}> = ({ character, durationInFrames }) => {
  const frame = useCurrentFrame();

  const baseScale = character.scale ?? 1.0;

  const motionConfig = character.motion
    ? {
        ...character.motion,
        startScale: character.motion.startScale ?? baseScale,
        endScale: character.motion.endScale ?? baseScale,
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

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${character.position.x}%, ${character.position.y}%)`,
        height: '100%',
      }}
    >
      <Img
        src={staticFile(character.asset)}
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
