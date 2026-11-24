import type { DeliveryStep } from "../../../../../content/leadershipResults";
import styles from "./LeadershipDeliveryCard.module.scss";

interface LeadershipDeliveryCardProps {
  id: string;
  labelledBy: string; // the selected habit
  step: DeliveryStep;
  change: number; // one more per choice; reprints the card
}

// The chosen habit (the wheel's panel): what it is, what it delivered and where.
function LeadershipDeliveryCard({
  id,
  labelledBy,
  step,
  change,
}: LeadershipDeliveryCardProps) {
  return (
    <section
      id={id}
      className={styles.card}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <div
        key={change}
        className={styles.sheet}
        data-printed={change > 0 ? "" : undefined}
      >
        <h4 className={styles.title}>{step.title}</h4>
        <p className={styles.body}>{step.body}</p>
        <p className={styles.proof}>
          <span className={styles.arrow} aria-hidden="true">
            ▲
          </span>{" "}
          {step.proof}
        </p>
        <p className={styles.source}>{step.source}</p>
      </div>
    </section>
  );
}

export default LeadershipDeliveryCard;
