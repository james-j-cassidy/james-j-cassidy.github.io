import type { ARCHITECTURE_MAGIC } from "../../../../../content/architectureExpertise";
import type { DemoState, DemoTask } from "../useMagicDemo";
import styles from "./ArchitectureMagicApp.module.scss";

type AppLabels = Pick<
  typeof ARCHITECTURE_MAGIC,
  | "userLabel"
  | "appTitle"
  | "add"
  | "empty"
  | "wait"
  | "saving"
  | "saved"
  | "notSaved"
  | "honest"
  | "retry"
  | "waitedLabel"
  | "seconds"
>;

interface ArchitectureMagicAppProps {
  state: DemoState;
  magic: boolean;
  labels: AppLabels;
  onAdd: () => void;
  onRetry: (task: DemoTask) => void;
}

const MARKS = { saving: "…", saved: "✓", failed: "!" } as const;

// Front of house: a small synthetic to-do app, as the user sees it. Naive, it locks the
// screen while the server answers and shows the server's raw error. With the magic, a
// task shows at once while it saves; a task that truly cannot be saved says so plainly,
// is kept, and can be tried again. Changes are announced.
function ArchitectureMagicApp({
  state,
  magic,
  labels,
  onAdd,
  onRetry,
}: ArchitectureMagicAppProps) {
  // The newest task that could not be saved (phones show only the newest task).
  const failed = [...state.tasks]
    .reverse()
    .find((task) => task.status === "failed");
  const words = {
    saving: labels.saving,
    saved: labels.saved,
    failed: labels.notSaved,
  };

  return (
    <section className={styles.pane} aria-label={labels.userLabel}>
      <p className={styles.paneLabel} aria-hidden="true">
        {labels.userLabel}
      </p>
      <div
        className={styles.app}
        data-blocking={state.blocking ? "" : undefined}
      >
        <div className={styles.bar}>
          <p className={styles.appTitle}>{labels.appTitle}</p>
          <button
            type="button"
            className={styles.add}
            onClick={onAdd}
            disabled={state.blocking}
          >
            <span aria-hidden="true">+</span> {labels.add}
          </button>
        </div>
        <ul className={styles.tasks}>
          {state.tasks.length === 0 && (
            <li className={styles.empty}>{labels.empty}</li>
          )}
          {state.tasks.map((task) => (
            <li key={task.id} className={styles.task} data-status={task.status}>
              <span className={styles.mark} aria-hidden="true">
                {MARKS[task.status]}
              </span>
              <span className={styles.text}>{task.text}</span>
              <span className={styles.status}>{words[task.status]}</span>
            </li>
          ))}
        </ul>
        <div className={styles.messages} aria-live="polite">
          {state.blocking && <p className={styles.wait}>{labels.wait}</p>}
          {state.error && <p className={styles.error}>{state.error}</p>}
          {magic && failed && (
            <div className={styles.honest}>
              <p>{labels.honest(failed.text)}</p>
              <button
                type="button"
                className={styles.retry}
                onClick={() => onRetry(failed)}
              >
                {labels.retry}
              </button>
            </div>
          )}
        </div>
        {state.blocking && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
      </div>
      <p className={styles.readout}>
        {labels.waitedLabel}:{" "}
        <strong>
          {state.waited === null ? "–" : labels.seconds(state.waited)}
        </strong>
      </p>
    </section>
  );
}

export default ArchitectureMagicApp;
