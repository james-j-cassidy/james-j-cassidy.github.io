import type { Skill } from "../../../../content/skills";
import styles from "./HeaderSkillSummary.module.scss";

interface HeaderSkillSummaryProps {
  skills: readonly Skill[];
  selectedIndex: number;
  panelId: string;
  labelledBy: string;
  // "off" while rotating, so screen readers are not interrupted every few seconds;
  // "polite" once paused, so a skill the user picks is announced.
  live: "off" | "polite";
  fullPageHref: string;
  // Hidden text after the name, so the link's purpose is clear on its own.
  fullPageSuffix: string;
  // Visible after the name on phones, where the summary text is hidden.
  learnMoreLabel: string;
}

// Tab panel for the selected skill on the wheel.
// Every skill is rendered into the same grid cell, and only the selected one is visible.
// The card therefore always sizes to its largest summary (in any language), so it never
// overflows and the controls below never jump as skills change.
// Phones: a single row. The summary text is hidden and the name link reads
// "<skill> Learn more", leading to the skill's full page.
function HeaderSkillSummary({
  skills,
  selectedIndex,
  panelId,
  labelledBy,
  live,
  fullPageHref,
  fullPageSuffix,
  learnMoreLabel,
}: HeaderSkillSummaryProps) {
  return (
    <div className={styles.summary}>
      <div className={styles.stack}>
        {skills.map((skill, index) =>
          index === selectedIndex ? (
            <div
              key={skill.slug}
              className={styles.panel}
              id={panelId}
              role="tabpanel"
              aria-labelledby={labelledBy}
              aria-live={live}
            >
              {/* The name links to the skill's full page. */}
              <h2 className={styles.name}>
                <a className={styles.nameLink} href={fullPageHref}>
                  {skill.name}
                  <span className={styles.learnMore}>{learnMoreLabel}</span>
                  <span className={styles.fullPageSuffix}>
                    {fullPageSuffix}
                  </span>
                  <svg
                    className={styles.nameArrow}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </h2>
              <p className={styles.text}>{skill.summary}</p>
            </div>
          ) : (
            // Sizing copy only: invisible, and hidden from assistive technology.
            <div key={skill.slug} className={styles.sizer} aria-hidden="true">
              <p className={styles.name}>
                {skill.name}
                <span className={styles.learnMore}>{learnMoreLabel}</span>
                <svg className={styles.nameArrow} viewBox="0 0 24 24" />
              </p>
              <p className={styles.text}>{skill.summary}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default HeaderSkillSummary;
