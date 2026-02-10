export type FramingType = 'subject-dominant' | 'contextual' | 'supporting';

export type AnchorPoint =
  | 'center'
  | 'center-left'
  | 'center-right'
  | 'top-center'
  | 'bottom-center';

export interface FramingProfile {
  scale: number;
  anchor: AnchorPoint;
  yOffset: number;
}

export const FRAMING_PROFILES: Record<FramingType, FramingProfile> = {
  'subject-dominant': {
    scale: 1.35,
    anchor: 'center-left',
    yOffset: -6,
  },
  contextual: {
    scale: 1.05,
    anchor: 'center',
    yOffset: 0,
  },
  supporting: {
    scale: 0.95,
    anchor: 'center-right',
    yOffset: 4,
  },
};

const INTENT_FRAMING: Record<string, FramingType> = {
  overload: 'subject-dominant',
  handoff: 'subject-dominant',
  relief: 'contextual',
};

export function resolveFraming(
  explicit?: FramingType,
  intent?: string,
): FramingProfile | null {
  const framingType = explicit ?? (intent ? INTENT_FRAMING[intent] : undefined);
  if (!framingType) return null;
  return FRAMING_PROFILES[framingType] ?? null;
}

export function anchorToTranslate(anchor: AnchorPoint): { x: number; y: number } {
  switch (anchor) {
    case 'center-left':
      return { x: -8, y: 0 };
    case 'center-right':
      return { x: 8, y: 0 };
    case 'top-center':
      return { x: 0, y: -8 };
    case 'bottom-center':
      return { x: 0, y: 8 };
    case 'center':
    default:
      return { x: 0, y: 0 };
  }
}
