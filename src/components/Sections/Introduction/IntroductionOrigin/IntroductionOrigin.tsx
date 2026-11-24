import { useId, useState } from "react";
import {
  INTRODUCTION_ORIGIN,
  INTRODUCTION_PARTS,
} from "../../../../content/introduction";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";
import { earnAchievement } from "../../../../state/introductionProgress";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import IntroductionOriginBriefing from "./IntroductionOriginBriefing/IntroductionOriginBriefing";
import IntroductionOriginMap from "./IntroductionOriginMap/IntroductionOriginMap";
import IntroductionOriginRadar from "./IntroductionOriginRadar/IntroductionOriginRadar";
import styles from "./IntroductionOrigin.module.scss";

// Where it started, as a flight log. A tactical radar fills the stage; over it, a flight
// display with the route through James's milestones and a mission briefing.
//
// Enters (as the opening swings away): the radar pings open from its center, the display
// rises off the floor upright, the route draws in with each waypoint switching on as the
// route reaches it, and the jet flies in. The briefing slides in from the far side.
// Leaves: the jet peels off the top of the screen, the display folds back down flat and
// the radar closes to a point.
//
// Choosing a waypoint flies the jet along the route to it, sends one radar sweep around,
// and turns the briefing to that milestone.
function IntroductionOrigin({ index }: StoryPartProps) {
  const { heading } = INTRODUCTION_PARTS.origin;
  const { tag, waypoints, waypoint, reached, previous, next, milestones } =
    INTRODUCTION_ORIGIN;
  const reducedMotion = useReducedMotion();
  const baseId = useId();
  const panelId = `${baseId}-briefing`;
  const tabIdFor = (position: number) => `${baseId}-waypoint-${position}`;
  const numberFor = (position: number) => String(position + 1).padStart(2, "0");
  const [selected, setSelected] = useState(0);
  const [changes, setChanges] = useState(0);

  function select(position: number) {
    if (position === selected) return;
    earnAchievement("origin");
    setSelected(position);
    setChanges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="origin" className={styles.part}>
      <IntroductionOriginRadar sweep={changes} />
      <div className={styles.display}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <div className={styles.screen}>
          <IntroductionOriginMap
            milestones={milestones}
            selected={selected}
            tabIdFor={tabIdFor}
            panelId={panelId}
            waypointsLabel={waypoints}
            numberFor={numberFor}
            reducedMotion={reducedMotion}
            onSelect={select}
          />
        </div>
        <div className={styles.briefingSlot}>
          <IntroductionOriginBriefing
            id={panelId}
            labelledBy={tabIdFor(selected)}
            milestone={milestones[selected]}
            number={waypoint(selected + 1)}
            reachedLabel={reached}
            previousLabel={previous}
            nextLabel={next}
            hasPrevious={selected > 0}
            hasNext={selected < milestones.length - 1}
            change={changes}
            onPrevious={() => select(selected - 1)}
            onNext={() => select(selected + 1)}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default IntroductionOrigin;
