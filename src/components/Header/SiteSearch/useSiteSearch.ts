import { useMemo, useState, type KeyboardEvent } from "react";
import {
  goToResult,
  searchSite,
  type SearchResult,
} from "../../../search/searchIndex";

export interface SiteSearch {
  query: string;
  change: (value: string) => void;
  results: readonly SearchResult[];
  active: number; // the highlighted result, -1 for none
  setActive: (index: number) => void;
  choose: (index: number) => void;
  // Arrow keys move through the results (wrapping), Enter goes to the highlighted one
  // (or the first). Escape is left to the field's owner.
  handleKey: (event: KeyboardEvent<HTMLInputElement>) => void;
}

// The search's state for a field: what is typed, its results, the highlighted one, and
// going to a result. `beforeGo` runs first (closing a menu, clearing the field).
export function useSiteSearch(beforeGo?: () => void): SiteSearch {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const results = useMemo(() => searchSite(query), [query]);

  function change(value: string) {
    setQuery(value);
    setActive(-1);
  }

  function choose(index: number) {
    const result = results[index];
    if (!result) return;
    beforeGo?.();
    setQuery("");
    setActive(-1);
    // After the menu or popup has closed and focus has settled.
    requestAnimationFrame(() => goToResult(result.entry));
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    const count = results.length;
    if (event.key === "ArrowDown" && count) {
      event.preventDefault();
      setActive((now) => (now + 1) % count);
    } else if (event.key === "ArrowUp" && count) {
      event.preventDefault();
      setActive((now) => (now <= 0 ? count - 1 : now - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (count) choose(active >= 0 ? active : 0);
    }
  }

  return { query, change, results, active, setActive, choose, handleKey };
}
