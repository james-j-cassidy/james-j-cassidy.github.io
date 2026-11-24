import type { CSSProperties } from "react";
import type {
  SystemNode,
  SystemNodeId,
} from "../../../../../content/architectureExpertise";
import { useRovingTabs } from "../../../../../hooks/useRovingTabs";
import {
  BACKLOG_AT,
  BREAKER_AT,
  EDGES,
  MAP_HEIGHT,
  MAP_WIDTH,
  NODE_AT,
  STANDBY_AT,
  percentX,
  percentY,
} from "./map";
import styles from "./ArchitectureExplorerMap.module.scss";

// One stroke icon per part (24 × 24).
const ICONS: Record<SystemNodeId, string> = {
  cdn: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  gateway: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
  api: "M8 4C6 4 5 5 5 7v2c0 1-1 2-2 3 1 1 2 2 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1 1 2 2 3-1 1-2 2-2 3v2c0 2-1 3-3 3",
  cache: "M13 2L4 14h7l-1 8 9-12h-7z",
  queue: "M4 6h16M4 12h16M4 18h10",
  worker:
    "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1",
  database:
    "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
};

interface ArchitectureExplorerMapProps {
  nodes: readonly SystemNode[];
  selected: number;
  down: SystemNode | null; // the part chaos has taken down
  change: number; // one more per chaos change; restarts the traffic
  labels: {
    nodes: string;
    down: string;
    standby: string;
    breaker: string;
    backlog: string;
  };
  tabIdFor: (index: number) => string;
  panelId: string;
  onSelect: (index: number) => void;
}

// The sample system as a map: the parts are tabs (the card is their panel) placed over
// a drawing of their connections, with traffic flowing along them. When chaos takes a
// part down, its connections break, the ones carrying the extra load run hot, and the
// part's resilience shows: a standby copy rises, the circuit breaker opens or the
// queue's backlog fills.
function ArchitectureExplorerMap({
  nodes,
  selected,
  down,
  change,
  labels,
  tabIdFor,
  panelId,
  onSelect,
}: ArchitectureExplorerMapProps) {
  const { refFor, onKeyDown } = useRovingTabs(nodes.length, selected, onSelect);
  const failure = down?.failure;
  const edgeState = (id: (typeof EDGES)[number]["id"]) =>
    failure?.cut.includes(id)
      ? "cut"
      : failure?.busy.includes(id)
        ? "busy"
        : undefined;
  const standby = down && failure?.standby ? STANDBY_AT[down.id] : undefined;

  return (
    <div className={styles.map}>
      <svg
        key={change}
        className={styles.drawing}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        aria-hidden="true"
      >
        {EDGES.map((edge) => (
          <g key={edge.id} data-state={edgeState(edge.id)}>
            <path className={styles.edge} d={edge.d} pathLength={1} />
            <path className={styles.flow} d={edge.d} />
          </g>
        ))}
        {down && standby && (
          <path
            key={`takeover-${down.id}`}
            className={styles.takeover}
            d={`M${NODE_AT[down.id].x} ${NODE_AT[down.id].y}L${standby.x} ${standby.y}`}
          />
        )}
        <g
          className={styles.breaker}
          data-open={failure?.breaker ? "" : undefined}
          transform={`translate(${BREAKER_AT.x} ${BREAKER_AT.y})`}
        >
          <rect
            className={styles.breakerCase}
            x="-22"
            y="-14"
            width="44"
            height="28"
            rx="6"
          />
          <circle className={styles.terminal} cx="-12" cy="0" r="3.5" />
          <circle className={styles.terminal} cx="12" cy="0" r="3.5" />
          <line className={styles.lever} x1="-12" y1="0" x2="12" y2="0" />
          <text className={styles.breakerLabel} x="0" y="-22">
            {labels.breaker}
          </text>
        </g>
        <g
          className={styles.backlog}
          data-filling={failure?.backlog ? "" : undefined}
          transform={`translate(${BACKLOG_AT.x - 48} ${BACKLOG_AT.y - 7})`}
        >
          {Array.from({ length: 8 }, (_, cell) => (
            <rect
              key={cell}
              className={styles.cell}
              x={cell * 12}
              y="0"
              width="9"
              height="14"
              rx="2"
              style={{ "--cell": cell } as CSSProperties}
            />
          ))}
          <text className={styles.backlogLabel} x="104" y="12">
            {labels.backlog}
          </text>
        </g>
      </svg>
      {down && standby && (
        <span
          key={`standby-${down.id}`}
          className={styles.standby}
          style={{ left: percentX(standby.x), top: percentY(standby.y) }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24">
            <path d={ICONS[down.id]} />
          </svg>
          <span className={styles.label}>{labels.standby}</span>
        </span>
      )}
      <div className={styles.nodes} role="tablist" aria-label={labels.nodes}>
        {nodes.map((node, index) => {
          const isDown = down?.id === node.id;
          const at = NODE_AT[node.id];
          return (
            <button
              key={node.id}
              ref={refFor(index)}
              id={tabIdFor(index)}
              type="button"
              role="tab"
              className={styles.node}
              aria-selected={index === selected}
              aria-controls={panelId}
              tabIndex={index === selected ? 0 : -1}
              data-down={isDown ? "" : undefined}
              style={
                {
                  left: percentX(at.x),
                  top: percentY(at.y),
                  "--order": index,
                } as CSSProperties
              }
              onClick={() => onSelect(index)}
              onKeyDown={onKeyDown}
            >
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d={ICONS[node.id]} />
              </svg>
              <span className={styles.label}>{node.short}</span>
              {isDown && (
                <span className={styles.downMark}>
                  <span aria-hidden="true">✕</span>
                  <span className={styles.downWord}> {labels.down}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ArchitectureExplorerMap;
