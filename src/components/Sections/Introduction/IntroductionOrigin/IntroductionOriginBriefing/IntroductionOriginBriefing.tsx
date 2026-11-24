import type { OriginMilestone } from "../../../../../content/introduction";
import styles from "./IntroductionOriginBriefing.module.scss";

interface IntroductionOriginBriefingProps {
  id: string;
  labelledBy: string; // the selected waypoint's tab
  milestone: OriginMilestone;
  number: string; // "Waypoint 02"
  reachedLabel: string;
  previousLabel: string;
  nextLabel: string;
  hasPrevious: boolean;
  hasNext: boolean;
  change: number; // one more per waypoint chosen; replays the arrival
  onPrevious: () => void;
  onNext: () => void;
}

// The mission briefing: the chosen waypoint's milestone (the waypoint tabs' panel). Each
// new waypoint turns the briefing's page in from the side, and a "Waypoint reached"
// badge flips in. Previous and Next step along the route.
function IntroductionOriginBriefing({
  id,
  labelledBy,
  milestone,
  number,
  reachedLabel,
  previousLabel,
  nextLabel,
  hasPrevious,
  hasNext,
  change,
  onPrevious,
  onNext,
}: IntroductionOriginBriefingProps) {
  return (
    <section
      id={id}
      className={styles.briefing}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <div
        key={change}
        className={styles.page}
        data-arrived={change > 0 ? "" : undefined}
      >
        <div className={styles.header}>
          <p className={styles.number}>{number}</p>
          <p className={styles.badge}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5 10 17l9-10" />
            </svg>
            {reachedLabel}
          </p>
        </div>
        <h4 className={styles.title}>{milestone.title}</h4>
        <p className={styles.body}>{milestone.body}</p>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.step}
          aria-label={previousLabel}
          disabled={!hasPrevious}
          onClick={onPrevious}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.step}
          aria-label={nextLabel}
          disabled={!hasNext}
          onClick={onNext}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default IntroductionOriginBriefing;
