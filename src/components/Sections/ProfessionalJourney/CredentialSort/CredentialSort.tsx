import { useId } from "react";
import {
  CREDENTIALS_LABELS,
  type CredentialSort as Sort,
} from "../../../../content/professionalJourney";
import styles from "./CredentialSort.module.scss";

interface CredentialSortProps {
  sort: Sort;
  onSort: (sort: Sort) => void;
}

// The order of the Education & credentials story, in the sub-tab bar while that story
// shows: a native select, the same size whatever is chosen, so the bar never shifts.
function CredentialSort({ sort, onSort }: CredentialSortProps) {
  const { sortLabel, sorts } = CREDENTIALS_LABELS;
  const id = useId();

  return (
    <div className={styles.sort}>
      <label className={styles.label} htmlFor={id}>
        {sortLabel}
      </label>
      <span className={styles.field}>
        <select
          id={id}
          className={styles.select}
          value={sort}
          onChange={(event) => onSort(event.target.value as Sort)}
        >
          {(Object.keys(sorts) as Sort[]).map((key) => (
            <option key={key} value={key}>
              {sorts[key]}
            </option>
          ))}
        </select>
        <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </div>
  );
}

export default CredentialSort;
