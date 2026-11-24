import type { CSSProperties } from "react";
import styles from "./LeadershipTrustNetwork.module.scss";

// Rings of people around the center: how many sit on each ring and its radius, in the
// drawing's units (the view box runs from -100 to 100). 54 seats in all, the largest
// team size.
const RINGS = [
  { seats: 4, radius: 30, turn: 45 },
  { seats: 6, radius: 50, turn: 15 },
  { seats: 18, radius: 70, turn: 5 },
  { seats: 26, radius: 88, turn: 0 },
];

interface Seat {
  x: number;
  y: number;
  ring: number;
  index: number; // overall, center outward
  parent: { x: number; y: number }; // the nearest seat on the ring inside
}

function polar(radius: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
}

// Every seat, with the seat it links back to: each person joins the nearest one on the
// ring inside, the first ring links to the center.
const SEATS: readonly Seat[] = (() => {
  const seats: Seat[] = [];
  let index = 0;
  RINGS.forEach((ring, ringIndex) => {
    for (let n = 0; n < ring.seats; n++) {
      const degrees = (360 / ring.seats) * n + ring.turn - 90;
      const point = polar(ring.radius, degrees);
      let parent = { x: 0, y: 0 };
      if (ringIndex > 0) {
        const inner = seats.filter((seat) => seat.ring === ringIndex - 1);
        parent = inner.reduce((best, seat) =>
          Math.hypot(seat.x - point.x, seat.y - point.y) <
          Math.hypot(best.x - point.x, best.y - point.y)
            ? seat
            : best,
        );
      }
      seats.push({ ...point, ring: ringIndex, index: index++, parent });
    }
  });
  return seats;
})();

interface LeadershipTrustNetworkProps {
  ripple: number; // one more per reason chosen; trust ripples out through the team
  you: string; // the name at the center, read with the drawing hidden
}

// The team as a constellation: James at the center, people on rings around, each linked
// to someone closer in. A ring of trust ripples out from the center through everyone
// when a reason is chosen. Decorative: the reasons beside it say it in words.
function LeadershipTrustNetwork({ ripple, you }: LeadershipTrustNetworkProps) {
  return (
    <div className={styles.network} aria-hidden="true">
      <svg className={styles.drawing} viewBox="-100 -100 200 200">
        {RINGS.map((ring, ringIndex) => (
          <g
            key={ringIndex}
            className={styles.ring}
            style={{ "--ring": ringIndex } as CSSProperties}
          >
            <circle className={styles.orbit} r={ring.radius} />
            {SEATS.filter((seat) => seat.ring === ringIndex).map((seat) => (
              <line
                key={`link-${seat.index}`}
                className={styles.link}
                x1={seat.parent.x}
                y1={seat.parent.y}
                x2={seat.x}
                y2={seat.y}
                data-lit=""
              />
            ))}
            {SEATS.filter((seat) => seat.ring === ringIndex).map((seat) => (
              <circle
                key={`seat-${seat.index}`}
                className={styles.seat}
                cx={seat.x}
                cy={seat.y}
                r={ringIndex < 2 ? 5 : 3.6}
                data-lit=""
                style={{ "--delay": `${seat.index * 14}ms` } as CSSProperties}
              />
            ))}
          </g>
        ))}
        <circle
          key={ripple}
          className={styles.ripple}
          r={96}
          data-rippling={ripple > 0 ? "" : undefined}
        />
        <g className={styles.center}>
          <circle className={styles.core} r={16} />
          <text className={styles.initials} y={5}>
            JC
          </text>
        </g>
      </svg>
      <span className={styles.visuallyHidden}>{you}</span>
    </div>
  );
}

export default LeadershipTrustNetwork;
