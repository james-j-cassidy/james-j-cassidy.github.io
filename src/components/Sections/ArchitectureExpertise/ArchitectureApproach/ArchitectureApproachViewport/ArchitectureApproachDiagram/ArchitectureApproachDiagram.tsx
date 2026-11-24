import type { JSX } from "react";
import type { DesignStage } from "../../../../../../content/architectureExpertise";
import styles from "./ArchitectureApproachDiagram.module.scss";

interface ArchitectureApproachDiagramProps {
  stage: DesignStage["id"];
  drawn: boolean; // chosen by the visitor: the drawing draws itself in
}

// A table in an ERD: a name band, then one row per column.
function Entity({
  x,
  y,
  width,
  name,
  rows,
}: {
  x: number;
  y: number;
  width: number;
  name: string;
  rows: readonly string[];
}) {
  const height = 26 + rows.length * 20;
  return (
    <g>
      <rect
        className={styles.box}
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        pathLength={1}
      />
      <path
        className={styles.line}
        d={`M${x} ${y + 26}H${x + width}`}
        pathLength={1}
      />
      <text className={styles.label} x={x + width / 2} y={y + 18}>
        {name}
      </text>
      {rows.map((row, index) => (
        <text
          key={row}
          className={styles.row}
          x={x + 8}
          y={y + 41 + index * 20}
        >
          {row}
        </text>
      ))}
    </g>
  );
}

// A half-circle gauge with its reading as a lit arc and a needle.
function Gauge({
  cx,
  value,
  name,
  target,
}: {
  cx: number;
  value: number; // 0 to 1
  name: string;
  target: string;
}) {
  const cy = 98;
  const r = 48;
  const angle = Math.PI * (1 - value);
  const end = { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
  const needle = {
    x: cx + (r - 14) * Math.cos(angle),
    y: cy - (r - 14) * Math.sin(angle),
  };
  return (
    <g>
      <path
        className={styles.track}
        d={`M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}`}
      />
      <path
        className={styles.timebox}
        d={`M${cx - r} ${cy}A${r} ${r} 0 0 1 ${end.x} ${end.y}`}
        pathLength={1}
      />
      <path className={styles.pop} d={`M${cx} ${cy}L${needle.x} ${needle.y}`} />
      <text className={styles.label} x={cx} y={cy + 30}>
        {name}
      </text>
      <text className={styles.small} x={cx} y={cy + 50}>
        {target}
      </text>
    </g>
  );
}

// Discover: a user, the inputs going in, the system, and the expected results coming out.
function Discover() {
  return (
    <>
      <circle className={styles.line} cx={45} cy={52} r={12} pathLength={1} />
      <path
        className={styles.line}
        d="M45 64V104M45 76L25 92M45 76L65 92M45 104L30 132M45 104L60 132"
        pathLength={1}
      />
      <text className={styles.label} x={45} y={156}>
        User
      </text>
      <path className={styles.line} d="M80 72H146M80 102H146" pathLength={1} />
      <path
        className={styles.pop}
        d="M138 66L148 72L138 78M138 96L148 102L138 108"
      />
      <text className={styles.label} x={113} y={60}>
        Inputs
      </text>
      <rect
        className={styles.box}
        x={152}
        y={40}
        width={104}
        height={94}
        rx={8}
        pathLength={1}
      />
      <text className={styles.label} x={204} y={92}>
        System
      </text>
      <path
        className={styles.line}
        d="M260 72H316M260 102H316"
        pathLength={1}
      />
      <path
        className={styles.pop}
        d="M308 66L318 72L308 78M308 96L318 102L308 108"
      />
      <path
        className={styles.box}
        d="M324 44H360L376 60V130H324Z"
        pathLength={1}
      />
      <path
        className={styles.line}
        d="M334 76H366M334 90H366M334 104H356"
        pathLength={1}
      />
      <text className={styles.label} x={350} y={156}>
        Results
      </text>
    </>
  );
}

// Quality goals: three gauges, each with a measurable target.
function Quality() {
  return (
    <>
      <Gauge cx={70} value={0.8} name="Speed" target="< 200 ms" />
      <Gauge cx={200} value={0.92} name="Uptime" target="99.9%" />
      <Gauge cx={330} value={0.6} name="Cost" target="On budget" />
    </>
  );
}

// Model just enough: a small sequence diagram beside a small ERD.
function Model() {
  return (
    <>
      {[
        { x: 10, name: "API" },
        { x: 110, name: "Store" },
      ].map((head) => (
        <g key={head.name}>
          <rect
            className={styles.box}
            x={head.x}
            y={10}
            width={76}
            height={28}
            rx={4}
            pathLength={1}
          />
          <text className={styles.label} x={head.x + 38} y={29}>
            {head.name}
          </text>
        </g>
      ))}
      <path className={styles.lifeline} d="M48 38V162M148 38V162" />
      <path className={styles.line} d="M48 70H142" pathLength={1} />
      <path className={styles.pop} d="M134 64L144 70L134 76" />
      <path className={styles.reply} d="M148 120H54" />
      <path className={styles.pop} d="M62 114L52 120L62 126" />
      <text className={styles.small} x={98} y={62}>
        query
      </text>
      <text className={styles.small} x={98} y={112}>
        rows
      </text>
      <path className={styles.divider} d="M200 14V160" />
      <Entity
        x={216}
        y={26}
        width={78}
        name="Order"
        rows={["id PK", "placed"]}
      />
      <Entity
        x={316}
        y={26}
        width={78}
        name="Line"
        rows={["id PK", "order FK", "item"]}
      />
      <path className={styles.line} d="M294 62H316" pathLength={1} />
      <path className={styles.pop} d="M300 54V70M306 62L316 54M306 62L316 70" />
    </>
  );
}

// Decide: a decision record. Three options scored against the quality goals; the
// chosen one is ticked.
function Decide() {
  const options = [
    { name: "Option A", score: 120, chosen: false },
    { name: "Option B", score: 190, chosen: true },
    { name: "Option C", score: 90, chosen: false },
  ];
  return (
    <>
      <rect
        className={styles.box}
        x={14}
        y={8}
        width={372}
        height={154}
        rx={6}
        pathLength={1}
      />
      <path className={styles.line} d="M14 40H386" pathLength={1} />
      <text className={styles.start} x={30} y={30}>
        ADR · Accepted
      </text>
      {options.map((option, index) => {
        const y = 66 + index * 34;
        return (
          <g key={option.name}>
            <rect
              className={option.chosen ? styles.barLit : styles.bar}
              x={30}
              y={y - 12}
              width={16}
              height={16}
              rx={3}
            />
            {option.chosen && (
              <path className={styles.tick} d={`M33 ${y - 4}l4 4l7 -8`} />
            )}
            <text className={styles.start} x={56} y={y + 1}>
              {option.name}
            </text>
            <rect
              className={option.chosen ? styles.barLit : styles.bar}
              x={160}
              y={y - 10}
              width={option.score}
              height={12}
            />
          </g>
        );
      })}
    </>
  );
}

// Spike: a time box, and two options tried inside it; one proves out.
function Spike() {
  return (
    <>
      <circle className={styles.box} cx={70} cy={84} r={52} pathLength={1} />
      <path
        className={styles.timebox}
        d="M70 40A44 44 0 0 1 108 106"
        pathLength={1}
      />
      <path className={styles.pop} d="M70 84V52M70 84L92 96" />
      <text className={styles.label} x={70} y={160}>
        Time box
      </text>
      <text className={styles.start} x={152} y={56}>
        Option A
      </text>
      <rect className={styles.bar} x={152} y={64} width={130} height={18} />
      <text className={styles.verdict} x={300} y={79}>
        ✕
      </text>
      <text className={styles.start} x={152} y={112}>
        Option B
      </text>
      <rect className={styles.barLit} x={152} y={120} width={196} height={18} />
      <text className={styles.verdict} x={366} y={135}>
        ✓
      </text>
    </>
  );
}

// Mock-ups: a desktop screen and a phone screen, sketched as wireframes.
function Mockup() {
  return (
    <>
      <rect
        className={styles.box}
        x={16}
        y={14}
        width={220}
        height={144}
        rx={6}
        pathLength={1}
      />
      <path className={styles.line} d="M16 34H236" pathLength={1} />
      <rect className={styles.block} x={26} y={44} width={44} height={104} />
      <rect className={styles.block} x={80} y={44} width={146} height={40} />
      <rect className={styles.block} x={80} y={92} width={68} height={56} />
      <rect className={styles.block} x={158} y={92} width={68} height={56} />
      <path className={styles.line} d="M242 86H262" pathLength={1} />
      <path className={styles.pop} d="M256 80L266 86L256 92" />
      <rect
        className={styles.box}
        x={272}
        y={8}
        width={96}
        height={156}
        rx={14}
        pathLength={1}
      />
      <rect className={styles.block} x={282} y={28} width={76} height={34} />
      <rect className={styles.block} x={282} y={70} width={76} height={12} />
      <rect className={styles.block} x={282} y={88} width={54} height={12} />
      <rect className={styles.barLit} x={282} y={134} width={76} height={18} />
    </>
  );
}

const DRAWINGS = {
  discover: Discover,
  quality: Quality,
  model: Model,
  decide: Decide,
  spike: Spike,
  mockup: Mockup,
} satisfies Record<DesignStage["id"], () => JSX.Element>;

// A small drawing of what the stage produces. Decorative: the viewport's words say it.
function ArchitectureApproachDiagram({
  stage,
  drawn,
}: ArchitectureApproachDiagramProps) {
  const Drawing = DRAWINGS[stage];
  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 400 170"
      aria-hidden="true"
      data-drawn={drawn ? "" : undefined}
    >
      <Drawing />
    </svg>
  );
}

export default ArchitectureApproachDiagram;
