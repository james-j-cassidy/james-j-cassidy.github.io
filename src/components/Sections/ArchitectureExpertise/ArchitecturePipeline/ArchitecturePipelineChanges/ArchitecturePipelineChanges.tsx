import type { CSSProperties } from "react";
import type { PipelineChange } from "../../../../../content/architectureExpertise";
import { useRovingTabs } from "../../../../../hooks/useRovingTabs";
import styles from "./ArchitecturePipelineChanges.module.scss";

interface ArchitecturePipelineChangesProps {
  changes: readonly PipelineChange[];
  selected: number | null; // null: nothing sent yet
  label: string;
  resultId: string;
  onSelect: (index: number) => void;
}

// The changes a visitor can send down the pipeline, as a radio group: choosing one
// sends it.
function ArchitecturePipelineChanges({
  changes,
  selected,
  label,
  resultId,
  onSelect,
}: ArchitecturePipelineChangesProps) {
  const focusable = selected ?? 0;
  const { refFor, onKeyDown } = useRovingTabs(
    changes.length,
    focusable,
    onSelect,
  );

  return (
    <div className={styles.changes}>
      <p className={styles.label} id={`${resultId}-label`}>
        {label}
      </p>
      <div
        className={styles.options}
        role="radiogroup"
        aria-labelledby={`${resultId}-label`}
      >
        {changes.map((change, index) => (
          <button
            key={change.id}
            ref={refFor(index)}
            type="button"
            role="radio"
            className={styles.option}
            aria-checked={index === selected}
            aria-controls={resultId}
            tabIndex={index === focusable ? 0 : -1}
            data-clean={change.caughtBy ? undefined : ""}
            style={{ "--order": index } as CSSProperties}
            onClick={() => onSelect(index)}
            onKeyDown={onKeyDown}
          >
            <span className={styles.dot} aria-hidden="true" />
            {change.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ArchitecturePipelineChanges;
