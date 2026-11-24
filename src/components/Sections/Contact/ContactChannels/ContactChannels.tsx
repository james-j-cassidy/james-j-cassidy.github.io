import type { CSSProperties } from "react";
import {
  CONTACT_CHANNELS,
  CONTACT_PARTS,
  type ChannelId,
} from "../../../../content/contact";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import ContactBackdrop from "../ContactBackdrop/ContactBackdrop";
import styles from "./ContactChannels.module.scss";

// Only the channels that have a link yet.
const CHANNELS = CONTACT_CHANNELS.channels.filter((channel) => channel.href);

// The other ways to reach James: his resume, LinkedIn and GitHub, each a channel card
// with its own sign.
//
// Enters: the backdrop opens down from the top and the rings spread from the top
// center, the title drops into place, and the channels arrive from the far side one
// after another, each with a beam behind it.
// Leaves: the channels go on out the near side in turn, the title lifts away and the
// backdrop closes back up.
function ContactChannels({ index }: StoryPartProps) {
  const { heading } = CONTACT_PARTS.channels;
  const { tag, line } = CONTACT_CHANNELS;

  return (
    <StoryPart index={index} name="channels" className={styles.part}>
      <ContactBackdrop className={styles.backdrop} x={50} y={0} />
      <div className={styles.layout}>
        <header className={styles.titleBar}>
          <p className={styles.tag}>{tag}</p>
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.line}>{line}</p>
        </header>
        <ul className={styles.channels}>
          {CHANNELS.map((channel, position) => (
            <li
              key={channel.id}
              className={styles.channel}
              style={{ "--position": position } as CSSProperties}
            >
              <a
                className={styles.link}
                href={channel.href}
                download={channel.download}
              >
                <span className={styles.sign} aria-hidden="true">
                  <ChannelIcon id={channel.id} />
                </span>
                <span className={styles.text}>
                  <span className={styles.name}>{channel.name}</span>
                  <span className={styles.detail}>{channel.detail}</span>
                </span>
                <span className={styles.action}>
                  {channel.action}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {channel.download ? (
                      <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
                    ) : (
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    )}
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </StoryPart>
  );
}

// Each channel's sign, adapted from Lucide (ISC license, lucide.dev).
function ChannelIcon({ id }: { id: ChannelId }) {
  return (
    <svg viewBox="0 0 24 24">
      {id === "resume" && (
        <>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M8 13h8M8 17h5" />
        </>
      )}
      {id === "linkedIn" && (
        <>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </>
      )}
      {id === "gitHub" && (
        <>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </>
      )}
    </svg>
  );
}

export default ContactChannels;
