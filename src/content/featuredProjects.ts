// The Featured Projects tab: one sub-tab per project, each a full article told as a scroll
// story, one chapter per part. English; kept out of components so translations can
// replace it per language.
//
// Every statement is taken from the project's own code and documentation. Screenshots
// are of the live app with every name, key, title, path and meeting covered; nothing
// about James's employer appears.

export type ProjectId = "focus-frame";

export interface ProjectShot {
  src: string; // under public/
  alt: string; // what the screen shows (its covered details are not described)
  width: number;
  height: number;
}

export interface ProjectChapter {
  id: string;
  short: string; // on the chapter rail
  heading: string;
  lead: string;
  points: readonly string[];
  shot: ProjectShot;
}

export interface Project {
  id: ProjectId;
  name: string;
  short: string; // on the sub-tab on phones
  kind: string; // the line over each chapter's heading
  monogram: string; // the backdrop's watermark
  // The project's accent; each reaches 7:1 (AAA) on the page and the cards of its theme.
  accentDark: string;
  accentLight: string;
  chapters: readonly ProjectChapter[];
}

export const FEATURED_PROJECTS_LABELS = {
  tabsLabel: "Projects",
  railLabel: "Chapters",
  view: "View the screen full size",
  close: "Close",
  redacted: "Live screen. Company details are covered.",
  shotOf: (heading: string) => `Screenshot: ${heading}`,
};

const SHOT = { width: 2880, height: 1800 };
const shot = (name: string, alt: string): ProjectShot => ({
  src: `projects/focus-frame/${name}.webp`,
  alt,
  ...SHOT,
});

// Focus Frame: from its repository (the modular rewrite on its development branch).
const FOCUS_FRAME: Project = {
  id: "focus-frame",
  name: "Focus Frame",
  short: "Focus Frame",
  kind: "Focus Frame · personal project",
  monogram: "FF",
  accentDark: "#67e8f9", // 12.5:1 on #0a1530, 11.1:1 on #0f1f45
  accentLight: "#0c4a6e", // 8.9:1 on #f4f8ff, 9.5:1 on #ffffff
  chapters: [
    {
      id: "question",
      short: "The question",
      heading: "What should I be doing right now?",
      lead: "Focus Frame is the tool I built from the ground up to answer that question at any given moment. It reads my work, ranks it and keeps the most important thing in front of me, like a chief of staff for my workday.",
      points: [
        "Now, Next and Blocked at a glance, for my employer's work, my personal work or both together.",
        "A deterministic selector picks the next issue: the active sprint first, then production. Blocked work is skipped, and a partial scan never picks on its own.",
        "Tasks are ranked on six factors, each with a written reason: urgency, impact, balance between my roles, staleness, momentum and pins. Same inputs, same ranking, no AI in the loop.",
      ],
      shot: shot(
        "now",
        "Focus Frame's Now screen: counts of work in play, next, tasks, blocked, findings and decisions, with the issues in play and the open findings beside them.",
      ),
    },
    {
      id: "plan",
      short: "Planning",
      heading: "A sprint that fits the time I have",
      lead: "Sprint planning starts from capacity, not hope. Focus Frame scans the Jira sprints and shows capacity against commitment before I commit to anything.",
      points: [
        "Capacity against commitment for the active sprint and the sprints ahead.",
        "Time off and holidays are entered as capacity events, so planning sees them.",
        "When a sprint closes, a learning loop joins the plan to what actually happened.",
      ],
      shot: shot(
        "plan",
        "The Plan screen: the active sprint with capacity against commitment and time off, the sprints ahead, and the sprint settings.",
      ),
    },
    {
      id: "time",
      short: "Time",
      heading: "Time that logs itself",
      lead: "A workday clock follows the issues in play and splits the time between them, after meetings and breaks. At the end of the day the worklogs write themselves to Jira.",
      points: [
        "Close-out only ever adds, and never adds twice: each worklog carries a mark that makes running it again safe.",
        "If a worklog write fails, a desktop alert says so.",
        "The day plan sits on the same screen, hour by hour.",
      ],
      shot: shot(
        "today",
        "The Today screen: the day's plan laid out hour by hour, with preferences and a button to rebuild the plan.",
      ),
    },
    {
      id: "sources",
      short: "Sources",
      heading: "Read-mostly by design",
      lead: "Focus Frame reads mail, calendar, Jira, Slack and phone, and turns what it reads into observations that keep their source. It never writes to the mailbox.",
      points: [
        "Mail triage is a rule set, not a model: no AI is consulted, and every result carries a reason a person can read.",
        "Microsoft 365 access is delegated and read-only: the signed-in user and their mail, nothing more.",
        "Teams ships switched off, behind an opt-in.",
      ],
      shot: shot(
        "sources",
        "The Sources screen: each connected source with its connection, authentication, permissions, last sync and how much it has processed.",
      ),
    },
    {
      id: "guardian",
      short: "Guardian",
      heading: "AI under guardrails",
      lead: "Claude works both ways: Claude Desktop drives Focus Frame through 116 MCP tools, and Focus Frame hands delegated work to Claude Code. Every action passes Guardian, a policy gate that writes the audit record before anything runs.",
      points: [
        "The audit chain is append-only, each entry hashed to the last, so it can never fork.",
        "The kill switch fails safe: if its state can't be read, it reads as engaged.",
        "No path through MCP can confirm on my behalf, and there's no SQL, shell or open web tool. If Claude is down, ranking and policy keep working.",
      ],
      shot: shot(
        "status",
        "The System Status screen: Guardian's live log of allowed actions, and the health of Microsoft Graph, Claude Desktop over MCP, the sources and the event backbone.",
      ),
    },
    {
      id: "knowledge",
      short: "Knowledge",
      heading: "Knowledge with a paper trail",
      lead: "Focus Frame maps code into a knowledge graph by reading it, never running it: C# through Roslyn, plus SQL migrations, schemas, projects and solutions. Every fact keeps its source.",
      points: [
        "Architecture diagrams, snapshot comparisons and pull-request changes come from the same graph.",
        "Bug rates use only classifications a person has confirmed, and say “insufficient data” rather than invent a number.",
        "Knowledge is tagged Personal, Employer or Public, so it never crosses a line by accident.",
      ],
      shot: shot(
        "knowledge",
        "The Knowledge screen: registered sources with their health and counts of entities, relations and assertions, and the selected source's details.",
      ),
    },
    {
      id: "rebuild",
      short: "The rebuild",
      heading: "Rebuilt without changing a thing",
      lead: "Late in 2026 I rebuilt Focus Frame as a modular monolith, with one rule: no change anyone could notice. An old and a new copy ran side by side to prove it.",
      points: [
        "58 projects: .NET 9, ASP.NET Core, PostgreSQL 18, React and TypeScript.",
        "About 1,270 automated .NET tests, about 540 front-end tests and 80 database migrations.",
        "579 commits since July 2025, built with AI-assisted development under 16 written engineering standards.",
      ],
      shot: shot(
        "history",
        "The History screen: a calendar of recorded days, the chosen day's blocks of work and meetings, and its event timeline.",
      ),
    },
  ],
};

export const PROJECTS: readonly Project[] = [FOCUS_FRAME];
