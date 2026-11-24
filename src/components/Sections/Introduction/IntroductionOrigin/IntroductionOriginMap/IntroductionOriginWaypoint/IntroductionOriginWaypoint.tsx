import type { CSSProperties, KeyboardEvent, Ref } from "react";
import styles from "./IntroductionOriginWaypoint.module.scss";

interface IntroductionOriginWaypointProps {
  id: string;
  number: string; // "01", shown on the marker
  title: string; // read with the number
  selected: boolean;
  visited: boolean; // the jet has been here or past it
  at: number; // 0–1: how far along the path, so it lights up as the path draws in
  x: number; // position on the map, in percent
  y: number;
  panelId: string;
  buttonRef: Ref<HTMLButtonElement>;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

// One waypoint on the flight map: a tab (the briefing is its panel). A glowing marker
// with its number; the current one pulses with rings, visited ones are filled.
function IntroductionOriginWaypoint({
  id,
  number,
  title,
  selected,
  visited,
  at,
  x,
  y,
  panelId,
  buttonRef,
  onSelect,
  onKeyDown,
}: IntroductionOriginWaypointProps) {
  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="tab"
      className={styles.waypoint}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      data-visited={visited ? "" : undefined}
      style={{ "--x": `${x}%`, "--y": `${y}%`, "--at": at } as CSSProperties}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <span className={styles.rings} aria-hidden="true" />
      <span className={styles.number}>{number}</span>
      <span className={styles.title}>{title}</span>
    </button>
  );
}

export default IntroductionOriginWaypoint;
