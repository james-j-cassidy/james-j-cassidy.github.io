import type { ReactNode } from "react";
import styles from "./SubSections.module.scss";

interface SubSectionsProps {
  bar: ReactNode; // the sub-tabs, and anything at the bar's end (a sort)
  direction: -1 | 0 | 1; // which way the last switch went, for the slide-in
  children: ReactNode; // the current sub-section's story
}

// A tab divided into sub-sections, each its own scroll story (the Professional Journey,
// the Tech Stack). The bar is pinned under the header and never moves; the story plays
// below it, and a new one slides in from the side it comes from, as the main tabs do.
function SubSections({ bar, direction, children }: SubSectionsProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.bar}>{bar}</div>
      <div className={styles.stories} data-direction={direction}>
        {children}
      </div>
    </div>
  );
}

export default SubSections;
