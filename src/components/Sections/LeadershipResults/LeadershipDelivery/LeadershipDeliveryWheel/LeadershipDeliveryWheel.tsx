import type { CSSProperties } from "react";
import type { DeliveryStep } from "../../../../../content/leadershipResults";
import { useRovingTabs } from "../../../../../hooks/useRovingTabs";
import styles from "./LeadershipDeliveryWheel.module.scss";

interface LeadershipDeliveryWheelProps {
  steps: readonly DeliveryStep[];
  selected: number;
  spin: number; // degrees turned by choices
  label: string;
  hubValue: string;
  hubLabel: string;
  tabIdFor: (index: number) => string;
  panelId: string;
  onSelect: (index: number) => void;
}

// The flywheel: a rim with five habits evenly round it, spokes and a hub that keeps the
// count of projects shipped. The habits are tabs (the card is their panel) and stay
// upright however the wheel turns. A fixed marker at the top points at the chosen one.
function LeadershipDeliveryWheel({
  steps,
  selected,
  spin,
  label,
  hubValue,
  hubLabel,
  tabIdFor,
  panelId,
  onSelect,
}: LeadershipDeliveryWheelProps) {
  const { refFor, onKeyDown } = useRovingTabs(steps.length, selected, onSelect);
  const step = 360 / steps.length;

  return (
    <div
      className={styles.wheel}
      style={{ "--wheel-spin": `${spin}deg` } as CSSProperties}
    >
      <span className={styles.marker} aria-hidden="true" />
      <div className={styles.rotor}>
        <span className={styles.rim} aria-hidden="true" />
        {steps.map((item, index) => (
          <span
            key={`spoke-${item.id}`}
            className={styles.spoke}
            style={{ "--a": `${index * step}deg` } as CSSProperties}
            aria-hidden="true"
          />
        ))}
        <div className={styles.habits} role="tablist" aria-label={label}>
          {steps.map((item, index) => (
            <button
              key={item.id}
              ref={refFor(index)}
              id={tabIdFor(index)}
              type="button"
              role="tab"
              className={styles.habit}
              aria-selected={index === selected}
              aria-controls={panelId}
              tabIndex={index === selected ? 0 : -1}
              style={{ "--a": `${index * step}deg` } as CSSProperties}
              onClick={() => onSelect(index)}
              onKeyDown={onKeyDown}
            >
              <span className={styles.number} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.name}>{item.short}</span>
            </button>
          ))}
        </div>
      </div>
      <p className={styles.hub}>
        <span className={styles.hubValue}>{hubValue}</span>
        <span className={styles.hubLabel}>{hubLabel}</span>
      </p>
    </div>
  );
}

export default LeadershipDeliveryWheel;
