import { useEffect, useRef, type MouseEvent } from "react";
import type { Credential } from "../../../../../content/professionalJourney";
import styles from "./CredentialPartCertificate.module.scss";

interface CredentialPartCertificateProps {
  credential: Credential | null; // the one to show; null: closed
  date: string | null; // when it was awarded, as shown on the chain
  labels: {
    certificateOf: (title: string) => string;
    close: string;
  };
  onClose: () => void;
}

// A credential's certificate in a modal dialog: the scan, its title, issuer and date,
// and what was hidden on it. The browser's own dialog keeps focus inside, closes on
// Escape and returns focus to the credential that opened it; clicking outside the
// certificate closes it too.
function CredentialPartCertificate({
  credential,
  date,
  labels,
  onClose,
}: CredentialPartCertificateProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (credential && !dialog.open) dialog.showModal();
    if (!credential && dialog.open) dialog.close();
  }, [credential]);

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    // The dialog itself (not its content) is only hit outside the frame.
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={
        credential ? labels.certificateOf(credential.title) : undefined
      }
      onClose={onClose}
      onClick={handleClick}
    >
      {credential && (
        <figure className={styles.frame}>
          <button
            type="button"
            className={styles.close}
            aria-label={labels.close}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <img
            className={styles.scan}
            src={`${import.meta.env.BASE_URL}${credential.certificate}`}
            alt={labels.certificateOf(credential.title)}
            width={1280}
            height={960}
          />
          <figcaption className={styles.caption}>
            <span className={styles.title}>{credential.title}</span>
            <span className={styles.meta}>
              {credential.issuer}
              {date && ` · ${date}`}
            </span>
            {credential.certificateNote && (
              <span className={styles.note}>{credential.certificateNote}</span>
            )}
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}

export default CredentialPartCertificate;
