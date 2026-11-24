import { useId, useState } from "react";
import {
  INTRODUCTION_PARTS,
  INTRODUCTION_THIS_SITE,
} from "../../../../content/introduction";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";
import { earnAchievement } from "../../../../state/introductionProgress";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import IntroductionThisSiteBlueprint from "./IntroductionThisSiteBlueprint/IntroductionThisSiteBlueprint";
import IntroductionThisSiteDiagnostics from "./IntroductionThisSiteDiagnostics/IntroductionThisSiteDiagnostics";
import IntroductionThisSiteSpec from "./IntroductionThisSiteSpec/IntroductionThisSiteSpec";
import IntroductionThisSiteStack from "./IntroductionThisSiteStack/IntroductionThisSiteStack";
import styles from "./IntroductionThisSite.module.scss";

// About this site, as a system inspector. A technical blueprint fills the stage; the
// site's real layers float as an exploded isometric stack, with a spec sheet for the
// chosen layer and a console of live diagnostics.
//
// Enters: the blueprint wipes in from the reading start, the layers drop onto the stack
// one by one from above (bottom first), the spec sheet projects open from its middle and
// the console rises from below.
// Leaves: the stack explodes upward, top layer first, each spinning away; the sheet
// closes to a line, the console sinks and the blueprint wipes off the far side.
//
// Choosing a layer slides it out of the stack and reprints the sheet. The theme switch
// changes the whole site; a scan beam rises through the stack and the contrast readings
// are measured again from the new colors.
function IntroductionThisSite({ index }: StoryPartProps) {
  const { heading } = INTRODUCTION_PARTS.thisSite;
  const { tag, layers, layersLabel, layer, ...labels } = INTRODUCTION_THIS_SITE;
  const reducedMotion = useReducedMotion();
  const baseId = useId();
  const panelId = `${baseId}-spec`;
  const tabIdFor = (position: number) => `${baseId}-layer-${position}`;
  const [selected, setSelected] = useState(layers.length - 1);
  const [changes, setChanges] = useState(0);
  const [scans, setScans] = useState(0);

  function select(position: number) {
    if (position === selected) return;
    earnAchievement("thisSite");
    setSelected(position);
    setChanges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="this-site" className={styles.part}>
      <IntroductionThisSiteBlueprint />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <div className={styles.stackSlot}>
          <IntroductionThisSiteStack
            layers={layers}
            selected={selected}
            scan={scans}
            tabIdFor={tabIdFor}
            panelId={panelId}
            label={layersLabel}
            numberFor={(position) => String(position + 1).padStart(2, "0")}
            onSelect={select}
          />
        </div>
        <div className={styles.specSlot}>
          <IntroductionThisSiteSpec
            id={panelId}
            labelledBy={tabIdFor(selected)}
            layer={layers[selected]}
            number={layer(selected + 1)}
            change={changes}
          />
        </div>
        <div className={styles.diagnosticsSlot}>
          <IntroductionThisSiteDiagnostics
            labels={labels}
            reducedMotion={reducedMotion}
            onThemeSwitched={() => {
              setScans((count) => count + 1);
              earnAchievement("thisSite");
            }}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default IntroductionThisSite;
