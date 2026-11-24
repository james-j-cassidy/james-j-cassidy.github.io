import { useId, useState, type CSSProperties } from "react";
import {
  LEADERSHIP_PARTS,
  LEADERSHIP_SERVICE,
} from "../../../../content/leadershipResults";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import LeadershipSky from "../LeadershipSky/LeadershipSky";
import LeadershipServiceCompass from "./LeadershipServiceCompass/LeadershipServiceCompass";
import styles from "./LeadershipService.module.scss";

// Where it started: thirteen years in the Air Force. The Air Force symbol sits at the
// heart of a compass whose three points are its core values; the needle points at the
// one chosen, and the card says how James lives it now.
//
// Enters: a starlit glow opens around the compass, the ring spins in from nothing, the
// symbol turns to face the visitor, the values settle onto the ring one by one; the
// title and facts slide in and the card hinges down from its top edge.
// Leaves: the values lift off, the symbol turns edge-on, the ring spins away to
// nothing, the card hinges up and the words slide off as the glow closes.
function LeadershipService({ index }: StoryPartProps) {
  const { heading } = LEADERSHIP_PARTS.service;
  const { tag, emblemLabel, valuesLabel, facts, roles, values } =
    LEADERSHIP_SERVICE;
  const baseId = useId();
  const panelId = `${baseId}-value`;
  const tabIdFor = (position: number) => `${baseId}-point-${position}`;
  const [selected, setSelected] = useState(0);
  const [changes, setChanges] = useState(0);

  function select(position: number) {
    if (position === selected) return;
    setSelected(position);
    setChanges((count) => count + 1);
  }

  const value = values[selected];

  return (
    <StoryPart index={index} name="service" className={styles.part}>
      <LeadershipSky className={styles.sky} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <dl className={styles.facts}>
            {facts.map((fact, position) => (
              <div
                key={fact.label}
                className={styles.fact}
                style={{ "--order": position } as CSSProperties}
              >
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.roles}>{roles}</p>
        </header>
        <div className={styles.compassSlot}>
          <LeadershipServiceCompass
            values={values}
            selected={selected}
            label={valuesLabel}
            emblemLabel={emblemLabel}
            tabIdFor={tabIdFor}
            panelId={panelId}
            onSelect={select}
          />
        </div>
        <div className={styles.cardSlot}>
          <section
            id={panelId}
            className={styles.card}
            role="tabpanel"
            aria-labelledby={tabIdFor(selected)}
            tabIndex={0}
          >
            <div
              key={changes}
              className={styles.sheet}
              data-printed={changes > 0 ? "" : undefined}
            >
              <p className={styles.cardTag}>{valuesLabel}</p>
              <h4 className={styles.cardTitle}>{value.title}</h4>
              <p className={styles.cardBody}>{value.body}</p>
            </div>
          </section>
        </div>
      </div>
    </StoryPart>
  );
}

export default LeadershipService;
