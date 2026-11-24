import { useRef, type KeyboardEvent } from "react";
import type { SiteLayer } from "../../../../../content/introduction";
import IntroductionThisSiteLayer from "./IntroductionThisSiteLayer/IntroductionThisSiteLayer";
import styles from "./IntroductionThisSiteStack.module.scss";

interface IntroductionThisSiteStackProps {
  layers: readonly SiteLayer[]; // bottom first
  selected: number;
  scan: number; // one more per theme switch; sends a scan beam up through the stack
  tabIdFor: (index: number) => string;
  panelId: string;
  label: string;
  numberFor: (index: number) => string;
  onSelect: (index: number) => void;
}

// The site as an exploded isometric stack of glowing layers, bottom (build) to top
// (content). The layers are tabs: arrow keys move up and down the stack, Home and End
// jump to the ends. The stack is drawn in parallel projection (no perspective), like a
// technical drawing.
function IntroductionThisSiteStack({
  layers,
  selected,
  scan,
  tabIdFor,
  panelId,
  label,
  numberFor,
  onSelect,
}: IntroductionThisSiteStackProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = layers.length - 1;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    // Up the stack is up the list visually: ArrowUp moves to the layer above.
    const moves: Record<string, number> = {
      ArrowUp: Math.min(last, selected + 1),
      ArrowRight: Math.min(last, selected + 1),
      ArrowDown: Math.max(0, selected - 1),
      ArrowLeft: Math.max(0, selected - 1),
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
    <div className={styles.stack}>
      <div
        className={styles.platform}
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
      >
        {layers.map((layer, index) => (
          <IntroductionThisSiteLayer
            key={layer.id}
            layer={layer}
            number={numberFor(index)}
            level={index}
            lifted={index > selected}
            id={tabIdFor(index)}
            panelId={panelId}
            selected={index === selected}
            buttonRef={(element) => {
              tabRefs.current[index] = element;
            }}
            onSelect={() => onSelect(index)}
            onKeyDown={handleKeyDown}
          />
        ))}
        <span
          key={scan}
          className={styles.beam}
          data-scan={scan > 0 ? "" : undefined}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default IntroductionThisSiteStack;
