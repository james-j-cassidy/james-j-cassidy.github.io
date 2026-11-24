import type { CSSProperties } from "react";
import type { HardCall } from "../../../../../content/leadershipResults";
import styles from "./LeadershipHardCallsSteps.module.scss";

interface LeadershipHardCallsStepsProps {
  id: string;
  labelledBy: string; // the selected marker
  story: HardCall;
  stepLabels: { situation: string; decision: string; result: string };
  climb: number; // one more per story chosen; the steps light in turn
}

const STEPS = ["situation", "decision", "result"] as const;

// The chosen story (the markers' panel): the storm, the call and the summit, in order,
// each with its mark: a cloud, a compass point and a flag. A new story lights each step
// in turn as the climber passes it.
function LeadershipHardCallsSteps({
  id,
  labelledBy,
  story,
  stepLabels,
  climb,
}: LeadershipHardCallsStepsProps) {
  return (
    <section
      id={id}
      className={styles.card}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <div key={climb} data-climbed={climb > 0 ? "" : undefined}>
        <h4 className={styles.title}>{story.title}</h4>
        <ol className={styles.steps}>
          {STEPS.map((step, position) => (
            <li
              key={step}
              className={styles.step}
              data-step={step}
              style={{ "--order": position } as CSSProperties}
            >
              <span className={styles.mark} aria-hidden="true" />
              <span className={styles.label}>{stepLabels[step]}</span>
              <span className={styles.text}>{story[step]}</span>
            </li>
          ))}
        </ol>
        <p className={styles.source}>{story.source}</p>
      </div>
    </section>
  );
}

export default LeadershipHardCallsSteps;
