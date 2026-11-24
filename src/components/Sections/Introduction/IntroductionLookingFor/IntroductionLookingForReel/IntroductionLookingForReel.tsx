import { useId, type CSSProperties } from "react";
import type { LookingForReel } from "../../../../../content/introduction";
import styles from "./IntroductionLookingForReel.module.scss";

interface IntroductionLookingForReelProps {
  reel: LookingForReel;
  order: number; // left to right; staggers the reels' landing
  selected: number;
  turn: number; // cumulative steps turned (so the drum always takes the short way)
  previousLabel: string;
  nextLabel: string;
  onSelect: (index: number) => void;
}

// One slot reel: a 3D drum of options turning on its horizontal axis, the chosen one
// facing the visitor. Underneath it is an ordinary radio group (Tab in, arrow keys to
// change), so it works with any keyboard or screen reader; the drum shows the choice,
// and the ▲ ▼ buttons turn it for pointer and touch.
function IntroductionLookingForReel({
  reel,
  order,
  selected,
  turn,
  previousLabel,
  nextLabel,
  onSelect,
}: IntroductionLookingForReelProps) {
  const name = useId();
  const count = reel.options.length;
  const wrap = (index: number) => (index + count) % count;

  const geometry = {
    "--order": order,
    "--step": `${360 / count}deg`,
    "--radius-factor": 0.5 / Math.tan(Math.PI / count),
    "--turn": turn,
  } as CSSProperties;

  return (
    <fieldset className={styles.reel} style={geometry}>
      <legend className={styles.label}>{reel.label}</legend>
      <div className={styles.choices}>
        {reel.options.map((option, index) => (
          <label key={option.label}>
            <input
              type="radio"
              name={name}
              checked={index === selected}
              onChange={() => onSelect(index)}
            />
            {option.label}
          </label>
        ))}
      </div>
      <div className={styles.window}>
        <div className={styles.spinner} aria-hidden="true">
          <div className={styles.drum}>
            {reel.options.map((option, index) => (
              <span
                key={option.label}
                className={styles.face}
                data-current={index === selected ? "" : undefined}
                style={{ "--position": index } as CSSProperties}
              >
                {option.label}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          className={styles.turn}
          data-end="start"
          aria-label={previousLabel}
          onClick={() => onSelect(wrap(selected - 1))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 15l6-6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.turn}
          data-end="end"
          aria-label={nextLabel}
          onClick={() => onSelect(wrap(selected + 1))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </fieldset>
  );
}

export default IntroductionLookingForReel;
