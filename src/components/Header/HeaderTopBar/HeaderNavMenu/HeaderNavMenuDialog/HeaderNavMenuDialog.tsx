import { useEffect, useRef, type SyntheticEvent } from "react";
import { useNavMenu, type NavMenuScreenId } from "../navMenuContext";
import HeaderNavMenuMain from "./HeaderNavMenuMain/HeaderNavMenuMain";
import HeaderNavMenuSearch from "./HeaderNavMenuSearch/HeaderNavMenuSearch";
import HeaderNavMenuTheme from "./HeaderNavMenuTheme/HeaderNavMenuTheme";
import HeaderNavMenuLanguage from "./HeaderNavMenuLanguage/HeaderNavMenuLanguage";
import styles from "./HeaderNavMenuDialog.module.scss";

interface HeaderNavMenuDialogProps {
  label: string;
  isOpen: boolean;
  returnFocusId: string | null;
}

const SCREENS: Record<NavMenuScreenId, () => React.JSX.Element> = {
  main: HeaderNavMenuMain,
  search: HeaderNavMenuSearch,
  theme: HeaderNavMenuTheme,
  language: HeaderNavMenuLanguage,
};

// Full-screen modal dialog (native <dialog>): while open, the page behind is inert and
// focus stays inside; Escape closes it, and closing returns focus to the hamburger.
// Shows one screen at a time. After every screen change, focus moves to the new screen's
// starting point (its heading, or the search field), or back to the item we came from.
function HeaderNavMenuDialog({
  label,
  isOpen,
  returnFocusId,
}: HeaderNavMenuDialogProps) {
  const { screen, closeMenu } = useNavMenu();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const target =
      (returnFocusId ? document.getElementById(returnFocusId) : null) ??
      dialog.querySelector<HTMLElement>("[data-autofocus]");
    target?.focus();
  }, [isOpen, screen, returnFocusId]);

  // Escape fires "cancel"; route it through our state so everything resets together.
  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    closeMenu();
  }

  const Screen = SCREENS[screen];

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={label}
      onCancel={handleCancel}
    >
      {isOpen && <Screen />}
    </dialog>
  );
}

export default HeaderNavMenuDialog;
