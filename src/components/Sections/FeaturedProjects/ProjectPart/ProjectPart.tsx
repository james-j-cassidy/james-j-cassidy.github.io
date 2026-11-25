import { useState, type CSSProperties } from "react";
import {
  FEATURED_PROJECTS_LABELS,
  type Project,
  type ProjectChapter,
} from "../../../../content/featuredProjects";
import JobPartBackdrop from "../../ProfessionalJourney/JobPart/JobPartBackdrop/JobPartBackdrop";
import JobPartTimeline from "../../ProfessionalJourney/JobPart/JobPartTimeline/JobPartTimeline";
import StoryPart from "../../Story/StoryPart/StoryPart";
import ProjectShotDialog from "./ProjectShotDialog/ProjectShotDialog";
import styles from "./ProjectPart.module.scss";

interface ProjectPartProps {
  index: number; // place in the story
  project: Project;
  chapter: ProjectChapter;
}

// One chapter of a project's article, in the project's accent: the chapter rail across
// the top, the words on one side and the screen they are about on the other. The same
// movement as a job or a credential.
// Enters: the backdrop opens from the top, the rail flips down and draws in, the words
// dock down from the rail and the screen rises into place.
// Leaves: the whole chapter carousels away toward the reading start, the next coming in.
//
// The screen opens full size in a dialog.
function ProjectPart({ index, project, chapter }: ProjectPartProps) {
  const { railLabel, view, close, redacted, shotOf } = FEATURED_PROJECTS_LABELS;
  const [open, setOpen] = useState(false);
  const theme = {
    "--project-accent-dark": project.accentDark,
    "--project-accent-light": project.accentLight,
  } as CSSProperties;

  return (
    <StoryPart
      index={index}
      name={`${project.id}-${chapter.id}`}
      className={styles.part}
    >
      <div className={styles.themed} style={theme}>
        <JobPartBackdrop motif="lines" monogram={project.monogram} />
        <div className={styles.layout}>
          <div className={styles.railSlot}>
            <JobPartTimeline
              stops={project.chapters.map((stop) => ({
                id: stop.id,
                short: stop.short,
                full: stop.heading,
                when: null,
              }))}
              currentId={chapter.id}
              label={railLabel}
            />
          </div>
          <div className={styles.copySlot}>
            <div className={styles.copy}>
              <p className={styles.kind}>{project.kind}</p>
              <h3 className={styles.heading}>{chapter.heading}</h3>
              <p className={styles.lead}>{chapter.lead}</p>
              <ul className={styles.points}>
                {chapter.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
          <figure className={styles.shotSlot}>
            <button
              type="button"
              className={styles.shot}
              onClick={() => setOpen(true)}
            >
              <img
                src={`${import.meta.env.BASE_URL}${chapter.shot.src}`}
                alt={chapter.shot.alt}
                width={chapter.shot.width}
                height={chapter.shot.height}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.zoom}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5 20 20M10.5 8v5M8 10.5h5" />
                </svg>
                <span className={styles.zoomText}>{view}</span>
              </span>
            </button>
            <figcaption className={styles.note}>{redacted}</figcaption>
          </figure>
        </div>
        <ProjectShotDialog
          shot={open ? chapter.shot : null}
          heading={chapter.heading}
          labels={{ shotOf, close, redacted }}
          onClose={() => setOpen(false)}
        />
      </div>
    </StoryPart>
  );
}

export default ProjectPart;
