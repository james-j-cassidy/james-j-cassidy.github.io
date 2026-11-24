import type { ReactNode } from "react";
import type { JobScene } from "../../../../../content/professionalJourney";
import styles from "./JobPartScene.module.scss";

interface JobPartSceneProps {
  scene: JobScene;
}

// A job's scene: a panorama of the employer's world along the foot of the stage, drawn
// in the job's accent, where the cards leave the stage open. Every scene shares one wide
// 1600 × 240 canvas with its ground at the bottom; on short stages the top is cropped,
// so the most telling shapes sit low. Decorative: the backdrop that holds it is hidden
// from screen readers.
function JobPartScene({ scene }: JobPartSceneProps) {
  return (
    <svg
      className={styles.scene}
      viewBox="0 0 1600 240"
      preserveAspectRatio="xMidYMax slice"
    >
      {SCENES[scene]()}
    </svg>
  );
}

const GROUND = 236;

// ── Shapes the scenes share ──────────────────────────────────────────────────────────

function range(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index);
}

function point(cx: number, cy: number, r: number, angle: number): string {
  return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
}

// A regular polygon's points, centered at (cx, cy).
function polygon(cx: number, cy: number, r: number, sides: number, turn = 0) {
  return range(sides)
    .map((side) => point(cx, cy, r, turn + (side / sides) * Math.PI * 2))
    .join(" ");
}

// A gear outline: teeth around a ring.
function gear(cx: number, cy: number, r: number, teeth: number) {
  return range(teeth * 4)
    .map((step) =>
      point(
        cx,
        cy,
        step % 4 < 2 ? r : r * 0.82,
        (step / (teeth * 4)) * Math.PI * 2,
      ),
    )
    .join(" ");
}

function Envelope({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 0.62;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} />
      <path d={`M${x} ${y} L${x + w / 2} ${y + h * 0.55} L${x + w} ${y}`} />
    </g>
  );
}

function Doc({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 1.3;
  return (
    <g>
      <path
        d={`M${x} ${y} h${w * 0.72} l${w * 0.28} ${w * 0.28} V${y + h} H${x} Z M${x + w * 0.72} ${y} v${w * 0.28} h${w * 0.28}`}
      />
      {range(3).map((line) => (
        <path
          key={line}
          className={styles.thin}
          d={`M${x + w * 0.16} ${y + h * (0.45 + line * 0.17)} h${w * (line === 2 ? 0.4 : 0.68)}`}
        />
      ))}
    </g>
  );
}

function Pin({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path
        d={`M${x} ${y} c-10 -13 -15 -19 -15 -27 a15 15 0 0 1 30 0 c0 8 -5 14 -15 27 Z`}
      />
      <circle cx={x} cy={y - 27} r={5} />
    </g>
  );
}

function House({ x, w }: { x: number; w: number }) {
  const h = w * 0.62;
  const base = GROUND;
  return (
    <g>
      <path
        d={`M${x} ${base} V${base - h} L${x + w / 2} ${base - h - w * 0.4} L${x + w} ${base - h} V${base} Z`}
      />
      <path
        className={styles.thin}
        d={`M${x + w * 0.42} ${base} v${-h * 0.55} h${w * 0.16} v${h * 0.55}`}
      />
      <rect
        className={styles.thin}
        x={x + w * 0.12}
        y={base - h * 0.82}
        width={w * 0.18}
        height={w * 0.16}
      />
      <rect
        className={styles.thin}
        x={x + w * 0.7}
        y={base - h * 0.82}
        width={w * 0.18}
        height={w * 0.16}
      />
    </g>
  );
}

function Tree({ x, h }: { x: number; h: number }) {
  return (
    <g>
      <path d={`M${x} ${GROUND} v${-h * 0.4}`} />
      <ellipse cx={x} cy={GROUND - h * 0.68} rx={h * 0.22} ry={h * 0.32} />
    </g>
  );
}

function Orange({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} />
      <path d={`M${x} ${y - r} c3 -6 8 -8 13 -6 c-3 5 -8 6 -13 6`} />
    </g>
  );
}

function Slice({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} />
      <circle className={styles.thin} cx={x} cy={y} r={r * 0.86} />
      {range(10).map((segment) => {
        const [px, py] = point(x, y, r * 0.84, (segment / 10) * Math.PI * 2)
          .split(",")
          .map(Number);
        return (
          <path
            key={segment}
            className={styles.thin}
            d={`M${x} ${y} L${px} ${py}`}
          />
        );
      })}
    </g>
  );
}

function Sprig({ x, h, turn }: { x: number; h: number; turn: number }) {
  const leaves = Math.max(2, Math.round(h / 40));
  return (
    <g transform={`translate(${x} ${GROUND}) rotate(${turn})`}>
      <path d={`M0 0 C6 ${-h * 0.35} 4 ${-h * 0.7} 0 ${-h}`} />
      {range(leaves).map((leaf) => {
        const y = -h * (0.25 + (leaf / leaves) * 0.7);
        return (
          <g key={leaf}>
            <ellipse
              cx={-12}
              cy={y}
              rx={13}
              ry={6}
              transform={`rotate(-35 -12 ${y})`}
            />
            <ellipse
              cx={12}
              cy={y - 12}
              rx={13}
              ry={6}
              transform={`rotate(35 12 ${y - 12})`}
            />
          </g>
        );
      })}
    </g>
  );
}

function Capsule({ x, y, turn }: { x: number; y: number; turn: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn})`}>
      <rect x={-24} y={-10} width={48} height={20} rx={10} />
      <path d="M0 -10 V10" />
    </g>
  );
}

function Box({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s * 0.9} />
      <path
        className={styles.thin}
        d={`M${x} ${y + s * 0.25} h${s} M${x + s / 2} ${y} v${s * 0.25}`}
      />
    </g>
  );
}

// ── The scenes ───────────────────────────────────────────────────────────────────────

const SCENES: Record<JobScene, () => ReactNode> = {
  // CPT Group: class action notices and claims, by mail and on paper, flowing into a
  // cloud platform of connected services, and on to the next batch.
  claims: () => (
    <g>
      <path d={`M0 ${GROUND} H1600`} />
      {[0, 820].map((offset) => (
        <g key={offset} transform={`translate(${offset} 0)`}>
          <Envelope x={40} y={170} w={90} />
          <Envelope x={70} y={196} w={90} />
          <Doc x={190} y={140} w={64} />
          <Doc x={214} y={160} w={64} />
          {range(3).map((flow) => (
            <path
              key={flow}
              className={styles.dashed}
              d={`M300 ${190 + flow * 14} C 360 ${190 + flow * 14} 380 ${140 + flow * 12} 440 ${140 + flow * 12}`}
            />
          ))}
          <path d="M430 210 a45 45 0 0 1 52 -72 a65 65 0 0 1 124 6 a46 46 0 0 1 30 66 Z" />
          {[
            [500, 175],
            [548, 158],
            [596, 182],
            [540, 200],
          ].map(([cx, cy], node, all) => (
            <g key={node}>
              <polygon points={polygon(cx, cy, 11, 6, Math.PI / 6)} />
              {node > 0 && (
                <path
                  className={styles.thin}
                  d={`M${all[node - 1][0]} ${all[node - 1][1]} L${cx} ${cy}`}
                />
              )}
            </g>
          ))}
          <path
            className={styles.dashed}
            d="M650 190 C 700 190 720 200 780 200"
          />
        </g>
      ))}
    </g>
  ),

  // CoStar Group: a commercial skyline on a map grid, with listing pins.
  skyline: () => (
    <g>
      {range(17).map((line) => (
        <path
          key={line}
          className={styles.thin}
          d={`M${line * 100} 30 V${GROUND}`}
        />
      ))}
      <path d={`M0 ${GROUND} H1600`} />
      {[
        [20, 70, 120],
        [100, 60, 180],
        [170, 90, 140],
        [280, 70, 210],
        [360, 110, 160],
        [490, 60, 190],
        [560, 80, 120],
        [660, 70, 220],
        [740, 100, 150],
        [860, 60, 200],
        [930, 90, 130],
        [1040, 70, 190],
        [1120, 110, 150],
        [1250, 60, 215],
        [1320, 80, 140],
        [1420, 70, 180],
        [1500, 90, 120],
      ].map(([x, w, h], tower) => (
        <g key={tower}>
          <rect x={x} y={GROUND - h} width={w} height={h} />
          {range(Math.floor(h / 26)).map((row) => (
            <path
              key={row}
              className={styles.thin}
              d={`M${x + 8} ${GROUND - h + 14 + row * 26} h${w - 16}`}
            />
          ))}
        </g>
      ))}
      <Pin x={315} y={20} />
      <Pin x={695} y={10} />
      <Pin x={1285} y={16} />
    </g>
  ),

  // ABS Home Mortgage: a street of homes and trees under a rate line, and a house key.
  homes: () => (
    <g>
      <path d={`M0 ${GROUND} H1600`} />
      {[
        [30, 110],
        [180, 140],
        [370, 100],
        [520, 150],
        [720, 110],
        [880, 140],
        [1070, 100],
        [1220, 150],
        [1420, 120],
      ].map(([x, w]) => (
        <House key={x} x={x} w={w} />
      ))}
      {[150, 340, 490, 690, 850, 1040, 1190, 1390].map((x, tree) => (
        <Tree key={x} x={x} h={tree % 2 ? 70 : 90} />
      ))}
      <path
        className={styles.dashed}
        d="M0 70 L200 58 L400 80 L600 48 L800 62 L1000 38 L1200 52 L1400 28 L1600 40"
      />
      {[200, 600, 1000, 1400].map((x, dot) => (
        <circle key={x} cx={x} cy={[58, 48, 38, 28][dot]} r={4} />
      ))}
    </g>
  ),

  // ARI Network Services: a parts catalog laid out along an exploded axis, with numbered
  // callouts, the kind of diagram read by OCR.
  parts: () => (
    <g>
      <path className={styles.dashed} d="M0 170 H1600" />
      {[0, 800].map((offset, set) => (
        <g key={offset} transform={`translate(${offset} 0)`}>
          <polygon points={gear(110, 170, 56, 12)} />
          <circle cx={110} cy={170} r={20} />
          <circle cx={250} cy={170} r={30} />
          <circle cx={250} cy={170} r={13} />
          <polygon points={polygon(360, 170, 26, 6)} />
          <path d="M386 158 H520 M386 182 H520 M402 158 v24 M420 158 v24 M438 158 v24 M456 158 v24 M474 158 v24 M492 158 v24" />
          <path d="M560 150 l9 40 l9 -40 l9 40 l9 -40 l9 40 l9 -40" />
          <polygon points={gear(690, 170, 40, 9)} />
          <circle cx={690} cy={170} r={14} />
          {[110, 250, 360, 450, 590, 690].map((x, callout) => (
            <g key={x}>
              <path className={styles.thin} d={`M${x} 92 V${120}`} />
              <circle cx={x} cy={76} r={16} />
              <text className={styles.callout} x={x} y={82}>
                {set * 6 + callout + 1}
              </text>
            </g>
          ))}
        </g>
      ))}
      <path d={`M0 ${GROUND} H1600`} className={styles.thin} />
    </g>
  ),

  // McLaughlin Research Corporation: a naval engineering blueprint, a vessel in profile
  // on a measured grid, with a scanned bill feeding the system.
  naval: () => (
    <g>
      {range(33).map((line) => (
        <path
          key={line}
          className={styles.thin}
          d={`M${line * 50} 20 V${GROUND}`}
        />
      ))}
      {range(5).map((line) => (
        <path
          key={line}
          className={styles.thin}
          d={`M0 ${30 + line * 46} H1600`}
        />
      ))}
      <path d="M300 186 H1180 L1130 226 H350 Z" />
      <path d="M520 186 V150 H760 V186 M570 150 V118 H700 V150 M630 118 V60 M600 80 H660 M860 186 V160 H980 V186" />
      <path d="M400 186 V174 H440 V186 M1040 186 V174 H1090 V186" />
      <path
        className={styles.thin}
        d="M300 210 v20 M1180 210 v20 M300 222 H1180"
      />
      <path d="M0 232 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 M1240 232 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" />
      <Doc x={1380} y={70} w={70} />
      <path className={styles.dashed} d="M1360 120 H1480" />
      <Doc x={120} y={80} w={60} />
    </g>
  ),

  // Sunkist Growers: oranges riding the sorting line, the weight signal filtered from
  // noise to a clean reading, and a citrus slice.
  citrus: () => (
    <g>
      <path d="M0 200 H1600 M0 236 H1600" />
      {range(20).map((roller) => (
        <circle key={roller} cx={40 + roller * 82} cy={218} r={16} />
      ))}
      {range(12).map((fruit) => (
        <Orange key={fruit} x={70 + fruit * 130} y={176} r={22} />
      ))}
      <path
        className={styles.thin}
        d="M140 60 l10 -24 l10 36 l10 -40 l10 32 l10 -22 l10 28 l10 -34 l10 24 l10 -14"
      />
      <path d="M260 52 C 300 44 340 44 380 46 S 460 48 520 47" />
      <path className={styles.dashed} d="M244 50 h10" />
      <Slice x={1460} y={70} r={60} />
      <path d="M760 200 V120 H880 V200" />
      <path className={styles.thin} d="M780 138 h80 M820 138 v-16" />
    </g>
  ),

  // iHerb: herbs and capsules for natural health, boxes shipping from the warehouse, and
  // the mobile app they were ordered on.
  wellness: () => (
    <g>
      <path d={`M0 ${GROUND} H1600`} />
      {[60, 120, 520, 580, 1010, 1480, 1540].map((x, sprig) => (
        <Sprig
          key={x}
          x={x}
          h={sprig % 2 ? 120 : 160}
          turn={sprig % 2 ? 8 : -6}
        />
      ))}
      {[
        [240, 120, -30],
        [300, 170, 20],
        [380, 110, 60],
        [690, 90, -15],
        [1160, 130, 35],
        [1230, 80, -40],
      ].map(([x, y, turn]) => (
        <Capsule key={x} x={x} y={y} turn={turn} />
      ))}
      {[
        [760, 196],
        [810, 196],
        [860, 196],
        [785, 154],
        [835, 154],
        [810, 112],
      ].map(([x, y]) => (
        <Box key={`${x}-${y}`} x={x} y={y} s={44} />
      ))}
      <rect x={1300} y={40} width={110} height={196} rx={16} />
      <path
        className={styles.thin}
        d="M1340 56 h30 M1318 86 H1392 M1318 110 h60 M1318 134 h44"
      />
      <rect
        className={styles.thin}
        x={1318}
        y={150}
        width={74}
        height={50}
        rx={5}
      />
    </g>
  ),

  // U.S. Air Force: satellites on orbit over the curve of the Earth, the world James's
  // simulators trained space operators for.
  orbit: () => (
    <g>
      <path d="M-100 300 Q800 150 1700 300" />
      <path className={styles.thin} d="M-100 300 Q800 170 1700 300" />
      <path className={styles.dashed} d="M-100 230 Q800 80 1700 230" />
      {[
        [520, 160, -8],
        [1180, 164, 8],
      ].map(([x, y, turn]) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${turn})`}>
          <rect x={-18} y={-13} width={36} height={26} rx={3} />
          <rect x={-76} y={-10} width={52} height={20} />
          <rect x={24} y={-10} width={52} height={20} />
          <path
            className={styles.thin}
            d="M-63 -10 v20 M-50 -10 v20 M-37 -10 v20 M37 -10 v20 M50 -10 v20 M63 -10 v20 M-24 0 h6 M18 0 h6"
          />
          <path d="M0 13 v10 M-8 27 a10 6 0 0 0 16 0" />
        </g>
      ))}
      <path className={styles.dashed} d="M520 187 L560 222" />
      <path className={styles.dashed} d="M1180 191 L1140 224" />
      {[
        [60, 40],
        [180, 90],
        [300, 30],
        [420, 140],
        [700, 50],
        [860, 110],
        [980, 30],
        [1340, 60],
        [1460, 120],
        [1560, 40],
      ].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          className={styles.thin}
          d={`M${x - 6} ${y} h12 M${x} ${y - 6} v12`}
        />
      ))}
    </g>
  ),
};

export default JobPartScene;
