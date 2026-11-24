import type { ComponentType } from "react";
import Story from "../Story/Story";
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
  return (
    <div className={styles.contact}>
      <Story>
        {PARTS.map((Part, index) => (
          <Part key={index} index={index} />
        ))}
      </Story>
    </div>
  );
}

export default Contact;
