import { useId, type FormEvent } from "react";
import { SEARCH_LABELS } from "../../../../../../content/headerControls";
import SiteSearchResults from "../../../../SiteSearch/SiteSearchResults";
import { useSiteSearch } from "../../../../SiteSearch/useSiteSearch";
import HeaderNavMenuScreen from "../../HeaderNavMenuScreen/HeaderNavMenuScreen";
import { SEARCH_FIELD_TRANSITION, useNavMenu } from "../../navMenuContext";
import styles from "./HeaderNavMenuSearch.module.scss";

// Search screen: the field is the header (next to Back), and the whole screen below is
// for its results: the same search as the top bar's, on the ARIA combobox pattern, with
// the results listed in the screen's body. Choosing one closes the menu and goes there.
function HeaderNavMenuSearch() {
  const id = useId();
  const inputId = `${id}-input`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const { closeMenu } = useNavMenu();
  const search = useSiteSearch(closeMenu);
  const typed = search.query.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <HeaderNavMenuScreen
      title={SEARCH_LABELS.label}
      transitionName={SEARCH_FIELD_TRANSITION}
      headerContent={
        <form
          className={styles.form}
          style={{ viewTransitionName: SEARCH_FIELD_TRANSITION }}
          role="search"
          onSubmit={handleSubmit}
        >
          <label className={styles.visuallyHidden} htmlFor={inputId}>
            {SEARCH_LABELS.label}
          </label>
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5 L21 21" />
          </svg>
          <input
            className={styles.input}
            id={inputId}
            type="search"
            name="q"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={typed}
            aria-controls={listId}
            aria-activedescendant={
              typed && search.active >= 0 ? optionId(search.active) : undefined
            }
            value={search.query}
            onChange={(event) => search.change(event.target.value)}
            onKeyDown={search.handleKey}
            placeholder={SEARCH_LABELS.placeholder}
            autoComplete="off"
            enterKeyHint="search"
            data-autofocus
          />
        </form>
      }
    >
      {typed ? (
        <SiteSearchResults
          id={listId}
          optionId={optionId}
          results={search.results}
          active={search.active}
          query={search.query}
          label={SEARCH_LABELS.results}
          none={SEARCH_LABELS.none(search.query.trim())}
          onHover={search.setActive}
          onChoose={search.choose}
        />
      ) : (
        <p id={listId} className={styles.hint}>
          {SEARCH_LABELS.hint}
        </p>
      )}
      <p className={styles.visuallyHidden} role="status">
        {typed ? SEARCH_LABELS.found(search.results.length) : ""}
      </p>
    </HeaderNavMenuScreen>
  );
}

export default HeaderNavMenuSearch;
