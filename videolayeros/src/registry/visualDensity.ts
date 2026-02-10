export type DensityType = 'high' | 'medium' | 'low';

export interface DensityProfile {
  captionOpacity: number;
  captionBackgroundOpacity: number;
  allowUIElements: 'all' | 'limited' | 'none';
  backgroundContrastBoost: boolean;
}

export const DENSITY_PROFILES: Record<DensityType, DensityProfile> = {
  high: {
    captionOpacity: 1.0,
    captionBackgroundOpacity: 0.85,
    allowUIElements: 'all',
    backgroundContrastBoost: true,
  },
  medium: {
    captionOpacity: 0.9,
    captionBackgroundOpacity: 0.7,
    allowUIElements: 'limited',
    backgroundContrastBoost: false,
  },
  low: {
    captionOpacity: 0.8,
    captionBackgroundOpacity: 0.55,
    allowUIElements: 'none',
    backgroundContrastBoost: false,
  },
};

const INTENT_DENSITY: Record<string, DensityType> = {
  overload: 'high',
  handoff: 'medium',
  relief: 'low',
};

const DEFAULT_DENSITY: DensityType = 'medium';

export function resolveDensity(
  explicit?: DensityType,
  intent?: string,
): DensityProfile {
  const densityType =
    explicit ??
    (intent ? INTENT_DENSITY[intent] : undefined) ??
    DEFAULT_DENSITY;
  return DENSITY_PROFILES[densityType] ?? DENSITY_PROFILES[DEFAULT_DENSITY];
}

export function resolveDensityType(
  explicit?: DensityType,
  intent?: string,
): DensityType {
  return (
    explicit ??
    (intent ? INTENT_DENSITY[intent] : undefined) ??
    DEFAULT_DENSITY
  );
}
