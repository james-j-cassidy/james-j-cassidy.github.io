import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SECTIONS } from "../../../../../content/sections";
import { followSectionLink } from "../../../../../state/navigation";
import { easeInOut } from "../../../Story/storyTiming";
import styles from "./IntroductionLookingForGauge.module.scss";

interface IntroductionLookingForGaugeProps {
  match: number; // 0–1
  labels: {
    sync: string;
    verdicts: { strong: string; maybe: string; weak: string };
    talk: string;
  };
  reducedMotion: boolean;
}

const CONTACT = SECTIONS.findIndex((section) => section.id === "contact");

// The sync gauge: a 270° arc that fills to the match, the percentage counting to it,
// and the verdict below, announced when it changes. A strong match offers the way to
// the contact section.
function IntroductionLookingForGauge({
  match,
  labels,
  reducedMotion,
}: IntroductionLookingForGaugeProps) {
  const target = Math.round(match * 100);
  const [shown, setShown] = useState(target);
  const from = useRef(target);

  // Count to the new percentage (one smooth run, not a jump).
  useEffect(() => {
    const start = from.current;
    from.current = target;
    if (reducedMotion || start === target) return;
    let begin = 0;
    let frame = requestAnimationFrame(function step(now) {
      if (!begin) begin = now;
      const t = Math.min(1, (now - begin) / 800);
      setShown(Math.round(start + (target - start) * easeInOut(t)));
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, reducedMotion]);

  const value = reducedMotion ? target : shown;
  const verdict =
    target >= 80
      ? labels.verdicts.strong
      : target >= 55
        ? labels.verdicts.maybe
        : labels.verdicts.weak;
  const strong = target >= 80;
  const contact = SECTIONS[CONTACT];

  return (
    <div className={styles.gauge} style={{ "--match": match } as CSSProperties}>
      <div className={styles.dial}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <path className={styles.track} d={ARC} pathLength={1} />
          <path className={styles.fill} d={ARC} pathLength={1} />
        </svg>
        <p className={styles.reading}>
          <span className={styles.value}>
            {value}
            <span className={styles.percent}>%</span>
          </span>
          <span className={styles.sync}>{labels.sync}</span>
        </p>
      </div>
      <div className={styles.result}>
        <p className={styles.verdict} aria-live="polite">
          {labels.sync} {target}%: {verdict}
        </p>
        {strong && contact && (
          <a
            className={styles.talk}
            href={`#${contact.id}`}
            onClick={(event) => followSectionLink(event, CONTACT)}
          >
            {labels.talk}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// 270° arc, open at the bottom: from lower left, over the top, to lower right.
const ARC = "M27 93A47 47 0 1 1 93 93";

export default IntroductionLookingForGauge;
