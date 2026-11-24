import { useId, useState } from "react";
import {
  ARCHITECTURE_EXPLORER,
  ARCHITECTURE_PARTS,
} from "../../../../content/architectureExpertise";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import ArchitectureExplorerCard from "./ArchitectureExplorerCard/ArchitectureExplorerCard";
import ArchitectureExplorerChaos from "./ArchitectureExplorerChaos/ArchitectureExplorerChaos";
import ArchitectureExplorerMap from "./ArchitectureExplorerMap/ArchitectureExplorerMap";
import styles from "./ArchitectureExplorer.module.scss";

// Architecture explorer: a sample cloud system (synthetic) as a live map. Traffic flows
// from the CDN through the gateway to the API, which reads from the cache and the
// database and hands slow work to a queue for the workers.
//
// Enters: the blueprint opens as a circle from the map, the title slides in from the
// reading start, the parts power on one by one, the connections draw along and traffic
// starts flowing; the screen slides in from the far side and the chaos switch rises.
// Leaves: the traffic stops, the connections are erased, the parts power off last first,
// the screen and switch leave and the blueprint closes.
//
// Choosing a part shows why it is there and how the system copes without it. Chaos mode
// takes the chosen part down: its connections break, the extra load runs hot along the
// others and its resilience pattern shows on the map while the system stays up.
function ArchitectureExplorer({ index }: StoryPartProps) {
  const { heading } = ARCHITECTURE_PARTS.explorer;
  const { tag, intro, nodes, status, ...labels } = ARCHITECTURE_EXPLORER;
  const baseId = useId();
  const panelId = `${baseId}-part`;
  const tabIdFor = (position: number) => `${baseId}-node-${position}`;
  const [selected, setSelected] = useState(0);
  const [chaos, setChaos] = useState(false);
  const [cardChanges, setCardChanges] = useState(0);
  const [mapChanges, setMapChanges] = useState(0);
  const node = nodes[selected];
  const down = chaos ? node : null;

  function select(position: number) {
    if (position === selected) return;
    setSelected(position);
    setCardChanges((count) => count + 1);
    if (chaos) setMapChanges((count) => count + 1);
  }

  function toggleChaos() {
    setChaos((on) => !on);
    setMapChanges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="explorer" className={styles.part}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.intro}>{intro}</p>
        </header>
        <div className={styles.mapSlot}>
          <ArchitectureExplorerMap
            nodes={nodes}
            selected={selected}
            down={down}
            change={mapChanges}
            labels={{
              nodes: labels.nodesLabel,
              down: labels.down,
              standby: labels.standby,
              breaker: labels.breaker,
              backlog: labels.backlog,
            }}
            tabIdFor={tabIdFor}
            panelId={panelId}
            onSelect={select}
          />
        </div>
        <div className={styles.controlsSlot}>
          <ArchitectureExplorerChaos
            on={chaos}
            label={labels.chaos}
            statusLabel={labels.statusLabel}
            status={down ? status[down.failure.health] : status.healthy}
            degraded={down?.failure.health === "degraded"}
            onToggle={toggleChaos}
          />
        </div>
        <div className={styles.cardSlot}>
          <ArchitectureExplorerCard
            id={panelId}
            labelledBy={tabIdFor(selected)}
            node={node}
            down={chaos}
            change={cardChanges}
            labels={{
              role: labels.roleLabel,
              failure: labels.failureLabel,
              down: labels.down,
            }}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default ArchitectureExplorer;
