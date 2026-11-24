// The Contact tab's content (English). Kept out of components so translations can replace
// it per language.
import { HIRE_ME_LABELS } from "./hireMe";

export type ChannelId = "resume" | "linkedIn" | "gitHub";

export interface Channel {
  id: ChannelId;
  name: string;
  detail: string;
  action: string; // what the link does, read with the name
  href: string; // "" until the link exists; a channel without one is not shown
  download?: string; // a file to save, under this name, rather than a page to open
}

// The heading of each part, in story order.
export const CONTACT_PARTS = {
  hire: { heading: "Let's build what's next" },
  channels: { heading: "Other ways to reach me" },
  next: { heading: "Straight to me" },
} as const;

// 1. Open channel: the Hire Me form, first and largest.
export const CONTACT_HIRE = {
  tag: "Open channel",
  line: "Tell me about the role. The form is quick, and it shows how likely I am to look before you send it.",
  cta: HIRE_ME_LABELS.open,
  formLabel: "In the form",
  form: [
    "The work and the role",
    "Pay and benefits, with the details",
    "Skills, picked from my stack",
    "Your chance I look, before you send",
  ],
} as const;

// 2. Channels: the resume, LinkedIn and GitHub.
export const CONTACT_CHANNELS = {
  tag: "Channels",
  line: "Not ready for an offer yet? Start here.",
  channels: [
    {
      id: "resume",
      name: "Resume",
      detail: "A PDF to keep and share",
      action: "Download",
      // Printed from tools/resume/resume.html (npm run resume).
      href: `${import.meta.env.BASE_URL}resume.pdf`,
      download: "James-Joseph-Cassidy-Resume.pdf",
    },
    {
      id: "linkedIn",
      name: "LinkedIn",
      detail: "My professional profile",
      action: "Open",
      href: "https://www.linkedin.com/in/jamesjosephcassidy/",
    },
    {
      id: "gitHub",
      name: "GitHub",
      detail: "My personal code",
      action: "Open",
      href: "https://github.com/james-j-cassidy",
    },
  ] satisfies readonly Channel[],
} as const;

// 3. What happens next: where an offer goes and who answers it.
export const CONTACT_NEXT = {
  tag: "What happens next",
  steps: [
    {
      title: "You send it",
      text: "Your offer goes straight to my own inbox and records.",
    },
    {
      title: "I read it myself",
      text: "It comes to me, not to a recruiter or an agency.",
    },
    {
      title: "I reply to you",
      text: "From my personal email, to the address you give.",
    },
  ],
  consultingLabel: HIRE_ME_LABELS.engagements.consulting,
  consulting: HIRE_ME_LABELS.engagementNotes.consulting,
  cta: HIRE_ME_LABELS.open,
} as const;
