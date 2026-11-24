import { useId } from "react";
import { LOOK_LABELS, type LookChance } from "../../../content/hireMe";
import styles from "./HireMeChance.module.scss";

interface HireMeChanceProps {
  chance: LookChance;
}

// How likely James is to look at the offer as it stands: a ring filled to the
// percentage, the verdict in words (never the ring or its color alone), and the
// reasons behind it. The verdict and percentage are announced as they change; the
// reasons are read on request, not on every keystroke.
function HireMeChance({ chance }: HireMeChanceProps) {
  const id = useId();
  const circumference = 2 * Math.PI * 22;

  if (!chance.ready) {
    return (
      <div className={styles.chance} data-verdict="waiting">
        <svg className={styles.ring} viewBox="0 0 52 52" aria-hidden="true">
          <circle className={styles.track} cx="26" cy="26" r="22" />
        </svg>
        <div className={styles.text}>
          <p className={styles.title} aria-live="polite">
            {LOOK_LABELS.title}
          </p>
          <p className={styles.waiting}>{LOOK_LABELS.waiting}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.chance}
      data-verdict={chance.verdict}
      aria-describedby={`${id}-reasons ${id}-guide`}
    >
      <svg className={styles.ring} viewBox="0 0 52 52" aria-hidden="true">
        <circle className={styles.track} cx="26" cy="26" r="22" />
        <circle
          className={styles.fill}
          cx="26"
          cy="26"
          r="22"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - chance.percent / 100)}
        />
      </svg>
      <div className={styles.text}>
        <p className={styles.title} aria-live="polite">
          {LOOK_LABELS.title}:{" "}
          <span className={styles.value}>
            {chance.percent}% · {LOOK_LABELS.verdicts[chance.verdict]}
          </span>
        </p>
        <ul id={`${id}-reasons`} className={styles.reasons}>
          {chance.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        <p id={`${id}-guide`} className={styles.guide}>
          {LOOK_LABELS.guide}
        </p>
      </div>
    </div>
  );
}

export default HireMeChance;
