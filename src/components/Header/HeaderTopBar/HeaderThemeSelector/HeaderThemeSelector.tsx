import { useId, type MouseEvent } from "react";
import { useDropdown } from "../../../../hooks/useDropdown";
import {
  usePreferences,
  type ThemePreference,
} from "../../../../state/preferences";
import ThemeIcon from "./ThemeIcon";
import ThemeOptionList from "./ThemeOptionList";
import styles from "./HeaderThemeSelector.module.scss";

interface HeaderThemeSelectorProps {
  label: string;
  optionLabels: Record<ThemePreference, string>;
}

// Top bar (wider screens): a disclosure button that reveals the theme radio group.
// On phones the same choices live on the menu's Theme screen.
function HeaderThemeSelector({
  label,
  optionLabels,
}: HeaderThemeSelectorProps) {
  const theme = usePreferences((state) => state.theme);
  const {
    isOpen,
    toggle,
    close,
    rootRef,
    buttonRef,
    handleKeyDown,
    handleBlur,
  } = useDropdown("input:checked");
  const panelId = useId();

  // A pointer click on an option picks it and closes. Arrow keys also fire click on
  // radios, but with detail 0, so keyboard users can browse themes without it closing.
  function handleOptionClick(event: MouseEvent<HTMLInputElement>) {
    if (event.detail > 0) close(true);
  }

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
        aria-label={`${label}: ${optionLabels[theme]}`}
        onClick={toggle}
      >
        <ThemeIcon theme={theme} className={styles.icon} />
        <svg
          className={styles.chevron}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 9 L12 15 L18 9" />
        </svg>
      </button>

      <div id={panelId} className={styles.panel} tabIndex={-1} hidden={!isOpen}>
        <ThemeOptionList
          legend={label}
          optionLabels={optionLabels}
          variant="dropdown"
          onOptionClick={handleOptionClick}
        />
      </div>
    </div>
  );
}

export default HeaderThemeSelector;
