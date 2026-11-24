import { useEffect, useLayoutEffect, useRef, type KeyboardEvent } from "react";
import type { OriginMilestone } from "../../../../../content/introduction";
import { easeInOut } from "../../../Story/storyTiming";
import IntroductionOriginJet from "./IntroductionOriginJet/IntroductionOriginJet";
import IntroductionOriginWaypoint from "./IntroductionOriginWaypoint/IntroductionOriginWaypoint";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  WAYPOINTS,
  flightPathFor,
  lengthsAlong,
} from "./flightPath";
import styles from "./IntroductionOriginMap.module.scss";

// How far above the route the jet flies, in screen pixels (clear of the 44px markers at
// any map size).
const JET_ALTITUDE = 38;

interface IntroductionOriginMapProps {
  milestones: readonly OriginMilestone[];
  selected: number;
  tabIdFor: (index: number) => string;
  panelId: string;
  waypointsLabel: string;
  numberFor: (index: number) => string;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
}

// The flight map: a flight path through one waypoint per milestone, and the jet. The
// waypoints are tabs (arrow keys, Home and End move between them). Choosing one flies
// the jet along the path to it, leaving the flown stretch lit; with reduced motion the
// jet is simply there. The map is a picture, so it is not mirrored in right-to-left.
function IntroductionOriginMap({
  milestones,
  selected,
  tabIdFor,
  panelId,
  waypointsLabel,
  numberFor,
  reducedMotion,
  onSelect,
}: IntroductionOriginMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const jetRef = useRef<SVGGElement>(null);
  const lengths = useRef<number[]>([]);
  const position = useRef<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const points = WAYPOINTS.slice(0, milestones.length);
  const d = flightPathFor(points.length);

  // Puts the jet at a distance along the path, facing its direction of travel.
  function place(length: number, backward: boolean) {
    const path = pathRef.current;
    const jet = jetRef.current;
    const map = mapRef.current;
    if (!path || !jet || !map) return;
    const total = path.getTotalLength();
    const here = path.getPointAtLength(length);
    const ahead = path.getPointAtLength(Math.min(total, length + 2));
    const behind = path.getPointAtLength(Math.max(0, length - 2));
    const [from, to] = backward ? [here, behind] : [behind, ahead];
    const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
    // Flies just above the route, clear of the waypoint markers.
    const altitude = JET_ALTITUDE / (map.clientWidth / MAP_WIDTH || 1);
    jet.setAttribute(
      "transform",
      `translate(${here.x} ${here.y - altitude}) rotate(${angle})`,
    );
    map.style.setProperty("--flown", (length / total).toFixed(4));
    position.current = length;
  }

  // Measure where each waypoint sits along the path, and park the jet.
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    lengths.current = lengthsAlong(path, points);
    place(lengths.current[selected] ?? 0, false);
    // Only on first layout; later moves are flights.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to the chosen waypoint.
  useEffect(() => {
    const target = lengths.current[selected];
    const from = position.current;
    if (target === undefined || from === null) return;
    if (reducedMotion || from === target) {
      place(target, false);
      return;
    }
    const backward = target < from;
    const duration = Math.min(1800, Math.max(700, Math.abs(target - from) * 2));
    let start = 0;
    let frame = requestAnimationFrame(function step(now) {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      place(from + (target - from) * easeInOut(progress), backward);
      if (progress < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
    // place only touches refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, reducedMotion]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = milestones.length - 1;
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
    <div ref={mapRef} className={styles.map}>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        aria-hidden="true"
      >
        <path className={styles.grid} d={gridPath()} />
        <path ref={pathRef} className={styles.route} d={d} pathLength={1} />
        <path className={styles.flown} d={d} pathLength={1} />
        <IntroductionOriginJet jetRef={jetRef} />
      </svg>
      <div
        className={styles.waypoints}
        role="tablist"
        aria-label={waypointsLabel}
      >
        {milestones.map((milestone, index) => (
          <IntroductionOriginWaypoint
            key={milestone.title}
            id={tabIdFor(index)}
            number={numberFor(index)}
            title={milestone.title}
            selected={index === selected}
            visited={index <= selected}
            at={index / Math.max(1, milestones.length - 1)}
            x={(points[index].x / MAP_WIDTH) * 100}
            y={(points[index].y / MAP_HEIGHT) * 100}
            panelId={panelId}
            buttonRef={(element) => {
              tabRefs.current[index] = element;
            }}
            onSelect={() => onSelect(index)}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>
    </div>
  );
}

// A faint chart grid: every 40 units.
function gridPath(): string {
  let d = "";
  for (let x = 40; x < MAP_WIDTH; x += 40) d += `M${x} 0V${MAP_HEIGHT}`;
  for (let y = 40; y < MAP_HEIGHT; y += 40) d += `M0 ${y}H${MAP_WIDTH}`;
  return d;
}

export default IntroductionOriginMap;
