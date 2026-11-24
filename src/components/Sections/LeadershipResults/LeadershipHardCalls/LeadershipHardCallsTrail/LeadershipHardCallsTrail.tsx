import { useEffect, useRef } from "react";
import styles from "./LeadershipHardCallsTrail.module.scss";

// The drawing, in its view box (300 × 240): a mountain, the trail switchbacking up it
// past the storm and the call to the summit, and the sun waiting behind the ridge.
const MOUNTAIN = "0,240 120,120 160,140 210,45 300,170 300,240";
const TRAIL_POINTS: readonly [number, number][] = [
  [30, 232],
  [95, 205],
  [70, 180],
  [135, 160],
  [120, 135],
  [170, 112],
  [160, 88],
  [210, 50],
];
const SUMMIT = { x: 210, y: 50 };
const WAYPOINTS = [
  { x: 95, y: 205 },
  { x: 120, y: 135 },
];

function trailPath(offsetX: number, offsetY: number): string {
  return TRAIL_POINTS.map(
    ([x, y], index) => `${index ? "L" : "M"}${x - offsetX} ${y - offsetY}`,
  ).join("");
}

const TRAIL = trailPath(0, 0);
// The climber sits at the summit; its climb is the trail relative to there, so it ends
// where it rests.
const CLIMB = trailPath(SUMMIT.x, SUMMIT.y);

// A storm cloud: overlapping puffs around a center.
function Cloud({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={46} ry={20} />
      <ellipse cx={x - 26} cy={y - 8} rx={24} ry={18} />
      <ellipse cx={x + 18} cy={y - 14} rx={28} ry={22} />
    </g>
  );
}

interface LeadershipHardCallsTrailProps {
  climb: number; // one more per story chosen; the climber climbs again
  animate: boolean; // false with reduced motion: the climber waits at the summit
}

// The mountain in its storm. Decorative: the steps beside it tell the story. Clouds
// cover the summit as the part enters and part as the sun breaks through; a climber
// goes up the trail each time a story is chosen.
function LeadershipHardCallsTrail({
  climb,
  animate,
}: LeadershipHardCallsTrailProps) {
  const motion = useRef<SVGAnimateMotionElement>(null);

  useEffect(() => {
    if (climb > 0 && animate) motion.current?.beginElement();
  }, [climb, animate]);

  return (
    <div className={styles.scene} aria-hidden="true">
      <svg className={styles.drawing} viewBox="0 0 300 240">
        <circle className={styles.sun} cx={250} cy={84} r={28} />
        <polygon className={styles.mountain} points={MOUNTAIN} />
        <polygon
          className={styles.snow}
          points="210,45 228,70 216,66 204,74 194,68"
        />
        <path className={styles.trail} d={TRAIL} pathLength={1} />
        {WAYPOINTS.map((point) => (
          <circle
            key={`${point.x}-${point.y}`}
            className={styles.waypoint}
            cx={point.x}
            cy={point.y}
            r={5}
          />
        ))}
        <g className={styles.flag}>
          <path d={`M${SUMMIT.x} ${SUMMIT.y}V${SUMMIT.y - 26}`} />
          <polygon
            points={`${SUMMIT.x},${SUMMIT.y - 26} ${SUMMIT.x + 18},${SUMMIT.y - 20} ${SUMMIT.x},${SUMMIT.y - 14}`}
          />
        </g>
        <circle className={styles.climber} cx={SUMMIT.x} cy={SUMMIT.y} r={6}>
          <animateMotion
            ref={motion}
            begin="indefinite"
            dur="1.4s"
            fill="freeze"
            path={CLIMB}
          />
        </circle>
        <g className={styles.cloudsLeft}>
          <Cloud x={150} y={60} />
          <Cloud x={95} y={100} />
        </g>
        <g className={styles.cloudsRight}>
          <Cloud x={250} y={50} />
          <Cloud x={215} y={110} />
        </g>
      </svg>
    </div>
  );
}

export default LeadershipHardCallsTrail;
