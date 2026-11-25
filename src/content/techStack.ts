import { JOBS } from "./professionalJourney";
import { SKILLS } from "./skills";

// The Tech Stack tab: one section per technology or tool, in two sub-sections. English;
// kept out of components so translations can replace it per language.
//
// Technologies are the ones the site already names: the header's skills and every
// technology on the Professional Journey's job cards. Where each was used comes from
// those jobs: the roles that list it, and when it was last used. No years are claimed:
// a long role's dates would overstate a technology it used only in part (C# did not
// exist when the Air Force role began). Tools are James's own list.

export type StackKind = "technologies" | "tools";

export type StackCategory =
  | "language"
  | "frontend"
  | "backend"
  | "desktop"
  | "data"
  | "cloud"
  | "infrastructure"
  | "delivery"
  | "observability"
  | "testing"
  | "mobile"
  | "realtime"
  | "ai"
  | "editor"
  | "database"
  | "game-engine"
  | "diagramming"
  | "tracking"
  | "assistant";

export type StackSort = "roles" | "recent" | "category" | "name";

export interface StackItem {
  id: string; // also the header skill's slug, where it is one
  name: string;
  monogram: string; // the backdrop's watermark
  kind: StackKind;
  category: StackCategory;
  jobs: readonly string[]; // ids of the jobs (Professional Journey) that used it
  about?: string; // what it is, for tools
  favorite?: boolean; // James's favorites, once he names them
}

export const TECH_STACK_LABELS = {
  tag: "Tech stack",
  kindsLabel: "Tech stack",
  kinds: {
    technologies: "Technologies",
    tools: "Tools",
  } satisfies Record<StackKind, string>,
  kindsShort: {
    technologies: "Technologies",
    tools: "Tools",
  } satisfies Record<StackKind, string>,
  sortLabel: "Sort",
  sorts: {
    roles: "Most roles",
    recent: "Most recent",
    category: "Category",
    name: "A–Z",
  } satisfies Record<StackSort, string>,
  categories: {
    language: "Language",
    frontend: "Front end",
    backend: "Back end",
    desktop: "Desktop",
    data: "Data",
    cloud: "Cloud",
    infrastructure: "Infrastructure as code",
    delivery: "Delivery",
    observability: "Observability",
    testing: "Testing",
    mobile: "Mobile",
    realtime: "Real time",
    ai: "AI",
    editor: "Editor and IDE",
    database: "Database tool",
    "game-engine": "Game engine",
    diagramming: "Diagramming",
    tracking: "Work tracking",
    assistant: "AI assistant",
  } satisfies Record<StackCategory, string>,
  position: (place: number, total: number) => `${place} of ${total}`,
  rolesLabel: "Roles that used it",
  roles: (count: number) => `${count} ${count === 1 ? "role" : "roles"}`,
  lastUsedLabel: "Last used",
  present: "Present",
  whereLabel: "Where it was used",
};

export const STACK: readonly StackItem[] = [
  // Languages
  {
    id: "csharp",
    name: "C#",
    monogram: "C#",
    kind: "technologies",
    category: "language",
    jobs: ["cpt-group", "costar", "ari", "mclaughlin", "sunkist", "usaf"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    monogram: "TS",
    kind: "technologies",
    category: "language",
    jobs: ["cpt-group"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    monogram: "JS",
    kind: "technologies",
    category: "language",
    jobs: ["costar", "abs-home-mortgage"],
  },
  {
    id: "go",
    name: "Go",
    monogram: "Go",
    kind: "technologies",
    category: "language",
    jobs: ["cpt-group"],
  },
  {
    id: "sql",
    name: "SQL",
    monogram: "SQL",
    kind: "technologies",
    category: "language",
    jobs: ["usaf"],
  },
  {
    id: "vbnet",
    name: "VB.NET",
    monogram: "VB",
    kind: "technologies",
    category: "language",
    jobs: ["abs-home-mortgage"],
  },
  {
    id: "visual-basic",
    name: "Visual Basic",
    monogram: "VB",
    kind: "technologies",
    category: "language",
    jobs: ["usaf"],
  },
  {
    id: "c",
    name: "C",
    monogram: "C",
    kind: "technologies",
    category: "language",
    jobs: ["sunkist", "usaf"],
  },
  {
    id: "cpp",
    name: "C++",
    monogram: "C++",
    kind: "technologies",
    category: "language",
    jobs: ["sunkist", "usaf"],
  },
  {
    id: "java",
    name: "Java",
    monogram: "J",
    kind: "technologies",
    category: "language",
    jobs: ["usaf"],
  },
  {
    id: "pascal",
    name: "Pascal",
    monogram: "Pa",
    kind: "technologies",
    category: "language",
    jobs: ["usaf"],
  },
  // Back end
  {
    id: "dotnet",
    name: ".NET",
    monogram: ".NET",
    kind: "technologies",
    category: "backend",
    jobs: ["cpt-group"],
  },
  {
    id: "rest-apis",
    name: "REST APIs",
    monogram: "API",
    kind: "technologies",
    category: "backend",
    jobs: ["abs-home-mortgage"],
  },
  {
    id: "wcf",
    name: "WCF",
    monogram: "WCF",
    kind: "technologies",
    category: "backend",
    jobs: ["ari", "sunkist"],
  },
  {
    id: "nancy",
    name: "Nancy",
    monogram: "Nc",
    kind: "technologies",
    category: "backend",
    jobs: ["mclaughlin"],
  },
  {
    id: "aspose",
    name: "Aspose",
    monogram: "As",
    kind: "technologies",
    category: "backend",
    jobs: ["abs-home-mortgage"],
  },
  // Front end
  {
    id: "react",
    name: "React",
    monogram: "Re",
    kind: "technologies",
    category: "frontend",
    jobs: ["cpt-group", "costar"],
  },
  {
    id: "redux",
    name: "Redux",
    monogram: "Rx",
    kind: "technologies",
    category: "frontend",
    jobs: ["costar"],
  },
  {
    id: "angularjs",
    name: "AngularJS",
    monogram: "Ng",
    kind: "technologies",
    category: "frontend",
    jobs: ["ari", "mclaughlin"],
  },
  {
    id: "jquery",
    name: "jQuery",
    monogram: "jQ",
    kind: "technologies",
    category: "frontend",
    jobs: ["abs-home-mortgage"],
  },
  // Desktop
  {
    id: "wpf",
    name: "WPF",
    monogram: "WPF",
    kind: "technologies",
    category: "desktop",
    jobs: ["sunkist"],
  },
  {
    id: "prism",
    name: "Prism",
    monogram: "Pr",
    kind: "technologies",
    category: "desktop",
    jobs: ["sunkist"],
  },
  {
    id: "xaml",
    name: "XAML",
    monogram: "XL",
    kind: "technologies",
    category: "desktop",
    jobs: ["ari"],
  },
  // Data
  {
    id: "postgresql",
    name: "PostgreSQL",
    monogram: "PG",
    kind: "technologies",
    category: "data",
    jobs: ["cpt-group", "ari"],
  },
  {
    id: "sql-server",
    name: "SQL Server",
    monogram: "MS",
    kind: "technologies",
    category: "data",
    jobs: ["ari", "mclaughlin"],
  },
  {
    id: "dapper",
    name: "Dapper",
    monogram: "Dp",
    kind: "technologies",
    category: "data",
    jobs: ["mclaughlin"],
  },
  // Cloud and infrastructure
  {
    id: "azure",
    name: "Azure",
    monogram: "Az",
    kind: "technologies",
    category: "cloud",
    jobs: ["cpt-group"],
  },
  {
    id: "aws",
    name: "AWS",
    monogram: "AWS",
    kind: "technologies",
    category: "cloud",
    jobs: ["costar"],
  },
  {
    id: "gcp",
    name: "Google Cloud",
    monogram: "GC",
    kind: "technologies",
    category: "cloud",
    jobs: ["costar"],
  },
  {
    id: "terraform",
    name: "Terraform",
    monogram: "Tf",
    kind: "technologies",
    category: "infrastructure",
    jobs: ["cpt-group"],
  },
  // Delivery, observability and testing
  {
    id: "ci-cd",
    name: "CI/CD",
    monogram: "CI",
    kind: "technologies",
    category: "delivery",
    jobs: ["cpt-group"],
  },
  {
    id: "installaware",
    name: "InstallAware",
    monogram: "IA",
    kind: "technologies",
    category: "delivery",
    jobs: ["sunkist"],
  },
  {
    id: "datadog",
    name: "Datadog",
    monogram: "Dd",
    kind: "technologies",
    category: "observability",
    jobs: ["costar"],
  },
  {
    id: "nunit",
    name: "NUnit",
    monogram: "NU",
    kind: "technologies",
    category: "testing",
    jobs: ["mclaughlin"],
  },
  // Mobile, real time and AI
  {
    id: "ios",
    name: "iOS",
    monogram: "iOS",
    kind: "technologies",
    category: "mobile",
    jobs: ["iherb"],
  },
  {
    id: "android",
    name: "Android",
    monogram: "An",
    kind: "technologies",
    category: "mobile",
    jobs: ["iherb"],
  },
  {
    id: "webrtc",
    name: "WebRTC",
    monogram: "RTC",
    kind: "technologies",
    category: "realtime",
    jobs: ["cpt-group"],
  },
  {
    id: "ai-assisted-development",
    name: "AI-Assisted Development",
    monogram: "AI",
    kind: "technologies",
    category: "ai",
    jobs: ["cpt-group"],
  },
  // Tools: James's list
  {
    id: "visual-studio",
    name: "Visual Studio",
    monogram: "VS",
    kind: "tools",
    category: "editor",
    jobs: [],
    about: "Microsoft's IDE for .NET and C++.",
  },
  {
    id: "vs-code",
    name: "Visual Studio Code",
    monogram: "VSC",
    kind: "tools",
    category: "editor",
    jobs: [],
    about: "Microsoft's lightweight, extensible code editor.",
  },
  {
    id: "pgadmin",
    name: "pgAdmin",
    monogram: "pgA",
    kind: "tools",
    category: "database",
    jobs: [],
    about: "The open-source administration and query tool for PostgreSQL.",
  },
  {
    id: "ssms",
    name: "SQL Server Management Studio",
    monogram: "SSMS",
    kind: "tools",
    category: "database",
    jobs: [],
    about: "Microsoft's tool for managing and querying SQL Server.",
  },
  {
    id: "unreal-engine",
    name: "Unreal Engine",
    monogram: "UE",
    kind: "tools",
    category: "game-engine",
    jobs: [],
    about: "Epic Games' real-time 3D engine, for building games for fun.",
  },
  {
    id: "unity",
    name: "Unity",
    monogram: "Un",
    kind: "tools",
    category: "game-engine",
    jobs: [],
    about:
      "A cross-platform game engine scripted in C#, for building games for fun.",
  },
  {
    id: "lucidchart",
    name: "Lucidchart",
    monogram: "Lc",
    kind: "tools",
    category: "diagramming",
    jobs: [],
    about: "Online diagramming for architecture, UML and flowcharts.",
  },
  {
    id: "jira",
    name: "Jira",
    monogram: "Ji",
    kind: "tools",
    category: "tracking",
    jobs: [],
    about: "Atlassian's issue and project tracker, for planning and delivery.",
  },
  {
    id: "cursor",
    name: "Cursor",
    monogram: "Cu",
    kind: "tools",
    category: "assistant",
    jobs: [],
    about: "An AI-first code editor built on Visual Studio Code.",
  },
  {
    id: "claude",
    name: "Claude",
    monogram: "Cl",
    kind: "tools",
    category: "assistant",
    jobs: [],
    about: "Anthropic's AI assistant, for coding and writing.",
  },
  {
    id: "codex",
    name: "Codex",
    monogram: "Cx",
    kind: "tools",
    category: "assistant",
    jobs: [],
    about: "OpenAI's AI coding agent.",
  },
];

// The header skill's one-line summary, where the item is one of the header's skills.
export function summaryOf(item: StackItem): string | undefined {
  return SKILLS.find((skill) => skill.slug === item.id)?.summary;
}

// ── Where it was used ──────────────────────────────────────────────────────────────

// "May 2024" → months since year 0; null (current) → this month.
function monthOf(date: string | null): number {
  if (!date) {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [month, year] = date.split(" ");
  return Number(year) * 12 + MONTHS.indexOf(month.slice(0, 3));
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export interface StackUse {
  roles: number; // roles on the Professional Journey that list it
  lastUsed: string | null; // the latest of those roles' ends; null while current
  last: number; // the same, as a month number, for sorting
}

// Where the item was used, from the jobs that list it. Null when no job on the site
// names it (James's tools).
export function usageOf(item: StackItem): StackUse | null {
  const jobs = JOBS.filter((job) => item.jobs.includes(job.id));
  if (jobs.length === 0) return null;
  const latest = jobs.reduce((a, b) =>
    monthOf(b.end) > monthOf(a.end) ? b : a,
  );
  return {
    roles: jobs.length,
    lastUsed: latest.end,
    last: monthOf(latest.end),
  };
}
