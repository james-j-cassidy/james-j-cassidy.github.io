import { useState } from "react";
import {
  INTRODUCTION_LOOKING_FOR,
  INTRODUCTION_PARTS,
} from "../../../../content/introduction";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";
import { earnAchievement } from "../../../../state/introductionProgress";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import IntroductionLookingForGauge from "./IntroductionLookingForGauge/IntroductionLookingForGauge";
import IntroductionLookingForReel from "./IntroductionLookingForReel/IntroductionLookingForReel";
import IntroductionLookingForWaves from "./IntroductionLookingForWaves/IntroductionLookingForWaves";
import styles from "./IntroductionLookingFor.module.scss";

// What James is looking for, as a compatibility scan. Two signals run across the stage;
// three slot reels (role, team, work setup) set up the visitor's opportunity, and a sync
// gauge shows how well it fits. Pay is deliberately not part of it.
//
// Enters: the signals draw out from the middle, the reels drop in spinning and land one
// after another, and the gauge pops in spinning and fills.
// Leaves: the reels spin on and fall away, the gauge drains and spins out, and the
// signals flatten to a line.
//
// Each choice turns its reel, slides the visitor's signal toward (or away from) James's,
// and moves the gauge; a strong match offers the way to the contact section.
function IntroductionLookingFor({ index }: StoryPartProps) {
  const { heading } = INTRODUCTION_PARTS.lookingFor;
  const { tag, intro, reels, previous, next, ...labels } =
    INTRODUCTION_LOOKING_FOR;
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<number[]>(() => reels.map(() => 0));
  const [turns, setTurns] = useState<number[]>(() => reels.map(() => 0));

  // Turn the reel the short way round to the new choice.
  function choose(reel: number, option: number) {
    earnAchievement("lookingFor");
    const count = reels[reel].options.length;
    let delta = (option - selected[reel]) % count;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    setSelected((current) =>
      current.map((value, position) => (position === reel ? option : value)),
    );
    setTurns((current) =>
      current.map((value, position) =>
        position === reel ? value + delta : value,
      ),
    );
  }

  const match =
    reels.reduce(
      (sum, reel, position) => sum + reel.options[selected[position]].fit,
      0,
    ) / reels.length;

  return (
    <StoryPart index={index} name="looking-for" className={styles.part}>
      <IntroductionLookingForWaves match={match} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.intro}>{intro}</p>
        </header>
        <div className={styles.reels}>
          {reels.map((reel, position) => (
            <IntroductionLookingForReel
              key={reel.id}
              reel={reel}
              order={position}
              selected={selected[position]}
              turn={turns[position]}
              previousLabel={previous(reel.label)}
              nextLabel={next(reel.label)}
              onSelect={(option) => choose(position, option)}
            />
          ))}
        </div>
        <div className={styles.gaugeSlot}>
          <IntroductionLookingForGauge
            match={match}
            labels={labels}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default IntroductionLookingFor;
