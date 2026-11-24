import type { CSSProperties } from "react";
import {
  ARCHITECTURE_NEXT_STEP,
  ARCHITECTURE_PARTS,
} from "../../../../content/architectureExpertise";
import { SECTIONS } from "../../../../content/sections";
import { followSectionLink } from "../../../../state/navigation";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import styles from "./ArchitectureNextStep.module.scss";

const sectionIndex = (id: string) =>
  SECTIONS.findIndex((section) => section.id === id);
const PROJECTS = sectionIndex("featured-projects");
const OTHERS = [sectionIndex("leadership-results"), sectionIndex("contact")];

// Where to next: the tab's route, lit end to end through everything the visitor has
// seen, runs on into a connector to Featured Projects. Leadership & Results and Contact
// are one step aside.
//
// Enters: the blueprint opens as a circle from the connector, the title slides in from
// the reading start, the stops on the route are placed one by one, the trace runs along
// them and on to the connector, which powers on; the other links rise from below.
// Leaves (only if anything ever follows): the same, in reverse.
function ArchitectureNextStep({ index }: StoryPartProps) {
  const { heading } = ARCHITECTURE_PARTS.nextStep;
  const { tag, line, linksLabel, primary, others, seenLabel, seen } =
    ARCHITECTURE_NEXT_STEP;

  return (
    <StoryPart index={index} name="next-step" className={styles.part}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.line}>{line}</p>
        </header>
        <div className={styles.route}>
          <p className={styles.seenLabel}>{seenLabel}</p>
          <ol className={styles.stops}>
            {seen.map((stop, position) => (
              <li
                key={stop}
                className={styles.stop}
                style={{ "--order": position } as CSSProperties}
              >
                <span className={styles.pad} aria-hidden="true" />
                {stop}
              </li>
            ))}
          </ol>
          <span className={styles.trace} aria-hidden="true" />
        </div>
        <nav className={styles.links} aria-label={linksLabel}>
          <a
            className={styles.primary}
            href={`#${SECTIONS[PROJECTS].id}`}
            onClick={(event) => followSectionLink(event, PROJECTS)}
          >
            <span>{primary}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <p className={styles.others}>
            <span className={styles.othersLabel}>{others}</span>
            {OTHERS.map((position) => (
              <a
                key={SECTIONS[position].id}
                className={styles.secondary}
                href={`#${SECTIONS[position].id}`}
                onClick={(event) => followSectionLink(event, position)}
              >
                {SECTIONS[position].label}
              </a>
            ))}
          </p>
        </nav>
      </div>
    </StoryPart>
  );
}

export default ArchitectureNextStep;
