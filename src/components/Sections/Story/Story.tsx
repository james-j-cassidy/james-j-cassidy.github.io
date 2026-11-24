import { Children, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useStoryProgress } from "../../../hooks/useStoryProgress";
import styles from "./Story.module.scss";
import { storyLength } from "./storyTiming";

interface StoryProps {
  children: ReactNode; // the parts (StoryPart), in order
}

// A section's scroll story. Nothing on the page scrolls: the stage is pinned under the
// header from the top, and scrolling only plays the parts' movement, forward and
// backward. The first part forms as the header collapses.
// Only the parts on stage are mounted, as the scroll reaches them (see useStoryProgress).
// With reduced motion, or on a stage too short for the layouts (large zoom), the parts
// flow one after another, all mounted.
function Story({ children }: StoryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const parts = Children.toArray(children);
  const length = storyLength(parts.length);
  const reducedMotion = useReducedMotion();
  const { flow, handleFocus, mounted } = useStoryProgress(
    rootRef,
    stageRef,
    length,
    parts.length,
    reducedMotion,
  );

  const timing = { "--story-length": length } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={styles.story}
      style={timing}
      data-flow={flow ? "" : undefined}
      onFocus={handleFocus}
    >
      <div ref={stageRef} className={styles.stage}>
        {parts.slice(mounted[0], mounted[1] + 1)}
      </div>
    </div>
  );
}

export default Story;
