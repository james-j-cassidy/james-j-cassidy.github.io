import type { Ref } from "react";
import type {
  OpeningModule,
  OpeningModuleId,
} from "../../../../../content/introduction";
import styles from "./IntroductionOpeningModule.module.scss";

interface IntroductionOpeningModuleProps {
  module: OpeningModule;
  expanded: boolean;
  controls: string; // id of the detail card this module opens
  buttonRef: Ref<HTMLButtonElement>;
  onSelect: (id: OpeningModuleId, button: HTMLElement) => void;
}

// One module on the opening screen: a glowing plate with cut corners, an animated icon,
// a HUD tag, the title and a call to action. A button that opens and closes its detail
// card; lit up while its card is open.
function IntroductionOpeningModule({
  module,
  expanded,
  controls,
  buttonRef,
  onSelect,
}: IntroductionOpeningModuleProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.module}
      data-module={module.id}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={(event) => onSelect(module.id, event.currentTarget)}
    >
      <span className={styles.icon} aria-hidden="true">
        {module.id === "architecture" ? <LayersIcon /> : <TeamIcon />}
      </span>
      <span className={styles.text}>
        <span className={styles.tag}>{module.tag}</span>
        <span className={styles.title}>{module.title}</span>
        <span className={styles.action}>
          {module.action}
          <span className={styles.chevrons} aria-hidden="true">
            <span>›</span>
            <span>›</span>
            <span>›</span>
          </span>
        </span>
      </span>
    </button>
  );
}

// Three stacked platforms (architecture).
function LayersIcon() {
  return (
    <svg viewBox="0 0 48 48">
      <path className={styles.layerTop} d="M24 6 42 15 24 24 6 15Z" />
      <path className={styles.layerMid} d="M6 24 24 33 42 24" />
      <path className={styles.layerBottom} d="M6 33 24 42 42 33" />
    </svg>
  );
}

// A lead with a team on either side (leadership).
function TeamIcon() {
  return (
    <svg viewBox="0 0 48 48">
      <circle className={styles.lead} cx="24" cy="14" r="6" />
      <path className={styles.lead} d="M13 38c0-7 5-12 11-12s11 5 11 12" />
      <circle className={styles.member} cx="9" cy="20" r="4" />
      <path className={styles.member} d="M2 36c0-5 3-8 7-8" />
      <circle className={styles.member} cx="39" cy="20" r="4" />
      <path className={styles.member} d="M46 36c0-5-3-8-7-8" />
    </svg>
  );
}

export default IntroductionOpeningModule;
