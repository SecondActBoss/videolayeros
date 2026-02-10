import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AspectRatio, AspectOverrides, PosterConfig, HeadlinePosition } from '../schema/video';

interface PosterLayerProps {
  poster?: PosterConfig;
  activeAspect: AspectRatio;
  children: React.ReactNode;
}

const resolveOverrides = (
  poster: PosterConfig | undefined,
  activeAspect: AspectRatio,
): { zoom: number; offsetX: number; offsetY: number; headlinePosition: HeadlinePosition } => {
  const baseCrop = poster?.crop ?? { zoom: 1, offsetX: 0, offsetY: 0 };
  const baseHeadlinePos = poster?.headline?.position ?? 'top-left';

  const override = poster?.overrides?.[activeAspect];
  if (!override) {
    return {
      zoom: baseCrop.zoom,
      offsetX: baseCrop.offsetX,
      offsetY: baseCrop.offsetY,
      headlinePosition: baseHeadlinePos,
    };
  }

  return {
    zoom: override.heroScale ?? baseCrop.zoom,
    offsetX: override.offsetX ?? baseCrop.offsetX,
    offsetY: override.offsetY ?? baseCrop.offsetY,
    headlinePosition: override.headlinePosition ?? baseHeadlinePos,
  };
};

const getHeadlineStyle = (position: HeadlinePosition): React.CSSProperties => {
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
    maxWidth: '80%',
    padding: '0 60px',
    boxSizing: 'border-box',
  };

  switch (position) {
    case 'top-left':
      return { ...base, top: 60, left: 0, textAlign: 'left' };
    case 'top-right':
      return { ...base, top: 60, right: 0, textAlign: 'right' };
    case 'top':
      return { ...base, top: 60, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' };
    case 'center':
      return { ...base, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' };
    case 'left':
      return { ...base, top: '50%', left: 0, transform: 'translateY(-50%)' };
    default:
      return { ...base, top: 60, left: 0 };
  }
};

export const PosterLayer: React.FC<PosterLayerProps> = ({
  poster,
  activeAspect,
  children,
}) => {
  const { zoom, offsetX, offsetY, headlinePosition } = resolveOverrides(poster, activeAspect);
  const headline = poster?.headline;

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
        <div style={getHeadlineStyle(headlinePosition)}>
          {headline.text}
        </div>
      )}
    </AbsoluteFill>
  );
};
