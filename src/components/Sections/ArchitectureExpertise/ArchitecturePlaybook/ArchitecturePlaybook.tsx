import { useId, useState, type CSSProperties } from "react";
import {
  ARCHITECTURE_PARTS,
  ARCHITECTURE_PLAYBOOK,
} from "../../../../content/architectureExpertise";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import ArchitecturePlaybookScene from "./ArchitecturePlaybookScene/ArchitecturePlaybookScene";
import ArchitecturePlaybookStep from "./ArchitecturePlaybookStep/ArchitecturePlaybookStep";
import styles from "./ArchitecturePlaybook.module.scss";

// Modernization playbook: the strangler fig pattern, played with a slider. A legacy
// desktop app and its database move to a cloud platform one job at a time, behind a
// facade, until the old system can be archived and switched off.
//
// Enters: the blueprint opens as a circle from the scene, the title slides in from the
// reading start, the users drop in, the legacy app slides in from the start side and the
// cloud from the far side, the routes draw down from the users; the slider and the
// step's screen rise from below.
// Leaves: the routes are erased, the systems slide off the way they came, the users
// lift, the slider and screen sink and the blueprint closes.
//
// Moving the slider plays the migration forward or back: the facade drops in, jobs slide
// across, traffic follows them, the databases sync and the fig grows.
function ArchitecturePlaybook({ index }: StoryPartProps) {
  const { heading } = ARCHITECTURE_PARTS.playbook;
  const {
    tag,
    intro,
    steps,
    jobs,
    sliderLabel,
    stepOf,
    jobsMoved,
    safetyLabel,
    source,
    ...labels
  } = ARCHITECTURE_PLAYBOOK;
  const baseId = useId();
  const sliderId = `${baseId}-slider`;
  const stepId = `${baseId}-step`;
  const [current, setCurrent] = useState(0);
  const [changes, setChanges] = useState(0);
  const step = steps[current];
  const number = stepOf(current + 1, steps.length);

  function move(next: number) {
    if (next === current) return;
    setCurrent(next);
    setChanges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="playbook" className={styles.part}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.intro}>{intro}</p>
        </header>
        <div className={styles.sceneSlot}>
          <ArchitecturePlaybookScene step={step} jobs={jobs} labels={labels} />
        </div>
        <div className={styles.sliderSlot}>
          <label className={styles.sliderLabel} htmlFor={sliderId}>
            {sliderLabel}
          </label>
          <input
            id={sliderId}
            className={styles.slider}
            type="range"
            min={0}
            max={steps.length - 1}
            step={1}
            value={current}
            aria-valuetext={`${number}: ${step.title}`}
            aria-controls={stepId}
            style={{ "--fill": current / (steps.length - 1) } as CSSProperties}
            onChange={(event) => move(Number(event.target.value))}
          />
          <ol className={styles.ticks} aria-hidden="true">
            {steps.map((item, position) => (
              <li
                key={item.title}
                data-reached={position <= current ? "" : undefined}
              >
                {position + 1}
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.stepSlot}>
          <ArchitecturePlaybookStep
            id={stepId}
            step={step}
            number={number}
            moved={jobsMoved(step.moved, jobs.length)}
            safetyLabel={safetyLabel}
            source={source}
            change={changes}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default ArchitecturePlaybook;
