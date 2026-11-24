import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useNavigation } from "../state/navigation";
import { useReducedMotion } from "./useReducedMotion";

// Point in the shrink (0 = full, 1 = compact) where the main body swaps to its compact
// layout. The full layout has faded out by then and the compact one fades in after, so
// the swap itself is never seen.
const SWAP_AT = 0.85;

// Where scrollend is missing: how long scrolling must pause before the collapse settles.
const SETTLE_DELAY = 150; // ms

interface Metrics {
  expanded: number; // whole header, full
  mainFull: number; // main body, full
  mainCompact: number; // main body, compact
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Shrinks the header's main body as the visitor scrolls into a section.
//
// The header is fixed: the top bar never moves, and the tab bar stays attached under the
// main body. A spacer holds the full header's height in the page, and the main body loses
// exactly as much height as the page has scrolled, so the section's top stays pinned just
// under the tab bar the whole way. Once the main body reaches its compact height, the
// section scrolls on under the header as usual.
//
// Scrolling never leaves the header part-way: when it stops inside the shrink, the page
// finishes the move in the direction of travel.
//
// With reduced motion, nothing shrinks or fades: the header swaps to compact in one step
// at the point where the section's top meets the compact header, so nothing jumps.
export function useHeaderCollapse(headerRef: RefObject<HTMLElement | null>) {
  const [expandedHeight, setExpandedHeight] = useState(0);
  const metrics = useRef<Metrics | null>(null);
  const reducedMotion = useReducedMotion();

  // Applies the current scroll position: main body height, content fade, compact layout.
  const apply = useCallback(() => {
    const header = headerRef.current;
    const sizes = metrics.current;
    if (!header || !sizes) return;
    const range = sizes.mainFull - sizes.mainCompact;
    if (range <= 0) return;

    const progress = clamp01(window.scrollY / range);
    const compact = reducedMotion ? progress >= 1 : progress >= SWAP_AT;
    const { headerCollapsed, setHeaderCollapsed } = useNavigation.getState();
    if (compact !== headerCollapsed) setHeaderCollapsed(compact);

    if (reducedMotion || progress === 0) {
      header.style.removeProperty("--main-body-height");
      header.style.removeProperty("--main-body-content-opacity");
      header.removeAttribute("data-shrinking");
      return;
    }

    const opacity = compact
      ? (progress - SWAP_AT) / (1 - SWAP_AT)
      : 1 - progress / SWAP_AT;
    header.style.setProperty(
      "--main-body-height",
      `${sizes.mainFull - progress * range}px`,
    );
    header.style.setProperty(
      "--main-body-content-opacity",
      clamp01(opacity).toFixed(3),
    );
    header.setAttribute("data-shrinking", "");
  }, [headerRef, reducedMotion]);

  // Measures the full and compact sizes. The header is briefly put in each state inside
  // one task, so the browser lays it out but never paints it.
  const measure = useCallback(() => {
    const header = headerRef.current;
    const mainBody = header?.querySelector<HTMLElement>(
      '[data-header-part="main-body"]',
    );
    if (!header || !mainBody) return;

    const savedHeight = header.style.getPropertyValue("--main-body-height");
    const wasCompact = header.hasAttribute("data-collapsed");
    header.style.removeProperty("--main-body-height");
    header.removeAttribute("data-collapsed");
    const expanded = header.getBoundingClientRect().height;
    const mainFull = mainBody.getBoundingClientRect().height;
    header.setAttribute("data-collapsed", "");
    const mainCompact = mainBody.getBoundingClientRect().height;
    if (!wasCompact) header.removeAttribute("data-collapsed");
    if (savedHeight)
      header.style.setProperty("--main-body-height", savedHeight);

    metrics.current = { expanded, mainFull, mainCompact };
    // For section stages: they pin just under the compact header, from the very top of
    // the page, and the full header covers them until it collapses.
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty(
      "--header-compact-height",
      `${expanded - (mainFull - mainCompact)}px`,
    );
    rootStyle.setProperty(
      "--header-collapse-range",
      `${Math.max(0, mainFull - mainCompact)}px`,
    );
    setExpandedHeight(expanded);
    // Rounded up: a jump there must land at or past the collapse's end (the browser
    // rounds the scroll position), or the collapse would settle back open.
    useNavigation
      .getState()
      .setCollapsedSectionTop(Math.ceil(Math.max(0, mainFull - mainCompact)));
    apply();
  }, [headerRef, apply]);

  // Measure on load and whenever the window size or text zoom changes.
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Follow the scroll position, at most once per frame.
  useEffect(() => {
    let frame = 0;
    function handleScroll() {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          apply();
        });
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [apply]);

  // Never rest part-way through the collapse: when scrolling stops inside it, finish the
  // move in the direction the visitor was scrolling (down collapses, up expands). The
  // finish is ordinary smooth scrolling, so the scroll-linked animation completes itself.
  // Waits for the gesture to end (scrollend; a short pause where that event is missing,
  // never while a finger is down). Reduced motion has no part-way state to settle.
  useEffect(() => {
    if (reducedMotion) return;
    const hasScrollEnd = "onscrollend" in window;
    let lastY = window.scrollY;
    let direction = 0;
    let touching = false;
    let timer = 0;

    function settle() {
      const sizes = metrics.current;
      if (!sizes || touching) return;
      const range = sizes.mainFull - sizes.mainCompact;
      const y = window.scrollY;
      // Within a pixel of either end counts as there (scroll positions are rounded).
      if (range <= 0 || y <= 0 || y >= range - 1) return;
      window.scrollTo({ top: direction < 0 ? 0 : range, behavior: "smooth" });
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
  }, [reducedMotion]);

  return { expandedHeight };
}
