import type { CSSProperties, KeyboardEvent, Ref } from "react";
import type { DesignStage } from "../../../../../../content/architectureExpertise";
import styles from "./ArchitectureApproachChip.module.scss";

interface ArchitectureApproachChipProps {
  stage: DesignStage;
  number: string; // "01"
  order: number; // place on the route, for the deal-in stagger
  box: { left: string; top: string; width: string; height: string };
  running: boolean;
  skippedLabel: string;
  id: string;
  panelId: string;
  selected: boolean;
  buttonRef: Ref<HTMLButtonElement>;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

// One stage as a chip on the board: a tab (the viewport is its panel). A stage the
// project does not need flips over to its back, "Not needed"; only the face showing is
// read.
function ArchitectureApproachChip({
  stage,
  number,
  order,
  box,
  running,
  skippedLabel,
  id,
  panelId,
  selected,
  buttonRef,
  onSelect,
  onKeyDown,
}: ArchitectureApproachChipProps) {
  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="tab"
      className={styles.chip}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      data-skipped={running ? undefined : ""}
      style={{ ...box, "--order": order } as CSSProperties}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <span className={styles.card}>
        <span className={styles.front} aria-hidden={!running}>
          <span className={styles.number}>{number}</span>
          <span className={styles.name}>{stage.short}</span>
        </span>
        <span className={styles.back} aria-hidden={running}>
          <span className={styles.number}>{number}</span>
          <span className={styles.name}>{stage.short}</span>
          <span className={styles.skipped}>{skippedLabel}</span>
        </span>
      </span>
    </button>
  );
}

export default ArchitectureApproachChip;
