// The site's seven sections, in story order (left to right). English labels; kept out of
// components so translations can replace them per language.
export type SectionIconName =
  "home" | "journey" | "layers" | "chip" | "cube" | "people" | "mail";

export interface Section {
  id: string; // also the element id the tab links to (#id)
  label: string;
  icon: SectionIconName;
}

export const SECTIONS: readonly Section[] = [
  { id: "introduction", label: "Introduction", icon: "home" },
  {
    id: "professional-journey",
    label: "Professional Journey",
    icon: "journey",
  },
  {
    id: "architecture-expertise",
    label: "Architecture Expertise",
    icon: "layers",
  },
  { id: "tech-stack", label: "Tech Stack", icon: "chip" },
  { id: "featured-projects", label: "Featured Projects", icon: "cube" },
  { id: "leadership-results", label: "Leadership & Results", icon: "people" },
  { id: "contact", label: "Contact", icon: "mail" },
];

export const SECTION_LABELS = {
  // Names the one navigation landmark (the tabs, or the phone menu's section list).
  nav: "Sections",
  // Read by screen readers after the current section's name on phones.
  locationOf: (position: number, total: number) =>
    `section ${position} of ${total}`,
  // Shown in each section until its real content is built.
  placeholder: "This section is being built.",
};
