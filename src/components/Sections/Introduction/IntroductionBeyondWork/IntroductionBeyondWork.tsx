import { useId, useState } from "react";
import {
  INTRODUCTION_BEYOND_WORK,
  INTRODUCTION_PARTS,
} from "../../../../content/introduction";
import { earnAchievement } from "../../../../state/introductionProgress";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import IntroductionBeyondWorkCard from "./IntroductionBeyondWorkCard/IntroductionBeyondWorkCard";
import IntroductionBeyondWorkConstellation from "./IntroductionBeyondWorkConstellation/IntroductionBeyondWorkConstellation";
import IntroductionBeyondWorkStarfield from "./IntroductionBeyondWorkStarfield/IntroductionBeyondWorkStarfield";
import styles from "./IntroductionBeyondWork.module.scss";

// Beyond work, as a star map. Deep space fills the stage; a constellation of personal
// discoveries sits beside a discovery card.
//
// Enters, dropping out of hyperspace: a warp gate opens, the streaks shrink back to
// stars, the map flies in from deep space, the stars light up in turn as the lines
// join them, and the card flips round.
// Leaves, jumping to warp: the map flies forward past the visitor, the stars stretch
// into streaks and the gate closes.
//
// Choosing a star makes a short jump (the stars streak and settle), flares the star and
// turns the card over to it.
function IntroductionBeyondWork({ index }: StoryPartProps) {
  const { heading } = INTRODUCTION_PARTS.beyondWork;
  const { tag, items, starsLabel, discovery } = INTRODUCTION_BEYOND_WORK;
  const baseId = useId();
  const panelId = `${baseId}-discovery`;
  const tabIdFor = (position: number) => `${baseId}-star-${position}`;
  const [selected, setSelected] = useState(0);
  const [jumps, setJumps] = useState(0);

  function select(position: number) {
    if (position === selected) return;
    earnAchievement("beyondWork");
    setSelected(position);
    setJumps((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="beyond-work" className={styles.part}>
      <IntroductionBeyondWorkStarfield jump={jumps} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <div className={styles.mapSlot}>
          <IntroductionBeyondWorkConstellation
            items={items}
            selected={selected}
            tabIdFor={tabIdFor}
            panelId={panelId}
            label={starsLabel}
            onSelect={select}
          />
        </div>
        <div className={styles.cardSlot}>
          <IntroductionBeyondWorkCard
            id={panelId}
            labelledBy={tabIdFor(selected)}
            item={items[selected]}
            number={discovery(selected + 1)}
            change={jumps}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default IntroductionBeyondWork;
