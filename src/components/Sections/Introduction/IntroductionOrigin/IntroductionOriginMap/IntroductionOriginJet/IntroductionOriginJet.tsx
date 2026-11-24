import type { Ref } from "react";
import styles from "./IntroductionOriginJet.module.scss";

interface IntroductionOriginJetProps {
  jetRef: Ref<SVGGElement>;
}

// The jet on the flight map: a delta-wing silhouette pointing along +x, with an engine
// glow behind it. The map places and turns it (the transform on the outer group).
function IntroductionOriginJet({ jetRef }: IntroductionOriginJetProps) {
  return (
    <g ref={jetRef} className={styles.jet}>
      <g className={styles.body}>
        <path className={styles.trail} d="M-14 0H-46" />
        <path
          className={styles.hull}
          d="M22 0 4-4-6-16h-6l4 13-8 1-5-6h-4l2 8-2 8h4l5-6 8 1-4 13h6L4 4Z"
        />
        <path className={styles.canopy} d="M14 0 6-2.5v5Z" />
      </g>
    </g>
  );
}

export default IntroductionOriginJet;
