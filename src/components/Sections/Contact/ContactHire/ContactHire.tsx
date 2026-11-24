import type { CSSProperties } from "react";
import portrait400 from "../../../../assets/images/portrait-400.webp";
import { CONTACT_HIRE, CONTACT_PARTS } from "../../../../content/contact";
import HeaderHireMeButton from "../../../Header/HeaderMainBody/HeaderHireMeButton/HeaderHireMeButton";
import LogoMark from "../../../LogoMark/LogoMark";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import ContactBackdrop from "../ContactBackdrop/ContactBackdrop";
import styles from "./ContactHire.module.scss";

// The open channel: the Hire Me form first and largest, beside the transmitter (James's
// portrait in the rings, his logo under it), and what the form asks for.
//
// Enters: the backdrop opens as a circle from the transmitter and the rings spread out
// from it, the transmitter powers up from a point, the title slides in from the reading
// start, the button follows, and the form's topics rise one after another.
// Leaves: the topics drop away, the copy slides back off the reading start, the
// transmitter shrinks back to a point and the backdrop closes over it.
function ContactHire({ index }: StoryPartProps) {
  const { heading } = CONTACT_PARTS.hire;
  const { tag, line, cta, formLabel, form } = CONTACT_HIRE;

  return (
    <StoryPart index={index} name="hire" className={styles.part}>
      <ContactBackdrop className={styles.backdrop} x={72} y={50} />
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.line}>{line}</p>
          <div className={styles.cta}>
            <HeaderHireMeButton label={cta} />
          </div>
          <div className={styles.form}>
            <p className={styles.formLabel}>{formLabel}</p>
            <ul className={styles.topics}>
              {form.map((topic, position) => (
                <li
                  key={topic}
                  className={styles.topic}
                  style={{ "--position": position } as CSSProperties}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12.5 10 17 19 7" />
                  </svg>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.transmitter} aria-hidden="true">
          <span className={styles.pulse} />
          <img
            className={styles.portrait}
            src={portrait400}
            alt=""
            width={400}
            height={400}
            decoding="async"
          />
          <LogoMark className={styles.logo} />
        </div>
      </div>
    </StoryPart>
  );
}

export default ContactHire;
