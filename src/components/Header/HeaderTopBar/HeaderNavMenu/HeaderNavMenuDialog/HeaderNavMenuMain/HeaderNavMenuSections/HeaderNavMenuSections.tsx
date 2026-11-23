import {
  SECTIONS,
  SECTION_LABELS,
} from "../../../../../../../content/sections";
import { useCurrentSection } from "../../../../../../../hooks/useCurrentSection";
import { followSectionLink } from "../../../../../../../state/navigation";
import SectionIcon from "../../../../../SectionIcon/SectionIcon";
import { useNavMenu } from "../../../navMenuContext";
import styles from "./HeaderNavMenuSections.module.scss";

// Phones: the six section links (the tabs' place on wider screens; only one of the two is
// ever shown, so the page keeps a single navigation landmark). Picking one closes the menu
// and goes to that section. The current section is marked with aria-current and a lit row.
function HeaderNavMenuSections() {
  const { closeMenu } = useNavMenu();
  const currentIndex = useCurrentSection();

  return (
    <nav aria-label={SECTION_LABELS.nav}>
      <ul className={styles.list}>
        {SECTIONS.map((section, index) => (
          <li key={section.id}>
            <a
              className={styles.link}
              href={`#${section.id}`}
              aria-current={index === currentIndex ? "location" : undefined}
              onClick={(event) => {
                closeMenu();
                followSectionLink(event, index);
              }}
            >
              <SectionIcon name={section.icon} className={styles.icon} />
              <span>{section.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HeaderNavMenuSections;
