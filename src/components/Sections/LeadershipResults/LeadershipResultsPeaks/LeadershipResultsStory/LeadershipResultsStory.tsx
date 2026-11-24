import type { Result } from "../../../../../content/leadershipResults";
import styles from "./LeadershipResultsStory.module.scss";

interface LeadershipResultsStoryProps {
  id: string;
  labelledBy: string; // the selected peak
  result: Result;
  change: number; // one more per choice; reprints the card
}

// The story behind the chosen number (the peaks' panel): the figure, what it means,
// how it happened and where.
function LeadershipResultsStory({
  id,
  labelledBy,
  result,
  change,
}: LeadershipResultsStoryProps) {
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
        <p className={styles.headline}>
          <span className={styles.figure}>{result.display}</span>{" "}
          <span className={styles.label}>{result.label}</span>
        </p>
        <p className={styles.story}>{result.story}</p>
        <p className={styles.source}>{result.source}</p>
      </div>
    </section>
  );
}

export default LeadershipResultsStory;
