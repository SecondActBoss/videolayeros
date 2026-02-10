import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PosterCropConfig, PosterHeadlineConfig } from '../schema/video';

interface PosterLayerProps {
  crop?: PosterCropConfig;
  headline?: PosterHeadlineConfig;
  children: React.ReactNode;
}

const getHeadlineStyle = (position: PosterHeadlineConfig['position']): React.CSSProperties => {
  const base: React.CSSProperties = {
    position: 'absolute',
    zIndex: 20,
    fontFamily: 'sans-serif',
    fontWeight: 900,
    fontSize: 72,
    lineHeight: 1.1,
    color: '#FFFFFF',
    textShadow: '0 4px 20px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)',
    letterSpacing: '-1px',
    maxWidth: '55%',
  };

  switch (position) {
    case 'top-left':
      return { ...base, top: 60, left: 60 };
    case 'top-right':
      return { ...base, top: 60, right: 60, textAlign: 'right' };
    case 'left':
      return { ...base, top: '50%', left: 60, transform: 'translateY(-50%)' };
    default:
      return { ...base, top: 60, left: 60 };
  }
};

export const PosterLayer: React.FC<PosterLayerProps> = ({
  crop,
  headline,
  children,
}) => {
  const zoom = crop?.zoom ?? 1;
  const offsetX = crop?.offsetX ?? 0;
  const offsetY = crop?.offsetY ?? 0;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${zoom}) translate(${offsetX}%, ${offsetY}%)`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>

      {headline && (
        <div style={getHeadlineStyle(headline.position)}>
          {headline.text}
        </div>
      )}
    </AbsoluteFill>
  );
};
