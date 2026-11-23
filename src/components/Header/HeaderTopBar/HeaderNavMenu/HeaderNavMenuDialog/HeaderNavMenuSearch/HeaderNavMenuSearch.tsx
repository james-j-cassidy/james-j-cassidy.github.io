import { useId, useState, type FormEvent } from "react";
import { SEARCH_LABELS } from "../../../../../../content/headerControls";
import HeaderNavMenuScreen from "../../HeaderNavMenuScreen/HeaderNavMenuScreen";
import { SEARCH_FIELD_TRANSITION } from "../../navMenuContext";
import styles from "./HeaderNavMenuSearch.module.scss";

// Search screen: the field is the header (next to Back), and the whole screen below is
// for results and search features. The search index is not built yet, so for now the
// body shows a hint, and submitting does nothing beyond preventing a page reload.
function HeaderNavMenuSearch() {
  const inputId = useId();
  const [query, setQuery] = useState("");

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
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={SEARCH_LABELS.placeholder}
            autoComplete="off"
            enterKeyHint="search"
            data-autofocus
          />
        </form>
      }
    >
      <p className={styles.hint}>{SEARCH_LABELS.hint}</p>
    </HeaderNavMenuScreen>
  );
}

export default HeaderNavMenuSearch;
