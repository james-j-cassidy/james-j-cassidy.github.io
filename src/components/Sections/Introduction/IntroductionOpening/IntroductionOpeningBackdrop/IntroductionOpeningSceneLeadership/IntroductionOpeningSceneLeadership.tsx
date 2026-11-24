import type { CSSProperties } from "react";
import styles from "./IntroductionOpeningSceneLeadership.module.scss";

// The leadership scene: a team network. A lead node at the center with orbit rings,
// eight team members around it, each wired to the lead and to their neighbors. Builds
// itself once when it appears: the lead powers up, the links run outward, then each
// member joins in turn around the circle.
function IntroductionOpeningSceneLeadership() {
  return (
    <svg
      className={styles.scene}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <g className={styles.orbits}>
        <ellipse cx="800" cy="450" rx="170" ry="130" />
        <ellipse cx="800" cy="450" rx="600" ry="340" />
        <ellipse cx="800" cy="450" rx="760" ry="440" />
      </g>
      <path
        className={styles.spokes}
        pathLength={1}
        d="M800 450L1354.3 580.1 M800 450L1029.6 764.1 M800 450L570.4 764.1 M800 450L245.7 580.1 M800 450L245.7 319.9 M800 450L570.4 135.9 M800 450L1029.6 135.9 M800 450L1354.3 319.9"
      />
      <path
        className={styles.ring}
        pathLength={1}
        d="M1354.3 580.1 L1029.6 764.1 L570.4 764.1 L245.7 580.1 L245.7 319.9 L570.4 135.9 L1029.6 135.9 L1354.3 319.9Z"
      />
      <g className={styles.leadNode}>
        <polygon
          points="800.0,380.0 860.6,415.0 860.6,485.0 800.0,520.0 739.4,485.0 739.4,415.0"
          className={styles.hex}
        />
        <circle cx="800" cy="440" r="11" className={styles.glyph} />
        <path
          d="M783 474c0-10 7-15 17-15s17 5 17 15"
          className={styles.glyph}
        />
      </g>
      <g
        className={styles.member}
        style={{ "--i": 0 } as CSSProperties}
        transform="translate(1354.3 580.1)"
      >
        <g className={styles.pop}>
          <circle r="30" className={styles.badge} />
          <circle cy="-7" r="7" className={styles.glyph} />
          <path d="M-9 12c0-6 4-9 9-9s9 3 9 9" className={styles.glyph} />
        </g>
      </g>
      <g
        className={styles.member}
        style={{ "--i": 1 } as CSSProperties}
        transform="translate(1029.6 764.1)"
      >
        <g className={styles.pop}>
          <circle r="30" className={styles.badge} />
          <circle cy="-7" r="7" className={styles.glyph} />
          <path d="M-9 12c0-6 4-9 9-9s9 3 9 9" className={styles.glyph} />
        </g>
      </g>
      <g
        className={styles.member}
        style={{ "--i": 2 } as CSSProperties}
        transform="translate(570.4 764.1)"
      >
        <g className={styles.pop}>
          <circle r="30" className={styles.badge} />
          <circle cy="-7" r="7" className={styles.glyph} />
          <path d="M-9 12c0-6 4-9 9-9s9 3 9 9" className={styles.glyph} />
        </g>
      </g>
      <g
        className={styles.member}
        style={{ "--i": 3 } as CSSProperties}
        transform="translate(245.7 580.1)"
      >
        <g className={styles.pop}>
          <circle r="30" className={styles.badge} />
          <circle cy="-7" r="7" className={styles.glyph} />
          <path d="M-9 12c0-6 4-9 9-9s9 3 9 9" className={styles.glyph} />
        </g>
      </g>
      <g
        className={styles.member}
        style={{ "--i": 4 } as CSSProperties}
        transform="translate(245.7 319.9)"
      >
        <g className={styles.pop}>
          <circle r="30" className={styles.badge} />
          <circle cy="-7" r="7" className={styles.glyph} />
          <path d="M-9 12c0-6 4-9 9-9s9 3 9 9" className={styles.glyph} />
        </g>
      </g>
      <g
        className={styles.member}
        style={{ "--i": 5 } as CSSProperties}
        transform="translate(570.4 135.9)"
      >
        <g className={styles.pop}>
          <circle r="30" className={styles.badge} />
          <circle cy="-7" r="7" className={styles.glyph} />
          <path d="M-9 12c0-6 4-9 9-9s9 3 9 9" className={styles.glyph} />
        </g>
      </g>
      <g
        className={styles.member}
        style={{ "--i": 6 } as CSSProperties}
        transform="translate(1029.6 135.9)"
      >
        <g className={styles.pop}>
          <circle r="30" className={styles.badge} />
          <circle cy="-7" r="7" className={styles.glyph} />
          <path d="M-9 12c0-6 4-9 9-9s9 3 9 9" className={styles.glyph} />
        </g>
      </g>
      <g
        className={styles.member}
        style={{ "--i": 7 } as CSSProperties}
        transform="translate(1354.3 319.9)"
      >
        <g className={styles.pop}>
          <circle r="30" className={styles.badge} />
          <circle cy="-7" r="7" className={styles.glyph} />
          <path d="M-9 12c0-6 4-9 9-9s9 3 9 9" className={styles.glyph} />
        </g>
      </g>
    </svg>
  );
}

export default IntroductionOpeningSceneLeadership;
