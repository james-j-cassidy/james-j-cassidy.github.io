import type { Profile } from "../../../../content/profile";
import UsafSymbol from "../../../UsafSymbol/UsafSymbol";
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
              {highlight.icon === "usaf" && (
                <UsafSymbol className={styles.usafSymbol} />
              )}
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

export default HeaderProfileInfo;
