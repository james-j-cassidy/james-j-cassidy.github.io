import type { Principle } from "../../../../../content/introduction";
import IntroductionPrinciplesMeter from "./IntroductionPrinciplesMeter/IntroductionPrinciplesMeter";
import styles from "./IntroductionPrinciplesTradeoff.module.scss";

interface IntroductionPrinciplesTradeoffProps {
  id: string;
  labelledBy: string; // the selected card's tab
  principle: Principle;
  applied: boolean;
  labels: {
    tradeoff: string;
    apply: string;
    withoutLabel: string;
    withLabel: string;
    levels: { low: string; medium: string; high: string };
  };
  onToggle: () => void;
}

function levelOf(
  value: number,
  levels: IntroductionPrinciplesTradeoffProps["labels"]["levels"],
): string {
  if (value >= 60) return levels.high;
  if (value <= 35) return levels.low;
  return levels.medium;
}

// The trade-off for the selected principle (the cards' panel). A power switch applies
// the principle or takes it away: the outcome card flips over in 3D between the two
// outcomes, and the meter slides to the new level.
function IntroductionPrinciplesTradeoff({
  id,
  labelledBy,
  principle,
  applied,
  labels,
  onToggle,
}: IntroductionPrinciplesTradeoffProps) {
  const outcome = applied ? principle.with : principle.without;

  return (
    <section
      id={id}
      className={styles.tradeoff}
      role="tabpanel"
      aria-labelledby={labelledBy}
    >
      <div className={styles.header}>
        <p className={styles.tag}>{labels.tradeoff}</p>
        <div className={styles.switchRow}>
          <span className={styles.state} data-on={!applied ? "" : undefined}>
            {labels.withoutLabel}
          </span>
          <button
            type="button"
            role="switch"
            className={styles.switch}
            aria-checked={applied}
            aria-label={labels.apply}
            onClick={onToggle}
          >
            <span className={styles.knob} />
          </button>
          <span className={styles.state} data-on={applied ? "" : undefined}>
            {labels.withLabel}
          </span>
        </div>
      </div>
      <div className={styles.flipper} data-applied={applied ? "" : undefined}>
        {/* Only the face showing is read. */}
        <div className={styles.face} aria-hidden={applied}>
          <p className={styles.faceTag}>{labels.withoutLabel}</p>
          <p className={styles.faceText}>{principle.without.text}</p>
        </div>
        <div className={styles.face} data-back="" aria-hidden={!applied}>
          <p className={styles.faceTag}>{labels.withLabel}</p>
          <p className={styles.faceText}>{principle.with.text}</p>
        </div>
      </div>
      <IntroductionPrinciplesMeter
        label={principle.metric}
        value={outcome.value}
        level={levelOf(outcome.value, labels.levels)}
      />
    </section>
  );
}

export default IntroductionPrinciplesTradeoff;
