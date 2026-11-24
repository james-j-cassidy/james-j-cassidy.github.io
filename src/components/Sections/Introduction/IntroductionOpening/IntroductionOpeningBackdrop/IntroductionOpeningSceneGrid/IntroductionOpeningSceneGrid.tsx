import styles from "./IntroductionOpeningSceneGrid.module.scss";

// The opening's starting scene: a neon grid floor running to a glowing horizon, a
// targeting reticle above it, HUD corner brackets and data bars at the sides.
function IntroductionOpeningSceneGrid() {
  return (
    <svg
      className={styles.scene}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="opening-grid-sky" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" className={styles.glowStop} />
          <stop offset="1" className={styles.clearStop} />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="180"
        width="1600"
        height="340"
        fill="url(#opening-grid-sky)"
      />
      <path
        className={styles.floor}
        d="M800 520L-1600 900 M800 520L-1440 900 M800 520L-1280 900 M800 520L-1120 900 M800 520L-960 900 M800 520L-800 900 M800 520L-640 900 M800 520L-480 900 M800 520L-320 900 M800 520L-160 900 M800 520L0 900 M800 520L160 900 M800 520L320 900 M800 520L480 900 M800 520L640 900 M800 520L800 900 M800 520L960 900 M800 520L1120 900 M800 520L1280 900 M800 520L1440 900 M800 520L1600 900 M800 520L1760 900 M800 520L1920 900 M800 520L2080 900 M800 520L2240 900 M800 520L2400 900 M800 520L2560 900 M800 520L2720 900 M800 520L2880 900 M800 520L3040 900 M800 520L3200 900"
      />
      <path
        className={styles.floor}
        d="M0 524.3H1600 M0 535.1H1600 M0 551.3H1600 M0 572.6H1600 M0 598.6H1600 M0 629.1H1600 M0 664.0H1600 M0 703.2H1600 M0 746.4H1600 M0 793.7H1600 M0 844.9H1600 M0 900.0H1600"
      />
      <path className={styles.horizon} d="M0 520H1600" />
      <g className={styles.reticle}>
        <circle cx="800" cy="330" r="120" className={styles.dashed} />
        <circle cx="800" cy="330" r="150" />
        <circle cx="800" cy="330" r="6" className={styles.core} />
        <path d="M950.0 330.0L990.0 330.0 M938.6 410.0L952.4 418.0 M880.0 468.6L888.0 482.4 M800.0 480.0L800.0 520.0 M720.0 468.6L712.0 482.4 M661.4 410.0L647.6 418.0 M650.0 330.0L610.0 330.0 M661.4 250.0L647.6 242.0 M720.0 191.4L712.0 177.6 M800.0 180.0L800.0 140.0 M880.0 191.4L888.0 177.6 M938.6 250.0L952.4 242.0" />
        <path d="M800 230V280M800 380V430M700 330H750M850 330H900" />
      </g>
      <path
        className={styles.brackets}
        d="M60 140V60H140M1460 60H1540V140M1540 760V840H1460M140 840H60V760"
      />
      <g className={styles.bars}>
        <rect x="90" y="220" width="150" height="14" />
        <rect x="90" y="254" width="90" height="14" />
        <rect x="90" y="288" width="190" height="14" />
        <rect x="90" y="322" width="120" height="14" />
        <rect x="90" y="356" width="60" height="14" />
        <rect x="90" y="390" width="170" height="14" />
        <rect x="1400" y="220" width="110" height="14" />
        <rect x="1330" y="254" width="180" height="14" />
        <rect x="1440" y="288" width="70" height="14" />
        <rect x="1350" y="322" width="160" height="14" />
        <rect x="1380" y="356" width="130" height="14" />
        <rect x="1420" y="390" width="90" height="14" />
      </g>
    </svg>
  );
}

export default IntroductionOpeningSceneGrid;
