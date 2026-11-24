import { useId, useState } from "react";
import {
  ARCHITECTURE_DECISIONS,
  ARCHITECTURE_PARTS,
} from "../../../../content/architectureExpertise";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import ArchitectureDecisionsSheet from "./ArchitectureDecisionsSheet/ArchitectureDecisionsSheet";
import ArchitectureDecisionsTabs from "./ArchitectureDecisionsTabs/ArchitectureDecisionsTabs";
import styles from "./ArchitectureDecisions.module.scss";

// Decision records: this site's own architecture decisions, written as ADRs on
// blueprint sheets. Each weighs its options against the same criteria, so the reasons
// can be seen, not just the choice.
//
// Enters: the blueprint opens as a circle from the sheet, the title slides in from the
// reading start, the record tabs slide in one after another, the sheet unrolls from the
// top and the "Accepted" stamp lands on it.
// Leaves: the stamp lifts, the sheet rolls back up, the tabs slide away last first and
// the blueprint closes.
//
// Choosing a record scans its sheet in and stamps it again.
function ArchitectureDecisions({ index }: StoryPartProps) {
  const { heading } = ARCHITECTURE_PARTS.decisions;
  const { tag, intro, records, recordsLabel, ...labels } =
    ARCHITECTURE_DECISIONS;
  const baseId = useId();
  const panelId = `${baseId}-record`;
  const tabIdFor = (position: number) => `${baseId}-adr-${position}`;
  const [selected, setSelected] = useState(0);
  const [changes, setChanges] = useState(0);

  function select(position: number) {
    if (position === selected) return;
    setSelected(position);
    setChanges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="decisions" className={styles.part}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.intro}>{intro}</p>
        </header>
        <div className={styles.tabsSlot}>
          <ArchitectureDecisionsTabs
            records={records}
            selected={selected}
            label={recordsLabel}
            tabIdFor={tabIdFor}
            panelId={panelId}
            onSelect={select}
          />
        </div>
        <div className={styles.sheetSlot}>
          <ArchitectureDecisionsSheet
            id={panelId}
            labelledBy={tabIdFor(selected)}
            record={records[selected]}
            change={changes}
            labels={labels}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default ArchitectureDecisions;
