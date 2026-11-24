import type { PlaybookStep } from "../../../../../content/architectureExpertise";
import styles from "./ArchitecturePlaybookStep.module.scss";

interface ArchitecturePlaybookStepProps {
  id: string;
  step: PlaybookStep;
  number: string; // "Step 3 of 6"
  moved: string; // "1 of 4 jobs in the cloud"
  safetyLabel: string;
  source: string;
  change: number; // one more per step; rescans the screen
}

// The current step of the migration: what happens, how it stays safe and how many jobs
// have moved. Announced as the slider moves; the source of the playbook underneath.
function ArchitecturePlaybookStep({
  id,
  step,
  number,
  moved,
  safetyLabel,
  source,
  change,
}: ArchitecturePlaybookStepProps) {
  return (
    <section id={id} className={styles.card} aria-live="polite">
      <div
        key={change}
        className={styles.sheet}
        data-scanned={change > 0 ? "" : undefined}
      >
        <div className={styles.header}>
          <p className={styles.number}>{number}</p>
          <p className={styles.moved}>{moved}</p>
        </div>
        <h4 className={styles.title}>{step.title}</h4>
        <p className={styles.body}>{step.body}</p>
        <div className={styles.safety}>
          <p className={styles.label}>{safetyLabel}</p>
          <p className={styles.text}>{step.safety}</p>
        </div>
      </div>
      <p className={styles.source}>{source}</p>
    </section>
  );
}

export default ArchitecturePlaybookStep;
