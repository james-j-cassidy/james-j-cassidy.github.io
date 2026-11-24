import type { CSSProperties } from "react";
import styles from "./IntroductionPrinciplesMeter.module.scss";

interface IntroductionPrinciplesMeterProps {
  label: string; // what it measures
  value: number; // 0–100
  level: string; // the value in words (Low, Medium, High), shown and read
}

// A segmented power meter: the bar slides to its level when the value changes, and the
// level is written beside it (never color alone).
function IntroductionPrinciplesMeter({
  label,
  value,
  level,
}: IntroductionPrinciplesMeterProps) {
  return (
    <div className={styles.meter}>
      <div className={styles.labels}>
        <span>{label}</span>
        <span className={styles.level}>{level}</span>
      </div>
      <div
        className={styles.track}
        style={{ "--value": value / 100 } as CSSProperties}
        aria-hidden="true"
      >
        <span className={styles.fill} />
      </div>
    </div>
  );
}

export default IntroductionPrinciplesMeter;
