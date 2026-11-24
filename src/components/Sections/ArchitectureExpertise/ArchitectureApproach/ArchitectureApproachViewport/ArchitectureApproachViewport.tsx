import type { DesignStage } from "../../../../../content/architectureExpertise";
import ArchitectureApproachDiagram from "./ArchitectureApproachDiagram/ArchitectureApproachDiagram";
import styles from "./ArchitectureApproachViewport.module.scss";

interface ArchitectureApproachViewportProps {
  id: string;
  labelledBy: string; // the selected chip
  stage: DesignStage;
  number: string; // "Stage 01"
  running: boolean;
  change: number; // one more per stage chosen; redraws the diagram
  labels: {
    outputs: string;
    activeState: string;
    skippedState: string;
  };
}

// The selected stage on a holographic screen (the board's panel): what it answers, a
// small drawing of what it produces, and the outputs. A conditional stage says when it
// runs and whether it runs for this project. Each new stage draws its diagram in.
function ArchitectureApproachViewport({
  id,
  labelledBy,
  stage,
  number,
  running,
  change,
  labels,
}: ArchitectureApproachViewportProps) {
  return (
    <section
      id={id}
      className={styles.viewport}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <div className={styles.header}>
        <p className={styles.number}>{number}</p>
        {stage.when && (
          <p className={styles.state} data-running={running ? "" : undefined}>
            <span aria-hidden="true">{running ? "●" : "○"}</span>{" "}
            {running ? labels.activeState : labels.skippedState}
          </p>
        )}
      </div>
      <h4 className={styles.title}>{stage.title}</h4>
      <p className={styles.question}>{stage.question}</p>
      <p className={styles.summary}>
        {stage.summary}
        {stage.whenText && (
          <>
            {" "}
            <strong className={styles.when}>{stage.whenText}</strong>
          </>
        )}
      </p>
      <ArchitectureApproachDiagram
        key={change}
        stage={stage.id}
        drawn={change > 0}
      />
      <div className={styles.outputs}>
        <p className={styles.outputsLabel}>{labels.outputs}</p>
        <ul className={styles.outputList}>
          {stage.outputs.map((output) => (
            <li key={output}>{output}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ArchitectureApproachViewport;
