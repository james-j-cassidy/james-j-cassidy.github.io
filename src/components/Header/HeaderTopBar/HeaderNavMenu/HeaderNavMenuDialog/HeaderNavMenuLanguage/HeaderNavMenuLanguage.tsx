import { LANGUAGE_LABELS } from "../../../../../../content/headerControls";
import { CURRENT_LANGUAGE } from "../../../../../../i18n/languages";
import HeaderNavMenuScreen from "../../HeaderNavMenuScreen/HeaderNavMenuScreen";
import LanguageOptionList from "../../../HeaderLanguageSelector/LanguageOptionList";

// Language screen: the same language links as the top bar's dropdown, in large rows.
function HeaderNavMenuLanguage() {
  return (
    <HeaderNavMenuScreen
      title={LANGUAGE_LABELS.title}
      transitionName="nav-menu-title-language"
    >
      <LanguageOptionList currentLanguage={CURRENT_LANGUAGE} variant="menu" />
    </HeaderNavMenuScreen>
  );
}

export default HeaderNavMenuLanguage;
