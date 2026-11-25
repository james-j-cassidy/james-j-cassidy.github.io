import { PROLOGUES, type PrologueSection } from "../../../content/prologues";
import { useNavigation } from "../../../state/navigation";
import PrologueScene from "./PrologueScene/PrologueScene";
import styles from "./Prologue.module.scss";

interface PrologueProps {
  section: PrologueSection;
}

// A tab's prologue: the opening scene in the part of the stage the full header leaves
// showing, so a tab never opens on an empty band. Its scene is unique to the tab and
// plays on its own (still with reduced motion); its words say what the tab holds; its
// cue begins the tab, collapsing the header as a scroll would, and the prologue slides
// away as the first part forms (Story).
//
// On short bands (phones) only the cue's line shows; the rest is still read.
function Prologue({ section }: PrologueProps) {
  const { scene, tag, title, line, cue } = PROLOGUES[section];

  function begin() {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: useNavigation.getState().collapsedSectionTop,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return (
    <div className={styles.prologue} data-scene={scene}>
      <div className={styles.scene} aria-hidden="true">
        <PrologueScene scene={scene} />
      </div>
      <div className={styles.words}>
        <p className={styles.tag}>{tag}</p>
        <p className={styles.title}>{title}</p>
        <p className={styles.line}>{line}</p>
        <button type="button" className={styles.cue} onClick={begin}>
          <span>{cue}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Prologue;
