import { useEffect, useId, useRef, useState } from "react";
import type { TrustTrait } from "../../../../../content/leadershipResults";
import styles from "./LeadershipTrustTraits.module.scss";

interface LeadershipTrustTraitsProps {
  traits: readonly TrustTrait[];
  label: string; // names the group of traits
}

// Phones: the tree's branch tips, as a row of chips under it (the tree is too small
// there for six 44-pixel tips). The same toggletip: choosing a chip opens its trait
// above the row, announced as it appears; Escape, a tap elsewhere or the same chip
// again closes it. Shown on phones only (the tree's own tips serve larger screens).
function LeadershipTrustTraits({ traits, label }: LeadershipTrustTraitsProps) {
  const tipId = `${useId()}-tip`;
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open === null) return;
    function outside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={styles.traits}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open !== null) {
          event.stopPropagation();
          setOpen(null);
        }
      }}
    >
      <div role="status" id={tipId} className={styles.bubble}>
        {open !== null && (
          <>
            <strong className={styles.bubbleName}>{traits[open].name}</strong>
            <span>{traits[open].line}</span>
          </>
        )}
      </div>
      <div className={styles.chips} role="group" aria-label={label}>
        {traits.map((trait, index) => (
          <button
            key={trait.id}
            type="button"
            className={styles.chip}
            aria-expanded={open === index}
            aria-controls={tipId}
            onClick={() => setOpen((now) => (now === index ? null : index))}
          >
            <span className={styles.bud} aria-hidden="true" />
            {trait.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LeadershipTrustTraits;
