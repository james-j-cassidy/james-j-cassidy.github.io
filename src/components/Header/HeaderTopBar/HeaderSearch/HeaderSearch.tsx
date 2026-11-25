import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { SEARCH_LABELS } from "../../../../content/headerControls";
import SiteSearchResults from "../../SiteSearch/SiteSearchResults";
import { useSiteSearch } from "../../SiteSearch/useSiteSearch";
import styles from "./HeaderSearch.module.scss";

interface HeaderSearchProps {
  label: string;
  placeholder: string;
}

// The site's search in the top bar, built on the ARIA combobox pattern: typing shows the
// matching places on the site in a list under the field, the field keeps focus and the
// arrow keys move through the results (announced as they change); Enter or a click goes
// to the result: its tab, sub-tab and part. Escape closes the list, then clears the
// field; leaving the field closes it.
function HeaderSearch({ label, placeholder }: HeaderSearchProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const search = useSiteSearch(() => {
    setOpen(false);
    inputRef.current?.blur();
  });
  const showing = open && search.query.trim().length > 0;

  // A click anywhere else closes the list.
  useEffect(() => {
    if (!showing) return;
    function outside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [showing]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      ref={rootRef}
      className={styles.search}
      role="search"
      onSubmit={handleSubmit}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <label className={styles.visuallyHidden} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.field}>
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
          ref={inputRef}
          className={styles.input}
          id={inputId}
          type="search"
          name="q"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showing}
          aria-controls={listId}
          aria-activedescendant={
            showing && search.active >= 0 ? optionId(search.active) : undefined
          }
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          value={search.query}
          onChange={(event) => {
            search.change(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              if (showing) setOpen(false);
              else search.change("");
              return;
            }
            if (!showing && event.key === "ArrowDown") setOpen(true);
            search.handleKey(event);
          }}
        />
      </div>
      <div className={styles.popup} hidden={!showing}>
        {showing && (
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
        )}
      </div>
      <p className={styles.visuallyHidden} role="status">
        {showing ? SEARCH_LABELS.found(search.results.length) : ""}
      </p>
    </form>
  );
}

export default HeaderSearch;
