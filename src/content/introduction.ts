// The Introduction section's story parts, in scroll order. English headings; kept out of
// components so translations can replace them per language. Each part's real content
// replaces its placeholder when that part is built.
export const INTRODUCTION_PARTS = {
  opening: { heading: "In short" },
  origin: { heading: "Where it started" },
  principles: { heading: "How I work" },
  thisSite: { heading: "About this site" },
  lookingFor: { heading: "What I'm looking for" },
  beyondWork: { heading: "Beyond work" },
  nextStep: { heading: "Where to next" },
} as const;

// Opening: two modules, each opening a detail card. Every point is a fact from James's job
// history (LinkedIn).
export type OpeningModuleId = "architecture" | "leadership";

export interface OpeningModule {
  id: OpeningModuleId;
  tag: string; // small HUD label above the title
  title: string;
  action: string; // call to action at the bottom of the module
  detail: {
    tag: string; // HUD label at the top of the card
    heading: string;
    points: readonly string[];
    tags: readonly string[];
  };
}

export const INTRODUCTION_OPENING = {
  hint: "Select a module to learn more",
  close: "Close",
  modules: [
    {
      id: "architecture",
      tag: "Module 01 · Architecture",
      title: "Architecting platforms, hands-on",
      action: "Explore",
      detail: {
        tag: "Scan complete · Architecture",
        heading: "Platform architecture",
        points: [
          "Founded a .NET Azure Functions platform: 27 apps and 340+ HTTP endpoints.",
          "Built on 6 shared private NuGet libraries, each app with its own automated tests.",
          "Wrote the architecture documentation and co-wrote the engineering standards.",
        ],
        tags: [".NET", "Azure", "PostgreSQL", "Legacy modernization"],
      },
    },
    {
      id: "leadership",
      tag: "Module 02 · Leadership",
      title: "Leading the people who build them",
      action: "Explore",
      detail: {
        tag: "Scan complete · Leadership",
        heading: "Technical leadership",
        points: [
          "Supervising a team of up to 4 engineers and analysts at CPT Group.",
          "Managed 54 people and completed 61 projects at iHerb.",
          "Mentored a team on coding standards and best practices.",
        ],
        tags: [
          "Mentoring",
          "Project management",
          "Engineering standards",
          "AI-assisted development",
        ],
      },
    },
  ] satisfies readonly OpeningModule[],
};

// Origin: a flight log of milestones, in order. Every fact is from James's LinkedIn
// (experience, education and honors).
export interface OriginMilestone {
  title: string;
  body: string;
}

export const INTRODUCTION_ORIGIN = {
  tag: "Flight log",
  waypoints: "Waypoints",
  waypoint: (position: number) =>
    `Waypoint ${String(position).padStart(2, "0")}`,
  reached: "Waypoint reached",
  previous: "Previous waypoint",
  next: "Next waypoint",
  milestones: [
    {
      title: "First command",
      body: "1996, Wichita: completed the Air Capital Leadership Development Course as a JROTC cadet, and the drill team took first place at the Air Capital Drill Meet.",
    },
    {
      title: "U.S. Air Force",
      body: "Thirteen years as a mechanic, on the help desk, as a software engineer and as an IT project manager, including service in Korea. 647,000 lines of Pascal for two live satellite simulators that trained new space operators.",
    },
    {
      title: "Learning while serving",
      body: "An associate degree in 2006, a bachelor's cum laude in 2010 and a master's in project management in 2011, all while serving; then a master's in computer science in 2014.",
    },
    {
      title: "Leading at scale",
      body: "At iHerb: managed 54 people, completed 61 projects and brought a failing $1.2M warehouse project back on track.",
    },
    {
      title: "Today",
      body: "Founding architect of a cloud-native Azure platform at CPT Group, supervising a team of up to 4 engineers and analysts.",
    },
  ] satisfies readonly OriginMilestone[],
};

// How James works: principles, each with a trade-off shown without and with it. James
// keeps all five (2026-11-24); the meter values are illustrative (shown as words).
export type PrincipleIcon =
  "change" | "record" | "access" | "automate" | "measure";

export interface PrincipleOutcome {
  text: string;
  value: number; // 0–100 on the meter; shown as Low, Medium or High
}

export interface Principle {
  id: string;
  icon: PrincipleIcon;
  title: string;
  line: string;
  metric: string; // what the meter measures (lower is better)
  without: PrincipleOutcome;
  with: PrincipleOutcome;
}

export const INTRODUCTION_PRINCIPLES = {
  tag: "Core principles",
  principlesLabel: "Principles",
  tradeoff: "Trade-off",
  apply: "Apply this principle",
  withoutLabel: "Without",
  withLabel: "With",
  previous: "Previous principle",
  next: "Next principle",
  levels: { low: "Low", medium: "Medium", high: "High" },
  principles: [
    {
      id: "change",
      icon: "change",
      title: "Change is the product",
      line: "Design for the change you can't see yet.",
      metric: "Cost of a change",
      without: {
        text: "Every feature touches everything, and each release gets slower.",
        value: 85,
      },
      with: {
        text: "Clear boundaries keep each change local and small.",
        value: 25,
      },
    },
    {
      id: "record",
      icon: "record",
      title: "Decide in writing",
      line: "Record the why, not just the what.",
      metric: "Time to onboard",
      without: {
        text: "Context lives in people's heads and leaves with them.",
        value: 80,
      },
      with: {
        text: "Decision records answer the why on day one.",
        value: 30,
      },
    },
    {
      id: "access",
      icon: "access",
      title: "Accessible by default",
      line: "Build for everyone from the first commit.",
      metric: "Cost to fix later",
      without: {
        text: "Accessibility becomes an expensive retrofit just before launch.",
        value: 90,
      },
      with: {
        text: "Semantics and contrast are built in, so fixes stay small.",
        value: 20,
      },
    },
    {
      id: "automate",
      icon: "automate",
      title: "Automate the repeatable",
      line: "If it's done twice, script it.",
      metric: "Release risk",
      without: {
        text: "Manual steps drift, and releases depend on who's on shift.",
        value: 75,
      },
      with: {
        text: "Pipelines make every release the same: boring and safe.",
        value: 20,
      },
    },
    {
      id: "measure",
      icon: "measure",
      title: "Measure first",
      line: "Let the data pick the bottleneck.",
      metric: "Wasted effort",
      without: {
        text: "Weeks go into speeding up code that was never the problem.",
        value: 70,
      },
      with: {
        text: "Profiling points the effort at what actually matters.",
        value: 25,
      },
    },
  ] satisfies readonly Principle[],
};

// About this site: its real layers and live checks. These describe this site as built.
export interface SiteLayer {
  id: string;
  title: string;
  summary: string;
  points: readonly string[];
  tags: readonly string[];
}

export const INTRODUCTION_THIS_SITE = {
  tag: "System inspector",
  layersLabel: "Site layers",
  layer: (position: number) => `Layer ${String(position).padStart(2, "0")}`,
  diagnostics: "Live diagnostics",
  measured: "Measured from the colors on screen now",
  pass: "AAA pass",
  fail: "Below AAA",
  readings: {
    text: "Text",
    accent: "Accent",
    muted: "Muted text",
  },
  motion: "Motion",
  motionFull: "Full",
  motionReduced: "Reduced",
  themeSwitch: "Dark theme",
  // Bottom of the stack first.
  layers: [
    {
      id: "build",
      title: "Build & hosting",
      summary:
        "Vite and strict TypeScript build a static site that GitHub Pages serves.",
      points: [
        "Lint, type and format checks run before every merge.",
        "No server to patch and nothing that runs up a bill.",
      ],
      tags: ["Vite", "TypeScript", "Oxlint", "GitHub Pages"],
    },
    {
      id: "styles",
      title: "Styles & tokens",
      summary:
        "Design tokens for color, space and motion, with 7:1 contrast in every theme.",
      points: [
        "CSS Modules, one folder per component.",
        "Logical properties, so right-to-left layouts mirror.",
      ],
      tags: ["SCSS", "CSS Modules", "Container queries"],
    },
    {
      id: "state",
      title: "State",
      summary: "Small stores for navigation and preferences.",
      points: [
        "Theme and motion choices are remembered in your browser.",
        "The address tracks the section, so Back and Forward work.",
      ],
      tags: ["Zustand", "React 19"],
    },
    {
      id: "components",
      title: "Components",
      summary: "One component per item, each in its own folder.",
      points: [
        "Native elements first: buttons, dialogs, tabs with full keyboard support.",
        "Every animation has a reduced-motion version.",
      ],
      tags: ["React", "WAI-ARIA patterns"],
    },
    {
      id: "content",
      title: "Content",
      summary: "Text lives outside the components, ready for translation.",
      points: [
        "A language selector with right-to-left support built in.",
        "Headings and landmarks give screen readers the outline.",
      ],
      tags: ["i18n-ready", "WCAG AAA contrast"],
    },
  ] satisfies readonly SiteLayer[],
};

// What James is looking for: a compatibility scan. The setup, role and team fits are
// James's own (2026-11-23 and 2026-11-24). Pay is deliberately not part of it.
export interface LookingForOption {
  label: string;
  fit: number; // 0–1, how well this option fits what James is looking for
}

export interface LookingForReel {
  id: string;
  label: string;
  options: readonly LookingForOption[];
}

export const INTRODUCTION_LOOKING_FOR = {
  tag: "Compatibility scan",
  intro: "Set up your opportunity to see how well it fits.",
  previous: (label: string) => `Previous ${label.toLowerCase()}`,
  next: (label: string) => `Next ${label.toLowerCase()}`,
  sync: "Sync",
  verdicts: {
    strong: "Strong match. Let's talk.",
    maybe: "Worth a conversation.",
    weak: "Probably not the right fit.",
  },
  talk: "Let's talk",
  reels: [
    {
      id: "role",
      label: "Role",
      options: [
        { label: "Software Architect", fit: 1 },
        { label: "Tech Lead", fit: 0.95 },
        { label: "Principal Engineer", fit: 0.9 },
        { label: "Senior Developer", fit: 0.6 },
        { label: "Engineering Manager", fit: 0.5 },
      ],
    },
    {
      id: "team",
      label: "Team",
      options: [
        { label: "Mid-size team", fit: 1 },
        { label: "Small team", fit: 0.85 },
        { label: "Large organization", fit: 0.75 },
        { label: "Solo role", fit: 0.4 },
      ],
    },
    {
      id: "setup",
      label: "Work setup",
      // James's order of preference (2026-11-23): on-site, hybrid, remote; not relocation.
      options: [
        { label: "On-site", fit: 1 },
        { label: "Hybrid", fit: 0.85 },
        { label: "Remote", fit: 0.6 },
        { label: "Relocation", fit: 0 },
      ],
    },
  ] satisfies readonly LookingForReel[],
};

// Beyond work: a star map of personal items, in James's own words (2026-11-24) and from
// his LinkedIn. What he gives back is private, so it has no item.
export type BeyondWorkIcon = "compass" | "wrench" | "book" | "heart" | "usaf";

export interface BeyondWorkItem {
  id: string;
  icon: BeyondWorkIcon;
  title: string;
  body: string;
}

export const INTRODUCTION_BEYOND_WORK = {
  tag: "Star map",
  starsLabel: "Discoveries",
  discovery: (position: number) =>
    `Discovery ${String(position).padStart(2, "0")}`,
  items: [
    {
      id: "off-the-clock",
      icon: "compass",
      title: "Off the clock",
      body: "Good restaurants, video games, and time with my family and my dog.",
    },
    {
      id: "builds",
      icon: "wrench",
      title: "Built for fun",
      body: "Video games in Unreal Engine and Unity. My bachelor's is in game and simulation programming.",
    },
    {
      id: "learning",
      icon: "book",
      title: "Always learning",
      body: "Continuing education through Pluralsight and Udemy, after four degrees and a certification; at work, AI-assisted development.",
    },
    {
      id: "veteran",
      icon: "usaf", // the Air Force symbol from the header
      title: "U.S. Air Force veteran",
      body: "Thirteen years of service, three Air Force Good Conduct Medals and five Outstanding Unit Awards.",
    },
  ] satisfies readonly BeyondWorkItem[],
};

// Where to next: the Introduction's "level complete" screen. Achievements are earned by
// playing with each part (see state/introductionProgress).
export type AchievementId =
  | "opening"
  | "origin"
  | "principles"
  | "thisSite"
  | "lookingFor"
  | "beyondWork";

export interface Achievement {
  id: AchievementId;
  title: string;
  how: string; // how it is earned, shown while locked
}

export const INTRODUCTION_NEXT_STEP = {
  tag: "Level complete",
  banner: "Introduction complete",
  achievementsLabel: "Achievements",
  score: (earned: number, total: number) => `${earned} of ${total} unlocked`,
  locked: "Locked",
  unlocked: "Unlocked",
  nextTag: "Next level",
  nextTitle: "Professional Journey",
  nextLine: "From today back to the U.S. Air Force.",
  enter: "Enter Professional Journey",
  contact: "Or skip ahead and get in touch",
  achievements: [
    {
      id: "opening",
      title: "Module explorer",
      how: "Open a module in the opening.",
    },
    { id: "origin", title: "Navigator", how: "Fly to another waypoint." },
    { id: "principles", title: "Power user", how: "Switch on a principle." },
    {
      id: "thisSite",
      title: "Inspector",
      how: "Inspect a layer or switch the theme.",
    },
    { id: "lookingFor", title: "Matchmaker", how: "Spin a reel in the scan." },
    { id: "beyondWork", title: "Star hopper", how: "Visit another star." },
  ] satisfies readonly Achievement[],
};
