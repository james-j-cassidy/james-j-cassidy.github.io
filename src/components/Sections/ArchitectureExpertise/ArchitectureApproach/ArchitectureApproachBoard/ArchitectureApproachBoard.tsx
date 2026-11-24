import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import type { DesignStage } from "../../../../../content/architectureExpertise";
import ArchitectureApproachChip from "./ArchitectureApproachChip/ArchitectureApproachChip";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  FEEDBACK_LABEL,
  FEEDBACK_LOOP,
  FEEDBACK_PATH,
  NODES,
  nodeBox,
  routePath,
} from "./route";
import styles from "./ArchitectureApproachBoard.module.scss";

interface ArchitectureApproachBoardProps {
  stages: readonly DesignStage[];
  running: readonly boolean[]; // per stage: runs for this project
  selected: number;
  changes: number; // one more per route change; redraws the route and charges the terminal
  tabIdFor: (index: number) => string;
  panelId: string;
  labels: {
    stages: string;
    skipped: string;
    build: string;
    buildLabel: string;
    loop: string;
    route: string;
  };
  numberFor: (index: number) => string;
  onSelect: (index: number) => void;
}

// The design loop as a circuit board: the stages are chips, wired in order to the ship
// terminal, and a feedback trace runs from it back under the board into the first stage.
// The route lights only the stages that run; a skipped stage flips over and the route
// bypasses it through the corridor between the rows. A signal laps the whole loop, one
// lap per iteration. The chips are tabs (the viewport is their panel): arrow keys move
// along the route, Home and End jump to the ends.
function ArchitectureApproachBoard({
  stages,
  running,
  selected,
  changes,
  tabIdFor,
  panelId,
  labels,
  numberFor,
  onSelect,
}: ArchitectureApproachBoardProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = stages.length - 1;
  const terminal = NODES.length - 1;
  const route = [
    ...stages.flatMap((_, index) => (running[index] ? [index] : [])),
    terminal,
  ];
  const path = routePath(route);
  // Spoken when the route changes: the stages it runs through, in order.
  const routeNames = [
    ...stages.filter((_, index) => running[index]).map((stage) => stage.short),
    labels.build,
  ].join(", ");
  const lap = `${path}${FEEDBACK_LOOP}`;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = {
      ArrowRight: Math.min(last, selected + 1),
      ArrowDown: Math.min(last, selected + 1),
      ArrowLeft: Math.max(0, selected - 1),
      ArrowUp: Math.max(0, selected - 1),
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onSelect(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={styles.board}>
      <div className={styles.plate}>
        <svg
          className={styles.wiring}
          viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
          aria-hidden="true"
        >
          {/* Every stage's pad stays wired faintly, so a bypass reads as a detour. */}
          <path
            className={styles.ghost}
            d={routePath(NODES.map((_, i) => i))}
          />
          <path
            key={changes}
            className={styles.route}
            d={path}
            pathLength={1}
            data-redrawn={changes > 0 ? "" : undefined}
          />
          <path className={styles.feedback} d={FEEDBACK_PATH} pathLength={1} />
          <text
            className={styles.feedbackLabel}
            x={FEEDBACK_LABEL.x}
            y={FEEDBACK_LABEL.y}
          >
            ↺ {labels.loop}
          </text>
          <circle key={`pulse-${path}`} className={styles.pulse} r={8}>
            <animateMotion dur="5s" repeatCount="indefinite" path={lap} />
          </circle>
        </svg>
        <div
          className={styles.chips}
          role="tablist"
          aria-label={labels.stages}
          aria-orientation="horizontal"
        >
          {stages.map((stage, index) => (
            <ArchitectureApproachChip
              key={stage.id}
              stage={stage}
              number={numberFor(index)}
              order={index}
              box={nodeBox(NODES[index])}
              running={running[index]}
              skippedLabel={labels.skipped}
              id={tabIdFor(index)}
              panelId={panelId}
              selected={index === selected}
              buttonRef={(element) => {
                tabRefs.current[index] = element;
              }}
              onSelect={() => onSelect(index)}
              onKeyDown={handleKeyDown}
            />
          ))}
        </div>
        <span
          key={changes}
          className={styles.terminal}
          style={
            {
              ...nodeBox(NODES[terminal], 100, 100),
              "--order": terminal,
            } as CSSProperties
          }
          data-charged={changes > 0 ? "" : undefined}
        >
          <span className={styles.check} aria-hidden="true">
            ✓
          </span>
          <span className={styles.terminalName}>{labels.build}</span>
          <span className={styles.visuallyHidden}>{labels.buildLabel}</span>
        </span>
      </div>
      <p className={styles.summary} aria-live="polite">
        <span className={styles.summaryLabel}>{labels.route}:</span>{" "}
        {routeNames}
        <span aria-hidden="true"> ↺ </span>
        <span className={styles.loopNote}>{labels.loop}</span>
      </p>
    </div>
  );
}

export default ArchitectureApproachBoard;
