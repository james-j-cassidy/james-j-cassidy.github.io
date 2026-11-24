import type { DesignTrait } from "../../../../../content/architectureExpertise";
import styles from "./ArchitectureApproachTraits.module.scss";

interface ArchitectureApproachTraitsProps {
  label: string;
  traits: Record<DesignTrait, string>;
  values: Record<DesignTrait, boolean>;
  onToggle: (trait: DesignTrait) => void;
}

// The project's traits, as switches. Each one decides whether a conditional stage runs:
// turning one off flips its stage over on the board and reroutes around it.
function ArchitectureApproachTraits({
  label,
  traits,
  values,
  onToggle,
}: ArchitectureApproachTraitsProps) {
  return (
    <div className={styles.traits} role="group" aria-label={label}>
      <p className={styles.tag} aria-hidden="true">
        {label}
      </p>
      {(Object.keys(traits) as DesignTrait[]).map((trait) => (
        <button
          key={trait}
          type="button"
          role="switch"
          className={styles.switch}
          aria-checked={values[trait]}
          onClick={() => onToggle(trait)}
        >
          <span className={styles.track} aria-hidden="true">
            <span className={styles.knob} />
          </span>
          <span>{traits[trait]}</span>
        </button>
      ))}
    </div>
  );
}

export default ArchitectureApproachTraits;
