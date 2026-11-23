import { useEffect, useRef, type PointerEvent } from "react";
import { SECTIONS, SECTION_LABELS } from "../../../content/sections";
import { useNavigation } from "../../../state/navigation";
import SectionPanel from "../SectionPanel/SectionPanel";
import styles from "./SectionDeck.module.scss";

// A swipe needs this much sideways travel, mostly sideways, within this time.
const SWIPE_MIN_DISTANCE = 60; // px
const SWIPE_MAX_DURATION = 600; // ms
const SWIPE_SIDEWAYS_RATIO = 1.5; // sideways travel must exceed 1.5 x vertical travel

interface SwipeStart {
  x: number;
  y: number;
  time: number;
}

// The six sections, one shown at a time, in story order (left to right).
// On touch devices a sideways swipe moves to the next or previous section (mirrored in
// right-to-left languages); vertical scrolling is untouched. The tabs move between
// sections everywhere. The incoming section slides in from the side it comes from.
function SectionDeck() {
  const sectionIndex = useNavigation((state) => state.sectionIndex);
  const direction = useNavigation((state) => state.direction);
  const showSection = useNavigation((state) => state.showSection);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const swipeStart = useRef<SwipeStart | null>(null);
  const isFirstRender = useRef(true);

  // Moving to a section puts focus on its heading (not on first load).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRefs.current[sectionIndex]?.focus({ preventScroll: true });
  }, [sectionIndex]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") return;
    swipeStart.current = {
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || event.pointerType !== "touch") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const isSwipe =
      Math.abs(dx) >= SWIPE_MIN_DISTANCE &&
      Math.abs(dx) > Math.abs(dy) * SWIPE_SIDEWAYS_RATIO &&
      event.timeStamp - start.time <= SWIPE_MAX_DURATION;
    if (!isSwipe) return;
    // Swiping toward the reading start reveals the next section.
    const isRtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = dx < 0 !== isRtl;
    showSection(sectionIndex + (forward ? 1 : -1));
  }

  function handlePointerCancel() {
    swipeStart.current = null;
  }

  return (
    <div
      className={styles.deck}
      data-direction={direction}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {SECTIONS.map((section, index) => (
        <SectionPanel
          key={section.id}
          id={section.id}
          title={section.label}
          placeholder={SECTION_LABELS.placeholder}
          hidden={index !== sectionIndex}
          headingRef={(element) => {
            headingRefs.current[index] = element;
          }}
        />
      ))}
    </div>
  );
}

export default SectionDeck;
