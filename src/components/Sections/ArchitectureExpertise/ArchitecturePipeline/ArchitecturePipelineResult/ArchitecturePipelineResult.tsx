import styles from "./ArchitecturePipelineResult.module.scss";

interface ArchitecturePipelineResultProps {
  id: string;
  headline: string | null; // null: nothing sent yet
  caught: boolean;
  text: string;
  proofLabel: string;
  proof: string;
  source: string;
  run: number; // one more per change sent; rescans the screen
}

// What happened to the change just sent (announced as it changes), and the same idea
// at work: the fast lane James introduced.
function ArchitecturePipelineResult({
  id,
  headline,
  caught,
  text,
  proofLabel,
  proof,
  source,
  run,
}: ArchitecturePipelineResultProps) {
  return (
    <section id={id} className={styles.card}>
      <div
        key={run}
        className={styles.sheet}
        aria-live="polite"
        data-scanned={run > 0 ? "" : undefined}
      >
        {headline && (
          <p className={styles.headline} data-caught={caught ? "" : undefined}>
            <span aria-hidden="true">{caught ? "✕" : "✓"}</span> {headline}
          </p>
        )}
        <p className={styles.text}>{text}</p>
      </div>
      <div className={styles.proof}>
        <p className={styles.proofLabel}>{proofLabel}</p>
        <p className={styles.proofText}>{proof}</p>
        <p className={styles.source}>{source}</p>
      </div>
    </section>
  );
}

export default ArchitecturePipelineResult;
