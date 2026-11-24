// The Leadership & Results tab: a sunrise-to-summit story in seven parts. It sells
// leadership, trust and care, not management: no headcounts, reporting lines or project
// administration. Every fact and number is from James's own job history (LinkedIn);
// explanatory wording is a draft for James to adjust. Recommendations appear only once
// James has permission to quote them; until then the summit shows its invitation alone. English; kept out of components so
// translations can replace it per language.

export const LEADERSHIP_PARTS = {
  lead: { heading: "How I lead" },
  results: { heading: "Results that stuck" },
  trust: { heading: "Built on trust" },
  delivery: { heading: "Leading delivery" },
  hardCalls: { heading: "Hard calls" },
  service: { heading: "Service roots" },
  theirWords: { heading: "In their words" },
} as const;

// Where a fact comes from: the employer and years, shown under each proof.
export type Source = string;

export interface LeadFloor {
  id: string;
  short: string; // on the elevator's button
  title: string;
  body: string;
  proof: string;
  source: Source;
}

// 1. How I lead: Elevator leadership, in James's words: "I either rise or fall with the
// team. No ladders, the team is more important than any one individual. All have
// weaknesses and all have strengths and we lend our strengths to each other to be
// better." The team rides one elevator; each floor is part of that idea.
export const LEADERSHIP_LEAD = {
  tag: "Elevator leadership",
  motto: "We rise or fall together. No ladders.",
  floorsLabel: "Floors",
  floor: (position: number) => `Floor ${position}`,
  proofLabel: "In practice",
  floors: [
    {
      id: "together",
      short: "Rise together",
      title: "We rise or fall together",
      body: "There is no win for me that isn't the team's. When the team rises, I rise with it; when it falls, I fall with it.",
      proof:
        "Brought a 29-person cross-functional team together to rescue a failing $1.2M project, and beat the new deadline as one team.",
      source: "iHerb",
    },
    {
      id: "no-ladders",
      short: "No ladders",
      title: "No ladders",
      body: "Nobody climbs over anybody. Problems get fixed at their root cause, not pinned on a person.",
      proof:
        "Known as a leader, mentor and peacekeeper for separating cultural differences from personality conflicts and fixing the real cause of disputes.",
      source: "U.S. Air Force",
    },
    {
      id: "team-first",
      short: "Team first",
      title: "The team over any one person",
      body: "The team matters more than any individual in it, me included. Quality shouldn't depend on one hero.",
      proof:
        "Coached engineers on coding standards and best practices, so quality didn't hinge on a single reviewer.",
      source: "ABS Home Mortgage",
    },
    {
      id: "lend",
      short: "Lend strengths",
      title: "We lend our strengths",
      body: "Everyone has strengths and everyone has weaknesses. We lend our strengths to each other, and all of us get better.",
      proof:
        "Lent the team a strength in speaking both technical and business: stakeholders understood the work, and rework time was cut in half.",
      source: "U.S. Air Force",
    },
  ] satisfies readonly LeadFloor[],
} as const;

export interface Result {
  id: string;
  value: number; // counted up as the peak rises
  prefix?: string;
  suffix?: string;
  display: string; // the full figure, as read
  label: string;
  story: string;
  source: Source;
}

// 2. Results: a mountain range; each result is a peak, its height the climb.
export const LEADERSHIP_RESULTS = {
  tag: "Summits reached",
  intro: "Real numbers from real teams.",
  peaksLabel: "Results",
  results: [
    {
      id: "rescue",
      value: 1.2,
      prefix: "$",
      suffix: "M",
      display: "$1.2M",
      label: "failing project brought back on track",
      story:
        "Took over a failing warehouse expansion with no solid budget, led a 29-person cross-functional team and beat the new deadline.",
      source: "iHerb",
    },
    {
      id: "faster",
      value: 43,
      suffix: "%",
      display: "43%",
      label: "faster delivery",
      story:
        "Brought stakeholders in early with rapid prototypes, so products reached people sooner.",
      source: "U.S. Air Force",
    },
    {
      id: "accuracy",
      value: 7,
      suffix: "×",
      display: "7×",
      label: "more accurate fruit weighing",
      story:
        "Took sorting accuracy from ±14 grams to ±2 grams with adaptive signal filtering, which led to sales of the systems.",
      source: "Sunkist Growers",
    },
    {
      id: "cycle",
      value: 5,
      display: "22→5",
      prefix: "22→",
      label: "days median cycle time",
      story:
        "Introduced an auto-deploy fast lane to dev and AI-assisted engineering under written standards.",
      source: "CPT Group",
    },
    {
      id: "compliance",
      value: 30,
      prefix: "$",
      suffix: "K+",
      display: "$30K+",
      label: "saved, with compliance passed",
      story:
        "Led the payment card security project to a successful Report on Compliance, avoiding legal action and shrinking the scope open to inspection.",
      source: "iHerb",
    },
  ] satisfies readonly Result[],
} as const;

export interface TrustReason {
  id: string;
  short: string; // on its button
  title: string;
  body: string;
  proof: string;
  source: Source;
}

// 3. Built on trust: why people follow James. The team around him as a constellation;
// each reason sends trust rippling out through it.
export const LEADERSHIP_TRUST = {
  tag: "Why people follow",
  reasonsLabel: "Why people trust me",
  proofLabel: "In practice",
  you: "James",
  reasons: [
    {
      id: "care",
      short: "I care",
      title: "They never doubt I care",
      body: "People can tell when someone is in it for them. With me, nobody has to wonder.",
      proof:
        "Known as the leader, mentor and peacekeeper people came to, for fair answers that fixed the real cause.",
      source: "U.S. Air Force",
    },
    {
      id: "with-them",
      short: "In it with them",
      title: "I'm in it with them",
      body: "Failing projects, tight windows, hard nights: I'm in the work with the team, not watching from above.",
      proof:
        "Rewired a packing house's control system with a twelve-hour window, finished in four, and had it running flawlessly.",
      source: "Sunkist Growers",
    },
    {
      id: "straight",
      short: "Straight talk",
      title: "Straight talk, no faking",
      body: "I say what's true, in words engineers and business people both understand. If I haven't done it, I don't claim it.",
      proof:
        "Wrote statements of work non-technical people could fully understand; the project finished early.",
      source: "U.S. Air Force",
    },
    {
      id: "grow",
      short: "I grow people",
      title: "I make people better",
      body: "Coaching, standards and honest feedback, so everyone leaves stronger than they came.",
      proof:
        "Mentored engineers on coding standards and best practices, so quality didn't hinge on any one person.",
      source: "ABS Home Mortgage",
    },
  ] satisfies readonly TrustReason[],
} as const;

export interface DeliveryStep {
  id: string;
  short: string;
  title: string;
  body: string;
  proof: string;
  source: Source;
}

// 4. Leading delivery: a flywheel; every turn builds momentum.
export const LEADERSHIP_DELIVERY = {
  tag: "Momentum",
  hubValue: "We",
  hubLabel: "ship together",
  stepsLabel: "Delivery flywheel",
  steps: [
    {
      id: "involve",
      short: "Involve",
      title: "Involve people early",
      body: "Stakeholders see the work from the first week, not the last.",
      proof: "Delivery time cut by 43%.",
      source: "U.S. Air Force",
    },
    {
      id: "prototype",
      short: "Prototype",
      title: "Prototype before committing",
      body: "Rapid prototypes answer the hard questions while answers are still cheap.",
      proof: "Products built to plan, without major defects.",
      source: "U.S. Air Force",
    },
    {
      id: "unblock",
      short: "Unblock",
      title: "Clear the road",
      body: "Budgets, scope and partners sorted out so the team can do the work.",
      proof: "A failing $1.2M project back on track.",
      source: "iHerb",
    },
    {
      id: "ship",
      short: "Ship",
      title: "Ship small and often",
      body: "Automated paths to production keep changes small and feedback fast.",
      proof: "Median cycle time from 22 days to 5.",
      source: "CPT Group",
    },
    {
      id: "improve",
      short: "Raise the bar",
      title: "Raise the bar together",
      body: "Standards the team writes down and owns, so every release is a little better than the last.",
      proof:
        "Written engineering standards and architecture the team builds by.",
      source: "CPT Group",
    },
  ] satisfies readonly DeliveryStep[],
} as const;

export interface HardCall {
  id: string;
  short: string; // on the trail marker
  title: string;
  situation: string;
  decision: string;
  result: string;
  source: Source;
}

// 5. Hard calls: storms on the trail, and the way through each.
export const LEADERSHIP_HARD_CALLS = {
  tag: "Through the storm",
  storiesLabel: "Stories",
  steps: {
    situation: "The storm",
    decision: "The call",
    result: "The summit",
  },
  stories: [
    {
      id: "rescue",
      short: "The rescue",
      title: "A failing $1.2M project",
      situation:
        "A warehouse expansion's IT project was failing, with no solid budget and a 29-person cross-functional team to direct.",
      decision:
        "Stepped in and gave the whole team one clear direction: a plan everyone could trust, a defined scope and real working relationships with every partner.",
      result:
        "Back on track and ahead of the new deadline, with disparate network traffic brought together.",
      source: "iHerb",
    },
    {
      id: "compliance",
      short: "The audit",
      title: "Compliance, with legal risk on the line",
      situation:
        "The company had to prove payment card security, and legal action was possible if it couldn't.",
      decision:
        "Pulled the right people together, set a clear course and cut down the scope open to inspection.",
      result:
        "A successful Report on Compliance, legal action avoided and $30K+ saved.",
      source: "iHerb",
    },
    {
      id: "cutover",
      short: "The cutover",
      title: "Twelve hours to restore a packing house",
      situation:
        "A packing house ran at half capacity on an aging control system, with a twelve-hour window to replace it.",
      decision:
        "Upgraded to a modern controller and rewired the whole system within the window.",
      result:
        "Done in four of the twelve hours, worked flawlessly on the first test and brought the house back to full capacity.",
      source: "Sunkist Growers",
    },
  ] satisfies readonly HardCall[],
} as const;

export interface CoreValue {
  id: string;
  title: string; // the Air Force core value
  body: string; // how James lives it now
}

// 6. Service roots: the Air Force symbol, with its three core values as a compass.
export const LEADERSHIP_SERVICE = {
  tag: "Where it started",
  emblemLabel: "U.S. Air Force",
  valuesLabel: "Air Force core values",
  facts: [
    { value: "13", label: "years of service" },
    { value: "6", label: "bases, including Korea" },
    { value: "647K", label: "lines of simulator code" },
  ],
  roles: "Mechanic · Help desk · Software engineer · IT project manager",
  values: [
    {
      id: "integrity",
      title: "Integrity first",
      body: "No faking it. If I haven't done something, I learn it and do it before I claim it.",
    },
    {
      id: "service",
      title: "Service before self",
      body: "The team's win comes first: fix the real cause, keep the peace and make the people around me look good.",
    },
    {
      id: "excellence",
      title: "Excellence in all we do",
      body: "Software for live satellite training simulators, written so defects no longer stopped training.",
    },
  ] satisfies readonly CoreValue[],
} as const;

export interface Recommendation {
  id: string;
  quote: string;
  name: string;
  role: string;
}

// 7. In their words: beacons along the summit ridge, then the way to contact.
export const LEADERSHIP_THEIR_WORDS = {
  tag: "Summit",
  beaconsLabel: "Recommendations",
  // None yet: add each as { id, quote, name, role }, with the person's permission.
  quotes: [] as readonly Recommendation[],
  // The heading while there are no recommendations to show.
  headingAlone: "The next climb",
  ctaTitle: "The next summit is better climbed together.",
  ctaLine: "Leading a team that needs to rise? Let's talk.",
  cta: "Start a conversation",
} as const;
