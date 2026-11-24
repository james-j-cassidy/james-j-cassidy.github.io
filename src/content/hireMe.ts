// The Hire Me form: an offer, written on the site and sent from the visitor's own email
// app (no server). English; kept out of components so translations can replace it per
// language.

export type Engagement = "full-time" | "contract" | "consulting";
export type WorkPlace = "remote" | "hybrid" | "on-site";
export type PayPeriod = "year" | "hour";

// Where offers go. James's choice; it is in the site's public code.
export const HIRE_ME_TO = "cassidy.james.j@gmail.com";

// The Google Apps Script web app that saves each offer to James's Sheet and emails him
// (tools/hire-me-sheet). Public by design: all it does is receive offers. Empty, Send
// opens the visitor's email app instead.
export const HIRE_ME_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwgA17yOAahg2R0uTQMR0jPFkf6EDacg_Av9fRNiIqheMkUeIR1p7vRxf12rQzk0eXs/exec";

// The currencies a pay range can be in: code, sign and name.
export const CURRENCIES = [
  { value: "USD", mark: "$", label: "US dollars" },
  { value: "CAD", mark: "C$", label: "Canadian dollars" },
  { value: "EUR", mark: "€", label: "Euros" },
  { value: "GBP", mark: "£", label: "British pounds" },
  { value: "AUD", mark: "A$", label: "Australian dollars" },
] as const;

export type Currency = (typeof CURRENCIES)[number]["value"];

// Benefits a role can offer, so the whole package is weighed, not only pay. Each takes
// details (providers, match rates, amounts), with an example.
export const BENEFITS = [
  {
    id: "health",
    label: "Health, dental and vision",
    detail:
      "Providers or plans, and the employer's share, e.g. Aetna PPO, 90% paid",
  },
  {
    id: "retirement",
    label: "Retirement match",
    detail: "Match rate and vesting, e.g. 100% up to 6%, vested in 1 year",
  },
  { id: "bonus", label: "Annual bonus", detail: "Target, e.g. 15% of base" },
  {
    id: "equity",
    label: "Equity or stock",
    detail: "Grant and vesting, e.g. $80,000 in RSUs over 4 years",
  },
  { id: "signing", label: "Signing bonus", detail: "Amount" },
  {
    id: "pto",
    label: "Paid time off",
    detail: "Days a year and holidays, e.g. 25 days plus 11 holidays",
  },
  {
    id: "stipend",
    label: "Home office stipend",
    detail: "Amount, e.g. $1,500 to set up",
  },
  {
    id: "learning",
    label: "Training and certifications",
    detail: "Budget or programs, e.g. $5,000 a year",
  },
  { id: "relocation", label: "Relocation help", detail: "What it covers" },
  {
    id: "flexible",
    label: "Flexible hours",
    detail: "Core hours, if any, e.g. 10 to 3 Eastern",
  },
] as const satisfies readonly { id: string; label: string; detail: string }[];

export type BenefitId = (typeof BENEFITS)[number]["id"];

export const HIRE_ME_LABELS = {
  eyebrow: "Work with",
  steps: ["Kind of work", "The role", "Pay & benefits", "Skills", "About you"],
  benefitsLabel: "Benefits",
  benefitsHint: "Tick what comes with the role; add the details that matter.",
  benefitDetail: "Details",
  otherBenefits: "Other benefits",
  stepNumber: (step: number) => String(step).padStart(2, "0"),
  errors: {
    jobTitle: "Enter the job title.",
    name: "Enter your name.",
    email: "Enter an email address, like name@company.com.",
    payRange: "The top of the range is below the bottom.",
  },
  summary: (count: number) =>
    `Please fix ${count === 1 ? "this" : `these ${count} things`} before sending:`,
  characters: (used: number, max: number) => `${used} of ${max} characters`,
  open: "Hire me",
  title: "Hire James",
  intro: "Tell me about the role, and how well I fit it.",
  close: "Close",
  engagementLabel: "What kind of work",
  engagements: {
    "full-time": "Full-time role",
    contract: "Contract",
    consulting: "Off-hours consulting",
  } satisfies Record<Engagement, string>,
  engagementNotes: {
    "full-time": "A permanent position.",
    contract: "A fixed-term engagement.",
    // Only the time James actually offers, and no reason given.
    consulting:
      "Weekday evenings, outside my current employer's field; an occasional Sunday meeting by arrangement.",
  } satisfies Record<Engagement, string>,
  roleLabel: "The role",
  jobTitle: "Job title",
  company: "Company",
  workPlace: "Where",
  workPlaces: {
    remote: "Remote",
    hybrid: "Hybrid",
    "on-site": "On-site",
  } satisfies Record<WorkPlace, string>,
  location: "Location",
  locationHint: "City and time zone, if it matters.",
  start: "Start month",
  startHint: "Roughly when the work would begin.",
  description: "About the role",
  descriptionHint:
    "What the team builds, what you need from me, and why I would want it.",
  payLabel: "Pay range",
  payFrom: "From",
  payTo: "To",
  currency: "Currency",
  period: "Per",
  periods: { year: "year", hour: "hour" } satisfies Record<PayPeriod, string>,
  // The visible masks for pay: whole dollars a year, dollars and cents an hour.
  payTemplates: { year: "000,000", hour: "000.00" } satisfies Record<
    PayPeriod,
    string
  >,
  skillsLabel: "Skills the role needs",
  skillsHint:
    "Move each skill the role needs from James's skills into the needed list. Add any he doesn't list there too.",
  poolLabel: "James's skills",
  neededLabel: "Needed for the role",
  neededEmpty: "Nothing yet. Move skills here from James's skills.",
  moveIn: (skill: string) => `Add ${skill} to the needed skills`,
  moveOut: (skill: string) => `Remove ${skill} from the needed skills`,
  outsideTag: "Not in James's stack",
  filter: "Filter James's skills",
  noMatches: "No skills match that filter.",
  otherLabel: "Add a skill James doesn't list",
  otherHint: "Press Enter or Add after each one.",
  add: "Add",
  remove: (skill: string) => `Remove ${skill}`,
  fitLabel: "How well James fits",
  fitEmpty: "Choose the skills the role needs to see the fit.",
  fitSummary: (inStack: number, total: number) =>
    `${inStack} of ${total} skills in James's stack`,
  outside: (count: number) =>
    count === 0 ? "Nothing outside his stack" : `${count} outside his stack`,
  contactLabel: "You",
  name: "Your name",
  email: "Your email",
  phone: "Phone",
  phoneHint:
    "North American numbers fill the mask as you type, like (555) 123-4567. For another country, start with + and its code.",
  optional: "optional",
  required: "required",
  send: "Send",
  sending: "Sending…",
  sentTitle: "Sent",
  sentText: (email: string) =>
    `Thank you. Your offer reached James, and he will reply to ${email}.`,
  openedEmail:
    "Your email app should now be open with the offer. Press Send there to send it.",
  failed:
    "Your offer didn't send. Check your connection and try again, or email James at",
  trap: "Leave this empty",
};

export interface Offer {
  engagement: Engagement;
  jobTitle: string;
  company: string;
  workPlace: WorkPlace;
  location: string;
  start: string;
  description: string;
  payFrom: string;
  payTo: string;
  currency: string;
  period: PayPeriod;
  benefits: readonly string[]; // "Annual bonus (10%)", ready to read
  otherBenefits: string;
  chance?: number; // the chance James looks, as the sender saw it
  skills: readonly string[]; // names, in James's stack
  otherSkills: readonly string[]; // names, outside it
  name: string;
  email: string;
  phone: string;
}

// The offer as an email: a subject and a plain-text body, laid out to read at a glance.
export function offerEmail(offer: Offer): { subject: string; body: string } {
  const L = HIRE_ME_LABELS;
  const total = offer.skills.length + offer.otherSkills.length;
  // Plain numbers read with separators ("180,000"); anything else as typed.
  const amount = (value: string) => {
    const number = Number(value.replace(/[,\s]/g, ""));
    return value && Number.isFinite(number)
      ? number.toLocaleString("en-US")
      : value;
  };
  const pay =
    offer.payFrom || offer.payTo
      ? `${[offer.payFrom, offer.payTo].filter(Boolean).map(amount).join(" – ")} ${offer.currency} per ${offer.period}`
      : "Not given";
  const lines = [
    "Hi James,",
    "",
    `${L.engagementLabel.toUpperCase()}: ${L.engagements[offer.engagement]}`,
    `ROLE: ${offer.jobTitle}${offer.company ? ` at ${offer.company}` : ""}`,
    `WHERE: ${L.workPlaces[offer.workPlace]}${offer.location ? ` (${offer.location})` : ""}`,
    offer.start ? `START: ${offer.start}` : "",
    `PAY: ${pay}`,
    offer.benefits.length || offer.otherBenefits
      ? `BENEFITS: ${[...offer.benefits, offer.otherBenefits].filter(Boolean).join("; ")}`
      : "",
    "",
    offer.description
      ? `${L.description.toUpperCase()}\n${offer.description}\n`
      : "",
    `${L.skillsLabel.toUpperCase()} (${total})`,
    `In your stack (${offer.skills.length}): ${offer.skills.join(", ") || "none"}`,
    `Outside your stack (${offer.otherSkills.length}): ${offer.otherSkills.join(", ") || "none"}`,
    total > 0 ? `Fit: ${Math.round((offer.skills.length / total) * 100)}%` : "",
    offer.chance !== undefined
      ? `Chance you'll look (as shown to them): ${offer.chance}%`
      : "",
    "",
    "FROM",
    offer.name,
    offer.email,
    offer.phone,
  ].filter((line, index, all) => line !== "" || all[index - 1] !== "");
  return {
    subject: `${L.engagements[offer.engagement]}: ${offer.jobTitle}${offer.company ? ` at ${offer.company}` : ""}`,
    body: lines.join("\n").trim(),
  };
}

// The mailto: link for an offer, and whether it is long enough that some email apps
// may cut it.
export function offerMailto(offer: Offer): { href: string; long: boolean } {
  const { subject, body } = offerEmail(offer);
  const href = `mailto:${HIRE_ME_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, "\r\n"))}`;
  return { href, long: href.length > 1900 };
}

// What the form sends to the Sheet's script: the offer, plus how long the form was open
// and the bots' trap field (both checked by the script).
export function offerPayload(offer: Offer, elapsed: number, website: string) {
  return JSON.stringify({ ...offer, elapsed, website });
}

// ── How likely James is to look ─────────────────────────────────────────────────────

// James's own criteria. Pay below the floor loses its score quickly; compensation (pay
// plus benefits) and skill fit count equally; off-hours consulting must be remote.
// Other currencies are compared at rough fixed rates: this is a guide, not a quote.
export const LOOK_CRITERIA = {
  annualFloor: 175000, // USD a year, full-time and contract quoted by the year
  hourlyFloor: 125, // USD an hour, contract and consulting quoted by the hour
  hoursPerYear: 2080,
  remoteOnly: ["consulting"] as readonly Engagement[],
  usdPer: { USD: 1, CAD: 0.73, EUR: 1.08, GBP: 1.27, AUD: 0.66 } as Record<
    string,
    number
  >,
};

export const LOOK_LABELS = {
  title: "Chance James looks",
  verdicts: { high: "Likely", middle: "Possible", low: "Unlikely" },
  reasons: {
    payAbove: "Pay meets James's range",
    payNear: "Pay is just under James's range",
    payBelow: "Pay is below James's range",
    payMissing: "No pay given yet",
    benefits: (count: number) =>
      `${count} ${count === 1 ? "benefit adds" : "benefits add"} to the package`,
    fit: (mine: number, total: number) =>
      `${mine} of ${total} needed skills are James's`,
    fitMissing: "No skills chosen yet",
    remoteOnly: "Off-hours consulting is remote only",
  },
  waiting: "Add pay and skills to see it.",
  guide:
    "A guide from James's own criteria. Sending more than once won't change it.",
};

export interface LookChance {
  ready: boolean; // false until there is pay or skills to judge by
  percent: number; // rounded to 5
  verdict: keyof typeof LOOK_LABELS.verdicts;
  reasons: readonly string[];
}

// How likely James is to look at an offer, from his criteria: compensation (pay against
// his floor for that kind of work, plus a little per benefit) and skill fit, equally;
// then cut sharply when consulting is not remote.
export function lookChance(input: {
  engagement: Engagement;
  workPlace: WorkPlace;
  payFrom: string;
  payTo: string;
  currency: string;
  period: PayPeriod;
  benefitCount: number;
  skillsMine: number;
  skillsOther: number;
}): LookChance {
  const C = LOOK_CRITERIA;
  const R = LOOK_LABELS.reasons;
  const reasons: string[] = [];

  const amounts = [input.payFrom, input.payTo]
    .map((value) => Number(value.replace(/,/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0);
  let pay = 0.4; // unknown until given
  if (amounts.length === 0) {
    reasons.push(R.payMissing);
  } else {
    const middle = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const usd = middle * (C.usdPer[input.currency] ?? 1);
    const byHour = input.engagement !== "full-time";
    const floor = byHour ? C.hourlyFloor : C.annualFloor;
    const quoted =
      byHour === (input.period === "hour")
        ? usd
        : byHour
          ? usd / C.hoursPerYear
          : usd * C.hoursPerYear;
    const ratio = quoted / floor;
    pay = ratio >= 1 ? 1 : Math.max(0, (ratio - 0.8) / 0.2) ** 1.5;
    reasons.push(
      ratio >= 1 ? R.payAbove : ratio >= 0.9 ? R.payNear : R.payBelow,
    );
  }
  if (input.benefitCount > 0) reasons.push(R.benefits(input.benefitCount));
  const compensation = Math.min(1, pay + 0.03 * input.benefitCount);

  const total = input.skillsMine + input.skillsOther;
  let fit = 0.5; // unknown until chosen
  if (total === 0) reasons.push(R.fitMissing);
  else {
    fit = input.skillsMine / total;
    reasons.push(R.fit(input.skillsMine, total));
  }

  let chance = 0.5 * compensation + 0.5 * fit;
  if (C.remoteOnly.includes(input.engagement) && input.workPlace !== "remote") {
    chance *= 0.15;
    reasons.push(R.remoteOnly);
  }

  const percent = Math.round((chance * 100) / 5) * 5;
  return {
    ready: amounts.length > 0 || total > 0,
    percent,
    verdict: percent >= 70 ? "high" : percent >= 40 ? "middle" : "low",
    reasons,
  };
}
