import type { CSSProperties } from "react";
import type { LeadFloor } from "../../../../../content/leadershipResults";
import { useRovingTabs } from "../../../../../hooks/useRovingTabs";
import styles from "./LeadershipLeadPanel.module.scss";

interface LeadershipLeadPanelProps {
  floors: readonly LeadFloor[];
  selected: number;
  label: string;
  tabIdFor: (index: number) => string;
  panelId: string;
  onSelect: (index: number) => void;
}

// The elevator's button panel: one lit button per floor, the first floor at the bottom
// like a real panel. The buttons are tabs (the card is their panel); ArrowUp goes up a
// floor and ArrowDown down.
function LeadershipLeadPanel({
  floors,
  selected,
  label,
  tabIdFor,
  panelId,
  onSelect,
}: LeadershipLeadPanelProps) {
  const { refFor, onKeyDown } = useRovingTabs(
    floors.length,
    selected,
    onSelect,
    true,
  );

  return (
    <div
      className={styles.panel}
      role="tablist"
      aria-label={label}
      aria-orientation="vertical"
    >
      {floors.map((floor, index) => (
        <button
          key={floor.id}
          ref={refFor(index)}
          id={tabIdFor(index)}
          type="button"
          role="tab"
          className={styles.button}
          aria-selected={index === selected}
          aria-controls={panelId}
          tabIndex={index === selected ? 0 : -1}
          style={{ "--order": index } as CSSProperties}
          onClick={() => onSelect(index)}
          onKeyDown={onKeyDown}
        >
          <span className={styles.light} aria-hidden="true">
            {index + 1}
          </span>
          <span className={styles.name}>{floor.short}</span>
        </button>
      ))}
    </div>
  );
}

export default LeadershipLeadPanel;
