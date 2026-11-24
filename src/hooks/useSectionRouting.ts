import { useEffect } from "react";
import { SECTIONS } from "../content/sections";
import { useNavigation } from "../state/navigation";

// The section a #hash names: #section-id, or #section-id/item for a deep link into it
// (the section reads the item itself).
function sectionFromHash(): number {
  const [id] = window.location.hash.slice(1).split("/");
  const index = SECTIONS.findIndex((section) => section.id === id);
  return index < 0 ? 0 : index;
}

// Keeps the showing section in step with the URL: the #section-id on load, Back and
// Forward, and plain #links elsewhere on the page.
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
