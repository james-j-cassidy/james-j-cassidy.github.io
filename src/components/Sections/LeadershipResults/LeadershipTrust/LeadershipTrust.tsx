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
import LeadershipTrustReasons from "./LeadershipTrustReasons/LeadershipTrustReasons";
import LeadershipTrustTraits from "./LeadershipTrustTraits/LeadershipTrustTraits";
import LeadershipTrustTree from "./LeadershipTrustTree/LeadershipTrustTree";
import styles from "./LeadershipTrust.module.scss";

// Built on trust: why people follow James. A tree that grows from trust at its root, its
// branches holding the traits that grow trust, beside the reasons people trust him.
//
// Enters: the warm glow opens around the tree, which grows from the root up: roots,
// trunk, fork, branches, then the buds on its tips; the title drops in, the reasons
// slide in from the far side one by one and the card rises from below.
// Leaves: the tree withdraws from its tips down, the reasons and card slide away and the
// glow closes.
//
// Choosing a reason sends trust flowing up from the root to every branch, and the card
// tells it with an example from James's work. Choosing a branch opens its trait (on
// phones, a chip under the tree).
function LeadershipTrust({ index }: StoryPartProps) {
  const { heading } = LEADERSHIP_PARTS.trust;
  const {
    tag,
    reasons,
    reasonsLabel,
    proofLabel,
    traits,
    treeLabel,
    treeHint,
    root,
  } = LEADERSHIP_TRUST;
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
          <LeadershipTrustTree
            traits={traits}
            label={treeLabel}
            hint={treeHint}
            root={root}
            flow={ripples}
          />
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
        <div className={styles.traitsSlot}>
          <LeadershipTrustTraits traits={traits} label={treeLabel} />
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
