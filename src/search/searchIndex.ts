// The site's search: an index built from the same content the sections render, so it can
// never drift from what is on screen, and a plain word search over it. Each entry is one
// place a visitor can be taken to: a story part, a job, a credential, a technology or a
// project chapter, addressed by its deep link (#section/key).
import {
  ARCHITECTURE_APPROACH,
  ARCHITECTURE_DECISIONS,
  ARCHITECTURE_EXPLORER,
  ARCHITECTURE_MAGIC,
  ARCHITECTURE_NEXT_STEP,
  ARCHITECTURE_PARTS,
  ARCHITECTURE_PIPELINE,
  ARCHITECTURE_PLAYBOOK,
} from "../content/architectureExpertise";
import {
  CONTACT_CHANNELS,
  CONTACT_HIRE,
  CONTACT_NEXT,
  CONTACT_PARTS,
} from "../content/contact";
import {
  FEATURED_PROJECTS_LABELS,
  PROJECTS,
} from "../content/featuredProjects";
import {
  INTRODUCTION_BEYOND_WORK,
  INTRODUCTION_LOOKING_FOR,
  INTRODUCTION_NEXT_STEP,
  INTRODUCTION_OPENING,
  INTRODUCTION_ORIGIN,
  INTRODUCTION_PARTS,
  INTRODUCTION_PRINCIPLES,
  INTRODUCTION_THIS_SITE,
} from "../content/introduction";
import {
  LEADERSHIP_DELIVERY,
  LEADERSHIP_HARD_CALLS,
  LEADERSHIP_LEAD,
  LEADERSHIP_PARTS,
  LEADERSHIP_RESULTS,
  LEADERSHIP_SERVICE,
  LEADERSHIP_THEIR_WORDS,
  LEADERSHIP_TRUST,
} from "../content/leadershipResults";
import {
  CREDENTIALS,
  JOBS,
  PROFESSIONAL_JOURNEY_LABELS,
} from "../content/professionalJourney";
import { SECTIONS } from "../content/sections";
import { SKILLS } from "../content/skills";
import { STACK, TECH_STACK_LABELS } from "../content/techStack";

export interface SearchEntry {
  href: string; // the deep link: #section/key
  title: string;
  where: string; // the section, and sub-section where there is one
  text: string; // everything searchable, title first
}

export interface SearchResult {
  entry: SearchEntry;
  snippet: string; // a short excerpt around the first match, or the entry's opening
}

// Content keys that hold no words a visitor sees (ids, icons, colors, sizes).
const SKIP = new Set([
  "id",
  "icon",
  "src",
  "href",
  "logo",
  "emblem",
  "monogram",
  "theme",
  "scene",
  "motif",
  "fit",
  "value",
  "width",
  "height",
  "importance",
  "certificate",
  "jobs",
  "level",
  "kind",
  "category",
  "accentDark",
  "accentLight",
]);

// Every visible string in a piece of content, in order.
function wordsOf(value: unknown, key = ""): string[] {
  if (SKIP.has(key)) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((item) => wordsOf(item));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([name, item]) => wordsOf(item, name));
  }
  return [];
}

const label = (sectionId: string) =>
  SECTIONS.find((section) => section.id === sectionId)?.label ?? sectionId;

// A tab told as one story: one entry per part, its heading over everything in it.
function storyEntries(
  sectionId: string,
  parts: Record<string, { heading: string }>,
  content: Record<string, unknown>,
): SearchEntry[] {
  return Object.entries(parts).map(([key, { heading }]) => ({
    href: `#${sectionId}/${key}`,
    title: heading,
    where: label(sectionId),
    text: [heading, ...wordsOf(content[key])].join(" · "),
  }));
}

function buildIndex(): SearchEntry[] {
  const journey = label("professional-journey");
  const { chains } = PROFESSIONAL_JOURNEY_LABELS;
  const stack = label("tech-stack");
  const projects = label("featured-projects");

  return [
    ...storyEntries("introduction", INTRODUCTION_PARTS, {
      opening: INTRODUCTION_OPENING,
      origin: INTRODUCTION_ORIGIN,
      principles: INTRODUCTION_PRINCIPLES,
      thisSite: INTRODUCTION_THIS_SITE,
      lookingFor: INTRODUCTION_LOOKING_FOR,
      beyondWork: INTRODUCTION_BEYOND_WORK,
      nextStep: INTRODUCTION_NEXT_STEP,
    }),
    ...JOBS.map((job) => ({
      href: `#professional-journey/job-${job.id}`,
      title: `${job.role} · ${job.company}`,
      where: `${journey} · ${chains.career}`,
      text: [
        job.company,
        job.role,
        `${job.start} – ${job.end ?? "Present"}`,
        job.summary,
        ...job.highlights.flatMap((highlight) => [
          highlight.title,
          highlight.challenge,
          highlight.approach,
          highlight.impact,
        ]),
        ...job.tech,
      ].join(" · "),
    })),
    ...CREDENTIALS.map((credential) => ({
      href: `#professional-journey/cred-${credential.id}`,
      title: credential.title,
      where: `${journey} · ${chains.credentials}`,
      text: [
        credential.title,
        [credential.issuer, credential.awarded?.slice(0, 4)]
          .filter(Boolean)
          .join(", "),
        credential.detail ?? "",
      ].join(" · "),
    })),
    ...storyEntries("architecture-expertise", ARCHITECTURE_PARTS, {
      approach: ARCHITECTURE_APPROACH,
      explorer: ARCHITECTURE_EXPLORER,
      decisions: ARCHITECTURE_DECISIONS,
      playbook: ARCHITECTURE_PLAYBOOK,
      pipeline: ARCHITECTURE_PIPELINE,
      magic: ARCHITECTURE_MAGIC,
      nextStep: ARCHITECTURE_NEXT_STEP,
    }),
    ...STACK.map((item) => ({
      href: `#tech-stack/${item.id}`,
      title: item.name,
      where: `${stack} · ${TECH_STACK_LABELS.kinds[item.kind]}`,
      text: [
        item.name,
        TECH_STACK_LABELS.categories[item.category],
        item.about ?? "",
        SKILLS.find((skill) => skill.slug === item.id)?.summary ?? "",
        ...item.jobs.map(
          (jobId) => JOBS.find((job) => job.id === jobId)?.company ?? "",
        ),
      ].join(" · "),
    })),
    ...PROJECTS.flatMap((project) =>
      project.chapters.map((chapter) => ({
        href: `#featured-projects/${project.id}.${chapter.id}`,
        title: chapter.heading,
        where: `${projects} · ${project.name}`,
        text: [
          chapter.heading,
          project.name,
          chapter.lead,
          ...chapter.points,
          chapter.shot.alt,
          FEATURED_PROJECTS_LABELS.redacted,
        ].join(" · "),
      })),
    ),
    ...storyEntries("leadership-results", LEADERSHIP_PARTS, {
      lead: LEADERSHIP_LEAD,
      results: LEADERSHIP_RESULTS,
      trust: LEADERSHIP_TRUST,
      delivery: LEADERSHIP_DELIVERY,
      hardCalls: LEADERSHIP_HARD_CALLS,
      service: LEADERSHIP_SERVICE,
      theirWords: LEADERSHIP_THEIR_WORDS,
    }),
    ...storyEntries("contact", CONTACT_PARTS, {
      hire: CONTACT_HIRE,
      channels: CONTACT_CHANNELS,
      next: CONTACT_NEXT,
    }),
  ];
}

const INDEX = buildIndex();

// Lower case, accents off, punctuation as spaces: "C#" and ".NET" stay findable.
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9#+.$%]+/g, " ");
}

const PREPARED = INDEX.map((entry) => ({
  entry,
  title: normalize(entry.title),
  text: normalize(entry.text),
}));

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// A sentence-sized excerpt around a word's first place in the text.
function snippetAround(text: string, word: string): string {
  // Found in the text as written (case aside), so the excerpt's offsets are its own.
  const match = new RegExp(escapeRegExp(word), "i").exec(text);
  if (!match) return "";
  const at = match.index;
  const separator = text.lastIndexOf(" · ", at);
  const start = Math.max(separator < 0 ? 0 : separator + 3, at - 70);
  const endMark = text.indexOf(" · ", at + word.length);
  const end = Math.min(
    text.length,
    endMark < 0 ? at + 110 : Math.min(endMark, at + 110),
  );
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

// Every entry holding every word typed, best first: words in the title count most,
// then words that start a word in the text. At most `limit` results.
export function searchSite(query: string, limit = 8): SearchResult[] {
  const words = normalize(query).split(" ").filter(Boolean);
  if (!words.length) return [];
  const scored: { result: SearchResult; score: number }[] = [];
  for (const { entry, title, text } of PREPARED) {
    let score = 0;
    let all = true;
    for (const word of words) {
      if (!text.includes(word)) {
        all = false;
        break;
      }
      if (title.includes(word)) score += 10;
      if (new RegExp(`(^| )${escapeRegExp(word)}`).test(text)) score += 3;
      score += 1;
    }
    if (!all) continue;
    // The excerpt: around the first word in the body (after the leading name), or the
    // body's opening when the words are only in the name.
    const body = entry.text.slice(entry.text.indexOf(" · ") + 3);
    const opening = body.split(" · ")[0];
    scored.push({
      result: {
        entry,
        snippet:
          snippetAround(body, words[0]) ||
          (opening.length > 110 ? `${opening.slice(0, 110)}…` : opening),
      },
      score,
    });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ result }) => result);
}

// Goes to a result: the section, its sub-section and the part, through the same deep
// link a visitor could open (Back returns to where they were).
export function goToResult(entry: SearchEntry): void {
  if (window.location.hash === entry.href) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = entry.href;
  }
}
