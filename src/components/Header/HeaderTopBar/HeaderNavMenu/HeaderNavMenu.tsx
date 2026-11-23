import { useCallback, useId, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";
import {
  LANGUAGE_LABELS,
  NAV_MENU_LABELS,
  SEARCH_LABELS,
  THEME_LABELS,
} from "../../../../content/headerControls";
import HeaderNavMenuButton from "./HeaderNavMenuButton/HeaderNavMenuButton";
import HeaderNavMenuDialog from "./HeaderNavMenuDialog/HeaderNavMenuDialog";
import {
  NavMenuContext,
  type NavMenuContextValue,
  type NavMenuScreenId,
} from "./navMenuContext";
import styles from "./HeaderNavMenu.module.scss";

const SCREEN_TITLES: Record<NavMenuScreenId, string> = {
  main: NAV_MENU_LABELS.title,
  search: SEARCH_LABELS.label,
  theme: THEME_LABELS.title,
  language: LANGUAGE_LABELS.title,
};

const TOP_LEVEL: readonly NavMenuScreenId[] = ["main"];

// Phone-only menu (hidden on wider screens by its own styles): a hamburger button that
// opens a full-screen dialog. The dialog drills down: picking an item on the top level
// moves it up into the header with a Back arrow, and the whole screen goes to that task.
// Owns the open state and the path of screens; children read it through NavMenuContext.
function HeaderNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState<readonly NavMenuScreenId[]>(TOP_LEVEL);
  // After going back, focus returns to the item that opened the screen we left.
  const [returnFocusId, setReturnFocusId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const idPrefix = useId();

  const itemId = useCallback(
    (screen: NavMenuScreenId) => `${idPrefix}-item-${screen}`,
    [idPrefix],
  );

  // Screen changes run as a view transition where supported: the picked item's title
  // morphs into the header. Reduced motion, or no support, swaps screens instantly.
  const changeScreen = useCallback(
    (update: () => void) => {
      if (reducedMotion || typeof document.startViewTransition !== "function") {
        update();
        return;
      }
      const transition = document.startViewTransition(() => flushSync(update));
      // A quick second tap skips the first animation (the update itself still runs);
      // that rejection is expected, not an error.
      transition.ready.catch(() => {});
    },
    [reducedMotion],
  );

  const openScreen = useCallback(
    (screen: NavMenuScreenId) =>
      changeScreen(() => {
        setReturnFocusId(null);
        setPath((current) => [...current, screen]);
      }),
    [changeScreen],
  );

  const goBack = useCallback(() => {
    if (path.length < 2) return;
    const leaving = path[path.length - 1];
    changeScreen(() => {
      setReturnFocusId(itemId(leaving));
      setPath(path.slice(0, -1));
    });
  }, [path, changeScreen, itemId]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setPath(TOP_LEVEL);
    setReturnFocusId(null);
  }, []);

  function openMenu() {
    setPath(TOP_LEVEL);
    setReturnFocusId(null);
    setIsOpen(true);
  }

  const screen = path[path.length - 1];
  const parent = path.length > 1 ? path[path.length - 2] : null;
  const context = useMemo<NavMenuContextValue>(
    () => ({
      screen,
      backLabel: parent ? NAV_MENU_LABELS.backTo(SCREEN_TITLES[parent]) : null,
      itemId,
      openScreen,
      goBack,
      closeMenu,
    }),
    [screen, parent, itemId, openScreen, goBack, closeMenu],
  );

  return (
    <div className={styles.navMenu}>
      <HeaderNavMenuButton
        label={NAV_MENU_LABELS.open}
        isOpen={isOpen}
        onOpen={openMenu}
      />
      <NavMenuContext value={context}>
        <HeaderNavMenuDialog
          label={NAV_MENU_LABELS.title}
          isOpen={isOpen}
          returnFocusId={returnFocusId}
        />
      </NavMenuContext>
    </div>
  );
}

export default HeaderNavMenu;
