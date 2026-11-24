import type { SectionIconName } from "../../../content/sections";

interface SectionIconProps {
  name: SectionIconName;
  className: string;
}

// Line icon for a section (shared by the tabs, the phone's current-section label and the
// phone menu). Decorative: the section's name is always shown next to it.
function SectionIcon({ name, className }: SectionIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {renderShape(name)}
    </svg>
  );
}

function renderShape(name: SectionIconName) {
  switch (name) {
    case "home":
      return <path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M10 20v-5.5h4V20" />;
    case "journey":
      return (
        <>
          <circle cx="6" cy="19" r="2.5" />
          <circle cx="18" cy="5" r="2.5" />
          <path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" />
        </>
      );
    case "layers":
      return (
        <>
          <path d="M12 3 2.5 8l9.5 5 9.5-5L12 3Z" />
          <path d="m2.5 12.5 9.5 5 9.5-5" />
          <path d="m2.5 17 9.5 5 9.5-5" />
        </>
      );
    case "chip":
      return (
        <>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
          <path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" />
        </>
      );
    case "cube":
      return (
        <>
          <path d="M12 2.5 20.5 7.25v9.5L12 21.5l-8.5-4.75v-9.5L12 2.5Z" />
          <path d="m3.5 7.25 8.5 4.75 8.5-4.75M12 12v9.5" />
        </>
      );
    case "people":
      return (
        <>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M16.5 14.1a5 5 0 0 1 5 5.4" />
        </>
      );
    case "mail":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 6.5 8.5 7 8.5-7" />
        </>
      );
  }
}

export default SectionIcon;
