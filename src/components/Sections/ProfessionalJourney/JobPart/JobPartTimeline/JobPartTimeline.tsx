import type { CSSProperties } from "react";
import styles from "./JobPartTimeline.module.scss";

// One stop on a rail: its short name, its full name (what is read) and when.
export interface TimelineStop {
  id: string;
  short: string;
  full: string;
  when: string | null;
}

interface JobPartTimelineProps {
  stops: readonly TimelineStop[]; // in story order
  currentId: string;
  label: string;
}

// The rail across the top of every part of a journey story (the career, or the
// credentials): one stop per part, in story order, with this part's stop lit and marked.
// A list, so screen readers hear the whole chain and which stop this is.
function JobPartTimeline({ stops, currentId, label }: JobPartTimelineProps) {
  return (
    <ol
      className={styles.rail}
      aria-label={label}
      style={{ "--stops": stops.length } as CSSProperties}
    >
      {stops.map((stop) => (
        <li
          key={stop.id}
          className={styles.stop}
          aria-current={stop.id === currentId ? "step" : undefined}
        >
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.company}>
            <span aria-hidden="true">{stop.short}</span>
            <span className={styles.fullName}>{stop.full}</span>
          </span>
          {stop.when && <span className={styles.years}>{stop.when}</span>}
        </li>
      ))}
    </ol>
  );
}

export default JobPartTimeline;
