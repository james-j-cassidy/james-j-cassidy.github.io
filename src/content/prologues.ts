// Each tab's prologue: the opening scene in the stage below the full header, before the
// header collapses and the tab's first part forms. English; kept out of components so
// translations can replace it per language.
import { STACK } from "./techStack";

export type PrologueScene =
  "boot" | "flight" | "blueprint" | "conveyor" | "launch" | "dawn" | "signal";

export interface PrologueContent {
  scene: PrologueScene;
  tag: string;
  title: string;
  line: string;
  cue: string; // the button that begins the tab
}

export const PROLOGUES = {
  introduction: {
    scene: "boot",
    tag: "Mission briefing",
    title: "Hi, I'm James.",
    line: "Architect, tech lead and U.S. Air Force veteran. This site is the long version of my resume.",
    cue: "Scroll to begin",
  },
  "professional-journey": {
    scene: "flight",
    tag: "Flight plan",
    title: "Eight stops, one flight path",
    line: "From a cloud-native platform today back to the U.S. Air Force.",
    cue: "Scroll to take off",
  },
  "architecture-expertise": {
    scene: "blueprint",
    tag: "Blueprint",
    title: "Every system starts on paper",
    line: "How I design, decide, modernize and ship.",
    cue: "Scroll to build",
  },
  "tech-stack": {
    scene: "conveyor",
    tag: "Loading bay",
    title: `${STACK.length} technologies and tools`,
    line: "Each one with the roles that used it, and when.",
    cue: "Scroll to unpack",
  },
  "featured-projects": {
    scene: "launch",
    tag: "Launch pad",
    title: "Built from the ground up",
    line: "Full write-ups of what I've built, starting with Focus Frame.",
    cue: "Scroll to launch",
  },
  "leadership-results": {
    scene: "dawn",
    tag: "First light",
    title: "Every summit starts at dawn",
    line: "How I lead, and the results that stuck.",
    cue: "Scroll to climb",
  },
  contact: {
    scene: "signal",
    tag: "Open channel",
    title: "Let's talk",
    line: "Make me an offer, or find me on LinkedIn and GitHub.",
    cue: "Scroll to tune in",
  },
} as const satisfies Record<string, PrologueContent>;

export type PrologueSection = keyof typeof PROLOGUES;

// The boot lines on the Introduction's terminal, typed one after another.
export const PROLOGUE_BOOT_LINES = [
  "> boot james.exe",
  "> load 25+ years ......... ok",
  "> contrast check ......... AAA",
  "> ready",
] as const;

// The chips riding the Tech Stack's conveyor: every item's monogram, in the stack's order.
export const PROLOGUE_CHIPS: readonly string[] = STACK.map(
  (item) => item.monogram,
);
