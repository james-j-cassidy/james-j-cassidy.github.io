import { useRef, type KeyboardEvent } from "react";
import type { BeyondWorkItem } from "../../../../../content/introduction";
import IntroductionBeyondWorkStar from "./IntroductionBeyondWorkStar/IntroductionBeyondWorkStar";
import styles from "./IntroductionBeyondWorkConstellation.module.scss";

interface IntroductionBeyondWorkConstellationProps {
  items: readonly BeyondWorkItem[];
  selected: number;
  tabIdFor: (index: number) => string;
  panelId: string;
  label: string;
  onSelect: (index: number) => void;
}

const WIDTH = 600;
const HEIGHT = 340;

// Star positions (in a 600 × 340 map), for up to five items: a constellation shape.
// Each name sits on the open side of its star (above the peaks, below the dips).
const POINTS = [
  { x: 60, y: 250, name: "below" },
  { x: 175, y: 95, name: "above" },
  { x: 300, y: 205, name: "below" },
  { x: 420, y: 70, name: "above" },
  { x: 520, y: 225, name: "below" },
] as const;

// The constellation: the stars joined by lines, a dashed orbit through them. The stars
// are tabs (arrow keys move between them, Home and End jump to the ends). The map is a
// picture, so it is not mirrored in right-to-left.
function IntroductionBeyondWorkConstellation({
  items,
  selected,
  tabIdFor,
  panelId,
  label,
  onSelect,
}: IntroductionBeyondWorkConstellationProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const points = POINTS.slice(0, items.length);
  const last = items.length - 1;
  const lines = points
    .slice(1)
    .map(
      (point, index) =>
        `M${points[index].x} ${points[index].y}L${point.x} ${point.y}`,
    )
    .join("");

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
    <div className={styles.constellation}>
      <svg
        className={styles.lines}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
      >
        <ellipse
          className={styles.orbit}
          cx={WIDTH / 2}
          cy={HEIGHT / 2}
          rx={WIDTH * 0.48}
          ry={HEIGHT * 0.46}
        />
        <path className={styles.links} d={lines} pathLength={1} />
      </svg>
      <div role="tablist" aria-label={label} className={styles.stars}>
        {items.map((item, index) => (
          <IntroductionBeyondWorkStar
            key={item.id}
            id={tabIdFor(index)}
            title={item.title}
            order={index}
            x={(points[index].x / WIDTH) * 100}
            y={(points[index].y / HEIGHT) * 100}
            nameSide={points[index].name}
            selected={index === selected}
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

export default IntroductionBeyondWorkConstellation;
