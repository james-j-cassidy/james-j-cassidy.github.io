// Story timing, in story time: each part owns one unit. Within its unit a part holds for
// STORY_HOLD, then spends STORY_TRANSITION turning into the next part.
export const STORY_HOLD = 0.6;
export const STORY_TRANSITION = 1 - STORY_HOLD;

// The first part enters over the last part of the header's collapse (0 = full header,
// 1 = compact), from this point on.
export const OPENING_ENTERS_FROM = 0.45;

// How quickly the animation catches up with the scroll position: the time constant of
// the glide, so wheel steps and jumps play as one smooth movement.
export const STORY_SMOOTHING = 90; // ms

// Story time runs from 0, where the header is fully collapsed and the first part has
// formed, to this length, where the last part has held.
export function storyLength(partCount: number): number {
  return Math.max(0, partCount - 1) + STORY_HOLD;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Slow start, slow finish: movement eases in and out of every transition.
export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

// How far a part has entered (0 → 1) and left (0 → 1) at a story time. The first part
// enters with the header's collapse instead.
export function partProgress(
  index: number,
  story: number,
  collapse: number,
): { enter: number; exit: number } {
  const enter =
    index === 0
      ? clamp01((collapse - OPENING_ENTERS_FROM) / (1 - OPENING_ENTERS_FROM))
      : clamp01((story - index + STORY_TRANSITION) / STORY_TRANSITION);
  const exit = clamp01((story - index - STORY_HOLD) / STORY_TRANSITION);
  return { enter: easeInOut(enter), exit: easeInOut(exit) };
}
