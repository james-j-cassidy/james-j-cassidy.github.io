import styles from "./HeaderTopBar.module.scss";
import HeaderLogo from "./HeaderLogo/HeaderLogo";
import HeaderSearch from "./HeaderSearch/HeaderSearch";
import HeaderThemeSelector from "./HeaderThemeSelector/HeaderThemeSelector";
import HeaderLanguageSelector from "./HeaderLanguageSelector/HeaderLanguageSelector";
import HeaderNavMenu from "./HeaderNavMenu/HeaderNavMenu";
import {
  LANGUAGE_LABELS,
  SEARCH_LABELS,
  THEME_LABELS,
} from "../../../content/headerControls";
import { CURRENT_LANGUAGE } from "../../../i18n/languages";

// Wider screens: logo, search, theme and language across the bar.
// Phones: logo and the hamburger, whose full-screen menu holds search, theme and language.
// Only one set is ever displayed, so screen readers meet each control once.
function HeaderTopBar() {
  return (
    <div className={styles.topBar}>
      <HeaderLogo homeHref="/" label="James Cassidy, home" />

      <div className={styles.wideControls}>
        <HeaderSearch
          label={SEARCH_LABELS.label}
          placeholder={SEARCH_LABELS.placeholder}
        />
        <HeaderThemeSelector
          label={THEME_LABELS.title}
          optionLabels={THEME_LABELS.options}
        />
        <HeaderLanguageSelector
          label={LANGUAGE_LABELS.title}
          currentLanguage={CURRENT_LANGUAGE}
        />
      </div>

      <HeaderNavMenu />
    </div>
  );
}

export default HeaderTopBar;
