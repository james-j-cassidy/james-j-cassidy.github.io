import styles from "./HeaderTabBar.module.scss";
import HeaderCurrentTab from "./HeaderCurrentTab/HeaderCurrentTab";
import HeaderTabs from "./HeaderTabs/HeaderTabs";
import HeaderTabLocation from "./HeaderTabLocation/HeaderTabLocation";
import { SECTIONS, SECTION_LABELS } from "../../../content/sections";
import { useCurrentSection } from "../../../hooks/useCurrentSection";

// Bottom bar of the header.
// Wider screens: the seven section tabs. Phones: the current section's name (the tabs
// themselves are in the phone menu). Touch devices also get the location marks, which
// show where the visitor is in the left-to-right story when swiping.
// Each part shows or hides itself in its own styles.
function HeaderTabBar() {
  const currentIndex = useCurrentSection();

  return (
    <div className={styles.tabBar}>
      <HeaderTabs
        sections={SECTIONS}
        currentIndex={currentIndex}
        label={SECTION_LABELS.nav}
      />
      <HeaderCurrentTab
        sections={SECTIONS}
        currentIndex={currentIndex}
        locationOf={SECTION_LABELS.locationOf}
      />
      <HeaderTabLocation count={SECTIONS.length} currentIndex={currentIndex} />
    </div>
  );
}

export default HeaderTabBar;
