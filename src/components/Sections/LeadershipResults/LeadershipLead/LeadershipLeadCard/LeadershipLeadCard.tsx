import type { LeadFloor } from "../../../../../content/leadershipResults";
import styles from "./LeadershipLeadCard.module.scss";

interface LeadershipLeadCardProps {
  id: string;
  labelledBy: string; // the selected floor button
  floor: LeadFloor;
  position: string; // "Floor 1"
  proofLabel: string;
  change: number; // one more per choice; reprints the card
}

// The chosen floor (the buttons' panel): what it means, then an example from James's
// work and where it happened. Each new choice prints in from the bottom up.
function LeadershipLeadCard({
  id,
  labelledBy,
  floor,
  position,
  proofLabel,
  change,
}: LeadershipLeadCardProps) {
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
        <p className={styles.position}>{position}</p>
        <h4 className={styles.title}>{floor.title}</h4>
        <p className={styles.body}>{floor.body}</p>
        <div className={styles.proof}>
          <p className={styles.proofLabel}>{proofLabel}</p>
          <p className={styles.proofText}>{floor.proof}</p>
          <p className={styles.source}>{floor.source}</p>
        </div>
      </div>
    </section>
  );
}

export default LeadershipLeadCard;
