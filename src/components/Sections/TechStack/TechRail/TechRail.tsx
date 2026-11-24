import type { CSSProperties } from "react";
import type { StackItem } from "../../../../content/techStack";
import styles from "./TechRail.module.scss";

interface TechRailProps {
  items: readonly StackItem[]; // the sub-section, in story order
  currentId: string;
  label: string;
  position: string; // "7 of 38"
}

// The rail across the top of every item: one tick per item in story order, this one
// lit, with its place in the chain. Too many to name on the rail, so only the current
// one is named on screen; screen readers hear the whole list and which one this is.
function TechRail({ items, currentId, label, position }: TechRailProps) {
  return (
    <div className={styles.railBlock}>
      <ol
        className={styles.rail}
        aria-label={label}
        style={{ "--stops": items.length } as CSSProperties}
      >
        {items.map((item) => (
          <li
            key={item.id}
            className={styles.stop}
            aria-current={item.id === currentId ? "step" : undefined}
          >
            <span className={styles.tick} aria-hidden="true" />
            <span className={styles.name}>{item.name}</span>
          </li>
        ))}
      </ol>
      <p className={styles.position} aria-hidden="true">
        {position}
      </p>
    </div>
  );
}

export default TechRail;
