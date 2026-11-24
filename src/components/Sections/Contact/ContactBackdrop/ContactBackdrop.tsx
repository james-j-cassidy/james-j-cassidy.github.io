import type { CSSProperties } from "react";
import styles from "./ContactBackdrop.module.scss";

interface ContactBackdropProps {
  className: string; // the part's backdrop: how it opens and closes with the scroll
  // Where the rings are centered, as percentages of the stage.
  x: number;
  y: number;
}

const RINGS = [1, 2, 3, 4, 5, 6, 7, 8];

// A part's full-stage backdrop: the deep channel color with signal rings spreading from
// one point, like the radar that opens the Introduction, now sending rather than
// searching. Every part has one, so it covers the parts around it while they move.
// The rings read --rings (0 → 1) from the part: at 0 they are gathered at the center,
// at 1 spread across the stage. Decorative: hidden from screen readers.
function ContactBackdrop({ className, x, y }: ContactBackdropProps) {
  return (
    <div
      className={`${styles.backdrop} ${className}`}
      style={{ "--x": `${x}%`, "--y": `${y}%` } as CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.rings}>
        {RINGS.map((ring) => (
          <span
            key={ring}
            className={styles.ring}
            style={{ "--ring": ring } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export default ContactBackdrop;
