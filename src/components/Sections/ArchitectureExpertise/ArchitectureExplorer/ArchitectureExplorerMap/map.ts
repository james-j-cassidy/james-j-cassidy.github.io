import type {
  SystemEdgeId,
  SystemNodeId,
} from "../../../../../content/architectureExpertise";

// The system map's drawing, in viewBox units (640 × 360). Nodes are placed by their
// centers; connections run as circuit traces between them, under the nodes.
export const MAP_WIDTH = 640;
export const MAP_HEIGHT = 360;
export const NODE_WIDTH = 96;
export const NODE_HEIGHT = 52;

export const NODE_AT: Record<SystemNodeId, { x: number; y: number }> = {
  cdn: { x: 70, y: 170 },
  gateway: { x: 205, y: 170 },
  api: { x: 345, y: 170 },
  cache: { x: 475, y: 62 },
  database: { x: 585, y: 170 },
  queue: { x: 455, y: 290 },
  worker: { x: 585, y: 290 },
};

// Where each part's standby copy appears when the part goes down.
export const STANDBY_AT: Partial<
  Record<SystemNodeId, { x: number; y: number }>
> = {
  cdn: { x: 70, y: 62 },
  gateway: { x: 180, y: 62 },
  api: { x: 285, y: 62 },
  database: { x: 585, y: 62 },
};

// Each connection, drawn from the caller to the part it calls; traffic flows that way.
export const EDGES: readonly { id: SystemEdgeId; d: string }[] = [
  { id: "cdn-gateway", d: "M70 170H205" },
  { id: "gateway-api", d: "M205 170H345" },
  { id: "api-cache", d: "M345 170V62H475" },
  { id: "api-database", d: "M345 170H585" },
  { id: "api-queue", d: "M345 170V290H455" },
  { id: "queue-worker", d: "M455 290H585" },
  { id: "worker-database", d: "M585 290V170" },
];

// The circuit breaker sits on the API's connection to the database.
export const BREAKER_AT = { x: 465, y: 170 };

// The queue's backlog meter, under the queue.
export const BACKLOG_AT = { x: 455, y: 337 };

// Position as a percentage of the map, for the HTML nodes over the drawing.
export function percentX(x: number) {
  return `${(x / MAP_WIDTH) * 100}%`;
}

export function percentY(y: number) {
  return `${(y / MAP_HEIGHT) * 100}%`;
}
