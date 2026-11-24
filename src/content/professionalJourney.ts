// The Professional Journey tab: one standard part per job, most recent first. Taken from
// James's LinkedIn experience; metrics are James's own, other badges are short labels. English;
// kept out of components so translations can replace it per language.
//
// Each job brings only its content and its theme; the layout and movement are the same
// for every job (JobPart).

export type JobMotif = "dots" | "lines" | "hex";

export interface JobTheme {
  // Accent for text, borders and glows. Each shade must reach 7:1 (AAA) against the
  // page background of its theme.
  accentDark: string; // on the dark background (#0a1530)
  accentLight: string; // on the light background (#f4f8ff)
  motif: JobMotif; // the background pattern
}

export interface JobHighlight {
  id: string;
  title: string;
  metric: string; // the headline number or result, e.g. "40%"
  metricLabel: string; // what the metric means, e.g. "faster releases"
  challenge: string;
  approach: string;
  impact: string;
}

export interface Job {
  id: string;
  company: string;
  shortName: string; // on the career rail
  monogram: string; // initials for the emblem and watermark
  // Optional company logo (a file under public/), used in place of the monogram. Only
  // where James is comfortable the company allows it; the monogram is the default.
  logo?: string;
  emblem?: "usaf"; // a drawn emblem instead of the monogram (the Air Force symbol)
  role: string;
  start: string;
  end: string | null; // null while current
  summary: string;
  highlights: readonly JobHighlight[];
  tech: readonly string[];
  theme: JobTheme;
}

export const PROFESSIONAL_JOURNEY_LABELS = {
  chainsLabel: "Journey",
  chains: {
    career: "Career",
    credentials: "Education & credentials",
  },
  // Phones: the same, shorter.
  chainsShort: {
    career: "Career",
    credentials: "Education",
  },
  tag: "Professional journey",
  railLabel: "Career timeline",
  current: "Present",
  highlightsLabel: "Highlights",
  techLabel: "Technologies",
  caseLabels: {
    challenge: "Challenge",
    approach: "Approach",
    impact: "Impact",
  },
};

export const JOBS: readonly Job[] = [
  {
    // From James's LinkedIn description of this role. Public-safe: no internal system
    // names, customer data or unreleased work. The theme colors are placeholders until
    // James picks them.
    id: "cpt-group",
    company: "CPT Group",
    shortName: "CPT",
    monogram: "CPT",
    role: "Data and Applications Supervisor",
    start: "May 2024",
    end: null,
    summary:
      "Leading the modernization of CPT Group's class action administration systems, from MS Access and SQL Server desktop tools to a cloud-native Azure platform. Founding architect of the platform, supervising a team of up to 4 engineers and analysts.",
    highlights: [
      {
        id: "api-platform",
        title: "Founded a cloud API platform",
        metric: "27",
        metricLabel: "Function Apps",
        challenge:
          "Class action administration ran on MS Access and SQL Server desktop tools.",
        approach:
          "Architected a .NET Azure Functions platform on 6 shared private NuGet libraries (security, data access, service, domain, validation), each app with its own automated tests.",
        impact:
          "340+ HTTP endpoints across 27 apps; all apps and libraries moved from .NET 8 to .NET 10 in two days.",
      },
      {
        id: "internal-tools",
        title: "One web app for internal tools",
        metric: "39",
        metricLabel: "tools hosted",
        challenge:
          "Day-to-day work depended on scattered legacy desktop tools and an MS Access data-intake process.",
        approach:
          "Started and co-built a React 19, TypeScript and Vite app on Azure Static Web Apps, backed by PostgreSQL across 5 databases and 475 EF Core migrations.",
        impact:
          "39 tools in one place, including a replacement for the legacy data-intake process.",
      },
      {
        id: "delivery",
        title: "Faster delivery with AI-assisted engineering",
        metric: "22→5",
        metricLabel: "days median cycle time",
        challenge: "Work took weeks to get from ticket to running in dev.",
        approach:
          "Introduced an auto-merge, auto-deploy fast lane to dev and AI-assisted development under written engineering standards and architecture documentation.",
        impact: "Median cycle time fell 77%, from 22 to 5 days.",
      },
    ],
    tech: [
      ".NET 10",
      "C#",
      "Azure Functions",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Terraform",
      "Go",
    ],
    theme: {
      accentDark: "#5eead4", // teal-300: 12.2:1 on #0a1530
      accentLight: "#115e59", // teal-800: 7.1:1 on #f4f8ff
      motif: "hex",
    },
  },
  {
    id: "costar",
    company: "CoStar Group",
    shortName: "CoStar",
    monogram: "CS",
    role: "Senior Software Engineer",
    start: "Aug 2021",
    end: "Dec 2023",
    summary:
      "Built broker-facing sales and marketing systems across React, C# and AWS, and explored HoloLens tours and Unreal Engine 5 photogrammetry for immersive property experiences.",
    highlights: [
      {
        id: "sales-decks",
        title: "Data-driven sales deck system",
        metric: "Led",
        metricLabel: "development",
        challenge:
          "Brokers needed tailored sales material to make the most of upselling.",
        approach:
          "Led development of a system that builds MS PowerPoint sales decks from data.",
        impact: "More upselling opportunities for brokers.",
      },
      {
        id: "campaign-video",
        title: "Automated campaign videos",
        metric: "AWS",
        metricLabel: "Step Functions",
        challenge:
          "Campaigns needed personalized video without hand production.",
        approach:
          "Developed an automated campaign video system with Idomoo and AWS Step Functions, Lambdas and Lambda APIs.",
        impact: "Campaign videos produced through an automated pipeline.",
      },
      {
        id: "auction-game",
        title: "Broker auction game",
        metric: "React",
        metricLabel: "game site",
        challenge: "Broker programs needed a way to drive engagement.",
        approach:
          "Designed and implemented a React-based auction game site, alongside a React and Redux campaign management system.",
        impact: "Significant broker engagement and payouts.",
      },
    ],
    tech: ["React", "Redux", "JavaScript", "C#", "AWS", "GCP", "Datadog"],
    theme: {
      accentDark: "#93c5fd", // blue-300: 10.0:1
      accentLight: "#1e3a8a", // blue-900: 9.7:1
      motif: "lines",
    },
  },
  {
    id: "abs-home-mortgage",
    company: "ABS Home Mortgage",
    shortName: "ABS",
    monogram: "ABS",
    role: "Senior Software Engineer",
    start: "Dec 2020",
    end: "Aug 2021",
    summary:
      "Modernized a VB.NET lending website, built credit risk tooling and mentored the team on coding standards and best practices.",
    highlights: [
      {
        id: "secure-site",
        title: "Secured and modernized the lending site",
        metric: "VB.NET",
        metricLabel: "site modernized",
        challenge:
          "A VB.NET website with tangled JavaScript and security flaws.",
        approach:
          "Modularized the JavaScript, fixed the security flaws and integrated a Java REST API.",
        impact: "A safer, more maintainable site, connected to the REST API.",
      },
      {
        id: "risk-assessment",
        title: "Credit risk assessment",
        metric: "Risk",
        metricLabel: "assessment system",
        challenge: "Lenders needed a clearer view of creditworthiness.",
        approach:
          "Designed a comprehensive risk assessment system for creditworthiness.",
        impact: "Better lender decision-making.",
      },
      {
        id: "stack-overflow",
        title: "Fixed a crash at its root",
        metric: "Fixed",
        metricLabel: "stack overflows",
        challenge: "A complex switch-case structure caused stack overflows.",
        approach: "Re-engineered it into a dictionary-based system.",
        impact: "The stack overflow issues were resolved.",
      },
    ],
    tech: ["VB.NET", "JavaScript", "jQuery", "Aspose", "REST APIs"],
    theme: {
      accentDark: "#86efac", // green-300: 12.9:1
      accentLight: "#14532d", // green-900: 8.6:1
      motif: "dots",
    },
  },
  {
    id: "ari",
    company: "ARI Network Services",
    shortName: "ARI",
    monogram: "ARI",
    role: "Software Engineer III",
    start: "May 2015",
    end: "Dec 2020",
    summary:
      "Built a highly interactive, full-stack product for managing parts and model data, from OCR of parts diagrams to customer data import, on a gateway-managed, multi-instance web platform.",
    highlights: [
      {
        id: "ocr",
        title: "Invented parts-diagram OCR",
        metric: "OCR",
        metricLabel: "invented",
        challenge:
          "Parts diagrams in the web product needed to be read automatically.",
        approach:
          "Invented a full parts-diagram OCR process, integrated through a WCF service with an AngularJS interface.",
        impact:
          "OCR built into the product, with a simple, natural way to use it.",
      },
      {
        id: "any-format",
        title: "Import any customer format",
        metric: "Any",
        metricLabel: "data format",
        challenge: "Customers supplied their data in many different formats.",
        approach: "Designed a customer import process that accepts any format.",
        impact: "The product accepts whatever data the customer provides.",
      },
      {
        id: "catalog-hash",
        title: "Detect altered catalogs",
        metric: "Hash",
        metricLabel: "change detection",
        challenge: "Changed catalogs had to be told apart from unchanged ones.",
        approach:
          "Built a hash-based system, plus a XAML desktop app for browsing and printing catalogs from any database.",
        impact: "Altered catalogs can be identified reliably.",
      },
    ],
    tech: ["C#", "AngularJS", "PostgreSQL", "MS SQL", "WCF", "XAML"],
    theme: {
      accentDark: "#fdba74", // orange-300: 10.7:1
      accentLight: "#7c2d12", // orange-900: 8.8:1
      motif: "hex",
    },
  },
  {
    id: "mclaughlin",
    company: "McLaughlin Research Corporation",
    shortName: "McLaughlin",
    monogram: "MRC",
    role: "Senior .NET Developer",
    start: "Oct 2014",
    end: "Apr 2015",
    summary:
      "Built a bill-processing information system with AngularJS, Nancy and Dapper, fully covered by automated tests.",
    highlights: [
      {
        id: "kofax",
        title: "Bills straight from image processing",
        metric: "Kofax",
        metricLabel: "integration",
        challenge: "Bills arrived through an image-processing system.",
        approach:
          "Connected the information system to a Kofax image-processing system.",
        impact: "Bills consumed directly into the system to be managed.",
      },
      {
        id: "coverage",
        title: "Fully tested code",
        metric: "Full",
        metricLabel: "test coverage",
        challenge: "Every condition in the code needed to be proven.",
        approach: "NUnit with FakeItEasy mocks, measured with NCover.",
        impact: "Full coverage of the code and its testable conditions.",
      },
      {
        id: "migrations",
        title: "Reversible database changes",
        metric: "Roll",
        metricLabel: "forward and back",
        challenge: "Database changes had to be tracked and undoable.",
        approach: "Tracked every change with Fluent Migrator.",
        impact: "Database changes roll forward and back easily.",
      },
    ],
    tech: ["C#", "AngularJS", "Nancy", "Dapper", "MS SQL", "NUnit"],
    theme: {
      accentDark: "#cbd5e1", // slate-300: 12.2:1
      accentLight: "#334155", // slate-700: 9.7:1
      motif: "lines",
    },
  },
  {
    id: "sunkist",
    company: "Sunkist Growers",
    shortName: "Sunkist",
    monogram: "SG",
    role: "Senior .NET Software Engineer and Architect",
    start: "Feb 2014",
    end: "Oct 2014",
    summary:
      "Architected fruit-packing software and hardware control, from a WPF application down to C and C++ device code.",
    highlights: [
      {
        id: "weighing",
        title: "Fruit weighing accuracy",
        metric: "±2 g",
        metricLabel: "from ±14 g",
        challenge: "The sorting line weighed fruit only to ±14 grams.",
        approach:
          "Built weight detection from the mechanics to the C sorting code, with A/D conversion, Bessel and self-adaptive filters.",
        impact:
          "Accuracy improved to ±2 grams, which led to sales of the systems.",
      },
      {
        id: "control-upgrade",
        title: "Control system upgrade",
        metric: "4 of 12",
        metricLabel: "hours used",
        challenge:
          "A packing house ran at 50% capacity on an old control system.",
        approach: "Upgraded it to OPTO 22 and rewired the system.",
        impact:
          "Done in 4 of the 12 hours allowed; the house went back to full capacity.",
      },
      {
        id: "prism",
        title: "Modular desktop and device code",
        metric: "PRISM",
        metricLabel: "MVVM rebuild",
        challenge: "The WPF application's MVVM was implemented incorrectly.",
        approach:
          "Rebuilt it on PRISM 5 with MEF modules, and decoupled the C and C++ device code behind interfaces and WCF.",
        impact: "Quicker feature delivery and easier defect isolation.",
      },
    ],
    tech: ["C#", "WPF", "PRISM", "C", "C++", "WCF", "InstallAware"],
    theme: {
      accentDark: "#fcd34d", // amber-300: 12.5:1
      accentLight: "#78350f", // amber-900: 8.5:1
      motif: "dots",
    },
  },
  {
    id: "iherb",
    company: "iHerb",
    shortName: "iHerb",
    monogram: "iH",
    role: "Senior Software / IT Project Manager",
    start: "Mar 2012",
    end: "Dec 2013",
    summary:
      "Led software and IT programs, managing 54 people through the reporting structure and completing 61 projects.",
    highlights: [
      {
        id: "pci",
        title: "PCI DSS compliance",
        metric: "$30K+",
        metricLabel: "saved",
        challenge: "The company needed a passing PCI DSS Report on Compliance.",
        approach:
          "Planned and led the project and assembled the team, reducing the scope open to inspection.",
        impact: "A successful report, legal action prevented and $30K+ saved.",
      },
      {
        id: "warehouse",
        title: "Rescued a warehouse expansion",
        metric: "$1.2M",
        metricLabel: "back on track",
        challenge:
          "A failing warehouse expansion IT project with no solid budget.",
        approach:
          "Directed a 29-member cross-functional team with a new budget, resource plan and defined scope.",
        impact: "Back on track, beating the new deadline.",
      },
      {
        id: "mobile",
        title: "Award-winning mobile site",
        metric: "2013",
        metricLabel: "mobile award",
        challenge: "The company needed to reach shoppers on mobile.",
        approach:
          "Planned the mobile website and assembled the team, alongside iPhone, iPad, Android and Windows 8 apps.",
        impact:
          "The company was recognized with a best international mobile website award.",
      },
    ],
    tech: ["Program management", "Agile", "PCI DSS", "iOS", "Android"],
    theme: {
      accentDark: "#bef264", // lime-300: 13.8:1
      accentLight: "#365314", // lime-900: 8.2:1
      motif: "hex",
    },
  },
  {
    id: "usaf",
    company: "U.S. Air Force",
    shortName: "USAF",
    monogram: "USAF",
    emblem: "usaf",
    role: "IT Project Manager, Help Desk, Software Engineer, Mechanic",
    start: "Jan 1999",
    end: "Dec 2011",
    summary:
      "Thirteen years of service as a mechanic, on the help desk, as a software engineer and as an IT project manager.",
    highlights: [
      {
        id: "simulators",
        title: "Satellite training simulators",
        metric: "647K",
        metricLabel: "lines of Pascal",
        challenge: "Two live satellite simulators trained new space operators.",
        approach:
          "Developed and programmed 647,000 lines of Pascal and added hardware and software functionality.",
        impact: "Training downtime from system defects eliminated.",
      },
      {
        id: "prototypes",
        title: "Faster delivery with prototypes",
        metric: "43%",
        metricLabel: "faster delivery",
        challenge: "Products took too long to reach the people using them.",
        approach:
          "Involved stakeholders early with prototypes and rapid application development.",
        impact: "Time to deliver products cut by 43%.",
      },
      {
        id: "translation",
        title: "Technical to business translation",
        metric: "50%",
        metricLabel: "less rework",
        challenge:
          "Stakeholders struggled to follow the state of technical projects.",
        approach:
          "Became the go-to person translating between technical and business language.",
        impact: "Rework time cut in half.",
      },
    ],
    tech: ["C", "C++", "C#", "Pascal", "VB", "SQL", "Java"],
    theme: {
      accentDark: "#a5b4fc", // indigo-300: 9.1:1
      accentLight: "#312e81", // indigo-900: 10.7:1
      motif: "dots",
    },
  },
];

// ── Education and credentials ─────────────────────────────────────────────────────

export type CredentialLevel =
  "master" | "bachelor" | "associate" | "certification";

export type CredentialSort = "importance" | "newest" | "oldest" | "type";

export interface Credential {
  id: string;
  short: string; // on the credentials rail
  monogram: string; // the backdrop's watermark
  title: string;
  detail?: string; // a concentration or honors
  issuer: string;
  level: CredentialLevel;
  // Year and month awarded ("2014-03"), or null where James has not confirmed it yet:
  // shown without a date and sorted as the earliest.
  awarded: string | null;
  importance: number; // 1 = most important; the default order
  certificate: string; // the certificate's scan, under public/
  certificateNote?: string; // what was hidden on the scan
}

export const CREDENTIALS_LABELS = {
  tag: "Professional journey",
  railLabel: "Credentials",
  sortLabel: "Sort",
  sorts: {
    importance: "Most important",
    newest: "Newest",
    oldest: "Oldest",
    type: "Type",
  } satisfies Record<CredentialSort, string>,
  sortedBy: (sort: string) => `Credentials, sorted by ${sort.toLowerCase()}`,
  view: "View the certificate full size",
  certificateOf: (title: string) => `Certificate: ${title}`,
  close: "Close",
  levels: {
    master: "Master's degree",
    bachelor: "Bachelor's degree",
    associate: "Associate degree",
    certification: "Certification",
  } satisfies Record<CredentialLevel, string>,
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

// From James's certificates (also on LinkedIn). The default order (importance) is for
// senior architect and technical lead roles; James can change it.
export const CREDENTIALS: readonly Credential[] = [
  {
    id: "ms-computer-science",
    short: "MS CS",
    monogram: "MS",
    title: "Master of Science in Computer Science",
    detail: "Concentration in Software Engineering",
    issuer: "Colorado Technical University",
    level: "master",
    awarded: "2014-03",
    importance: 1,
    certificate: "credentials/ms-computer-science.webp",
  },
  {
    id: "master-project-management",
    short: "MPM",
    monogram: "MPM",
    title: "Master of Project Management",
    issuer: "Keller Graduate School of Management, DeVry University",
    level: "master",
    awarded: "2011-10",
    importance: 2,
    certificate: "credentials/master-project-management.webp",
  },
  {
    id: "bs-game-simulation",
    short: "BS",
    monogram: "BS",
    title: "Bachelor of Science in Game and Simulation Programming",
    detail: "Cum laude",
    issuer: "DeVry University",
    level: "bachelor",
    awarded: "2010-06",
    importance: 3,
    certificate: "credentials/bs-game-simulation.webp",
  },
  {
    id: "comptia-project-plus",
    short: "Project+",
    monogram: "P+",
    title: "CompTIA Project+",
    issuer: "CompTIA",
    level: "certification",
    awarded: "2013-07",
    importance: 4,
    certificate: "credentials/comptia-project-plus.webp",
    certificateNote: "Career ID and verification code hidden.",
  },
  {
    id: "aas-computer-science-technology",
    short: "AAS",
    monogram: "AAS",
    title: "Associate in Applied Science, Computer Science Technology",
    issuer: "Community College of the Air Force",
    level: "associate",
    awarded: "2006-10",
    importance: 5,
    certificate: "credentials/aas-computer-science-technology.webp",
  },
];
