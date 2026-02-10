import { CharacterLayerConfig, CharacterMotionConfig } from '../schema/video';
import { FramingProfile } from '../registry/framingProfiles';
import { DensityProfile, DensityType, DENSITY_PROFILES, resolveDensity } from '../registry/visualDensity';
import { DWIGHT_CHARACTER_ID, DWIGHT_PERSONALITY } from '../registry/dwightPersonality';

export function isDwightPresent(characters: CharacterLayerConfig[]): boolean {
  return characters.some(
    (c) => c.characterId === DWIGHT_CHARACTER_ID || c.id === DWIGHT_CHARACTER_ID,
  );
}

export function isDwightCharacter(character: CharacterLayerConfig): boolean {
  return (
    character.characterId === DWIGHT_CHARACTER_ID ||
    character.id === DWIGHT_CHARACTER_ID
  );
}

export function applyDwightMotion(
  character: CharacterLayerConfig,
  resolvedMotion?: CharacterMotionConfig,
): CharacterMotionConfig | undefined {
  if (!isDwightCharacter(character)) return resolvedMotion;

  if (character.motion) return character.motion;

  return {
    type: DWIGHT_PERSONALITY.motion.defaultMotionType,
    startScale: character.scale ?? 1.0,
    endScale: character.scale ?? 1.0,
  };
}

export function applyDwightFramingBias(
  framingProfile: FramingProfile | null,
  hasDwight: boolean,
): FramingProfile | null {
  if (!hasDwight || !framingProfile) return framingProfile;

  const bias = DWIGHT_PERSONALITY.framingBias;

  if (framingProfile.scale >= 1.3) {
    return {
      ...framingProfile,
      anchor: bias.subjectDominantAnchor,
    };
  }

  if (framingProfile.scale >= 1.0 && framingProfile.scale < 1.3) {
    return {
      ...framingProfile,
      yOffset: framingProfile.yOffset + bias.contextualYOffsetBoost,
    };
  }

  return framingProfile;
}

const DENSITY_ORDER: DensityType[] = ['low', 'medium', 'high'];

export function applyDwightDensityCap(
  densityProfile: DensityProfile,
  hasDwight: boolean,
): DensityProfile {
  if (!hasDwight) return densityProfile;

  const maxDensity = DWIGHT_PERSONALITY.densityInteraction.maxDensity;
  const maxProfile = DENSITY_PROFILES[maxDensity];

  if (densityProfile.backgroundContrastBoost && !maxProfile.backgroundContrastBoost) {
    return maxProfile;
  }

  const currentIdx = DENSITY_ORDER.findIndex(
    (d) => DENSITY_PROFILES[d] === densityProfile,
  );
  const maxIdx = DENSITY_ORDER.indexOf(maxDensity);

  if (currentIdx > maxIdx) {
    return maxProfile;
  }

  return densityProfile;
}

export function getDwightWpmMultiplier(hasDwight: boolean): number {
  if (!hasDwight) return 1.0;
  return DWIGHT_PERSONALITY.captionTone.wpmMultiplier;
}

export function getDwightSilenceFades(dwightPresent: boolean): {
  fadeOutMs: number;
  fadeInMs: number;
} {
  if (!dwightPresent) {
    return { fadeOutMs: 200, fadeInMs: 150 };
  }
  return {
    fadeOutMs: DWIGHT_PERSONALITY.silence.fadeOutMs,
    fadeInMs: DWIGHT_PERSONALITY.silence.fadeInMs,
  };
}
