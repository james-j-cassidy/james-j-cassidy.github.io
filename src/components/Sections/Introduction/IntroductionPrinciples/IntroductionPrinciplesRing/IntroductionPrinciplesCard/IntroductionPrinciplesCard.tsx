import type { CSSProperties, KeyboardEvent, Ref } from "react";
import type {
  Principle,
  PrincipleIcon,
} from "../../../../../../content/introduction";
import styles from "./IntroductionPrinciplesCard.module.scss";

interface IntroductionPrinciplesCardProps {
  principle: Principle;
  number: string;
  position: number; // place around the ring
  id: string;
  panelId: string;
  selected: boolean;
  applied: boolean; // its switch is on: the card shows powered
  buttonRef: Ref<HTMLButtonElement>;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

// One principle card on the ring: a tab (the trade-off panel is its panel). Stands at
// its place around the reactor, facing outward; cards turned away are not drawn.
function IntroductionPrinciplesCard({
  principle,
  number,
  position,
  id,
  panelId,
  selected,
  applied,
  buttonRef,
  onSelect,
  onKeyDown,
}: IntroductionPrinciplesCardProps) {
  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="tab"
      className={styles.card}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      data-applied={applied ? "" : undefined}
      style={{ "--position": position } as CSSProperties}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <span className={styles.top}>
        <span className={styles.number}>{number}</span>
        <span className={styles.icon} aria-hidden="true">
          <PrincipleGlyph icon={principle.icon} />
        </span>
      </span>
      <span className={styles.title}>{principle.title}</span>
      <span className={styles.line}>{principle.line}</span>
    </button>
  );
}

function PrincipleGlyph({ icon }: { icon: PrincipleIcon }) {
  const paths: Record<PrincipleIcon, string> = {
    // Two arrows chasing each other: change.
    change:
      "M5 12a7 7 0 0 1 12-5l2 2M19 4v5h-5M19 12a7 7 0 0 1-12 5l-2-2M5 20v-5h5",
    // A page with lines: a written decision.
    record: "M7 3h7l4 4v14H7ZM14 3v4h4M10 12h5M10 16h5",
    // A person with arms open in a circle: access for everyone.
    access:
      "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7.5v.5M7 10l5 1 5-1M12 11v3l-2 4M12 14l2 4",
    // A gear: automation.
    automate:
      "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2",
    // A gauge with its needle: measurement.
    measure: "M4 17a8 8 0 1 1 16 0M12 17l4-6M8 17h8",
  };
  return (
    <svg viewBox="0 0 24 24">
      <path d={paths[icon]} />
    </svg>
  );
}

export default IntroductionPrinciplesCard;
