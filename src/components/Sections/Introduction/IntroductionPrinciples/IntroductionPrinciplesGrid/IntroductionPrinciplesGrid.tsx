import styles from "./IntroductionPrinciplesGrid.module.scss";

interface IntroductionPrinciplesGridProps {
  surge: number; // one more per switch flipped; each sends one energy wave across
}

// Hexagons in a honeycomb, 40 units across (flat sides left and right).
const HEX = "M20 0 40 11.5V34.5L20 46 0 34.5V11.5Z";

// The principles' full-stage background: a honeycomb energy grid with conduits running
// in toward the reactor, and a glow where the reactor sits. Each time a principle's
// switch is flipped, one wave of energy rolls out across the grid, then it holds still.
// Decorative: hidden from screen readers.
function IntroductionPrinciplesGrid({
  surge,
}: IntroductionPrinciplesGridProps) {
  return (
    <div className={styles.grid} aria-hidden="true">
      <svg
        className={styles.cells}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="principles-honeycomb"
            width="40"
            height="69"
            patternUnits="userSpaceOnUse"
          >
            <path className={styles.cell} d={HEX} />
            <path
              className={styles.cell}
              d={HEX}
              transform="translate(20 34.5)"
            />
            <path
              className={styles.cell}
              d={HEX}
              transform="translate(-20 34.5)"
            />
          </pattern>
          <radialGradient id="principles-glow">
            <stop offset="0" className={styles.glowCore} />
            <stop offset="1" className={styles.glowEdge} />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#principles-honeycomb)" />
        <ellipse
          cx="560"
          cy="470"
          rx="520"
          ry="380"
          fill="url(#principles-glow)"
        />
        <path
          className={styles.conduits}
          d="M0 470H300M560 0V200M560 900V740M1600 300H1220L1100 420H860M1600 700H1240L1120 560H860"
        />
      </svg>
      <span
        key={surge}
        className={styles.wave}
        data-surge={surge > 0 ? "" : undefined}
      />
    </div>
  );
}

export default IntroductionPrinciplesGrid;
