import type { Section } from "../../../../content/sections";
import { followSectionLink } from "../../../../state/navigation";
import SectionIcon from "../../SectionIcon/SectionIcon";
import styles from "./HeaderTabs.module.scss";

interface HeaderTabsProps {
  sections: readonly Section[];
  currentIndex: number;
  label: string;
}

// Wider screens: one link per section, icon over label (hidden on phones by its own styles).
// Each tab is a cut-corner plate like the skill card; the current one is lit, glows, and
// has a lit trace under its label. This is the page's navigation landmark; on phones the
// menu's section list takes its place, so only one is ever shown. The current section is
// marked with aria-current plus a filled plate and bold text, not color alone (WCAG 1.4.1).
function HeaderTabs({ sections, currentIndex, label }: HeaderTabsProps) {
  return (
    <nav className={styles.tabs} aria-label={label}>
      <ul className={styles.list}>
        {sections.map((section, index) => (
          <li key={section.id} className={styles.item}>
            <a
              className={styles.tab}
              href={`#${section.id}`}
              aria-current={index === currentIndex ? "location" : undefined}
              onClick={(event) => followSectionLink(event, index)}
            >
              <SectionIcon name={section.icon} className={styles.icon} />
              <span className={styles.label}>{section.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HeaderTabs;
