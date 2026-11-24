// Header skills (English). Order is clockwise around the wheel, starting at the selected spot.
// The list comes from the mock's "Core Technologies"; each summary is a fact from James's
// job history (LinkedIn), not a general claim.
export type SkillIconName =
  | "dotnet"
  | "csharp"
  | "cloud"
  | "database"
  | "layers"
  | "ai"
  | "infinity"
  | "code"
  | "video"
  | "atom";

export interface Skill {
  slug: string;
  name: string;
  icon: SkillIconName;
  summary: string;
}

export const SKILLS: readonly Skill[] = [
  {
    slug: "dotnet",
    name: ".NET",
    icon: "dotnet",
    summary: "Founded a .NET platform of 27 apps and 340+ HTTP endpoints.",
  },
  {
    slug: "csharp",
    name: "C#",
    icon: "csharp",
    summary: "Used in six roles, from the Air Force to today.",
  },
  {
    slug: "azure",
    name: "Azure",
    icon: "cloud",
    summary: "Architected a cloud-native Azure platform from the ground up.",
  },
  {
    slug: "postgresql",
    name: "PostgreSQL",
    icon: "database",
    summary: "5 databases and 126 tables, through 475 EF Core migrations.",
  },
  {
    slug: "terraform",
    name: "Terraform",
    icon: "layers",
    summary:
      "Azure infrastructure as code across dev, test, staging and production.",
  },
  {
    slug: "ai-assisted-development",
    name: "AI-Assisted Development",
    icon: "ai",
    summary:
      "Adopted with a fast lane to dev; median cycle time fell from 22 to 5 days.",
  },
  {
    slug: "ci-cd",
    name: "CI/CD",
    icon: "infinity",
    summary: "Introduced an auto-merge, auto-deploy fast lane to dev.",
  },
  {
    slug: "typescript",
    name: "TypeScript",
    icon: "code",
    summary: "Co-built an internal tools web app that hosts 39 tools.",
  },
  {
    slug: "webrtc",
    name: "WebRTC",
    icon: "video",
    summary: "Built a Go signaling and presence service with dual-issuer JWT.",
  },
  {
    slug: "react",
    name: "React",
    icon: "atom",
    summary: "From a broker auction game to a 39-tool internal web app.",
  },
];

export const SKILL_LABELS = {
  wheel: "Skills",
  previous: "Previous skill",
  next: "Next skill",
  pause: "Pause skill rotation",
  play: "Start skill rotation",
  // Hidden from sight, appended to the skill name link so its purpose is clear on its own
  // (WCAG 2.4.9): "Azure, view full page".
  fullPageSuffix: ", view full page",
  // Shown after the skill name on phones, where the summary text is hidden.
  learnMore: "Learn more",
  counter: (position: number, total: number) => `${position} / ${total}`,
};

// Each skill's full page: its section on the Tech Stack tab.
export function skillPageHref(skill: Skill): string {
  return `#tech-stack/${skill.slug}`;
}
