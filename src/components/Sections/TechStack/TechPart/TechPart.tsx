import {
  JOBS,
  PROFESSIONAL_JOURNEY_LABELS,
} from "../../../../content/professionalJourney";
import {
  TECH_STACK_LABELS,
  usageOf,
  summaryOf,
  type StackItem,
} from "../../../../content/techStack";
import StoryPart from "../../Story/StoryPart/StoryPart";
import JobPartBackdrop from "../../ProfessionalJourney/JobPart/JobPartBackdrop/JobPartBackdrop";
import TechRail from "../TechRail/TechRail";
import styles from "./TechPart.module.scss";

interface TechPartProps {
  index: number; // place in the story
  item: StackItem;
  items: readonly StackItem[]; // the sub-section, in story order, for the rail
}

// One technology or tool on the Tech Stack: the same template and movement as a job.
// The rail across the top; the item's card (what it is) beside where it was used: how
// many roles used it, when last, and those roles. An item no role on the site names
// (James's tools) shows its card alone.
// Enters: the backdrop opens from the top, the rail draws in, the card docks down from
// the rail and the experience rises into place.
// Leaves: the whole item carousels away to the reading start, the next coming in.
function TechPart({ index, item, items }: TechPartProps) {
  const {
    tag,
    categories,
    kinds,
    position,
    rolesLabel,
    roles: rolesCount,
    lastUsedLabel,
    present,
    whereLabel,
  } = TECH_STACK_LABELS;
  const experience = usageOf(item);
  const summary = summaryOf(item) ?? item.about;
  const roles = JOBS.filter((job) => item.jobs.includes(job.id));
  const current = PROFESSIONAL_JOURNEY_LABELS.current;

  return (
    <StoryPart index={index} name={`tech-${item.id}`} className={styles.part}>
      <div className={styles.themed}>
        <JobPartBackdrop
          motif={item.kind === "tools" ? "lines" : "dots"}
          monogram={item.monogram}
        />
        <div
          className={styles.layout}
          data-single={experience ? undefined : ""}
        >
          <div className={styles.railSlot}>
            <p className={styles.tag}>{tag}</p>
            <TechRail
              items={items}
              currentId={item.id}
              label={kinds[item.kind]}
              position={position(index + 1, items.length)}
            />
          </div>
          <div className={styles.cardSlot}>
            <div className={styles.card}>
              <div className={styles.identity}>
                <span className={styles.emblem} aria-hidden="true">
                  {item.monogram}
                </span>
                <div className={styles.names}>
                  <p className={styles.category}>{categories[item.category]}</p>
                  <h3 className={styles.title}>{item.name}</h3>
                </div>
              </div>
              {summary && <p className={styles.summary}>{summary}</p>}
            </div>
          </div>
          {experience && (
            <section className={styles.experienceSlot} aria-label={whereLabel}>
              <div className={styles.metrics}>
                <p className={styles.metric}>
                  <span className={styles.metricValue}>
                    {rolesCount(experience.roles)}
                  </span>
                  <span className={styles.metricLabel}>{rolesLabel}</span>
                </p>
                <p className={styles.metric}>
                  <span className={styles.metricValue}>
                    {experience.lastUsed
                      ? experience.lastUsed.split(" ")[1]
                      : present}
                  </span>
                  <span className={styles.metricLabel}>{lastUsedLabel}</span>
                </p>
              </div>
              <ul className={styles.roles}>
                {roles.map((job) => (
                  <li key={job.id} className={styles.role}>
                    <span className={styles.company}>{job.company}</span>
                    <span className={styles.roleDetail}>
                      {job.role} · {job.start} – {job.end ?? current}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </StoryPart>
  );
}

export default TechPart;
