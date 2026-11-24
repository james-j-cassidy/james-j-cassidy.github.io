import type { ReactNode } from "react";
import styles from "./LeadershipSky.module.scss";

interface LeadershipSkyProps {
  className: string; // the part's sky: its colors and how it opens and closes
  children?: ReactNode; // the part's own scenery (sun, clouds, ridge)
}

// A part's full-stage sky behind its layout. Every part has one, so it covers the parts
// around it while they move; each part gives its own colors and the way it opens with
// the scroll. Decorative: hidden from screen readers.
function LeadershipSky({ className, children }: LeadershipSkyProps) {
  return (
    <div className={`${styles.sky} ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}

export default LeadershipSky;
