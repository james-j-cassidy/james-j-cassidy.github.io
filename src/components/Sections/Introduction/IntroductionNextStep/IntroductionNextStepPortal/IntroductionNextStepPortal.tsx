import type { MouseEvent } from "react";
import { SECTIONS } from "../../../../../content/sections";
import {
  followSectionLink,
  useNavigation,
} from "../../../../../state/navigation";
import styles from "./IntroductionNextStepPortal.module.scss";

interface IntroductionNextStepPortalProps {
  labels: {
    nextTag: string;
    nextTitle: string;
    nextLine: string;
    enter: string;
    contact: string;
  };
  reducedMotion: boolean;
  onLaunch: () => void; // starts the flight down the tunnel
}

const JOURNEY = SECTIONS.findIndex(
  (section) => section.id === "professional-journey",
);
const CONTACT = SECTIONS.findIndex((section) => section.id === "contact");

// How long the flight down the tunnel takes before the next level opens.
const LAUNCH_TIME = 650; // ms

// The way on: the next level (Professional Journey) with a big launch button, and a
// quieter link straight to contact. Launching flies down the tunnel, then opens the next
// section; with reduced motion it opens at once. Modified clicks (new tab or window)
// are left to the browser.
function IntroductionNextStepPortal({
  labels,
  reducedMotion,
  onLaunch,
}: IntroductionNextStepPortalProps) {
  function launch(event: MouseEvent<HTMLAnchorElement>) {
    if (
      reducedMotion ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      followSectionLink(event, JOURNEY);
      return;
    }
    event.preventDefault();
    onLaunch();
    window.setTimeout(
      () => useNavigation.getState().showSection(JOURNEY),
      LAUNCH_TIME,
    );
  }

  return (
    <div className={styles.portal}>
      <p className={styles.tag}>{labels.nextTag}</p>
      <p className={styles.title}>{labels.nextTitle}</p>
      <p className={styles.line}>{labels.nextLine}</p>
      <a
        className={styles.enter}
        href={`#${SECTIONS[JOURNEY].id}`}
        onClick={launch}
      >
        <span>{labels.enter}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
      <a
        className={styles.contact}
        href={`#${SECTIONS[CONTACT].id}`}
        onClick={(event) => followSectionLink(event, CONTACT)}
      >
        {labels.contact}
      </a>
    </div>
  );
}

export default IntroductionNextStepPortal;
