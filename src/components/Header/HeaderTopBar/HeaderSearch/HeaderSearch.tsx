import { useId, type FormEvent } from "react";
import styles from "./HeaderSearch.module.scss";

interface HeaderSearchProps {
  label: string;
  placeholder: string;
}

// Search field only. The build-time index and results are not built yet,
// so submitting does nothing beyond preventing a page reload.
function HeaderSearch({ label, placeholder }: HeaderSearchProps) {
  const inputId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className={styles.search} role="search" onSubmit={handleSubmit}>
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
          className={styles.input}
          id={inputId}
          type="search"
          name="q"
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>
    </form>
  );
}

export default HeaderSearch;
