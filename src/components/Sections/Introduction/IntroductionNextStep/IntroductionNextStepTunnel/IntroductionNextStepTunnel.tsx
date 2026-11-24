import type { CSSProperties } from "react";
import styles from "./IntroductionNextStepTunnel.module.scss";

interface IntroductionNextStepTunnelProps {
  launching: boolean; // the visitor is entering the next level: fly down the tunnel
}

const RINGS = 12;

// The finale's full-stage background: a tunnel of glowing rings receding to a bright
// point, the way on to the next level. Entering the next level flies down it. Static
// otherwise. Decorative: hidden from screen readers.
function IntroductionNextStepTunnel({
  launching,
}: IntroductionNextStepTunnelProps) {
  return (
    <div className={styles.tunnel} aria-hidden="true">
      <div className={styles.depth}>
        <div className={styles.rings} data-launch={launching ? "" : undefined}>
          {Array.from({ length: RINGS }, (_, index) => (
            <span
              key={index}
              className={styles.ring}
              style={{ "--ring": index } as CSSProperties}
            />
          ))}
        </div>
      </div>
      <span className={styles.light} />
    </div>
  );
}

export default IntroductionNextStepTunnel;
