import { HIRE_ME_LABELS } from "../../../content/hireMe";
import styles from "./HireMeFit.module.scss";

interface HireMeFitProps {
  inStack: number; // skills chosen from James's stack
  outside: number; // skills added outside it
}

// How well James fits the role: a bar split between the skills in his stack and those
// outside it, with the counts in words (never the bar alone). Announced as it changes.
function HireMeFit({ inStack, outside }: HireMeFitProps) {
  const {
    fitLabel,
    fitEmpty,
    fitSummary,
    outside: outsideText,
  } = HIRE_ME_LABELS;
  const total = inStack + outside;
  const percent = total ? Math.round((inStack / total) * 100) : 0;

  return (
    <div className={styles.fit} aria-live="polite">
      <p className={styles.label}>{fitLabel}</p>
      {total === 0 ? (
        <p className={styles.empty}>{fitEmpty}</p>
      ) : (
        <>
          <p className={styles.summary}>
            <span className={styles.percent}>{percent}%</span>{" "}
            {fitSummary(inStack, total)} · {outsideText(outside)}
          </p>
          <span className={styles.bar} aria-hidden="true">
            <span
              className={styles.inStack}
              style={{ inlineSize: `${(inStack / total) * 100}%` }}
            />
            <span
              className={styles.outside}
              style={{ inlineSize: `${(outside / total) * 100}%` }}
            />
          </span>
        </>
      )}
    </div>
  );
}

export default HireMeFit;
