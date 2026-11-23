// Geometry for the circuit-board backdrop. Pure functions: measured positions in, traces out.
// Coordinates are CSS pixels relative to the main body box (x right, y down; 0° = right, 90° = down).
//
// Every trace starts at its "sink" (points[0]): the CPU (the portrait) or a component.
// Current always flows toward the sink, and "bus" traces carry it on from the CPU to a component.

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Circle {
  x: number;
  y: number;
  r: number;
}

export interface Anchors {
  width: number;
  height: number;
  cpu: Circle;
  column: Rect | null;
  hire: Rect | null;
  card: Rect | null;
}

export type TraceRole = "bus" | "input";
export type EndCap = "pin" | "via" | "none";

export interface Sample {
  x: number;
  y: number;
  s: number; // distance along the trace from its sink
}

export interface Trace {
  id: string;
  role: TraceRole;
  sink: "cpu" | "component";
  points: Point[];
  end: Point;
  endCap: EndCap;
  d: string;
  length: number;
  samples: Sample[];
}

export interface Circuit {
  width: number;
  height: number;
  cpu: Circle;
  traces: Trace[];
}

const BUS_SPACING = 9;
const CHAMFER = 10;
const SAMPLE_STEP = 6;

const pt = (x: number, y: number): Point => ({ x, y });

function onCircle(c: Circle, degrees: number, extra = 0): Point {
  const a = (degrees * Math.PI) / 180;
  return pt(
    c.x + (c.r + extra) * Math.cos(a),
    c.y + (c.r + extra) * Math.sin(a),
  );
}

function sign(n: number): number {
  return n === 0 ? 0 : n > 0 ? 1 : -1;
}

// PCB-style route: a 45° run first, then straight along whichever axis is left.
// Every segment is horizontal, vertical or exactly diagonal.
function diagonalThenStraight(a: Point, b: Point): Point[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const run = Math.min(Math.abs(dx), Math.abs(dy));
  const bend = pt(a.x + sign(dx) * run, a.y + sign(dy) * run);
  return [a, bend, b];
}

// A short straight lead out from a, then the 45° route to b.
function leadThenRoute(a: Point, lead: Point, b: Point): Point[] {
  const leadEnd = pt(a.x + lead.x, a.y + lead.y);
  return [a, ...diagonalThenStraight(leadEnd, b)];
}

// Cuts every corner at 45°, like copper traces.
function chamfer(points: Point[], size: number): Point[] {
  if (points.length < 3) return points;
  const out: Point[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1];
    const p = points[i];
    const b = points[i + 1];
    const l1 = Math.hypot(p.x - a.x, p.y - a.y);
    const l2 = Math.hypot(b.x - p.x, b.y - p.y);
    if (l1 === 0 || l2 === 0) continue;
    const u1 = pt((p.x - a.x) / l1, (p.y - a.y) / l1);
    const u2 = pt((b.x - p.x) / l2, (b.y - p.y) / l2);
    const straight = Math.abs(u1.x * u2.y - u1.y * u2.x) < 0.01;
    if (straight) continue;
    const c = Math.min(size, l1 / 2, l2 / 2);
    out.push(
      pt(p.x - u1.x * c, p.y - u1.y * c),
      pt(p.x + u2.x * c, p.y + u2.y * c),
    );
  }
  out.push(points[points.length - 1]);
  return out;
}

function dedupe(points: Point[]): Point[] {
  return points.filter(
    (p, i) =>
      i === 0 ||
      Math.abs(p.x - points[i - 1].x) > 0.5 ||
      Math.abs(p.y - points[i - 1].y) > 0.5,
  );
}

function makeTrace(
  id: string,
  role: TraceRole,
  sink: Trace["sink"],
  rawPoints: Point[],
  endCap: EndCap,
): Trace {
  const points = dedupe(rawPoints);
  const samples: Sample[] = [];
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const segment = Math.hypot(b.x - a.x, b.y - a.y);
    for (let s = 0; s < segment; s += SAMPLE_STEP) {
      const t = s / segment;
      samples.push({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        s: length + s,
      });
    }
    length += segment;
  }
  const end = points[points.length - 1];
  samples.push({ x: end.x, y: end.y, s: length });
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  return { id, role, sink, points, end, endCap, d, length, samples };
}

// Builds the board for the measured layout: side by side (wide) or stacked (narrow).
export function buildCircuit(anchors: Anchors): Circuit {
  const { width: w, height: h, cpu, column, hire, card } = anchors;
  const traces: Trace[] = [];
  const add = (
    role: TraceRole,
    sink: Trace["sink"],
    points: Point[],
    endCap: EndCap,
  ) => traces.push(makeTrace(`t${traces.length}`, role, sink, points, endCap));

  const ring = cpu.r + 3; // traces start just outside the portrait frame
  const sideBySide = column === null || column.left > cpu.x + cpu.r;

  if (sideBySide) {
    // Bus: CPU → profile column (5 lines, out of the CPU's right side).
    if (column) {
      const targetY = column.top + (column.bottom - column.top) * 0.3;
      for (let i = -2; i <= 2; i++) {
        const o = i * BUS_SPACING;
        const a = pt(cpu.x + Math.sqrt(ring * ring - o * o), cpu.y + o);
        add(
          "bus",
          "cpu",
          diagonalThenStraight(a, pt(column.left - 14, targetY + o)),
          "pin",
        );
      }
    }

    // Bus: CPU → Hire me (3 lines, out of the lower right).
    if (hire) {
      const midY = (hire.top + hire.bottom) / 2;
      for (let i = 0; i < 3; i++) {
        const a = onCircle(cpu, 38 + i * 9, 3);
        const b = pt(hire.left - 12, midY + (i - 1) * BUS_SPACING);
        add("bus", "cpu", diagonalThenStraight(a, b), "pin");
      }
    }

    // The card sits in the same row on wide screens, or wraps below on medium ones.
    const cardInRow = card !== null && card.top < cpu.y;

    // Bus: CPU → skill card. Same row: along the bottom edge and up into the card
    // (nested U). Wrapped below: straight down into the card's top edge.
    if (card && cardInRow) {
      for (let i = 0; i < 3; i++) {
        const a = onCircle(cpu, 78 + i * 9, 3);
        const laneY = h - 10 - (2 - i) * 8;
        const endX = card.left + 28 + i * 14;
        if (laneY < card.bottom + 22) break; // no room under the card
        add(
          "bus",
          "cpu",
          chamfer(
            [a, pt(a.x, laneY), pt(endX, laneY), pt(endX, card.bottom + 10)],
            CHAMFER,
          ),
          "pin",
        );
      }
    } else if (card) {
      for (let i = 0; i < 3; i++) {
        const a = onCircle(cpu, 78 + i * 9, 3);
        const b = pt(card.left + 28 + (2 - i) * 14, card.top - 10);
        add("bus", "cpu", diagonalThenStraight(a, b), "pin");
      }
    }

    // Inputs into the CPU from the left edge (alternating vias and edge runs).
    for (let i = 0; i < 5; i++) {
      const a = onCircle(cpu, 160 + i * 10, 3);
      const y = cpu.y + (2 - i) * 30;
      const toVia = i % 2 === 1;
      add(
        "input",
        "cpu",
        leadThenRoute(a, pt(-14, 0), pt(toVia ? 18 : -2, y)),
        toVia ? "via" : "none",
      );
    }

    // Inputs from the top edge.
    for (let i = 0; i < 3; i++) {
      const a = onCircle(cpu, 250 + i * 20, 3);
      add(
        "input",
        "cpu",
        leadThenRoute(a, pt(0, -10), pt(cpu.x + (i - 1) * 46, -2)),
        "none",
      );
    }

    // Inputs from the bottom-left.
    for (let i = 0; i < 2; i++) {
      const a = onCircle(cpu, 125 + i * 15, 3);
      add(
        "input",
        "cpu",
        leadThenRoute(a, pt(-8, 8), pt(cpu.x - 70 - i * 46, h + 2)),
        "none",
      );
    }

    // The skill card's own inputs: from the right edge, and from the top edge when
    // nothing sits above the card.
    if (card) {
      for (let i = 0; i < 3; i++) {
        const a = pt(card.right + 6, card.top + 40 + i * 16);
        const toVia = i === 1;
        const b = pt(toVia ? w - 18 : w + 2, a.y + (i - 1) * 22);
        add(
          "input",
          "component",
          leadThenRoute(a, pt(16, 0), b),
          toVia ? "via" : "none",
        );
      }
      for (let i = 0; cardInRow && i < 2; i++) {
        const a = pt(card.left + 48 + i * 18, card.top - 6);
        add(
          "input",
          "component",
          leadThenRoute(a, pt(0, -8), pt(a.x + 36 + i * 18, -2)),
          "none",
        );
      }
    }
  } else {
    // Stacked (narrow screens): column below the CPU, card below the column.
    if (column) {
      for (let i = -2; i <= 2; i++) {
        const o = i * BUS_SPACING;
        const a = pt(cpu.x + o, cpu.y + Math.sqrt(ring * ring - o * o));
        add("bus", "cpu", [a, pt(cpu.x + o, column.top - 12)], "pin");
      }
    }

    // Hire me: down the left edge, then in from the side (when there is room).
    if (hire) {
      const midY = (hire.top + hire.bottom) / 2;
      for (let i = 0; i < 2; i++) {
        const lane = 8 + i * 8;
        if (hire.left - 12 < lane + 12) break;
        const a = onCircle(cpu, 160 - i * 10, 3);
        const endY = midY + (i === 0 ? 5 : -5);
        add(
          "bus",
          "cpu",
          chamfer(
            [a, pt(lane, a.y), pt(lane, endY), pt(hire.left - 12, endY)],
            CHAMFER,
          ),
          "pin",
        );
      }
    }

    // Skill card: down the right edge, then in from the side (when there is room).
    if (card) {
      for (let i = 0; i < 2; i++) {
        const lane = w - 8 - i * 8;
        if (card.right + 12 > lane - 12) break;
        const a = onCircle(cpu, 20 - i * 10, 3);
        const endY = card.top + 30 + (i === 0 ? 5 : -5);
        add(
          "bus",
          "cpu",
          chamfer(
            [a, pt(lane, a.y), pt(lane, endY), pt(card.right + 12, endY)],
            CHAMFER,
          ),
          "pin",
        );
      }
    }

    // Inputs from the top edge and short fans to the sides.
    for (let i = 0; i < 3; i++) {
      const a = onCircle(cpu, 250 + i * 20, 3);
      add(
        "input",
        "cpu",
        leadThenRoute(a, pt(0, -8), pt(cpu.x + (i - 1) * 40, -2)),
        "none",
      );
    }
    for (const side of [-1, 1]) {
      const a = onCircle(cpu, side < 0 ? 190 : 350, 3);
      add(
        "input",
        "cpu",
        leadThenRoute(a, pt(side * 8, 0), pt(side < 0 ? 16 : w - 16, a.y - 24)),
        "via",
      );
    }
  }

  return { width: w, height: h, cpu, traces };
}
