import { useId, type CSSProperties } from "react";
import type { MagicScenario } from "../../../../../content/architectureExpertise";
import { useRovingTabs } from "../../../../../hooks/useRovingTabs";
import styles from "./ArchitectureMagicControls.module.scss";

interface ArchitectureMagicControlsProps {
  magic: boolean;
  scenario: MagicScenario;
  labels: {
    magic: string;
    scenarios: string;
  };
  scenarios: Record<MagicScenario, string>;
  scenariosShort: Record<MagicScenario, string>; // phones
  onToggle: () => void;
  onScenario: (scenario: MagicScenario) => void;
}

// The magic switch (the naive design against the designed one) and what the server
// does, as a radio group.
function ArchitectureMagicControls({
  magic,
  scenario,
  labels,
  scenarios,
  scenariosShort,
  onToggle,
  onScenario,
}: ArchitectureMagicControlsProps) {
  const labelId = useId();
  const ids = Object.keys(scenarios) as MagicScenario[];
  const selected = ids.indexOf(scenario);
  const { refFor, onKeyDown } = useRovingTabs(ids.length, selected, (index) =>
    onScenario(ids[index]),
  );

  return (
    <div className={styles.controls}>
      <button
        type="button"
        role="switch"
        className={styles.switch}
        aria-checked={magic}
        onClick={onToggle}
      >
        <span className={styles.track} aria-hidden="true">
          <span className={styles.knob} />
        </span>
        <span>{labels.magic}</span>
      </button>
      <div className={styles.group}>
        <p className={styles.label} id={labelId}>
          {labels.scenarios}
        </p>
        <div
          className={styles.options}
          role="radiogroup"
          aria-labelledby={labelId}
        >
          {ids.map((id, index) => (
            <button
              key={id}
              ref={refFor(index)}
              type="button"
              role="radio"
              className={styles.option}
              aria-checked={id === scenario}
              tabIndex={id === scenario ? 0 : -1}
              style={{ "--order": index } as CSSProperties}
              onClick={() => onScenario(id)}
              onKeyDown={onKeyDown}
            >
              <span className={styles.long}>{scenarios[id]}</span>
              <span className={styles.short}>{scenariosShort[id]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArchitectureMagicControls;
