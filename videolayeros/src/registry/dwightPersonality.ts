import { AnchorPoint } from './framingProfiles';
import { DensityType } from '../registry/visualDensity';

export const DWIGHT_CHARACTER_ID = 'dwight';

export interface DwightMotionOverrides {
  defaultMotionType: 'static';
  defaultTransition: 'hold';
}

export interface DwightFramingBias {
  subjectDominantAnchor: AnchorPoint;
  contextualYOffsetBoost: number; // negative = higher in frame
}

export interface DwightDensityInteraction {
  maxDensity: DensityType;
}

export interface DwightCaptionTone {
  scaleBump: false;
  wpmMultiplier: number;
}

export interface DwightSilenceModifier {
  durationMultiplier: number;
  fadeOutMs: number;
  fadeInMs: number;
}

export interface DwightPersonality {
  characterId: string;
  motion: DwightMotionOverrides;
  framingBias: DwightFramingBias;
  densityInteraction: DwightDensityInteraction;
  captionTone: DwightCaptionTone;
  silence: DwightSilenceModifier;
}

export const DWIGHT_PERSONALITY: DwightPersonality = {
  characterId: DWIGHT_CHARACTER_ID,
  motion: {
    defaultMotionType: 'static',
    defaultTransition: 'hold',
  },
  framingBias: {
    subjectDominantAnchor: 'center',
    contextualYOffsetBoost: -3,
  },
  densityInteraction: {
    maxDensity: 'medium',
  },
  captionTone: {
    scaleBump: false,
    wpmMultiplier: 0.9,
  },
  silence: {
    durationMultiplier: 1.15,
    fadeOutMs: 300,
    fadeInMs: 250,
  },
};
