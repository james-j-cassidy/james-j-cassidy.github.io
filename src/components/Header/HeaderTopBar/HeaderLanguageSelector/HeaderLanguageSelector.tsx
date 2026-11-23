import { useId } from "react";
import { useDropdown } from "../../../../hooks/useDropdown";
import { getLanguage, type LanguageCode } from "../../../../i18n/languages";
import LanguageOptionList from "./LanguageOptionList";
import styles from "./HeaderLanguageSelector.module.scss";

interface HeaderLanguageSelectorProps {
  label: string;
  currentLanguage: LanguageCode;
}

// Top bar (wider screens): a disclosure button that reveals one link per language.
// On phones the same links live on the menu's Language screen.
function HeaderLanguageSelector({
  label,
  currentLanguage,
}: HeaderLanguageSelectorProps) {
  const { isOpen, toggle, rootRef, buttonRef, handleKeyDown, handleBlur } =
    useDropdown('a[aria-current="true"]');
  const panelId = useId();
  const current = getLanguage(currentLanguage);

  return (
    <div
      ref={rootRef}
      className={styles.selector}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <button
        ref={buttonRef}
        className={styles.button}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
      >
        {/* Accessible name reads "Language: English"; the visible text stays in the name (2.5.3). */}
        <span className={styles.visuallyHidden}>{label}: </span>
        <span lang={current.code} dir={current.dir}>
          {current.name}
        </span>
        <svg
          className={styles.chevron}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 9 L12 15 L18 9" />
        </svg>
      </button>

      {/* A plain div, not nav: the design keeps a single nav landmark for the sections. */}
      <div id={panelId} className={styles.panel} tabIndex={-1} hidden={!isOpen}>
        <LanguageOptionList currentLanguage={current.code} variant="dropdown" />
      </div>
    </div>
  );
}

export default HeaderLanguageSelector;
