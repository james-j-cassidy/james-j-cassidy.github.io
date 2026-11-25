import type { ReactNode } from "react";
import type { SearchResult } from "../../../search/searchIndex";
import styles from "./SiteSearchResults.module.scss";

interface SiteSearchResultsProps {
  id: string; // the listbox's id, for the field's aria-controls
  optionId: (index: number) => string;
  results: readonly SearchResult[];
  active: number; // the highlighted result, -1 for none
  query: string;
  label: string; // names the list
  none: string; // shown when nothing matches
  onHover: (index: number) => void;
  onChoose: (index: number) => void;
}

// Marks every place the query's words appear in a piece of text.
function highlight(text: string, query: string): ReactNode {
  const words = query
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 1)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length) return text;
  const parts = text.split(new RegExp(`(${words.join("|")})`, "gi"));
  return parts.map((part, index) =>
    index % 2 === 1 ? <mark key={index}>{part}</mark> : part,
  );
}

// The search's results as a listbox of options: each names the place, where it is on
// the site, and a short excerpt, with the matching words marked. The field keeps focus
// and points at the highlighted option (aria-activedescendant); a click chooses.
function SiteSearchResults({
  id,
  optionId,
  results,
  active,
  query,
  label,
  none,
  onHover,
  onChoose,
}: SiteSearchResultsProps) {
  if (!results.length) {
    return (
      <div id={id} className={styles.empty}>
        {none}
      </div>
    );
  }
  return (
    <ul id={id} className={styles.list} role="listbox" aria-label={label}>
      {results.map(({ entry, snippet }, index) => (
        <li
          key={entry.href}
          id={optionId(index)}
          role="option"
          aria-selected={index === active}
          className={styles.option}
          onPointerEnter={() => onHover(index)}
          // The field keeps focus while a result is clicked.
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => onChoose(index)}
        >
          <span className={styles.title}>{highlight(entry.title, query)}</span>
          <span className={styles.where}>{entry.where}</span>
          {snippet && (
            <span className={styles.snippet}>{highlight(snippet, query)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default SiteSearchResults;
