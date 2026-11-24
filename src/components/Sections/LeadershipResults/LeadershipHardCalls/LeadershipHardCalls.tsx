import { useId, useState, type CSSProperties } from "react";
import {
  LEADERSHIP_HARD_CALLS,
  LEADERSHIP_PARTS,
} from "../../../../content/leadershipResults";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";
import { useRovingTabs } from "../../../../hooks/useRovingTabs";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import LeadershipSky from "../LeadershipSky/LeadershipSky";
import LeadershipHardCallsSteps from "./LeadershipHardCallsSteps/LeadershipHardCallsSteps";
import LeadershipHardCallsTrail from "./LeadershipHardCallsTrail/LeadershipHardCallsTrail";
import styles from "./LeadershipHardCalls.module.scss";

// Hard calls, as a climb through a storm. Each story is a storm on the trail: the
// situation, the call James made and the summit it reached.
//
// Enters: the storm sky drops like a curtain, storm clouds roll in over the mountain
// from both sides, the trail draws up toward the summit and the story's steps slide in
// one by one; then the clouds part and the sun breaks through behind the summit.
// Leaves: the steps slide away, the clouds close back in over the mountain, the scene
// sinks and the curtain lifts.
//
// Choosing a story sends a climber up the trail, past the storm and the call to the
// summit, lighting each step as it passes.
function LeadershipHardCalls({ index }: StoryPartProps) {
  const { heading } = LEADERSHIP_PARTS.hardCalls;
  const { tag, stories, storiesLabel, steps } = LEADERSHIP_HARD_CALLS;
  const reducedMotion = useReducedMotion();
  const baseId = useId();
  const panelId = `${baseId}-story`;
  const tabIdFor = (position: number) => `${baseId}-marker-${position}`;
  const [selected, setSelected] = useState(0);
  const [climbs, setClimbs] = useState(0);
  const { refFor, onKeyDown } = useRovingTabs(stories.length, selected, select);

  function select(position: number) {
    if (position === selected) return;
    setSelected(position);
    setClimbs((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="hard-calls" className={styles.part}>
      <LeadershipSky className={styles.sky} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <div
          className={styles.markers}
          role="tablist"
          aria-label={storiesLabel}
        >
          {stories.map((story, position) => (
            <button
              key={story.id}
              ref={refFor(position)}
              id={tabIdFor(position)}
              type="button"
              role="tab"
              className={styles.marker}
              aria-selected={position === selected}
              aria-controls={panelId}
              tabIndex={position === selected ? 0 : -1}
              style={{ "--order": position } as CSSProperties}
              onClick={() => select(position)}
              onKeyDown={onKeyDown}
            >
              {story.short}
            </button>
          ))}
        </div>
        <div className={styles.stepsSlot}>
          <LeadershipHardCallsSteps
            id={panelId}
            labelledBy={tabIdFor(selected)}
            story={stories[selected]}
            stepLabels={steps}
            climb={climbs}
          />
        </div>
        <div className={styles.trailSlot}>
          <LeadershipHardCallsTrail climb={climbs} animate={!reducedMotion} />
        </div>
      </div>
    </StoryPart>
  );
}

export default LeadershipHardCalls;
