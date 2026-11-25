import type { ComponentType } from "react";
import { CONTACT_PARTS } from "../../../content/contact";
import { usePartGoTo } from "../../../hooks/useDeepLink";
import Story from "../Story/Story";
import Prologue from "../Prologue/Prologue";
import type { StoryPartProps } from "../Story/StoryPart/StoryPart";
import ContactChannels from "./ContactChannels/ContactChannels";
import ContactHire from "./ContactHire/ContactHire";
import ContactNext from "./ContactNext/ContactNext";
import styles from "./Contact.module.scss";

// The Contact tab's parts, in story order.
const PARTS: readonly ComponentType<StoryPartProps>[] = [
  ContactHire,
  ContactChannels,
  ContactNext,
];

// The Contact tab: a scroll story on an open channel, answering the radar that opens
// the Introduction. The Hire Me form comes first and largest, then the other ways to
// reach James, then what happens to an offer once it is sent.
function Contact() {
  const goTo = usePartGoTo("contact", Object.keys(CONTACT_PARTS));
  return (
    <div className={styles.contact}>
      <Story goTo={goTo} prologue={<Prologue section="contact" />}>
        {PARTS.map((Part, index) => (
          <Part key={index} index={index} />
        ))}
      </Story>
    </div>
  );
}

export default Contact;
