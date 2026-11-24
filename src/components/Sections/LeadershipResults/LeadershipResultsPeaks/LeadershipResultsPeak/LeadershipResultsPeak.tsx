import type { CSSProperties, KeyboardEvent } from "react";
import type { Result } from "../../../../../content/leadershipResults";
import styles from "./LeadershipResultsPeak.module.scss";

interface LeadershipResultsPeakProps {
  result: Result;
  order: number; // place in the range, for the rise stagger
  height: number; // 0 to 1 of the range's height
  id: string;
  panelId: string;
  selected: boolean;
  planted: number; // the choice count when this peak was chosen; replants the flag
  buttonRef: (element: HTMLElement | null) => void;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

// One result as a peak in the range: its number over a mountain, a tab (the story card
// is its panel). The number counts up with the peak as it rises, in CSS from the scroll,
// so it counts back down when scrolling back. The full figure is what is read.
function LeadershipResultsPeak({
  result,
  order,
  height,
  id,
  panelId,
  selected,
  planted,
  buttonRef,
  onSelect,
  onKeyDown,
}: LeadershipResultsPeakProps) {
  const decimal = !Number.isInteger(result.value);
  const target = decimal ? Math.round(result.value * 10) : result.value;
  const style = {
    "--order": order,
    "--h": height,
    "--target": target,
  } as CSSProperties;

  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="tab"
      className={styles.peak}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      style={style}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <span className={styles.figure} aria-hidden="true">
        {result.prefix}
        <span
          className={styles.count}
          data-decimal={decimal ? "" : undefined}
        />
        {result.suffix}
      </span>
      <span className={styles.visuallyHidden}>{result.display}</span>
      <span className={styles.label}>{result.label}</span>
      <span className={styles.mountain} aria-hidden="true">
        {selected && (
          <span
            key={planted}
            className={styles.flag}
            data-planted={planted > 0 ? "" : undefined}
          />
        )}
      </span>
    </button>
  );
}

export default LeadershipResultsPeak;
