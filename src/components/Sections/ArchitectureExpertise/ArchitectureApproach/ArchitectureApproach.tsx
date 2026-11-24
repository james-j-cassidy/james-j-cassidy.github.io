import { useId, useState } from "react";
import {
  ARCHITECTURE_APPROACH,
  ARCHITECTURE_PARTS,
  type DesignStage,
  type DesignTrait,
} from "../../../../content/architectureExpertise";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import ArchitectureApproachBackdrop from "./ArchitectureApproachBackdrop/ArchitectureApproachBackdrop";
import ArchitectureApproachBoard from "./ArchitectureApproachBoard/ArchitectureApproachBoard";
import ArchitectureApproachTraits from "./ArchitectureApproachTraits/ArchitectureApproachTraits";
import ArchitectureApproachViewport from "./ArchitectureApproachViewport/ArchitectureApproachViewport";
import styles from "./ArchitectureApproach.module.scss";

// How James designs systems, as an agile loop on a circuit board. Six stages are chips
// wired in order to a ship terminal: discover how the system will be used (its inputs,
// expected results and measures of success), set measurable quality goals, model just
// enough UML and ERD, decide and record the trade-offs, spike unproven technology and
// mock up the experience with users. The last two run only when the project needs them.
// A feedback trace runs from shipping back into discovery: each lap is an iteration.
//
// Enters: the copper opens as a circle from the route's start, the title slides in from
// the reading start, the board swings up from lying flat, the chips are dealt onto it
// one by one, the route and its feedback loop draw along them, the screen swings open like a door and the
// project's switches rise from below.
// Leaves: the chips spin off last first, the route is erased from the start, the screen
// swings shut, the switches sink, the board swings up and over and the title slides off
// the far side as the copper closes.
//
// Choosing a chip shows its stage on the screen and draws its diagram in. Turning a
// project trait off flips its stage's chip over to "Not needed", reroutes the trace
// around it and charges the ship terminal.
function ArchitectureApproach({ index }: StoryPartProps) {
  const { heading } = ARCHITECTURE_PARTS.approach;
  const {
    tag,
    stages,
    traits,
    traitsLabel,
    stage: stageNumber,
    ...labels
  } = ARCHITECTURE_APPROACH;
  const baseId = useId();
  const panelId = `${baseId}-stage`;
  const tabIdFor = (position: number) => `${baseId}-chip-${position}`;
  const [selected, setSelected] = useState(0);
  const [stageChanges, setStageChanges] = useState(0);
  const [routeChanges, setRouteChanges] = useState(0);
  const [values, setValues] = useState<Record<DesignTrait, boolean>>({
    unproven: true,
    interface: true,
  });
  const running = stages.map((stage: DesignStage) =>
    stage.when ? values[stage.when] : true,
  );

  function select(position: number) {
    if (position === selected) return;
    setSelected(position);
    setStageChanges((count) => count + 1);
  }

  function toggle(trait: DesignTrait) {
    setValues((current) => ({ ...current, [trait]: !current[trait] }));
    setRouteChanges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="approach" className={styles.part}>
      <ArchitectureApproachBackdrop />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <div className={styles.boardSlot}>
          <ArchitectureApproachBoard
            stages={stages}
            running={running}
            selected={selected}
            changes={routeChanges}
            tabIdFor={tabIdFor}
            panelId={panelId}
            labels={{
              stages: labels.stagesLabel,
              skipped: labels.skipped,
              build: labels.build,
              buildLabel: labels.buildLabel,
              loop: labels.loop,
              route: labels.route,
            }}
            numberFor={(position) => String(position + 1).padStart(2, "0")}
            onSelect={select}
          />
        </div>
        <div className={styles.traitsSlot}>
          <ArchitectureApproachTraits
            label={traitsLabel}
            traits={traits}
            values={values}
            onToggle={toggle}
          />
        </div>
        <div className={styles.screenSlot}>
          <ArchitectureApproachViewport
            id={panelId}
            labelledBy={tabIdFor(selected)}
            stage={stages[selected]}
            number={stageNumber(selected + 1)}
            running={running[selected]}
            change={stageChanges}
            labels={{
              outputs: labels.outputsLabel,
              activeState: labels.activeState,
              skippedState: labels.skippedState,
            }}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default ArchitectureApproach;
