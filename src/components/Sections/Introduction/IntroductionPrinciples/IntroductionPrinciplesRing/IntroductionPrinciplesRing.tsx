import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import type { Principle } from "../../../../../content/introduction";
import IntroductionPrinciplesCard from "./IntroductionPrinciplesCard/IntroductionPrinciplesCard";
import styles from "./IntroductionPrinciplesRing.module.scss";

interface IntroductionPrinciplesRingProps {
  principles: readonly Principle[];
  selected: number;
  turn: number; // cumulative steps turned (so the ring always takes the short way)
  applied: readonly boolean[];
  tabIdFor: (index: number) => string;
  panelId: string;
  label: string;
  previousLabel: string;
  nextLabel: string;
  onSelect: (index: number) => void;
}

// The reactor: a glowing core with the principle cards standing around it in a ring, in
// 3D. Choosing a card (click, the arrows below, or the arrow keys on the cards) spins
// the ring the short way round until that card faces the visitor.
function IntroductionPrinciplesRing({
  principles,
  selected,
  turn,
  applied,
  tabIdFor,
  panelId,
  label,
  previousLabel,
  nextLabel,
  onSelect,
}: IntroductionPrinciplesRingProps) {
  const count = principles.length;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Distance from the center to each card, in card widths, so neighbors just clear
  // each other.
  const radiusFactor = 0.5 / Math.tan(Math.PI / Math.max(3, count));

  const geometry = {
    "--step": `${360 / count}deg`,
    "--radius-factor": radiusFactor,
    "--turn": turn,
  } as CSSProperties;

  const wrap = (index: number) => (index + count) % count;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = {
      ArrowRight: wrap(selected + 1),
      ArrowDown: wrap(selected + 1),
      ArrowLeft: wrap(selected - 1),
      ArrowUp: wrap(selected - 1),
      Home: 0,
      End: count - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onSelect(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={styles.reactor} style={geometry}>
      <div className={styles.core} aria-hidden="true">
        <span className={styles.coreRing} />
        <span className={styles.coreRing} />
        <span className={styles.coreHeart} />
      </div>
      <div className={styles.spin}>
        <div className={styles.ring} role="tablist" aria-label={label}>
          {principles.map((principle, index) => (
            <IntroductionPrinciplesCard
              key={principle.id}
              principle={principle}
              number={String(index + 1).padStart(2, "0")}
              position={index}
              id={tabIdFor(index)}
              panelId={panelId}
              selected={index === selected}
              applied={applied[index]}
              buttonRef={(element) => {
                tabRefs.current[index] = element;
              }}
              onSelect={() => onSelect(index)}
              onKeyDown={handleKeyDown}
            />
          ))}
        </div>
      </div>
      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navButton}
          aria-label={previousLabel}
          onClick={() => onSelect(wrap(selected - 1))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.navButton}
          aria-label={nextLabel}
          onClick={() => onSelect(wrap(selected + 1))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default IntroductionPrinciplesRing;
