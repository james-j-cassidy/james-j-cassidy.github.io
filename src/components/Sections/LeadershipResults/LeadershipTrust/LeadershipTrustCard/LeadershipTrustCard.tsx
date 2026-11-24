import type { TrustReason } from "../../../../../content/leadershipResults";
import styles from "./LeadershipTrustCard.module.scss";

interface LeadershipTrustCardProps {
  id: string;
  labelledBy: string; // the selected reason
  reason: TrustReason;
  proofLabel: string;
  change: number; // one more per choice; reprints the card
}

// The chosen reason (the reasons' panel): what it means, then an example from James's
// work and where it happened.
function LeadershipTrustCard({
  id,
  labelledBy,
  reason,
  proofLabel,
  change,
}: LeadershipTrustCardProps) {
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
        <h4 className={styles.title}>{reason.title}</h4>
        <p className={styles.body}>{reason.body}</p>
        <div className={styles.proof}>
          <p className={styles.proofLabel}>{proofLabel}</p>
          <p className={styles.proofText}>{reason.proof}</p>
          <p className={styles.source}>{reason.source}</p>
        </div>
      </div>
    </section>
  );
}

export default LeadershipTrustCard;
