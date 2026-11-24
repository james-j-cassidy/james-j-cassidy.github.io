import type { CSSProperties, KeyboardEvent, Ref } from "react";
import type { SiteLayer } from "../../../../../../content/introduction";
import styles from "./IntroductionThisSiteLayer.module.scss";

interface IntroductionThisSiteLayerProps {
  layer: SiteLayer;
  number: string;
  level: number; // 0 = bottom of the stack
  lifted: boolean; // above the selected layer: lifts to make room
  id: string;
  panelId: string;
  selected: boolean;
  buttonRef: Ref<HTMLButtonElement>;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

// One layer of the site, as a glowing plate in the isometric stack: a tab (the spec
// sheet is its panel). The selected layer slides out of the stack like a drawer.
function IntroductionThisSiteLayer({
  layer,
  number,
  level,
  lifted,
  id,
  panelId,
  selected,
  buttonRef,
  onSelect,
  onKeyDown,
}: IntroductionThisSiteLayerProps) {
  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="tab"
      className={styles.layer}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      data-lifted={lifted ? "" : undefined}
      style={{ "--level": level } as CSSProperties}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <span className={styles.number}>{number}</span>
      <span className={styles.title}>{layer.title}</span>
    </button>
  );
}

export default IntroductionThisSiteLayer;
