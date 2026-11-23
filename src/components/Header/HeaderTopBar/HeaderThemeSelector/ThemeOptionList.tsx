import { useId, type MouseEvent } from "react";
import {
  usePreferences,
  type ThemePreference,
} from "../../../../state/preferences";
import ThemeIcon from "./ThemeIcon";
import styles from "./ThemeOptionList.module.scss";

const THEME_ORDER: readonly ThemePreference[] = ["system", "light", "dark"];

interface ThemeOptionListProps {
  legend: string;
  optionLabels: Record<ThemePreference, string>;
  // "dropdown": compact rows in the top bar's dropdown. "menu": large rows on a phone menu screen.
  variant: "dropdown" | "menu";
  onOptionClick?: (event: MouseEvent<HTMLInputElement>) => void;
}

// The theme choices as a native radio group: arrow keys move between options and screen
// readers announce the group and the checked option. Picking one applies it at once
// (the user asked for it, so WCAG 3.2.5 is met).
function ThemeOptionList({
  legend,
  optionLabels,
  variant,
  onOptionClick,
}: ThemeOptionListProps) {
  const theme = usePreferences((state) => state.theme);
  const setTheme = usePreferences((state) => state.setTheme);
  const groupName = useId();

  return (
    <fieldset className={styles.group} data-variant={variant}>
      <legend className={styles.legend}>{legend}</legend>
      {THEME_ORDER.map((option) => (
        <label key={option} className={styles.option}>
          <input
            className={styles.radio}
            type="radio"
            name={groupName}
            value={option}
            checked={theme === option}
            onChange={() => setTheme(option)}
            onClick={onOptionClick}
          />
          <ThemeIcon theme={option} className={styles.icon} />
          <span>{optionLabels[option]}</span>
        </label>
      ))}
    </fieldset>
  );
}

export default ThemeOptionList;
