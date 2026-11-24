// The board's drawing: where each node sits and the route the signal takes through the
// stages that run. In the board's viewBox units; the chips are placed over the drawing
// in percentages of the same box, so both line up at any size.

export const BOARD_WIDTH = 1000;
export const BOARD_HEIGHT = 340;
export const CHIP_WIDTH = 120;
export const CHIP_HEIGHT = 76;

// The two rows the nodes alternate between, the bypass corridor between them and the
// feedback track under everything.
const TOP = 90;
const BOTTOM = 210;
const CORRIDOR = (TOP + BOTTOM) / 2;
const FEEDBACK = 305;
const RETURN_X = 8; // the feedback climbs back up left of the first chip

export interface Point {
  x: number;
  y: number;
}

// Six stages, then the ship terminal, zigzagging across the board.
export const NODES: readonly Point[] = [
  { x: 80, y: TOP },
  { x: 218, y: BOTTOM },
  { x: 356, y: TOP },
  { x: 494, y: BOTTOM },
  { x: 632, y: TOP },
  { x: 770, y: BOTTOM },
  { x: 915, y: TOP },
];

// The feedback loop: from the ship terminal down to the track under the board, back
// along it and up into the first stage, with rounded corners. Continues the route, so it
// starts where the route ends.
const shipNode = NODES[NODES.length - 1];
const firstNode = NODES[0];
export const FEEDBACK_LOOP =
  `V${FEEDBACK - 15}Q${shipNode.x} ${FEEDBACK} ${shipNode.x - 15} ${FEEDBACK}` +
  `H${RETURN_X + 15}Q${RETURN_X} ${FEEDBACK} ${RETURN_X} ${FEEDBACK - 15}` +
  `V${firstNode.y + 15}Q${RETURN_X} ${firstNode.y} ${RETURN_X + 15} ${firstNode.y}` +
  `H${firstNode.x}`;
export const FEEDBACK_PATH = `M${shipNode.x} ${shipNode.y}${FEEDBACK_LOOP}`;
export const FEEDBACK_LABEL = {
  x: (RETURN_X + shipNode.x) / 2,
  y: FEEDBACK + 26,
};

// A smooth S-curve that leaves and arrives level.
function curve(from: Point, to: Point): string {
  const mid = (from.x + to.x) / 2;
  return `C${mid} ${from.y} ${mid} ${to.y} ${to.x} ${to.y}`;
}

// The route through the running nodes, in order. Neighbors are joined by an S-curve; a
// skipped stage is bypassed through the corridor between the rows, clear of every chip.
export function routePath(running: readonly number[]): string {
  if (running.length === 0) return "";
  const first = NODES[running[0]];
  let path = `M${first.x} ${first.y}`;
  for (let step = 1; step < running.length; step++) {
    const from = NODES[running[step - 1]];
    const to = NODES[running[step]];
    if (running[step] - running[step - 1] === 1) {
      path += curve(from, to);
      continue;
    }
    const enter = { x: from.x + CHIP_WIDTH * 0.6, y: CORRIDOR };
    const leave = { x: to.x - CHIP_WIDTH * 0.6, y: CORRIDOR };
    path += `${curve(from, enter)}L${leave.x} ${leave.y}${curve(leave, to)}`;
  }
  return path;
}

// A node's box over the drawing, in percentages of the board.
export function nodeBox(
  point: Point,
  width = CHIP_WIDTH,
  height = CHIP_HEIGHT,
) {
  return {
    left: `${((point.x - width / 2) / BOARD_WIDTH) * 100}%`,
    top: `${((point.y - height / 2) / BOARD_HEIGHT) * 100}%`,
    width: `${(width / BOARD_WIDTH) * 100}%`,
    height: `${(height / BOARD_HEIGHT) * 100}%`,
  };
}
