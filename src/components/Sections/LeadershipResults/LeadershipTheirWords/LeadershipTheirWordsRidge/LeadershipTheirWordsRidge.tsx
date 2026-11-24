import type { CSSProperties } from "react";
import type { Recommendation } from "../../../../../content/leadershipResults";
import { useRovingTabs } from "../../../../../hooks/useRovingTabs";
import styles from "./LeadershipTheirWordsRidge.module.scss";

interface LeadershipTheirWordsRidgeProps {
  quotes: readonly Recommendation[];
  selected: number;
  label: string;
  tabIdFor: (index: number) => string;
  panelId: string;
  onSelect: (index: number) => void;
}

// Where each beacon stands along the ridge (percent across), on the ridge's peaks.
const SPOTS = [22, 50, 78];

// The summit ridge, full width, with a beacon on each of its peaks: one per
// recommendation. The beacons are tabs (the quote is their panel); the chosen one burns
// tallest.
function LeadershipTheirWordsRidge({
  quotes,
  selected,
  label,
  tabIdFor,
  panelId,
  onSelect,
}: LeadershipTheirWordsRidgeProps) {
  const { refFor, onKeyDown } = useRovingTabs(
    quotes.length,
    selected,
    onSelect,
  );

  return (
    <div className={styles.ridge}>
      <svg
        className={styles.silhouette}
        viewBox="0 0 1000 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 160V118L120 92L220 40L320 96L420 80L500 22L590 84L690 70L780 38L880 100L1000 86V160Z" />
      </svg>
      <div className={styles.beacons} role="tablist" aria-label={label}>
        {quotes.map((quote, index) => (
          <button
            key={quote.id}
            ref={refFor(index)}
            id={tabIdFor(index)}
            type="button"
            role="tab"
            className={styles.beacon}
            aria-selected={index === selected}
            aria-controls={panelId}
            tabIndex={index === selected ? 0 : -1}
            style={
              {
                "--x": `${SPOTS[index % SPOTS.length]}%`,
                "--order": index,
              } as CSSProperties
            }
            onClick={() => onSelect(index)}
            onKeyDown={onKeyDown}
          >
            <span className={styles.flame} aria-hidden="true" />
            <span className={styles.brazier} aria-hidden="true" />
            <span className={styles.name}>{quote.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LeadershipTheirWordsRidge;
