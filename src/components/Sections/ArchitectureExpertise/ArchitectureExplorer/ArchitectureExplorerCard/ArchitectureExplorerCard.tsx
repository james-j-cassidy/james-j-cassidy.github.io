import type { SystemNode } from "../../../../../content/architectureExpertise";
import styles from "./ArchitectureExplorerCard.module.scss";

interface ArchitectureExplorerCardProps {
  id: string;
  labelledBy: string; // the chosen part
  node: SystemNode;
  down: boolean; // chaos has taken this part down
  change: number; // one more per part chosen; rescans the screen
  labels: {
    role: string;
    failure: string;
    down: string;
  };
}

// The chosen part (the map's panel): why it is there, and how the system copes if it
// goes down, named by its resilience pattern. While chaos has it down, that half is lit.
function ArchitectureExplorerCard({
  id,
  labelledBy,
  node,
  down,
  change,
  labels,
}: ArchitectureExplorerCardProps) {
  return (
    <section
      id={id}
      className={styles.card}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
      data-down={down ? "" : undefined}
    >
      <div
        key={change}
        className={styles.sheet}
        data-scanned={change > 0 ? "" : undefined}
      >
        <h4 className={styles.title}>{node.title}</h4>
        <div className={styles.role}>
          <p className={styles.label}>{labels.role}</p>
          <p className={styles.text}>{node.role}</p>
        </div>
        <div className={styles.failure}>
          <p className={styles.label}>
            {labels.failure}
            {down && (
              <span className={styles.downNow}>
                {" "}
                <span aria-hidden="true">✕</span> {labels.down}
              </span>
            )}
          </p>
          <p className={styles.pattern}>{node.failure.pattern}</p>
          <p className={styles.text}>{node.failure.text}</p>
        </div>
      </div>
    </section>
  );
}

export default ArchitectureExplorerCard;
