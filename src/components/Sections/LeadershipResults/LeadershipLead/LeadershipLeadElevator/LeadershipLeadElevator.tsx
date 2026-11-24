import type { CSSProperties } from "react";
import styles from "./LeadershipLeadElevator.module.scss";

interface LeadershipLeadElevatorProps {
  floors: number;
  selected: number; // 0-based
  floorId: string; // the floor's idea, for its scene inside the car
  ride: number; // one more per floor chosen; the doors close, the car moves, they open
  goingUp: boolean;
}

// The team: four people side by side at the same height, hands linked. Nobody stands
// higher than anybody else. In the people's view box (200 × 110).
const PEOPLE = [40, 80, 120, 160];

// The glass elevator: a shaft with a beam at each floor and the car carrying the whole
// team. The floor indicator over the doors shows where it is going. Decorative: the
// floor buttons and the card say it in words.
function LeadershipLeadElevator({
  floors,
  selected,
  floorId,
  ride,
  goingUp,
}: LeadershipLeadElevatorProps) {
  return (
    <div
      className={styles.elevator}
      style={{ "--floor": selected + 1 } as CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.shaft}>
        {Array.from({ length: floors }, (_, level) => (
          <div
            key={level}
            className={styles.beam}
            style={{ "--level": level + 1 } as CSSProperties}
          >
            <span className={styles.beamNumber}>{level + 1}</span>
          </div>
        ))}
        <div className={styles.car} data-floor={floorId}>
          <p className={styles.indicator}>
            <span className={styles.arrow}>{goingUp ? "▲" : "▼"}</span>
            {selected + 1}
          </p>
          <div className={styles.window}>
            <svg className={styles.team} viewBox="0 0 200 110">
              {PEOPLE.slice(0, -1).map((x, index) => (
                <path
                  key={`hands-${x}`}
                  className={styles.hands}
                  d={`M${x + 11} 66Q${(x + PEOPLE[index + 1]) / 2} 74 ${PEOPLE[index + 1] - 11} 66`}
                />
              ))}
              {PEOPLE.map((x) => (
                <g key={x} className={styles.person}>
                  <circle cx={x} cy={34} r={9} />
                  <rect x={x - 12} y={46} width={24} height={52} rx={11} />
                </g>
              ))}
              {PEOPLE.slice(0, -1).map((x, index) => (
                <circle
                  key={`spark-${x}`}
                  className={styles.spark}
                  cx={(x + PEOPLE[index + 1]) / 2}
                  cy={71}
                  r={4.5}
                  style={{ "--order": index } as CSSProperties}
                />
              ))}
            </svg>
            <div
              key={ride}
              className={styles.doors}
              data-riding={ride > 0 ? "" : undefined}
            >
              <span className={styles.door} data-side="start" />
              <span className={styles.door} data-side="end" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadershipLeadElevator;
