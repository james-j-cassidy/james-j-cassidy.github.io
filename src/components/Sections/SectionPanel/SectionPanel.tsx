import { useId, type ReactNode, type Ref } from "react";
import styles from "./SectionPanel.module.scss";

interface SectionPanelProps {
  id: string;
  title: string;
  placeholder: string;
  hidden: boolean;
  headingRef: Ref<HTMLHeadingElement>;
  children?: ReactNode; // the section's content; the placeholder shows until it exists
}

// One section of the left-to-right story. Shows its content, or a placeholder for a
// section that is not built yet. Only the current section is shown; the others are
// hidden (out of view, the tab order and the accessibility tree).
// A built section hides its heading visually (the current tab already names it) and
// gives its content the full width. The heading takes focus when the visitor moves to
// this section, so screen readers announce where they landed.
function SectionPanel({
  id,
  title,
  placeholder,
  hidden,
  headingRef,
  children,
}: SectionPanelProps) {
  const headingId = useId();

  return (
    <section
      id={id}
      className={styles.panel}
      data-built={children ? "" : undefined}
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
      {children ?? <p className={styles.placeholder}>{placeholder}</p>}
    </section>
  );
}

export default SectionPanel;
