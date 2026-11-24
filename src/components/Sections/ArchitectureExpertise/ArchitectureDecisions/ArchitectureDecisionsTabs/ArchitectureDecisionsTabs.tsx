import type { CSSProperties } from "react";
import type { DecisionRecord } from "../../../../../content/architectureExpertise";
import { useRovingTabs } from "../../../../../hooks/useRovingTabs";
import styles from "./ArchitectureDecisionsTabs.module.scss";

interface ArchitectureDecisionsTabsProps {
  records: readonly DecisionRecord[];
  selected: number;
  label: string;
  tabIdFor: (index: number) => string;
  panelId: string;
  onSelect: (index: number) => void;
}

// The decision records as tabs (the sheet is their panel): each shows its number and
// what it decided.
function ArchitectureDecisionsTabs({
  records,
  selected,
  label,
  tabIdFor,
  panelId,
  onSelect,
}: ArchitectureDecisionsTabsProps) {
  const { refFor, onKeyDown } = useRovingTabs(
    records.length,
    selected,
    onSelect,
  );

  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {records.map((record, index) => (
        <button
          key={record.id}
          ref={refFor(index)}
          id={tabIdFor(index)}
          type="button"
          role="tab"
          className={styles.tab}
          aria-selected={index === selected}
          aria-controls={panelId}
          tabIndex={index === selected ? 0 : -1}
          style={{ "--order": index } as CSSProperties}
          onClick={() => onSelect(index)}
          onKeyDown={onKeyDown}
        >
          <span className={styles.number}>{record.number}</span>
          <span className={styles.title}>{record.title}</span>
          <span className={styles.short}>{record.short}</span>
        </button>
      ))}
    </div>
  );
}

export default ArchitectureDecisionsTabs;
