// The Architecture Expertise tab's story parts, in scroll order. English headings; kept
// out of components so translations can replace them per language. Each part's real
// content replaces its placeholder when that part is built.
export const ARCHITECTURE_PARTS = {
  approach: { heading: "How I design systems" },
  explorer: { heading: "Architecture explorer" },
  decisions: { heading: "Decision records" },
  playbook: { heading: "Modernization playbook" },
  pipeline: { heading: "Delivery pipeline" },
  magic: { heading: "UX is a magic trick" },
  nextStep: { heading: "Where to next" },
} as const;

// A project trait that decides whether a conditional stage runs.
export type DesignTrait = "unproven" | "interface";

// One stage of the design process. A stage with `when` runs only when that trait is
// true for the project; the others always run.
export interface DesignStage {
  id: "discover" | "quality" | "model" | "decide" | "spike" | "mockup";
  short: string; // the chip's label on the board
  title: string;
  question: string; // what the stage answers
  summary: string;
  outputs: readonly string[];
  when?: DesignTrait;
  whenText?: string; // when the stage runs, for conditional stages
}

// "How I design systems": an agile design loop. Six stages lead to a thin slice that
// ships, and what is learned feeds the next iteration. The spike and the mock-ups run
// only when the project needs them.
export const ARCHITECTURE_APPROACH = {
  tag: "Agile design loop",
  stagesLabel: "Design stages",
  stage: (position: number) => `Stage ${String(position).padStart(2, "0")}`,
  skipped: "Not needed",
  skippedState: "Not needed for this project",
  activeState: "Runs for this project",
  build: "Ship",
  buildLabel: "Ship a thin slice",
  loop: "Feedback into the next iteration",
  route: "Route",
  outputsLabel: "Produces",
  traitsLabel: "This project",
  traits: {
    unproven: "Unproven technology",
    interface: "Has a user interface",
  } satisfies Record<DesignTrait, string>,
  stages: [
    {
      id: "discover",
      short: "Discover",
      title: "Discover how it will be used",
      question:
        "Who uses it, what goes in, what should come out and how will we know it works?",
      summary:
        "Start from outcomes: how the system will be used, its inputs and expected results, written as user stories with acceptance criteria and measures of success.",
      outputs: [
        "User stories",
        "Inputs & expected results",
        "Success measures",
      ],
    },
    {
      id: "quality",
      short: "Quality",
      title: "Set measurable quality goals",
      question: "How fast, how secure, how available and at what cost?",
      summary:
        "Performance, security, availability and cost become measurable targets, checked automatically in the pipeline so every change is held to them.",
      outputs: [
        "Performance targets",
        "Security & compliance",
        "Uptime & cost",
      ],
    },
    {
      id: "model",
      short: "Model",
      title: "Model just enough: UML and ERD",
      question: "How do the parts and the data fit together?",
      summary:
        "Light UML and ERD sketches, just enough to align the team, kept with the code and updated each sprint as the design evolves.",
      outputs: ["UML sketches", "ERD", "Living documentation"],
    },
    {
      id: "decide",
      short: "Decide",
      title: "Decide and record the trade-offs",
      question: "Which option, and why?",
      summary:
        "Options are weighed against the quality goals, and each significant decision is written up as a short architecture decision record.",
      outputs: ["Options compared", "Decision records", "Known risks"],
    },
    {
      id: "spike",
      short: "Spike",
      title: "Spike the unknowns",
      question: "Will this technology do what we need?",
      summary:
        "A time-boxed spike inside the sprint proves or rules out a technology before the design depends on it.",
      outputs: ["A working proof", "A clear yes or no", "Known limits"],
      when: "unproven",
      whenText: "Only when the technology is new or unproven.",
    },
    {
      id: "mockup",
      short: "Mock-ups",
      title: "Mock up and test with users",
      question: "Will people understand it?",
      summary:
        "A few UX mock-ups, put in front of real users early so the design changes before the code does.",
      outputs: ["Key screens", "User flows", "User feedback"],
      when: "interface",
      whenText:
        "Only when there is a user interface and mock-ups are possible.",
    },
  ] satisfies readonly DesignStage[],
} as const;

// ── Architecture explorer ─────────────────────────────────────────────────────────

export type SystemNodeId =
  "cdn" | "gateway" | "api" | "cache" | "queue" | "worker" | "database";

export type SystemEdgeId =
  | "cdn-gateway"
  | "gateway-api"
  | "api-cache"
  | "api-database"
  | "api-queue"
  | "queue-worker"
  | "worker-database";

// How the system copes when a part goes down: "up" means no visitor notices,
// "degraded" means it stays up but something is slower or later.
export type SystemHealth = "up" | "degraded";

export interface SystemNode {
  id: SystemNodeId;
  short: string; // the node's label on the map
  title: string;
  role: string; // why it is there
  failure: {
    health: SystemHealth;
    pattern: string; // the resilience pattern that keeps the system up
    text: string;
    cut: readonly SystemEdgeId[]; // connections that stop
    busy: readonly SystemEdgeId[]; // connections that carry the extra load
    standby?: boolean; // a standby copy takes over
    backlog?: boolean; // work piles up in the queue
    breaker?: boolean; // a circuit breaker opens between the API and the database
  };
}

// "Architecture explorer": a sample cloud system (synthetic, not any employer's). Choose
// a part to see why it is there; chaos mode takes it down to show how the system stays up.
export const ARCHITECTURE_EXPLORER = {
  tag: "Designed to fail well",
  intro:
    "A sample cloud system. Choose a part to see why it is there, then turn on chaos and take it down.",
  nodesLabel: "System parts",
  chaos: "Chaos: take it down",
  roleLabel: "Why it is there",
  failureLabel: "If it goes down",
  down: "Down",
  standby: "Standby",
  breaker: "Breaker open",
  backlog: "Backlog",
  statusLabel: "System",
  status: {
    healthy: "All parts healthy",
    up: "Still up: visitors notice nothing",
    degraded: "Still up, running degraded",
  },
  nodes: [
    {
      id: "cdn",
      short: "CDN",
      title: "Content delivery network",
      role: "Serves the web app from locations close to each visitor, so pages load fast anywhere.",
      failure: {
        health: "up",
        pattern: "Redundancy",
        text: "Requests go to the next nearest location. Visitors notice nothing.",
        cut: [],
        busy: [],
        standby: true,
      },
    },
    {
      id: "gateway",
      short: "Gateway",
      title: "API gateway",
      role: "One front door for every call: it checks who is calling, limits abuse and routes each request.",
      failure: {
        health: "degraded",
        pattern: "Failover",
        text: "Health checks move traffic to a standby gateway in a second region. Calls in flight are retried.",
        cut: [],
        busy: [],
        standby: true,
      },
    },
    {
      id: "api",
      short: "API",
      title: "API functions",
      role: "Small stateless functions hold the business rules, so they scale out with the load.",
      failure: {
        health: "up",
        pattern: "Retries with backoff",
        text: "One instance fails. The gateway retries the call on a healthy instance, waiting a little longer each time.",
        cut: [],
        busy: [],
        standby: true,
      },
    },
    {
      id: "cache",
      short: "Cache",
      title: "Cache",
      role: "Keeps frequent reads in memory, so the database does less work and pages stay fast.",
      failure: {
        health: "degraded",
        pattern: "Fall back to the source",
        text: "Reads go straight to the database: slower, still correct. The cache refills when it returns.",
        cut: ["api-cache"],
        busy: ["api-database"],
      },
    },
    {
      id: "queue",
      short: "Queue",
      title: "Message queue",
      role: "Takes slow work off the request, so visitors get an answer now and the work happens next.",
      failure: {
        health: "degraded",
        pattern: "Transactional outbox",
        text: "The API saves each message in the database with its data and sends it when the queue is back. Nothing is lost.",
        cut: ["api-queue", "queue-worker"],
        busy: ["api-database"],
      },
    },
    {
      id: "worker",
      short: "Worker",
      title: "Background workers",
      role: "Work through the queue at their own pace: reports, emails and imports.",
      failure: {
        health: "degraded",
        pattern: "Queue buffering",
        text: "Messages wait safely in the queue until the workers return, then drain. Background work is late, not lost.",
        cut: ["queue-worker", "worker-database"],
        busy: ["api-queue"],
        backlog: true,
      },
    },
    {
      id: "database",
      short: "Database",
      title: "PostgreSQL database",
      role: "The system of record: every fact stored once, with constraints that keep it correct.",
      failure: {
        health: "degraded",
        pattern: "Circuit breaker",
        text: "Calls fail fast instead of piling up. Reads come from the cache and writes wait in the queue until the standby database takes over.",
        cut: ["api-database", "worker-database"],
        busy: ["api-cache", "api-queue"],
        standby: true,
        backlog: true,
        breaker: true,
      },
    },
  ] satisfies readonly SystemNode[],
} as const;

// ── Decision records ──────────────────────────────────────────────────────────────

// How well an option meets a criterion. Shown with a mark and a word, never color alone.
export type DecisionScore = "strong" | "fair" | "weak";

export interface DecisionOption {
  name: string;
  scores: readonly DecisionScore[]; // one per criterion, in order
  chosen?: boolean;
}

export interface DecisionRecord {
  id: string;
  number: string; // "ADR-001"
  short: string; // the tab's label
  title: string;
  context: string;
  criteria: readonly string[];
  options: readonly DecisionOption[];
  decision: string;
  gains: readonly string[];
  costs: readonly string[];
}

// "Decision records": this site's own architecture decisions, written as ADRs. Real and
// checkable in the site's code, so no employer's work is shown.
export const ARCHITECTURE_DECISIONS = {
  tag: "Architecture decision records",
  intro:
    "Real decisions behind this site. Every option is weighed against the same goals, and the record keeps the why.",
  recordsLabel: "Decision records",
  status: "Accepted",
  contextLabel: "Context",
  optionsLabel: "Options weighed",
  optionLabel: "Option",
  chosenLabel: "Chosen",
  decisionLabel: "Decision",
  gainsLabel: "We gain",
  costsLabel: "We accept",
  scores: {
    strong: "Strong",
    fair: "Fair",
    weak: "Weak",
  } satisfies Record<DecisionScore, string>,
  records: [
    {
      id: "state",
      number: "ADR-001",
      short: "State",
      title: "Zustand for shared state",
      context:
        "The site keeps a little global state: theme, language and motion. The store should be small, typed and easy to read.",
      criteria: ["Small bundle", "Less code", "Proven", "Debug tools"],
      options: [
        {
          name: "Zustand",
          scores: ["strong", "strong", "strong", "fair"],
          chosen: true,
        },
        { name: "Redux Toolkit", scores: ["weak", "fair", "strong", "strong"] },
        { name: "Build our own", scores: ["strong", "fair", "weak", "weak"] },
      ],
      decision:
        "Zustand. State management is a solved problem: building our own adds risk without adding value.",
      gains: ["A store in a few lines", "Stores read like plain hooks"],
      costs: ["Fewer guardrails than Redux, so conventions are written down"],
    },
    {
      id: "static",
      number: "ADR-002",
      short: "Hosting",
      title: "A static site; demos run in the browser",
      context:
        "The site is free to host and open to anyone. Nothing a stranger does may run up a bill or expose a server.",
      criteria: ["Cost to run", "Attack surface", "Speed", "Server features"],
      options: [
        {
          name: "Static on GitHub Pages",
          scores: ["strong", "strong", "strong", "weak"],
          chosen: true,
        },
        {
          name: "Static plus serverless API",
          scores: ["fair", "fair", "strong", "strong"],
        },
        {
          name: "Server-rendered app",
          scores: ["weak", "weak", "fair", "strong"],
        },
      ],
      decision:
        "Static files on GitHub Pages. Every demo runs client-side, with no AI or paid APIs.",
      gains: ["No server to pay for or patch", "Served from a global CDN"],
      costs: [
        "Demos must fit in the browser",
        "Only the security headers GitHub Pages allows",
      ],
    },
    {
      id: "libraries",
      number: "ADR-003",
      short: "Libraries",
      title: "Platform first, few libraries",
      context:
        "The site is evidence of engineering skill. Every dependency is code to trust, update and understand.",
      criteria: [
        "Speed to build",
        "Bundle size",
        "Understood fully",
        "Shows the skill",
      ],
      options: [
        {
          name: "Platform first",
          scores: ["fair", "strong", "strong", "strong"],
          chosen: true,
        },
        {
          name: "UI and animation libraries",
          scores: ["strong", "weak", "weak", "weak"],
        },
        {
          name: "Build everything",
          scores: ["weak", "strong", "strong", "fair"],
        },
      ],
      decision:
        "Build on the web platform. Use a library only for a solved problem, and only once its workings are understood.",
      gains: ["Three runtime dependencies: React, React DOM and Zustand"],
      costs: ["Slower to build: every animation and control is made here"],
    },
  ] satisfies readonly DecisionRecord[],
} as const;

// ── Modernization playbook ────────────────────────────────────────────────────────

export interface PlaybookStep {
  title: string;
  body: string;
  safety: string; // how the step stays safe
  moved: number; // jobs running in the cloud after this step
  facade: boolean; // the facade is in place
  sync: boolean; // data kept in step between the two systems
  retired: boolean; // the legacy system is switched off
}

// "Modernization playbook": the strangler fig pattern. A legacy desktop and database
// system moves to the cloud one job at a time, driven by a slider.
export const ARCHITECTURE_PLAYBOOK = {
  tag: "Strangler fig migration",
  intro:
    "Replace a legacy system one job at a time. The old system keeps running until the new one has taken every job.",
  sliderLabel: "Migration step",
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  safetyLabel: "Kept safe by",
  users: "Users",
  facade: "Facade",
  legacy: "Legacy desktop app",
  legacyData: "Legacy database",
  cloud: "Cloud platform",
  cloudData: "Cloud database",
  archived: "Archived",
  jobsMoved: (moved: number, total: number) =>
    `${moved} of ${total} jobs in the cloud`,
  jobs: ["Data intake", "Reports", "Payments", "Admin"],
  source:
    "Applied leading CPT Group's move from MS Access and SQL Server desktop tools to a cloud-native Azure platform.",
  steps: [
    {
      title: "Map what it does",
      body: "List every job the legacy system does and who depends on it, then rank the jobs by value and risk.",
      safety: "Nothing changes yet: the map is the plan.",
      moved: 0,
      facade: false,
      sync: false,
      retired: false,
    },
    {
      title: "Put a facade in front",
      body: "Route every user through one front door, so each job can move without users noticing.",
      safety: "One switch in the facade sends traffic back to the old path.",
      moved: 0,
      facade: true,
      sync: false,
      retired: false,
    },
    {
      title: "Move the first job",
      body: "Rebuild the job that hurts most in the cloud and send its traffic there.",
      safety:
        "Both run side by side, and results are compared before the switch.",
      moved: 1,
      facade: true,
      sync: false,
      retired: false,
    },
    {
      title: "Keep the data in step",
      body: "Each piece of data has one owner. Where both systems still need it, changes are synced.",
      safety: "Reconciliation reports catch any drift early.",
      moved: 2,
      facade: true,
      sync: true,
      retired: false,
    },
    {
      title: "Move the rest, one at a time",
      body: "Each job follows the same path: rebuild, compare, switch. Every release is small.",
      safety: "Any single job can roll back without touching the others.",
      moved: 4,
      facade: true,
      sync: true,
      retired: false,
    },
    {
      title: "Retire the legacy",
      body: "When no traffic reaches the old system, archive its data and switch it off.",
      safety: "The archive keeps history for audits and lookups.",
      moved: 4,
      facade: true,
      sync: false,
      retired: true,
    },
  ] satisfies readonly PlaybookStep[],
} as const;

// ── Delivery pipeline ─────────────────────────────────────────────────────────────

export type GateId =
  "format" | "lint" | "types" | "build" | "tests" | "budgets" | "deploy";

export interface PipelineGate {
  id: GateId;
  name: string;
  tool: string;
  checks: string;
  live: boolean; // runs on this site today; false: planned
}

export interface PipelineChange {
  id: string;
  label: string;
  caughtBy: GateId | null; // null: passes every gate in place
  result: string;
}

// "Delivery pipeline": a change flowing through the quality gates. The gates marked live
// are this site's real ones (Prettier, Oxlint, strict TypeScript, the Vite build); the
// rest are planned and shown as planned.
export const ARCHITECTURE_PIPELINE = {
  tag: "Quality gates",
  intro:
    "Every change passes the same gates in the same order. A gate that fails stops the change before anyone sees it.",
  changesLabel: "Send a change",
  prompt: "Choose a change to send it through the gates.",
  gatesLabel: "This site's gates",
  live: "In place",
  planned: "Planned",
  release: "Release",
  passed: "Passed",
  caught: "Caught",
  skipped: "Not yet",
  caughtBy: (gate: string, tool: string) => `Caught by ${gate} (${tool})`,
  shipped: "Ready to release",
  proofLabel: "At work",
  proof:
    "Introduced an auto-merge, auto-deploy fast lane to dev under written engineering standards.",
  source: "CPT Group",
  gates: [
    {
      id: "format",
      name: "Format",
      tool: "Prettier",
      checks: "Code laid out one way",
      live: true,
    },
    {
      id: "lint",
      name: "Lint",
      tool: "Oxlint",
      checks: "Bugs and risky patterns",
      live: true,
    },
    {
      id: "types",
      name: "Types",
      tool: "TypeScript, strict",
      checks: "Every value is what it claims",
      live: true,
    },
    {
      id: "build",
      name: "Build",
      tool: "Vite",
      checks: "The site compiles and bundles",
      live: true,
    },
    {
      id: "tests",
      name: "Tests",
      tool: "Vitest, Playwright",
      checks: "Behavior works end to end",
      live: false,
    },
    {
      id: "budgets",
      name: "Budgets",
      tool: "Accessibility and speed",
      checks: "AAA checks and Core Web Vitals",
      live: false,
    },
    {
      id: "deploy",
      name: "Deploy",
      tool: "GitHub Pages",
      checks: "Built once, released automatically",
      live: false,
    },
  ] satisfies readonly PipelineGate[],
  changes: [
    {
      id: "clean",
      label: "Clean change",
      caughtBy: null,
      result:
        "Passed every gate in place. Tests, budgets and automatic deploys are next.",
    },
    {
      id: "format",
      label: "Messy formatting",
      caughtBy: "format",
      result:
        "Prettier finds code not laid out the house way. One command fixes it.",
    },
    {
      id: "lint",
      label: "Unused variable",
      caughtBy: "lint",
      result: "Oxlint flags dead code before it confuses the next reader.",
    },
    {
      id: "types",
      label: "Wrong type",
      caughtBy: "types",
      result:
        "Strict TypeScript stops a value the code does not expect, before it can fail for a visitor.",
    },
    {
      id: "build",
      label: "Broken styles",
      caughtBy: "build",
      result:
        "The build fails on styles that will not compile, so a broken page never ships.",
    },
  ] satisfies readonly PipelineChange[],
} as const;

// ── UX is a magic trick ───────────────────────────────────────────────────────────

export type MagicScenario = "slow" | "blip" | "down";

// What the team's console shows: its level and words.
export type MagicLogLevel = "info" | "warn" | "error" | "none";

// "UX is a magic trick": James's principle. Users believe what they are shown, and
// performance is the budget for the trick. The trick is in the timing, never the truth:
// the user gets a calm, honest experience and every failure goes, loudly, to the team.
// A synthetic to-do app saves to a server that can be slow, fail once, or stay down;
// the magic switch compares a naive design with the designed one.
export const ARCHITECTURE_MAGIC = {
  tag: "Calm for users, loud for engineers",
  intro:
    "Performance is the magic budget: spend it where people feel it. The trick is in the timing, never the truth. A real failure is told plainly, and every failure reaches the team.",
  magic: "UX magic",
  scenariosLabel: "What the server does",
  scenarios: {
    slow: "Responds slowly",
    blip: "Fails once, then recovers",
    down: "Stays down",
  } satisfies Record<MagicScenario, string>,
  // Phones: the same, shorter.
  scenariosShort: {
    slow: "Slow",
    blip: "Fails once",
    down: "Stays down",
  } satisfies Record<MagicScenario, string>,
  userLabel: "What the user sees",
  teamLabel: "What the team sees",
  appTitle: "Event tasks",
  add: "Add task",
  tasks: [
    "Book the venue",
    "Send the invites",
    "Order the food",
    "Confirm the speakers",
  ],
  empty: "No tasks yet.",
  wait: "Please wait…",
  saving: "Saving…",
  saved: "Saved",
  notSaved: "Not saved",
  honest: (task: string) =>
    `We couldn't save “${task}” yet. It's kept here, so nothing is lost.`,
  retry: "Try again",
  naiveErrors: {
    blip: "Error 503: Service Unavailable. Request failed with status code 503.",
    down: "Error 503: Service Unavailable. Request failed with status code 503.",
  },
  teamIdle: "Waiting for the next request.",
  teamSilent: "Nothing logged. The team hears about it from a complaint.",
  log: {
    started: "save started",
    slow: (ms: number) => `save took ${ms} ms; budget 300 ms`,
    retry: (attempt: number, delay: number) =>
      `503 from API · retry ${attempt} in ${delay} ms`,
    recovered: (attempt: number) => `retry ${attempt} succeeded`,
    failed: (tries: number) =>
      `save failed after ${tries} tries · on-call alerted`,
  },
  waitedLabel: "User waited",
  tookLabel: "Server took",
  seconds: (ms: number) => `${(ms / 1000).toFixed(1)} s`,
} as const;

// ── Where to next ─────────────────────────────────────────────────────────────────

// "Where to next": the route leaves the board for the next tabs.
export const ARCHITECTURE_NEXT_STEP = {
  tag: "Keep exploring",
  line: "Featured Projects puts this approach to work, one project at a time.",
  linksLabel: "Next sections",
  primary: "See the projects",
  others: "Or go to",
  seenLabel: "On this tab",
  seen: [
    "Design loop",
    "Explorer",
    "Decisions",
    "Playbook",
    "Pipeline",
    "UX magic",
  ],
} as const;
