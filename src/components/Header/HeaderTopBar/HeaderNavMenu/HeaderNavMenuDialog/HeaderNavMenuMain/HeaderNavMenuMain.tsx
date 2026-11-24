import {
  LANGUAGE_LABELS,
  NAV_MENU_LABELS,
  THEME_LABELS,
} from "../../../../../../content/headerControls";
import {
  CURRENT_LANGUAGE,
  getLanguage,
} from "../../../../../../i18n/languages";
import { usePreferences } from "../../../../../../state/preferences";
import HeaderNavMenuScreen from "../../HeaderNavMenuScreen/HeaderNavMenuScreen";
import HeaderNavMenuItem from "../../HeaderNavMenuItem/HeaderNavMenuItem";
import HeaderNavMenuSearchEntry from "./HeaderNavMenuSearchEntry/HeaderNavMenuSearchEntry";
import HeaderNavMenuSections from "./HeaderNavMenuSections/HeaderNavMenuSections";
import styles from "./HeaderNavMenuMain.module.scss";

// Top level of the phone menu: the search entry, the seven section links, then one row per
// settings submenu showing its current setting.
function HeaderNavMenuMain() {
  const theme = usePreferences((state) => state.theme);
  const language = getLanguage(CURRENT_LANGUAGE);

  return (
    <HeaderNavMenuScreen
      title={NAV_MENU_LABELS.title}
      transitionName="nav-menu-title-main"
    >
      <HeaderNavMenuSearchEntry />
      <HeaderNavMenuSections />
      <ul className={styles.items}>
        <li>
          <HeaderNavMenuItem
            screen="theme"
            label={THEME_LABELS.title}
            value={THEME_LABELS.options[theme]}
          />
        </li>
        <li>
          <HeaderNavMenuItem
            screen="language"
            label={LANGUAGE_LABELS.title}
            value={
              <span lang={language.code} dir={language.dir}>
                {language.name}
              </span>
            }
          />
        </li>
      </ul>
    </HeaderNavMenuScreen>
  );
}

export default HeaderNavMenuMain;
