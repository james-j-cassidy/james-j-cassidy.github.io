import { useState, type CSSProperties } from "react";
import {
  PROFESSIONAL_JOURNEY_LABELS,
  type Job,
} from "../../../../content/professionalJourney";
import StoryPart from "../../Story/StoryPart/StoryPart";
import JobPartBackdrop from "./JobPartBackdrop/JobPartBackdrop";
import JobPartCompany from "./JobPartCompany/JobPartCompany";
import JobPartHighlight from "./JobPartHighlight/JobPartHighlight";
import JobPartTimeline from "./JobPartTimeline/JobPartTimeline";
import styles from "./JobPart.module.scss";

interface JobPartProps {
  index: number; // place in the story
  job: Job;
  jobs: readonly Job[]; // the whole career, most recent first, for the rail
}

// One job on the Professional Journey: the same template for every job, themed by the
// job's company (accent, pattern, monogram watermark) through --job-accent.
//
// Layout: the career rail across the top, the company card beside the highlights.
// Enters: the backdrop opens from the top, the rail draws in, the card docks down from
// its stop on the rail and the highlights are dealt in one by one.
// Leaves: the whole job carousels away to the reading start, the next one coming in.
//
// Each highlight opens a short case study; one at a time.
function JobPart({ index, job, jobs }: JobPartProps) {
  const { tag, railLabel, current, highlightsLabel, techLabel, caseLabels } =
    PROFESSIONAL_JOURNEY_LABELS;
  const [open, setOpen] = useState<string | null>(null);

  const theme = {
    "--job-accent-dark": job.theme.accentDark,
    "--job-accent-light": job.theme.accentLight,
  } as CSSProperties;

  return (
    <StoryPart index={index} name={`job-${job.id}`} className={styles.part}>
      <div className={styles.themed} style={theme}>
        <JobPartBackdrop motif={job.theme.motif} monogram={job.monogram} />
        <div className={styles.layout}>
          <div className={styles.railSlot}>
            <p className={styles.tag}>{tag}</p>
            <JobPartTimeline
              stops={jobs.map((stop) => ({
                id: stop.id,
                short: stop.shortName,
                full: stop.company,
                when: `${stop.start} – ${stop.end ?? current}`,
              }))}
              currentId={job.id}
              label={railLabel}
            />
          </div>
          <div className={styles.cardSlot}>
            <JobPartCompany
              job={job}
              presentLabel={current}
              techLabel={techLabel}
            />
          </div>
          <section className={styles.highlights} aria-label={highlightsLabel}>
            <ul>
              {job.highlights.map((highlight, position) => (
                <JobPartHighlight
                  key={highlight.id}
                  highlight={highlight}
                  order={position}
                  open={open === highlight.id}
                  caseLabels={caseLabels}
                  onToggle={() =>
                    setOpen((now) =>
                      now === highlight.id ? null : highlight.id,
                    )
                  }
                />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </StoryPart>
  );
}

export default JobPart;
