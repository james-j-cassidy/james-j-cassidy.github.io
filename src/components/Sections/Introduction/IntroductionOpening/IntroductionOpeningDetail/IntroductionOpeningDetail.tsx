import { useId } from "react";
import type { OpeningModule } from "../../../../../content/introduction";
import styles from "./IntroductionOpeningDetail.module.scss";

interface IntroductionOpeningDetailProps {
  id: string;
  module: OpeningModule;
  open: boolean;
  closeLabel: string;
  onClose: () => void;
}

// A module's detail card: a hologram that floats up out of the depth, tilting upright as
// it comes, with a scan line sweeping down it once it arrives. Closing sends it back
// into the depth. While closed it is hidden and inert (not seen, read or focusable).
function IntroductionOpeningDetail({
  id,
  module,
  open,
  closeLabel,
  onClose,
}: IntroductionOpeningDetailProps) {
  const headingId = useId();
  const { tag, heading, points, tags } = module.detail;

  return (
    <section
      id={id}
      className={styles.detail}
      data-module={module.id}
      data-open={open ? "" : undefined}
      aria-labelledby={headingId}
      inert={!open}
    >
      <div className={styles.header}>
        <p className={styles.tag}>{tag}</p>
        <button
          type="button"
          className={styles.close}
          aria-label={closeLabel}
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <h4 id={headingId} className={styles.heading}>
        {heading}
      </h4>
      <ul className={styles.points}>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <ul className={styles.tags}>
        {tags.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default IntroductionOpeningDetail;
