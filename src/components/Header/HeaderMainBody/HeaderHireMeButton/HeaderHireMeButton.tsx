import { useHireMe } from "../../../../state/hireMe";
import styles from "./HeaderHireMeButton.module.scss";

interface HeaderHireMeButtonProps {
  label: string;
}

// Call to action: opens the Hire Me form (a dialog).
function HeaderHireMeButton({ label }: HeaderHireMeButtonProps) {
  const show = useHireMe((state) => state.show);

  return (
    <button
      type="button"
      className={styles.hireMe}
      aria-haspopup="dialog"
      onClick={show}
    >
      <HandshakeIcon />
      <span className={styles.label}>{label}</span>
      <svg
        className={styles.arrow}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M5 12 H19 M13 6 L19 12 L13 18" />
      </svg>
    </button>
  );
}

// Handshake icon, adapted from Lucide (ISC license, lucide.dev).
function HandshakeIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </svg>
  );
}

export default HeaderHireMeButton;
