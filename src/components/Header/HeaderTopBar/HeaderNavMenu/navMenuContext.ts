import { createContext, useContext } from "react";

// View-transition name shared by the search entry and the search screen's field, so the
// field appears to slide up into the header.
export const SEARCH_FIELD_TRANSITION = "nav-menu-search-field";

// Screens the phone menu can show. "main" is the top level; the rest are submenus.
export type NavMenuScreenId = "main" | "search" | "theme" | "language";

export interface NavMenuContextValue {
  screen: NavMenuScreenId;
  // "Back to <parent screen>", or null on the top level.
  backLabel: string | null;
  // Stable id for the item that opens a screen, so focus can return to it on Back.
  itemId: (screen: NavMenuScreenId) => string;
  openScreen: (screen: NavMenuScreenId) => void;
  goBack: () => void;
  closeMenu: () => void;
}

export const NavMenuContext = createContext<NavMenuContextValue | null>(null);

// For components inside HeaderNavMenu's dialog.
export function useNavMenu(): NavMenuContextValue {
  const value = useContext(NavMenuContext);
  if (!value) throw new Error("useNavMenu must be used inside HeaderNavMenu.");
  return value;
}
