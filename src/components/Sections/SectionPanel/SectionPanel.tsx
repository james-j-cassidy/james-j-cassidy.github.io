import { useId, type Ref } from "react";
import styles from "./SectionPanel.module.scss";

interface SectionPanelProps {
  id: string;
  title: string;
  placeholder: string;
  hidden: boolean;
  headingRef: Ref<HTMLHeadingElement>;
}

// One section of the left-to-right story. Placeholder content for now; each section's
// real content replaces the paragraph when it is built. Only the current section is
// shown; the others are hidden (out of view, the tab order and the accessibility tree).
// The heading takes focus when the visitor moves to this section, so screen readers
// announce where they landed.
function SectionPanel({
  id,
  title,
  placeholder,
  hidden,
  headingRef,
}: SectionPanelProps) {
  const headingId = useId();

  return (
    <section
      id={id}
      className={styles.panel}
      aria-labelledby={headingId}
      hidden={hidden}
    >
      <h2
        ref={headingRef}
        id={headingId}
        className={styles.title}
        tabIndex={-1}
      >
        {title}
      </h2>
      <p className={styles.placeholder}>{placeholder}</p>
    </section>
  );
}

export default SectionPanel;
