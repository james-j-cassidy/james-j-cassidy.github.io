import styles from "./IntroductionBeyondWorkStarfield.module.scss";

interface IntroductionBeyondWorkStarfieldProps {
  jump: number; // one more per star chosen; each makes one short warp jump
}

// A fixed, repeatable scatter (the same sky on every visit).
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const random = seeded(20261123);
const STARS = Array.from({ length: 150 }, () => ({
  x: random() * 1600,
  y: random() * 900,
  r: 0.6 + random() * 1.8,
}));

// Streaks run outward from the center along rays, one path each; each is drawn from its
// inner end outward as far as --streak allows (0 = a point, 1 = full length).
const STREAKS = Array.from({ length: 64 }, (_, index) => {
  const angle = (index / 64) * Math.PI * 2 + random() * 0.08;
  const inner = 120 + random() * 260;
  const outer = inner + 260 + random() * 420;
  const x1 = 800 + Math.cos(angle) * inner;
  const y1 = 450 + Math.sin(angle) * inner;
  const x2 = 800 + Math.cos(angle) * outer;
  const y2 = 450 + Math.sin(angle) * outer;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
});

// The star map's full-stage background: deep space with a nebula glow and a fixed field
// of stars. Warp streaks stretch out of the stars when arriving or leaving at speed
// (from the scroll) and on each short jump between stars. Decorative: hidden from
// screen readers.
function IntroductionBeyondWorkStarfield({
  jump,
}: IntroductionBeyondWorkStarfieldProps) {
  return (
    <div className={styles.space} aria-hidden="true">
      <svg
        className={styles.sky}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="beyond-work-nebula" cx="0.62" cy="0.4" r="0.6">
            <stop offset="0" className={styles.nebulaCore} />
            <stop offset="1" className={styles.nebulaEdge} />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#beyond-work-nebula)" />
        <g className={styles.stars}>
          {STARS.map((star, index) => (
            <circle
              key={index}
              cx={star.x.toFixed(1)}
              cy={star.y.toFixed(1)}
              r={star.r.toFixed(2)}
            />
          ))}
        </g>
        <g className={styles.streaks}>
          {STREAKS.map((d) => (
            <path key={d} d={d} pathLength={1} />
          ))}
        </g>
        <g
          key={jump}
          className={styles.jump}
          data-jump={jump > 0 ? "" : undefined}
        >
          {STREAKS.map((d) => (
            <path key={d} d={d} pathLength={1} />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default IntroductionBeyondWorkStarfield;
