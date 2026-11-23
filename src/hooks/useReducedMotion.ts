import { useSyncExternalStore } from "react";
import { usePreferences } from "../state/preferences";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getSystemPrefersReduced(): boolean {
  return window.matchMedia(QUERY).matches;
}

// True when motion should be reduced: the site's motion preference wins,
// and "system" follows the operating system setting (and updates when it changes).
export function useReducedMotion(): boolean {
  const motion = usePreferences((state) => state.motion);
  const systemPrefersReduced = useSyncExternalStore(
    subscribe,
    getSystemPrefersReduced,
    () => false,
  );
  return motion === "reduce" || (motion === "system" && systemPrefersReduced);
}
