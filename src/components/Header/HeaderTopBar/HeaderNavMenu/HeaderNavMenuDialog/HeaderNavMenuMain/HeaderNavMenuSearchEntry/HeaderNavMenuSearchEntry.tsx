import { SEARCH_LABELS } from "../../../../../../../content/headerControls";
import { SEARCH_FIELD_TRANSITION, useNavMenu } from "../../../navMenuContext";
import styles from "./HeaderNavMenuSearchEntry.module.scss";

// Looks like the search field and opens the search screen, where the real field sits in
// the header and the whole screen below is free for results.
function HeaderNavMenuSearchEntry() {
  const { itemId, openScreen } = useNavMenu();

  return (
    <button
      id={itemId("search")}
      className={styles.entry}
      style={{ viewTransitionName: SEARCH_FIELD_TRANSITION }}
      type="button"
      onClick={() => openScreen("search")}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.5 15.5 L21 21" />
      </svg>
      <span>{SEARCH_LABELS.placeholder}</span>
    </button>
  );
}

export default HeaderNavMenuSearchEntry;
