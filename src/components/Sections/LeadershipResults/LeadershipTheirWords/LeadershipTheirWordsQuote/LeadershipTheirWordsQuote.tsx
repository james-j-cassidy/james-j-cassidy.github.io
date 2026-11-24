import type { Recommendation } from "../../../../../content/leadershipResults";
import styles from "./LeadershipTheirWordsQuote.module.scss";

interface LeadershipTheirWordsQuoteProps {
  id: string;
  labelledBy: string; // the selected beacon
  quote: Recommendation;
  change: number; // one more per choice; reprints the quote
}

// The chosen recommendation (the beacons' panel): the words, then who said them.
function LeadershipTheirWordsQuote({
  id,
  labelledBy,
  quote,
  change,
}: LeadershipTheirWordsQuoteProps) {
  return (
    <section
      id={id}
      className={styles.card}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <figure
        key={change}
        className={styles.figure}
        data-printed={change > 0 ? "" : undefined}
      >
        <blockquote className={styles.quote}>
          <p>{quote.quote}</p>
        </blockquote>
        <figcaption className={styles.caption}>
          <span className={styles.name}>{quote.name}</span>{" "}
          <span className={styles.role}>{quote.role}</span>
        </figcaption>
      </figure>
    </section>
  );
}

export default LeadershipTheirWordsQuote;
