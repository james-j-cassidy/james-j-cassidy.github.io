// The flight path on the map, in the map's own units (an 800 × 400 view box): a smooth
// curve through each waypoint, in order.
export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 400;

export interface Point {
  x: number;
  y: number;
}

// Waypoint positions for up to five milestones, left to right, rising and dipping.
export const WAYPOINTS: readonly Point[] = [
  { x: 70, y: 320 },
  { x: 230, y: 170 },
  { x: 400, y: 270 },
  { x: 570, y: 110 },
  { x: 730, y: 200 },
];

// Catmull-Rom through the points, written as cubic Bézier segments.
function smoothPath(points: readonly Point[]): string {
  if (points.length === 0) return "";
  const at = (index: number) =>
    points[Math.min(points.length - 1, Math.max(0, index))];
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }
  return d;
}

export function flightPathFor(count: number): string {
  return smoothPath(WAYPOINTS.slice(0, count));
}

// Distance along the path to each point (the path passes through every one).
export function lengthsAlong(
  path: SVGPathElement,
  points: readonly Point[],
): number[] {
  const total = path.getTotalLength();
  const samples = 600;
  return points.map((point) => {
    let best = 0;
    let bestDistance = Infinity;
    for (let i = 0; i <= samples; i++) {
      const length = (total * i) / samples;
      const spot = path.getPointAtLength(length);
      const distance = (spot.x - point.x) ** 2 + (spot.y - point.y) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = length;
      }
    }
    return best;
  });
}
