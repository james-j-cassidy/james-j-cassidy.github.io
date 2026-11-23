import type { SkillIconName } from "../../../../content/skills";
import styles from "./HeaderSkillWheel.module.scss";

// Brand-colored icons, drawn as simplified approximations (not the official logo files).
// Tiles are always dark, so these colors work in every theme.
// Decorative: each tab carries the skill name for assistive technology.
const BRAND = {
  dotnet: "#512BD4",
  csharp: "#9B4F96",
  azureDark: "#0A6ED1",
  azureLight: "#3CCBF4",
  postgres: "#336791",
  terraform: "#7B42BC",
  terraformLight: "#9A6BD6",
  ai: "#F2C94C",
  typescript: "#3178C6",
  react: "#61DAFB",
};

function SkillIcon({ name }: { name: SkillIconName }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {renderShape(name)}
    </svg>
  );
}

function renderShape(name: SkillIconName) {
  switch (name) {
    case "dotnet":
      return (
        <>
          <rect
            x="2"
            y="5"
            width="20"
            height="14"
            rx="3"
            fill={BRAND.dotnet}
            stroke="none"
          />
          <text className={styles.iconText} x="12" y="12.5" fontSize="7.5">
            .NET
          </text>
        </>
      );
    case "csharp":
      return (
        <>
          <polygon
            points="12,1.5 21.5,7 21.5,17 12,22.5 2.5,17 2.5,7"
            fill={BRAND.csharp}
            stroke="none"
          />
          <text className={styles.iconText} x="12" y="12.5" fontSize="9">
            C#
          </text>
        </>
      );
    case "cloud":
      // Azure-style "A": a dark slanted bar and a light sweep.
      return (
        <>
          <path
            d="M9.4 3.5h4.3L6.9 20.5H2.6Z"
            fill={BRAND.azureDark}
            stroke="none"
          />
          <path
            d="M14.1 3.5 21.4 20.5H10.2l3.4-3.7h3.3L12.2 6.4Z"
            fill={BRAND.azureLight}
            stroke="none"
          />
        </>
      );
    case "database":
      // Front-facing elephant: ears, head and trunk.
      return (
        <>
          <ellipse cx="5.5" cy="10" rx="3.6" ry="4.6" fill={BRAND.postgres} />
          <ellipse cx="18.5" cy="10" rx="3.6" ry="4.6" fill={BRAND.postgres} />
          <path
            d="M7 9.5a5 5 0 0 1 10 0v3.5c0 1.6-.9 2.7-2.3 3.1v3a2.4 2.4 0 0 1-2.4 2.4h-.8"
            fill={BRAND.postgres}
          />
          <circle className={styles.iconFill} cx="9.8" cy="10" r="0.9" />
          <circle className={styles.iconFill} cx="14.2" cy="10" r="0.9" />
        </>
      );
    case "layers":
      // Terraform-style blocks.
      return (
        <>
          <path
            d="M3 2.5 8.2 5.5v6L3 8.5Z"
            fill={BRAND.terraformLight}
            stroke="none"
          />
          <path
            d="M9.2 6 14.4 9v6L9.2 12Z"
            fill={BRAND.terraform}
            stroke="none"
          />
          <path
            d="M9.2 13.3 14.4 16.3v6L9.2 19.3Z"
            fill={BRAND.terraform}
            stroke="none"
          />
          <path
            d="M15.4 9 20.6 6v6l-5.2 3Z"
            fill={BRAND.terraform}
            stroke="none"
          />
        </>
      );
    case "ai":
      return (
        <g stroke={BRAND.ai}>
          <rect x="5.5" y="5.5" width="13" height="13" rx="2" />
          <path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3" />
          <text
            className={styles.iconText}
            x="12"
            y="12.5"
            fontSize="6.5"
            fill={BRAND.ai}
          >
            AI
          </text>
        </g>
      );
    case "infinity":
      return (
        <path d="M6.5 8a4 4 0 1 0 0 8c3.5 0 7.5-8 11-8a4 4 0 1 1 0 8c-3.5 0-7.5-8-11-8Z" />
      );
    case "code":
      // TypeScript-style blue square.
      return (
        <>
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="3"
            fill={BRAND.typescript}
            stroke="none"
          />
          <text className={styles.iconText} x="15" y="16" fontSize="8.5">
            TS
          </text>
        </>
      );
    case "video":
      return (
        <>
          <rect x="2.5" y="6.5" width="13" height="11" rx="2" />
          <path d="m15.5 10.5 6-3.5v10l-6-3.5" />
        </>
      );
    case "atom":
      return (
        <g stroke={BRAND.react}>
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            transform="rotate(120 12 12)"
          />
          <circle cx="12" cy="12" r="1.8" fill={BRAND.react} stroke="none" />
        </g>
      );
  }
}

export default SkillIcon;
