import { useId, type ReactNode } from "react";
import { NAV_MENU_LABELS } from "../../../../../content/headerControls";
import { useNavMenu } from "../navMenuContext";
import styles from "./HeaderNavMenuScreen.module.scss";

interface HeaderNavMenuScreenProps {
  title: string;
  // Shared with the item that opens this screen, so its title morphs into the header.
  transitionName: string;
  // Replaces the visible title in the header (the search screen puts its field there).
  headerContent?: ReactNode;
  children: ReactNode;
}

// Frame for every menu screen: a header row (Back on submenus, the title, Close) and a
// scrolling body. Submenu screens can hold HeaderNavMenuItem rows to go a level deeper.
function HeaderNavMenuScreen({
  title,
  transitionName,
  headerContent,
  children,
}: HeaderNavMenuScreenProps) {
  const { backLabel, goBack, closeMenu } = useNavMenu();
  const headingId = useId();

  return (
    <section className={styles.screen} aria-labelledby={headingId}>
      <div className={styles.bar}>
        {backLabel && (
          <button
            className={styles.iconButton}
            type="button"
            aria-label={backLabel}
            onClick={goBack}
          >
            <svg
              className={`${styles.icon} ${styles.backIcon}`}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>
        )}

        {headerContent ? (
          <>
            <h2 id={headingId} className={styles.visuallyHidden}>
              {title}
            </h2>
            {headerContent}
          </>
        ) : (
          <h2
            id={headingId}
            className={styles.title}
            style={{ viewTransitionName: transitionName }}
            tabIndex={-1}
            data-autofocus
          >
            {title}
          </h2>
        )}

        <button
          className={styles.iconButton}
          type="button"
          aria-label={NAV_MENU_LABELS.close}
          onClick={closeMenu}
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default HeaderNavMenuScreen;
