import type { CSSProperties } from "react";
import type { TrustReason } from "../../../../../content/leadershipResults";
import { useRovingTabs } from "../../../../../hooks/useRovingTabs";
import styles from "./LeadershipTrustReasons.module.scss";

interface LeadershipTrustReasonsProps {
  reasons: readonly TrustReason[];
  selected: number;
  label: string;
  tabIdFor: (index: number) => string;
  panelId: string;
  onSelect: (index: number) => void;
}

// The reasons people trust James, as tabs (the card is their panel).
function LeadershipTrustReasons({
  reasons,
  selected,
  label,
  tabIdFor,
  panelId,
  onSelect,
}: LeadershipTrustReasonsProps) {
  const { refFor, onKeyDown } = useRovingTabs(
    reasons.length,
    selected,
    onSelect,
  );

  return (
    <div className={styles.reasons} role="tablist" aria-label={label}>
      {reasons.map((reason, index) => (
        <button
          key={reason.id}
          ref={refFor(index)}
          id={tabIdFor(index)}
          type="button"
          role="tab"
          className={styles.reason}
          aria-selected={index === selected}
          aria-controls={panelId}
          tabIndex={index === selected ? 0 : -1}
          style={{ "--order": index } as CSSProperties}
          onClick={() => onSelect(index)}
          onKeyDown={onKeyDown}
        >
          {reason.short}
        </button>
      ))}
    </div>
  );
}

export default LeadershipTrustReasons;
