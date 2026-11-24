import styles from "./ArchitectureExplorerChaos.module.scss";

interface ArchitectureExplorerChaosProps {
  on: boolean;
  label: string; // "Chaos: take it down"
  statusLabel: string; // "System"
  status: string;
  degraded: boolean;
  onToggle: () => void;
}

// The chaos switch, which takes the chosen part down, and the system's status beside
// it. The status is announced when it changes.
function ArchitectureExplorerChaos({
  on,
  label,
  statusLabel,
  status,
  degraded,
  onToggle,
}: ArchitectureExplorerChaosProps) {
  return (
    <div className={styles.chaos}>
      <button
        type="button"
        role="switch"
        className={styles.switch}
        aria-checked={on}
        onClick={onToggle}
      >
        <span className={styles.track} aria-hidden="true">
          <span className={styles.knob} />
        </span>
        <span>{label}</span>
      </button>
      <p
        className={styles.status}
        role="status"
        data-degraded={degraded ? "" : undefined}
      >
        <span className={styles.light} aria-hidden="true" />
        <span className={styles.statusLabel}>{statusLabel}:</span> {status}
      </p>
    </div>
  );
}

export default ArchitectureExplorerChaos;
