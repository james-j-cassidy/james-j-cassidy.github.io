import { usePreferences } from "./preferences";

type Preferences = ReturnType<typeof usePreferences.getState>;

function applyToDocumentElement({ theme, motion }: Preferences): void {
  const root = document.documentElement;

  if (theme === "system") root.removeAttribute("data-theme");
  else root.dataset.theme = theme;

  if (motion === "system") root.removeAttribute("data-motion");
  else root.dataset.motion = motion;
}

export function syncPreferencesToDocumentElement(): () => void {
  applyToDocumentElement(usePreferences.getState());
  return usePreferences.subscribe(applyToDocumentElement);
}
