import type { Section } from "../../../../content/sections";
import SectionIcon from "../../SectionIcon/SectionIcon";
import styles from "./HeaderCurrentTab.module.scss";

interface HeaderCurrentTabProps {
  sections: readonly Section[];
  currentIndex: number;
  locationOf: (position: number, total: number) => string;
}

// Phones: the current section's icon and name (hidden on wider screens by its own styles).
// Screen readers also hear the position, for example "Introduction, section 1 of 6".
function HeaderCurrentTab({
  sections,
  currentIndex,
  locationOf,
}: HeaderCurrentTabProps) {
  const section = sections[currentIndex];

  return (
    <p className={styles.currentTab}>
      <SectionIcon name={section.icon} className={styles.icon} />
      <span>{section.label}</span>
      <span className={styles.visuallyHidden}>
        {`, ${locationOf(currentIndex + 1, sections.length)}`}
      </span>
    </p>
  );
}

export default HeaderCurrentTab;
