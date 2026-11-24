import type { CSSProperties } from "react";
import { CONTACT_NEXT, CONTACT_PARTS } from "../../../../content/contact";
import HeaderHireMeButton from "../../../Header/HeaderMainBody/HeaderHireMeButton/HeaderHireMeButton";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import ContactBackdrop from "../ContactBackdrop/ContactBackdrop";
import styles from "./ContactNext.module.scss";

// What happens to an offer: three steps along one signal line, from the sender to James
// and back, the hours off-hours consulting runs in, and the form once more.
//
// Enters: the backdrop opens from the reading start with the rings spreading from that
// side, the title slides in, the signal line draws across, each step lights as the line
// reaches it, then the hours and the button rise into place.
// Leaves (only if anything ever follows): the same, in reverse.
function ContactNext({ index }: StoryPartProps) {
  const { heading } = CONTACT_PARTS.next;
  const { tag, steps, consultingLabel, consulting, cta } = CONTACT_NEXT;

  return (
    <StoryPart index={index} name="next" className={styles.part}>
      <ContactBackdrop className={styles.backdrop} x={0} y={55} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
        </header>
        <div className={styles.track}>
          <span className={styles.signal} aria-hidden="true" />
          <ol className={styles.steps}>
            {steps.map((step, position) => (
              <li
                key={step.title}
                className={styles.step}
                style={{ "--position": position } as CSSProperties}
              >
                <span className={styles.number} aria-hidden="true">
                  {position + 1}
                </span>
                <span className={styles.stepTitle}>{step.title}</span>
                <span className={styles.stepText}>{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.close}>
          <p className={styles.hours}>
            <span className={styles.hoursLabel}>{consultingLabel}:</span>{" "}
            {consulting}
          </p>
          <HeaderHireMeButton label={cta} />
        </div>
      </div>
    </StoryPart>
  );
}

export default ContactNext;
