import type { ThemePreference } from "../../../../state/preferences";

interface ThemeIconProps {
  theme: ThemePreference;
  className: string;
}

// Monitor for "match system", sun for light, moon for dark. Decorative: the text names the theme.
function ThemeIcon({ theme, className }: ThemeIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {theme === "dark" && (
        <path d="M20 14.5 A8 8 0 0 1 9.5 4 A8 8 0 1 0 20 14.5 Z" />
      )}
      {theme === "light" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22 M4.9 4.9 L6.3 6.3 M17.7 17.7 L19.1 19.1 M4.9 19.1 L6.3 17.7 M17.7 6.3 L19.1 4.9" />
        </>
      )}
      {theme === "system" && (
        <>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20 H16 M12 16 V20" />
        </>
      )}
    </svg>
  );
}

export default ThemeIcon;
