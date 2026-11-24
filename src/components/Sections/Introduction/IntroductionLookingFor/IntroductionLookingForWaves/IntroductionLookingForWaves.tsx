import type { CSSProperties } from "react";
import styles from "./IntroductionLookingForWaves.module.scss";

interface IntroductionLookingForWavesProps {
  match: number; // 0–1
}

const PERIOD = 240; // map units per wave
const AMPLITUDE = 90;

// A sine wave across the stage and beyond (so it can slide without showing an end).
function wave(y: number): string {
  let d = `M-${PERIOD * 2} ${y}`;
  for (let x = -PERIOD * 2; x < 1600 + PERIOD * 2; x += PERIOD / 2) {
    const peak = (x / (PERIOD / 2)) % 2 === 0 ? -AMPLITUDE : AMPLITUDE;
    d += `Q${x + PERIOD / 4} ${y + peak * 1.3} ${x + PERIOD / 2} ${y}`;
  }
  return d;
}

const WAVE = wave(560);

// The compatibility scan's full-stage background: two signals across the stage, James's
// and the visitor's. The visitor's sits out of phase by as much as the opportunity does
// not fit; as the match rises it slides into step, and at a full match the two lock
// together. A faint oscilloscope grid behind. Decorative: hidden from screen readers.
function IntroductionLookingForWaves({
  match,
}: IntroductionLookingForWavesProps) {
  const offset = (1 - match) * (PERIOD / 2); // half a period apart at no match

  return (
    <div className={styles.waves} aria-hidden="true">
      <svg
        className={styles.scope}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="looking-for-scope"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path className={styles.grid} d="M80 0H0V80" />
          </pattern>
        </defs>
        <rect width="1600" height="900" fill="url(#looking-for-scope)" />
        <path className={styles.axis} d="M0 560H1600" />
        <g className={styles.signals}>
          <path className={styles.mine} d={WAVE} />
          <path
            className={styles.theirs}
            d={WAVE}
            style={{ "--offset": `${offset}px` } as CSSProperties}
          />
        </g>
      </svg>
    </div>
  );
}

export default IntroductionLookingForWaves;
