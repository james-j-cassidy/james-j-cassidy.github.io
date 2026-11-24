import { useId, useState } from "react";
import { SECTIONS } from "../../../../content/sections";
import {
  LEADERSHIP_PARTS,
  LEADERSHIP_THEIR_WORDS,
} from "../../../../content/leadershipResults";
import { followSectionLink } from "../../../../state/navigation";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import LeadershipSky from "../LeadershipSky/LeadershipSky";
import LeadershipTheirWordsQuote from "./LeadershipTheirWordsQuote/LeadershipTheirWordsQuote";
import LeadershipTheirWordsRidge from "./LeadershipTheirWordsRidge/LeadershipTheirWordsRidge";
import styles from "./LeadershipTheirWords.module.scss";

const CONTACT = SECTIONS.findIndex((section) => section.id === "contact");

// The summit: the people who were there, in their own words, as beacons lit along the
// ridge, and the way on to contact. The full sunrise.
//
// Enters: the sky opens to full day from the top, the sun climbs over the ridge with
// its rays turning, the ridge rises from below, the beacons ignite one after another,
// the quote rises into place, the title slides in and the invitation arrives from the
// far side.
// Leaves (only if anything ever follows): the same, in reverse.
//
// Choosing a beacon flares it and the quote changes to that person's words.
function LeadershipTheirWords({ index }: StoryPartProps) {
  const { heading } = LEADERSHIP_PARTS.theirWords;
  const { tag, quotes, beaconsLabel, headingAlone, ctaTitle, ctaLine, cta } =
    LEADERSHIP_THEIR_WORDS;
  // Until there are recommendations, the summit shows only the title and invitation.
  const hasQuotes = quotes.length > 0;
  const baseId = useId();
  const panelId = `${baseId}-quote`;
  const tabIdFor = (position: number) => `${baseId}-beacon-${position}`;
  const [selected, setSelected] = useState(0);
  const [changes, setChanges] = useState(0);

  function select(position: number) {
    if (position === selected) return;
    setSelected(position);
    setChanges((count) => count + 1);
  }

  return (
    <StoryPart index={index} name="their-words" className={styles.part}>
      <LeadershipSky className={styles.sky}>
        <span className={styles.rays} />
        <span className={styles.sun} />
      </LeadershipSky>
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>
            {hasQuotes ? heading : headingAlone}
          </h3>
        </header>
        <div className={styles.invite}>
          <p className={styles.inviteTitle}>{ctaTitle}</p>
          <p className={styles.inviteLine}>{ctaLine}</p>
          <a
            className={styles.cta}
            href={`#${SECTIONS[CONTACT].id}`}
            onClick={(event) => followSectionLink(event, CONTACT)}
          >
            <span>{cta}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
        {hasQuotes && (
          <div className={styles.quoteSlot}>
            <LeadershipTheirWordsQuote
              id={panelId}
              labelledBy={tabIdFor(selected)}
              quote={quotes[selected]}
              change={changes}
            />
          </div>
        )}
        <div className={styles.ridgeSlot}>
          <LeadershipTheirWordsRidge
            quotes={quotes}
            selected={selected}
            label={beaconsLabel}
            tabIdFor={tabIdFor}
            panelId={panelId}
            onSelect={select}
          />
        </div>
      </div>
    </StoryPart>
  );
}

export default LeadershipTheirWords;
