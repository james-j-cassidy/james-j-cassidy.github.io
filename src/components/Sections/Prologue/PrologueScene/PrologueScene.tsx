import type { CSSProperties, ReactNode } from "react";
import {
  PROLOGUE_BOOT_LINES,
  PROLOGUE_CHIPS,
  type PrologueScene as Scene,
} from "../../../../content/prologues";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";
import styles from "./PrologueScene.module.scss";

interface PrologueSceneProps {
  scene: Scene;
}

// Each tab's opening scene, drawn in its colors on one 480 × 200 canvas. Every scene
// plays on its own loop and holds still with reduced motion. Decorative: the prologue
// hides it from screen readers.
function PrologueScene({ scene }: PrologueSceneProps) {
  const reduced = useReducedMotion();
  return (
    <svg
      className={styles.scene}
      viewBox="0 0 480 200"
      preserveAspectRatio="xMidYMid meet"
    >
      {SCENES[scene](reduced)}
    </svg>
  );
}

const range = (count: number) => Array.from({ length: count }, (_, i) => i);
const order = (n: number) => ({ "--order": n }) as CSSProperties;

// The flight path across the Journey's scene: one stop per job.
const ROUTE = "M30 160 C110 40 190 180 260 100 S400 30 450 70";
const STOPS: readonly [number, number][] = [
  [30, 160],
  [92, 92],
  [158, 118],
  [222, 128],
  [268, 96],
  [330, 60],
  [392, 46],
  [450, 70],
];

const SCENES: Record<Scene, (reduced: boolean) => ReactNode> = {
  // Introduction: a terminal booting James, a line at a time, then a blinking cursor.
  boot: () => (
    <g>
      <rect
        className={styles.panel}
        x={20}
        y={20}
        width={440}
        height={160}
        rx={10}
      />
      <path className={styles.line} d="M20 44 H460" />
      {[40, 56, 72].map((x) => (
        <circle key={x} className={styles.dot} cx={x} cy={32} r={4} />
      ))}
      {PROLOGUE_BOOT_LINES.map((text, line) => (
        <text
          key={text}
          className={styles.type}
          style={order(line)}
          x={40}
          y={74 + line * 28}
        >
          {text}
        </text>
      ))}
      <rect className={styles.cursor} x={112} y={144} width={11} height={18} />
    </g>
  ),

  // Professional Journey: a plane flying the route through every stop, one per job.
  flight: (reduced) => (
    <g>
      <path className={styles.route} d={ROUTE} />
      {STOPS.map(([cx, cy], stop) => (
        <circle
          key={stop}
          className={styles.stop}
          style={order(stop)}
          cx={cx}
          cy={cy}
          r={stop === 0 ? 7 : 5}
        />
      ))}
      <g className={styles.plane}>
        <path d="M-12 0 L10 -2 L14 0 L10 2 Z M-2 -1 L-8 -10 L-4 -10 L4 -1 Z M-2 1 L-8 10 L-4 10 L4 1 Z M-12 0 L-14 -5 L-11 -5 L-8 -1 Z" />
        {!reduced && (
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            rotate="auto"
            path={ROUTE}
          />
        )}
      </g>
      {reduced && (
        <g transform="translate(30 160) rotate(-55)" className={styles.plane}>
          <path d="M-12 0 L10 -2 L14 0 L10 2 Z M-2 -1 L-8 -10 L-4 -10 L4 -1 Z M-2 1 L-8 10 L-4 10 L4 1 Z" />
        </g>
      )}
    </g>
  ),

  // Architecture Expertise: a system drawing itself on blueprint paper, boxes first,
  // then the lines between them.
  blueprint: () => (
    <g>
      {range(13).map((col) => (
        <path
          key={`c${col}`}
          className={styles.grid}
          d={`M${col * 40} 0 V200`}
        />
      ))}
      {range(6).map((row) => (
        <path
          key={`r${row}`}
          className={styles.grid}
          d={`M0 ${row * 40} H480`}
        />
      ))}
      {[
        [40, 80, 80, 44],
        [190, 30, 100, 44],
        [190, 126, 100, 44],
        [350, 80, 90, 44],
      ].map(([x, y, w, h], box) => (
        <rect
          key={box}
          className={styles.draw}
          style={order(box)}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={6}
          pathLength={1}
        />
      ))}
      {[
        "M120 102 C150 102 160 52 190 52",
        "M120 102 C150 102 160 148 190 148",
        "M290 52 C320 52 320 102 350 102",
        "M290 148 C320 148 320 102 350 102",
      ].map((d, link) => (
        <path
          key={d}
          className={styles.draw}
          style={order(4 + link)}
          d={d}
          pathLength={1}
        />
      ))}
    </g>
  ),

  // Tech Stack: every technology and tool riding a conveyor belt past the bay.
  conveyor: () => (
    <g>
      {/* Rails and rollers run past the canvas: on wide bands the scene is wider. */}
      <path className={styles.line} d="M-480 150 H960 M-480 186 H960" />
      {range(37).map((roller) => (
        <circle
          key={roller}
          className={styles.roller}
          cx={-460 + roller * 40}
          cy={168}
          r={14}
        />
      ))}
      <g className={styles.belt}>
        {[...PROLOGUE_CHIPS, ...PROLOGUE_CHIPS].map((chip, index) => (
          <g key={index} transform={`translate(${index * 64} 0)`}>
            <rect
              className={styles.chip}
              x={4}
              y={98}
              width={54}
              height={44}
              rx={8}
            />
            <text className={styles.chipText} x={31} y={126}>
              {chip}
            </text>
          </g>
        ))}
      </g>
    </g>
  ),

  // Featured Projects: a rocket hovering on the pad, flame flickering, ready to launch.
  launch: () => (
    <g>
      {[
        [60, 40],
        [130, 90],
        [370, 30],
        [420, 110],
        [300, 60],
        [90, 140],
      ].map(([x, y], star) => (
        <path
          key={star}
          className={styles.star}
          style={order(star)}
          d={`M${x - 5} ${y} h10 M${x} ${y - 5} v10`}
        />
      ))}
      <path
        className={styles.line}
        d="M150 186 H330 M180 186 L196 168 H284 L300 186"
      />
      <g className={styles.rocket}>
        <path
          className={styles.panel}
          d="M240 30 C262 52 266 92 262 140 H218 C214 92 218 52 240 30 Z"
        />
        <circle className={styles.line} cx={240} cy={82} r={10} />
        <path
          className={styles.line}
          d="M218 120 L200 146 L218 140 M262 120 L280 146 L262 140"
        />
        <path className={styles.flame} d="M226 142 Q240 176 254 142 Z" />
      </g>
    </g>
  ),

  // Leadership & Results: the sun rising over the ridge, its rays turning: first light.
  dawn: () => (
    <g>
      <g className={styles.sunRise}>
        <g className={styles.rays}>
          {range(12).map((ray) => (
            <path
              key={ray}
              className={styles.ray}
              d="M240 60 V20"
              transform={`rotate(${ray * 30} 240 110)`}
            />
          ))}
        </g>
        <circle className={styles.sun} cx={240} cy={110} r={34} />
      </g>
      <path
        className={styles.ridge}
        d="M-480 200 V150 H0 L60 128 L110 146 L170 104 L220 140 L270 116 L330 150 L390 110 L440 136 L480 124 L960 124 V200 Z"
      />
      <path
        className={styles.line}
        d="M-480 150 H0 L60 128 L110 146 L170 104 L220 140 L270 116 L330 150 L390 110 L440 136 L480 124 H960"
      />
    </g>
  ),

  // Contact: a dish sending, its signal spreading in rings and the bars filling.
  signal: () => (
    <g>
      {range(4).map((ring) => (
        <circle
          key={ring}
          className={styles.pulse}
          style={order(ring)}
          cx={150}
          cy={100}
          r={90}
        />
      ))}
      <path className={styles.panel} d="M120 140 Q150 60 190 90 Z" />
      <path
        className={styles.line}
        d="M150 118 L150 170 M128 170 H172 M168 98 L196 76"
      />
      <circle className={styles.dot} cx={198} cy={74} r={5} />
      {range(5).map((bar) => (
        <rect
          key={bar}
          className={styles.bar}
          style={order(bar)}
          x={330 + bar * 22}
          y={150 - (bar + 1) * 18}
          width={14}
          height={(bar + 1) * 18}
          rx={3}
        />
      ))}
    </g>
  ),
};

export default PrologueScene;
