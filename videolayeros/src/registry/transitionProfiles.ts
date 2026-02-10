import { interpolate } from 'remotion';

export type TransitionType = 'cut' | 'push' | 'hold';

export interface CutTransition {
  type: 'cut';
}

export interface PushTransition {
  type: 'push';
  scaleDelta: number;
  durationPct: number;
}

export interface HoldTransition {
  type: 'hold';
}

export type TransitionProfile = CutTransition | PushTransition | HoldTransition;

export const TRANSITION_PROFILES: Record<TransitionType, TransitionProfile> = {
  cut: { type: 'cut' },
  push: { type: 'push', scaleDelta: 0.06, durationPct: 0.25 },
  hold: { type: 'hold' },
};

const INTENT_TRANSITION: Record<string, TransitionType> = {
  overload: 'cut',
  handoff: 'push',
  relief: 'hold',
};

const MIN_PUSH_DURATION_SEC = 1.5;
const MAX_TOTAL_SCALE = 1.45;

export function resolveTransition(
  explicit?: TransitionType,
  intent?: string,
): TransitionProfile {
  const transitionType = explicit ?? (intent ? INTENT_TRANSITION[intent] : undefined) ?? 'cut';
  return TRANSITION_PROFILES[transitionType] ?? TRANSITION_PROFILES.cut;
}

export function computeTransitionScale(
  transition: TransitionProfile,
  baseScale: number,
  frame: number,
  durationInFrames: number,
  fps: number,
): number {
  if (transition.type !== 'push') return baseScale;

  const durationSec = durationInFrames / fps;
  if (durationSec < MIN_PUSH_DURATION_SEC) return baseScale;

  const pushFrames = Math.floor(durationInFrames * transition.durationPct);
  if (pushFrames <= 0) return baseScale;

  let delta = transition.scaleDelta;
  if (baseScale + delta > MAX_TOTAL_SCALE) {
    delta = Math.max(0, MAX_TOTAL_SCALE - baseScale);
  }

  if (frame >= pushFrames) return baseScale;

  return interpolate(
    frame,
    [0, pushFrames],
    [baseScale - delta, baseScale],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
  );
}
