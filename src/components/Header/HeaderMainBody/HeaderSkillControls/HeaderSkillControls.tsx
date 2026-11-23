import type { SKILL_LABELS } from "../../../../content/skills";
import styles from "./HeaderSkillControls.module.scss";

interface HeaderSkillControlsProps {
  position: number;
  total: number;
  isPlaying: boolean;
  labels: typeof SKILL_LABELS;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlaying: () => void;
}

// Previous / counter / next and the pause control (WCAG 2.2.2).
// The full skill page is reached from the skill name in the summary.
function HeaderSkillControls({
  position,
  total,
  isPlaying,
  labels,
  onPrevious,
  onNext,
  onTogglePlaying,
}: HeaderSkillControlsProps) {
  return (
    <div className={styles.row}>
      <button
        className={styles.stepButton}
        type="button"
        aria-label={labels.previous}
        onClick={onPrevious}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M15 6 9 12l6 6" />
        </svg>
      </button>

      <span className={styles.counter}>{labels.counter(position, total)}</span>

      <button
        className={styles.stepButton}
        type="button"
        aria-label={labels.next}
        onClick={onNext}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>

      <button
        className={styles.playButton}
        type="button"
        aria-label={isPlaying ? labels.pause : labels.play}
        onClick={onTogglePlaying}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          {isPlaying ? (
            <path d="M9 6v12M15 6v12" />
          ) : (
            <path className={styles.filled} d="M8 5.5v13l10.5-6.5L8 5.5Z" />
          )}
        </svg>
      </button>
    </div>
  );
}

export default HeaderSkillControls;
