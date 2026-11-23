import { useEffect } from "react";
import { SECTIONS } from "../content/sections";
import { useNavigation } from "../state/navigation";

function sectionFromHash(): number {
  const index = SECTIONS.findIndex(
    (section) => `#${section.id}` === window.location.hash,
  );
  return index < 0 ? 0 : index;
}

// Keeps the showing section in step with the URL: the #section-id on load, Back and
// Forward, and plain #links elsewhere on the page (for example Hire me → #contact).
// Scrolling is handled by the navigation store, so the browser's own restore is off.
export function useSectionRouting(): void {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    function syncFromUrl() {
      useNavigation
        .getState()
        .showSection(sectionFromHash(), { updateUrl: false });
    }

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("hashchange", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("hashchange", syncFromUrl);
    };
  }, []);
}
