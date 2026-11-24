import { useId } from "react";
import {
  LOGO_BAR,
  LOGO_C,
  LOGO_FLARE,
  LOGO_J,
  LOGO_RING,
  LOGO_RING_FRONT,
  LOGO_VIEW_BOX,
} from "./logoShapes";
import styles from "./HeaderLogo.module.scss";

interface HeaderLogoProps {
  homeHref: string;
  label: string;
}

// The JC logo (traced from James's artwork, see logoShapes): italic J and C in brushed
// metal, the C's base in cyan, and a glowing orbit ring that passes behind the letters
// and back in front of them, with a flare where it catches the light. The letters take
// theme colors (silver on dark, dark steel on light); the ring and base stay cyan.
function HeaderLogo({ homeHref, label }: HeaderLogoProps) {
  // Gradient, filter and clip ids must be unique in the document; strip characters
  // that are awkward inside url(#...).
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = (name: string) => `url(#${id}-${name})`;

  return (
    <a className={styles.logo} href={homeHref} aria-label={label}>
      <svg
        className={styles.mark}
        viewBox={LOGO_VIEW_BOX}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={`${id}-j`}
            gradientUnits="userSpaceOnUse"
            x1="360"
            y1="420"
            x2="600"
            y2="800"
          >
            <stop className={styles.letterLight} offset="0" />
            <stop className={styles.letterMid} offset="0.64" />
            <stop className={styles.letterShade} offset="0.8" />
            <stop className={styles.letterMid} offset="1" />
          </linearGradient>
          <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0" y2="1">
            <stop className={styles.letterLight} offset="0" />
            <stop className={styles.letterMid} offset="0.7" />
            <stop className={styles.letterShade} offset="1" />
          </linearGradient>
          <linearGradient
            id={`${id}-ring`}
            gradientUnits="userSpaceOnUse"
            x1="186"
            y1="0"
            x2="1072"
            y2="0"
          >
            <stop offset="0" stopColor="#00d0fd" />
            <stop offset="0.13" stopColor="#0080fc" />
            <stop offset="0.3" stopColor="#02b8ff" />
            <stop offset="0.7" stopColor="#08d8f6" />
            <stop offset="1" stopColor="#10f8ff" />
          </linearGradient>
          <linearGradient
            id={`${id}-bar`}
            gradientUnits="userSpaceOnUse"
            x1="700"
            y1="0"
            x2="940"
            y2="0"
          >
            <stop offset="0" stopColor="#01aeff" />
            <stop offset="1" stopColor="#00f6fe" />
          </linearGradient>
          <radialGradient id={`${id}-flare`}>
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.25" stopColor="#bffcff" />
            <stop offset="1" stopColor="#19e0ff" stopOpacity="0" />
          </radialGradient>
          <filter
            id={`${id}-glow`}
            x="-10%"
            y="-20%"
            width="120%"
            height="140%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={`${id}-front`}>
            <polygon points={LOGO_RING_FRONT} />
          </clipPath>
        </defs>
        <path d={LOGO_BAR} fill={ref("bar")} />
        <path
          d={LOGO_RING}
          fill={ref("ring")}
          fillRule="evenodd"
          filter={ref("glow")}
        />
        <path d={LOGO_J} fill={ref("j")} />
        <path d={LOGO_C} fill={ref("c")} />
        {/* The ring again, only where it passes in front of the letters. */}
        <path
          d={LOGO_RING}
          fill={ref("ring")}
          fillRule="evenodd"
          clipPath={ref("front")}
        />
        <circle
          cx={LOGO_FLARE.cx}
          cy={LOGO_FLARE.cy}
          r="44"
          fill={ref("flare")}
        />
      </svg>
    </a>
  );
}

export default HeaderLogo;
