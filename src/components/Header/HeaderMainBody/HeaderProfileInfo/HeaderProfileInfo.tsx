import { useId } from "react";
import type { Profile } from "../../../../content/profile";
import styles from "./HeaderProfileInfo.module.scss";

interface HeaderProfileInfoProps {
  profile: Profile;
}

// Name (the page's h1), title, highlight badge and skills line.
// Highlights and skills are real lists, so screen readers announce the item count;
// the separators between items are CSS-only and hidden from assistive technology.
function HeaderProfileInfo({ profile }: HeaderProfileInfoProps) {
  return (
    <div className={styles.profileInfo}>
      <h1 className={styles.name}>{profile.name}</h1>
      <p className={styles.title}>{profile.title}</p>

      {/* Badge: an angled plate, with a thin line running out from each point. */}
      <div className={styles.highlightsRow}>
        <ul className={styles.highlights}>
          {profile.highlights.map((highlight) => (
            <li key={highlight.text} className={styles.highlight}>
              {highlight.icon === "usaf" && <UsafSymbol />}
              {highlight.text}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.skillGroups}>
        {profile.skillGroups.map((group) => (
          <ul key={group.join()} className={styles.skills}>
            {group.map((skill) => (
              <li key={skill} className={styles.skill}>
                {skill}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

// Air Force symbol, traced as SVG from the reference James supplied: silver wings, star and
// lower facets with blue panels. Decorative; the text beside it says "USAF Veteran".
// Left-side panels are drawn once and mirrored for the right side.
const USAF_OUTLINE =
  "21,2 15,13 27,40 38.5,45.6 32,53 50,66 68,53 61.5,45.6 73,40 85,13 79,2 70,21 50,36 30,21";
const USAF_SIDE_PANELS = [
  "21,4.5 17,12.3 28,19.5",
  "16.8,14.2 29,21.7 50,37.5 50,41 21.5,24.3",
  "22.4,26.6 50,43 50,47 38,44.2 28.4,39.2",
  "34.6,52.6 39.6,47.6 43.6,51.3 41.8,57.6",
];
const USAF_BOTTOM_PANEL = "44.5,60.5 50,56.5 55.5,60.5 50,64";
const USAF_STAR =
  "50,36 52.9,45 62.4,45 54.8,50.5 57.6,59.5 50,54 42.4,59.5 45.2,50.5 37.6,45 47.1,45";

function UsafSymbol() {
  // Gradient ids must be unique in the document; strip characters awkward inside url(#...).
  const idBase = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const silver = `url(#${idBase}-silver)`;
  const blue = `url(#${idBase}-blue)`;

  return (
    <svg
      className={styles.usafSymbol}
      viewBox="13 0 74 68"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${idBase}-silver`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f5f9" />
          <stop offset="1" stopColor="#97a3b3" />
        </linearGradient>
        <linearGradient id={`${idBase}-blue`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f5bc7" />
          <stop offset="1" stopColor="#0d2a6e" />
        </linearGradient>
      </defs>
      <polygon
        className={styles.usafEdge}
        points={USAF_OUTLINE}
        fill={silver}
      />
      <g fill={blue}>
        {USAF_SIDE_PANELS.map((points) => (
          <polygon key={points} points={points} />
        ))}
        <g transform="matrix(-1 0 0 1 100 0)">
          {USAF_SIDE_PANELS.map((points) => (
            <polygon key={points} points={points} />
          ))}
        </g>
        <polygon points={USAF_BOTTOM_PANEL} />
      </g>
      <polygon className={styles.usafEdge} points={USAF_STAR} fill={silver} />
      <circle className={styles.usafEdge} cx="50" cy="49" r="3.3" fill={blue} />
    </svg>
  );
}

export default HeaderProfileInfo;
