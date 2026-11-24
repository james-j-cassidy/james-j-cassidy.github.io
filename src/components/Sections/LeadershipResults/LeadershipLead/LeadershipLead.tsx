import { useId, useState } from "react";
import {
  LEADERSHIP_LEAD,
  LEADERSHIP_PARTS,
} from "../../../../content/leadershipResults";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import LeadershipSky from "../LeadershipSky/LeadershipSky";
import LeadershipLeadCard from "./LeadershipLeadCard/LeadershipLeadCard";
import LeadershipLeadElevator from "./LeadershipLeadElevator/LeadershipLeadElevator";
import LeadershipLeadPanel from "./LeadershipLeadPanel/LeadershipLeadPanel";
import styles from "./LeadershipLead.module.scss";

// How James leads: Elevator leadership. The whole team rides one glass elevator up
// through the dawn: everyone rises or falls together, nobody climbs a ladder over
// anybody. Each floor is part of the idea.
//
// Enters: the dawn sky opens upward from the horizon, the title drops in from above,
// the glass shaft rises into view, the car climbs up into it from below and its doors
// slide open on the team; the floor buttons light one by one and the card hinges up.
// Leaves: the doors close, the car rises on up out of the top of the shaft, the shaft
// closes after it, the buttons go dark, the card hinges away, the title lifts off and
// the sky closes back down to the horizon.
//
// Pressing a floor button closes the doors, carries the whole team to that floor and
// opens them again; the card tells what the floor means, with James's own example.
function LeadershipLead({ index }: StoryPartProps) {
  const { heading } = LEADERSHIP_PARTS.lead;
  const { tag, motto, floors, floorsLabel, floor, proofLabel } =
    LEADERSHIP_LEAD;
  const baseId = useId();
  const panelId = `${baseId}-floor`;
  const tabIdFor = (position: number) => `${baseId}-button-${position}`;
  const [selected, setSelected] = useState(0);
  const [rides, setRides] = useState(0);
  const [goingUp, setGoingUp] = useState(true);

  function select(position: number) {
    if (position === selected) return;
    setGoingUp(position > selected);
    setSelected(position);
    setRides((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="lead" className={styles.part}>
      <LeadershipSky className={styles.sky}>
        <span className={styles.horizonGlow} />
      </LeadershipSky>
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.motto}>{motto}</p>
        </header>
        <div className={styles.lift}>
          <LeadershipLeadPanel
            floors={floors}
            selected={selected}
            label={floorsLabel}
            tabIdFor={tabIdFor}
            panelId={panelId}
            onSelect={select}
          />
          <LeadershipLeadElevator
            floors={floors.length}
            selected={selected}
            floorId={floors[selected].id}
            ride={rides}
            goingUp={goingUp}
          />
        </div>
        <div className={styles.cardSlot}>
          <LeadershipLeadCard
            id={panelId}
            labelledBy={tabIdFor(selected)}
            floor={floors[selected]}
            position={floor(selected + 1)}
            proofLabel={proofLabel}
            change={rides}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default LeadershipLead;
