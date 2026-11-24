import {
  useCallback,
  useEffect,
  useState,
  type FocusEvent,
  type RefObject,
} from "react";
import {
  STORY_HOLD,
  STORY_SMOOTHING,
  STORY_TRANSITION,
  partProgress,
} from "../components/Sections/Story/storyTiming";
import { useNavigation } from "../state/navigation";

// Where scrollend is missing: how long scrolling must pause before a transition settles.
const SETTLE_DELAY = 150; // ms

// The shortest stage the parts are laid out for. Shorter (large zoom, a phone on its
// side), the story reads as an ordinary page instead.
const MIN_STAGE_HEIGHT = 340; // px

interface Geometry {
  range: number; // scroll distance of the header's collapse; story time 0 is there
  unit: number; // scroll distance per unit of story time
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function partsOf(stage: HTMLElement): HTMLElement[] {
  return Array.from(stage.querySelectorAll<HTMLElement>("[data-part-index]"));
}

// Drives a story from the scroll position. The stage is pinned under the header from the
// top of the page, so nothing on it ever scrolls: the distance scrolled is only a
// timeline. The first part forms as the header collapses; after that each part holds,
// then turns into the next.
//
// - Smooth: the animation glides toward the scroll position, so wheel steps and jumps
//   play as one continuous movement. Each transition eases in and out.
// - Never half-way: when scrolling stops inside a transition, the page finishes it in the
//   direction of travel (the header's own collapse settles the same way).
// - Each part gets --in and --out (0 → 1, eased) to drive its own movement.
//
// Flow mode drops the pinning and shows every part finished, one after another: with
// reduced motion, and when the stage is shorter than any part is laid out for (large
// zoom, a phone on its side), so nothing is ever cut off.
//
// Keyboard focus landing in a part that is not showing brings the story to that part.
export function useStoryProgress(
  rootRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
  length: number,
  reducedMotion: boolean,
) {
  const [tooShort, setTooShort] = useState(false);
  const flow = reducedMotion || tooShort;

  const geometry = useCallback((): Geometry | null => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || length <= 0) return null;
    const range = useNavigation.getState().collapsedSectionTop;
    const travel = root.offsetHeight - stage.offsetHeight - range;
    if (travel <= 0) return null;
    return { range, unit: travel / length };
  }, [rootRef, stageRef, length]);

  // Shows the story at a scroll position.
  const render = useCallback(
    (y: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const parts = partsOf(stage);
      const sizes = flow ? null : geometry();
      if (!sizes) {
        parts.forEach((part) => {
          part.style.removeProperty("--in");
          part.style.removeProperty("--out");
          part.removeAttribute("data-current");
        });
        return;
      }
      const collapse = sizes.range > 0 ? clamp(y / sizes.range, 0, 1) : 1;
      const story = clamp((y - sizes.range) / sizes.unit, 0, length);
      // The part that takes pointer input: the one holding, or past the middle of its
      // entrance.
      const current = Math.min(
        parts.length - 1,
        Math.floor(story + STORY_TRANSITION / 2),
      );
      parts.forEach((part, index) => {
        const { enter, exit } = partProgress(index, story, collapse);
        part.style.setProperty("--in", enter.toFixed(4));
        part.style.setProperty("--out", exit.toFixed(4));
        part.toggleAttribute("data-current", index === current);
      });
    },
    [stageRef, flow, geometry, length],
  );

  // Glide toward the scroll position, frame by frame, until caught up.
  useEffect(() => {
    let shown = window.scrollY;
    let frame = 0;
    let last = 0;

    function step(now: number) {
      const target = window.scrollY;
      const elapsed = last ? now - last : 16;
      last = now;
      shown += (target - shown) * (1 - Math.exp(-elapsed / STORY_SMOOTHING));
      if (Math.abs(target - shown) < 0.5) shown = target;
      render(shown);
      frame = shown === target ? 0 : requestAnimationFrame(step);
      if (!frame) last = 0;
    }

    function start() {
      if (!frame) frame = requestAnimationFrame(step);
    }

    function jump() {
      shown = window.scrollY;
      render(shown);
    }

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", jump);
    jump();
    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", jump);
      cancelAnimationFrame(frame);
    };
  }, [render]);

  // Never rest inside a transition between parts: finish it in the direction of travel.
  useEffect(() => {
    if (flow) return;
    const hasScrollEnd = "onscrollend" in window;
    let lastY = window.scrollY;
    let direction = 0;
    let touching = false;
    let timer = 0;

    function settle() {
      const sizes = geometry();
      if (!sizes || touching) return;
      const story = (window.scrollY - sizes.range) / sizes.unit;
      const part = Math.floor(story);
      const within = story - part;
      const inTransition =
        story > 0 && within > STORY_HOLD + 0.001 && within < 0.999;
      if (!inTransition || part + 1 > length) return;
      const target = direction < 0 ? part + STORY_HOLD : part + 1;
      window.scrollTo({
        top: sizes.range + target * sizes.unit,
        behavior: "smooth",
      });
    }

    function scheduleSettle() {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, SETTLE_DELAY);
    }

    function handleScroll() {
      const y = window.scrollY;
      if (y !== lastY) direction = Math.sign(y - lastY);
      lastY = y;
      if (!hasScrollEnd) scheduleSettle();
    }

    function handleTouchStart() {
      touching = true;
    }

    function handleTouchEnd() {
      touching = false;
      if (!hasScrollEnd) scheduleSettle();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    if (hasScrollEnd) window.addEventListener("scrollend", settle);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("scrollend", settle);
    };
  }, [flow, geometry, length]);

  // Flow mode when the stage would be too short for any part's layout (large zoom, a
  // phone on its side). Decided from the window alone, never from content, so it cannot
  // flip back and forth; every part's layout scales to fit any stage at least this tall.
  useEffect(() => {
    function check() {
      const compact =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-compact-height",
          ),
        ) || 0;
      setTooShort(window.innerHeight - compact < MIN_STAGE_HEIGHT);
    }
    window.addEventListener("resize", check);
    // The compact header's height is measured after the first layout.
    const frame = requestAnimationFrame(check);
    check();
    return () => {
      window.removeEventListener("resize", check);
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      if (flow) return;
      const part = (event.target as Element).closest<HTMLElement>(
        "[data-part-index]",
      );
      const sizes = geometry();
      if (!part || !sizes) return;
      const index = Number(part.dataset.partIndex);
      const story = (window.scrollY - sizes.range) / sizes.unit;
      if (story >= index && story <= index + STORY_HOLD) return;
      window.scrollTo({
        top: sizes.range + index * sizes.unit,
        behavior: "smooth",
      });
    },
    [flow, geometry],
  );

  return { flow, handleFocus };
}
