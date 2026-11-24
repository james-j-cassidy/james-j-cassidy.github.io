import styles from "./IntroductionThisSiteBlueprint.module.scss";

// Registration marks: a cross in a circle.
function mark(x: number, y: number): string {
  return `M${x - 22} ${y}H${x + 22}M${x} ${y - 22}V${y + 22}M${x + 12} ${y}a12 12 0 1 1-24 0 12 12 0 1 1 24 0`;
}

// A dimension line with end ticks and arrowheads, horizontal or vertical.
function dimension(x1: number, y1: number, x2: number, y2: number): string {
  if (y1 === y2) {
    return `M${x1} ${y1}H${x2}M${x1} ${y1 - 10}V${y1 + 10}M${x2} ${y2 - 10}V${y2 + 10}M${x1 + 14} ${y1 - 6}L${x1} ${y1}L${x1 + 14} ${y1 + 6}M${x2 - 14} ${y2 - 6}L${x2} ${y2}L${x2 - 14} ${y2 + 6}`;
  }
  return `M${x1} ${y1}V${y2}M${x1 - 10} ${y1}H${x1 + 10}M${x2 - 10} ${y2}H${x2 + 10}M${x1 - 6} ${y1 + 14}L${x1} ${y1}L${x1 + 6} ${y1 + 14}M${x2 - 6} ${y2 - 14}L${x2} ${y2}L${x2 + 6} ${y2 - 14}`;
}

const MARKS = [
  mark(60, 60),
  mark(1540, 60),
  mark(60, 840),
  mark(1540, 840),
].join("");
const DIMENSIONS = [
  dimension(140, 40, 1460, 40),
  dimension(30, 120, 30, 780),
  dimension(1570, 200, 1570, 700),
].join("");

// The inspector's full-stage background: a technical drawing. Fine and coarse grid,
// registration marks in the corners, dimension lines along the edges and a drawing's
// title block. Decorative: hidden from screen readers.
function IntroductionThisSiteBlueprint() {
  return (
    <div className={styles.blueprint} aria-hidden="true">
      <svg
        className={styles.sheet}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="site-blueprint-fine"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path className={styles.fine} d="M20 0H0V20" />
          </pattern>
          <pattern
            id="site-blueprint-coarse"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path className={styles.coarse} d="M100 0H0V100" />
          </pattern>
        </defs>
        <rect width="1600" height="900" fill="url(#site-blueprint-fine)" />
        <rect width="1600" height="900" fill="url(#site-blueprint-coarse)" />
        <path className={styles.marks} d={MARKS} />
        <path className={styles.dimensions} d={DIMENSIONS} />
        <g className={styles.titleBlock}>
          <rect x="1240" y="760" width="300" height="100" />
          <path d="M1240 795H1540M1390 795V860M1240 828H1390" />
        </g>
      </svg>
    </div>
  );
}

export default IntroductionThisSiteBlueprint;
