import { useEffect, useRef, useState } from "react";

// Follows deep links into a section: #section-id/key, on load and whenever the URL
// changes to one (a search result, a shared link, Back and Forward). The section decides
// what its key names (a part, a job, a chapter) and goes there; the section itself is
// shown by the routing (useSectionRouting). Keys the section does not know are ignored.
export function useDeepLink(sectionId: string, follow: (key: string) => void) {
  // The latest handler, so the listener never needs re-adding.
  const followRef = useRef(follow);
  useEffect(() => {
    followRef.current = follow;
  });

  useEffect(() => {
    function check() {
      const [section, key] = window.location.hash.slice(1).split("/");
      if (section === sectionId && key) followRef.current(key);
    }
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [sectionId]);
}

export interface PartGoTo {
  index: number;
  request: number; // one more per link followed, so the same part can be gone to again
}

// For a tab told as one story: a deep link's key is a part's key (its place in `keys`,
// the story's order); returns the Story's goTo.
export function usePartGoTo(
  sectionId: string,
  keys: readonly string[],
): PartGoTo | undefined {
  const [goTo, setGoTo] = useState<PartGoTo>();
  useDeepLink(sectionId, (key) => {
    const index = keys.indexOf(key);
    if (index >= 0) {
      setGoTo((now) => ({ index, request: (now?.request ?? 0) + 1 }));
    }
  });
  return goTo;
}
