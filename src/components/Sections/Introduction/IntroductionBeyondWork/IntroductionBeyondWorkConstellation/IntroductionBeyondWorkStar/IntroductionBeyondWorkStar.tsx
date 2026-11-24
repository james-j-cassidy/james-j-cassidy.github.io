import type { CSSProperties, KeyboardEvent, Ref } from "react";
import styles from "./IntroductionBeyondWorkStar.module.scss";

interface IntroductionBeyondWorkStarProps {
  id: string;
  title: string; // shown beside the star, and its name
  order: number; // lights up in this order as the map arrives
  x: number; // position on the map, in percent
  y: number;
  nameSide: "above" | "below"; // where the name sits
  selected: boolean;
  panelId: string;
  buttonRef: Ref<HTMLButtonElement>;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

// One star of the constellation: a tab (the discovery card is its panel). A glowing
// four-pointed star with its name; the chosen one flares with rings.
function IntroductionBeyondWorkStar({
  id,
  title,
  order,
  x,
  y,
  nameSide,
  selected,
  panelId,
  buttonRef,
  onSelect,
  onKeyDown,
}: IntroductionBeyondWorkStarProps) {
  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="tab"
      className={styles.star}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      data-name-side={nameSide}
      style={
        { "--x": `${x}%`, "--y": `${y}%`, "--order": order } as CSSProperties
      }
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <span className={styles.glint} aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <path d="M20 2 23 17 38 20 23 23 20 38 17 23 2 20 17 17Z" />
        </svg>
        <span className={styles.ring} />
      </span>
      <span className={styles.name}>{title}</span>
    </button>
  );
}

export default IntroductionBeyondWorkStar;
