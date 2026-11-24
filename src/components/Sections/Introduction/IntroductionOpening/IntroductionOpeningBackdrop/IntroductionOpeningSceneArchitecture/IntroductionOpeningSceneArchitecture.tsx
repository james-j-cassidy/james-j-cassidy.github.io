import type { CSSProperties } from "react";
import styles from "./IntroductionOpeningSceneArchitecture.module.scss";

// The architecture scene: a blueprint grid with a stack of three isometric platforms,
// wired together, services standing on top and integrations running off the sides.
// Builds itself once when it appears: the platforms draw in from the bottom up, the
// wiring connects, then the services.
function IntroductionOpeningSceneArchitecture() {
  return (
    <svg
      className={styles.scene}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="opening-blueprint"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path className={styles.blueprint} d="M40 0H0V40" />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#opening-blueprint)" />
      <g className={styles.level} style={{ "--i": 0 } as CSSProperties}>
        <path className={styles.plate} d="M800 50L1290 250L800 450L310 250Z" />
        <path
          className={styles.edge}
          pathLength={1}
          d="M800 50L1290 250L800 450L310 250Z"
        />
      </g>
      <g className={styles.level} style={{ "--i": 1 } as CSSProperties}>
        <path className={styles.plate} d="M800 250L1290 450L800 650L310 450Z" />
        <path
          className={styles.edge}
          pathLength={1}
          d="M800 250L1290 450L800 650L310 450Z"
        />
      </g>
      <g className={styles.level} style={{ "--i": 2 } as CSSProperties}>
        <path className={styles.plate} d="M800 450L1290 650L800 850L310 650Z" />
        <path
          className={styles.edge}
          pathLength={1}
          d="M800 450L1290 650L800 850L310 650Z"
        />
      </g>
      <path
        className={styles.connector}
        pathLength={1}
        d="M310 250V450 M1290 250V450 M800 450V650 M310 450V650 M1290 450V650 M800 650V850"
      />
      <path
        className={styles.flow}
        pathLength={1}
        d="M310 250H150L110 210 M310 450H150L110 410 M310 650H150L110 610 M1290 250H1450L1490 210 M1290 450H1450L1490 410 M1290 650H1450L1490 610"
      />
      <g className={styles.nodes}>
        <circle cx="310" cy="250" r="7" />
        <circle cx="1290" cy="250" r="7" />
        <circle cx="800" cy="450" r="7" />
        <circle cx="310" cy="450" r="7" />
        <circle cx="1290" cy="450" r="7" />
        <circle cx="800" cy="650" r="7" />
        <circle cx="310" cy="650" r="7" />
        <circle cx="1290" cy="650" r="7" />
        <circle cx="800" cy="850" r="7" />
      </g>
      <path
        pathLength={1}
        className={styles.service}
        style={{ "--i": 0 } as CSSProperties}
        d="M640 127L686 150L640 173L594 150Z M594 150V196L640 219L686 196V150 M640 173V219"
      />
      <path
        pathLength={1}
        className={styles.service}
        style={{ "--i": 1 } as CSSProperties}
        d="M800 77L846 100L800 123L754 100Z M754 100V146L800 169L846 146V100 M800 123V169"
      />
      <path
        pathLength={1}
        className={styles.service}
        style={{ "--i": 2 } as CSSProperties}
        d="M960 127L1006 150L960 173L914 150Z M914 150V196L960 219L1006 196V150 M960 173V219"
      />
    </svg>
  );
}

export default IntroductionOpeningSceneArchitecture;
