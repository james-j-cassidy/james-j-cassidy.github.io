import { useEffect, useRef, useState } from "react";
import { easeInOut } from "../../../../Story/storyTiming";
import styles from "./IntroductionThisSiteReadout.module.scss";

interface IntroductionThisSiteReadoutProps {
  label: string;
  ratio: number; // measured contrast ratio
  passLabel: string;
  failLabel: string;
  reducedMotion: boolean;
}

const AAA = 7; // normal text, WCAG 1.4.6

// One live contrast reading: the ratio counts up to its new value whenever it changes
// (a re-measure after a theme switch), with an AAA pass or fail badge. The badge uses a
// mark and words, never color alone.
function IntroductionThisSiteReadout({
  label,
  ratio,
  passLabel,
  failLabel,
  reducedMotion,
}: IntroductionThisSiteReadoutProps) {
  const [shown, setShown] = useState(ratio);
  const from = useRef(ratio);

  useEffect(() => {
    const start = reducedMotion ? ratio : Math.max(1, from.current - 4);
    from.current = ratio;
    if (start === ratio) {
      setShown(ratio);
      return;
    }
    let begin = 0;
    let frame = requestAnimationFrame(function step(now) {
      if (!begin) begin = now;
      const t = Math.min(1, (now - begin) / 700);
      setShown(start + (ratio - start) * easeInOut(t));
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [ratio, reducedMotion]);

  const pass = ratio >= AAA;

  return (
    <div className={styles.readout} data-pass={pass ? "" : undefined}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {shown.toFixed(1)}
        <span className={styles.unit}>:1</span>
      </span>
      <span className={styles.badge}>
        <span aria-hidden="true">{pass ? "✓" : "✕"}</span>{" "}
        {pass ? passLabel : failLabel}
      </span>
    </div>
  );
}

export default IntroductionThisSiteReadout;
