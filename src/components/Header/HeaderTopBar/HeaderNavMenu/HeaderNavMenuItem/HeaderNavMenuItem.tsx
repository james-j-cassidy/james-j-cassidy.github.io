import type { ReactNode } from "react";
import { useNavMenu, type NavMenuScreenId } from "../navMenuContext";
import styles from "./HeaderNavMenuItem.module.scss";

interface HeaderNavMenuItemProps {
  screen: NavMenuScreenId;
  label: string;
  // The current setting, shown at the row's end (for example the selected theme).
  value?: ReactNode;
}

// A row that opens a submenu screen. Its label shares a view-transition name with that
// screen's title, so it appears to move up into the header.
function HeaderNavMenuItem({ screen, label, value }: HeaderNavMenuItemProps) {
  const { itemId, openScreen } = useNavMenu();

  return (
    <button
      id={itemId(screen)}
      className={styles.item}
      type="button"
      onClick={() => openScreen(screen)}
    >
      <span
        className={styles.label}
        style={{ viewTransitionName: `nav-menu-title-${screen}` }}
      >
        {label}
      </span>
      <span className={styles.value}>{value}</span>
      <svg
        className={styles.chevron}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="m9 6 6 6-6 6" />
      </svg>
    </button>
  );
}

export default HeaderNavMenuItem;
