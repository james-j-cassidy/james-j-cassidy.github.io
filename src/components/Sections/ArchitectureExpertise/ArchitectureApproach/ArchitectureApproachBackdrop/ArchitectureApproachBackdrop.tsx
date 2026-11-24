import styles from "./ArchitectureApproachBackdrop.module.scss";

// The part's full-stage background: a circuit board's copper. Traces run in a repeating
// tile with pads at their ends. Decorative: hidden from screen readers.
function ArchitectureApproachBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <svg className={styles.copper} preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern
            id="approach-copper"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            <path
              className={styles.trace}
              d="M0 40H50L70 60H120M80 0V30L100 50V100L120 120H160M40 160V120L20 100H0M130 0V20L150 40V80"
            />
            <g className={styles.pads}>
              <circle cx="120" cy="60" r="5" />
              <circle cx="150" cy="80" r="5" />
              <circle cx="0" cy="100" r="5" />
              <circle cx="50" cy="40" r="3" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#approach-copper)" />
      </svg>
    </div>
  );
}

export default ArchitectureApproachBackdrop;
