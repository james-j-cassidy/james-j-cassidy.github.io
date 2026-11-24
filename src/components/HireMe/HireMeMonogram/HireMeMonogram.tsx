import { useId } from "react";
import {
  LOGO_BAR,
  LOGO_C,
  LOGO_J,
  LOGO_RING,
} from "../../Header/HeaderTopBar/HeaderLogo/logoShapes";
import styles from "./HireMeMonogram.module.scss";

// The logo's own drawing starts at (168, 372) and is 922 × 512; each mark is drawn at
// 16% of that.
const MARK = "translate(-168 -372)";
const SCALE = 0.16;
const TILE_W = 260; // two marks per tile, offset row to row like brickwork
const TILE_H = 150;

function Mark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${SCALE}) ${MARK}`}>
      <path d={LOGO_RING} fillRule="evenodd" />
      <path d={LOGO_J} />
      <path d={LOGO_C} />
      <path d={LOGO_BAR} />
    </g>
  );
}

// The JC monogram repeated across the form's background, tilted and faded far back,
// like a luxury monogram: the brand everywhere, competing with nothing (it sits under
// the fields' own solid backgrounds, so text contrast is never touched). Decorative.
function HireMeMonogram() {
  const patternId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-monogram`;

  return (
    <svg className={styles.monogram} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id={patternId}
          width={TILE_W}
          height={TILE_H}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-14)"
        >
          <Mark x={10} y={10} />
          <Mark x={10 + TILE_W / 2} y={10 + TILE_H / 2} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export default HireMeMonogram;
