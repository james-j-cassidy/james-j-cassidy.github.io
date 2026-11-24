import type { CSSProperties } from "react";
import type {
  Achievement,
  AchievementId,
} from "../../../../../content/introduction";
import styles from "./IntroductionNextStepMedallion.module.scss";

interface IntroductionNextStepMedallionProps {
  achievement: Achievement;
  earned: boolean;
  order: number; // stamps down in this order as the part enters
  stateLabel: string; // "Unlocked" or "Locked", read with the title
}

// One achievement: a hex medallion with its emblem, title and, while locked, how to earn
// it. Unlocked medallions glow; locked ones are dashed, dim and show a lock. The state is
// also written out (never color or shape alone).
function IntroductionNextStepMedallion({
  achievement,
  earned,
  order,
  stateLabel,
}: IntroductionNextStepMedallionProps) {
  return (
    <li
      className={styles.medallion}
      data-earned={earned ? "" : undefined}
      style={{ "--order": order } as CSSProperties}
    >
      <span className={styles.hex} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d={earned ? EMBLEMS[achievement.id] : LOCK} />
        </svg>
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{achievement.title}</span>
        <span className={styles.state}>{stateLabel}</span>
        {!earned && <span className={styles.how}>{achievement.how}</span>}
      </span>
    </li>
  );
}

const LOCK = "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5ZM12 15v2";

const EMBLEMS: Record<AchievementId, string> = {
  // Stacked platforms.
  opening: "M12 3 21 8 12 13 3 8ZM3 12l9 5 9-5M3 16l9 5 9-5",
  // A jet.
  origin: "M21 12 8 6l2 6-2 6ZM3 10l5 2-5 2",
  // A lightning bolt.
  principles: "M13 2 5 14h6l-1 8 8-12h-6Z",
  // A magnifier.
  thisSite: "M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM14.5 14.5 20 20",
  // A target.
  lookingFor:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 11.5v1",
  // A star.
  beyondWork:
    "M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7Z",
};

export default IntroductionNextStepMedallion;
