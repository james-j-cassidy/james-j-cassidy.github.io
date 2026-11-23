import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import type { Skill } from "../../../../content/skills";
import SkillIcon from "./SkillIcon";
import styles from "./HeaderSkillWheel.module.scss";

interface HeaderSkillWheelProps {
  skills: readonly Skill[];
  selectedIndex: number;
  turn: number;
  label: string;
  panelId: string;
  tabId: (index: number) => string;
  onSelect: (index: number) => void;
}

// Ring of skill tiles around the portrait. The wheel spins so the selected skill sits
// beside the summary (right of the photo, or left in right-to-left languages).
// It is a tab list: one Tab stop, arrow keys move between skills, and the summary is the tab panel.
function HeaderSkillWheel({
  skills,
  selectedIndex,
  turn,
  label,
  panelId,
  tabId,
  onSelect,
}: HeaderSkillWheelProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = skills.length;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const keyToTarget: Record<string, number> = {
      ArrowRight: selectedIndex + 1,
      ArrowDown: selectedIndex + 1,
      ArrowLeft: selectedIndex - 1,
      ArrowUp: selectedIndex - 1,
      Home: 0,
      End: count - 1,
    };
    const raw = keyToTarget[event.key];
    if (raw === undefined) return;
    event.preventDefault();
    const target = (raw + count) % count;
    onSelect(target);
    tabRefs.current[target]?.focus();
  }

  const wheelStyle = {
    "--turn": turn,
    "--step": `${360 / count}deg`,
  } as CSSProperties;

  return (
    <div className={styles.wheel} style={wheelStyle}>
      <div className={styles.track} aria-hidden="true" />
      <div className={styles.dashedRing} aria-hidden="true" />
      <div className={styles.arcs} aria-hidden="true" />
      <div className={styles.arcsOpposite} aria-hidden="true" />
      <div className={styles.tiles} role="tablist" aria-label={label}>
        {skills.map((skill, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={skill.slug}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              className={styles.tile}
              style={{ "--i": index } as CSSProperties}
              type="button"
              role="tab"
              id={tabId(index)}
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelect(index)}
              onKeyDown={handleKeyDown}
            >
              <SkillIcon name={skill.icon} />
              <span className={styles.visuallyHidden}>{skill.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default HeaderSkillWheel;
