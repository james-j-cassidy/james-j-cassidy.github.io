import { useId } from "react";
import type { JobMotif } from "../../../../../content/professionalJourney";
import styles from "./JobPartBackdrop.module.scss";

interface JobPartBackdropProps {
  motif: JobMotif;
  monogram: string;
}

// Each motif is one pattern tile, drawn in the job's accent.
const TILES: Record<JobMotif, { size: [number, number]; d: string }> = {
  dots: { size: [36, 36], d: "M18 16.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" },
  lines: { size: [40, 40], d: "M0 40 40 0M-10 10 10-10M30 50 50 30" },
  hex: {
    size: [48, 83],
    d: "M24 0 48 14V41L24 55 0 41V14ZM24 55V83",
  },
};

// A job's full-stage background, in its theme: the job's pattern and a large
// watermark of the company's monogram. Decorative: hidden from screen readers.
function JobPartBackdrop({ motif, monogram }: JobPartBackdropProps) {
  const tile = TILES[motif];
  // Unique per job: the pattern takes this job's accent.
  const patternId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-motif`;

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <svg className={styles.pattern} width="100%" height="100%">
        <defs>
          <pattern
            id={patternId}
            width={tile.size[0]}
            height={tile.size[1]}
            patternUnits="userSpaceOnUse"
          >
            <path className={styles.tile} d={tile.d} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <span className={styles.watermark}>{monogram}</span>
    </div>
  );
}

export default JobPartBackdrop;
