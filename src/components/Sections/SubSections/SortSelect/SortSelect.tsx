import { useId } from "react";
import styles from "./SortSelect.module.scss";

interface SortSelectProps<Sort extends string> {
  label: string;
  sorts: Record<Sort, string>;
  sort: Sort;
  onSort: (sort: Sort) => void;
}

// The order of a sub-section's story, in its bar: a native select, the same size
// whatever is chosen, so the bar never shifts.
function SortSelect<Sort extends string>({
  label,
  sorts,
  sort,
  onSort,
}: SortSelectProps<Sort>) {
  const id = useId();

  return (
    <div className={styles.sort}>
      <label className={styles.label} htmlFor={id}>
        {label}
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

export default SortSelect;
