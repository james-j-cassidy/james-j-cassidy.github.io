import type { DemoState } from "../useMagicDemo";
import styles from "./ArchitectureMagicConsole.module.scss";

interface ArchitectureMagicConsoleProps {
  state: DemoState;
  labels: {
    team: string;
    idle: string;
    silent: string;
    took: string;
    seconds: (ms: number) => string;
  };
}

const LEVELS = { info: "INFO", warn: "WARN", error: "ERROR" } as const;

// Backstage: the team's console. With the magic, every step of a save is logged with
// its time, slow answers and retries are warned about, and a real failure alerts
// on-call. Naive, nothing reaches the team. Each level shows as a word, never color
// alone.
function ArchitectureMagicConsole({
  state,
  labels,
}: ArchitectureMagicConsoleProps) {
  const lines = state.log === null || state.log === "silent" ? [] : state.log;

  return (
    <section className={styles.pane} aria-label={labels.team}>
      <p className={styles.paneLabel} aria-hidden="true">
        {labels.team}
      </p>
      <div className={styles.console}>
        <span className={styles.lights} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <ol className={styles.log} aria-live="polite">
          {state.log === null && <li className={styles.idle}>{labels.idle}</li>}
          {state.log === "silent" && (
            <li className={styles.silent}>{labels.silent}</li>
          )}
          {lines.map((line) => (
            <li key={line.id} className={styles.line} data-level={line.level}>
              <span className={styles.time}>{line.time}</span>
              <span className={styles.level}>{LEVELS[line.level]}</span>
              <span>{line.text}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className={styles.readout}>
        {labels.took}:{" "}
        <strong>
          {state.took === null ? "–" : labels.seconds(state.took)}
        </strong>
      </p>
    </section>
  );
}

export default ArchitectureMagicConsole;
