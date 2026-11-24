import { useState } from "react";
import {
  ARCHITECTURE_MAGIC,
  ARCHITECTURE_PARTS,
  type MagicScenario,
} from "../../../../content/architectureExpertise";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import ArchitectureMagicApp from "./ArchitectureMagicApp/ArchitectureMagicApp";
import ArchitectureMagicConsole from "./ArchitectureMagicConsole/ArchitectureMagicConsole";
import ArchitectureMagicControls from "./ArchitectureMagicControls/ArchitectureMagicControls";
import { useMagicDemo } from "./useMagicDemo";
import styles from "./ArchitectureMagic.module.scss";

// UX is a magic trick: James's principle that users believe what they are shown, and
// performance is the budget for the trick. Calm for users, loud for engineers: the
// trick is in the timing, never the truth.
//
// A stage: front of house, the app as the user sees it; backstage, the team's console.
// Adding a task saves it to a server that responds slowly, fails once, or stays down.
// Naive (magic off), the screen locks, the raw error lands on the user and the team
// hears nothing. With the magic, the task shows at once, failures are retried quietly,
// a real failure is told plainly and kept, and every step reaches the team.
//
// Enters: the blueprint opens as a circle from the stage's middle, the curtains slide
// in from the stage's edges, the title slides in from the reading start, the controls
// drop in, front of house slides in from the reading start and backstage from the far
// side. Leaves: the same, the way each came.
function ArchitectureMagic({ index }: StoryPartProps) {
  const { heading } = ARCHITECTURE_PARTS.magic;
  const labels = ARCHITECTURE_MAGIC;
  const [magic, setMagic] = useState(true);
  const [scenario, setScenario] = useState<MagicScenario>("blip");
  const { state, save, reset } = useMagicDemo(magic, scenario);

  function toggle() {
    setMagic((on) => !on);
    reset();
  }

  function choose(next: MagicScenario) {
    if (next === scenario) return;
    setScenario(next);
    reset();
  }

  return (
    <StoryPart index={index} name="magic" className={styles.part}>
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.curtain} />
        <span className={styles.curtain} />
      </div>
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{labels.tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.intro}>{labels.intro}</p>
        </header>
        <div className={styles.controlsSlot}>
          <ArchitectureMagicControls
            magic={magic}
            scenario={scenario}
            labels={{ magic: labels.magic, scenarios: labels.scenariosLabel }}
            scenarios={labels.scenarios}
            scenariosShort={labels.scenariosShort}
            onToggle={toggle}
            onScenario={choose}
          />
        </div>
        <div className={styles.userSlot}>
          <ArchitectureMagicApp
            state={state}
            magic={magic}
            labels={labels}
            onAdd={() => save()}
            onRetry={(task) => save(task)}
          />
        </div>
        <div className={styles.teamSlot}>
          <ArchitectureMagicConsole
            state={state}
            labels={{
              team: labels.teamLabel,
              idle: labels.teamIdle,
              silent: labels.teamSilent,
              took: labels.tookLabel,
              seconds: labels.seconds,
            }}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default ArchitectureMagic;
