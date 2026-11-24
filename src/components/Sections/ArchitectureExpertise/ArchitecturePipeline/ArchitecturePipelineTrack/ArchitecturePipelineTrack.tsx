import type { CSSProperties } from "react";
import type {
  GateId,
  PipelineGate,
} from "../../../../../content/architectureExpertise";
import styles from "./ArchitecturePipelineTrack.module.scss";

// How a gate ends a run: it passed the change, caught it, or is planned and not yet run.
type GateResult = "passed" | "caught" | "skipped";

interface ArchitecturePipelineTrackProps {
  gates: readonly PipelineGate[];
  caughtBy: GateId | null | undefined; // undefined: nothing sent yet
  run: number; // one more per change sent; replays the run
  labels: {
    gates: string;
    live: string;
    planned: string;
    release: string;
    passed: string;
    caught: string;
    skipped: string;
  };
}

// The gates in order on a conveyor, ending at release. Each says whether it runs on
// this site today or is planned. A change sent down the line travels gate to gate and
// stops at the one that catches it; each gate it reaches shows its result as the change
// arrives (passed, caught, or not yet run for a planned gate).
function ArchitecturePipelineTrack({
  gates,
  caughtBy,
  run,
  labels,
}: ArchitecturePipelineTrackProps) {
  const sent = caughtBy !== undefined;
  const caughtAt = caughtBy
    ? gates.findIndex((gate) => gate.id === caughtBy)
    : -1;
  const stopAt = caughtAt >= 0 ? caughtAt : gates.length; // the release terminal
  const resultFor = (index: number): GateResult | undefined => {
    if (!sent || index > stopAt) return undefined;
    if (index === caughtAt) return "caught";
    return gates[index].live ? "passed" : "skipped";
  };
  const marks: Record<GateResult, string> = {
    passed: "✓",
    caught: "✕",
    skipped: "–",
  };

  return (
    <div
      key={run}
      className={styles.track}
      style={
        {
          "--count": gates.length + 1,
          "--stop": stopAt,
        } as CSSProperties
      }
      data-sent={sent ? "" : undefined}
    >
      <span className={styles.belt} aria-hidden="true" />
      {sent && (
        <span
          className={styles.token}
          data-caught={caughtAt >= 0 ? "" : undefined}
          aria-hidden="true"
        />
      )}
      <ol className={styles.gates} aria-label={labels.gates}>
        {gates.map((gate, index) => {
          const result = resultFor(index);
          return (
            <li
              key={gate.id}
              className={styles.gate}
              data-live={gate.live ? "" : undefined}
              data-result={result}
              style={{ "--order": index } as CSSProperties}
            >
              <span className={styles.name}>{gate.name}</span>
              <span className={styles.tool}>{gate.tool}</span>
              <span className={styles.state}>
                {gate.live ? labels.live : labels.planned}
              </span>
              {result && (
                <span className={styles.result}>
                  <span aria-hidden="true">{marks[result]}</span>
                  <span className={styles.resultWord}> {labels[result]}</span>
                </span>
              )}
            </li>
          );
        })}
        <li
          className={styles.release}
          data-reached={sent && caughtAt < 0 ? "" : undefined}
          style={{ "--order": gates.length } as CSSProperties}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 19c2-6 6-11 14-14-1 8-6 12-12 14M9 15l-4 4M14 10l1 1" />
          </svg>
          <span className={styles.name}>{labels.release}</span>
        </li>
      </ol>
    </div>
  );
}

export default ArchitecturePipelineTrack;
