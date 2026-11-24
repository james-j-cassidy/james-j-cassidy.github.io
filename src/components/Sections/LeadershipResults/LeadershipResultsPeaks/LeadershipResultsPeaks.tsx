import { useId, useState, type CSSProperties } from "react";
import {
  LEADERSHIP_PARTS,
  LEADERSHIP_RESULTS,
} from "../../../../content/leadershipResults";
import { useRovingTabs } from "../../../../hooks/useRovingTabs";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import LeadershipSky from "../LeadershipSky/LeadershipSky";
import LeadershipResultsPeak from "./LeadershipResultsPeak/LeadershipResultsPeak";
import LeadershipResultsStory from "./LeadershipResultsStory/LeadershipResultsStory";
import styles from "./LeadershipResultsPeaks.module.scss";

// Each peak's height in the range, in the results' order: a varied skyline.
const HEIGHTS = [0.95, 0.78, 0.68, 0.88, 0.74, 0.6];

// Results as a mountain range in the morning. Each result is a peak; its number climbs
// with the peak as it rises.
//
// Enters: the morning sky opens as a circle from the ground, the title slides in from
// the reading start, the ground line draws across, the peaks rise one by one with their
// numbers counting up and the story card slides in from the far side.
// Leaves: the peaks sink back, last first, counting down; the card and title slide off
// and the sky closes back into the ground.
//
// Choosing a peak plants a flag on its summit and the card tells the story behind the
// number.
function LeadershipResultsPeaks({ index }: StoryPartProps) {
  const { heading } = LEADERSHIP_PARTS.results;
  const { tag, intro, peaksLabel, results } = LEADERSHIP_RESULTS;
  const baseId = useId();
  const panelId = `${baseId}-story`;
  const tabIdFor = (position: number) => `${baseId}-peak-${position}`;
  const [selected, setSelected] = useState(0);
  const [changes, setChanges] = useState(0);
  const { refFor, onKeyDown } = useRovingTabs(results.length, selected, select);

  function select(position: number) {
    if (position === selected) return;
    setSelected(position);
    setChanges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="results" className={styles.part}>
      <LeadershipSky className={styles.sky} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.intro}>{intro}</p>
        </header>
        <div className={styles.storySlot}>
          <LeadershipResultsStory
            id={panelId}
            labelledBy={tabIdFor(selected)}
            result={results[selected]}
            change={changes}
          />
        </div>
        <div
          className={styles.range}
          role="tablist"
          aria-label={peaksLabel}
          style={{ "--count": results.length } as CSSProperties}
        >
          {results.map((result, position) => (
            <LeadershipResultsPeak
              key={result.id}
              result={result}
              order={position}
              height={HEIGHTS[position % HEIGHTS.length]}
              id={tabIdFor(position)}
              panelId={panelId}
              selected={position === selected}
              planted={position === selected ? changes : -1}
              buttonRef={refFor(position)}
              onSelect={() => select(position)}
              onKeyDown={onKeyDown}
            />
          ))}
        </div>
      </div>
    </StoryPart>
  );
}

export default LeadershipResultsPeaks;
