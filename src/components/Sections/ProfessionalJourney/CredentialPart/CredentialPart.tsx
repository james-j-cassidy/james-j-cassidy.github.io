import { useState } from "react";
import {
  CREDENTIALS_LABELS,
  type Credential,
} from "../../../../content/professionalJourney";
import StoryPart from "../../Story/StoryPart/StoryPart";
import JobPartBackdrop from "../JobPart/JobPartBackdrop/JobPartBackdrop";
import JobPartTimeline from "../JobPart/JobPartTimeline/JobPartTimeline";
import CredentialPartCertificate from "./CredentialPartCertificate/CredentialPartCertificate";
import { formatAwarded } from "./sortCredentials";
import styles from "./CredentialPart.module.scss";

interface CredentialPartProps {
  index: number; // place in the story
  credential: Credential;
  credentials: readonly Credential[]; // the whole chain, in the chosen order, for the rail
}

// Degrees wear a mortarboard; certifications a ribbon badge (24 × 24 strokes).
const ICONS = {
  degree: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6",
  certification:
    "M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM9 14l-2 7 5-3 5 3-2-7M12 7l1 2h2l-1.5 1.5.5 2-2-1-2 1 .5-2L9 9h2z",
};

// One credential on the Education & credentials story: the same template and movement
// as a job (JobPart), in the credentials' gold. The rail across the top; the
// credential's card beside its certificate.
// Enters: the backdrop opens from the top, the rail draws in, the card docks down from
// its stop on the rail and the certificate rises into place.
// Leaves: the whole credential carousels away to the reading start, the next coming in.
//
// The certificate opens full size in a dialog.
function CredentialPart({
  index,
  credential,
  credentials,
}: CredentialPartProps) {
  const { tag, railLabel, levels, months, view, certificateOf, close } =
    CREDENTIALS_LABELS;
  const [open, setOpen] = useState(false);
  const date = formatAwarded(credential.awarded, months);
  const kind =
    credential.level === "certification" ? "certification" : "degree";

  return (
    <StoryPart
      index={index}
      name={`credential-${credential.id}`}
      className={styles.part}
    >
      <div className={styles.themed}>
        <JobPartBackdrop motif="hex" monogram={credential.monogram} />
        <div className={styles.layout}>
          <div className={styles.railSlot}>
            <p className={styles.tag}>{tag}</p>
            <JobPartTimeline
              stops={credentials.map((stop) => ({
                id: stop.id,
                short: stop.short,
                full: stop.title,
                when: stop.awarded?.slice(0, 4) ?? null,
              }))}
              currentId={credential.id}
              label={railLabel}
            />
          </div>
          <div className={styles.cardSlot}>
            <div className={styles.card}>
              <div className={styles.identity}>
                <span className={styles.emblem} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d={ICONS[kind]} />
                  </svg>
                </span>
                <div className={styles.names}>
                  <p className={styles.level}>{levels[credential.level]}</p>
                  <h3 className={styles.title}>{credential.title}</h3>
                </div>
              </div>
              {credential.detail && (
                <p className={styles.detail}>{credential.detail}</p>
              )}
              <p className={styles.issuer}>{credential.issuer}</p>
              {date && (
                <p className={styles.date}>
                  <time dateTime={credential.awarded ?? undefined}>{date}</time>
                </p>
              )}
            </div>
          </div>
          <div className={styles.certificateSlot}>
            <button
              type="button"
              className={styles.certificate}
              onClick={() => setOpen(true)}
            >
              <img
                src={`${import.meta.env.BASE_URL}${credential.certificate}`}
                alt={certificateOf(credential.title)}
                width={1280}
                height={960}
              />
              <span className={styles.zoom}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5 20 20M10.5 8v5M8 10.5h5" />
                </svg>
                <span className={styles.zoomText}>{view}</span>
              </span>
            </button>
            {credential.certificateNote && (
              <p className={styles.note}>{credential.certificateNote}</p>
            )}
          </div>
        </div>
        <CredentialPartCertificate
          credential={open ? credential : null}
          date={date}
          labels={{ certificateOf, close }}
          onClose={() => setOpen(false)}
        />
      </div>
    </StoryPart>
  );
}

export default CredentialPart;
