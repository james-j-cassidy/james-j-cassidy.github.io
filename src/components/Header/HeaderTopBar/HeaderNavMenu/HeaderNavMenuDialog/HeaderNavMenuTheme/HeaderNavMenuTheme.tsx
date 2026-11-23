import { THEME_LABELS } from "../../../../../../content/headerControls";
import HeaderNavMenuScreen from "../../HeaderNavMenuScreen/HeaderNavMenuScreen";
import ThemeOptionList from "../../../HeaderThemeSelector/ThemeOptionList";

// Theme screen: the same radio group as the top bar's dropdown, in large rows.
// A pick applies at once and the screen stays open, so themes can be compared.
function HeaderNavMenuTheme() {
  return (
    <HeaderNavMenuScreen
      title={THEME_LABELS.title}
      transitionName="nav-menu-title-theme"
    >
      <ThemeOptionList
        legend={THEME_LABELS.title}
        optionLabels={THEME_LABELS.options}
        variant="menu"
      />
    </HeaderNavMenuScreen>
  );
}

export default HeaderNavMenuTheme;
