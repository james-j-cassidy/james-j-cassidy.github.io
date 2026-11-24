import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { TrustTrait } from "../../../../../content/leadershipResults";
import styles from "./LeadershipTrustTree.module.scss";

// The drawing's canvas: 200 wide, 224 tall; the ground runs at y = 150.
const WIDTH = 200;
const HEIGHT = 224;

// Each part of the tree, by level: 0 roots (drawn toward the trunk, as trust rises
// from them), 1 the trunk, 2 the first fork, 3 the branches out to the tips.
const LIMBS: readonly { level: number; d: string }[] = [
  { level: 0, d: "M40 206 Q58 196 64 186 Q86 170 100 150" },
  { level: 0, d: "M96 214 Q102 182 100 150" },
  { level: 0, d: "M162 204 Q148 194 138 182 Q116 168 100 150" },
  { level: 0, d: "M66 200 Q76 190 80 178" },
  { level: 0, d: "M130 202 Q132 188 124 172" },
  { level: 1, d: "M100 150 C98 136 102 120 100 108" },
  { level: 2, d: "M100 108 Q86 96 72 82" },
  { level: 2, d: "M100 108 Q114 96 128 82" },
  { level: 3, d: "M72 82 Q46 80 24 62" },
  { level: 3, d: "M72 82 Q54 60 46 34" },
  { level: 3, d: "M72 82 Q80 56 78 28" },
  { level: 3, d: "M128 82 Q118 48 120 8" },
  { level: 3, d: "M128 82 Q146 60 154 34" },
  { level: 3, d: "M128 82 Q154 80 176 62" },
];

// Where each trait sits: the branch tips, left to right.
const TIPS: readonly [number, number][] = [
  [24, 62],
  [46, 34],
  [78, 28],
  [120, 8],
  [154, 34],
  [176, 62],
];

interface LeadershipTrustTreeProps {
  traits: readonly TrustTrait[]; // one per branch tip, left to right
  label: string; // names the group of branches
  hint: string; // says what the branches do
  root: string; // the word at the root
  flow: number; // one more per reason chosen; trust flows up from the root
}

// Trust as a tree: it starts at the root, under the ground, and grows up through the
// trunk into branches. Each branch tip is a button; choosing one opens a tip naming a
// trait that grows trust (a toggletip: the words are announced as they appear; Escape,
// a click elsewhere or the same branch again closes it). Choosing a reason beside the
// tree sends trust flowing up from the root to every tip.
//
// Scroll (from the part): the roots grow first, then the trunk, the fork and the
// branches, and the tips bud last (--net-in); leaving, it withdraws from the tips down
// (--net-out).
function LeadershipTrustTree({
  traits,
  label,
  hint,
  root,
  flow,
}: LeadershipTrustTreeProps) {
  const baseId = useId();
  const tipId = `${baseId}-tip`;
  const hintId = `${baseId}-hint`;
  const [open, setOpen] = useState<number | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  // A click anywhere else closes the tip.
  useEffect(() => {
    if (open === null) return;
    function outside(event: PointerEvent) {
      if (!treeRef.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const place = (index: number) =>
    ({
      "--x": `${(TIPS[index][0] / WIDTH) * 100}%`,
      "--y": `${(TIPS[index][1] / HEIGHT) * 100}%`,
    }) as CSSProperties;

  return (
    <div
      ref={treeRef}
      className={styles.tree}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open !== null) {
          event.stopPropagation();
          setOpen(null);
        }
      }}
    >
      <svg
        className={styles.drawing}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
      >
        <path className={styles.ground} d="M8 150 H192" />
        {LIMBS.map((limb, index) => (
          <path
            key={index}
            className={styles.limb}
            d={limb.d}
            pathLength={1}
            style={{ "--level": limb.level } as CSSProperties}
          />
        ))}
        {/* Trust rising: a glow that runs up every limb, roots first. */}
        <g key={flow} data-flowing={flow > 0 ? "" : undefined}>
          {LIMBS.map((limb, index) => (
            <path
              key={index}
              className={styles.flow}
              d={limb.d}
              pathLength={1}
              style={{ "--level": limb.level } as CSSProperties}
            />
          ))}
        </g>
        <g className={styles.root}>
          <circle className={styles.seed} cx={100} cy={166} r={9} />
          <text className={styles.rootWord} x={100} y={222}>
            {root}
          </text>
        </g>
      </svg>

      <div className={styles.tips} role="group" aria-label={label}>
        {traits.slice(0, TIPS.length).map((trait, index) => (
          <button
            key={trait.id}
            type="button"
            className={styles.tip}
            style={place(index)}
            aria-expanded={open === index}
            aria-controls={tipId}
            aria-describedby={hintId}
            data-side={index < 2 ? "start" : index > 3 ? "end" : undefined}
            onClick={() => setOpen((now) => (now === index ? null : index))}
          >
            <span className={styles.bud} aria-hidden="true" />
            <span className={styles.name}>{trait.name}</span>
          </button>
        ))}
      </div>

      {/* The tip: always present (empty while closed, and then not drawn) so its words
          are announced when they appear. */}
      <div
        id={tipId}
        className={styles.bubble}
        role="status"
        style={open === null ? undefined : place(open)}
        data-side={
          open === null
            ? undefined
            : open < 2
              ? "start"
              : open > 3
                ? "end"
                : undefined
        }
      >
        {open !== null && (
          <>
            <strong className={styles.bubbleName}>{traits[open].name}</strong>
            <span>{traits[open].line}</span>
          </>
        )}
      </div>

      <p id={hintId} className={styles.hint}>
        {hint}
      </p>
    </div>
  );
}

export default LeadershipTrustTree;
