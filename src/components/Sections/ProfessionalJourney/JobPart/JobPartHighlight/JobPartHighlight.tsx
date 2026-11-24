import { useId, type CSSProperties } from "react";
import type { JobHighlight } from "../../../../../content/professionalJourney";
import styles from "./JobPartHighlight.module.scss";

interface JobPartHighlightProps {
  highlight: JobHighlight;
  order: number; // dealt in this order as the part enters
  open: boolean;
  caseLabels: { challenge: string; approach: string; impact: string };
  onToggle: () => void;
}

// One highlight: its metric and title on a button that opens the short case study
// below it (challenge, approach, impact). The case unfolds from the button down.
function JobPartHighlight({
  highlight,
  order,
  open,
  caseLabels,
  onToggle,
}: JobPartHighlightProps) {
  const caseId = useId();

  return (
    <li
      className={styles.highlight}
      style={{ "--order": order } as CSSProperties}
    >
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={caseId}
        onClick={onToggle}
      >
        <span className={styles.metric}>
          <span className={styles.metricValue}>{highlight.metric}</span>
          <span className={styles.metricLabel}>{highlight.metricLabel}</span>
        </span>
        <span className={styles.title}>{highlight.title}</span>
        <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <dl id={caseId} className={styles.case} hidden={!open}>
        <dt>{caseLabels.challenge}</dt>
        <dd>{highlight.challenge}</dd>
        <dt>{caseLabels.approach}</dt>
        <dd>{highlight.approach}</dd>
        <dt>{caseLabels.impact}</dt>
        <dd>{highlight.impact}</dd>
      </dl>
    </li>
  );
}

export default JobPartHighlight;
