import type { SiteLayer } from "../../../../../content/introduction";
import styles from "./IntroductionThisSiteSpec.module.scss";

interface IntroductionThisSiteSpecProps {
  id: string;
  labelledBy: string; // the selected layer's tab
  layer: SiteLayer;
  number: string; // "Layer 02"
  change: number; // one more per layer chosen; reprints the sheet
}

// The spec sheet for the selected layer (the stack's panel). Each new layer prints the
// sheet line by line, top to bottom, as if from a print head.
function IntroductionThisSiteSpec({
  id,
  labelledBy,
  layer,
  number,
  change,
}: IntroductionThisSiteSpecProps) {
  return (
    <section
      id={id}
      className={styles.spec}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <div
        key={change}
        className={styles.sheet}
        data-printed={change > 0 ? "" : undefined}
      >
        <p className={styles.number}>{number}</p>
        <h4 className={styles.title}>{layer.title}</h4>
        <p className={styles.summary}>{layer.summary}</p>
        <ul className={styles.points}>
          {layer.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <ul className={styles.tags}>
          {layer.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default IntroductionThisSiteSpec;
