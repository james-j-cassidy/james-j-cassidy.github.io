// Header skills (English). Order is clockwise around the wheel, starting at the selected spot.
// DRAFT: the skill list comes from the mock's "Core Technologies"; every summary except .NET
// (taken from the mock) is placeholder wording for James to review and replace.
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
    summary: "Builds robust, scalable, and maintainable enterprise solutions.",
  },
  {
    slug: "csharp",
    name: "C#",
    icon: "csharp",
    summary: "Writes clean, well-tested C# for services, libraries, and tools.",
  },
  {
    slug: "azure",
    name: "Azure",
    icon: "cloud",
    summary: "Designs and runs secure, cost-aware cloud platforms.",
  },
  {
    slug: "postgresql",
    name: "PostgreSQL",
    icon: "database",
    summary: "Models data and tunes queries for reliable, fast systems.",
  },
  {
    slug: "terraform",
    name: "Terraform",
    icon: "layers",
    summary: "Defines infrastructure as code for repeatable environments.",
  },
  {
    slug: "ai-assisted-development",
    name: "AI-Assisted Development",
    icon: "ai",
    summary: "Uses AI to speed up delivery while keeping quality high.",
  },
  {
    slug: "ci-cd",
    name: "CI/CD",
    icon: "infinity",
    summary: "Automates builds, tests, and deployments end to end.",
  },
  {
    slug: "typescript",
    name: "TypeScript",
    icon: "code",
    summary: "Builds type-safe front ends and tooling.",
  },
  {
    slug: "webrtc",
    name: "WebRTC",
    icon: "video",
    summary: "Builds real-time audio, video, and data connections.",
  },
  {
    slug: "react",
    name: "React",
    icon: "atom",
    summary: "Creates accessible, responsive user interfaces.",
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
