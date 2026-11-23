import { LANGUAGES, type LanguageCode } from "../../../../i18n/languages";
import styles from "./LanguageOptionList.module.scss";

interface LanguageOptionListProps {
  currentLanguage: LanguageCode;
  // "dropdown": compact rows in the top bar's dropdown. "menu": large rows on a phone menu screen.
  variant: "dropdown" | "menu";
}

// One link per language URL: the language comes from the URL, so choosing one is plain
// navigation. Each name is in its own language, marked with lang (WCAG 3.1.2), and the
// current one carries aria-current plus a check mark, not color alone (1.4.1).
function LanguageOptionList({
  currentLanguage,
  variant,
}: LanguageOptionListProps) {
  return (
    <ul className={styles.list} data-variant={variant}>
      {LANGUAGES.map((language) => {
        const isCurrent = language.code === currentLanguage;
        return (
          <li key={language.code}>
            <a
              className={styles.option}
              href={language.homePath}
              hrefLang={language.code}
              lang={language.code}
              aria-current={isCurrent ? "true" : undefined}
            >
              {/* dir on the name only, so every row keeps the page's alignment. */}
              <span className={styles.name} dir={language.dir}>
                {language.name}
              </span>
              {isCurrent && (
                <svg
                  className={styles.check}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M5 12.5 L10 17.5 L19 7" />
                </svg>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default LanguageOptionList;
