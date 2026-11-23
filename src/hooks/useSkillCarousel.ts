import {
  useCallback,
  useEffect,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { useReducedMotion } from "./useReducedMotion";

interface Position {
  index: number;
  // Total steps taken, so the wheel always spins the short way and never unwinds.
  turn: number;
}

// Shared state for the skill wheel, summary and controls.
// Auto-advance follows WCAG 2.2.2: it can be paused, it waits while the pointer is over
// or keyboard focus is inside the skill areas, and it starts paused when motion is reduced.
// It also waits while the wheel is hidden (isHidden: the collapsed header).
export function useSkillCarousel(
  count: number,
  intervalMs: number,
  isHidden = false,
) {
  const reducedMotion = useReducedMotion();
  const [{ index, turn }, setPosition] = useState<Position>({
    index: 0,
    turn: 0,
  });
  // null until the user presses pause or play; then their choice wins.
  const [playChoice, setPlayChoice] = useState<boolean | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const isPlaying = playChoice ?? !reducedMotion;
  const isRotating = isPlaying && !isHovered && !hasFocus && !isHidden;

  const step = useCallback(
    (delta: number) =>
      setPosition((position) => ({
        index: (((position.index + delta) % count) + count) % count,
        turn: position.turn + delta,
      })),
    [count],
  );

  const goTo = useCallback(
    (target: number) =>
      setPosition((position) => {
        let delta = (target - position.index + count) % count;
        if (delta > count / 2) delta -= count;
        return { index: target, turn: position.turn + delta };
      }),
    [count],
  );

  useEffect(() => {
    if (!isRotating) return;
    const timer = window.setInterval(() => step(1), intervalMs);
    return () => window.clearInterval(timer);
  }, [isRotating, intervalMs, step]);

  function togglePlaying() {
    setPlayChoice(!isPlaying);
  }

  // Spread onto each skill area. Hover counts for a mouse only, since a tap would
  // otherwise leave the rotation waiting forever with no pointer leave.
  const pauseOnInteraction = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") setIsHovered(true);
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") setIsHovered(false);
    },
    onFocus: () => setHasFocus(true),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setHasFocus(false);
      }
    },
  };

  return {
    index,
    turn,
    isPlaying,
    isRotating,
    step,
    goTo,
    togglePlaying,
    pauseOnInteraction,
  };
}
