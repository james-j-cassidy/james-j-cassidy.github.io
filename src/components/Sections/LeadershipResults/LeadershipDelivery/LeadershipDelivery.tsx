import { useId, useState } from "react";
import {
  LEADERSHIP_DELIVERY,
  LEADERSHIP_PARTS,
} from "../../../../content/leadershipResults";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import LeadershipSky from "../LeadershipSky/LeadershipSky";
import LeadershipDeliveryCard from "./LeadershipDeliveryCard/LeadershipDeliveryCard";
import LeadershipDeliveryWheel from "./LeadershipDeliveryWheel/LeadershipDeliveryWheel";
import styles from "./LeadershipDelivery.module.scss";

const STEP_ANGLE = (count: number) => 360 / count;

// Leading delivery, as a flywheel: five habits on its rim, and every turn builds
// momentum.
//
// Enters: the sky wipes in behind it from the reading start as the flywheel rolls in
// from that side, turning as it comes; the title drops in and the card swings open like
// a door.
// Leaves: the flywheel rolls on and off the far side, the card swings shut, the title
// lifts away and the sky wipes off after the wheel.
//
// Choosing a habit turns the wheel the short way round to bring it to the marker at the
// top, and the card tells what it is and what it delivered.
function LeadershipDelivery({ index }: StoryPartProps) {
  const { heading } = LEADERSHIP_PARTS.delivery;
  const { tag, steps, stepsLabel, hubValue, hubLabel } = LEADERSHIP_DELIVERY;
  const baseId = useId();
  const panelId = `${baseId}-habit`;
  const tabIdFor = (position: number) => `${baseId}-rim-${position}`;
  const [selected, setSelected] = useState(0);
  const [spin, setSpin] = useState(0); // degrees turned by choices so far
  const [changes, setChanges] = useState(0);

  function select(position: number) {
    if (position === selected) return;
    const step = STEP_ANGLE(steps.length);
    // The short way round: the change in place, wrapped to within half a turn.
    let delta = (position - selected) % steps.length;
    if (delta > steps.length / 2) delta -= steps.length;
    if (delta < -steps.length / 2) delta += steps.length;
    setSpin((turned) => turned - delta * step);
    setSelected(position);
    setChanges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="delivery" className={styles.part}>
      <LeadershipSky className={styles.sky} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <div className={styles.wheelSlot}>
          <LeadershipDeliveryWheel
            steps={steps}
            selected={selected}
            spin={spin}
            label={stepsLabel}
            hubValue={hubValue}
            hubLabel={hubLabel}
            tabIdFor={tabIdFor}
            panelId={panelId}
            onSelect={select}
          />
        </div>
        <div className={styles.cardSlot}>
          <LeadershipDeliveryCard
            id={panelId}
            labelledBy={tabIdFor(selected)}
            step={steps[selected]}
            change={changes}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default LeadershipDelivery;
