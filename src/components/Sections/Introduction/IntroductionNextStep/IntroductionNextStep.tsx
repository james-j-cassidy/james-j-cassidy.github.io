import { useEffect, useState } from "react";
import {
  INTRODUCTION_NEXT_STEP,
  INTRODUCTION_PARTS,
} from "../../../../content/introduction";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";
import { useIntroductionProgress } from "../../../../state/introductionProgress";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import IntroductionNextStepMedallion from "./IntroductionNextStepMedallion/IntroductionNextStepMedallion";
import IntroductionNextStepPortal from "./IntroductionNextStepPortal/IntroductionNextStepPortal";
import IntroductionNextStepTunnel from "./IntroductionNextStepTunnel/IntroductionNextStepTunnel";
import styles from "./IntroductionNextStep.module.scss";

// Where to next: the Introduction's "level complete" screen, its last part. A tunnel of
// rings leads on behind; the banner, the achievements earned by playing with each part,
// and the portal to the next level (Professional Journey) sit over it. While it is on
// stage, the Professional Journey tab in the header lights up, pointing the way.
//
// Enters: the tunnel opens from the center and its rings come up it, the banner slams
// in from behind the visitor, the medallions stamp down one by one and the portal rises
// out of the tunnel. As the story's last part it does not leave.
//
// Entering the next level flies down the tunnel, then opens Professional Journey.
function IntroductionNextStep({ index }: StoryPartProps) {
  const { heading } = INTRODUCTION_PARTS.nextStep;
  const {
    tag,
    banner,
    achievements,
    achievementsLabel,
    score,
    locked,
    unlocked,
    ...labels
  } = INTRODUCTION_NEXT_STEP;
  const earned = useIntroductionProgress((state) => state.earned);
  const reducedMotion = useReducedMotion();
  const [launching, setLaunching] = useState(false);
  const count = achievements.filter((item) => earned[item.id]).length;

  // Back to rest once the flight is over (the next section has opened by then).
  useEffect(() => {
    if (!launching) return;
    const timer = window.setTimeout(() => setLaunching(false), 1200);
    return () => window.clearTimeout(timer);
  }, [launching]);

  return (
    <StoryPart index={index} name="next-step" className={styles.part}>
      <IntroductionNextStepTunnel launching={launching} />
      <div className={styles.layout}>
        <header className={styles.banner}>
          <p className={styles.tag}>{tag}</p>
          <p className={styles.bannerText}>{banner}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <section className={styles.board} aria-label={achievementsLabel}>
          <div className={styles.score}>
            <span className={styles.scoreText}>
              {score(count, achievements.length)}
            </span>
            <span className={styles.scoreBar} aria-hidden="true">
              {achievements.map((item) => (
                <span
                  key={item.id}
                  data-earned={earned[item.id] ? "" : undefined}
                />
              ))}
            </span>
          </div>
          <ul className={styles.medallions}>
            {achievements.map((item, position) => (
              <IntroductionNextStepMedallion
                key={item.id}
                achievement={item}
                earned={Boolean(earned[item.id])}
                order={position}
                stateLabel={earned[item.id] ? unlocked : locked}
              />
            ))}
          </ul>
        </section>
        <div className={styles.portalSlot}>
          <IntroductionNextStepPortal
            labels={labels}
            reducedMotion={reducedMotion}
            onLaunch={() => setLaunching(true)}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default IntroductionNextStep;
