// Labels for the header's controls (English), shared by the wide top bar and the phone menu.
// Kept out of components so translations can replace them per language.
import type { ThemePreference } from "../state/preferences";

export const SEARCH_LABELS = {
  label: "Search the site",
  placeholder: "Search my experience…",
  // Shown under the phone search field until the search index is built.
  hint: "Type to search my experience.",
};

export const THEME_LABELS: {
  title: string;
  options: Record<ThemePreference, string>;
} = {
  title: "Theme",
  options: { system: "Match system", light: "Light", dark: "Dark" },
};

export const LANGUAGE_LABELS = {
  title: "Language",
};

export const NAV_MENU_LABELS = {
  open: "Menu",
  title: "Menu",
  close: "Close menu",
  backTo: (screenTitle: string) => `Back to ${screenTitle}`,
};
