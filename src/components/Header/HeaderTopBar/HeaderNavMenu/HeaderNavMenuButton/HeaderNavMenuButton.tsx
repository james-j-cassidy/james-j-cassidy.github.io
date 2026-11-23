import styles from "./HeaderNavMenuButton.module.scss";

interface HeaderNavMenuButtonProps {
  label: string;
  isOpen: boolean;
  onOpen: () => void;
}

// The hamburger. It opens the menu dialog; the dialog's own Close button and Escape close it,
// and focus comes back here when it closes.
function HeaderNavMenuButton({
  label,
  isOpen,
  onOpen,
}: HeaderNavMenuButtonProps) {
  return (
    <button
      className={styles.button}
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      onClick={onOpen}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4 6.5h16M4 12h16M4 17.5h16" />
      </svg>
    </button>
  );
}

export default HeaderNavMenuButton;
