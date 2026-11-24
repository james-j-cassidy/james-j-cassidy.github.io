import { useId, useState } from "react";
import {
  INTRODUCTION_PARTS,
  INTRODUCTION_PRINCIPLES,
} from "../../../../content/introduction";
import { earnAchievement } from "../../../../state/introductionProgress";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import IntroductionPrinciplesGrid from "./IntroductionPrinciplesGrid/IntroductionPrinciplesGrid";
import IntroductionPrinciplesRing from "./IntroductionPrinciplesRing/IntroductionPrinciplesRing";
import IntroductionPrinciplesTradeoff from "./IntroductionPrinciplesTradeoff/IntroductionPrinciplesTradeoff";
import styles from "./IntroductionPrinciples.module.scss";

// How James works, as a reactor. A honeycomb energy grid fills the stage; the principle
// cards stand in a ring around a glowing core, and the trade-off panel sits beside it.
//
// Enters: the grid wipes in from the top, the core ignites, and the cards burst out of
// it while the ring spins up and settles; the panel flips up into place.
// Leaves: the cards are pulled back into the core as the ring spins away, the core
// implodes, the panel tips back and the grid wipes away downward.
//
// Choosing a card spins the ring to it. Each principle's switch applies it or takes it
// away: the outcome flips over, the meter slides, and a wave of energy rolls out.
function IntroductionPrinciples({ index }: StoryPartProps) {
  const { heading } = INTRODUCTION_PARTS.principles;
  const { tag, principles, principlesLabel, previous, next, ...labels } =
    INTRODUCTION_PRINCIPLES;
  const baseId = useId();
  const panelId = `${baseId}-tradeoff`;
  const tabIdFor = (position: number) => `${baseId}-principle-${position}`;
  const [selected, setSelected] = useState(0);
  const [turn, setTurn] = useState(0);
  const [applied, setApplied] = useState<boolean[]>(() =>
    principles.map(() => false),
  );
  const [surges, setSurges] = useState(0);

  // Spin the short way round to the chosen card.
  function select(position: number) {
    const count = principles.length;
    let delta = (position - selected) % count;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    setSelected(position);
    setTurn((current) => current + delta);
  }

  function toggle() {
    // Switching a principle on (not off) earns the achievement.
    if (!applied[selected]) earnAchievement("principles");
    setApplied((current) =>
      current.map((value, position) =>
        position === selected ? !value : value,
      ),
    );
    setSurges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="principles" className={styles.part}>
      <IntroductionPrinciplesGrid surge={surges} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <div className={styles.reactorSlot}>
          <IntroductionPrinciplesRing
            principles={principles}
            selected={selected}
            turn={turn}
            applied={applied}
            tabIdFor={tabIdFor}
            panelId={panelId}
            label={principlesLabel}
            previousLabel={previous}
            nextLabel={next}
            onSelect={select}
          />
        </div>
        <div className={styles.panelSlot}>
          <IntroductionPrinciplesTradeoff
            id={panelId}
            labelledBy={tabIdFor(selected)}
            principle={principles[selected]}
            applied={applied[selected]}
            labels={labels}
            onToggle={toggle}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default IntroductionPrinciples;
