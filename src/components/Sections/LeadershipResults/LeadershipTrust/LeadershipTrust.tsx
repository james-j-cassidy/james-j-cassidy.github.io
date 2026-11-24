import { useId, useState } from "react";
import {
  LEADERSHIP_PARTS,
  LEADERSHIP_TRUST,
} from "../../../../content/leadershipResults";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import LeadershipSky from "../LeadershipSky/LeadershipSky";
import LeadershipTrustCard from "./LeadershipTrustCard/LeadershipTrustCard";
import LeadershipTrustNetwork from "./LeadershipTrustNetwork/LeadershipTrustNetwork";
import LeadershipTrustReasons from "./LeadershipTrustReasons/LeadershipTrustReasons";
import styles from "./LeadershipTrust.module.scss";

// Built on trust: why people follow James. The team around him as a constellation, every
// person linked to someone closer in, and the reasons they trust him.
//
// Enters: the warm glow opens around the constellation, the rings unfold from the
// center one after another, spinning into place; the title drops in, the reasons slide
// in from the far side one by one and the card rises from below.
// Leaves: the rings spin back into the center, outermost first, the reasons and card
// slide away and the glow closes.
//
// Choosing a reason sends a ring of trust rippling out from the center through the whole
// team, and the card tells it with an example from James's work.
function LeadershipTrust({ index }: StoryPartProps) {
  const { heading } = LEADERSHIP_PARTS.trust;
  const { tag, reasons, reasonsLabel, proofLabel, you } = LEADERSHIP_TRUST;
  const baseId = useId();
  const panelId = `${baseId}-reason`;
  const tabIdFor = (position: number) => `${baseId}-why-${position}`;
  const [selected, setSelected] = useState(0);
  const [ripples, setRipples] = useState(0);

  function select(position: number) {
    if (position === selected) return;
    setSelected(position);
    setRipples((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="trust" className={styles.part}>
      <LeadershipSky className={styles.sky} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <div className={styles.networkSlot}>
          <LeadershipTrustNetwork ripple={ripples} you={you} />
        </div>
        <div className={styles.reasonsSlot}>
          <LeadershipTrustReasons
            reasons={reasons}
            selected={selected}
            label={reasonsLabel}
            tabIdFor={tabIdFor}
            panelId={panelId}
            onSelect={select}
          />
        </div>
        <div className={styles.cardSlot}>
          <LeadershipTrustCard
            id={panelId}
            labelledBy={tabIdFor(selected)}
            reason={reasons[selected]}
            proofLabel={proofLabel}
            change={ripples}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default LeadershipTrust;
