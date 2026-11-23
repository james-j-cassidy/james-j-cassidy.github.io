import { useId } from "react";
import styles from "./HeaderLogo.module.scss";

interface HeaderLogoProps {
  homeHref: string;
  label: string;
}

// Italic "JC" monogram with a swoosh beneath, drawn as filled paths (no font dependency).
// Gradient stop colors come from theme tokens via the module classes, so it follows every theme.
function HeaderLogo({ homeHref, label }: HeaderLogoProps) {
  // Gradient ids must be unique in the document; strip characters that are awkward inside url(#...).
  const idBase = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const letterGradientId = `${idBase}-letters`;
  const swooshGradientId = `${idBase}-swoosh`;

  return (
    <a className={styles.logo} href={homeHref} aria-label={label}>
      <svg
        className={styles.mark}
        viewBox="10 8 100 68"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={letterGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop className={styles.letterTop} offset="0" />
            <stop className={styles.letterBottom} offset="1" />
          </linearGradient>
          <linearGradient id={swooshGradientId} x1="0" y1="0" x2="1" y2="0">
            <stop className={styles.swooshStart} offset="0" />
            <stop className={styles.swooshEnd} offset="1" />
          </linearGradient>
        </defs>
        <g fill={`url(#${letterGradientId})`}>
          <path d="M50 13 L67 13 L57 50 C54 62 42 66 28 64 C18 63 12 58 14 54 C16 49 21 43 28 38 C24 44 23 49 26 52 C30 55 38 54 41 47 Z" />
          <path d="M107 19 C101 12 91 10 82 11 C68 13 61 26 60 39 C59 51 65 57 75 57 C80 57 84 55 87 52 L84 45 C82 48 80 49 78 49 C73 49 71 45 72 39 C73 29 78 22 85 22 C89 22 92 24 95 27 Z" />
        </g>
        <path
          fill={`url(#${swooshGradientId})`}
          d="M14 72 C45 79 92 73 110 34 C94 62 52 68 14 72 Z"
        />
      </svg>
    </a>
  );
}

export default HeaderLogo;
