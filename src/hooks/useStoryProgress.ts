import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
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
//
// Only the parts on stage are mounted: the one holding, and while a transition plays,
// the one leaving and the one arriving. The story reports which (`mounted`, first and
// last index) and mounts parts as the scroll reaches them; a part that has left, or has
// not arrived, is not in the page at all, so nothing of it can show. Flow mode mounts
// every part.
export function useStoryProgress(
  rootRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
  length: number,
  count: number, // how many parts the story has
  reducedMotion: boolean,
) {
  const [tooShort, setTooShort] = useState(false);
  const flow = reducedMotion || tooShort;
  const [mounted, setMounted] = useState<readonly [number, number]>([0, 0]);
  const shownRef = useRef(0); // the scroll position last shown
  const snapRef = useRef(false); // the next scroll is a jump: show it at once
  // A part landing as the header collapses (a deep link from the full header): until the
  // collapse ends it forms in the first part's place.
  const landingRef = useRef<number | null>(null);

  const geometry = useCallback((): Geometry | null => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || length <= 0) return null;
    const range = useNavigation.getState().collapsedSectionTop;
    const travel = root.offsetHeight - stage.offsetHeight - range;
    if (travel <= 0) return null;
    return { range, unit: travel / length };
  }, [rootRef, stageRef, length]);

  // Shows the story at a scroll position: mounts the parts on stage and gives each its
  // progress.
  const render = useCallback(
    (y: number) => {
      shownRef.current = y;
      const stage = stageRef.current;
      if (!stage) return;
      const parts = partsOf(stage);
      const sizes = flow ? null : geometry();
      if (!sizes) {
        stage.style.removeProperty("--opening");
        // Flow mode shows every part; a story that cannot be measured (its section is
        // hidden) keeps what it has, so nothing extra mounts while it is away.
        if (flow) {
          setMounted((now) =>
            now[0] === 0 && now[1] === count - 1 ? now : [0, count - 1],
          );
        }
        parts.forEach((part) => {
          part.style.removeProperty("--in");
          part.style.removeProperty("--out");
          part.removeAttribute("data-current");
          part.removeAttribute("data-away");
        });
        return;
      }
      const collapse = sizes.range > 0 ? clamp(y / sizes.range, 0, 1) : 1;
      // How far the header has collapsed (0 → 1), for the story's prologue. Once the
      // header starts to collapse the prologue leaves the keyboard's reach, and once it
      // has slid away it stops drawing (its scene's loops pause).
      stage.style.setProperty("--opening", collapse.toFixed(4));
      stage
        .querySelector("[data-prologue]")
        ?.toggleAttribute("inert", collapse > 0);
      stage.toggleAttribute("data-opened", collapse >= 0.5);
      const landing = landingRef.current;
      if (landing !== null) {
        // Only the landing part, forming with the collapse as the first part would.
        const { enter } = partProgress(0, 0, collapse);
        setMounted((now) =>
          now[0] === landing && now[1] === landing ? now : [landing, landing],
        );
        parts.forEach((part) => {
          const here = Number(part.dataset.partIndex) === landing;
          part.style.setProperty("--in", (here ? enter : 0).toFixed(4));
          part.style.setProperty("--out", "0");
          part.toggleAttribute("data-current", here);
          part.toggleAttribute("data-away", !here || enter === 0);
        });
        return;
      }
      const story = clamp((y - sizes.range) / sizes.unit, 0, length);
      // The part that takes pointer input: the one holding, or past the middle of its
      // entrance.
      const current = Math.min(
        count - 1,
        Math.floor(story + STORY_TRANSITION / 2),
      );
      // On stage: the current part, and any part part-way in or out.
      let first = current;
      let last = current;
      for (let index = 0; index < count; index += 1) {
        const { enter, exit } = partProgress(index, story, collapse);
        if (enter > 0 && exit < 1) {
          first = Math.min(first, index);
          last = Math.max(last, index);
        }
      }
      setMounted((now) =>
        now[0] === first && now[1] === last ? now : [first, last],
      );
      parts.forEach((part) => {
        const index = Number(part.dataset.partIndex);
        const { enter, exit } = partProgress(index, story, collapse);
        part.style.setProperty("--in", enter.toFixed(4));
        part.style.setProperty("--out", exit.toFixed(4));
        part.toggleAttribute("data-current", index === current);
        // Not arrived at all, or wholly gone: hidden outright, whatever its own
        // styles leave on stage.
        part.toggleAttribute("data-away", enter === 0 || exit === 1);
      });
    },
    [stageRef, flow, geometry, length, count],
  );

  // A part just mounted takes its progress before it is ever painted.
  useLayoutEffect(() => {
    render(shownRef.current);
  }, [mounted, render]);

  // Only the story in the section showing listens to the scroll: the hidden sections'
  // stories sleep (no listeners, no frames) until their section is shown again.
  const sectionIndex = useNavigation((state) => state.sectionIndex);
  const isHidden = useCallback(
    () => Boolean(rootRef.current?.closest("section")?.hidden),
    [rootRef],
  );

  // Glide toward the scroll position, frame by frame, until caught up.
  useEffect(() => {
    if (isHidden()) return;
    let shown = window.scrollY;
    let frame = 0;
    let last = 0;

    function step(now: number) {
      const target = window.scrollY;
      if (snapRef.current) {
        snapRef.current = false;
        shown = target;
      }
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

    // The story's own size changes too when its section is shown (hidden, it cannot be
    // measured): show it as it now is.
    const resized = new ResizeObserver(jump);
    if (rootRef.current) resized.observe(rootRef.current);

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", jump);
    jump();
    return () => {
      resized.disconnect();
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", jump);
      cancelAnimationFrame(frame);
    };
  }, [render, rootRef, isHidden, sectionIndex]);

  // Never rest inside a transition between parts: finish it in the direction of travel.
  useEffect(() => {
    if (flow || isHidden()) return;
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
  }, [flow, geometry, length, isHidden, sectionIndex]);

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

  // Straight to a part (a deep link), without playing the parts in between. With the
  // header collapsed, the page jumps there and the story shows it at once. With the full
  // header showing, the header collapses in one smooth scroll while the part forms in the
  // first part's place; when the collapse ends the page moves to the part's own place,
  // where it already shows exactly as it is. In flow mode the page scrolls to it.
  const goTo = useCallback(
    (index: number) => {
      const sizes = flow ? null : geometry();
      if (!sizes) {
        stageRef.current
          ?.querySelector<HTMLElement>(`[data-part-index="${index}"]`)
          ?.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
      const top = sizes.range + index * sizes.unit;

      function arrive() {
        snapRef.current = true;
        window.scrollTo({ top, behavior: "instant" });
        render(top);
      }

      if (window.scrollY >= sizes.range - 1) {
        arrive();
        return;
      }

      landingRef.current = index;
      render(window.scrollY);
      window.scrollTo({ top: sizes.range, behavior: "smooth" });

      // When the collapse's scroll ends: on to the part's place, unless the visitor
      // scrolled away meanwhile.
      let done = false;
      function finish(event?: Event) {
        // A scroll that ended short of the collapse (the tab change's own jump to
        // the top) is not this one.
        if (done || (event && sizes && window.scrollY < sizes.range - 1))
          return;
        done = true;
        window.removeEventListener("scrollend", finish);
        window.clearTimeout(timer);
        landingRef.current = null;
        if (sizes && window.scrollY >= sizes.range - 1) arrive();
        else render(window.scrollY);
      }
      window.addEventListener("scrollend", finish);
      // Where scrollend is missing, or the visitor scrolled back up meanwhile.
      const timer = window.setTimeout(() => finish(), 1500);
    },
    [flow, geometry, render, stageRef],
  );

  return { flow, handleFocus, mounted, goTo };
}
