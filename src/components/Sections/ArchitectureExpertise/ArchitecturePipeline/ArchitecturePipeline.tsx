import { useId, useState } from "react";
import {
  ARCHITECTURE_PARTS,
  ARCHITECTURE_PIPELINE,
} from "../../../../content/architectureExpertise";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import ArchitecturePipelineChanges from "./ArchitecturePipelineChanges/ArchitecturePipelineChanges";
import ArchitecturePipelineResult from "./ArchitecturePipelineResult/ArchitecturePipelineResult";
import ArchitecturePipelineTrack from "./ArchitecturePipelineTrack/ArchitecturePipelineTrack";
import styles from "./ArchitecturePipeline.module.scss";

// Delivery pipeline: this site's quality gates on a conveyor. The four in place are the
// site's real ones (Prettier, Oxlint, strict TypeScript, the Vite build); tests,
// budgets and automatic deploys are shown as planned.
//
// Enters: the blueprint opens as a circle from the belt, the title slides in from the
// reading start, the belt draws across and the gates drop onto it one after another;
// the changes slide in from the reading start and the result screen from the far side.
// Leaves: the gates lift away last first, the belt is erased, the changes and screen
// slide off and the blueprint closes.
//
// Choosing a change sends it down the belt: each gate it reaches shows its result as it
// arrives, the gate that catches it shakes and the change stops there; a clean change
// reaches release.
function ArchitecturePipeline({ index }: StoryPartProps) {
  const { heading } = ARCHITECTURE_PARTS.pipeline;
  const { tag, intro, gates, changes, ...labels } = ARCHITECTURE_PIPELINE;
  const baseId = useId();
  const resultId = `${baseId}-result`;
  const [selected, setSelected] = useState<number | null>(null);
  const [runs, setRuns] = useState(0);
  const change = selected === null ? null : changes[selected];
  const gate = change?.caughtBy
    ? gates.find((item) => item.id === change.caughtBy)
    : undefined;

  function send(position: number) {
    setSelected(position);
    setRuns((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="pipeline" className={styles.part}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.intro}>{intro}</p>
        </header>
        <div className={styles.trackSlot}>
          <ArchitecturePipelineTrack
            gates={gates}
            caughtBy={change ? change.caughtBy : undefined}
            run={runs}
            labels={{
              gates: labels.gatesLabel,
              live: labels.live,
              planned: labels.planned,
              release: labels.release,
              passed: labels.passed,
              caught: labels.caught,
              skipped: labels.skipped,
            }}
          />
        </div>
        <div className={styles.changesSlot}>
          <ArchitecturePipelineChanges
            changes={changes}
            selected={selected}
            label={labels.changesLabel}
            resultId={resultId}
            onSelect={send}
          />
        </div>
        <div className={styles.resultSlot}>
          <ArchitecturePipelineResult
            id={resultId}
            headline={
              change
                ? gate
                  ? labels.caughtBy(gate.name, gate.tool)
                  : labels.shipped
                : null
            }
            caught={Boolean(gate)}
            text={change ? change.result : labels.prompt}
            proofLabel={labels.proofLabel}
            proof={labels.proof}
            source={labels.source}
            run={runs}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default ArchitecturePipeline;
