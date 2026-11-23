import type { MouseEvent } from "react";
import { create } from "zustand";
import { SECTIONS } from "../content/sections";

interface ShowSectionOptions {
  // Add a history entry (#section-id). Off when the URL already changed (Back, Forward,
  // a plain #link), so the entry is not duplicated.
  updateUrl?: boolean;
}

interface NavigationState {
  sectionIndex: number;
  // Which way the last change went (1 forward, -1 back), for the section's slide-in.
  direction: -1 | 0 | 1;
  // True once the header's main body is in its compact layout (scrolled into a section).
  headerCollapsed: boolean;
  // Scroll offset where the main body reaches its compact height and the section's start
  // sits just under the tab bar; a section change while collapsed lands there.
  collapsedSectionTop: number;
  setHeaderCollapsed: (collapsed: boolean) => void;
  setCollapsedSectionTop: (top: number) => void;
  showSection: (index: number, options?: ShowSectionOptions) => void;
}

// Which section is showing, and whether the header is collapsed.
// Changing section keeps the header's state: collapsed lands on the new section's start
// with the header still collapsed; expanded goes back to the top, full header showing,
// waiting for the visitor to scroll down.
export const useNavigation = create<NavigationState>()((set, get) => ({
  sectionIndex: 0,
  direction: 0,
  headerCollapsed: false,
  collapsedSectionTop: 0,
  setHeaderCollapsed: (headerCollapsed) => set({ headerCollapsed }),
  setCollapsedSectionTop: (collapsedSectionTop) => set({ collapsedSectionTop }),
  showSection: (index, { updateUrl = true } = {}) => {
    const { sectionIndex, headerCollapsed, collapsedSectionTop } = get();
    if (index < 0 || index >= SECTIONS.length || index === sectionIndex) return;
    set({ sectionIndex: index, direction: index > sectionIndex ? 1 : -1 });
    if (updateUrl) window.history.pushState(null, "", `#${SECTIONS[index].id}`);
    // After the new section renders.
    requestAnimationFrame(() =>
      window.scrollTo({
        top: headerCollapsed ? collapsedSectionTop : 0,
        behavior: "instant",
      }),
    );
  },
}));

// For section links (tabs, the phone menu): show the section through the store instead of
// letting the browser jump to the anchor. Modified clicks (new tab, new window) are left
// to the browser; the href stays for those and for no-script use.
export function followSectionLink(
  event: MouseEvent<HTMLAnchorElement>,
  index: number,
) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  useNavigation.getState().showSection(index);
}
