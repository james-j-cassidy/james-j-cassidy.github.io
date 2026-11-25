import { useEffect, useRef, type MouseEvent } from "react";
import type { ProjectShot } from "../../../../../content/featuredProjects";
import styles from "./ProjectShotDialog.module.scss";

interface ProjectShotDialogProps {
  shot: ProjectShot | null; // the screen to show; null: closed
  heading: string; // the chapter it belongs to
  labels: {
    shotOf: (heading: string) => string;
    close: string;
    redacted: string;
  };
  onClose: () => void;
}

// A chapter's screen full size in a modal dialog, with what it shows and the note that
// company details are covered. The browser's own dialog keeps focus inside, closes on
// Escape and returns focus to the screen that opened it; clicking outside the frame
// closes it too.
function ProjectShotDialog({
  shot,
  heading,
  labels,
  onClose,
}: ProjectShotDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (shot && !dialog.open) dialog.showModal();
    if (!shot && dialog.open) dialog.close();
  }, [shot]);

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    // The dialog itself (not its content) is only hit outside the frame.
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={shot ? labels.shotOf(heading) : undefined}
      onClose={onClose}
      onClick={handleClick}
    >
      {shot && (
        <figure className={styles.frame}>
          <button
            type="button"
            className={styles.close}
            aria-label={labels.close}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <img
            className={styles.image}
            src={`${import.meta.env.BASE_URL}${shot.src}`}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
          />
          <figcaption className={styles.caption}>
            <span className={styles.title}>{heading}</span>
            <span className={styles.note}>{labels.redacted}</span>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}

export default ProjectShotDialog;
