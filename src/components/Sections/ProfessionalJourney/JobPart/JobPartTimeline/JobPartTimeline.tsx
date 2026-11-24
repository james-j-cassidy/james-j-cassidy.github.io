import type { CSSProperties } from "react";
import type { Job } from "../../../../../content/professionalJourney";
import styles from "./JobPartTimeline.module.scss";

interface JobPartTimelineProps {
  jobs: readonly Job[]; // most recent first
  currentId: string;
  label: string;
  presentLabel: string;
}

// The career rail across the top of every job: one stop per job, most recent first,
// with this job's stop lit and marked. A list, so screen readers hear the whole career
// and which stop this is.
function JobPartTimeline({
  jobs,
  currentId,
  label,
  presentLabel,
}: JobPartTimelineProps) {
  return (
    <ol
      className={styles.rail}
      aria-label={label}
      style={{ "--stops": jobs.length } as CSSProperties}
    >
      {jobs.map((job) => (
        <li
          key={job.id}
          className={styles.stop}
          aria-current={job.id === currentId ? "step" : undefined}
        >
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.company}>
            <span aria-hidden="true">{job.shortName}</span>
            <span className={styles.fullName}>{job.company}</span>
          </span>
          <span className={styles.years}>
            {job.start} – {job.end ?? presentLabel}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default JobPartTimeline;
