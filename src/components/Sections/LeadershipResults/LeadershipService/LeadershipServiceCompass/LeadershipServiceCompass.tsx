import { useState, type CSSProperties } from "react";
import type { CoreValue } from "../../../../../content/leadershipResults";
import { useRovingTabs } from "../../../../../hooks/useRovingTabs";
import UsafSymbol from "../../../../UsafSymbol/UsafSymbol";
import styles from "./LeadershipServiceCompass.module.scss";

interface LeadershipServiceCompassProps {
  values: readonly CoreValue[];
  selected: number;
  label: string;
  emblemLabel: string;
  tabIdFor: (index: number) => string;
  panelId: string;
  onSelect: (index: number) => void;
}

// A compass with the Air Force symbol at its heart and the three core values as its
// points. The values are tabs (the card is their panel); the needle swings the short
// way round to the chosen one.
function LeadershipServiceCompass({
  values,
  selected,
  label,
  emblemLabel,
  tabIdFor,
  panelId,
  onSelect,
}: LeadershipServiceCompassProps) {
  const step = 360 / values.length;
  const [needle, setNeedle] = useState(0); // degrees, accumulated the short way
  const { refFor, onKeyDown } = useRovingTabs(values.length, selected, choose);

  function choose(position: number) {
    if (position === selected) return;
    let delta = (position - selected) % values.length;
    if (delta > values.length / 2) delta -= values.length;
    if (delta < -values.length / 2) delta += values.length;
    setNeedle((angle) => angle + delta * step);
    onSelect(position);
  }

  return (
    <div className={styles.compass}>
      <svg
        className={styles.ring}
        viewBox="-100 -100 200 200"
        aria-hidden="true"
      >
        <circle className={styles.rim} r={92} />
        <circle className={styles.inner} r={72} />
        {Array.from({ length: 36 }, (_, tick) => (
          <line
            key={tick}
            className={tick % 3 === 0 ? styles.tickMajor : styles.tick}
            x1={0}
            y1={-92}
            x2={0}
            y2={tick % 3 === 0 ? -80 : -86}
            transform={`rotate(${tick * 10})`}
          />
        ))}
      </svg>
      <span
        className={styles.needle}
        style={{ "--compass-needle": `${needle}deg` } as CSSProperties}
        aria-hidden="true"
      />
      <div className={styles.emblem}>
        <UsafSymbol className={styles.symbol} />
        <span className={styles.visuallyHidden}>{emblemLabel}</span>
      </div>
      <div className={styles.points} role="tablist" aria-label={label}>
        {values.map((value, index) => (
          <button
            key={value.id}
            ref={refFor(index)}
            id={tabIdFor(index)}
            type="button"
            role="tab"
            className={styles.point}
            aria-selected={index === selected}
            aria-controls={panelId}
            tabIndex={index === selected ? 0 : -1}
            style={
              { "--a": `${index * step}deg`, "--order": index } as CSSProperties
            }
            onClick={() => choose(index)}
            onKeyDown={onKeyDown}
          >
            {value.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LeadershipServiceCompass;
